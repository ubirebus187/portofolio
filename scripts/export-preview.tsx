import {build} from 'esbuild';
import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const assets:Record<string,string>={};
for(const file of readdirSync(path.join(root,'public/projects'))){assets[`/projects/${file}`]=`data:image/jpeg;base64,${readFileSync(path.join(root,'public/projects',file)).toString('base64')}`;}
assets['/profile/muhamad-aliamsyah.jpg']=`data:image/jpeg;base64,${readFileSync(path.join(root,'public/profile/muhamad-aliamsyah.jpg')).toString('base64')}`;
assets['/cv-muhamad-aliamsyah.pdf']=`data:application/pdf;base64,${readFileSync(path.join(root,'public/cv-muhamad-aliamsyah.pdf')).toString('base64')}`;
const result=await build({entryPoints:[path.join(root,'scripts/preview-entry.tsx')],bundle:true,write:false,format:'iife',platform:'browser',minify:true,jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'},logLevel:'silent'});
const css=readFileSync(path.join(root,'app/globals.css'),'utf8');
const extra=`:root{--preview-offset:0px}
.offline-toolbar{position:fixed;bottom:16px;left:16px;z-index:90;display:flex;align-items:center;gap:8px;padding:8px 10px;background:#10243eea;color:white;font:12px Arial,sans-serif;border:1px solid #ffffff2d;box-shadow:0 12px 35px #0b152833;border-radius:14px;backdrop-filter:blur(12px)}
.offline-toolbar strong{font-size:10px;letter-spacing:.09em;color:#a8bcdf;margin-right:7px}
.offline-toolbar button{font:inherit;color:white;background:transparent;border:1px solid #ffffff40;border-radius:8px;padding:8px 11px}
.offline-toolbar button.selected{background:white;color:#192735}
@media(max-width:520px){.offline-toolbar{bottom:10px;left:10px;gap:6px;padding:6px}.offline-toolbar strong{display:none}.offline-toolbar button{font-size:11px}}`;
const html=`<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Muhamad Aliamsyah — Pratinjau Website & Admin</title><style>${css}\n${extra}</style></head><body><div id="root"></div><script>globalThis.__PORTFOLIO_ASSETS__=${JSON.stringify(assets).replace(/</g,'\\u003c')};</script><script>${result.outputFiles[0].text.replace(/<\/script/gi,'<\\/script')}</script></body></html>`;
writeFileSync(path.join(root,'preview.html'),html);
console.log(`Created preview.html (${(Buffer.byteLength(html)/1024/1024).toFixed(2)} MB), with embedded assets.`);
