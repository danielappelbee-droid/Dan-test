import { useState, useEffect } from 'react';

export function useDarkMode() {
  // Default to dark mode for canvas
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Apply dark mode class to body for CSS targeting
    if (isDarkMode) {
      document.body.classList.add('canvas-dark-mode');
      document.body.classList.remove('canvas-light-mode');
    } else {
      document.body.classList.add('canvas-light-mode');
      document.body.classList.remove('canvas-dark-mode');
    }

    // Cleanup function to remove canvas-specific classes when component unmounts
    return () => {
      document.body.classList.remove('canvas-dark-mode', 'canvas-light-mode');
    };
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Helper function to get theme-aware class
  const getThemeClass = (lightClass: string, darkClass: string) => {
    return isDarkMode ? darkClass : lightClass;
  };

  // Helper function to get background color style
  const getBackgroundStyle = (lightBg: string, darkBg: string) => {
    return { backgroundColor: isDarkMode ? darkBg : lightBg };
  };

  // Helper function to get text color style
  const getTextStyle = (lightColor: string, darkColor: string) => {
    return { color: isDarkMode ? darkColor : lightColor };
  };

  return {
    isDarkMode,
    toggleDarkMode,
    getThemeClass,
    getBackgroundStyle,
    getTextStyle
  };
}