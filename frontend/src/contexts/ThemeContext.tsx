'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'theme-preference';

function getInitialTheme(): boolean {
  if (typeof window === 'undefined') return false;

  const stored = localStorage.getItem(THEME_KEY);
  if (stored) {
    return stored === 'dark';
  }

  // Check if dark class is already on document (from initial script)
  return document.documentElement.classList.contains('dark');
}

function applyThemeToDOM(isDark: boolean) {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize on mount
  useEffect(() => {
    const initialTheme = getInitialTheme();
    setIsDarkMode(initialTheme);
    applyThemeToDOM(initialTheme);
    setMounted(true);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(currentValue => {
      const newValue = !currentValue;

      // Update localStorage first
      localStorage.setItem(THEME_KEY, newValue ? 'dark' : 'light');

      // Update DOM
      applyThemeToDOM(newValue);

      console.log('Theme toggled:', newValue ? 'dark' : 'light');

      return newValue;
    });
  }, []);

  // Ensure DOM stays in sync
  useEffect(() => {
    if (mounted) {
      applyThemeToDOM(isDarkMode);
    }
  }, [isDarkMode, mounted]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeStore(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeStore must be used within a ThemeProvider');
  }
  return context;
}
