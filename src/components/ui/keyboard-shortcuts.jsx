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
    { key: 'Alt + Q', description: 'Focus QR code content (Content tab)' },
    { key: 'Alt + C', description: 'Focus color options (Design tab)' },
    { key: 'Alt + S', description: 'Focus size slider (Settings tab)' },
    { key: 'Alt + D', description: 'Download QR code as PNG' },
    { key: 'Alt + E', description: 'Open export options' },
    { key: 'Alt + /', description: 'Show keyboard shortcuts' },
    { key: 'Escape', description: 'Close any open dialog or menu' },
    { key: 'Tab', description: 'Navigate through elements' },
    { key: 'Shift + Tab', description: 'Navigate backward through elements' },
  ];
  
  // MOST DIRECT approach - get tab by looking through text content only
  const forceTabSwitch = (tabNameToFind) => {
    console.log(`Attempting to find tab: "${tabNameToFind}"`);
    
    // 1. Look for any element that contains the tab name text
    const allElements = Array.from(document.querySelectorAll('*'));
    
    // Find buttons that have the tab name text
    const matchingElements = allElements.filter(el => {
      const text = el.textContent && el.textContent.trim().toLowerCase();
      const matchesTabName = text === tabNameToFind.toLowerCase() || 
                          text.includes(tabNameToFind.toLowerCase());
      return el.tagName === 'BUTTON' && matchesTabName;
    });
    
    console.log(`Found ${matchingElements.length} potential tab elements for "${tabNameToFind}"`);
    
    // If we find matching elements, click the first one
    if (matchingElements.length > 0) {
      console.log('Clicking tab element:', matchingElements[0]);
      matchingElements[0].click();
      
      // Try to directly set the activeTab state if it's accessible
      try {
        // This is a direct approach that might work if the tab state is in a global var
        if (window.setActiveTab) {
          window.setActiveTab(tabNameToFind);
        }
        
        // If there's a dispatch function for any redux/context state
        if (window.dispatch) {
          window.dispatch({ type: 'SET_ACTIVE_TAB', payload: tabNameToFind });
        }
      } catch (e) {
        console.log('Could not directly set tab state:', e);
      }
      
      return true;
    }
    
    // 2. As a fallback, look for elements with tab-related attributes
    const tabsByAttribute = document.querySelectorAll(
      `[data-tab-name="${tabNameToFind}"], [aria-controls*="${tabNameToFind}"], [id*="${tabNameToFind}"]`
    );
    
    if (tabsByAttribute.length > 0) {
      console.log('Found tab by attribute:', tabsByAttribute[0]);
      tabsByAttribute[0].click();
      return true;
    }
    
    // 3. Last resort: try using JavaScript to directly change tab content visibility
    try {
      // Try to find the tab content directly and make it visible
      const tabContent = document.getElementById(`${tabNameToFind}-tab-content`);
      if (tabContent) {
        console.log('Found tab content, trying to make it visible:', tabContent);
        
        // Hide all tab contents
        document.querySelectorAll('[id$="-tab-content"]').forEach(tc => {
          tc.style.display = 'none';
          tc.setAttribute('aria-hidden', 'true');
        });
        
        // Show this tab content
        tabContent.style.display = 'block';
        tabContent.setAttribute('aria-hidden', 'false');
        
        return true;
      }
    } catch (e) {
      console.log('Error trying to directly manipulate tab content:', e);
    }
    
    console.warn(`Could not find or activate tab: "${tabNameToFind}"`);
    return false;
  };
  
  // Focus an element after a delay (to allow tab switching to complete)
  const focusElementWithDelay = (selector, fallbackSelector, description, delay = 300) => {
    setTimeout(() => {
      const element = document.querySelector(selector) || 
                     (fallbackSelector ? document.querySelector(fallbackSelector) : null);
      
      if (element) {
        // First scroll to it if needed
        element.scrollIntoView({ behavior: 'auto', block: 'center' });
        // Then focus it
        element.focus();
        announce(`Focused ${description}`);
        console.log(`Focused: ${description}`, element);
      } else {
        console.warn(`Could not find element to focus: ${selector}`);
        announce(`Could not find ${description} to focus`);
      }
    }, delay);
  };
  
  // Handle global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Log all Alt key combinations for debugging
      if (event.altKey) {
        console.log(`Alt + ${event.key} pressed (key code: ${event.keyCode})`);
      }
      
      // Only process if Alt key is pressed for most shortcuts
      if (event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
        let handled = true;

        switch (event.key.toLowerCase()) {
          case 'a':
            console.log('Alt+A: Opening accessibility menu');
            document.querySelector('[aria-label="Accessibility options"]')?.click();
            break;
            
          case 't':
            console.log('Alt+T: Toggling theme');
            document.querySelector('[aria-label="Switch to light mode"], [aria-label="Switch to dark mode"]')?.click();
            break;
            
          case 'q':
            console.log('Alt+Q: Switching to Content tab');
            if (forceTabSwitch('content')) {
              announce('Switched to Content tab');
              focusElementWithDelay('#text', 'input[placeholder*="https"]', 'QR code content field');
            } else {
              announce('Failed to switch to Content tab');
            }
            break;
            
          case 'c':
            console.log('Alt+C: Switching to Design tab');
            if (forceTabSwitch('design')) {
              announce('Switched to Design tab');
              focusElementWithDelay('#fgColor', 'input[type="color"]', 'color selection');
            } else {
              announce('Failed to switch to Design tab');
            }
            break;
            
          case 's':
            console.log('Alt+S: Switching to Settings tab');
            if (forceTabSwitch('settings')) {
              announce('Switched to Settings tab');
              
              // Use a longer delay and more specific selector for the slider
              setTimeout(() => {
                // Try first to find the thumb element directly
                const sliderThumb = 
                  document.querySelector('[role="slider"]') || 
                  document.querySelector('[data-testid="slider-thumb"]') ||
                  document.querySelector('[class*="SliderThumb"]') ||
                  document.querySelector('[class*="slider-thumb"]');
                
                // If thumb not found, try the slider container
                const sliderElement = 
                  sliderThumb ||
                  document.querySelector('#size') || 
                  document.querySelector('input[type="range"]') ||
                  document.querySelector('.SliderRoot') ||
                  document.querySelector('[class*="slider"]');
                
                if (sliderElement) {
                  console.log('Found slider element:', sliderElement);
                  
                  // First make sure it's visible
                  sliderElement.scrollIntoView({ behavior: 'auto', block: 'center' });
                  
                  // Try forcing focus with a small additional delay
                  setTimeout(() => {
                    // Force focus and add a visible focus style
                    sliderElement.focus();
                    
                    // If we focused on the container but there's a thumb, try to focus the thumb
                    if (!sliderThumb) {
                      // Look for thumb within the slider element, if it's a container
                      const thumbInContainer = sliderElement.querySelector('[role="slider"]');
                      if (thumbInContainer) {
                        thumbInContainer.focus();
                        console.log('Focused slider thumb within container');
                      }
                    }
                    
                    announce('Focused on size slider');
                    console.log('Focused slider element');
                  }, 50);
                } else {
                  console.warn('Could not find slider element');
                  announce('Could not find size slider');
                }
              }, 500); // Longer delay to ensure tab content is fully rendered
            } else {
              announce('Failed to switch to Settings tab');
            }
            break;
            
          case 'd':
            console.log('Alt+D: Finding PNG download button');
            const pngButtons = Array.from(document.querySelectorAll('button'))
              .filter(btn => btn.textContent.includes('PNG'));
            if (pngButtons.length > 0) {
              pngButtons[0].click();
              announce("Downloaded QR code as PNG");
            } else {
              announce("Could not find PNG download button");
              handled = false;
            }
            break;
            
          case 'e':
            console.log('Alt+E: Finding export options');
            const exportButtons = Array.from(document.querySelectorAll('button, h3'))
              .filter(el => el.textContent.toLowerCase().includes('export'));
            
            if (exportButtons.length > 0) {
              exportButtons[0].focus();
              announce("Focused on export options");
            } else {
              announce("Could not find export button");
              handled = false;
            }
            break;
            
          case '/':
            console.log('Alt+/: Showing keyboard shortcuts');
            setShowShortcuts(true);
            announce("Opened keyboard shortcuts panel");
            break;
            
          default:
            handled = false;
        }
        
        if (handled) {
          // Stop the event from propagating or triggering browser shortcuts
          event.preventDefault();
          event.stopPropagation();
        }
      } else if (event.key === 'Escape' && showShortcuts) {
        setShowShortcuts(false);
        announce("Closed keyboard shortcuts panel");
        event.preventDefault();
      }
    };
    
    // Add the event listener - use capturing phase to ensure our handler runs first
    document.addEventListener('keydown', handleKeyDown, true);
    
    console.log('🔑 Keyboard shortcuts initialized and ready');
    
    // Remove the event listener on cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [showShortcuts, announce]);
  
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setShowShortcuts(true);
          announce("Opened keyboard shortcuts panel");
        }}
        className="rounded-full w-9 h-9 p-0 relative"
        aria-label="Show keyboard shortcuts"
        title="Keyboard shortcuts"
      >
        <Keyboard className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] font-bold px-1 py-0.5 rounded-full">BETA</span>
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
                onClick={() => {
                  setShowShortcuts(false);
                  announce("Closed keyboard shortcuts panel");
                }}
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