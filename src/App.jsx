import React, { Suspense } from 'react';
import QRCodeGenerator from './components/qr-code/QRCodeGenerator';
import ThemeToggle from './components/ui/theme-toggle';
import AccessibilityMenu from './components/ui/accessibility-menu';
import KeyboardShortcuts from './components/ui/keyboard-shortcuts';
import { ThemeProvider } from './context/ThemeContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import './styles/accessibility.css';

const APP_VERSION = '1.7.0';

function App() {
  return (
    <ThemeProvider>
      <AccessibilityProvider>
        {/* Skip link for keyboard users */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        
        <div className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <header className="max-w-4xl mx-auto mb-6 flex justify-between items-center" role="banner">
            <div className="flex items-center">
              <KeyboardShortcuts />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">QR-Code Generator</h1>
            <div className="flex items-center gap-2">
              <AccessibilityMenu />
              <ThemeToggle />
            </div>
          </header>
          
          <main id="main-content" tabIndex="-1" role="main">
            <Suspense fallback={<div className="text-center p-8 text-gray-800 dark:text-gray-300" aria-live="polite">Loading QR Code Generator...</div>}>
              <QRCodeGenerator />
            </Suspense>
          </main>
          
          <footer className="max-w-4xl mx-auto mt-12 pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400 text-sm" role="contentinfo">
            <p>
              © {new Date().getFullYear()} Paul-Lukas Huber | Version {APP_VERSION} | 
              <a 
                href="https://github.com/paullukashuber/qr-code-generator" 
                className="underline hover:text-gray-700 dark:hover:text-gray-300 ml-1"
                aria-label="GitHub repository"
              >
                GitHub
              </a>
            </p>
          </footer>
        </div>
      </AccessibilityProvider>
    </ThemeProvider>
  );
}
export default App;