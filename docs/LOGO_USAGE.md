# QR Code Logo Integration Guide

This document explains how to use the custom logo integration feature in the QR Code Generator.

## Overview

Adding a logo to your QR code is a great way to brand your codes while maintaining their functionality. The QR Code Generator allows you to upload your own logo, adjust its size and appearance, and embed it within any QR code you create.

## Getting Started

1. Navigate to the **Design** tab in the QR Code Generator interface
2. Scroll down to the **Logo-Integration** section
3. You'll see a drop area where you can upload your logo

## Logo Requirements

For best results:
- Use images with transparent backgrounds (PNG or SVG formats are ideal)
- Simple, high-contrast logos work best
- Square logos maintain their proportions better
- Recommended size: at least 200×200 pixels for good quality

## Uploading a Logo

1. Click on the upload area in the Logo-Integration section
2. Select an image file from your device
3. Once uploaded, the logo will appear in the preview panel
4. The logo will automatically be placed in the center of your QR code

## Customizing Your Logo

### Logo Size

Use the size slider to adjust how large your logo appears in the QR code:
- **Smaller logos** (10-20%): Better scanability, less visual impact
- **Medium logos** (20-30%): Good balance of brand visibility and reliability
- **Larger logos** (30-40%): Maximum visual impact, but may affect scanability

### Logo Shape

Choose from three shape options:
- **Square**: Standard rectangular/square shape
- **Rounded**: Square with rounded corners for a softer appearance
- **Circle**: Circular crop, ideal for circular logos or profile pictures

### Background Options

You can customize the background behind your logo:
- Toggle the "Hintergrund anpassen" switch to enable/disable custom background
- When enabled, select a color using the color picker
- Type "transparent" in the color field for a transparent background
- Background padding is automatically calculated based on logo size

## Technical Considerations

### Error Correction

When using a logo, the error correction level is automatically set to **High (H)**:
- This provides approximately 30% redundancy in the QR code data
- The automatic setting cannot be changed while the logo is active
- This ensures your QR code remains scannable despite having a portion covered

### File Formats

The generator supports various image formats:
- **PNG**: Best for logos with transparency
- **SVG**: Ideal for sharp, scalable logos
- **JPEG/JPG**: Works well for photographic logos
- **GIF**: Supported (static image only)

## Troubleshooting

If your QR code doesn't scan properly with a logo:
1. **Reduce logo size**: Try using a smaller percentage (10-20%)
2. **Simplify your content**: Shorter URLs or less text makes QR codes more resilient
3. **Increase QR code size**: Larger QR codes can better accommodate logos
4. **Try different shapes**: Sometimes a circular or rounded logo integrates better
5. **Check contrast**: Ensure good contrast between QR code and logo

## Best Practices

- **Test thoroughly**: Always test your logo-embedded QR codes with multiple scanning apps
- **Keep it simple**: Simpler logos work better than complex ones
- **Monitor sizing**: When the logo exceeds 30%, watch for the amber warning indicating potential scanning issues
- **Consider placement**: Logos are centered automatically to avoid interfering with the three finder patterns in the corners