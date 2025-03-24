import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { RefreshCw, Settings, Palette, FileCode, Shield } from 'lucide-react';
import { ImageIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import ColorSchemeSelector from './ColorSchemeSelector';
import QRCodeTemplates from './QRCodeTemplates';
import TemplateFormFields from './TemplateFormFields';
import LogoConfigSection from './LogoConfigSection';
import { useTheme } from '@/context/ThemeContext';
import { 
  exportAsPNG, 
  exportAsJPEG, 
  exportAsSVG, 
  exportAsWebP, 
  exportAsPDF, 
  exportAsHTMLSnippet, 
  exportAsDataURL,
  copyDataURLToClipboard
} from '@/lib/qrExportUtils';
import TabbedExportPanel from './TabbedExportPanel';

// Import QRCode library in advance to avoid loading issues
import QRCode from 'qrcode';

/**
 * QR Code Generator Component
 * 
 * Allows users to create QR codes with various templates,
 * customizable colors, sizes, and other options.
 * With support for dark mode and logo integration.
 * Enhanced with multiple export formats.
 */
const QRCodeGenerator = () => {
  // Theme context
  const { theme } = useTheme();
  
  // States for all settings
  const [text, setText] = useState('https://example.com');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(200);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState('H'); // Default to High
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [qrInitialized, setQrInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState('templates'); // Default tab to Templates
  const [activeTemplateId, setActiveTemplateId] = useState(''); // ID of the currently selected template
  
  // Logo integration states
  const [logo, setLogo] = useState(null); // Store logo as data URL
  const [logoSize, setLogoSize] = useState(20); // Logo size as percentage of QR code (10-40%)
  const [showLogo, setShowLogo] = useState(false); // Toggle for enabling/disabling logo
  const [logoShape, setLogoShape] = useState('roundedSquare'); // 'square', 'roundedSquare', 'circle'
  const [logoBackground, setLogoBackground] = useState('#FFFFFF'); // Background color for logo
  const [useCustomBackground, setUseCustomBackground] = useState(true); // Whether to use custom background
  
  // New states for SVG support
  const [logoType, setLogoType] = useState(null); // 'svg' or 'raster'
  const [logoSvgContent, setLogoSvgContent] = useState(null); // Original SVG content
  
  // Ref for SVG container
  const svgRef = useRef(null);
  const qrDataRef = useRef(null); // Stores the QR code data for styling
  
  // Initialize the QR code when the component is mounted
  useEffect(() => {
    // Wait until the DOM is fully rendered
    const timer = setTimeout(() => {
      if (svgRef.current) {
        setQrInitialized(true);
        generateQRCode();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Generate and render QR code
  const generateQRCode = () => {
    if (!svgRef.current || !qrInitialized) {
      console.log("SVG ref is not ready or QR not initialized");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      // If in dark mode and using default colors, consider adjusting for visibility
      let effectiveBgColor = bgColor;
      let effectiveFgColor = fgColor;
      
      // Adjust QR code for better visibility in dark mode
      // Only adjust if the user hasn't explicitly set custom colors
      if (theme === 'dark' && bgColor === '#ffffff' && fgColor === '#000000') {
        // Swap colors or adjust for better visibility in dark mode
        effectiveBgColor = '#2e2e2e';
        effectiveFgColor = '#ffffff';
      }
      
      // Force error correction to 'H' when logo is enabled
      const effectiveErrorLevel = showLogo && logo ? 'H' : errorCorrectionLevel;
      
      // Generate QR code data
      QRCode.toDataURL(text || 'https://example.com', {
        errorCorrectionLevel: effectiveErrorLevel,
        margin: 1,
        width: size,
        color: {
          dark: effectiveFgColor,
          light: effectiveBgColor
        }
      }, (err, url) => {
        if (err) {
          console.error("Error generating QR code:", err);
          setError("QR code could not be generated: " + err.message);
          setLoading(false);
          return;
        }
        
        // Check if a logo should be added
        if (showLogo && logo) {
          addLogoToQRCode(url);
        } else {
          // Now we render the QR code with our own approach
          if (svgRef.current) {
            // Create QR code elements with rounded corners
            renderQRCodeWithRoundedCorners(url);
          } else {
            console.error("svgRef.current is null after QR code generation");
            setError("Error rendering QR code");
          }
        }
        
        setLoading(false);
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
      setError("QR code could not be generated: " + error.message);
      setLoading(false);
    }
  };

  // Add logo to QR code
  const addLogoToQRCode = (qrDataUrl) => {
    if (!svgRef.current) return;
    
    const logoImg = new Image();
    const qrImg = new Image();
    
    // When both images are loaded, combine them
    Promise.all([
      new Promise(resolve => {
        logoImg.onload = resolve;
        logoImg.src = logo;
      }),
      new Promise(resolve => {
        qrImg.onload = resolve;
        qrImg.src = qrDataUrl;
      })
    ]).then(() => {
      // Create canvas to combine QR and logo
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      // First draw the QR code
      ctx.drawImage(qrImg, 0, 0, size, size);
      
      // Calculate logo size and position
      const logoWidth = size * (logoSize / 100);
      const logoHeight = logoWidth;
      const logoX = (size - logoWidth) / 2;
      const logoY = (size - logoHeight) / 2;
      
      // Padding for the logo if a background is used
      const padding = logoWidth * 0.1; // 10% of logo size as padding
      
      // Draw background for the logo if desired
      if (useCustomBackground && logoBackground.toLowerCase() !== 'transparent') {
        ctx.save();
        
        // Background shape based on selection
        if (logoShape === 'circle') {
          // Circular background
          ctx.beginPath();
          ctx.arc(logoX + logoWidth / 2, logoY + logoHeight / 2, logoWidth / 2 + padding, 0, Math.PI * 2);
          ctx.closePath();
          
          // Fill with selected color
          ctx.fillStyle = logoBackground;
          ctx.fill();
          
          // Optional light shadow for better visibility
          ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
          ctx.shadowBlur = 5;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        } else if (logoShape === 'roundedSquare') {
          // Rounded square as background
          const borderRadius = logoWidth * 0.2; // 20% of logo size as rounding
          
          ctx.beginPath();
          ctx.moveTo(logoX - padding + borderRadius, logoY - padding);
          ctx.lineTo(logoX + logoWidth + padding - borderRadius, logoY - padding);
          ctx.quadraticCurveTo(logoX + logoWidth + padding, logoY - padding, logoX + logoWidth + padding, logoY - padding + borderRadius);
          ctx.lineTo(logoX + logoWidth + padding, logoY + logoHeight + padding - borderRadius);
          ctx.quadraticCurveTo(logoX + logoWidth + padding, logoY + logoHeight + padding, logoX + logoWidth + padding - borderRadius, logoY + logoHeight + padding);
          ctx.lineTo(logoX - padding + borderRadius, logoY + logoHeight + padding);
          ctx.quadraticCurveTo(logoX - padding, logoY + logoHeight + padding, logoX - padding, logoY + logoHeight + padding - borderRadius);
          ctx.lineTo(logoX - padding, logoY - padding + borderRadius);
          ctx.quadraticCurveTo(logoX - padding, logoY - padding, logoX - padding + borderRadius, logoY - padding);
          ctx.closePath();
          
          // Fill with selected color
          ctx.fillStyle = logoBackground;
          ctx.fill();
          
          // Optional light shadow for better visibility
          ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
          ctx.shadowBlur = 5;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        } else {
          // Simple square as background
          ctx.fillStyle = logoBackground;
          ctx.fillRect(logoX - padding, logoY - padding, logoWidth + padding * 2, logoHeight + padding * 2);
        }
        
        ctx.restore();
      }
      
      // Draw logo with appropriate shape
      ctx.save();
      
      if (logoShape === 'circle') {
        // Circular clipping path for the logo
        ctx.beginPath();
        ctx.arc(logoX + logoWidth / 2, logoY + logoHeight / 2, logoWidth / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
      } else if (logoShape === 'roundedSquare') {
        // Rounded rectangle clipping path
        const borderRadius = logoWidth * 0.2;
        
        ctx.beginPath();
        ctx.moveTo(logoX + borderRadius, logoY);
        ctx.lineTo(logoX + logoWidth - borderRadius, logoY);
        ctx.quadraticCurveTo(logoX + logoWidth, logoY, logoX + logoWidth, logoY + borderRadius);
        ctx.lineTo(logoX + logoWidth, logoY + logoHeight - borderRadius);
        ctx.quadraticCurveTo(logoX + logoWidth, logoY + logoHeight, logoX + logoWidth - borderRadius, logoY + logoHeight);
        ctx.lineTo(logoX + borderRadius, logoY + logoHeight);
        ctx.quadraticCurveTo(logoX, logoY + logoHeight, logoX, logoY + logoHeight - borderRadius);
        ctx.lineTo(logoX, logoY + borderRadius);
        ctx.quadraticCurveTo(logoX, logoY, logoX + borderRadius, logoY);
        ctx.closePath();
        ctx.clip();
      }
      
      // Draw logo
      ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
      
      ctx.restore();
      
      // Convert to data URL and render
      const combinedDataUrl = canvas.toDataURL('image/png');
      renderQRCodeWithRoundedCorners(combinedDataUrl);
      
      // Save the combined data URL for downloads
      qrDataRef.current = {
        svgElement: null,
        dataUrl: combinedDataUrl
      };
    }).catch(err => {
      console.error('Error combining QR code and logo:', err);
      setError('Logo could not be added: ' + err.message);
      // Fallback to rendering without logo
      renderQRCodeWithRoundedCorners(qrDataUrl);
    });
  };

  // Render QR code
  const renderQRCodeWithRoundedCorners = (dataUrl) => {
    if (!svgRef.current) return;
    
    // Clear container
    svgRef.current.innerHTML = '';
    
    // Create container for the image to maintain proportions
    const container = document.createElement('div');
    container.style.width = `${size}px`;
    container.style.height = `${size}px`;
    container.style.maxWidth = '100%';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    
    // Image with correct proportions
    const img = document.createElement('img');
    img.src = dataUrl;
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';
    img.style.width = `${size}px`;
    img.style.height = `${size}px`;
    img.style.objectFit = 'contain';
    
    container.appendChild(img);
    svgRef.current.appendChild(container);
    
    // Store QR code data for downloads
    qrDataRef.current = {
      svgElement: null,
      dataUrl: dataUrl
    };
  };

  // Regenerate QR code when changes occur
  useEffect(() => {
    if (!qrInitialized) return;
    
    const timer = setTimeout(() => {
      generateQRCode();
    }, 300); // Debounce delay

    return () => clearTimeout(timer);
  }, [
    text, fgColor, bgColor, size, qrInitialized, errorCorrectionLevel, theme, 
    logo, logoSize, showLogo, logoShape, logoBackground, useCustomBackground
  ]);
  
  // Select color scheme
  const handleSelectColorScheme = (newFgColor, newBgColor) => {
    setFgColor(newFgColor);
    setBgColor(newBgColor);
  };
  
  // Select template
  const handleSelectTemplate = (template) => {
    setText(template.content);
    setFgColor(template.fgColor);
    setBgColor(template.bgColor);
    setActiveTemplateId(template.id); // Save template ID
    
    // After template selection, switch to Content tab to adjust details
    setActiveTab('content');
    
    // Feedback for user
    setSuccessMessage(`Template "${template.name}" applied!`);
    setTimeout(() => setSuccessMessage(''), 2000);
  };
  
  // Update QR code content from form fields
  const handleContentChangeFromFields = (newContent) => {
    setText(newContent);
  };
  
  // Handle export based on format selection
  const handleExport = async (format) => {
    if (!qrInitialized || !qrDataRef.current) {
      setError("QR code is not fully initialized.");
      return;
    }
    
    setLoading(true);
    
    try {
      // Get effective error correction level
      const effectiveErrorLevel = showLogo && logo ? 'H' : errorCorrectionLevel;
      
      // Get effective colors
      let effectiveBgColor = bgColor;
      let effectiveFgColor = fgColor;
      
      // Adjust for dark mode if using default colors
      if (theme === 'dark' && bgColor === '#ffffff' && fgColor === '#000000') {
        effectiveBgColor = '#2e2e2e';
        effectiveFgColor = '#ffffff';
      }
      
      // Prepare common export options
      const exportOptions = {
        text: text || 'https://example.com',
        size: size,
        fgColor: effectiveFgColor,
        bgColor: effectiveBgColor,
        errorCorrectionLevel: effectiveErrorLevel,
        showLogo: showLogo,
        logo: logo,
        logoSize: logoSize,
        logoShape: logoShape,
        logoBackground: logoBackground,
        useCustomBackground: useCustomBackground,
        logoType: logoType,
        logoSvgContent: logoSvgContent,
        qrDataUrl: qrDataRef.current.dataUrl
      };
      
      // Handle export based on format
      let success = false;
      
      switch (format) {
        case 'svg':
          success = await exportAsSVG(exportOptions);
          break;
        case 'png':
          success = await exportAsPNG(exportOptions);
          break;
        case 'jpeg':
          success = await exportAsJPEG(exportOptions);
          break;
        case 'webp':
          success = await exportAsWebP(exportOptions);
          break;
        case 'pdf':
          success = await exportAsPDF(exportOptions);
          break;
        case 'html':
          success = await exportAsHTMLSnippet(exportOptions);
          break;
        case 'dataurl':
          success = await exportAsDataURL(exportOptions);
          break;
        case 'clipboard':
          success = await copyDataURLToClipboard(exportOptions);
          break;
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
      
      if (success) {
        setSuccessMessage(`${format.toUpperCase()} export successful!`);
        setTimeout(() => setSuccessMessage(''), 2000);
      }
    } catch (err) {
      console.error(`Error during ${format} export:`, err);
      setError(`${format.toUpperCase()} export failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col md:flex-row gap-6">
      {/* Controls */}
      <Card className="w-full md:w-1/2 dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">QR Code Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tabs for different setting categories */}
          <Tabs className="w-full">
            <TabsList className="dark:border-gray-700">
              <TabsTrigger 
                active={activeTab === 'templates'} 
                onClick={() => setActiveTab('templates')}
                className="dark:text-gray-300 dark:hover:text-gray-100"
              >
                <FileCode className="w-4 h-4 mr-2" />
                Templates
              </TabsTrigger>
              <TabsTrigger 
                active={activeTab === 'content'} 
                onClick={() => setActiveTab('content')}
                className="dark:text-gray-300 dark:hover:text-gray-100"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Content
              </TabsTrigger>
              <TabsTrigger 
                active={activeTab === 'design'} 
                onClick={() => setActiveTab('design')}
                className="dark:text-gray-300 dark:hover:text-gray-100"
              >
                <Palette className="w-4 h-4 mr-2" />
                Design
              </TabsTrigger>
              <TabsTrigger 
                active={activeTab === 'settings'} 
                onClick={() => setActiveTab('settings')}
                className="dark:text-gray-300 dark:hover:text-gray-100"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            {/* Templates Tab */}
            <TabsContent active={activeTab === 'templates'}>
              <div className="space-y-4 pt-4">
                <QRCodeTemplates onSelectTemplate={handleSelectTemplate} />
                <div className="pt-2 mt-2 border-t dark:border-gray-700">
                  <p className="text-sm text-muted-foreground dark:text-gray-400 italic">
                    Tip: After selecting a template, you can customize the content in the "Content" tab.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            {/* Content Tab */}
            <TabsContent active={activeTab === 'content'}>
              <div className="space-y-4 pt-4">
                {activeTemplateId ? (
                  // Structured form fields for templates
                  <TemplateFormFields 
                    templateId={activeTemplateId} 
                    initialContent={text}
                    onContentChange={handleContentChangeFromFields}
                  />
                ) : (
                  // General text field for free text
                  <div className="space-y-2">
                    <Label htmlFor="text" className="dark:text-gray-200">Text or URL</Label>
                    <Input 
                      id="text" 
                      value={text} 
                      onChange={(e) => setText(e.target.value)} 
                      placeholder="https://example.com"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                    />
                  </div>
                )}
                
                {activeTemplateId && (
                  <div className="pt-2 mt-4 border-t dark:border-gray-700">
                    <Button 
                      variant="outline" 
                      className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600" 
                      onClick={() => {
                        setActiveTemplateId(''); // Reset template mode
                      }}
                    > 
                      Back to free text mode
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Design Tab */}
            <TabsContent active={activeTab === 'design'}>
              <div className="space-y-6 pt-4">
                {/* Color scheme selection */}
                <ColorSchemeSelector onSelectScheme={handleSelectColorScheme} />
                
                {/* Manual color settings */}
                <div className="border-t dark:border-gray-700 pt-4">
                  <h3 className="text-sm font-medium mb-4 dark:text-gray-200">Custom Color Settings</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fgColor" className="dark:text-gray-200">Foreground Color</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="fgColor" 
                          type="color" 
                          value={fgColor} 
                          onChange={(e) => setFgColor(e.target.value)} 
                          className="w-12 h-10 p-1 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <Input 
                          value={fgColor} 
                          onChange={(e) => setFgColor(e.target.value)} 
                          className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bgColor" className="dark:text-gray-200">Background Color</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="bgColor" 
                          type="color" 
                          value={bgColor} 
                          onChange={(e) => setBgColor(e.target.value)} 
                          className="w-12 h-10 p-1 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <Input 
                          value={bgColor} 
                          onChange={(e) => setBgColor(e.target.value)} 
                          className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Logo Upload */}
                <div className="border-t dark:border-gray-700 pt-4 mt-4">
                  <LogoConfigSection 
                    logo={logo}
                    setLogo={setLogo}
                    logoSize={logoSize}
                    setLogoSize={setLogoSize}
                    showLogo={showLogo}
                    setShowLogo={setShowLogo}
                    logoShape={logoShape}
                    setLogoShape={setLogoShape}
                    logoBackground={logoBackground}
                    setLogoBackground={setLogoBackground}
                    useCustomBackground={useCustomBackground}
                    setUseCustomBackground={setUseCustomBackground}
                    errorCorrectionLevel={errorCorrectionLevel}
                    setErrorCorrectionLevel={setErrorCorrectionLevel}
                    logoType={logoType}
                    setLogoType={setLogoType}
                    logoSvgContent={logoSvgContent}
                    setLogoSvgContent={setLogoSvgContent}
                  />
                </div>
              </div>
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent active={activeTab === 'settings'}>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="size" className="dark:text-gray-200">Size: {size}px</Label>
                  <Slider
                    id="size"
                    min={100}
                    max={400}
                    step={10}
                    value={[size]}
                    onValueChange={(value) => setSize(value[0])}
                    className="py-4"
                  />
                </div>
                
                <div className="pt-2">
                  <Button onClick={generateQRCode} className="w-full" disabled={loading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Enhanced Export options */}
          <div className="pt-4 border-t mt-4 dark:border-gray-700">
            <TabbedExportPanel 
              onExport={handleExport}
              disabled={loading || !qrInitialized}
            />
          </div>   
          {/* Error and success messages */}
          {error && (
            <div className="p-3 rounded bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-sm">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="p-3 rounded bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 text-sm">
              {successMessage}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Preview */}
      <Card className="w-full md:w-1/2 dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">Preview</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-64">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400 dark:text-gray-500" />
            </div>
          ) : (
            <>
              <div 
                ref={svgRef} 
                className="flex items-center justify-center p-4 rounded border border-gray-200 dark:border-gray-700 w-full overflow-hidden"
                style={{ 
                  backgroundColor: bgColor,
                  minHeight: `${Math.max(208, size)}px` // Ensures container grows with QR code size
                }}
              >
                {!qrInitialized && <p className="text-gray-400 dark:text-gray-500">Loading QR code...</p>}
              </div>
              
              {/* Enhanced Error Correction Level Card */}
              <div className="w-full mt-3">
                <div className="bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-md p-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Shield className={`w-5 h-5 ${
                        errorCorrectionLevel === 'L' ? 'text-red-500' :     
                        errorCorrectionLevel === 'M' ? 'text-yellow-500' :  
                        errorCorrectionLevel === 'Q' ? 'text-green-400' :   
                        'text-green-700'                                   
                      }`} />
                      <span className="font-medium text-sm dark:text-gray-200">
                        Error Correction Level {showLogo && logo ? 'H' : errorCorrectionLevel}
                        {showLogo && logo && errorCorrectionLevel !== 'H' && ' (automatic)'}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      (showLogo && logo) || errorCorrectionLevel === 'H' ? 
                        'bg-green-200 text-green-900 dark:bg-green-900/70 dark:text-green-300' :
                      errorCorrectionLevel === 'L' ? 
                        'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
                      errorCorrectionLevel === 'M' ? 
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                        'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                    }`}>  
                      {(showLogo && logo) || errorCorrectionLevel === 'H' ? '30%' :
                      errorCorrectionLevel === 'L' ? '7%' :
                      errorCorrectionLevel === 'M' ? '15%' : '25%'}
                    </span>
                  </div>
                  <p className="text-xs mt-1 text-gray-600 dark:text-gray-300">
                    {(showLogo && logo) ? 
                      'Highest error correction activated for logo integration.' :
                      errorCorrectionLevel === 'L' ? 
                        'Lower error correction, ideal for clean environments.' :
                      errorCorrectionLevel === 'M' ? 
                        'Balanced error correction for general applications.' :
                      errorCorrectionLevel === 'Q' ? 
                        'Enhanced error correction, good for outdoor use.' :
                        'Highest error correction, ideal when QR code might get damaged.'}
                  </p>
                  <div className="flex mt-2 gap-1">
                    {['L', 'M', 'Q', 'H'].map(level => (
                      <button
                        key={level}
                        className={`text-xs px-2 py-0.5 rounded transition-colors ${
                          (showLogo && logo && level === 'H') || 
                          (!showLogo && level === errorCorrectionLevel) 
                            ? 'bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground font-medium' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        } ${showLogo && logo && level !== 'H' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => !showLogo && setErrorCorrectionLevel(level)}
                        disabled={showLogo && logo && level !== 'H'}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeGenerator;