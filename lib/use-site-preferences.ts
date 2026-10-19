'use client';
import { useEffect, useSyncExternalStore } from 'react';
import {
  applySitePreferences, getLocale, getTheme, getServerLocale, getServerTheme,
  setSiteLocale, setSiteTheme, subscribeToSitePreferences,
} from './site-preferences-store';
export type { Theme } from './site-preferences-store';

/** Language and theme always reflect the browser's current saved preferences. */
export function useSitePreferences() {
  const locale = useSyncExternalStore(subscribeToSitePreferences, getLocale, getServerLocale);
  const theme = useSyncExternalStore(subscribeToSitePreferences, getTheme, getServerTheme);
  // Covers initial hydration, including preference changes made in other tabs.
  useEffect(() => { applySitePreferences(); }, [locale, theme]);
  return { locale, theme, setLocale: setSiteLocale, setTheme: setSiteTheme };
}
