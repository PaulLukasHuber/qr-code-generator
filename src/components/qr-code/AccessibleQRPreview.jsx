import React, { useRef, useEffect, useState } from 'react';
import { useAccessibility } from '@/context/AccessibilityContext';
import { Button } from '../ui/button';
import { Info, RefreshCw } from 'lucide-react';

/**
 * AccessibleQRPreview - Enhanced QR code preview with accessibility features
 * Provides screen reader descriptions, keyboard support, and additional context
 * 
 * @param {Object} props Component props
 * @param {React.RefObject} props.svgRef Reference to the SVG container
 * @param {boolean} props.loading Indicates if the QR code is loading
 * @param {string} props.qrContent Text content of the QR code
 * @param {string} props.qrType Type of QR code (website, wifi, contact, etc.)
 * @param {string} props.errorCorrectionLevel QR code error correction level (L, M, Q, H)
 */
const AccessibleQRPreview = ({ 
  svgRef, 
  loading, 
  qrContent, 
  qrType = 'general',
  errorCorrectionLevel,
  size,
  bgColor,
  qrInitialized
}) => {
  const { announce } = useAccessibility();
  const [showInfo, setShowInfo] = useState(false);
  const previewRef = useRef(null);
  
  // Announce when QR code is generated or updated
  useEffect(() => {
    if (!loading && svgRef.current) {
      const contentPreview = qrContent.length > 30 
        ? qrContent.substring(0, 30) + '...' 
        : qrContent;
        
      announce(`QR code generated for ${qrType} content: ${contentPreview}`, false);
    }
  }, [loading, qrContent, qrType, announce]);
  
  // Get descriptive text for QR type
  const getQrTypeDescription = () => {
    switch (qrType) {
      case 'website':
        return 'Website URL';
      case 'wifi':
        return 'Wi-Fi credentials';
      case 'contact':
        return 'Contact information';
      case 'email':
        return 'Email address';
      case 'payment':
        return 'Cryptocurrency payment';
      case 'location':
        return 'Geographic location';
      case 'event':
        return 'Calendar event';
      case 'sms':
        return 'SMS message';
      case 'app':
        return 'App download';
      default:
        return 'Text content';
    }
  };
  
  // Get description for the QR error correction level
  const getErrorCorrectionDescription = () => {
    switch (errorCorrectionLevel) {
      case 'L':
        return 'Low (7% error correction)';
      case 'M':
        return 'Medium (15% error correction)';
      case 'Q':
        return 'Quartile (25% error correction)';
      case 'H':
        return 'High (30% error correction)';
      default:
        return 'Unknown error correction';
    }
  };
  
  // Toggle QR code information panel
  const toggleInfo = () => {
    setShowInfo(!showInfo);
    if (!showInfo) {
      announce('QR code information panel opened');
    }
  };
  
  return (
    <div 
      className="flex flex-col items-center"
      ref={previewRef}
      tabIndex="0"
      aria-label={`QR code preview for ${getQrTypeDescription()}`}
      role="img"
    >
      {/* Hidden descriptive text for screen readers */}
      <div className="sr-only">
        <p>QR code containing {getQrTypeDescription()}: {qrContent}</p>
        <p>Error correction level: {getErrorCorrectionDescription()}</p>
        <p>QR code size: {size} pixels</p>
      </div>
      
      {/* Actual QR code display */}
      <div
        className="mb-4 rounded border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-center w-full overflow-hidden"
        style={{ backgroundColor: bgColor || 'white', minHeight: `${Math.max(208, size)}px` }}
        aria-hidden="true" // Screen readers should use the descriptive text above instead
      >
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400 dark:text-gray-500" />
          </div>
        ) : (
          <div ref={svgRef} className="w-full h-full flex items-center justify-center">
            {!qrInitialized && <p className="text-gray-400 dark:text-gray-500">Loading QR code...</p>}
          </div>
        )}
      </div>
      
      {/* Info button and panel */}
      <div className="w-full relative">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleInfo}
          className="absolute -top-12 right-2 dark:bg-gray-700 dark:border-gray-600"
          aria-expanded={showInfo}
          aria-label="QR code information"
        >
          <Info className="w-4 h-4 mr-1" />
          <span>Info</span>
        </Button>
        
        {showInfo && (
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-md">
            <h3 className="font-medium text-sm mb-2 dark:text-gray-200">QR Code Information</h3>
            <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
              <li><strong>Type:</strong> {getQrTypeDescription()}</li>
              <li><strong>Error Correction:</strong> {getErrorCorrectionDescription()}</li>
              <li><strong>Size:</strong> {size} x {size} pixels</li>
              <li className="mt-2 text-xs italic">
                This QR code can be scanned with a smartphone camera or QR code scanner app.
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessibleQRPreview;