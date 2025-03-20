# QR Code Generator Usage Guide

This guide covers how to use the QR Code Generator application effectively.

## Basic Usage

### Generating a QR Code

1. Enter text or a URL in the input field
2. The QR code will automatically update in the preview panel
3. Adjust customization options as needed
4. Download the QR code in your preferred format

## Input Types

The QR code generator accepts various types of input:

- **URLs**: `https://example.com`
- **Plain Text**: `Hello World`
- **Contact Information**: `MECARD:N:John Doe;TEL:123456789;EMAIL:john@example.com;;`
- **Wi-Fi Configuration**: `WIFI:S:NetworkName;T:WPA;P:password;;`

## Downloading QR Codes

Two download formats are available:

- **SVG**: Vector format, ideal for printing at any size
- **PNG**: Raster format, good for digital use and websites

To download:
1. Generate your QR code
2. Click either the "SVG" or "PNG" button
3. The file will be downloaded to your default downloads location

## Browser Compatibility

The QR Code Generator works in all modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Mobile Usage

The application is fully responsive and can be used on mobile devices:
1. Access the website on your mobile browser
2. Generate the QR code as usual
3. Download options work the same as on desktop

## Offline Usage

To use the QR Code Generator offline:
1. Clone the repository
2. Install dependencies with `npm install`
3. Build the project with `npm run build`
4. Open the `dist/index.html` file in your browser

## Troubleshooting

If you encounter issues:

- **QR code doesn't update**: Try clicking the "Refresh" button
- **Download doesn't work**: Ensure your browser allows downloads
- **QR code doesn't scan**: Try increasing the size or adjusting colors for better contrast