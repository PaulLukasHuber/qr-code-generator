# QR Code Templates Guide

## Table of Contents
- [Introduction](#introduction)
- [Website URL Template](#website-url-template)
- [Wi-Fi Access Template](#wi-fi-access-template)
- [Contact Information Template](#contact-information-template)
- [Email Address Template](#email-address-template)
- [Crypto Address Template](#crypto-address-template)
- [Location Template](#location-template)
- [Calendar Event Template](#calendar-event-template)
- [Advanced Template Usage](#advanced-template-usage)

## Introduction

The QR Code Generator offers pre-built templates that format your data according to established standards for various applications. Using templates ensures your QR codes will be correctly interpreted by scanning apps. This guide explains each template in detail with formatting requirements and examples.

## Website URL Template

### Purpose
Generate a QR code that opens a website when scanned.

### Input Fields
- **Website URL**: The full URL you want to link to

### Format Requirements
- URLs should include the protocol (`http://` or `https://`)
- URLs are case-sensitive
- Special characters are supported but may need to be properly encoded

### Examples
- Basic website: `https://example.com`
- Webpage with parameters: `https://example.com/page?id=123&name=test`
- Secure website with subdomain: `https://blog.example.com/article/qr-codes`

### Best Practices
- Use HTTPS URLs whenever possible for security
- Keep URLs as short as practical for faster scanning
- Consider using a URL shortener for very long URLs
- Test your URL before generating the final QR code

## Wi-Fi Access Template

### Purpose
Create a QR code that automatically connects devices to your Wi-Fi network.

### Input Fields
- **Network Name (SSID)**: Your Wi-Fi network name
- **Security Type**: WPA/WPA2/WPA3, WEP, or No Password
- **Password**: Your network password

### Format Requirements
The Wi-Fi template follows the format:
```
WIFI:S:[SSID];T:[Security Type];P:[Password];;
```

Where:
- `[SSID]` is your network name
- `[Security Type]` is either WPA, WEP, or nopass
- `[Password]` is your network password

### Examples
- Home Wi-Fi: `WIFI:S:MyHomeNetwork;T:WPA;P:mypassword123;;`
- Public Wi-Fi: `WIFI:S:CoffeeShopWiFi;T:nopass;;;`
- WEP Security: `WIFI:S:LegacyNetwork;T:WEP;P:abc123;;`

### Best Practices
- Case sensitivity matters for both SSID and password
- Avoid special characters in the SSID if possible
- For WPA2 networks, select the WPA option
- To hide the password during entry, use the password field type

## Contact Information Template

### Purpose
Share contact details that can be automatically added to the recipient's address book.

### Input Fields
- **Name**: Full name
- **Phone Number**: Contact phone number
- **Email**: Email address
- **Address**: Physical address

### Format Requirements
The contact template follows the MECARD format:
```
MECARD:N:[Name];TEL:[Phone];EMAIL:[Email];ADR:[Address];;
```

### Examples
- Basic contact: `MECARD:N:John Doe;TEL:+12125551234;EMAIL:john@example.com;ADR:123 Main St, New York, NY;;`
- Business contact: `MECARD:N:Jane Smith;TEL:+4477123456;EMAIL:jane@company.com;ADR:10 Business Ave, London, UK;;`

### Best Practices
- Include international phone format with country code (+1, +44, etc.)
- Separate address components with commas
- Keep information concise for better readability
- Avoid unnecessary special characters

## Email Address Template

### Purpose
Create a QR code that opens the user's email client with a pre-filled email address.

### Input Fields
- **Email Address**: Recipient's email
- **Subject** (optional): Pre-filled subject line

### Format Requirements
The email template follows the format:
```
mailto:[Email Address]?subject=[Subject]
```

### Examples
- Basic email: `mailto:contact@example.com`
- Email with subject: `mailto:support@example.com?subject=Help%20Request`

### Best Practices
- Space characters in the subject should be encoded as %20
- Keep subject lines brief for better compatibility
- Verify email address formatting before generating

## Crypto Address Template

### Purpose
Share a cryptocurrency wallet address for receiving payments.

### Input Fields
- **Bitcoin Address**: Your cryptocurrency wallet address
- **Amount** (optional): Suggested payment amount

### Format Requirements
The crypto template follows the format:
```
bitcoin:[Address]?amount=[Amount]
```

### Examples
- Bitcoin address: `bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa`
- With amount: `bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa?amount=0.001`

### Best Practices
- Double-check addresses as they cannot be recovered if entered incorrectly
- For non-Bitcoin cryptocurrencies, many wallets still recognize the bitcoin: prefix
- Consider indicating the currency type somewhere visible near the QR code

## Location Template

### Purpose
Share a geographical location that opens in mapping applications.

### Input Fields
- **Latitude**: Decimal degrees (e.g., 52.520008)
- **Longitude**: Decimal degrees (e.g., 13.404954)

### Format Requirements
The location template follows the format:
```
geo:[Latitude],[Longitude]
```

### Examples
- Eiffel Tower: `geo:48.858370,2.294481`
- Statue of Liberty: `geo:40.689247,-74.044502`

### Best Practices
- Use decimal format with up to 6 decimal places for precision
- Positive values for north latitude and east longitude
- Negative values for south latitude and west longitude
- Test with multiple map applications to ensure compatibility

## Calendar Event Template

### Purpose
Create an event that can be added to calendar applications.

### Input Fields
- **Title**: Event name
- **Location**: Event venue
- **Start**: Begin date and time
- **End**: End date and time

### Format Requirements
The calendar template follows the vEvent format:
```
BEGIN:VEVENT
SUMMARY:[Title]
LOCATION:[Location]
DTSTART:[Start DateTime]
DTEND:[End DateTime]
END:VEVENT
```

Date-time format: `YYYYMMDDTHHMMSSZ` (ISO 8601)

### Examples
- Conference: 
```
BEGIN:VEVENT
SUMMARY:Web Development Conference
LOCATION:Tech Center, San Francisco
DTSTART:20250325T100000Z
DTEND:20250325T180000Z
END:VEVENT
```

### Best Practices
- Use the date picker to ensure correct format
- Time is in 24-hour format
- The 'Z' indicates UTC time
- For local time without the Z, adjust accordingly for the time zone

## Advanced Template Usage

### Combining Templates
While not directly supported in the interface, advanced users can combine formats by:
1. Starting with the most appropriate template
2. Generating the QR code
3. Copying the generated content
4. Editing it manually in the free text mode

### Custom Templates
Power users can create completely custom QR codes by:
1. Researching the appropriate format for your data type
2. Using the free text mode to enter your custom formatted data
3. Testing thoroughly across multiple devices

### Debugging Templates
If a template-generated QR code doesn't work:
1. Check for special characters that may need escaping
2. Verify format compliance with published standards
3. Test the plain text content in a different QR generator
4. Try scanning with multiple apps to isolate app-specific issues

---

By using these templates, you'll create QR codes that are optimized for their specific purposes and compatible with the widest range of scanning applications.