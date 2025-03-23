import React from 'react';
import { Label } from '../ui/label';
import { useTheme } from '@/context/ThemeContext';

/**
 * Komponente zur Auswahl von Farbschemata für QR-Codes
 * Mit Unterstützung für Dark Mode
 */
const ColorSchemeSelector = ({ onSelectScheme }) => {
  const { theme } = useTheme();
  
  // Vordefinierte Farbschemata mit zusätzlichen Dark Mode Optionen
  const COLOR_SCHEMES = [
    { 
      name: 'Standard', 
      fg: '#000000', 
      bg: '#FFFFFF',
      description: 'Klassisches Schwarz auf Weiß für optimale Scanbarkeit'
    },
    { 
      name: 'Hoher Kontrast', 
      fg: '#000000', 
      bg: '#FFFF00',
      description: 'Schwarz auf Gelb für bessere Sichtbarkeit und Barrierefreiheit'
    },
    { 
      name: 'Elegant', 
      fg: '#1E3A8A', 
      bg: '#F8FAFC',
      description: 'Dunkles Blau auf hellem Hintergrund für professionelle Anwendungen'
    },
    { 
      name: 'Dunkel', 
      fg: '#E2E8F0', 
      bg: '#1E293B',
      description: 'Heller Vordergrund auf dunklem Hintergrund für moderne Designs'
    },
    { 
      name: 'Minze', 
      fg: '#065F46', 
      bg: '#ECFDF5',
      description: 'Grün-Töne für frische, organische Erscheinung'
    },
    { 
      name: 'Coral', 
      fg: '#9F1239', 
      bg: '#FFF1F2',
      description: 'Warme Rot-Töne für auffälligen, lebendigen Look'
    },
    { 
      name: 'Blaugrau', 
      fg: '#334155', 
      bg: '#F1F5F9',
      description: 'Dezente neutrale Töne für zurückhaltende Anwendungen'
    },
    { 
      name: 'Kontrast Plus', 
      fg: '#312E81', 
      bg: '#E0E7FF',
      description: 'Verstärkter Kontrast für bessere Lesbarkeit bei unterschiedlichen Lichtverhältnissen'
    },
    // New color scheme optimized for dark mode
    { 
      name: 'Nachtmodus', 
      fg: '#FFFFFF', 
      bg: '#2E3440',
      description: 'Optimiert für dunkle Umgebungen und Dark Mode'
    },
  ];

  return (
    <div className="space-y-2">
      <Label className="dark:text-gray-200">Farbschemata</Label>
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