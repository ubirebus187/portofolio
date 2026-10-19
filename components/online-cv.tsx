'use client';
import { useMemo } from 'react';
import { asset } from '../lib/assets';
import { localizedContent,interfaceText } from '../lib/portfolio-i18n';
import { useSitePreferences } from '../lib/use-site-preferences';
import { SiteControls } from './site-controls';
import { PrintButton } from './print-button';
import type { Content } from '../lib/schema';
export function OnlineCV({content}:{content:Content}){
  const {locale,setLocale,theme,setTheme}=useSitePreferences();
  const t=interfaceText[locale];
  const c=useMemo(()=>localizedContent(content,locale),[content,locale]);
  return <main className="cv-sheet"><div className="print-tools"><a className="text-link" href="/">← {t.cvBack}</a><div className="cv-tools"><SiteControls locale={locale} setLocale={setLocale} theme={theme} setTheme={setTheme}/><PrintButton label={locale==='id'?'Cetak / Simpan PDF':'Print / Save PDF'}/></div></div>
    <header className="cv-profile"><div><h1>{c.profile.name}</h1><p>{c.profile.headline}</p><p>{[c.profile.email,c.profile.phone,c.profile.location].filter(Boolean).join(' · ')}</p></div><img src={asset(c.profile.photo||'/profile/muhamad-aliamsyah.jpg')} alt={c.profile.name}/></header>
    <section><h2>{t.cvProfile}</h2><p>{c.profile.intro}</p></section>
    <section><h2>{t.cvExperience}</h2>{c.experience.map(x=><article key={x.id}><h3>{x.role} | {x.company}</h3><small>{x.period}</small><p>{x.description}</p></article>)}</section>
    <section><h2>{t.cvEducation}</h2>{c.education.map(x=><article key={x.id}><h3>{x.degree} | {x.institution}</h3><p>{x.period} · {x.detail}</p></article>)}</section>
    <section><h2>{t.cvSkills}</h2>{c.skillGroups.map(x=><p key={x.id}><strong>{x.title}: </strong>{x.items.join(', ')}</p>)}</section>
    {c.certificates.length>0&&<section><h2>{t.cvCertificates}</h2>{c.certificates.map(x=><p key={x.id}>{x.title} · {x.issuer} ({x.date})</p>)}</section>}
  </main>;
}
