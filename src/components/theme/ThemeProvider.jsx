import React, { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useModernStore } from '../../stores/modernStore';
import { themeManager } from '../../services/themeManager';

export const ThemeProvider = ({ children }) => {
  const { darkMode } = useModernStore();

  useEffect(() => {
    themeManager.init();
  }, []);

  useEffect(() => {
    themeManager.applyTheme(darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return <>{children}</>;
};

export const ThemeToggle = () => {
  const { darkMode, setDarkMode } = useModernStore();

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <Sun size={20} style={{ color: 'var(--color-text)' }} />
      ) : (
        <Moon size={20} style={{ color: 'var(--color-text)' }} />
      )}
    </button>
  );
};

export default ThemeProvider;
