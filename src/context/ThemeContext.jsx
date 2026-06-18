import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * @typedef {Object} ThemeContextValue
 * @property {boolean} isLightMode
 * @property {() => void} toggleTheme
 */

const STORAGE_KEY = 'startup-crm-theme';

/**
 * Reads the persisted theme preference from localStorage.
 * Returns false (dark mode) by default when no preference is stored.
 *
 * @returns {boolean} Whether light mode is active.
 */
const getStoredTheme = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'light';
  } catch {
    return false;
  }
};

/**
 * Stores global theme state and actions.
 *
 * @type {React.Context<ThemeContextValue|null>}
 */
export const ThemeContext = createContext(null);

/**
 * Provides theme state to the application and syncs the document root class.
 * Dark mode is the default. When isLightMode is true the 'dark' class is
 * removed from the root element, revealing Tailwind's base (light) styles.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {React.JSX.Element} The provider-wrapped React subtree.
 */
export const ThemeProvider = ({ children }) => {
  const [isLightMode, setIsLightMode] = useState(getStoredTheme);

  // Sync the document root class whenever the state changes.
  useEffect(() => {
    const root = document.documentElement;

    if (isLightMode) {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  }, [isLightMode]);

  /**
   * Toggles between light and dark mode, persisting the choice.
   *
   * @returns {void}
   */
  const toggleTheme = useCallback(() => {
    setIsLightMode((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? 'light' : 'dark');
      } catch {
        // Silently ignore write errors (e.g. private browsing).
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      isLightMode,
      toggleTheme,
    }),
    [isLightMode, toggleTheme]
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
