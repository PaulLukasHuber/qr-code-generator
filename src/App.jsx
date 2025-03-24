import React, { Suspense } from 'react';
import QRCodeGenerator from './components/qr-code/QRCodeGenerator';
import ThemeToggle from './components/ui/theme-toggle';
import { ThemeProvider } from './context/ThemeContext';

const APP_VERSION = '1.6.0';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <header className="max-w-4xl mx-auto mb-6 flex justify-between items-center">
          <div></div> {/* Empty div for alignment */}
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">QR-Code Generator</h1>
          <ThemeToggle />
        </header>
        
        <main>
          <Suspense fallback={<div className="text-center p-8 text-gray-800 dark:text-gray-300">Loading QR Code Generator...</div>}>
            <QRCodeGenerator />
          </Suspense>
        </main>
        
        <footer className="max-w-4xl mx-auto mt-12 pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>
            © {new Date().getFullYear()} Paul-Lukas Huber | Version {APP_VERSION} | 
            <a href="https://github.com/paullukashuber/qr-code-generator" className="underline hover:text-gray-700 dark:hover:text-gray-300 ml-1">
              GitHub
            </a>
          </p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;