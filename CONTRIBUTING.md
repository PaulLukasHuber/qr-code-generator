# Contributing to QR Code Generator

Thank you for considering contributing to the QR Code Generator project! This document provides guidelines and steps for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone. Please be kind and constructive in your communications and contributions.

## How Can I Contribute?

### Reporting Bugs

- Use the [Bug Report](https://github.com/paullukashuber/qr-code-generator/issues/new?template=bug_report.md) template
- Check if the bug has already been reported
- Include detailed steps to reproduce the issue
- Add screenshots if applicable
- Specify your environment (browser, OS, etc.)

### Suggesting Features

- Use the [Feature Request](https://github.com/paullukashuber/qr-code-generator/issues/new?template=feature_request.md) template
- Check if the feature has already been suggested
- Explain why this feature would be useful
- Provide mockups or examples if possible

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/qr-code-generator.git

# Navigate to the project
cd qr-code-generator

# Install dependencies
npm install

# Start development server
npm run dev
```

## Project Structure

- `/src` - Source code
  - `/components` - React components
    - `/qr-code` - QR code specific components
    - `/ui` - Reusable UI components
  - `/lib` - Utility functions
- `/public` - Static assets
- `/docs` - Documentation

## Coding Guidelines

### JavaScript/React

- Use functional components with hooks
- Follow the project's naming conventions
- Document your components with JSDoc comments
- Keep components focused on a single responsibility

### CSS/Styling

- Use Tailwind CSS for styling
- Follow the existing class naming patterns
- Use CSS variables for theming

## Testing

- Write tests for new functionality
- Make sure all tests pass before submitting a PR
- Run tests with `npm test`

## Documentation

- Update documentation for any changed functionality
- Add JSDoc comments to components and functions
- Update the CHANGELOG.md for user-facing changes

## Questions?

If you have any questions about contributing, please open an issue or reach out to the maintainers.

Thank you for your contributions!