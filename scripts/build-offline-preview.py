#!/usr/bin/env python3
"""Generate a standalone public-site preview without Node or external JS packages.
For the fully functional Next.js app and admin, use npm install && npm run dev.
"""
from pathlib import Path
import base64, json

root=Path(__file__).resolve().parents[1]
public=root/'public'
assets={}
for file in sorted((public/'projects').glob('*.jpg')):
    assets['/projects/'+file.name]='data:image/jpeg;base64,'+base64.b64encode(file.read_bytes()).decode()
photo=public/'profile/muhamad-aliamsyah.jpg'
assets['/profile/muhamad-aliamsyah.jpg']='data:image/jpeg;base64,'+base64.b64encode(photo.read_bytes()).decode()
cv=public/'cv-muhamad-aliamsyah.pdf'
assets['/cv-muhamad-aliamsyah.pdf']='data:application/pdf;base64,'+base64.b64encode(cv.read_bytes()).decode()
seed=json.loads((root/'data/seed.json').read_text())
seed_en=json.loads((root/'data/seed-en.json').read_text())
css=(root/'app/globals.css').read_text().replace("@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');",'')
js=r'''(() => {
  'use strict';
  const base = DATA_BASE;
  const english = DATA_EN;
  const assets = DATA_ASSETS;
  const keys = {locale:'ma-portfolio-locale',theme:'ma-portfolio-theme'};
  let locale='id',theme='light',filter='all',showAll=false;
  // Work even when file:// previews or private-mode browsers deny storage.
  try {locale=localStorage.getItem(keys.locale)==='en'?'en':'id';} catch {}
  try {const saved=localStorage.getItem(keys.theme);theme=saved==='dark'||saved==='light'?saved:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');}
  catch {theme=typeof matchMedia==='function'&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}
  const dict={
    id:{work:'Proyek',experience:'Pengalaman',about:'Tentang',contact:'Mari terhubung', explore:'Jelajahi karya',download:'Unduh CV',art1:'Dari kebutuhan,',art2:'menjadi solusi.', workEyebrow:'01 / PORTOFOLIO',work1:'Karya yang',work2:'berbicara',workLead:'Aplikasi, website, dan pengalaman digital. Jelajahi dokumentasi proyek di bawah ini.',all:'Semua',empty:'Belum ada proyek dalam kategori ini.',less:'Tampilkan lebih sedikit',more:'Lihat semua proyek',expEyebrow:'02 / PENGALAMAN',exp1:'Perjalanan',exp2:'profesional',expLead:'Dari operasional IT hingga pengembangan aplikasi dan pengalaman interaktif.',cv:'Lihat CV online',aboutEyebrow:'03 / TENTANG SAYA',about1:'Teknologi dengan',about2:'tujuan yang jelas',edu:'PENDIDIKAN',cert:'Sertifikasi',contactEyebrow:'PUNYA IDE ATAU KESEMPATAN?',contact1:'Mari mulai',contact2:'percakapan',contactLead:'Hubungi saya untuk membahas proyek, kolaborasi, atau peluang profesional.',phone:'TELEPON',back:'Kembali ke atas',details:'Tentang proyek',close:'Tutup detail',theme:'Ganti mode tampilan'},
    en:{work:'Projects',experience:'Experience',about:'About',contact:"Let's connect",explore:'Explore projects',download:'Download CV',art1:'From ideas,',art2:'to solutions.',workEyebrow:'01 / SELECTED WORK',work1:'Work that',work2:'speaks',workLead:'Apps, websites, and interactive experiences. Explore selected projects below.',all:'All',empty:'No projects found in this category.',less:'Show fewer',more:'View all projects',expEyebrow:'02 / EXPERIENCE',exp1:'My professional',exp2:'journey',expLead:'From IT operations to application engineering and interactive experiences.',cv:'View online CV',aboutEyebrow:'03 / ABOUT ME',about1:'Technology with',about2:'clear purpose',edu:'EDUCATION',cert:'Certifications',contactEyebrow:'HAVE AN IDEA OR OPPORTUNITY?',contact1:"Let's start a",contact2:'conversation',contactLead:'Get in touch to discuss projects, collaboration, or career opportunities.',phone:'PHONE',back:'Back to top',details:'About the project',close:'Close details',theme:'Change appearance'}
  };
  const h=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const url=src=>assets[src]||src||'';
  function translated(section,id,field,val){
    if(locale==='id')return val;
    const source=section==='profile'?base.profile:base[section].find(x=>x.id===id);
    const translation=section==='profile'?english.profile:english[section][id];
    return source?.[field]===val && translation?.[field] ? translation[field]:val;
  }
  function localized(){
    const content=structuredClone(base);
    ['headline','intro','about','availability'].forEach(k=>content.profile[k]=translated('profile',null,k,content.profile[k]));
    for(const section of ['projects','experience','education','skillGroups','certificates']){
      for(const item of content[section]){for(const field of Object.keys(item)){
        if(typeof item[field]==='string')item[field]=translated(section,item.id,field,item[field]);
      }}
    }
    return content;
  }
  function header(c,t){
    document.getElementById('preview-header').innerHTML=`<div class="container header-inner">
      <a class="brand" href="#" aria-label="Home">ma<span>/</span><small>${h(c.profile.name.toUpperCase())}</small></a>
      <nav id="main-nav" class="site-nav" aria-label="Main navigation"><a href="#proyek">${t.work}</a><a href="#pengalaman">${t.experience}</a><a href="#tentang">${t.about}</a><a class="nav-contact" href="#kontak">${t.contact} ↗</a></nav>
      <div class="site-controls" data-testid="site-controls"><div class="language-switch" role="group" aria-label="${locale==='id'?'Pilih bahasa':'Choose language'}"><button type="button" lang="id" data-testid="switch-id" data-lang="id" title="Bahasa Indonesia" aria-label="Bahasa Indonesia" aria-pressed="${locale==='id'}" class="${locale==='id'?'selected':''}">ID</button><button type="button" lang="en" data-testid="switch-en" data-lang="en" title="English" aria-label="English" aria-pressed="${locale==='en'}" class="${locale==='en'?'selected':''}">EN</button></div>
      <button type="button" class="theme-switch" aria-pressed="${theme==='dark'}" aria-label="${locale==='id'?(theme==='dark'?'Aktifkan mode terang':'Aktifkan mode gelap'):(theme==='dark'?'Switch to light mode':'Switch to dark mode')}" id="theme-toggle" data-testid="switch-theme"><span class="theme-icon" aria-hidden="true">${theme==='light'?'☾':'☀'}</span><span class="theme-label">${theme==='dark'?(locale==='id'?'Gelap':'Dark'):(locale==='id'?'Terang':'Light')}</span></button><span class="sr-only" id="site-live-status" aria-live="polite"></span></div>
      <button class="icon-button mobile-toggle" id="menu-toggle" aria-label="Menu" aria-controls="main-nav" aria-expanded="false">☰</button>
    </div>`;
    document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>{
      if(locale===b.dataset.lang)return;
      locale=b.dataset.lang;filter='all';showAll=false;persist();render();
      announce(locale==='id'?'Bahasa Indonesia aktif':'English language active');
    }));
    document.getElementById('theme-toggle').addEventListener('click',()=>{
      theme=theme==='light'?'dark':'light';persist();updateThemeControl();
      announce(theme==='dark'?'Dark mode active':'Light mode active');
    });
    document.getElementById('menu-toggle').addEventListener('click',()=>{const nav=document.getElementById('main-nav');nav.classList.toggle('open');document.getElementById('menu-toggle').setAttribute('aria-expanded',String(nav.classList.contains('open')));});
    document.querySelectorAll('#main-nav a').forEach(el=>el.addEventListener('click',()=>document.getElementById('main-nav').classList.remove('open')));
  }
  function renderProjects(projects,t){
    const published=projects.filter(p=>p.status==='published');
    const categories=[...new Set(published.map(p=>p.category))];
    const chosen=published.filter(p=>filter==='all'||p.category===filter).sort((a,b)=>Number(b.featured)-Number(a.featured));
    const cards=(showAll?chosen:chosen.slice(0,4)).map((p,i)=>`<article class="project-card" data-reveal><button type="button" class="project-image" data-project="${h(p.id)}" aria-label="${h(p.title)}"><img loading="lazy" src="${url(p.image)}" alt="${h(p.title)}"><span class="project-number">${String(i+1).padStart(2,'0')}</span><span class="project-open">↗</span></button>
      <div class="project-info"><span class="eyebrow">${h(p.category)}${p.year?' / '+h(p.year):''}</span><h3><button class="preview-project-name" data-project="${h(p.id)}">${h(p.title)}</button><span>›</span></h3><p>${h(p.summary)}</p>${p.technologies?.length?'<div class="tags">'+p.technologies.slice(0,4).map(x=>'<span>'+h(x)+'</span>').join('')+'</div>':''}</div></article>`).join('');
    return `<div class="filter-bar" aria-label="Project category filters"><button class="filter ${filter==='all'?'active':''}" data-filter="all" aria-pressed="${filter==='all'}">${t.all}<span>${published.length}</span></button>${categories.map(cat=>`<button class="filter ${filter===cat?'active':''}" data-filter="${h(cat)}" aria-pressed="${filter===cat}">${h(cat)}<span>${published.filter(p=>p.category===cat).length}</span></button>`).join('')}</div>
    <div class="project-grid">${cards}</div>${chosen.length===0?'<p class="empty-state">'+t.empty+'</p>':''}${chosen.length>4?`<div class="center-action"><button class="button secondary" id="show-all">${showAll?t.less:t.more+' ('+chosen.length+')'} ↓</button></div>`:''}`;
  }
  function contentMarkup(c,t){
    const published=c.projects;
    const names=c.profile.name.split(' '), last=names.pop();
    return `<section class="container hero"><div class="hero-copy"><div class="eyebrow"><span class="blue-line"></span>${h(c.profile.headline)}</div><h1>${h(names.join(' '))}<br><span>${h(last)}</span><span class="hero-dot">.</span></h1>
      <p class="hero-description">${h(c.profile.intro)}</p><div class="actions"><a href="#proyek" class="button primary">${t.explore} ↗</a><a href="${url(c.profile.cvUrl)}" class="button secondary" download="CV-Muhamad-Aliamsyah.pdf">${t.download} ↓</a></div><div class="hero-foot"><span>WEB DEVELOPMENT</span><span>ROBLOX</span><span>IT OPERATIONS</span></div></div>
    <div class="hero-scene"><div class="hero-art" id="tilting-card"><div class="art-shimmer"></div><span class="art-orbit art-orbit-one"></span><span class="art-orbit art-orbit-two"></span><span class="art-monogram">ma.</span><div class="art-top"><span>ENGINEERING / CREATIVE</span><span>01 — 03</span></div><div class="photo-frame"><img class="profile-photo" src="${url(c.profile.photo||'/profile/muhamad-aliamsyah.jpg')}" alt="${h(c.profile.name)}"></div><div class="art-cube"><i></i><i></i><i></i><i></i><i></i><i></i></div><span class="art-floating-label">BUILD · CREATE · SOLVE</span><div class="art-caption"><p>${t.art1}<br><strong>${t.art2}</strong></p><span class="round-arrow">↗</span></div><div class="art-bottom"><span>DEVELOP · TEST · DEPLOY</span><span>↗</span></div></div></div></section>
    <div class="container expertise-strip"><p><span class="preview-icon">⌘</span>Full-stack development</p><p><span class="preview-icon">♢</span>Roblox experiences</p><p><span class="preview-icon">▤</span>IT & infrastructure</p><a href="#proyek" aria-label="${t.explore}">↓</a></div>
    <section class="container section-block" id="proyek"><div class="section-heading" data-reveal><div><p class="eyebrow">${t.workEyebrow}</p><h2>${t.work1}<br>${t.work2}<span>.</span></h2></div><p>${t.workLead}</p></div><div id="projects-list">${renderProjects(published,t)}</div></section>
    <section class="experience-section" id="pengalaman"><div class="container experience-layout"><div class="section-heading vertical" data-reveal><p class="eyebrow">${t.expEyebrow}</p><h2>${t.exp1}<br>${t.exp2}<span>.</span></h2><p>${t.expLead}</p><a class="text-link" href="${url(c.profile.cvUrl)}" download="CV-Muhamad-Aliamsyah.pdf">${t.cv} ↗</a></div><div class="timeline">${c.experience.map((e,i)=>`<article class="timeline-item" data-reveal><span class="timeline-dot ${i===0?'current':''}"></span><div class="timeline-meta"><span>${h(e.period)}</span><span>${String(i+1).padStart(2,'0')}</span></div><h3>${h(e.role)}</h3><p class="company">${h(e.company)}</p><p>${h(e.description)}</p></article>`).join('')}</div></div></section>
    <section class="container section-block" id="tentang"><div class="about-grid"><div data-reveal><p class="eyebrow">${t.aboutEyebrow}</p><h2>${t.about1}<br>${t.about2}<span>.</span></h2></div><div class="about-copy" data-reveal><p>${h(c.profile.about)}</p>${c.education.map(e=>`<div class="education"><span class="eyebrow">${t.edu}</span><h3>${h(e.institution)}</h3><p>${h(e.degree)}</p><small>${h(e.period)} · ${h(e.detail)}</small></div>`).join('')}</div></div><div class="skill-grid">${c.skillGroups.map((group,i)=>`<div class="skill-card" data-reveal><span class="skill-index">0${i+1}</span><h3>${h(group.title)}</h3><div class="tags">${group.items.map(x=>`<span>${h(x)}</span>`).join('')}</div></div>`).join('')}</div></section>
    <section class="contact-section" id="kontak"><div class="container contact-inner"><div data-reveal><p class="eyebrow">${t.contactEyebrow}</p><h2>${t.contact1}<br>${t.contact2}<span>↗</span></h2><p>${t.contactLead}</p></div><div class="contact-links" data-reveal><a href="mailto:${h(c.profile.email)}"><span class="preview-icon">✉</span><span><small>EMAIL</small>${h(c.profile.email)}</span>↗</a>${c.profile.phone?`<a href="tel:${h(c.profile.phone)}"><span class="preview-icon">⌕</span><span><small>${t.phone}</small>${h(c.profile.phone)}</span>↗</a>`:''}${c.profile.location?`<p>${h(c.profile.location)}</p>`:''}<div class="social-links">${c.profile.github?`<a href="${h(c.profile.github)}">GitHub ↗</a>`:''}${c.profile.linkedin?`<a href="${h(c.profile.linkedin)}">LinkedIn ↗</a>`:''}</div></div></div></section>`;
  }
  function refreshProjectButtons(c,t){
    document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;showAll=false;document.getElementById('projects-list').innerHTML=renderProjects(c.projects,t);refreshProjectButtons(c,t);reveal();}));
    document.getElementById('show-all')?.addEventListener('click',()=>{showAll=!showAll;document.getElementById('projects-list').innerHTML=renderProjects(c.projects,t);refreshProjectButtons(c,t);reveal();});
    document.querySelectorAll('[data-project]').forEach(b=>b.addEventListener('click',()=>{
      const p=c.projects.find(project=>project.id===b.dataset.project);if(!p)return;
      const dialog=document.getElementById('project-dialog');
      dialog.innerHTML=`<div class="preview-modal-body"><button class="modal-close" id="modal-close" aria-label="${t.close}">✕</button><p class="eyebrow">${h(p.category)}</p><h2>${h(p.title)}</h2><img src="${url(p.image)}" alt="${h(p.title)}"><h3>${t.details}</h3><p>${h(p.description)}</p><div class="tags">${p.technologies.map(x=>'<span>'+h(x)+'</span>').join('')}</div></div>`;
      dialog.showModal();document.getElementById('modal-close').onclick=()=>dialog.close();
    }));
  }
  function reveal(){
    const targets=[...document.querySelectorAll('#utama [data-reveal]')];
    if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){targets.forEach(el=>el.classList.add('is-visible'));return;}
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}}),{threshold:.09});
    targets.forEach(el=>observer.observe(el));document.getElementById('utama').classList.add('motion-ready');
  }
  function persist(){
    document.documentElement.dataset.theme=theme;
    document.documentElement.lang=locale;
    try{localStorage.setItem(keys.locale,locale);localStorage.setItem(keys.theme,theme)}catch{}
  }
  function updateThemeControl(){
    const button=document.getElementById('theme-toggle');if(!button)return;
    const dark=theme==='dark';
    const label=locale==='id'?(dark?'Aktifkan mode terang':'Aktifkan mode gelap'):(dark?'Switch to light mode':'Switch to dark mode');
    button.setAttribute('aria-label',label);button.title=label;
    button.setAttribute('aria-pressed',String(dark));
    button.querySelector('.theme-icon').textContent=dark?'☀':'☾';
    button.querySelector('.theme-label').textContent=dark?(locale==='id'?'Gelap':'Dark'):(locale==='id'?'Terang':'Light');
  }
  function announce(message){const region=document.getElementById('site-live-status');if(region)region.textContent=message;}
  function render(){
    const c=localized(),t=dict[locale];persist();header(c,t);
    document.getElementById('utama').innerHTML=contentMarkup(c,t);
    document.getElementById('preview-footer').innerHTML=`<a href="#" class="brand">ma<span>/</span></a><p>© ${new Date().getFullYear()} ${h(c.profile.name)}</p><a href="#">${t.back} ↑</a>`;
    refreshProjectButtons(c,t);
    const scene=document.querySelector('.hero-scene'), card=document.getElementById('tilting-card');
    scene.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=scene.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.setProperty('--rotate-x',(-y*8).toFixed(2)+'deg');card.style.setProperty('--rotate-y',(x*8).toFixed(2)+'deg');card.style.setProperty('--light-x',((x+.5)*100)+'%');card.style.setProperty('--light-y',((y+.5)*100)+'%')});
    scene.addEventListener('pointerleave',()=>{card.style.setProperty('--rotate-x','0deg');card.style.setProperty('--rotate-y','0deg')});reveal();
  }
  document.getElementById('project-dialog').addEventListener('click',e=>{if(e.target===e.currentTarget)e.currentTarget.close()});
  window.addEventListener('storage',e=>{
    if(e.key!==keys.locale&&e.key!==keys.theme)return;
    try{locale=localStorage.getItem(keys.locale)==='en'?'en':'id';const saved=localStorage.getItem(keys.theme);theme=saved==='dark'||saved==='light'?saved:theme;}catch{}
    render();
  });
  render();
})();'''
js=js.replace('DATA_BASE',json.dumps(seed,ensure_ascii=False).replace('<','\\u003c')).replace('DATA_EN',json.dumps(seed_en,ensure_ascii=False).replace('<','\\u003c')).replace('DATA_ASSETS',json.dumps(assets).replace('<','\\u003c'))
extra='''
/* Specific refinements for the standalone visual preview. */
.preview-icon{display:inline-block;color:var(--blue);font-size:18px;line-height:1.2;margin-right:12px;font-weight:700}
.expertise-strip p{gap:0}
.project-image{width:100%;border:0;text-align:left;color:inherit;cursor:pointer}
.preview-project-name{border:0;background:transparent;padding:0;text-align:left;font-size:inherit;font-family:inherit;font-weight:inherit;letter-spacing:inherit;cursor:pointer}
.preview-project-name:hover{color:var(--blue)}
#project-dialog{border:1px solid var(--line);background:var(--paper);color:var(--ink);border-radius:18px;max-width:700px;width:min(90vw,700px);max-height:85vh;padding:0;box-shadow:0 25px 70px #07172755}
#project-dialog::backdrop{background:#071629b8;backdrop-filter:blur(4px)}
.preview-modal-body{padding:32px;position:relative}
.preview-modal-body h2{font-size:35px;margin:18px 0}
.preview-modal-body>img{max-height:420px;object-fit:contain;margin:16px auto 24px;border-radius:10px;background:var(--white)}
.preview-modal-body>h3{margin-bottom:12px}
.preview-modal-body>p:not(.eyebrow){margin-bottom:22px;white-space:pre-line}
.modal-close{position:absolute;right:22px;top:18px;width:35px;height:35px;border:1px solid var(--line);background:var(--white);border-radius:9px}
@media(max-width:520px){.preview-icon{font-size:15px;margin-right:6px}}
'''
html=f'''<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><meta name="description" content="Interactive offline preview of Muhamad Aliamsyah's bilingual portfolio"><title>Muhamad Aliamsyah · Portfolio</title><style>{css}\n{extra}</style></head><body><a class="skip-link" href="#utama">Lewati ke konten</a><header class="site-header" id="preview-header"></header><main id="utama"></main><footer class="container footer" id="preview-footer"></footer><dialog id="project-dialog"></dialog><script>{js.replace('</script','<\\/script')}</script></body></html>'''
(root/'preview.html').write_text(html)
print(f"Updated standalone public preview: {len(html.encode())/1024/1024:.2f} MB")
