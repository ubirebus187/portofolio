import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={icons:{icon:'/favicon.svg'},title:{default:'Muhamad Aliamsyah — Application Engineer & Developer',template:'%s — Muhamad Aliamsyah'},description:'Portfolio of Muhamad Aliamsyah: full-stack web applications, Roblox development, and IT operations.'};
const initAppearance=`try{const l=localStorage.getItem('ma-portfolio-locale');if(l==='en')document.documentElement.lang='en';const t=localStorage.getItem('ma-portfolio-theme');document.documentElement.dataset.theme=(t==='light'||t==='dark')?t:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch(e){document.documentElement.dataset.theme='light'}`;
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="id" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:initAppearance}}/></head><body>{children}</body></html>;}
