import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { CustomDateTimePicker } from '../ui/custom-date-time-picker';

/**
 * Komponente für dynamische Formularfelder basierend auf QR-Code Vorlagen.
 * Zeigt unterschiedliche Eingabefelder je nach ausgewähltem Template an.
 * 
 * @param {Object} props - Komponenten-Props
 * @param {string} props.templateId - ID des ausgewählten Templates
 * @param {string} props.initialContent - Initialer Inhalt für die Felder
 * @param {Function} props.onContentChange - Callback-Funktion, die bei Änderungen aufgerufen wird
 */
const TemplateFormFields = ({ templateId, initialContent, onContentChange }) => {
  // Zustand für die Formularfelder
  const [formFields, setFormFields] = useState({});
  // Flag, um zu verfolgen, ob die Initialisierung abgeschlossen ist
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Template-Felder parsen - nur einmal bei der Initialisierung oder wenn sich das Template ändert
  useEffect(() => {
    if (templateId && initialContent) {
      const parsedFields = parseTemplateContent(templateId, initialContent);
      setFormFields(parsedFields);
      setIsInitialized(true);
    }
  }, [templateId]); // Abhängigkeit nur von templateId, nicht von initialContent
  
  // Aktualisiere QR-Code bei Änderungen, aber nur wenn die Initialisierung abgeschlossen ist
  useEffect(() => {
    if (isInitialized && Object.keys(formFields).length > 0) {
      const formattedContent = formatTemplateContent(templateId, formFields);
      onContentChange(formattedContent);
    }
  }, [formFields, templateId, isInitialized, onContentChange]);
  
  // Aktualisiert ein einzelnes Feld
  const handleFieldChange = (fieldName, value) => {
    setFormFields(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };
  
  // Formatiert den QR-Code-Inhalt basierend auf Template und Formularfeldern
  const formatTemplateContent = (templateId, fields) => {
    switch (templateId) {
      case 'website':
        return fields.url || 'https://';
        
      case 'wifi':
        return `WIFI:S:${fields.ssid || ''};T:${fields.security || 'WPA'};P:${fields.password || ''};;`;
        
      case 'contact':
        return `MECARD:N:${fields.name || ''};TEL:${fields.phone || ''};EMAIL:${fields.email || ''};ADR:${fields.address || ''};;`;
        
      case 'email':
        return `mailto:${fields.email || ''}${fields.subject ? '?subject=' + encodeURIComponent(fields.subject) : ''}`;
        
      case 'payment':
        return `bitcoin:${fields.address || ''}${fields.amount ? '?amount=' + fields.amount : ''}`;
        
      case 'location':
        return `geo:${fields.latitude || '0'},${fields.longitude || '0'}`;
        
      case 'event':
        return `BEGIN:VEVENT
SUMMARY:${fields.title || ''}
LOCATION:${fields.location || ''}
DTSTART:${fields.start || ''}
DTEND:${fields.end || ''}
END:VEVENT`;
        
      default:
        return '';
    }
  };
  
  // Parst den bestehenden Inhalt in einzelne Felder
  const parseTemplateContent = (templateId, content) => {
    // Standardwerte für jede Vorlage - werden als Fallback verwendet
    const defaultValues = {
      website: { url: 'https://' },
      wifi: { ssid: '', security: 'WPA', password: '' },
      contact: { name: '', phone: '', email: '', address: '' },
      email: { email: '', subject: '' },
      payment: { address: '', amount: '' },
      location: { latitude: '0', longitude: '0' },
      event: { title: '', location: '', start: '', end: '' }
    };
    
    try {
      switch (templateId) {
        case 'website':
          return { url: content || defaultValues.website.url };
          
        case 'wifi': {
          const ssidMatch = content.match(/S:([^;]*)/);
          const securityMatch = content.match(/T:([^;]*)/);
          const passwordMatch = content.match(/P:([^;]*)/);
          
          return {
            ssid: ssidMatch ? ssidMatch[1] : defaultValues.wifi.ssid,
            security: securityMatch ? securityMatch[1] : defaultValues.wifi.security,
            password: passwordMatch ? passwordMatch[1] : defaultValues.wifi.password
          };
        }
          
        case 'contact': {
          const nameMatch = content.match(/N:([^;]*)/);
          const phoneMatch = content.match(/TEL:([^;]*)/);
          const emailMatch = content.match(/EMAIL:([^;]*)/);
          const addressMatch = content.match(/ADR:([^;]*)/);
          
          return {
            name: nameMatch ? nameMatch[1] : defaultValues.contact.name,
            phone: phoneMatch ? phoneMatch[1] : defaultValues.contact.phone,
            email: emailMatch ? emailMatch[1] : defaultValues.contact.email,
            address: addressMatch ? addressMatch[1] : defaultValues.contact.address
          };
        }
          
        case 'email': {
          let email = defaultValues.email.email;
          let subject = defaultValues.email.subject;
          
          if (content.startsWith('mailto:')) {
            const parts = content.split('?');
            email = parts[0].replace('mailto:', '');
            
            if (parts.length > 1) {
              const subjectMatch = parts[1].match(/subject=([^&]*)/);
              subject = subjectMatch ? decodeURIComponent(subjectMatch[1]) : subject;
            }
          }
          
          return { email, subject };
        }
          
        case 'payment': {
          let address = defaultValues.payment.address;
          let amount = defaultValues.payment.amount;
          
          if (content.startsWith('bitcoin:')) {
            const parts = content.split('?');
            address = parts[0].replace('bitcoin:', '');
            
            if (parts.length > 1) {
              const amountMatch = parts[1].match(/amount=([^&]*)/);
              amount = amountMatch ? amountMatch[1] : amount;
            }
          }
          
          return { address, amount };
        }
          
        case 'location': {
          let latitude = defaultValues.location.latitude;
          let longitude = defaultValues.location.longitude;
          
          if (content.startsWith('geo:')) {
            const coords = content.replace('geo:', '').split(',');
            if (coords.length >= 2) {
              latitude = coords[0];
              longitude = coords[1];
            }
          }
          
          return { latitude, longitude };
        }
          
        case 'event': {
          const titleMatch = content.match(/SUMMARY:([^\n]*)/);
          const locationMatch = content.match(/LOCATION:([^\n]*)/);
          const startMatch = content.match(/DTSTART:([^\n]*)/);
          const endMatch = content.match(/DTEND:([^\n]*)/);
          
          return {
            title: titleMatch ? titleMatch[1] : defaultValues.event.title,
            location: locationMatch ? locationMatch[1] : defaultValues.event.location,
            start: startMatch ? startMatch[1] : defaultValues.event.start,
            end: endMatch ? endMatch[1] : defaultValues.event.end
          };
        }
          
        default:
          return {};
      }
    } catch (error) {
      console.error("Fehler beim Parsen des Template-Inhalts:", error);
      // Fallback zu Standard-Werten für dieses Template
      return defaultValues[templateId] || {};
    }
  };
  
  // Rendert unterschiedliche Formularfelder basierend auf dem Template
  const renderFormFields = () => {
    switch (templateId) {
      case 'website':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="website-url">Website URL</Label>
              <Input 
                id="website-url"
                value={formFields.url || ''}
                onChange={(e) => handleFieldChange('url', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
        );
        
      case 'wifi':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wifi-ssid">Netzwerkname (SSID)</Label>
              <Input 
                id="wifi-ssid"
                value={formFields.ssid || ''}
                onChange={(e) => handleFieldChange('ssid', e.target.value)}
                placeholder="WLAN-Netzwerkname"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="wifi-security">Sicherheitstyp</Label>
              <Select 
                value={formFields.security || 'WPA'} 
                onValueChange={(value) => handleFieldChange('security', value)}
              >
                <SelectTrigger id="wifi-security">
                  <SelectValue placeholder="Sicherheitstyp wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WPA">WPA/WPA2/WPA3</SelectItem>
                  <SelectItem value="WEP">WEP</SelectItem>
                  <SelectItem value="nopass">Kein Passwort</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="wifi-password">Passwort</Label>
              <Input 
                id="wifi-password"
                type="password"
                value={formFields.password || ''}
                onChange={(e) => handleFieldChange('password', e.target.value)}
                placeholder="WLAN-Passwort"
              />
            </div>
          </div>
        );
        
      case 'contact':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input 
                id="contact-name"
                value={formFields.name || ''}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder="Max Mustermann"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-phone">Telefonnummer</Label>
              <Input 
                id="contact-phone"
                value={formFields.phone || ''}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                placeholder="+49 123 4567890"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-email">E-Mail</Label>
              <Input 
                id="contact-email"
                value={formFields.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder="beispiel@email.de"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-address">Adresse</Label>
              <Input 
                id="contact-address"
                value={formFields.address || ''}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                placeholder="Musterstraße 123, 12345 Berlin"
              />
            </div>
          </div>
        );
        
      case 'email':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-address">E-Mail-Adresse</Label>
              <Input 
                id="email-address"
                value={formFields.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder="beispiel@email.de"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email-subject">Betreff (optional)</Label>
              <Input 
                id="email-subject"
                value={formFields.subject || ''}
                onChange={(e) => handleFieldChange('subject', e.target.value)}
                placeholder="Dein Betreff hier"
              />
            </div>
          </div>
        );
        
      case 'payment':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment-address">Bitcoin-Adresse</Label>
              <Input 
                id="payment-address"
                value={formFields.address || ''}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                placeholder="bc1qzm792zk8kgu9v7c287cnvvz4q9phj6gplmfstu"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payment-amount">Betrag (optional)</Label>
              <Input 
                id="payment-amount"
                type="number"
                step="0.00000001"
                value={formFields.amount || ''}
                onChange={(e) => handleFieldChange('amount', e.target.value)}
                placeholder="0.0001"
              />
            </div>
          </div>
        );
        
      case 'location':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location-latitude">Breitengrad</Label>
              <Input 
                id="location-latitude"
                value={formFields.latitude || ''}
                onChange={(e) => handleFieldChange('latitude', e.target.value)}
                placeholder="52.520008"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location-longitude">Längengrad</Label>
              <Input 
                id="location-longitude"
                value={formFields.longitude || ''}
                onChange={(e) => handleFieldChange('longitude', e.target.value)}
                placeholder="13.404954"
              />
            </div>
          </div>
        );
        
      case 'event':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="event-title">Titel</Label>
              <Input 
                id="event-title"
                value={formFields.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="Besprechung"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event-location">Ort</Label>
              <Input 
                id="event-location"
                value={formFields.location || ''}
                onChange={(e) => handleFieldChange('location', e.target.value)}
                placeholder="Konferenzraum A"
              />
            </div>
            
            {/* Benutzerdefinierter Datum/Zeit-Auswähler für Beginn */}
            <CustomDateTimePicker
              id="event-start"
              label="Beginn"
              value={formFields.start || ''}
              onChange={(value) => handleFieldChange('start', value)}
              helperText="Datum und Uhrzeit des Beginns"
            />
            
            {/* Benutzerdefinierter Datum/Zeit-Auswähler für Ende */}
            <CustomDateTimePicker
              id="event-end"
              label="Ende"
              value={formFields.end || ''}
              onChange={(value) => handleFieldChange('end', value)}
              helperText="Datum und Uhrzeit des Endes"
            />
          </div>
        );
        
      default:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Bitte wählen Sie eine Vorlage aus dem Templates-Tab.
            </p>
          </div>
        );
    }
  };
  
  // Render der passenden Formularfelder
  return (
    <div className="space-y-4">
      {renderFormFields()}
    </div>
  );
};

export default TemplateFormFields;