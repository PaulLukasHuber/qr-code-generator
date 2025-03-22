import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Initialize theme state
  const [theme, setTheme] = useState('light');

  // Check for user's preference on initial load
  useEffect(() => {
    // Check localStorage first for saved preference
    const storedTheme = localStorage.getItem('theme');
    
    // If no stored preference, check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme === 'dark') {
      setTheme('dark');
    } else if (storedTheme === 'light') {
      setTheme('light');
    } else if (prefersDark) {
      setTheme('dark');
    }
  }, []);

  // Update HTML class and localStorage when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Function to toggle between light and dark mode
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}