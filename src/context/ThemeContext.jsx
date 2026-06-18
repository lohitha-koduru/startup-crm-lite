import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * @typedef {Object} ThemeContextValue
 * @property {boolean} isDarkMode
 * @property {() => void} toggleTheme
 */

/**
 * Stores global theme state and actions.
 *
 * @type {React.Context<ThemeContextValue|null>}
 */
export const ThemeContext = createContext(null);

/**
 * Provides theme state to the application and syncs the document root class.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {React.JSX.Element} The provider-wrapped React subtree.
 */
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  /**
   * Toggles dark mode on and off.
   *
   * @returns {void}
   */
  const toggleTheme = useCallback(() => {
    setIsDarkMode((currentMode) => !currentMode);
  }, []);

  const value = useMemo(
    () => ({
      isDarkMode,
      toggleTheme,
    }),
    [isDarkMode, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Reads the theme context value.
 *
 * @returns {ThemeContextValue} The theme context value.
 * @throws {Error} When used outside of ThemeProvider.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider.');
  }

  return context;
};
