import React, { useEffect, useState } from 'react';
import { useAccessibility } from '@/context/AccessibilityContext';
import { Keyboard } from 'lucide-react';
import { Button } from './button';

/**
 * KeyboardShortcuts component provides keyboard shortcut information
 * and manages global keyboard shortcuts for the application
 */
const KeyboardShortcuts = () => {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { announce } = useAccessibility();
  
  const keyboardShortcuts = [
    { key: 'Alt + A', description: 'Open accessibility menu' },
    { key: 'Alt + T', description: 'Switch theme (light/dark)' },
    { key: 'Alt + Q', description: 'Focus QR code content' },
    { key: 'Alt + C', description: 'Focus color options' },
    { key: 'Alt + S', description: 'Focus size slider' },
    { key: 'Alt + D', description: 'Download QR code (PNG)' },
    { key: 'Alt + E', description: 'Open export options' },
    { key: 'Alt + /', description: 'Show keyboard shortcuts' },
    { key: 'Escape', description: 'Close any open dialog or menu' },
    { key: 'Tab', description: 'Navigate through elements' },
    { key: 'Shift + Tab', description: 'Navigate backward through elements' },
  ];
  
  // Handle global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only process if Alt key is pressed for most shortcuts
      if (event.altKey) {
        switch (event.key.toLowerCase()) {
          case 'a':
            // Toggle accessibility menu
            document.querySelector('[aria-label="Accessibility options"]')?.click();
            event.preventDefault();
            break;
            
          case 't':
            // Toggle theme
            document.querySelector('[aria-label="Switch to light mode"], [aria-label="Switch to dark mode"]')?.click();
            event.preventDefault();
            break;
            
          case 'q':
            // Focus QR code content
            document.getElementById('text')?.focus();
            event.preventDefault();
            break;
            
          case 'c':
            // Focus color options
            document.getElementById('fgColor')?.focus();
            event.preventDefault();
            break;
            
          case 's':
            // Focus size slider
            document.getElementById('size')?.focus();
            event.preventDefault();
            break;
            
          case 'd':
            // Download QR code (PNG)
            // Find PNG download button and click it
            const pngButton = Array.from(document.querySelectorAll('button'))
              .find(btn => btn.textContent.includes('PNG'));
            pngButton?.click();
            event.preventDefault();
            break;
            
          case 'e':
            // Focus export options
            const exportButton = Array.from(document.querySelectorAll('button'))
              .find(btn => btn.textContent.includes('Export'));
            exportButton?.focus();
            event.preventDefault();
            break;
            
          case '/':
            // Show keyboard shortcuts
            setShowShortcuts(true);
            event.preventDefault();
            break;
        }
      } else if (event.key === 'Escape' && showShortcuts) {
        // Close shortcuts dialog with Escape key
        setShowShortcuts(false);
        event.preventDefault();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showShortcuts, announce]);
  
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowShortcuts(true)}
        className="rounded-full w-9 h-9 p-0"
        aria-label="Show keyboard shortcuts"
        title="Keyboard shortcuts"
      >
        <Keyboard className="h-5 w-5" />
      </Button>
      
      {/* Keyboard shortcuts modal */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
            role="dialog"
            aria-labelledby="shortcuts-title"
            aria-modal="true"
          >
            <h2 
              id="shortcuts-title"
              className="text-xl font-bold mb-4 dark:text-white"
            >
              Keyboard Shortcuts
            </h2>
            
            <div className="max-h-[60vh] overflow-y-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="text-left py-2 px-3 dark:text-gray-200">Key Combination</th>
                    <th className="text-left py-2 px-3 dark:text-gray-200">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {keyboardShortcuts.map((shortcut, index) => (
                    <tr key={index} className="border-t dark:border-gray-700">
                      <td className="py-2 px-3 font-mono text-sm dark:text-gray-300">{shortcut.key}</td>
                      <td className="py-2 px-3 dark:text-gray-300">{shortcut.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={() => setShowShortcuts(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KeyboardShortcuts;