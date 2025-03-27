import React, { useState, useRef, useEffect } from 'react';
import { Label } from '../ui/label';
import { useTheme } from '@/context/ThemeContext';
import { useAccessibility } from '@/context/AccessibilityContext';

/**
 * Component for selecting color schemes for QR codes
 * Enhanced with keyboard accessibility
 */
const ColorSchemeSelector = ({ onSelectScheme }) => {
  const { theme } = useTheme();
  const { announce } = useAccessibility();
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const schemeRefs = useRef([]);
  
  // Predefined color schemes
  const COLOR_SCHEMES = [
    { 
      name: 'Standard', 
      fg: '#000000', 
      bg: '#FFFFFF',
      description: 'Classic black on white for optimal scannability'
    },
    { 
      name: 'High Contrast', 
      fg: '#000000', 
      bg: '#FFFF00',
      description: 'Black on yellow for better visibility and accessibility'
    },
    { 
      name: 'Elegant', 
      fg: '#1E3A8A', 
      bg: '#F8FAFC',
      description: 'Dark blue on light background for professional applications'
    },
    { 
      name: 'Dark', 
      fg: '#E2E8F0', 
      bg: '#1E293B',
      description: 'Light foreground on dark background for modern designs'
    },
    { 
      name: 'Mint', 
      fg: '#065F46', 
      bg: '#ECFDF5',
      description: 'Green tones for fresh, organic appearance'
    },
    { 
      name: 'Coral', 
      fg: '#9F1239', 
      bg: '#FFF1F2',
      description: 'Warm red tones for vibrant, eye-catching look'
    },
    { 
      name: 'Blue-gray', 
      fg: '#334155', 
      bg: '#F1F5F9',
      description: 'Subtle neutral tones for understated applications'
    },
    { 
      name: 'Contrast Plus', 
      fg: '#312E81', 
      bg: '#E0E7FF',
      description: 'Enhanced contrast for better readability in various lighting conditions'
    },
    { 
      name: 'Purple Accent', 
      fg: '#4C1D95', 
      bg: '#F5F3FF',
      description: 'Elegant purple tones for a sophisticated appearance'
    },
    { 
      name: 'Earth Tones', 
      fg: '#7C2D12', 
      bg: '#FEF3C7',
      description: 'Natural, warm colors for eco-friendly or organic contexts'
    },
    { 
      name: 'Neon Teal', 
      fg: '#0D9488', 
      bg: '#ECFDF5',
      description: 'Vibrant modern look for high visibility and engagement'
    },
    { 
      name: 'Night Mode', 
      fg: '#FFFFFF', 
      bg: '#2E3440',
      description: 'Optimized for dark environments and dark mode'
    },
  ];

  // Initialize refs array when number of schemes changes
  useEffect(() => {
    schemeRefs.current = schemeRefs.current.slice(0, COLOR_SCHEMES.length);
    while (schemeRefs.current.length < COLOR_SCHEMES.length) {
      schemeRefs.current.push(React.createRef());
    }
  }, [COLOR_SCHEMES.length]);

  // Handle keyboard navigation
  const handleKeyDown = (e, index) => {
    const numCols = window.innerWidth >= 640 ? 4 : 2; // sm:grid-cols-4 for larger screens, grid-cols-2 for smaller
    const numRows = Math.ceil(COLOR_SCHEMES.length / numCols);
    
    let newIndex = focusedIndex;
    
    switch (e.key) {
      case 'ArrowRight':
        newIndex = index + 1;
        if (newIndex >= COLOR_SCHEMES.length) newIndex = 0;
        e.preventDefault();
        break;
      case 'ArrowLeft':
        newIndex = index - 1;
        if (newIndex < 0) newIndex = COLOR_SCHEMES.length - 1;
        e.preventDefault();
        break;
      case 'ArrowDown':
        newIndex = index + numCols;
        if (newIndex >= COLOR_SCHEMES.length) {
          // Wrap to the beginning of the next column or the start
          newIndex = (index % numCols) + (newIndex - COLOR_SCHEMES.length);
          if (newIndex >= COLOR_SCHEMES.length) newIndex = index % numCols;
        }
        e.preventDefault();
        break;
      case 'ArrowUp':
        newIndex = index - numCols;
        if (newIndex < 0) {
          // Wrap to the end of the previous column or the end
          const lastRowItemCount = COLOR_SCHEMES.length % numCols;
          const lastRowIndex = lastRowItemCount === 0 ? 
                              COLOR_SCHEMES.length - numCols : 
                              COLOR_SCHEMES.length - lastRowItemCount;
          const colPosition = index % numCols;
          newIndex = lastRowIndex + colPosition;
          if (newIndex >= COLOR_SCHEMES.length) newIndex = COLOR_SCHEMES.length - 1;
        }
        e.preventDefault();
        break;
      case 'Home':
        newIndex = 0;
        e.preventDefault();
        break;
      case 'End':
        newIndex = COLOR_SCHEMES.length - 1;
        e.preventDefault();
        break;
      case 'Enter':
      case ' ': // Space
        onSelectScheme(COLOR_SCHEMES[index].fg, COLOR_SCHEMES[index].bg);
        announce(`Selected ${COLOR_SCHEMES[index].name} color scheme`);
        e.preventDefault();
        break;
      default:
        return; // Don't handle other keys
    }
    
    // Update focus if index changed
    if (newIndex !== index && newIndex >= 0 && newIndex < COLOR_SCHEMES.length) {
      setFocusedIndex(newIndex);
      schemeRefs.current[newIndex]?.focus();
      announce(`${COLOR_SCHEMES[newIndex].name} color scheme. ${COLOR_SCHEMES[newIndex].description}. Press Enter to select.`);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="dark:text-gray-200" id="color-schemes-label">Color Schemes</Label>
      <div 
        className="grid grid-cols-2 sm:grid-cols-4 gap-2" 
        role="grid" 
        aria-labelledby="color-schemes-label"
      >
        {COLOR_SCHEMES.map((scheme, index) => (
          <div 
            key={index}
            ref={el => schemeRefs.current[index] = el}
            className={`cursor-pointer rounded-md border dark:border-gray-700 p-2 hover:border-primary dark:hover:border-primary transition-colors flex flex-col h-[4.5rem] bg-white dark:bg-gray-800 ${
              focusedIndex === index ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-900' : ''
            }`}
            onClick={() => {
              onSelectScheme(scheme.fg, scheme.bg);
              announce(`Selected ${scheme.name} color scheme`);
            }}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(-1)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            tabIndex="0" // Make focusable
            role="gridcell"
            aria-label={`${scheme.name}: ${scheme.description}`}
            title={scheme.description}
          >
            <div className="flex items-center gap-2 mb-1">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: scheme.fg }}
                aria-hidden="true"
              />
              <div 
                className="w-4 h-4 rounded-full border dark:border-gray-600" 
                style={{ backgroundColor: scheme.bg }}
                aria-hidden="true"
              />
            </div>
            <span className="text-xs font-medium w-full block break-words min-h-[2rem] text-left hyphens-auto dark:text-gray-300">
              {scheme.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorSchemeSelector;