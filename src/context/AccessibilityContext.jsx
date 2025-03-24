import React, { createContext, useContext, useEffect, useState } from 'react';

// Create context
const AccessibilityContext = createContext();

/**
 * AccessibilityProvider component that manages accessibility settings
 * and provides them to all child components
 */
export function AccessibilityProvider({ children }) {
  // Initialize accessibility states
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('medium'); // 'small', 'medium', 'large', 'x-large'
  const [reducedMotion, setReducedMotion] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [focusVisible, setFocusVisible] = useState(true);

  // Check for user's system preferences on initial load
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setReducedMotion(true);
    }

    // Check for contrast preference
    const prefersHighContrast = window.matchMedia('(prefers-contrast: more)').matches;
    if (prefersHighContrast) {
      setHighContrast(true);
    }

    // Setup keyboard navigation detection
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        setFocusVisible(true);
      }
    };
    
    const handleMouseDown = () => {
      setFocusVisible(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Apply high contrast mode
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    localStorage.setItem('highContrast', highContrast ? 'true' : 'false');
  }, [highContrast]);

  // Apply font size
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove any existing font size classes
    root.classList.remove('text-size-small', 'text-size-medium', 'text-size-large', 'text-size-x-large');
    
    // Add the selected font size class
    root.classList.add(`text-size-${fontSize}`);
    
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  // Apply reduced motion
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    localStorage.setItem('reducedMotion', reducedMotion ? 'true' : 'false');
  }, [fontSize]);

  // Handle screen reader announcements
  const announce = (message, assertive = false) => {
    const id = Date.now();
    // Add new announcement
    setAnnouncements((prev) => [...prev, { id, message, assertive }]);
    
    // Remove announcement after it's been read (5 seconds)
    setTimeout(() => {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    }, 5000);
  };

  // Create context value
  const contextValue = {
    // State
    highContrast,
    fontSize,
    reducedMotion,
    announcements,
    focusVisible,
    
    // Functions to update state
    setHighContrast,
    setFontSize,
    setReducedMotion,
    announce,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
      
      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" role="status">
        {announcements
          .filter((a) => !a.assertive)
          .map((a) => (
            <div key={a.id}>{a.message}</div>
          ))}
      </div>
      <div className="sr-only" aria-live="assertive" role="alert">
        {announcements
          .filter((a) => a.assertive)
          .map((a) => (
            <div key={a.id}>{a.message}</div>
          ))}
      </div>
    </AccessibilityContext.Provider>
  );
}

// Custom hook to use accessibility context
export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}