// Server-only access. No service-role key is used; all queries retain Supabase RLS.
import { cookies } from 'next/headers';
import { contentSchema, publicContent, type Content } from './schema';
import { HttpError } from './http';
import seed from '../data/seed.json';
import { adminIdentity,verifyAdminToken } from './admin-auth';

export const SESSION_COOKIE='portfolio_session';
export function isConfigured() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY && process.env.ADMIN_USER_ID);
}
export function isAdminConfigured() {
  try {adminIdentity();return isConfigured();} catch {return false;}
}
export function configuration() {
  if(!isConfigured()) throw new HttpError(503,'Supabase belum dikonfigurasi. Ikuti panduan README sebelum mengaktifkan admin.');
  return {url:process.env.SUPABASE_URL!.replace(/\/$/,''),key:process.env.SUPABASE_PUBLISHABLE_KEY!};
}
export async function supabaseRequest(path:string,options:RequestInit={},token?:string) {
  const {url,key}=configuration();
  const headers=new Headers(options.headers);headers.set('apikey',key);
  if(token)headers.set('Authorization',`Bearer ${token}`);
  else if(key.startsWith('eyJ'))headers.set('Authorization',`Bearer ${key}`);
  return fetch(`${url}${path}`,{...options,headers,cache:'no-store',signal:AbortSignal.timeout(15000)});
}
export async function requireAdmin() {
  configuration();
  const token=(await cookies()).get(SESSION_COOKIE)?.value;
  return verifyAdminToken(token,adminIdentity(),supabaseRequest);
}
export async function getPublished():Promise<{content:Content;configured:boolean;published:boolean}> {
  if(!isConfigured())return {content:publicContent(contentSchema.parse(seed)),configured:false,published:true};
  const response=await supabaseRequest('/rest/v1/site_publications?id=eq.1&select=content');
  if(!response.ok)throw new HttpError(503,'Data website belum dapat dimuat.');
  const rows=await response.json();
  if(!rows.length)return {content:publicContent(contentSchema.parse({...seed,projects:[]})),configured:true,published:false};
  return {content:publicContent(contentSchema.parse(rows[0].content)),configured:true,published:true};
}
export async function getDraft(token:string) {
  const response=await supabaseRequest('/rest/v1/site_drafts?id=eq.1&select=content,revision,updated_at,published_revision',{},token);
  if(!response.ok)throw new HttpError(503,'Draft tidak dapat dimuat. Pastikan SQL migrasi sudah dijalankan.');
  const rows=await response.json();
  if(!rows.length)throw new HttpError(503,'Data awal belum diimpor. Jalankan supabase/02-seed.sql.');
  return {...rows[0],content:contentSchema.parse(rows[0].content)};
}
export async function rpc(name:'save_portfolio_draft'|'publish_portfolio',body:object,token:string) {
  const response=await supabaseRequest(`/rest/v1/rpc/${name}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)},token);
  if(!response.ok){
    const data=await response.json().catch(()=>({}));
    if(data.code==='40001')throw new HttpError(409,'Draft berubah di tab lain. Muat ulang setelah menyalin perubahanmu.');
    if(data.code==='42501')throw new HttpError(403,'Akses perubahan ditolak.');
    throw new HttpError(503,'Perubahan belum tersimpan. Periksa konfigurasi database dan coba kembali.');
  }
  return response.json();
}
