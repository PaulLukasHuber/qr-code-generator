# Changelog

All notable changes to the QR Code Generator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Add ability to insert custom logos in QR code center
- Implement additional QR code styles (dots, patterns)
- QR code generation history
- Adjustable error correction level
- Direct sharing options
- Multiple Language Support

## [1.0.2] - 2025-03-21

### Added
- Color scheme presets feature with 8 professionally designed combinations
- Tabbed user interface for better organization of options (Content, Design, Settings)
- Version number display in application footer

### Changed
- Improved text formatting in color scheme selection with proper hyphenation
- Reorganized UI controls into logical groups for better user experience

### Removed
- Corner radius functionality due to technical limitations

## [1.0.1] - 2025-03-20

### Fixed
- Issue with QR code download functionality when corner radius is set to 0
- Improved error handling in download functions
- Better initialization of QR code data references

### Added
- Additional error logging for debugging
- Success messages after download operations

## [1.0.0] - 2025-03-20

### Added
- Initial release of the QR Code Generator
- Generate QR codes from any text or URL
- Customize foreground and background colors
- Adjust QR code size (100-400px)
- Add rounded corners with radius control
- Real-time preview with automatic updates
- Export as vector (SVG) or raster (PNG) formats
- Responsive design for all devices