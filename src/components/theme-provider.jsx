'use client';
import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

const Theme = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system'
};

const ThemeProviderProps = {
  children: React.ReactNode,
  defaultTheme: Theme
};

const ThemeProviderState = {
  theme: Theme,
  setTheme: (theme) => null
};

const initialState = {
  theme: Theme.SYSTEM,
  setTheme: () => null
};

const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({ children, defaultTheme = Theme.SYSTEM }) {
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(Theme.LIGHT, Theme.DARK);

    if (theme === Theme.SYSTEM) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? Theme.DARK
        : Theme.LIGHT;
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme) => {
      setTheme(theme);
      localStorage.setItem('theme', theme);
    }
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};