import React from 'react';
import { Label } from '../ui/label';
import { useTheme } from '@/context/ThemeContext';

/**
 * Component for selecting color schemes for QR codes
 */
const ColorSchemeSelector = ({ onSelectScheme }) => {
  const { theme } = useTheme();
  
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
      name: 'Night Mode', 
      fg: '#FFFFFF', 
      bg: '#2E3440',
      description: 'Optimized for dark environments and dark mode'
    },
  ];

  return (
    <div className="space-y-2">
      <Label className="dark:text-gray-200">Color Schemes</Label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {COLOR_SCHEMES.map((scheme, index) => (
          <div 
            key={index}
            className="cursor-pointer rounded-md border dark:border-gray-700 p-2 hover:border-primary dark:hover:border-primary transition-colors flex flex-col h-[4.5rem] bg-white dark:bg-gray-800"
            onClick={() => onSelectScheme(scheme.fg, scheme.bg)}
            title={scheme.description}
          >
            <div className="flex items-center gap-2 mb-1">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: scheme.fg }}
              />
              <div 
                className="w-4 h-4 rounded-full border dark:border-gray-600" 
                style={{ backgroundColor: scheme.bg }}
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