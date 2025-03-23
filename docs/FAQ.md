# Frequently Asked Questions

## Table of Contents
- [General Questions](#general-questions)
- [Content & Templates](#content--templates)
- [Customization & Design](#customization--design)
- [Logo Integration](#logo-integration)
- [Downloading & Export](#downloading--export)
- [Scanning & Compatibility](#scanning--compatibility)
- [Technical Issues](#technical-issues)
- [Privacy & Security](#privacy--security)
- [Advanced Usage](#advanced-usage)

## General Questions

### What is the QR Code Generator?
The QR Code Generator is a free, browser-based tool that allows you to create customizable QR codes for various purposes. You can generate QR codes for websites, Wi-Fi networks, contact information, and more, with options to customize colors and add your logo.

### Is the QR Code Generator free to use?
Yes, the QR Code Generator is completely free to use with no limitations on the number of QR codes you can create or download.

### Do I need to create an account?
No, the QR Code Generator doesn't require account creation or login. You can start creating QR codes immediately.

### Are there any usage limits?
There are no artificial limits on usage. Technical limitations apply only to what QR codes can inherently support (data capacity, etc.).

### Does the QR Code Generator work on mobile devices?
Yes, the application is fully responsive and works on smartphones and tablets. All features are available on mobile devices.

### Are my QR codes saved?
The QR Code Generator doesn't currently save your QR codes on the server. Be sure to download your QR codes after creating them. All processing happens in your browser.

## Content & Templates

### What types of QR codes can I create?
You can create QR codes for:
- Website URLs
- Wi-Fi network credentials
- Contact information
- Email addresses
- Cryptocurrency addresses
- Geographic locations
- Calendar events
- Plain text

### How much text can a QR code contain?
The capacity depends on the type of content:
- Numeric only: Up to 7,089 characters
- Alphanumeric: Up to 4,296 characters
- Binary data: Up to 2,953 bytes
- Kanji characters: Up to 1,817 characters

Note that these are theoretical maximums. For reliable scanning, especially when using logos or custom colors, it's best to keep content concise.

### Can I create a QR code that sends an SMS text message?
Yes, you can create an SMS QR code using the free text mode. Use the format `sms:+1234567890?body=Your message here` where +1234567890 is the phone number.

### Can I create a QR code for a vCard contact?
The Contact template uses the MECARD format, which is widely supported. For vCard format, you would need to format it manually in the free text mode.

### How do I create a QR code for a telephone number?
Use the free text mode and enter the phone number in the format `tel:+1234567890` where +1234567890 is the phone number with country code.

### Can I encrypt the content of my QR code?
The QR Code Generator doesn't offer built-in encryption. If you need encrypted content, you should encrypt it before entering it into the generator.

## Customization & Design

### Can I change the colors of my QR code?
Yes, you can customize both the foreground (dark) and background (light) colors of your QR code. Navigate to the Design tab and use either the color presets or select custom colors.

### Are there any color combinations I should avoid?
For optimal scanning, maintain high contrast between foreground and background colors. Avoid combinations where both colors have similar brightness or saturation. Black on white offers the best scanning reliability.

### Can I make a QR code with a gradient background?
The built-in generator doesn't support gradients directly. For gradient designs, you would need to download the QR code as SVG and edit it in a vector graphics program like Adobe Illustrator.

### Can I add a border or frame to my QR code?
The QR code includes a built-in quiet zone (white space around the code). While you can't add a border directly in the generator, you can:
1. Export as SVG
2. Edit in a vector program
3. Add your custom border while preserving the quiet zone

### How do I make a QR code with rounded corners?
The current version doesn't include rounded corner options. For rounded corners, export as SVG and modify with a vector editing program.

### Can I save my design settings for future use?
The application doesn't currently support saving presets or designs. Consider taking screenshots of your settings for future reference.

## Logo Integration

### Can I add a logo to my QR code?
Yes, the Logo Integration feature allows you to add a logo to the center of your QR code. Navigate to the Design tab and scroll to the Logo Integration section.

### What logo formats are supported?
You can upload logos in PNG, JPEG, SVG, and GIF formats. For best results, use PNG or SVG with transparent backgrounds.

### How large can my logo be?
You can adjust the logo size from 10% to 40% of the QR code area. For reliable scanning, we recommend keeping logos at 30% or smaller.

### Will adding a logo affect the scanability?
Adding a logo replaces some of the QR code modules, which could potentially affect scanning. However, QR codes include error correction to remain functional even with some data missing. The application automatically sets the highest error correction level when using logos.

### Can I position my logo somewhere other than the center?
Currently, logos can only be placed in the center of the QR code, which is the optimal position for scanning reliability.

### My logo has a background - how do I make it transparent?
You would need to edit your logo in an image editing program like Photoshop or GIMP to create a transparent background before uploading it to the QR code generator.

## Downloading & Export

### What file formats can I download my QR code in?
You can download your QR code as:
- SVG (vector format, ideal for printing at any size)
- PNG (raster format, good for digital use)

### What's the difference between SVG and PNG formats?
- **SVG**: Vector format that scales to any size without losing quality. Best for print materials or when you need to resize the QR code.
- **PNG**: Raster format that has a fixed resolution. Good for web use and when you need transparency.

### What size should I download my QR code in?
The size slider adjusts from 100px to 400px. For specific use cases:
- **Business cards**: 100-150px
- **Flyers/posters**: 200-300px
- **Large format printing**: 400px or export as SVG
- **Websites/email**: 150-200px

### Can I edit the QR code after downloading?
Yes, especially if you download in SVG format. You can use vector editing software like Adobe Illustrator, Inkscape, or Affinity Designer to make further customizations while preserving scanability.

### How do I use my QR code after downloading?
After downloading your QR code, you can:
- Insert it into documents, presentations, or designs
- Print it on marketing materials, product packaging, or business cards
- Add it to your website or social media
- Share it digitally via email or messaging apps

## Scanning & Compatibility

### How do people scan my QR code?
Most modern smartphones can scan QR codes using their built-in camera app. The user simply opens their camera and points it at the QR code. For older phones, a dedicated QR code scanner app may be needed.

### Which devices can scan these QR codes?
QR codes created with this generator are compatible with:
- iPhones and iPads (iOS 11 and newer)
- Android devices (Android 8 and newer)
- Most smartphones with a camera
- Dedicated QR code scanners
- Many point-of-sale systems

### How can I test if my QR code works?
Before distributing your QR code:
1. Download it
2. Open your phone's camera app
3. Point it at the QR code on your screen
4. Verify it scans correctly and leads to the intended content
5. Test with multiple devices if possible

### My QR code won't scan. What's wrong?
If your QR code isn't scanning:
- Ensure there's sufficient contrast between foreground and background colors
- Check that the logo isn't too large (reduce to 20% or less)
- Increase the QR code size
- Try a simpler data content with fewer characters
- Try removing custom colors and using standard black on white
- Verify your device's camera is clean and functioning properly

### At what distance can a QR code be scanned?
Scanning distance depends on:
- The physical size of the QR code
- The camera quality of the scanning device
- Lighting conditions
- QR code complexity and design

As a general rule, a QR code can be scanned from a distance of about 10 times its width. For example, a 1-inch QR code can typically be scanned from about 10 inches away.

## Technical Issues

### The generator is slow or freezing. What can I do?
If you're experiencing performance issues:
- Try a different web browser
- Clear your browser cache and cookies
- Reduce the amount of data in your QR code
- Disable any browser extensions that might interfere
- Ensure your device has available memory and processing power

### Can I use the generator offline?
Yes, you can use the QR Code Generator offline by:
1. Cloning the GitHub repository
2. Installing the dependencies
3. Building the project
4. Serving the built files locally

See [Offline Usage](USAGE.md#offline-usage) in the Usage Guide for detailed instructions.

### Do QR codes expire or stop working?
The QR code itself never expires, but if it points to online content (like a website), that content might change or become unavailable over time. Consider using a URL shortener service that allows you to update the destination URL without changing the QR code.

### What browsers are supported?
The QR Code Generator works best in modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

Internet Explorer is not supported.

## Privacy & Security

### Does the generator store my QR code data?
No, all data processing happens in your browser. Your content is not sent to our servers or stored beyond the current browser session.

### Are QR codes secure?
QR codes themselves are just a visual representation of data and have no inherent security features. Security considerations depend on what the QR code contains or links to. For potentially sensitive information:
- Consider where and how you share your QR codes
- Be cautious with financial or personal information
- Use HTTPS URLs for website links
- Consider a service that allows you to monitor and control the destination

### Can QR codes contain malware?
A QR code itself cannot contain malware, but it could link to a malicious website. Always ensure you're creating QR codes that link to trustworthy content.

### Can I track who scans my QR code?
The basic QR Code Generator doesn't include tracking capabilities. For analytics, consider:
1. Using a URL shortener service with tracking features before generating your QR code
2. Linking to a web page where you have analytics installed
3. Adding UTM parameters to your URLs for tracking in Google Analytics

## Advanced Usage

### Can I generate multiple QR codes at once?
The current version doesn't support batch generation. For multiple codes, you'll need to create them individually.

### Can I create a dynamic QR code that I can edit later?
This generator creates static QR codes. For dynamic codes that you can edit later:
1. Use a URL shortener or redirect service that lets you change the destination
2. Generate a QR code for that short URL
3. Update the destination through the service as needed

### Can I generate a QR code programmatically with an API?
The current tool doesn't offer an API. For programmatic generation, consider:
- Using the open-source QRCode.js library directly in your projects
- Looking for a dedicated QR code API service

### How do I create QR codes for print materials?
For print materials:
1. Export as SVG for best quality
2. Ensure your QR code is sized appropriately (minimum 2cm × 2cm for most applications)
3. Test the printed QR code before mass production
4. Include a clear call-to-action next to the QR code

### Can I create a QR code that works with specific apps?
Some apps support custom QR code formats. Research the specific format requirements for your target app and use the free text mode to enter the properly formatted data.

---

If your question isn't answered here, please [open an issue](https://github.com/paullukashuber/qr-code-generator/issues) on GitHub or refer to the [USAGE.md](USAGE.md) document for more detailed information.