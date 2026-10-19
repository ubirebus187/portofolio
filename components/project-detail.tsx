'use client';
import { useMemo } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { asset } from '../lib/assets';
import { localizedContent,interfaceText } from '../lib/portfolio-i18n';
import { useSitePreferences } from '../lib/use-site-preferences';
import { SiteControls } from './site-controls';
import type { Content } from '../lib/schema';
export function ProjectDetail({content,slug}:{content:Content;slug:string}){
  const {locale,setLocale,theme,setTheme}=useSitePreferences();
  const t=interfaceText[locale];
  const localized=useMemo(()=>localizedContent(content,locale),[content,locale]);
  const p=localized.projects.find(x=>x.slug===slug);
  if(!p)return null;
  return <>
    <header className="detail-header"><div className="container detail-header-inner"><a className="brand" href="/" aria-label={t.home}>ma<span>/</span></a><SiteControls locale={locale} setLocale={setLocale} theme={theme} setTheme={setTheme}/></div></header>
    <main className="container project-detail"><a className="text-link" href="/#proyek"><ArrowLeft size={16}/>{t.detailsBack}</a>
      <p className="eyebrow">{p.category}{p.year&&` / ${p.year}`}</p><h1>{p.title}</h1><p className="lead">{p.summary}</p>
      {p.image&&<img className="detail-cover" src={asset(p.image)} alt={`${t.image} ${p.title}`}/>}
      <div className="detail-columns"><section><h2>{t.detailsAbout}</h2><p className="preserve-lines">{p.description}</p>{p.gallery.map((url,i)=><img key={i} className="detail-cover" src={asset(url)} alt={`${t.image} ${p.title} ${i+1}`} loading="lazy"/>)}</section>
        <aside>{p.role&&<><span className="eyebrow">{t.myRole}</span><p>{p.role}</p></>}{p.technologies.length>0&&<><span className="eyebrow">{t.technologies}</span><div className="tags">{p.technologies.map(x=><span key={x}>{x}</span>)}</div></>}
          <div className="actions">{p.demoUrl&&<a className="button primary" href={asset(p.demoUrl)} target="_blank" rel="noopener noreferrer">{t.openProject}<ArrowUpRight size={16}/></a>}{p.repositoryUrl&&<a className="button secondary" href={p.repositoryUrl} target="_blank" rel="noopener noreferrer">{t.repository}<ArrowUpRight size={16}/></a>}</div>
        </aside></div><footer className="footer"><p>{localized.profile.name}</p><a href={`mailto:${localized.profile.email}`}>{t.contact} ↗</a></footer>
    </main>
  </>;
}
