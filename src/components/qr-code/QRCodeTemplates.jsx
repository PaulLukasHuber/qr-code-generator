import React from 'react';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Smartphone, Wifi, Mail, Link, CreditCard, MapPin, Calendar } from 'lucide-react';

/**
 * QR Code Templates component with dark mode support
 */
const QRCodeTemplates = ({ onSelectTemplate }) => {
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
    }
  ];

  return (
    <div className="space-y-4">
      <Label className="text-base dark:text-gray-200">QR Code Templates</Label>
      <p className="text-sm text-muted-foreground dark:text-gray-400 mb-4">
        Choose a template for commonly used QR code applications
      </p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {QR_TEMPLATES.map((template) => (
          <Card 
            key={template.id}
            className="cursor-pointer transition-all duration-200 hover:shadow-md relative group border dark:border-gray-700 p-4 dark:bg-gray-800"
            onClick={() => onSelectTemplate(template)}
          >
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 mb-3">
                {React.cloneElement(template.icon, { size: 20 })}
              </div>
              
              <div className="text-center font-medium mb-2 break-words hyphens-auto dark:text-gray-300">{template.name}</div>
            </div>
            
            <div className="absolute inset-0 bg-white dark:bg-gray-800 opacity-0 group-hover:opacity-95 transition-opacity duration-200 flex items-center justify-center p-4 rounded-md dark:text-gray-300">
              <p className="text-xs text-center">{template.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QRCodeTemplates;