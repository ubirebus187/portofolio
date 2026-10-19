import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Portfolio} from '../components/portfolio';
import {AdminDashboard} from '../components/admin-dashboard';
import {LoginForm} from '../components/login-form';
import {contentSchema,publicContent} from '../lib/schema';
import {asset} from '../lib/assets';
import seed from '../data/seed.json';
import {ADMIN_PATH,ADMIN_LOGIN_PATH} from '../lib/admin-paths';
const content=contentSchema.parse(seed);
// Local simulation only. Never used by the Next.js authentication endpoint.
const DEMO_CREDENTIALS={username:'aliamsyah',password:'DemoStudio2026!'};
function Preview(){
 const [view,setView]=useState('site'),[authenticated,setAuthenticated]=useState(false);
 async function demoLogin({username,password}:{username:string;password:string}){
  if(username.trim().toLowerCase()!==DEMO_CREDENTIALS.username||password!==DEMO_CREDENTIALS.password)throw new Error('Username atau password demo tidak sesuai.');
  setAuthenticated(true);setView('admin');window.scrollTo(0,0);
 }
 function demoLogout(){setAuthenticated(false);setView('login');window.scrollTo(0,0);}
 useEffect(()=>{
  const click=(e:MouseEvent)=>{
   const a=(e.target as HTMLElement).closest('a');if(!a)return;
   const href=a.getAttribute('href')||'';
   if(href===ADMIN_PATH||href===ADMIN_LOGIN_PATH||href==='/admin'||href==='/admin/login'||href.startsWith('/proyek/')||href==='/cv'||href==='/'||href.startsWith('/#')){
    e.preventDefault();setView((href===ADMIN_PATH||href==='/admin')?(authenticated?'admin':'login'):(href===ADMIN_LOGIN_PATH||href==='/admin/login')?'login':href==='/cv'?'cv':href.startsWith('/proyek/')?href:'site');
    if(href.startsWith('/#'))setTimeout(()=>document.querySelector(href.slice(1))?.scrollIntoView(),60);else window.scrollTo(0,0);
   }
  };document.addEventListener('click',click);return()=>document.removeEventListener('click',click);
 },[authenticated]);
 const project=content.projects.find(p=>view===`/proyek/${p.slug}`);
 return <><div className="offline-toolbar"><strong>DEMO LOKAL</strong><button className={view==='site'?'selected':''} onClick={()=>{setView('site');window.scrollTo(0,0);}}>Website</button><button className={view==='admin'?'selected':''} onClick={()=>{setView(authenticated?'admin':'login');window.scrollTo(0,0);}}>Studio demo</button></div>
 {view==='site'?<Portfolio content={publicContent(content)}/>:view==='admin'&&authenticated?<AdminDashboard initial={content} demo onDemoLogout={demoLogout}/>:view==='login'||view==='admin'?<LoginForm configured onAuthenticate={demoLogin} demoCredentials={DEMO_CREDENTIALS}/>:view==='cv'?<main className="container project-detail"><a className="text-link" href="/">← Kembali</a><h1>CV Muhamad Aliamsyah</h1><a className="button primary" href={asset(content.profile.cvUrl)} download="CV-Muhamad-Aliamsyah.pdf">Unduh CV PDF</a><p className="lead">CV online yang mengikuti data terbit tersedia ketika aplikasi Next.js dijalankan.</p><iframe title="CV PDF" src={asset(content.profile.cvUrl)} style={{width:'100%',height:'85vh',border:0}}/></main>:project?<main className="container project-detail"><a className="text-link" href="/#proyek">← Kembali ke portofolio</a><p className="eyebrow">{project.category}</p><h1>{project.title}</h1><p className="lead">{project.summary}</p><img className="detail-cover" src={asset(project.image)} alt={project.title}/><div className="detail-columns"><section><h2>Tentang proyek</h2><p>{project.description}</p></section><aside><p>Detail tambahan dapat dilengkapi melalui dashboard admin.</p></aside></div></main>:null}</>;
}
createRoot(document.getElementById('root')!).render(<Preview/>);
