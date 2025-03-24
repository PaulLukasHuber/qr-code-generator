# Accessibility Documentation for QR Code Generator

This document outlines the accessibility features implemented in the QR Code Generator application and provides guidelines for maintaining and improving accessibility as the application evolves.

## Accessibility Features

### Keyboard Navigation
- **Skip Link**: Press Tab when the page loads to reveal a "Skip to main content" link
- **Keyboard Focus**: All interactive elements are accessible via keyboard
- **Visible Focus Indicator**: Focus outlines are visible for keyboard users
- **Logical Tab Order**: Elements are navigable in a logical sequence
- **Keyboard Shortcuts**: Various keyboard shortcuts to enhance navigation efficiency:
  - `Alt + /`: View all keyboard shortcuts
  - `Alt + A`: Open accessibility menu
  - `Alt + T`: Switch between light and dark themes
  - `Alt + Q`: Focus on QR code content input
  - `Alt + C`: Focus on color selection
  - `Alt + S`: Focus on size slider
  - `Alt + D`: Download QR code as PNG
  - `Alt + E`: Focus on export options
  - `Escape`: Close any open dialog or menu

### Visual Adjustments
- **High Contrast Mode**: Increases text and UI element contrast for better visibility
- **Font Size Adjustment**: Four text size options (Small, Medium, Large, X-Large)
- **Dark Mode**: Lower light emission option with dark background
- **Reduced Motion**: Minimizes animations and transitions
- **Color Schemes**: Various color schemes with sufficient contrast ratios

### Screen Reader Support
- **Semantic HTML**: Proper HTML5 semantic elements (`<header>`, `<main>`, `<footer>`, etc.)
- **ARIA Attributes**: Appropriate ARIA roles, states, and properties
- **Live Regions**: Announcements for dynamic content changes
- **Alternative Text**: Text descriptions for all visual elements
- **Screen Reader Announcements**: Important actions are announced to screen reader users

## Implementation Details

### Accessibility Provider
The application uses a central `AccessibilityProvider` context to manage accessibility settings:

- **High Contrast Mode**: Enhanced visual contrast for users with low vision
- **Font Size Adjustment**: User-configurable text sizing
- **Reduced Motion**: Respects user preferences for reduced animation
- **Screen Reader Announcements**: Manages announcements for screen readers

### Semantic Structure
- Proper heading hierarchy (`<h1>`, `<h2>`, etc.)
- Semantic landmarks (header, main, footer)
- Descriptive button and form labels
- Logical document structure

### ARIA Implementation
- `aria-label` for elements without visible text
- `aria-live` regions for dynamic content
- `aria-expanded` for expandable sections
- `aria-hidden` for decorative elements
- `aria-modal` for dialogs

### CSS Considerations
- Base styling does not rely solely on color to convey information
- Focus styles are clearly visible
- Text has sufficient contrast against backgrounds
- Interactive elements have adequate touch targets

## Compliance

The QR Code Generator aims to conform to [WCAG 2.1 Level AA](https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_customize&levels=aaa) standards, which include:

1. **Perceivable**: Information must be presentable to users in ways they can perceive
2. **Operable**: User interface components must be operable
3. **Understandable**: Information and operation must be understandable
4. **Robust**: Content must be robust enough to be interpreted by a wide variety of user agents

## Testing Guidelines

To ensure the application remains accessible, employ these testing strategies:

### Keyboard Testing
- Navigate using only keyboard (Tab, Shift+Tab, Enter, Space, Arrow keys)
- Verify all functionality is available without a mouse
- Ensure focus visibility at all times
- Test keyboard shortcuts

### Screen Reader Testing
- Test with popular screen readers (NVDA, JAWS, VoiceOver)
- Verify all content is announced correctly
- Check that dynamic updates are properly announced
- Ensure dialogs and menus work correctly

### Visual Testing
- Test with high contrast mode enabled
- Verify functionality at various font sizes
- Check color contrast meets WCAG standards (minimum 4.5:1 for normal text)
- Test with browser zoom up to 200%

## Maintaining Accessibility

When adding new features:

1. Ensure keyboard operability
2. Add appropriate ARIA attributes
3. Test with screen readers
4. Verify contrast ratios
5. Add descriptive labels and instructions
6. Document any necessary accessibility details

## Resources

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/)
- [MDN Accessibility Documentation](https://developer.mozilla.org/en-US/docs/Web/Accessibility)