// Theme Manager - Dark mode and color scheme support
import { useModernStore } from '../stores/modernStore';

export const themeManager = {
  themes: {
    light: {
      primary: '#1a1a1a',
      secondary: '#c9a961',
      accent: '#ffffff',
      background: '#ffffff',
      surface: '#f5f5f5',
      text: '#1a1a1a',
      textSecondary: '#666666',
      border: '#e0e0e0',
      error: '#d32f2f',
      success: '#388e3c',
      warning: '#f57c00',
      info: '#1976d2',
    },
    dark: {
      primary: '#ffffff',
      secondary: '#d4af37',
      accent: '#000000',
      background: '#121212',
      surface: '#1e1e1e',
      text: '#ffffff',
      textSecondary: '#b0b0b0',
      border: '#333333',
      error: '#ff5252',
      success: '#66bb6a',
      warning: '#ffb74d',
      info: '#42a5f5',
    },
  },

  init: () => {
    const isDarkMode = useModernStore.getState().darkMode;
    themeManager.applyTheme(isDarkMode ? 'dark' : 'light');
  },

  applyTheme: (themeName) => {
    const theme = themeManager.themes[themeName];
    const root = document.documentElement;

    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply to body
    document.body.style.backgroundColor = theme.background;
    document.body.style.color = theme.text;

    // Save preference
    localStorage.setItem('theme', themeName);
  },

  toggleDarkMode: () => {
    const isDarkMode = useModernStore.getState().darkMode;
    const newMode = !isDarkMode;

    useModernStore.getState().setDarkMode(newMode);
    themeManager.applyTheme(newMode ? 'dark' : 'light');

    return newMode;
  },

  getCurrentTheme: () => {
    return useModernStore.getState().darkMode ? 'dark' : 'light';
  },

  getThemeColors: () => {
    const theme = useModernStore.getState().darkMode ? 'dark' : 'light';
    return themeManager.themes[theme];
  },

  createCSSVariables: () => {
    const theme = themeManager.themes[useModernStore.getState().darkMode ? 'dark' : 'light'];
    return Object.entries(theme)
      .map(([key, value]) => `--color-${key}: ${value};`)
      .join('\n');
  },
};

export default themeManager;
