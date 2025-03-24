import React, { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './button';
import { useTheme } from '@/context/ThemeContext';
import { useAccessibility } from '@/context/AccessibilityContext';

/**
 * Enhanced theme toggle button component
 * Toggles between light and dark mode with appropriate icons
 * Includes accessibility enhancements and announcements
 */
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { announce } = useAccessibility();

  // Handle keyboard shortcut (Alt+T)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === 't') {
        toggleTheme();
        e.preventDefault();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleTheme]);

  // Theme toggle with announcement
  const handleToggleTheme = () => {
    toggleTheme();
    announce(`Switched to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleTheme}
      className="rounded-full w-9 h-9 p-0"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={theme === 'dark'}
      data-testid="theme-toggle"
    >
      <span className="sr-only">
        {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      </span>
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-yellow-200" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" aria-hidden="true" />
      )}
    </Button>
  );
};

export default ThemeToggle;