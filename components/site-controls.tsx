'use client';
import { Moon, Sun } from 'lucide-react';
import { interfaceText, type Locale } from '../lib/portfolio-i18n';
import type { Theme } from '../lib/site-preferences-store';

/** Language and appearance controls shared by home, project pages and CV. */
export function SiteControls({locale,setLocale,theme,setTheme}:{
  locale:Locale;
  setLocale:(value:Locale)=>void;
  theme:Theme;
  setTheme:(value:Theme)=>void;
}) {
  const t=interfaceText[locale];
  const isDark=theme==='dark';
  return <div className="site-controls" data-testid="site-controls">
    <div className="language-switch" role="group" aria-label={t.language}>
      <button type="button" lang="id" data-testid="switch-id" aria-label="Bahasa Indonesia" title="Bahasa Indonesia" aria-pressed={locale==='id'} className={locale==='id'?'selected':''} onClick={()=>setLocale('id')}>ID</button>
      <button type="button" lang="en" data-testid="switch-en" aria-label="English" title="English" aria-pressed={locale==='en'} className={locale==='en'?'selected':''} onClick={()=>setLocale('en')}>EN</button>
    </div>
    <button type="button" className="theme-switch" data-testid="switch-theme" onClick={()=>setTheme(isDark?'light':'dark')} aria-pressed={isDark} aria-label={isDark?t.themeLight:t.themeDark} title={isDark?t.themeLight:t.themeDark}>
      {isDark?<Sun size={17} aria-hidden="true"/>:<Moon size={17} aria-hidden="true"/>}
      <span className="theme-label" aria-hidden="true">{isDark?(locale==='id'?'Gelap':'Dark'):(locale==='id'?'Terang':'Light')}</span>
    </button>
    <span className="sr-only" aria-live="polite">{locale==='id'?'Bahasa Indonesia':'English'}; {isDark?(locale==='id'?'Mode gelap aktif':'Dark mode active'):(locale==='id'?'Mode terang aktif':'Light mode active')}</span>
  </div>;
}
