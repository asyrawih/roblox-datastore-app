import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    const initialTheme = (saved as Theme) || 'dark';

    // Immediately apply theme on initialization to prevent flash
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(initialTheme);
    document.documentElement.style.colorScheme = initialTheme;

    return initialTheme;
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    // Set color-scheme to match the selected theme to prevent system override
    document.documentElement.style.colorScheme = theme;

    console.log('Theme changed to:', theme);
    console.log('Document classes:', document.documentElement.className);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
