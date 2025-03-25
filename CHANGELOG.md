# Changelog

All notable changes to the QR Code Generator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned Features
- Context-aware export options that display format choices based on QR code content type
- Additional advanced export formats:
  - Print Directly - Send QR codes directly to printer without creating files
  - ZIP Package - Bundle multiple formats (PNG, SVG, HTML) in a single download
  - Social Media Format - Optimized dimensions and styling for sharing on social platforms
  - vCard Format - Direct contact file export for contact information QR codes
  - High-Resolution PNG - Extra large image files for large-format printing
- Implement additional QR code styles (dots, patterns)
- QR code generation history
- Multiple language support

## [1.8.1] - 2025-03-25
### Fixed
- High contrast mode now properly applies styling throughout the application
- Resolved CSS specificity issues that prevented high contrast mode from working
- Fixed SVG icon rendering in high contrast mode to maintain visibility without distortion
- Enhanced focus visibility in high contrast mode for better keyboard navigation
- Added appropriate borders and visual cues for interactive elements in high contrast mode

### Added
- Visual patterns to differentiate disabled elements in high contrast mode
- Improved form control visibility with stronger borders and clear states
- Underlined links for better identification in high contrast mode

## [1.8.0] - 2025-03-24
### Added
- Comprehensive accessibility infrastructure including:
  - Accessibility context provider for managing user preferences
  - High contrast mode toggle
  - Font size controls with small, medium, large, and extra-large options
  - Reduced motion setting for users with motion sensitivity
  - Keyboard shortcut system with reference panel (Alt+/)
  - Skip to content links for keyboard users
  - ARIA attributes and semantic HTML enhancements
  - Screen reader announcements for dynamic content
  - Enhanced focus management for keyboard navigation
  - AccessibleQRPreview component for better screen reader support
  - Detailed accessibility documentation (ACCESSIBILITY.md)

## [1.7.0] - 2025-03-24

### Added
- Redesigned export interface with tabbed organization:
  - Raster formats tab (PNG, JPEG, WebP)
  - Vector formats tab (SVG, PDF)
  - Web formats tab (HTML, Data URL, Copy to Clipboard)
- Enhanced UI design with consistent button styling
- Improved dark mode compatibility throughout export interface
- Clear visual indicators for beta features
- Contextual descriptions for each export format category

### Changed
- Replaced Download Buttons with space-efficient tabbed interface
- Enhanced button design for better visibility in both light and dark modes
- Improved export organization with logical format grouping
- Better visual hierarchy and user flow for export options

### Technical
- Created comprehensive utility functions for each export format
- Added browser compatibility checks for advanced formats like WebP
- Implemented a modular export architecture for future expansion

## [1.6.0] - 2025-03-24

### Added
- Two new specialized QR code templates:
  - SMS Message template for creating pre-composed text messages
  - App Download template for directing users to mobile applications with platform detection
- Three new color schemes:
  - Purple Accent: Deep purple on light purple for sophisticated appearance
  - Earth Tones: Brown on beige for eco-friendly or organic contexts
  - Neon Teal: Vibrant teal on mint for high visibility
- Comprehensive input validation system:
  - Real-time validation feedback for all form fields
  - Visual indicators for invalid inputs
  - Context-specific error messages
  - Type-specific validation (URLs, email addresses, phone numbers)
  - Range validation for coordinates and numeric values
  - Specialized validation for app store links

### Changed
- Improved user experience with validation feedback while typing
- Enhanced template form parsing and formatting logic
- Updated version number to reflect new features

## [1.5.1] - 2025-03-23

### Fixed
- SVG export now fully supports logo integration, allowing vector-quality exports with embedded logos
- Proper logo positioning and sizing in SVG exports
- Corrected coordinate system handling to ensure QR codes maintain proper dimensions
- All logo shape options (square, rounded square, circle) now work correctly in SVG exports
- SVG logo embedding for higher quality when using SVG source files

## [1.5.0] - 2025-03-23

### Added
- SVG export functionality for QR codes without logos
- Visual indicator informing users that logos are not supported in SVG exports
- Button state management that automatically disables SVG download when a logo is present

### Changed
- Updated download section UI to clearly guide users toward PNG format for QR codes with logos
- Enhanced user experience by preventing generation of broken SVG files

### Technical
- Implemented vector-based SVG export that maintains quality at any scale
- Added proper handling of QR code paths to ensure correct rendering across different viewers

## [1.4.0] - 2025-03-23

### Added
- Custom logo integration feature for embedding brand logos in QR codes
- Logo upload support for PNG, JPEG, SVG, and other image formats
- Logo size adjustment slider (10-40% of QR code size)
- Logo shape options (square, rounded square, circle)
- Custom background color options with transparency support
- Automatic error correction level adjustment to maintain scanability
- Visual feedback for optimal logo size settings
- Responsive design for logo customization interface on all devices

### Changed
- Enhanced error correction level indicator with clearer visual feedback
- Improved download functions for better browser compatibility
- Updated design tab with more intuitive layout for logo settings

## [1.3.0] - 2025-03-22

### Added
- Dark mode support with automatic system preference detection
- Theme toggle switch in the application header
- Persistent theme preference using local storage
- New "Night Mode" color scheme optimized for dark backgrounds
- Automatic QR code color adjustments for better visibility in dark mode
- Transition effects for smoother theme switching
- Dark mode styling for all UI components and form fields
- Accessibility improvements for theme toggle

### Changed
- Enhanced contrast and readability in both light and dark themes
- Improved visual hierarchy in dark mode
- Updated error and success message styling for better visibility in dark mode
- Reorganized application header to include theme toggle

## [1.2.0] - 2025-03-22

### Added
- Error correction level adjustment feature allowing users to select between Low (L), Medium (M), Quartile (Q), and High (H) levels
- Visual indicator showing current error correction level in the preview

## [1.1.1] - 2025-03-21

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