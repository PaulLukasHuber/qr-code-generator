import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { CustomDateTimePicker } from '../ui/custom-date-time-picker';

/**
 * Component for dynamic form fields based on QR code templates.
 * Displays different input fields depending on the selected template.
 * With support for dark mode.
 * 
 * @param {Object} props - Component props
 * @param {string} props.templateId - ID of the selected template
 * @param {string} props.initialContent - Initial content for the fields
 * @param {Function} props.onContentChange - Callback function called on changes
 */
const TemplateFormFields = ({ templateId, initialContent, onContentChange }) => {
  // State for form fields
  const [formFields, setFormFields] = useState({});
  // Flag to track if initialization is complete
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Parse template fields - only once during initialization or when the template changes
  useEffect(() => {
    if (templateId && initialContent) {
      const parsedFields = parseTemplateContent(templateId, initialContent);
      setFormFields(parsedFields);
      setIsInitialized(true);
    }
  }, [templateId]); // Dependency only on templateId, not on initialContent
  
  // Update QR code on changes, but only if initialization is complete
  useEffect(() => {
    if (isInitialized && Object.keys(formFields).length > 0) {
      const formattedContent = formatTemplateContent(templateId, formFields);
      onContentChange(formattedContent);
    }
  }, [formFields, templateId, isInitialized, onContentChange]);
  
  // Update a single field
  const handleFieldChange = (fieldName, value) => {
    setFormFields(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };
  
  // Format QR code content based on template and form fields
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
  
  // Parse existing content into individual fields
  const parseTemplateContent = (templateId, content) => {
    // Default values for each template - used as fallback
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
      console.error("Error parsing template content:", error);
      // Fall back to default values for this template
      return defaultValues[templateId] || {};
    }
  };
  
  // Render different form fields based on the template
  const renderFormFields = () => {
    switch (templateId) {
      case 'website':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="website-url" className="dark:text-gray-200">Website URL</Label>
              <Input 
                id="website-url"
                value={formFields.url || ''}
                onChange={(e) => handleFieldChange('url', e.target.value)}
                placeholder="https://example.com"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
              />
            </div>
          </div>
        );
        
      case 'wifi':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wifi-ssid" className="dark:text-gray-200">Network Name (SSID)</Label>
              <Input 
                id="wifi-ssid"
                value={formFields.ssid || ''}
                onChange={(e) => handleFieldChange('ssid', e.target.value)}
                placeholder="Wi-Fi network name"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="wifi-security" className="dark:text-gray-200">Security Type</Label>
              <Select 
                value={formFields.security || 'WPA'} 
                onValueChange={(value) => handleFieldChange('security', value)}
              >
                <SelectTrigger id="wifi-security" className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                  <SelectValue placeholder="Choose security type" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="WPA" className="dark:text-gray-200 dark:focus:bg-gray-700">WPA/WPA2/WPA3</SelectItem>
                  <SelectItem value="WEP" className="dark:text-gray-200 dark:focus:bg-gray-700">WEP</SelectItem>
                  <SelectItem value="nopass" className="dark:text-gray-200 dark:focus:bg-gray-700">No Password</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="wifi-password" className="dark:text-gray-200">Password</Label>
              <Input 
                id="wifi-password"
                type="password"
                value={formFields.password || ''}
                onChange={(e) => handleFieldChange('password', e.target.value)}
                placeholder="Wi-Fi password"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
              />
            </div>
          </div>
        );
        
      case 'contact':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name" className="dark:text-gray-200">Name</Label>
              <Input 
                id="contact-name"
                value={formFields.name || ''}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder="John Doe"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-phone" className="dark:text-gray-200">Phone Number</Label>
              <Input 
                id="contact-phone"
                value={formFields.phone || ''}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                placeholder="+49 123 4567890"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-email" className="dark:text-gray-200">Email</Label>
              <Input 
                id="contact-email"
                value={formFields.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder="example@email.com"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-address" className="dark:text-gray-200">Address</Label>
              <Input 
                id="contact-address"
                value={formFields.address || ''}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                placeholder="123 Main St, 12345 City"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
              />
            </div>
          </div>
        );
        
      case 'email':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-address" className="dark:text-gray-200">Email Address</Label>
              <Input 
                id="email-address"
                value={formFields.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder="example@email.com"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email-subject" className="dark:text-gray-200">Subject (optional)</Label>
              <Input 
                id="email-subject"
                value={formFields.subject || ''}
                onChange={(e) => handleFieldChange('subject', e.target.value)}
                placeholder="Your subject here"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
              />
            </div>
          </div>
        );
        
      case 'payment':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment-address" className="dark:text-gray-200">Bitcoin Address</Label>
              <Input 
                id="payment-address"
                value={formFields.address || ''}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                placeholder="bc1qzm792zk8kgu9v7c287cnvvz4q9phj6gplmfstu"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payment-amount" className="dark:text-gray-200">Amount (optional)</Label>
              <Input 
                id="payment-amount"
                type="number"
                step="0.00000001"
                value={formFields.amount || ''}
                onChange={(e) => handleFieldChange('amount', e.target.value)}
                placeholder="0.0001"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
              />
            </div>
          </div>
        );
        
      case 'location':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location-latitude" className="dark:text-gray-200">Latitude</Label>
              <Input 
                id="location-latitude"
                value={formFields.latitude || ''}
                onChange={(e) => handleFieldChange('latitude', e.target.value)}
                placeholder="52.520008"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location-longitude" className="dark:text-gray-200">Longitude</Label>
              <Input 
                id="location-longitude"
                value={formFields.longitude || ''}
                onChange={(e) => handleFieldChange('longitude', e.target.value)}
                placeholder="13.404954"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
              />
            </div>
          </div>
        );
        
      case 'event':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="event-title" className="dark:text-gray-200">Title</Label>
              <Input 
                id="event-title"
                value={formFields.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="Meeting"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event-location" className="dark:text-gray-200">Location</Label>
              <Input 
                id="event-location"
                value={formFields.location || ''}
                onChange={(e) => handleFieldChange('location', e.target.value)}
                placeholder="Conference Room A"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
              />
            </div>
            
            {/* Custom date/time picker for start */}
            <div className="dark:text-gray-200">
              <CustomDateTimePicker
                id="event-start"
                label="Start"
                value={formFields.start || ''}
                onChange={(value) => handleFieldChange('start', value)}
                helperText="Start date and time"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            
            {/* Custom date/time picker for end */}
            <div className="dark:text-gray-200">
              <CustomDateTimePicker
                id="event-end"
                label="End"
                value={formFields.end || ''}
                onChange={(value) => handleFieldChange('end', value)}
                helperText="End date and time"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
          </div>
        );
        
      default:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              Please select a template from the Templates tab.
            </p>
          </div>
        );
    }
  };
  
  // Render the appropriate form fields
  return (
    <div className="space-y-4">
      {renderFormFields()}
    </div>
  );
};

export default TemplateFormFields;