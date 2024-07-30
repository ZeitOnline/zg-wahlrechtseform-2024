import {useEffect, useState} from 'react';
import useMediaQuery from './useMediaQuery';

function getThemeBySystemPreference() {
  if (typeof window === 'undefined') return undefined;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function getThemeByUserPreference() {
  if (typeof window === 'undefined') return undefined;
  if (document.documentElement.classList.contains('color-scheme-dark'))
    return 'dark';
  if (document.documentElement.classList.contains('color-scheme-light'))
    return 'light';
}

function isDarkMode() {
  const userPreference = getThemeByUserPreference();
  const systemPreference = getThemeBySystemPreference();
  if (userPreference !== undefined) {
    return userPreference === 'dark';
  } else {
    return systemPreference === 'dark';
  }
}

let userDarkModeObserver;

/**
 * Returns `true` if dark mode is active. This hook respects both the
 * user settings within ZON as well as the system mode. If the user setting
 * is available it takes precedence over the system mode.
 * Should work with the bookmarklet as well as developer-tools scheme-switching.
 * @returns {boolean}
 */
function useIsDarkMode() {
  const isSystemDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isDark, setIsDark] = useState(isDarkMode());

  useEffect(() => {
    // Update the state if the system mode changes
    setIsDark(isDarkMode());
  }, [isSystemDarkMode]);

  useEffect(() => {
    if (!userDarkModeObserver) {
      // Update the state if the user mode changes
      userDarkModeObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          if (mutation.attributeName == 'class') {
            setIsDark(isDarkMode());
          }
        });
      });

      userDarkModeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }

    return () => {
      userDarkModeObserver.disconnect();
      userDarkModeObserver = null;
    };
  }, []);

  return isDark;
}

export default useIsDarkMode;
