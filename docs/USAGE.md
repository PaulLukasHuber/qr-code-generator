# QR Code Generator - Comprehensive Usage Guide

This guide provides detailed instructions on how to use all features of the QR Code Generator.

## Table of Contents

1. [Overview](#overview)
2. [Documentation Resources](#documentation-resources)
3. [Interface Navigation](#interface-navigation)
4. [Creating QR Codes](#creating-qr-codes)
   - [Templates](#templates)
   - [Free Text Mode](#free-text-mode)
5. [Design Customization](#design-customization)
   - [Color Schemes](#color-schemes)
   - [Custom Colors](#custom-colors)
   - [Size Adjustment](#size-adjustment)
6. [Logo Integration](#logo-integration)
7. [Error Correction Levels](#error-correction-levels)
8. [Dark Mode](#dark-mode)
9. [Exporting QR Codes](#exporting-qr-codes)
10. [Mobile Usage](#mobile-usage)
11. [Troubleshooting](#troubleshooting)
12. [Offline Usage](#offline-usage)

## Overview

The QR Code Generator lets you create customizable QR codes for various purposes, including website URLs, Wi-Fi credentials, contact information, and more. The application features a tabbed interface for easy navigation with real-time preview updates.

## Documentation Resources

In addition to this main usage guide, we provide specialized documentation for different aspects of the QR Code Generator:

- **[Templates Guide](TEMPLATES_GUIDE.md)**: Detailed information about each template type, format requirements, and examples
- **[Logo Usage Guide](LOGO_USAGE.md)**: Complete instructions for adding and customizing logos in your QR codes
- **[Design Tips](DESIGN_TIPS.md)**: Best practices and recommendations for creating effective, scannable QR code designs
- **[Technical Details](TECHNICAL_DETAILS.md)**: In-depth explanation of QR code technology, specifications, and implementation details
- **[Frequently Asked Questions](FAQ.md)**: Answers to common questions about using the QR Code Generator

These resources provide more detailed information on specific topics. Links to relevant guides appear throughout this document where applicable.

## Interface Navigation

The application is divided into four main tabs:

- **Templates**: Pre-defined QR code formats for common use cases
- **Content**: Text input for your QR code content
- **Design**: Customization options for colors and logo integration
- **Settings**: Size adjustment and additional options

## Creating QR Codes

### Templates

The Templates tab is the quickest way to create formatted QR codes for specific purposes:

1. Select the appropriate template:
   - **Website URL**: For linking to websites
   - **Wi-Fi Access**: Generate a QR code that connects devices to your Wi-Fi
   - **Contact Information**: Share contact details
   - **Email Address**: Create a direct email link
   - **Crypto Address**: For cryptocurrency wallet addresses
   - **Location**: Encode geographic coordinates
   - **Calendar Event**: Add events to calendar apps

2. After selecting a template, you'll be automatically directed to the Content tab where you can fill in the template-specific fields.

For detailed information about each template format, examples, and best practices, see the [Templates Guide](TEMPLATES_GUIDE.md).

#### Template-Specific Instructions

**Wi-Fi Template**:
- Network Name (SSID): Enter your Wi-Fi network name
- Security Type: Select WPA/WPA2/WPA3, WEP, or No Password
- Password: Enter your network password

**Contact Template**:
- Name: Full name of the contact
- Phone Number: Include country code for best compatibility
- Email: Email address
- Address: Physical address

**Calendar Event Template**:
- Title: Event name
- Location: Where the event will be held
- Start: Date and time when the event begins (use the date/time picker)
- End: Date and time when the event ends

### Free Text Mode

For custom content or when templates don't fit your needs:

1. Navigate to the Content tab
2. Enter your text or URL in the input field
3. The QR code preview will update automatically

## Design Customization

### Color Schemes

1. Navigate to the Design tab
2. Select one of the predefined color schemes:
   - Standard (black on white)
   - High Contrast (black on yellow)
   - Elegant (blue on light background)
   - Dark (light on dark background)
   - Mint (green tones)
   - Coral (red tones)
   - Blue-gray (neutral tones)
   - Contrast Plus (enhanced visibility)
   - Night Mode (optimized for dark environments)

For advanced design considerations and best practices, refer to our [Design Tips](DESIGN_TIPS.md) guide.

### Custom Colors

For precise color control:

1. In the Design tab, scroll to "Custom Color Settings"
2. Use the color picker or enter hex values for:
   - Foreground Color: The color of the QR code pattern
   - Background Color: The QR code's background

### Size Adjustment

1. Navigate to the Settings tab
2. Use the size slider to adjust the size of your QR code (100-400px)
3. The preview will update in real time

## Logo Integration

Adding a logo to your QR code enhances brand recognition:

1. Navigate to the Design tab
2. Scroll to the Logo Integration section
3. Click the upload area to select a logo image
4. Customize your logo:
   - Size: Adjust using the slider (10-40%)
   - Shape: Choose Square, Rounded, or Circle
   - Background: Toggle custom background on/off and set a color

For comprehensive logo integration instructions, best practices, and troubleshooting, see our dedicated [Logo Integration Guide](LOGO_USAGE.md).

## Error Correction Levels

QR codes have built-in error correction that determines how much damage they can sustain while remaining scannable:

- **Level L (Low)**: 7% of code words can be restored
- **Level M (Medium)**: 15% of code words can be restored
- **Level Q (Quartile)**: 25% of code words can be restored
- **Level H (High)**: 30% of code words can be restored

When using logo integration, Level H is automatically set to ensure scanability.

You can change the error correction level in the preview section, below the QR code.

For more technical information about error correction and QR code specifications, see the [Technical Details](TECHNICAL_DETAILS.md) documentation.

## Dark Mode

The application supports dark mode:

1. Click the sun/moon icon in the top right corner to toggle between light and dark themes
2. Your preference will be saved for future visits

When using dark mode with the default QR code settings, colors will be adjusted automatically for better visibility.

## Exporting QR Codes

Two export formats are available:

- **SVG**: Vector format that scales to any size without losing quality. Ideal for print and high-resolution uses.
- **PNG**: Raster format suitable for web and digital use.

To export:
1. Generate your QR code with desired settings
2. Click either the SVG or PNG button in the download section
3. The file will download to your default location

## Mobile Usage

The application is fully responsive and works on mobile devices:

1. Access the website on your mobile browser
2. All features work identically to desktop
3. The interface will automatically adjust to your screen size

For the best mobile experience:
- Use landscape orientation for more screen space
- When using logo integration, preview your QR code at actual size before finalizing

## Troubleshooting

### QR Code Issues

- **QR code doesn't scan**: Try these solutions:
  - Increase the contrast between foreground and background colors
  - Increase the QR code size
  - Reduce logo size if you're using one (under 30% recommended)
  - Try a higher error correction level (Q or H)
  - Avoid using very complex data in the QR code

- **QR code content is too long**: QR codes have data capacity limits:
  - Numeric only: 7,089 characters
  - Alphanumeric: 4,296 characters
  - Binary: 2,953 bytes
  - Consider using a URL shortener for long web addresses

For answers to more common questions and issues, check our [FAQ](FAQ.md) document.

### Technical Issues

- **QR code doesn't update**: Click the Refresh button in the Settings tab
- **Download doesn't work**: Check browser permissions for downloads
- **Color picker doesn't appear**: Try a different browser, Chrome is recommended
- **Page loads slowly**: Try clearing browser cache and reload

## Offline Usage

To use the QR Code Generator without an internet connection:

1. Clone the repository:
   ```bash
   git clone https://github.com/paullukashuber/qr-code-generator.git
   ```

2. Install dependencies:
   ```bash
   cd qr-code-generator
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Open the `dist/index.html` file in your browser

This offline version has identical functionality to the online version.

---

For additional details on specific topics, refer to our specialized documentation:
- [Templates Guide](TEMPLATES_GUIDE.md)
- [Logo Usage Guide](LOGO_USAGE.md)
- [Design Tips](DESIGN_TIPS.md)
- [Technical Details](TECHNICAL_DETAILS.md)
- [Frequently Asked Questions](FAQ.md)
- [Contributing Guide](../CONTRIBUTING.md) (for developers)