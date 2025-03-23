import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Download, RefreshCw, Settings, Palette, Move, FileCode, Shield, Upload, Trash2, ImagePlus } from 'lucide-react';
import { ImageIcon } from 'lucide-react'; // Umbenannt um Konflikte zu vermeiden
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import ColorSchemeSelector from './ColorSchemeSelector';
import QRCodeTemplates from './QRCodeTemplates';
import TemplateFormFields from './TemplateFormFields';
import LogoConfigSection from './LogoConfigSection';
import { useTheme } from '@/context/ThemeContext';

// QRCode-Bibliothek vorab importieren, um Ladeprobleme zu vermeiden
import QRCode from 'qrcode';

/**
 * QR-Code Generator Komponente
 * 
 * Erlaubt es Benutzern, QR-Codes zu erstellen mit verschiedenen Vorlagen,
 * anpassbaren Farben, Größen und weiteren Optionen.
 * Mit Unterstützung für Dark Mode und Logo-Integration.
 */
const QRCodeGenerator = () => {
  // Theme context
  const { theme } = useTheme();
  
  // States für alle Einstellungen
  const [text, setText] = useState('https://example.com');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(200);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState('H'); // Default to High
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [qrInitialized, setQrInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState('templates'); // Standardtab auf Templates
  const [activeTemplateId, setActiveTemplateId] = useState(''); // ID des aktuell ausgewählten Templates
  
  // Logo-Integration States
  const [logo, setLogo] = useState(null); // Store logo as data URL
  const [logoSize, setLogoSize] = useState(20); // Logo size as percentage of QR code (10-40%)
  const [showLogo, setShowLogo] = useState(false); // Toggle for enabling/disabling logo
  const [logoShape, setLogoShape] = useState('roundedSquare'); // 'square', 'roundedSquare', 'circle'
  const [logoBackground, setLogoBackground] = useState('#FFFFFF'); // Background color for logo
  const [useCustomBackground, setUseCustomBackground] = useState(true); // Whether to use custom background
  
  // Neue States für SVG-Support
  const [logoType, setLogoType] = useState(null); // 'svg' oder 'raster'
  const [logoSvgContent, setLogoSvgContent] = useState(null); // Original SVG content
  
  // Ref für SVG-Container
  const svgRef = useRef(null);
  const qrDataRef = useRef(null); // Speichert die QR-Code-Daten für Styling
  
  // Initialisiere den QR-Code, wenn die Komponente gemountet wird
  useEffect(() => {
    // Warten, bis das DOM vollständig gerendert ist
    const timer = setTimeout(() => {
      if (svgRef.current) {
        setQrInitialized(true);
        generateQRCode();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // QR-Code generieren und rendern
  const generateQRCode = () => {
    if (!svgRef.current || !qrInitialized) {
      console.log("SVG-Ref ist noch nicht bereit oder QR nicht initialisiert");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      // If in dark mode and using default colors, consider adjusting for visibility
      let effectiveBgColor = bgColor;
      let effectiveFgColor = fgColor;
      
      // Optional: Adjust QR code for better visibility in dark mode
      // Only adjust if the user hasn't explicitly set custom colors
      if (theme === 'dark' && bgColor === '#ffffff' && fgColor === '#000000') {
        // Swap colors or adjust for better visibility in dark mode
        effectiveBgColor = '#2e2e2e';
        effectiveFgColor = '#ffffff';
      }
      
      // Force error correction to 'H' when logo is enabled
      const effectiveErrorLevel = showLogo && logo ? 'H' : errorCorrectionLevel;
      
      // QR-Code-Daten generieren
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
          console.error("Fehler bei der QR-Code Generierung:", err);
          setError("QR-Code konnte nicht generiert werden: " + err.message);
          setLoading(false);
          return;
        }
        
        // Überprüfen, ob ein Logo hinzugefügt werden soll
        if (showLogo && logo) {
          addLogoToQRCode(url);
        } else {
          // Jetzt rendern wir den QR-Code mit unserem eigenen Ansatz
          if (svgRef.current) {
            // QR-Code-Elemente mit abgerundeten Ecken erstellen
            renderQRCodeWithRoundedCorners(url);
          } else {
            console.error("svgRef.current ist null nach QR-Code-Generierung");
            setError("Fehler beim Rendern des QR-Codes");
          }
        }
        
        setLoading(false);
      });
    } catch (error) {
      console.error("Fehler beim Generieren des QR-Codes:", error);
      setError("QR-Code konnte nicht generiert werden: " + error.message);
      setLoading(false);
    }
  };

  // Logo zum QR-Code hinzufügen - verbesserte Version
  const addLogoToQRCode = (qrDataUrl) => {
    if (!svgRef.current) return;
    
    const logoImg = new Image();
    const qrImg = new Image();
    
    // Wenn beide Bilder geladen sind, kombinieren
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
      // Canvas erstellen, um QR und Logo zu kombinieren
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      // Zuerst den QR-Code zeichnen
      ctx.drawImage(qrImg, 0, 0, size, size);
      
      // Logo-Größe und Position berechnen
      const logoWidth = size * (logoSize / 100);
      const logoHeight = logoWidth;
      const logoX = (size - logoWidth) / 2;
      const logoY = (size - logoHeight) / 2;
      
      // Padding für das Logo, falls ein Hintergrund verwendet wird
      const padding = logoWidth * 0.1; // 10% der Logogröße als Padding
      
      // Hintergrund für das Logo zeichnen, wenn gewünscht
      if (useCustomBackground && logoBackground.toLowerCase() !== 'transparent') {
        ctx.save();
        
        // Hintergrundform basierend auf Auswahl
        if (logoShape === 'circle') {
          // Kreisförmiger Hintergrund
          ctx.beginPath();
          ctx.arc(logoX + logoWidth / 2, logoY + logoHeight / 2, logoWidth / 2 + padding, 0, Math.PI * 2);
          ctx.closePath();
          
          // Fülle mit der ausgewählten Farbe
          ctx.fillStyle = logoBackground;
          ctx.fill();
          
          // Optionaler leichter Schatten für bessere Sichtbarkeit
          ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
          ctx.shadowBlur = 5;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        } else if (logoShape === 'roundedSquare') {
          // Abgerundetes Quadrat als Hintergrund
          const borderRadius = logoWidth * 0.2; // 20% der Logogröße als Rundung
          
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
          
          // Fülle mit der ausgewählten Farbe
          ctx.fillStyle = logoBackground;
          ctx.fill();
          
          // Optionaler leichter Schatten für bessere Sichtbarkeit
          ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
          ctx.shadowBlur = 5;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        } else {
          // Einfaches Quadrat als Hintergrund
          ctx.fillStyle = logoBackground;
          ctx.fillRect(logoX - padding, logoY - padding, logoWidth + padding * 2, logoHeight + padding * 2);
        }
        
        ctx.restore();
      }
      
      // Logo mit entsprechender Form zeichnen
      ctx.save();
      
      if (logoShape === 'circle') {
        // Kreisförmiges Clipping-Pfad für das Logo
        ctx.beginPath();
        ctx.arc(logoX + logoWidth / 2, logoY + logoHeight / 2, logoWidth / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
      } else if (logoShape === 'roundedSquare') {
        // Abgerundetes Rechteck Clipping-Pfad
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
      
      // Logo zeichnen
      ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
      
      ctx.restore();
      
      // In Data-URL umwandeln und rendern
      const combinedDataUrl = canvas.toDataURL('image/png');
      renderQRCodeWithRoundedCorners(combinedDataUrl);
      
      // Die kombinierte Data-URL für Downloads speichern
      qrDataRef.current = {
        svgElement: null,
        dataUrl: combinedDataUrl
      };
    }).catch(err => {
      console.error('Fehler beim Kombinieren von QR-Code und Logo:', err);
      setError('Logo konnte nicht hinzugefügt werden: ' + err.message);
      // Fallback zum Rendern ohne Logo
      renderQRCodeWithRoundedCorners(qrDataUrl);
    });
  };

  // QR-Code rendern
  const renderQRCodeWithRoundedCorners = (dataUrl) => {
    if (!svgRef.current) return;
    
    // Container leeren
    svgRef.current.innerHTML = '';
    
    // Container für das Bild erstellen, um Proportionen zu wahren
    const container = document.createElement('div');
    container.style.width = `${size}px`;
    container.style.height = `${size}px`;
    container.style.maxWidth = '100%';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    
    // Bild mit korrekten Proportionen
    const img = document.createElement('img');
    img.src = dataUrl;
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';
    img.style.width = `${size}px`;
    img.style.height = `${size}px`;
    img.style.objectFit = 'contain'; // Ensures aspect ratio is maintained
    
    container.appendChild(img);
    svgRef.current.appendChild(container);
    
    // QR-Code-Daten speichern für Downloads
    qrDataRef.current = {
      svgElement: null,
      dataUrl: dataUrl
    };
  };

  // QR-Code bei Änderungen neu generieren
  useEffect(() => {
    if (!qrInitialized) return;
    
    const timer = setTimeout(() => {
      generateQRCode();
    }, 300); // Debounce-Verzögerung

    return () => clearTimeout(timer);
  }, [
    text, fgColor, bgColor, size, qrInitialized, errorCorrectionLevel, theme, 
    logo, logoSize, showLogo, logoShape, logoBackground, useCustomBackground
  ]);
  
  // Farbschema auswählen
  const handleSelectColorScheme = (newFgColor, newBgColor) => {
    setFgColor(newFgColor);
    setBgColor(newBgColor);
    // QR-Code wird automatisch aktualisiert durch den useEffect
  };
  
  // Template auswählen
  const handleSelectTemplate = (template) => {
    setText(template.content);
    setFgColor(template.fgColor);
    setBgColor(template.bgColor);
    setActiveTemplateId(template.id); // Template-ID speichern
    
    // Nach Template-Auswahl zum Content-Tab wechseln, um die Details anzupassen
    setActiveTab('content');
    
    // Feedback für den Benutzer
    setSuccessMessage(`Vorlage "${template.name}" wurde angewendet!`);
    setTimeout(() => setSuccessMessage(''), 2000);
  };
  
  // Aktualisieren des QR-Code-Inhalts aus den Formularfeldern
  const handleContentChangeFromFields = (newContent) => {
    setText(newContent);
  };
  
  // Als SVG herunterladen - robuste Version
  const downloadSVG = () => {
    if (!qrDataRef.current || !qrDataRef.current.dataUrl) {
      setError("Kein QR-Code zum Herunterladen vorhanden.");
      return;
    }
    
    try {
      // Standardmethode die in allen Browsern funktioniert verwenden
      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("width", size);
      svg.setAttribute("height", size);
      svg.setAttribute("xmlns", svgNS);
      
      const rect = document.createElementNS(svgNS, "rect");
      rect.setAttribute("width", "100%");
      rect.setAttribute("height", "100%");
      rect.setAttribute("fill", bgColor);
      svg.appendChild(rect);
      
      const image = document.createElementNS(svgNS, "image");
      image.setAttribute("href", qrDataRef.current.dataUrl);
      image.setAttribute("width", "100%");
      image.setAttribute("height", "100%");
      svg.appendChild(image);
      
      // SVG in String konvertieren
      const svgData = new XMLSerializer().serializeToString(svg);
      
      // Download
      const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
      const svgUrl = URL.createObjectURL(svgBlob);
      
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = 'qrcode.svg';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
      
      setSuccessMessage('SVG erfolgreich heruntergeladen!');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      console.error("Fehler beim SVG-Download:", err);
      setError("SVG konnte nicht heruntergeladen werden: " + err.message);
    }
  };
  
  // Als PNG herunterladen
  const downloadPNG = () => {
    if (!qrDataRef.current) {
      setError("Kein QR-Code zum Herunterladen vorhanden.");
      console.error("qrDataRef.current ist nicht initialisiert");
      return;
    }
    
    if (!qrDataRef.current.dataUrl) {
      setError("Keine QR-Code Daten vorhanden.");
      console.error("qrDataRef.current.dataUrl ist nicht verfügbar");
      return;
    }
    
    try {
      // Direkter Download der PNG, unabhängig vom cornerRadius
      const downloadLink = document.createElement('a');
      downloadLink.href = qrDataRef.current.dataUrl;
      downloadLink.download = 'qrcode.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      setSuccessMessage('PNG erfolgreich heruntergeladen!');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      console.error("Fehler beim PNG-Download:", err);
      setError("PNG konnte nicht heruntergeladen werden: " + err.message);
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col md:flex-row gap-6">
      {/* Steuerungselemente */}
      <Card className="w-full md:w-1/2 dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">QR-Code Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tabs für verschiedene Einstellungskategorien */}
          <Tabs className="w-full">
            <TabsList className="dark:border-gray-700">
              <TabsTrigger 
                active={activeTab === 'templates'} 
                onClick={() => setActiveTab('templates')}
                className="dark:text-gray-300 dark:hover:text-gray-100"
              >
                <FileCode className="w-4 h-4 mr-2" />
                Vorlagen
              </TabsTrigger>
              <TabsTrigger 
                active={activeTab === 'content'} 
                onClick={() => setActiveTab('content')}
                className="dark:text-gray-300 dark:hover:text-gray-100"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Inhalt
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
                Einstellungen
              </TabsTrigger>
            </TabsList>
            
            {/* Templates Tab */}
            <TabsContent active={activeTab === 'templates'}>
              <div className="space-y-4 pt-4">
                <QRCodeTemplates onSelectTemplate={handleSelectTemplate} />
                <div className="pt-2 mt-2 border-t dark:border-gray-700">
                  <p className="text-sm text-muted-foreground dark:text-gray-400 italic">
                    Tipp: Nach der Auswahl einer Vorlage kannst Du den Inhalt im "Inhalt"-Tab anpassen.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            {/* Inhalt Tab */}
            <TabsContent active={activeTab === 'content'}>
              <div className="space-y-4 pt-4">
                {activeTemplateId ? (
                  // Strukturierte Formularfelder für Templates
                  <TemplateFormFields 
                    templateId={activeTemplateId} 
                    initialContent={text}
                    onContentChange={handleContentChangeFromFields}
                  />
                ) : (
                  // Allgemeines Textfeld für freien Text
                  <div className="space-y-2">
                    <Label htmlFor="text" className="dark:text-gray-200">Text oder URL</Label>
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
                        setActiveTemplateId(''); // Template-Modus zurücksetzen
                      }}
                    > 
                      Zurück zum Freitext-Modus
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Design Tab */}
            <TabsContent active={activeTab === 'design'}>
              <div className="space-y-6 pt-4">
                {/* Farbschema-Auswahl */}
                <ColorSchemeSelector onSelectScheme={handleSelectColorScheme} />
                
                {/* Manuelle Farbeinstellungen */}
                <div className="border-t dark:border-gray-700 pt-4">
                  <h3 className="text-sm font-medium mb-4 dark:text-gray-200">Individuelle Farbeinstellungen</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fgColor" className="dark:text-gray-200">Vordergrundfarbe</Label>
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
                      <Label htmlFor="bgColor" className="dark:text-gray-200">Hintergrundfarbe</Label>
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
            
            {/* Einstellungen Tab */}
            <TabsContent active={activeTab === 'settings'}>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="size" className="dark:text-gray-200">Größe: {size}px</Label>
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
                    Aktualisieren
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Download-Optionen - immer sichtbar */}
          <div className="pt-4 border-t mt-4 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={downloadSVG} className="w-full" disabled={loading || !qrInitialized}>
                <Download className="w-4 h-4 mr-2" />
                SVG
              </Button>
              <Button onClick={downloadPNG} className="w-full" disabled={loading || !qrInitialized}>
                <Download className="w-4 h-4 mr-2" />
                PNG
              </Button>
            </div>
            
            {logoType === 'svg' && showLogo && logo && (
              <div className="mt-2 p-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded">
                <p>Hinweis: SVG-Logos verlieren derzeit im Export ihre Vektoreigenschaften aufgrund technischer Einschränkungen bei SVG-in-SVG-Einbettung.</p>
              </div>
            )}
          </div>
          
          {/* Fehlermeldungen und Erfolgsmeldungen */}
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
      
      {/* Vorschau */}
      <Card className="w-full md:w-1/2 dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">Vorschau</CardTitle>
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
                {!qrInitialized && <p className="text-gray-400 dark:text-gray-500">QR-Code wird geladen...</p>}
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
                        Fehlerkorrektur Level {showLogo && logo ? 'H' : errorCorrectionLevel}
                        {showLogo && logo && errorCorrectionLevel !== 'H' && ' (automatisch)'}
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
                      'Höchste Fehlerkorrektur aktiviert für Logo-Integration.' :
                      errorCorrectionLevel === 'L' ? 
                        'Geringere Fehlerkorrektur, ideal für saubere Umgebungen.' :
                      errorCorrectionLevel === 'M' ? 
                        'Ausgewogene Fehlerkorrektur für allgemeine Anwendungen.' :
                      errorCorrectionLevel === 'Q' ? 
                        'Verbesserte Fehlerkorrektur, gut für Außenbereiche.' :
                        'Höchste Fehlerkorrektur, ideal wenn der QR-Code beschädigt werden könnte.'}
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