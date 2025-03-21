import React from 'react';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Smartphone, Wifi, Mail, Link, CreditCard, MapPin, Calendar } from 'lucide-react';

/**
 * QR-Code Vorlagen Komponente mit einheitlichem Schwarz-Weiß-Design
 * 
 * Zeigt verschiedene vordefinierte QR-Code Vorlagen für typische Anwendungsfälle an.
 * Jede Vorlage enthält Beispielinhalte und Farbschemata, die beim Auswählen
 * auf den QR-Code angewendet werden.
 *
 * @param {Object} props - Die Komponenten-Props
 * @param {Function} props.onSelectTemplate - Callback-Funktion, die aufgerufen wird, wenn ein Template ausgewählt wird
 */
const QRCodeTemplates = ({ onSelectTemplate }) => {
  // Define QR code templates
  const QR_TEMPLATES = [
    {
      id: 'website',
      name: 'Website URL',
      icon: <Link />,
      content: 'https://example.com',
      description: 'Link zu einer Website',
      fgColor: '#1E3A8A',
      bgColor: '#F8FAFC'
    },
    {
      id: 'wifi',
      name: 'WLAN-Zugang',
      icon: <Wifi />,
      content: 'WIFI:S:NetzwerkName;T:WPA;P:passwort;;',
      description: 'Mit WLAN-Netzwerk verbinden',
      fgColor: '#065F46',
      bgColor: '#ECFDF5'
    },
    {
      id: 'contact',
      name: 'Kontaktdaten',
      icon: <Smartphone />,
      content: 'MECARD:N:Max Mustermann;TEL:+491234567890;EMAIL:max@beispiel.de;ADR:Musterstraße 123, Stadt;;',
      description: 'Kontaktdaten teilen',
      fgColor: '#9F1239',
      bgColor: '#FFF1F2'
    },
    {
      id: 'email',
      name: 'E-Mail-Adresse',
      icon: <Mail />,
      content: 'mailto:beispiel@beispiel.de',
      description: 'Direkter E-Mail-Link',
      fgColor: '#312E81',
      bgColor: '#E0E7FF'
    },
    {
      id: 'payment',
      name: 'Krypto Adresse',
      icon: <CreditCard />,
      content: 'bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      description: 'Kryptowährungs-Adresse',
      fgColor: '#000000',
      bgColor: '#FFFF00'
    },
    {
      id: 'location',
      name: 'Standort',
      icon: <MapPin />,
      content: 'geo:52.520008,13.404954',
      description: 'Geografische Koordinaten',
      fgColor: '#334155',
      bgColor: '#F1F5F9'
    },
    {
      id: 'event',
      name: 'Kalenderereignis',
      icon: <Calendar />,
      content: 'BEGIN:VEVENT\nSUMMARY:Veranstaltungstitel\nLOCATION:Veranstaltungsort\nDTSTART:20250325T100000Z\nDTEND:20250325T110000Z\nEND:VEVENT',
      description: 'Ereignis zum Kalender hinzufügen',
      fgColor: '#000000',
      bgColor: '#FFFFFF'
    }
  ];

  return (
    <div className="space-y-4">
      <Label className="text-base">QR-Code Vorlagen</Label>
      <p className="text-sm text-muted-foreground mb-4">
        Wähle eine Vorlage für häufig verwendete QR-Code-Anwendungsfälle
      </p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {QR_TEMPLATES.map((template) => (
          <Card 
            key={template.id}
            className="cursor-pointer transition-all duration-200 hover:shadow-md relative group border p-4"
            onClick={() => onSelectTemplate(template)}
          >
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100 text-gray-800 mb-3">
                {React.cloneElement(template.icon, { size: 20 })}
              </div>
              
              <div className="text-center font-medium mb-2 break-words hyphens-auto">{template.name}</div>
            </div>
            
            <div className="absolute inset-0 bg-white dark:bg-gray-800 opacity-0 group-hover:opacity-95 transition-opacity duration-200 flex items-center justify-center p-4 rounded-md">
              <p className="text-xs text-center">{template.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QRCodeTemplates;