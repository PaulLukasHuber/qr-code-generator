import React, { useState, useRef, useEffect } from 'react';
import { useAccessibility } from '@/context/AccessibilityContext';
import { Button } from './button';
import { 
  Accessibility, 
  Eye, 
  Type, 
  MoveHorizontal, 
  ChevronDown, 
  Check 
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * AccessibilityMenu component provides user controls for accessibility features
 * Includes high contrast mode, font size adjustment, and reduced motion options
 */
const AccessibilityMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    highContrast,
    setHighContrast,
    fontSize,
    setFontSize,
    reducedMotion,
    setReducedMotion,
    announce
  } = useAccessibility();
  
  const menuRef = useRef(null);
  
  // Handle clicks outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  // Handle Escape key to close menu
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);
  
  const toggleMenu = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (newState) {
      announce('Accessibility menu opened');
    }
  };
  
  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    announce(`High contrast mode ${newValue ? 'enabled' : 'disabled'}`);
  };
  
  const toggleReducedMotion = () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    announce(`Reduced motion ${newValue ? 'enabled' : 'disabled'}`);
  };
  
  const changeFontSize = (size) => {
    setFontSize(size);
    announce(`Font size set to ${size}`);
  };
  
  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className="rounded-full w-9 h-9 p-0 relative"
        aria-expanded={isOpen}
        aria-label="Accessibility options"
        title="Accessibility options"
      >
        <Accessibility className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] font-bold px-1 py-0.5 rounded-full">BETA</span>
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg rounded-md z-50">
          <div className="p-3 border-b dark:border-gray-700">
            <h3 className="font-medium text-sm dark:text-gray-200">Accessibility Options</h3>
          </div>
          
          <div className="p-3 space-y-4">
            {/* High Contrast */}
            <div>
              <button
                onClick={toggleHighContrast}
                className="flex items-center justify-between w-full p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-pressed={highContrast}
              >
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm dark:text-gray-200">High Contrast</span>
                </div>
                <div className={cn(
                  "w-8 h-4 rounded-full transition-colors", 
                  highContrast ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                )}>
                  <div className={cn(
                    "w-3 h-3 rounded-full bg-white transform transition-transform mt-0.5",
                    highContrast ? "translate-x-4" : "translate-x-1"
                  )} />
                </div>
              </button>
            </div>
            
            {/* Font Size */}
            <div>
              <div className="flex items-center mb-2">
                <Type className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                <span className="text-sm dark:text-gray-200">Font Size</span>
              </div>
              <div className="flex space-x-1 mt-1">
                {['small', 'medium', 'large', 'x-large'].map((size) => (
                  <button
                    key={size}
                    onClick={() => changeFontSize(size)}
                    className={cn(
                      "flex-1 py-1 px-2 text-xs rounded-md border transition-colors",
                      fontSize === size 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "bg-transparent dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                    aria-pressed={fontSize === size}
                  >
                    <span className="sr-only">Font size </span>
                    {size === 'small' ? 'S' : size === 'medium' ? 'M' : size === 'large' ? 'L' : 'XL'}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Reduced Motion */}
            <div>
              <button
                onClick={toggleReducedMotion}
                className="flex items-center justify-between w-full p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-pressed={reducedMotion}
              >
                <div className="flex items-center">
                  <MoveHorizontal className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm dark:text-gray-200">Reduced Motion</span>
                </div>
                <div className={cn(
                  "w-8 h-4 rounded-full transition-colors", 
                  reducedMotion ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                )}>
                  <div className={cn(
                    "w-3 h-3 rounded-full bg-white transform transition-transform mt-0.5",
                    reducedMotion ? "translate-x-4" : "translate-x-1"
                  )} />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityMenu;