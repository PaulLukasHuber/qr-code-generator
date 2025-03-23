import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { CustomDateTimePicker } from '../ui/custom-date-time-picker';

/**
 * Simple component to display validation error messages
 */
const ValidationError = ({ message }) => {
  if (!message) return null;
  
  return (
    <p className="text-xs text-red-500 dark:text-red-400 mt-1">
      {message}
    </p>
  );
};

/**
 * Component for dynamic form fields based on QR code templates.
 * Displays different input fields depending on the selected template.
 * With support for dark mode and input validation.
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
  // State for validation errors
  const [validationErrors, setValidationErrors] = useState({});
  
  // Parse template fields - only once during initialization or when the template changes
  useEffect(() => {
    if (templateId && initialContent) {
      const parsedFields = parseTemplateContent(templateId, initialContent);
      setFormFields(parsedFields);
      setIsInitialized(true);
      
      // Reset validation errors when template changes
      setValidationErrors({});
    }
  }, [templateId]); // Dependency only on templateId, not on initialContent
  
  // Update QR code on changes, but only if initialization is complete and data is valid
  useEffect(() => {
    if (isInitialized && Object.keys(formFields).length > 0) {
      // Check if there are any validation errors
      const hasErrors = Object.values(validationErrors).some(error => error !== '');
      
      if (!hasErrors) {
        const formattedContent = formatTemplateContent(templateId, formFields);
        onContentChange(formattedContent);
      }
    }
  }, [formFields, templateId, isInitialized, onContentChange, validationErrors]);

  // Validation helper functions
  const validateURL = (url) => {
    // Basic URL validation - matches common URL patterns
    const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    return urlPattern.test(url) || url === '';
  };

  const validateEmail = (email) => {
    // Email validation
    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailPattern.test(email) || email === '';
  };

  const validatePhone = (phone) => {
    // Phone validation - matches common international formats with country code
    // Allows formats like: +491234567890, +1 123 456 7890, +44-123-456-7890
    const phonePattern = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    return phonePattern.test(phone) || phone === '';
  };

  const validateNumber = (num) => {
    return !isNaN(parseFloat(num)) || num === '';
  };

  const validateRequired = (value) => {
    return value && value.trim() !== '';
  };
  
  // Update a single field with validation
  const handleFieldChange = (fieldName, value) => {
    // Update the form field value
    setFormFields(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Validate the field based on its type and template
    let isValid = true;
    let errorMessage = '';
    
    switch (templateId) {
      case 'website':
        if (fieldName === 'url') {
          isValid = validateURL(value);
          errorMessage = isValid ? '' : 'Please enter a valid URL';
        }
        break;
        
      case 'wifi':
        if (fieldName === 'ssid' && !validateRequired(value)) {
          isValid = false;
          errorMessage = 'Network name is required';
        }
        break;
        
      case 'contact':
        if (fieldName === 'email') {
          isValid = validateEmail(value);
          errorMessage = isValid ? '' : 'Please enter a valid email address';
        } else if (fieldName === 'phone') {
          isValid = validatePhone(value);
          errorMessage = isValid ? '' : 'Please enter a valid phone number with country code (e.g., +1234567890)';
        }
        break;
        
      case 'email':
        if (fieldName === 'email') {
          isValid = validateEmail(value);
          errorMessage = isValid ? '' : 'Please enter a valid email address';
        }
        break;
        
      case 'payment':
        if (fieldName === 'amount') {
          isValid = validateNumber(value);
          errorMessage = isValid ? '' : 'Amount must be a number';
        }
        break;
        
      case 'location':
        if (fieldName === 'latitude') {
          isValid = validateNumber(value) && (value === '' || (parseFloat(value) >= -90 && parseFloat(value) <= 90));
          errorMessage = isValid ? '' : 'Latitude must be between -90 and 90';
        } else if (fieldName === 'longitude') {
          isValid = validateNumber(value) && (value === '' || (parseFloat(value) >= -180 && parseFloat(value) <= 180));
          errorMessage = isValid ? '' : 'Longitude must be between -180 and 180';
        }
        break;
        
      case 'sms':
        if (fieldName === 'phone') {
          isValid = validatePhone(value);
          errorMessage = isValid ? '' : 'Please enter a valid phone number with country code (e.g., +1234567890)';
        }
        break;
        
      case 'app':
        if (fieldName === 'universalLink') {
          isValid = value === '' || validateURL(value);
          errorMessage = isValid ? '' : 'Please enter a valid URL';
        } else if (fieldName === 'androidUrl') {
          isValid = value === '' || (validateURL(value) && value.includes('play.google.com'));
          errorMessage = isValid ? '' : 'Please enter a valid Google Play Store URL';
        } else if (fieldName === 'iosUrl') {
          isValid = value === '' || (validateURL(value) && value.includes('apps.apple.com'));
          errorMessage = isValid ? '' : 'Please enter a valid Apple App Store URL';
        }
        break;
    }
    
    // Update validation errors
    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: isValid ? '' : errorMessage
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

      // New SMS template
      case 'sms':
        return `SMSTO:${fields.phone || ''}:${fields.message || ''}`;

      // New App Download template
      case 'app': {
        let content = fields.appName || 'Download Our App';
        
        if (fields.universalLink) {
          content += `\n\n${fields.universalLink}`;
        }
        
        if (fields.androidUrl) {
          content += `\n\nAndroid: ${fields.androidUrl}`;
        }
        
        if (fields.iosUrl) {
          content += `\n\niOS: ${fields.iosUrl}`;
        }
        
        if (fields.description) {
          content += `\n\n${fields.description}`;
        }
        
        return content;
      }
        
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
      event: { title: '', location: '', start: '', end: '' },
      // New template defaults
      sms: { phone: '', message: '' },
      app: { appName: 'Download Our App', universalLink: '', androidUrl: '', iosUrl: '', description: '' }
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

        // New SMS template parser
        case 'sms': {
          // Parse SMS format: SMSTO:+491234567890:Your message text here
          const phoneMatch = content.match(/SMSTO:([^:]*)/);
          const messageMatch = content.match(/SMSTO:[^:]*:(.*)/);
          
          return {
            phone: phoneMatch ? phoneMatch[1] : defaultValues.sms.phone,
            message: messageMatch ? messageMatch[1] : defaultValues.sms.message
          };
        }
        
        // New App Download template parser
        case 'app': {
          // Parse multiline content with app links
          const appNameMatch = content.match(/^(.*?)(?:\n|$)/);
          const universalMatch = content.match(/https?:\/\/(?!play\.google\.com|apps\.apple\.com)[^\n]*/);
          const androidMatch = content.match(/Android: (https?:\/\/play\.google\.com[^\n]*)/);
          const iosMatch = content.match(/iOS: (https?:\/\/apps\.apple\.com[^\n]*)/);
          const descMatch = content.match(/\n\n([^]*)$/);
          
          return {
            appName: appNameMatch ? appNameMatch[1] : defaultValues.app.appName,
            universalLink: universalMatch ? universalMatch[0] : defaultValues.app.universalLink,
            androidUrl: androidMatch ? androidMatch[1] : defaultValues.app.androidUrl,
            iosUrl: iosMatch ? iosMatch[1] : defaultValues.app.iosUrl,
            description: descMatch ? descMatch[1] : defaultValues.app.description
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
                className={`dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 ${
                  validationErrors.url ? 'border-red-500 focus-visible:ring-red-500' : ''
                }`}
              />
              <ValidationError message={validationErrors.url} />
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
                className={`dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 ${
                  validationErrors.ssid ? 'border-red-500 focus-visible:ring-red-500' : ''
                }`}
              />
              <ValidationError message={validationErrors.ssid} />
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
                className={`dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 ${
                  validationErrors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''
                }`}
              />
              <ValidationError message={validationErrors.phone} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-email" className="dark:text-gray-200">Email</Label>
              <Input 
                id="contact-email"
                value={formFields.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder="example@email.com"
                className={`dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 ${
                  validationErrors.email ? 'border-red-500 focus-visible:ring-red-500' : ''
                }`}
              />
              <ValidationError message={validationErrors.email} />
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
                className={`dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 ${
                  validationErrors.email ? 'border-red-500 focus-visible:ring-red-500' : ''
                }`}
              />
              <ValidationError message={validationErrors.email} />
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
                className={`dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 ${
                  validationErrors.amount ? 'border-red-500 focus-visible:ring-red-500' : ''
                }`}
              />
              <ValidationError message={validationErrors.amount} />
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
                className={`dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 ${
                  validationErrors.latitude ? 'border-red-500 focus-visible:ring-red-500' : ''
                }`}
              />
              <ValidationError message={validationErrors.latitude} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location-longitude" className="dark:text-gray-200">Longitude</Label>
              <Input 
                id="location-longitude"
                value={formFields.longitude || ''}
                onChange={(e) => handleFieldChange('longitude', e.target.value)}
                placeholder="13.404954"
                className={`dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 ${
                  validationErrors.longitude ? 'border-red-500 focus-visible:ring-red-500' : ''
                }`}
              />
              <ValidationError message={validationErrors.longitude} />
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

      // New SMS Message template form with validation
      case 'sms':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sms-phone" className="dark:text-gray-200">Phone Number</Label>
              <Input 
                id="sms-phone"
                value={formFields.phone || ''}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                placeholder="+491234567890"
                className={`dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 ${
                  validationErrors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''
                }`}
              />
              <ValidationError message={validationErrors.phone} />
              <p className="text-xs text-muted-foreground dark:text-gray-400">
                Include country code (e.g., +49 for Germany)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sms-message" className="dark:text-gray-200">Message Text</Label>
              <textarea 
                id="sms-message"
                value={formFields.message || ''}
                onChange={(e) => handleFieldChange('message', e.target.value)}
                placeholder="Your message text here"
                rows={4}
                className="w-full rounded-md border border-input px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
              />
              <p className="text-xs text-muted-foreground dark:text-gray-400">
                Message the recipient will see when they scan the code
              </p>
            </div>
          </div>
        );
      
      // New App Download template form with validation
      case 'app':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="app-name" className="dark:text-gray-200">App Name</Label>
              <Input 
                id="app-name"
                value={formFields.appName || ''}
                onChange={(e) => handleFieldChange('appName', e.target.value)}
                placeholder="My Amazing App"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="app-universal" className="dark:text-gray-200">Universal Link (optional)</Label>
              <Input 
                id="app-universal"
                value={formFields.universalLink || ''}
                onChange={(e) => handleFieldChange('universalLink', e.target.value)}
                placeholder="https://example.com/app"
                className={`dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 ${
                  validationErrors.universalLink ? 'border-red-500 focus-visible:ring-red-500' : ''
                }`}
              />
              <ValidationError message={validationErrors.universalLink} />
              <p className="text-xs text-muted-foreground dark:text-gray-400">
                Fallback URL if app store links don't work
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="app-android" className="dark:text-gray-200">Google Play Store URL</Label>
              <Input 
                id="app-android"
                value={formFields.androidUrl || ''}
                onChange={(e) => handleFieldChange('androidUrl', e.target.value)}
                placeholder="https://play.google.com/store/apps/details?id=com.example.app"
                className={`dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 ${
                  validationErrors.androidUrl ? 'border-red-500 focus-visible:ring-red-500' : ''
                }`}
              />
              <ValidationError message={validationErrors.androidUrl} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="app-ios" className="dark:text-gray-200">Apple App Store URL</Label>
              <Input 
                id="app-ios"
                value={formFields.iosUrl || ''}
                onChange={(e) => handleFieldChange('iosUrl', e.target.value)}
                placeholder="https://apps.apple.com/app/id1234567890"
                className={`dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 ${
                  validationErrors.iosUrl ? 'border-red-500 focus-visible:ring-red-500' : ''
                }`}
              />
              <ValidationError message={validationErrors.iosUrl} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="app-description" className="dark:text-gray-200">Short Description (optional)</Label>
              <textarea 
                id="app-description"
                value={formFields.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Download our app to access exclusive features!"
                rows={2}
                className="w-full rounded-md border border-input px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
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