import React, { useState, useRef, useEffect } from 'react';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Smartphone, Wifi, Mail, Link, CreditCard, MapPin, Calendar, MessageSquare, Download } from 'lucide-react';
import { useAccessibility } from '@/context/AccessibilityContext';

/**
 * QR Code Templates component with dark mode support
 * Enhanced with keyboard accessibility
 */
const QRCodeTemplates = ({ onSelectTemplate }) => {
  const { announce } = useAccessibility();
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const templateRefs = useRef([]);
  
  // Define QR code templates
  const QR_TEMPLATES = [
    {
      id: 'website',
      name: 'Website URL',
      icon: <Link />,
      content: 'https://example.com',
      description: 'Link to a website',
      fgColor: '#1E3A8A',
      bgColor: '#F8FAFC'
    },
    {
      id: 'wifi',
      name: 'Wi-Fi - Access',
      icon: <Wifi />,
      content: 'WIFI:S:NetworkName;T:WPA;P:password;;',
      description: 'Connect to Wi-Fi network',
      fgColor: '#065F46',
      bgColor: '#ECFDF5'
    },
    {
      id: 'contact',
      name: 'Contact Information',
      icon: <Smartphone />,
      content: 'MECARD:N:John Doe;TEL:+491234567890;EMAIL:john@example.com;ADR:123 Main St, City;;',
      description: 'Share contact details',
      fgColor: '#9F1239',
      bgColor: '#FFF1F2'
    },
    {
      id: 'email',
      name: 'Email Address',
      icon: <Mail />,
      content: 'mailto:example@example.com',
      description: 'Direct email link',
      fgColor: '#312E81',
      bgColor: '#E0E7FF'
    },
    {
      id: 'payment',
      name: 'Crypto Address',
      icon: <CreditCard />,
      content: 'bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      description: 'Cryptocurrency address',
      fgColor: '#000000',
      bgColor: '#FFFF00'
    },
    {
      id: 'location',
      name: 'Location',
      icon: <MapPin />,
      content: 'geo:52.520008,13.404954',
      description: 'Geographic coordinates',
      fgColor: '#334155',
      bgColor: '#F1F5F9'
    },
    {
      id: 'event',
      name: 'Calendar Event',
      icon: <Calendar />,
      content: 'BEGIN:VEVENT\nSUMMARY:Event Title\nLOCATION:Event Location\nDTSTART:20250325T100000Z\nDTEND:20250325T110000Z\nEND:VEVENT',
      description: 'Add event to calendar',
      fgColor: '#000000',
      bgColor: '#FFFFFF'
    },
    {
      id: 'sms',
      name: 'SMS Message',
      icon: <MessageSquare />,
      content: 'SMSTO:+491234567890:Your message text here',
      description: 'Send a pre-composed text message',
      fgColor: '#6D28D9',
      bgColor: '#F5F3FF'
    },
    {
      id: 'app',
      name: 'App Download',
      icon: <Download />,
      content: 'https://example.com/app\n\nAndroid: https://play.google.com/store/apps/details?id=com.example.app\n\niOS: https://apps.apple.com/app/id1234567890',
      description: 'Direct users to download your app',
      fgColor: '#059669',
      bgColor: '#ECFDF5'
    }
  ];

  // Initialize refs array when number of templates changes
  useEffect(() => {
    templateRefs.current = templateRefs.current.slice(0, QR_TEMPLATES.length);
    while (templateRefs.current.length < QR_TEMPLATES.length) {
      templateRefs.current.push(React.createRef());
    }
  }, [QR_TEMPLATES.length]);

  // Handle keyboard navigation
  const handleKeyDown = (e, index) => {
    const numCols = window.innerWidth >= 640 ? 3 : 2; // sm:grid-cols-3 for larger screens, grid-cols-2 for smaller
    const numRows = Math.ceil(QR_TEMPLATES.length / numCols);
    
    let newIndex = focusedIndex;
    
    switch (e.key) {
      case 'ArrowRight':
        newIndex = index + 1;
        if (newIndex >= QR_TEMPLATES.length) newIndex = 0;
        e.preventDefault();
        break;
      case 'ArrowLeft':
        newIndex = index - 1;
        if (newIndex < 0) newIndex = QR_TEMPLATES.length - 1;
        e.preventDefault();
        break;
      case 'ArrowDown':
        newIndex = index + numCols;
        if (newIndex >= QR_TEMPLATES.length) {
          // Wrap to the beginning of the next column or the start
          newIndex = (index % numCols) + (newIndex - QR_TEMPLATES.length);
          if (newIndex >= QR_TEMPLATES.length) newIndex = index % numCols;
        }
        e.preventDefault();
        break;
      case 'ArrowUp':
        newIndex = index - numCols;
        if (newIndex < 0) {
          // Wrap to the end of the previous column or the end
          const lastRowItemCount = QR_TEMPLATES.length % numCols;
          const lastRowIndex = lastRowItemCount === 0 ? 
                            QR_TEMPLATES.length - numCols : 
                            QR_TEMPLATES.length - lastRowItemCount;
          const colPosition = index % numCols;
          newIndex = lastRowIndex + colPosition;
          if (newIndex >= QR_TEMPLATES.length) newIndex = QR_TEMPLATES.length - 1;
        }
        e.preventDefault();
        break;
      case 'Home':
        newIndex = 0;
        e.preventDefault();
        break;
      case 'End':
        newIndex = QR_TEMPLATES.length - 1;
        e.preventDefault();
        break;
      case 'Enter':
      case ' ': // Space
        onSelectTemplate(QR_TEMPLATES[index]);
        announce(`Selected ${QR_TEMPLATES[index].name} template`);
        e.preventDefault();
        break;
      default:
        return; // Don't handle other keys
    }
    
    // Update focus if index changed
    if (newIndex !== index && newIndex >= 0 && newIndex < QR_TEMPLATES.length) {
      setFocusedIndex(newIndex);
      templateRefs.current[newIndex]?.focus();
      announce(`${QR_TEMPLATES[newIndex].name} template. ${QR_TEMPLATES[newIndex].description}. Press Enter to select.`);
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-base dark:text-gray-200" id="qr-templates-label">QR Code Templates</Label>
      <p className="text-sm text-muted-foreground dark:text-gray-400 mb-4">
        Choose a template for commonly used QR code applications
      </p>
      
      <div 
        className="grid grid-cols-2 sm:grid-cols-3 gap-4" 
        role="grid" 
        aria-labelledby="qr-templates-label"
      >
        {QR_TEMPLATES.map((template, index) => (
          <Card 
            key={template.id}
            ref={el => templateRefs.current[index] = el}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md relative group border dark:border-gray-700 p-4 dark:bg-gray-800 ${
              focusedIndex === index ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-900' : ''
            }`}
            onClick={() => {
              onSelectTemplate(template);
              announce(`Selected ${template.name} template`);
            }}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(-1)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            tabIndex="0" // Make focusable
            role="gridcell"
            aria-label={`${template.name}: ${template.description}`}
          >
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 mb-3" aria-hidden="true">
                {React.cloneElement(template.icon, { size: 20 })}
              </div>
              
              <div className="text-center font-medium mb-2 break-words hyphens-auto dark:text-gray-300">{template.name}</div>
            </div>
            
            <div 
              className="absolute inset-0 bg-white dark:bg-gray-800 opacity-0 group-hover:opacity-95 group-focus:opacity-95 transition-opacity duration-200 flex items-center justify-center p-4 rounded-md dark:text-gray-300"
              aria-hidden="true"
            >
              <p className="text-xs text-center">{template.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QRCodeTemplates;