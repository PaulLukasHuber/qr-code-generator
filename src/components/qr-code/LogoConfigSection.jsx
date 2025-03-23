import React, { useRef, useState } from 'react';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { ImagePlus, X, Shield, Trash2, AlertTriangle, Square, Circle, CheckSquare } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

/**
 * Enhanced Logo configuration component with improved styling options
 * and SVG support
 */
const LogoConfigSection = ({ 
  logo, 
  setLogo, 
  logoSize, 
  setLogoSize, 
  showLogo, 
  setShowLogo,
  logoShape,
  setLogoShape,
  logoBackground,
  setLogoBackground,
  useCustomBackground,
  setUseCustomBackground,
  errorCorrectionLevel,
  setErrorCorrectionLevel,
  // New props for SVG support
  logoType,
  setLogoType,
  logoSvgContent,
  setLogoSvgContent
}) => {
  const fileInputRef = useRef(null);

  // Handle logo file upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Only accept image files
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
  
    // Check if it's an SVG file
    const isSvg = file.type === 'image/svg+xml';
    
    const reader = new FileReader();
    
    if (isSvg) {
      // For SVG files, read the text content
      reader.onload = (event) => {
        const svgContent = event.target.result;
        setLogoType('svg');
        setLogoSvgContent(svgContent);
        
        // Also create a data URL for the preview
        const dataUrl = URL.createObjectURL(file);
        setLogo(dataUrl);
        
        // Update UI states
        setShowLogo(true);
        if (errorCorrectionLevel !== 'H') {
          setErrorCorrectionLevel('H');
        }
        
        // Display success message
        console.log('SVG logo loaded successfully');
      };
      reader.readAsText(file);
    } else {
      // For all other image types, proceed as before
      reader.onload = (event) => {
        setLogoType('raster');
        setLogoSvgContent(null);
        setLogo(event.target.result);
        
        // Update UI states
        setShowLogo(true);
        if (errorCorrectionLevel !== 'H') {
          setErrorCorrectionLevel('H');
        }
      };
      reader.readAsDataURL(file);
    }
    
    // Reset file input value
    e.target.value = '';
  };

  // Reset logo
  const handleRemoveLogo = () => {
    setLogo(null);
    setLogoType(null);
    setLogoSvgContent(null);
    setShowLogo(false);
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base font-medium dark:text-gray-200">Logo Integration</Label>
        <Switch 
          checked={showLogo} 
          onCheckedChange={setShowLogo}
          disabled={!logo}
        />
      </div>

      {/* Logo upload area */}
      <div className="flex flex-col gap-4">
        {!logo ? (
          <div 
            className="border-2 border-dashed dark:border-gray-700 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            onClick={triggerFileInput}
          >
            <ImagePlus className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Click here to upload a logo
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
              Recommended: PNG or SVG with transparent background
            </p>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
          </div>
        ) : (
          <div className="rounded-md border dark:border-gray-700 overflow-hidden">
            <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
              <span className="text-sm font-medium dark:text-gray-200">
                Uploaded Logo {logoType === 'svg' ? '(SVG)' : ''}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveLogo}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 flex justify-center bg-white dark:bg-gray-900">
              <div 
                className={`w-20 h-20 relative flex items-center justify-center ${
                  logoShape === 'circle' ? 'rounded-full' : 
                  logoShape === 'roundedSquare' ? 'rounded-lg' : ''
                } ${useCustomBackground ? 'p-1' : ''}`}
                style={useCustomBackground ? { backgroundColor: logoBackground } : {}}
              >
                <img
                  src={logo}
                  alt="Uploaded logo"
                  className={`w-full h-full object-contain ${
                    logoShape === 'circle' ? 'rounded-full' : 
                    logoShape === 'roundedSquare' ? 'rounded-lg' : ''
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Logo customization options */}
        {logo && showLogo && (
          <div className="space-y-4">
            {/* Logo size slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="logo-size" className="text-sm dark:text-gray-200">Logo Size: {logoSize}%</Label>
                {logoSize > 30 && (
                  <div className="flex items-center text-amber-500 text-xs gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Large logos may affect readability</span>
                  </div>
                )}
              </div>
              <Slider
                id="logo-size"
                min={10}
                max={40}
                step={1}
                value={[logoSize]}
                onValueChange={(value) => setLogoSize(value[0])}
                className="py-4"
              />
            </div>

            {/* Logo shape selection */}
            <div className="space-y-2">
              <Label htmlFor="logo-shape" className="text-sm dark:text-gray-200">Logo Shape</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={logoShape === 'square' ? 'default' : 'outline'}
                  className="flex-1 flex items-center justify-center gap-2 dark:border-gray-600"
                  onClick={() => setLogoShape('square')}
                >
                  <Square className="h-4 w-4" />
                  <span>Square</span>
                </Button>
                <Button
                  type="button"
                  variant={logoShape === 'roundedSquare' ? 'default' : 'outline'}
                  className="flex-1 flex items-center justify-center gap-2 dark:border-gray-600"
                  onClick={() => setLogoShape('roundedSquare')}
                >
                  <CheckSquare className="h-4 w-4" />
                  <span>Rounded</span>
                </Button>
                <Button
                  type="button"
                  variant={logoShape === 'circle' ? 'default' : 'outline'}
                  className="flex-1 flex items-center justify-center gap-2 dark:border-gray-600"
                  onClick={() => setLogoShape('circle')}
                >
                  <Circle className="h-4 w-4" />
                  <span>Circle</span>
                </Button>
              </div>
            </div>

            {/* Logo background options */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm dark:text-gray-200">Customize Background</Label>
                <Switch 
                  checked={useCustomBackground} 
                  onCheckedChange={setUseCustomBackground}
                />
              </div>
              
              {useCustomBackground && (
                <div className="flex gap-2 mt-2">
                  <Input 
                    type="color" 
                    value={logoBackground} 
                    onChange={(e) => setLogoBackground(e.target.value)} 
                    className="w-12 h-10 p-1 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <Input 
                    value={logoBackground} 
                    onChange={(e) => setLogoBackground(e.target.value)} 
                    className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    placeholder="e.g. #FFFFFF or transparent"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error correction notice */}
        {logo && (
          <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-3 text-sm flex items-start gap-2">
            <Shield className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-700 dark:text-blue-300 font-medium">QR Code with Logo</p>
              <p className="text-blue-600 dark:text-blue-400 mt-1">
                When using a logo, the highest error correction level (H) is automatically 
                activated to ensure readability.
              </p>
              {logoType === 'svg' && (
                <p className="text-blue-600 dark:text-blue-400 mt-1">
                  Your SVG logo will be properly embedded as vector graphics in SVG exports,
                  ensuring perfect quality at any scale.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogoConfigSection;