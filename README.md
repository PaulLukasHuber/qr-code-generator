<div align="center">

# QR-Code Generator

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/paullukashuber/qr-code-generator/deploy.yml?logo=github)
![GitHub last commit](https://img.shields.io/github/last-commit/paullukashuber/qr-code-generator)
![GitHub issues](https://img.shields.io/github/issues/paullukashuber/qr-code-generator)
![GitHub stars](https://img.shields.io/github/stars/paullukashuber/qr-code-generator)


**EN**: Create customizable QR codes with adjustable colors, sizes. Export as SVG or PNG.  
**DE**: Erstelle anpassbare QR-Codes mit einstellbaren Farben, Größen. Exportieren Sie als SVG oder PNG.

<div align="center">
  <a href="#-english">English 🇬🇧</a> | 
  <a href="#-deutsch">Deutsch 🇩🇪</a>
</div>
<div align="center">
  <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
    <div>
      <p><strong>Light Mode</strong></p>
      <img src="/public/images/light-mode.png" alt="QR Code Generator Light Mode" width="350px" style="border-radius: 8px; border: 1px solid #ddd;" />
    </div>
    <div>
      <p><strong>Dark Mode</strong></p>
      <img src="/public/images/dark-mode.png" alt="QR Code Generator Dark Mode" width="350px" style="border-radius: 8px; border: 1px solid #333;" />
    </div>
  </div>
</div>
</div>

---

<a id="-english"></a>
<details open>
<summary><h2>English 🇬🇧</h2></summary>

## ✨ Features

- 📝 Pre-built templates for common QR code types:
  - Website URLs
  - Wi-Fi network credentials
  - Contact information
  - Email addresses
  - Crypto-Wallet Adress
  - Geographic locations
  - Calendar events
- 📋 Template-specific structured forms for intuitive data entry
- 📅 User-friendly date and time picker for calendar events
- 📱 Generate QR codes from any text or URL
- 🎨 Fully customizable foreground and background colors
- 🎭 Professional color scheme presets
- 🌓 Dark Mode support with system preference detection
- 📏 Adjustable QR code size (100-400px)
- 🛡️ Configurable error correction levels (L, M, Q, H)
- 🔄 Real-time preview with automatic updates
- 💾 Export as vector (SVG) or raster (PNG) formats
- 📱 Responsive design for all devices

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

Open http://localhost:5173 in your browser.

## 🛠️ Technologies

- **Frontend Framework:** React with Hooks
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **Icons:** Lucide React
- **QR Code Generation:** QRCode.js
- **Build Tool:** Vite

## 💻 Usage

1. Select a template or enter custom text/URL in the input field
2. For templates, fill in the specific fields provided:
   - **Wi-Fi**: Enter network name, security type, and password
   - **Contact**: Enter name, phone, email, and address
   - **Calendar**: Use the date picker to select times and enter event details
3. Customize the QR code appearance:
   - Choose a predefined color scheme
   - Or set custom foreground/background colors
   - Adjust size with the slider
4. View the real-time preview
5. Download in your preferred format:
   - SVG for vector graphics (scalable)
   - PNG for pixel-based images

## 🔮 Future Enhancements

- [x] Predefined color schemes
- [ ] Custom logo insertion in QR code center
- [ ] Additional QR code styles (dots, patterns)
- [ ] QR code generation history
- [x] Error correction level adjustment
- [ ] Direct sharing options
- [ ] Multiple language support

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

<div align="right"><a href="#-qr-code-generator">Back to top ⬆️</a></div>
</details>

---

<a id="-deutsch"></a>
<details>
<summary><h2>Deutsch 🇩🇪</h2></summary>
## ✨ Funktionen

- 📝 Vorgefertigte Vorlagen für gängige QR-Code-Typen:
  - Website-URLs
  - Anmeldedaten für das Wi-Fi-Netzwerk
  - Kontaktinformationen
  - E-Mail-Adressen
  - Krypto-Wallet-Adresse
  - Geografische Standorte
  - Kalenderereignisse
- 📋 Vorlagenspezifische strukturierte Formulare für die intuitive Dateneingabe
- 📅 Benutzerfreundliche Datums- und Zeitauswahl für Kalenderereignisse
- 📱 Generieren von QR-Codes aus einem beliebigen Text oder einer URL
- 🎨 Vollständig anpassbare Vorder- und Hintergrundfarben
- 🎭 Professionelle Farbschema-Voreinstellungen
- 🌓 Unterstützung des dunklen Modus mit Erkennung der Systemeinstellungen
- 📏 Einstellbare QR-Code-Größe (100-400px)
- 🛡️ Konfigurierbare Fehlerkorrekturstufen (L, M, Q, H)
- 🔄 Echtzeit-Vorschau mit automatischen Updates
- 💾 Export als Vektor- (SVG) oder Rasterformat (PNG)
- 📱 Responsive Design für alle Geräte

## 🚀 Schnellstart

```bash
# Repository klonen
git clone https://github.com/dein-username/qr-code-generator.git

# Verzeichnis wechseln
cd qr-code-generator

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Öffne http://localhost:5173 in deinem Browser.

## 🛠️ Technologien

- **Frontend-Framework:** React mit Hooks
- **Styling:** Tailwind CSS
- **UI-Komponenten:** Shadcn UI
- **Icons:** Lucide React
- **QR-Code-Generierung:** QRCode.js
- **Build-Tool:** Vite

## 💻 Verwendung

1. Wähle eine Vorlage oder gib benutzerdefinierten Text/URL ins Eingabefeld ein
2. Bei Vorlagen fülle die spezifischen Felder aus:
   - **WLAN**: Gib Netzwerkname, Sicherheitstyp und Passwort ein
   - **Kontakt**: Gib Name, Telefon, E-Mail und Adresse ein
   - **Kalender**: Nutze die Datumsauswahl für Termine und gib Ereignisdetails ein
3. Passe das Erscheinungsbild des QR-Codes an:
   - Wähle ein vordefiniertes Farbschema
   - Oder stelle eigene Vordergrund-/Hintergrundfarben ein
   - Stelle die Größe mit dem Schieberegler ein
4. Betrachte die Echtzeit-Vorschau
5. Lade den QR-Code in deinem bevorzugten Format herunter:
   - SVG für Vektorgrafiken (skalierbar)
   - PNG für pixelbasierte Bilder

## 🔮 Zukünftige Erweiterungen

- [x] Vordefinierte Farbschemata
- Benutzerdefiniertes Logo in der Mitte des QR-Codes einfügen
- Zusätzliche QR-Code-Stile (Punkte, Muster)
- [ ] Historie der QR-Code-Erzeugung
- [x] Anpassung der Fehlerkorrekturstufe
- [ ] Direkte Freigabeoptionen
- [ ] Unterstützung mehrerer Sprachen

## 🤝 Mitwirken

Beiträge sind willkommen! Du kannst:

1. Das Repository forken
2. Einen Feature-Branch erstellen (`git checkout -b feature/tolle-funktion`)
3. Deine Änderungen committen (`git commit -m 'Füge tolle Funktion hinzu'`)
4. Zum Branch pushen (`git push origin feature/tolle-funktion`)
5. Einen Pull Request öffnen

<div align="right"><a href="#-qr-code-generator">Zurück nach oben ⬆️</a></div>
</details>

---

<div align="center">

## 📄 License

[MIT License](LICENSE) • Copyright © 2025 [Paul-Lukas Huber](https://github.com/paullukashuber)

</div>
