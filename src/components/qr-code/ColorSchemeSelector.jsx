import React from 'react';
import { Label } from '../ui/label';

/**
 * Komponente zur Auswahl von Farbschemata für QR-Codes
 * 
 * Zeigt eine Reihe von vordefinierten Farbkombinationen an, die mit einem Klick
 * auf den QR-Code angewendet werden können.
 * 
 * @param {Object} props - Die Komponenten-Props
 * @param {Function} props.onSelectScheme - Callback-Funktion, die mit den ausgewählten Farben aufgerufen wird
 */
const ColorSchemeSelector = ({ onSelectScheme }) => {
  // Vordefinierte Farbschemata
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
    }
  ];

  return (
    <div className="space-y-2">
      <Label>Farbschemata</Label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {COLOR_SCHEMES.map((scheme, index) => (
          <div 
            key={index}
            className="cursor-pointer rounded-md border p-2 hover:border-primary transition-colors flex flex-col h-[4.5rem]"
            onClick={() => onSelectScheme(scheme.fg, scheme.bg)}
            title={scheme.description}
          >
            <div className="flex items-center gap-2 mb-1">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: scheme.fg }}
              />
              <div 
                className="w-4 h-4 rounded-full border" 
                style={{ backgroundColor: scheme.bg }}
              />
            </div>
            <span className="text-xs font-medium w-full block break-words min-h-[2rem] text-left hyphens-auto">{scheme.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorSchemeSelector;