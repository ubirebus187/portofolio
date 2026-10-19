'use client';
import { asset } from '../lib/assets';
import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import { ArrowUpRight,ArrowDown,Download,Menu,X,Code2,Server,Gamepad2,Mail,Phone,MapPin,ExternalLink,ChevronRight } from 'lucide-react';
import { localizedContent,interfaceText } from '../lib/portfolio-i18n';
import { useSitePreferences } from '../lib/use-site-preferences';
import { SiteControls } from './site-controls';
import type { Content,Project } from '../lib/schema';

export function Portfolio({content}:{content:Content;preview?:boolean}) {
  const {locale,setLocale,theme,setTheme} = useSitePreferences();
  const t=interfaceText[locale];
  const {profile,projects,experience,education,skillGroups,certificates}=useMemo(()=>localizedContent(content,locale),[content,locale]);
  const [menu,setMenu]=useState(false),[filter,setFilter]=useState('all'),[showAll,setShowAll]=useState(false);
  const heroRef=useRef<HTMLDivElement>(null);
  const mainRef=useRef<HTMLElement>(null);
  const published=projects.filter(p=>p.status==='published');
  const categories=[...new Set(published.map(p=>p.category))];
  const visible=published.filter(p=>filter==='all'||p.category===filter);
  const featured=visible.slice().sort((a,b)=>Number(b.featured)-Number(a.featured));
  useEffect(()=>{setFilter('all');setShowAll(false);},[locale]);

  // Reveal content only after the observer is active. With JS disabled, all content stays visible.
  useEffect(()=>{
    const root=mainRef.current;
    if(!root||!('IntersectionObserver' in window))return;
    const elements=Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}
    },{threshold:.09,rootMargin:'0px 0px -30px 0px'});
    elements.forEach(el=>observer.observe(el));
    root.classList.add('motion-ready');
    return ()=>{observer.disconnect();root.classList.remove('motion-ready');};
  },[locale,filter,showAll]);

  function onHeroMove(e:PointerEvent<HTMLDivElement>){
    if(e.pointerType==='touch'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const rect=e.currentTarget.getBoundingClientRect();
    const x=(e.clientX-rect.left)/rect.width-.5;
    const y=(e.clientY-rect.top)/rect.height-.5;
    heroRef.current?.style.setProperty('--rotate-x',`${(-y*8).toFixed(2)}deg`);
    heroRef.current?.style.setProperty('--rotate-y',`${(x*8).toFixed(2)}deg`);
    heroRef.current?.style.setProperty('--light-x',`${(x+.5)*100}%`);
    heroRef.current?.style.setProperty('--light-y',`${(y+.5)*100}%`);
  }
  function resetHero(){heroRef.current?.style.setProperty('--rotate-x','0deg');heroRef.current?.style.setProperty('--rotate-y','0deg');}
  const onFilter=(value:string)=>{setFilter(value);setShowAll(false);};

  return <>
    <a className="skip-link" href="#utama">{t.skip}</a>
    <header className="site-header"><div className="container header-inner">
      <a href="/" className="brand" aria-label={`${profile.name} · ${t.home}`}>ma<span>/</span><small>{profile.name.toUpperCase()}</small></a>
      <nav className={menu?'site-nav open':'site-nav'} id="main-nav" aria-label={t.navigation}>
        <a href="#proyek" onClick={()=>setMenu(false)}>{t.work}</a><a href="#pengalaman" onClick={()=>setMenu(false)}>{t.experience}</a><a href="#tentang" onClick={()=>setMenu(false)}>{t.about}</a>
        <a className="nav-contact" href="#kontak" onClick={()=>setMenu(false)}>{t.contact}<ArrowUpRight size={16}/></a>
      </nav>
      <SiteControls locale={locale} setLocale={setLocale} theme={theme} setTheme={setTheme}/>
      <button className="icon-button mobile-toggle" aria-label={menu?'Tutup menu':'Buka menu'} aria-controls="main-nav" aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X size={21}/>:<Menu size={21}/>}</button>
    </div></header>
    <main id="utama" ref={mainRef}>
      <section className="container hero">
        <div className="hero-copy"><div className="eyebrow"><span className="blue-line"/>{profile.headline}</div>
          <h1>{profile.name.split(' ').slice(0,-1).join(' ')}<br/><span>{profile.name.split(' ').slice(-1)}</span><span className="hero-dot">.</span></h1>
          <p className="hero-description">{profile.intro}</p>
          <div className="actions"><a className="button primary" href="#proyek">{t.explore}<ArrowUpRight size={18}/></a>{profile.cvUrl&&<a className="button secondary" href={asset(profile.cvUrl)} download>{t.downloadCV}<Download size={17}/></a>}</div>
          <div className="hero-foot"><span>WEB DEVELOPMENT</span><span>ROBLOX</span><span>IT OPERATIONS</span></div>
        </div>
        <div className="hero-scene" onPointerMove={onHeroMove} onPointerLeave={resetHero} aria-label={`${profile.name} · ${profile.headline}`}>
          <div className="hero-art" ref={heroRef}>
            <div className="art-shimmer" aria-hidden="true"/>
            <span className="art-orbit art-orbit-one" aria-hidden="true"/><span className="art-orbit art-orbit-two" aria-hidden="true"/>
            <span className="art-monogram" aria-hidden="true">ma.</span>
            <div className="art-top"><span>ENGINEERING / CREATIVE</span><span>01 — 03</span></div>
            <div className="photo-frame"><img className="profile-photo" src={asset(profile.photo||'/profile/muhamad-aliamsyah.jpg')} alt={`${profile.name} · portrait`} fetchPriority="high"/></div>
            <div className="art-cube" aria-hidden="true"><i/><i/><i/><i/><i/><i/></div>
            <span className="art-floating-label" aria-hidden="true">BUILD · CREATE · SOLVE</span>
            <div className="art-caption"><p>{t.artOne}<br/><strong>{t.artTwo}</strong></p><span className="round-arrow"><ArrowUpRight size={27}/></span></div>
            <div className="art-bottom"><span>DEVELOP · TEST · DEPLOY</span><span>↗</span></div>
          </div>
        </div>
      </section>
      <div className="container expertise-strip"><p><Code2 size={20}/><span>Full-stack development</span></p><p><Gamepad2 size={20}/><span>Roblox experiences</span></p><p><Server size={20}/><span>IT & infrastructure</span></p><a href="#proyek" aria-label={t.explore}><ArrowDown size={20}/></a></div>
      <section id="proyek" className="container section-block">
        <div className="section-heading" data-reveal><div><p className="eyebrow">{t.workEyebrow}</p><h2>{t.workTitle1}<br/>{t.workTitle2}<span>.</span></h2></div><p>{t.workLead}</p></div>
        <div className="filter-bar" aria-label={locale==='id'?'Filter kategori proyek':'Project category filters'}><button className={filter==='all'?'filter active':'filter'} aria-pressed={filter==='all'} onClick={()=>onFilter('all')}>{t.all}<span>{published.length}</span></button>{categories.map(c=><button key={c} className={filter===c?'filter active':'filter'} aria-pressed={filter===c} onClick={()=>onFilter(c)}>{c}<span>{published.filter(p=>p.category===c).length}</span></button>)}</div>
        <div className="project-grid">{(showAll?featured:featured.slice(0,4)).map((p,i)=><ProjectCard key={p.id} project={p} index={i} imageAlt={t.image} viewLabel={t.projectView}/>)}</div>
        {visible.length===0&&<p className="empty-state">{t.empty}</p>}
        {featured.length>4&&<div className="center-action"><button className="button secondary" onClick={()=>setShowAll(!showAll)}>{showAll?t.showLess:`${t.viewAll} (${featured.length})`}<ArrowDown size={16}/></button></div>}
      </section>
      <section id="pengalaman" className="experience-section"><div className="container experience-layout"><div className="section-heading vertical" data-reveal><p className="eyebrow">{t.experienceEyebrow}</p><h2>{t.experienceTitle1}<br/>{t.experienceTitle2}<span>.</span></h2><p>{t.experienceLead}</p><a className="text-link" href="/cv">{t.viewCV}<ArrowUpRight size={16}/></a></div>
        <div className="timeline">{experience.map((x,i)=><article key={x.id} className="timeline-item" data-reveal><span className={i===0?'timeline-dot current':'timeline-dot'}/><div className="timeline-meta"><span>{x.period}</span><span>{String(i+1).padStart(2,'0')}</span></div><h3>{x.role}</h3><p className="company">{x.company}</p><p>{x.description}</p></article>)}</div>
      </div></section>
      <section id="tentang" className="container section-block"><div className="about-grid"><div data-reveal><p className="eyebrow">{t.aboutEyebrow}</p><h2>{t.aboutTitle1}<br/>{t.aboutTitle2}<span>.</span></h2></div><div className="about-copy" data-reveal><p>{profile.about}</p>{education.map(x=><div className="education" key={x.id}><span className="eyebrow">{t.education}</span><h3>{x.institution}</h3><p>{x.degree}</p><small>{x.period}{x.detail&&` · ${x.detail}`}</small></div>)}</div></div>
        <div className="skill-grid">{skillGroups.map((g,i)=><div className="skill-card" key={g.id} data-reveal><span className="skill-index">0{i+1}</span><h3>{g.title}</h3><div className="tags">{g.items.map((s,j)=><span key={j}>{s}</span>)}</div></div>)}</div>
        {certificates.length>0&&<div className="certificates"><h3>{t.certificates}</h3>{certificates.map(c=><article key={c.id}>{c.image&&<img src={asset(c.image)} alt={c.title} loading="lazy"/>}<div><h4>{c.title}</h4><p>{c.issuer}{c.date&&` · ${c.date}`}</p>{c.url&&<a href={c.url} target="_blank" rel="noopener noreferrer">{t.certificateLink}<ExternalLink size={14}/></a>}</div></article>)}</div>}
      </section>
      <section id="kontak" className="contact-section"><div className="container contact-inner"><div data-reveal><p className="eyebrow">{t.contactEyebrow}</p><h2>{t.contactTitle1}<br/>{t.contactTitle2}<span>↗</span></h2><p>{t.contactLead}</p>{profile.availability&&<p>{profile.availability}</p>}</div><div className="contact-links" data-reveal><a href={`mailto:${profile.email}`}><Mail size={20}/><span><small>EMAIL</small>{profile.email}</span><ArrowUpRight/></a>{profile.phone&&<a href={`tel:${profile.phone}`}><Phone size={20}/><span><small>{t.phone}</small>{profile.phone}</span><ArrowUpRight/></a>}{profile.location&&<p><MapPin size={18}/>{profile.location}</p>}<div className="social-links">{profile.github&&<a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}{profile.linkedin&&<a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>}</div></div></div></section>
    </main><footer className="container footer"><a href="/" className="brand" aria-label={t.home}>ma<span>/</span></a><p>© {new Date().getFullYear()} {profile.name}</p><a href="#">{t.backTop} ↑</a></footer>
  </>;
}

function ProjectCard({project:p,index,imageAlt,viewLabel}:{project:Project;index:number;imageAlt:string;viewLabel:string}) {
  return <article className="project-card" data-reveal><a className="project-image" href={`/proyek/${p.slug}`} aria-label={`${viewLabel} ${p.title}`}>
    {p.image?<img src={asset(p.image)} alt={`${imageAlt} ${p.title}`} loading="lazy"/>:<div className="image-placeholder"><Code2 size={48}/></div>}
    <span className="project-number">{String(index+1).padStart(2,'0')}</span><span className="project-open"><ArrowUpRight size={23}/></span></a>
    <div className="project-info"><span className="eyebrow">{p.category}{p.year&&` / ${p.year}`}</span><h3><a href={`/proyek/${p.slug}`}>{p.title}</a><ChevronRight size={18}/></h3><p>{p.summary}</p>{p.technologies.length>0&&<div className="tags">{p.technologies.slice(0,4).map(x=><span key={x}>{x}</span>)}</div>}</div></article>;
}
