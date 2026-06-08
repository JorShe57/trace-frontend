'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'trace.theme';
const listeners = new Set<() => void>();

function emitThemeChange() {
  listeners.forEach((listener) => listener());
}

function readTheme(): Theme {
  const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === 'dark' || stored === 'light') return stored;
  if (window.matchMedia?.('(prefers-color-scheme: light)').matches) return 'light';
  return 'dark';
}

function subscribeTheme(callback: () => void) {
  listeners.add(callback);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) callback();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', onStorage);
  };
}

/**
 * Theme state, persisted to localStorage and reflected onto
 * <html data-theme="…">. Dark is the default (the field aesthetic).
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setTheme = useCallback((next: Theme | ((current: Theme) => Theme)) => {
    const value = typeof next === 'function' ? next(readTheme()) : next;
    window.localStorage.setItem(STORAGE_KEY, value);
    document.documentElement.setAttribute('data-theme', value);
    emitThemeChange();
  }, []);

  const toggle = useCallback(() => {
    setTheme(readTheme() === 'dark' ? 'light' : 'dark');
  }, [setTheme]);

  return { theme, setTheme, toggle };
}
