# Changelog

All notable changes to the QR Code Generator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Add ability to insert custom logos in QR code center
- Implement additional QR code styles (dots, patterns)
- QR code generation history
- Multiple language support
- Direct sharing options

## [1.1.1] - 2025-03-22

### Fixed
- QR code scaling issue at sizes larger than 340px. QR codes now maintain their proper square aspect ratio at all size settings (100-400px) (#2)

## [1.1.0] - 2025-03-21

### Added
- QR Code Templates feature with 7 predefined templates for common use cases:
  - Website URL
  - Wi-Fi Access
  - Contact Information
  - Email Address
  - Payment Information
  - Location
  - Calendar Event
- Template-specific structured input forms to simplify data entry:
  - Website: URL input field
  - Wi-Fi: Network name, security type (dropdown), password
  - Contact: Name, phone, email, address
  - Email: Email address, subject line
  - Payment: Bitcoin address, amount
  - Location: Latitude and longitude coordinates
  - Calendar: Title, location, start and end times
- Custom DateTimePicker for calendar events with:
  - User-friendly date and time selection interface
  - Direct text input support in local date format
  - Hierarchical navigation between days, months, and years
  - Quick time selection options
  - Keyboard navigation support
- New "Templates" tab as the default view for better user experience
- Toggle between template form fields and free text mode
- Success feedback when templates are applied

### Changed
- Reorganized tab structure to include the new Templates tab
- Improved UI layout for template selection with descriptive icons
- Enhanced user experience with context-specific input fields
- Optimized data entry for complex QR code formats 
- Updated template descriptions and labels to be more intuitive

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