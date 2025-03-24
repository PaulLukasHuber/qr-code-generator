# QR-Code Generator

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/paullukashuber/qr-code-generator/deploy.yml?logo=github)
![GitHub last commit](https://img.shields.io/github/last-commit/paullukashuber/qr-code-generator)
![GitHub issues](https://img.shields.io/github/issues/paullukashuber/qr-code-generator)
![Version](https://img.shields.io/badge/version-1.7.0-brightgreen)

Create custom QR codes with adjustable colors, multiple export formats, and logo integration.

<img src="/public/images/qr-code-generator-light.png" alt="QR Code Generator Light Mode" width="700px" />
<details>
  <summary>🌙 View Dark Mode</summary>
  <img src="/public/images/qr-code-generator-dark.png" alt="QR Code Generator Dark Mode" width="700px" />
</details>

</div>

## ✨ Features

### Content Generation
- **Ready-made Templates** for common QR code types:
  - Website URLs, Wi-Fi credentials, Contact information
  - Email addresses, Crypto-Wallet addresses
  - Geographic locations, Calendar events
  - SMS messages, App Download links with platform detection
- **Smart Form Fields** that adapt to each template type
- **Custom DateTimePicker** for easy calendar event creation

### Customization Options
- **Color Personalization** with custom colors or professional presets
  - 12 professionally designed color schemes for every context
  - Options including Purple Accent, Earth Tones, and Neon Teal
- **Dark Mode Support** with automatic system preference detection
- **Size Adjustment** (100-400px) with live preview
- **Error Correction Selection** (L, M, Q, H) with visual indicators

### Logo Integration
- **True Vector Logo Support** – SVG logos maintain their vector properties in exports
- **Multiple Logo Shapes** – Square, rounded square, or circle
- **Logo Background Options** – Add custom backgrounds for better contrast
- **Automatic Error Correction** – High-level correction when using logos for reliability

### Enhanced Export Capabilities
- **Organized Export Interface** - Intuitive tabbed design for all format options
- **Multiple Format Support**:
  - **Vector Formats**: SVG for perfect scaling, PDF for documentation (beta)
  - **Raster Formats**: PNG, JPEG, and WebP (beta) for universal compatibility
  - **Web Integration**: HTML snippets, Data URLs, and clipboard copying
- **Format Descriptions** - Helpful context for choosing the right export option
- **Dark Mode Compatible** - Fully functional in both light and dark themes

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/your-username/qr-code-generator.git

# Change directory
cd qr-code-generator

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:5173 in your browser to start creating QR codes.

## 🛠️ Technologies

- **React 18** with functional components and hooks
- **Tailwind CSS** for styling
- **Shadcn UI** for component architecture
- **QRCode.js** for QR code generation
- **Vite** for fast development and optimized builds

## 💻 Usage Guide

### Basic QR Code Creation

1. **Choose a Template or Enter Text**
   - Select from pre-built templates or enter any text/URL
   - Each template provides specialized input fields

2. **Customize Appearance**
   - Choose from color scheme presets or set custom colors
   - Adjust QR code size using the slider (100-400px)
   - Select error correction level based on your needs:
     - L (7%): For clean environments
     - M (15%): General purpose use
     - Q (25%): Enhanced durability 
     - H (30%): Maximum durability, required for logos

3. **Add Your Logo (Optional)**
   - Upload PNG, JPEG, or SVG logos
   - Choose between square, rounded, or circular display
   - Adjust size (10-40% of QR code)
   - Add custom background for better visibility

4. **Export Your QR Code**
   - Use the tabbed export interface to select your preferred format
   - Choose from vector formats for perfect scaling (SVG, PDF)
   - Select raster formats for compatibility (PNG, JPEG, WebP)
   - Utilize web integration options (HTML, Data URL, Copy to Clipboard)

### Best Practices for QR Code Reliability

- Use high error correction (H) when adding logos
- Keep logo size under 30% for better scanability
- Test your QR code with different scanning apps
- Maintain adequate contrast between foreground and background colors

## 🔍 Compatibility

QR codes generated by this tool are compatible with:
- Modern smartphone cameras (iOS, Android)
- Dedicated QR code scanner apps
- Most POS and inventory systems
- Digital wallets for crypto addresses
- Calendar apps (for event QR codes)
- SMS messaging apps (for SMS QR codes)
- App stores (for App Download QR codes)

## 🔮 Roadmap

### Current Features
- [x] Predefined color schemes
- [x] Custom logo integration
- [x] True vector SVG export
- [x] Error correction level adjustment
- [x] Expanded color palette options
- [x] Comprehensive export format options

### Coming Soon
- [ ] Context-aware export options
- [ ] Advanced export formats (Print Direct, ZIP Package, Social Media)
- [ ] Additional QR code visual styles (dots, patterns)
- [ ] QR code generation history
- [ ] Multiple language support
- [ ] Direct sharing options
- [ ] Browser extension

## 🤝 Contributing

Contributions make this project better! Please check the [Contributing Guide](CONTRIBUTING.md) for details on how to get started.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and commit them: `git commit -m 'Add amazing feature'`
4. Push to your branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🔧 Troubleshooting

**QR codes aren't scanning?**
- Ensure adequate contrast between foreground and background
- Try increasing the error correction level (especially with logos)
- Make sure QR code size isn't too small when displayed

**Export issues?**
- Vector SVG exports may not display correctly in some older applications
- For maximum compatibility, use PNG export
- WebP format requires modern browser support
- PDF export uses browser print functionality

## 📄 License

[MIT License](LICENSE) • Copyright © 2025 [Paul-Lukas Huber](https://github.com/paullukashuber)

---

<div align="center">
  <a href="https://github.com/paullukashuber/qr-code-generator/issues">Report Bug</a> •
  <a href="https://github.com/paullukashuber/qr-code-generator/issues">Request Feature</a>
</div>