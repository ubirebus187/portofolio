/**
 * Single client-side source of truth for language and appearance.
 *
 * The DOM changes synchronously with a click, and React subscribers are
 * notified in the same turn. This also keeps multiple control bars (e.g.
 * the studio's preview and the public website) in sync without page reloads.
 */
import type { Locale } from './portfolio-i18n';

export type Theme = 'light' | 'dark';
export const PREFERENCE_KEYS = {
  locale: 'ma-portfolio-locale',
  theme: 'ma-portfolio-theme',
} as const;
const CHANGE_EVENT = 'ma-portfolio-preferences-updated';

// Fallback state makes switches work even if private browsing blocks storage.
let inMemoryLocale: Locale | null = null;
let inMemoryTheme: Theme | null = null;

function getStored(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function remember(key: string, value: string) {
  try { window.localStorage.setItem(key, value); } catch { /* Storage is optional. */ }
}
function prefersDark(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-color-scheme: dark)').matches;
}
export function getLocale(): Locale {
  if (typeof window === 'undefined') return 'id';
  const stored = getStored(PREFERENCE_KEYS.locale);
  return stored === 'en' || stored === 'id' ? stored : inMemoryLocale ?? 'id';
}
export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = getStored(PREFERENCE_KEYS.theme);
  return stored === 'dark' || stored === 'light'
    ? stored : inMemoryTheme ?? (prefersDark() ? 'dark' : 'light');
}

export function applySitePreferences(): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.lang = getLocale();
  root.dataset.theme = getTheme();
}
function notify(): void {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(CHANGE_EVENT));
}
export function setSiteLocale(value: Locale): void {
  if (typeof window === 'undefined') return;
  if (value !== 'id' && value !== 'en') return;
  inMemoryLocale = value;
  remember(PREFERENCE_KEYS.locale, value);
  applySitePreferences();
  notify();
}
export function setSiteTheme(value: Theme): void {
  if (typeof window === 'undefined') return;
  if (value !== 'light' && value !== 'dark') return;
  inMemoryTheme = value;
  remember(PREFERENCE_KEYS.theme, value);
  applySitePreferences();
  notify();
}

export function subscribeToSitePreferences(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const onUpdate = () => { applySitePreferences(); onChange(); };
  window.addEventListener(CHANGE_EVENT, onUpdate);
  window.addEventListener('storage', onUpdate);
  const media = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  media?.addEventListener?.('change', onUpdate);
  // addEventListener('change') is supported by all modern browsers; listeners
  // are optional on legacy embedded browsers to avoid breaking the controls.
  return () => {
    window.removeEventListener(CHANGE_EVENT, onUpdate);
    window.removeEventListener('storage', onUpdate);
    media?.removeEventListener?.('change', onUpdate);
  };
}

// React's hydration snapshot must be identical to the server-rendered HTML.
export const getServerLocale = (): Locale => 'id';
export const getServerTheme = (): Theme => 'light';
