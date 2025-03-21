import React, { Suspense } from 'react';
import QRCodeGenerator from './components/qr-code/QRCodeGenerator';

const APP_VERSION = '1.0.2';

function App() {
  return (
    <div className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <header className="max-w-4xl mx-auto mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">QR-Code Generator</h1>
      </header>
      
      <main>
        <Suspense fallback={<div className="text-center p-8">Lade QR-Code Generator...</div>}>
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
  );
}

export default App;