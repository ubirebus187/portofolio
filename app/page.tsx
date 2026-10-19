import { getPublished } from '@/lib/supabase';
import { Portfolio } from '@/components/portfolio';
export const dynamic='force-dynamic';
export default async function Page(){
  const {content,published}=await getPublished();
  if(!published)return <main className="setup-page"><div className="brand">ma<span>/</span></div><h1>Portofolio sedang disiapkan.</h1><p>Konten akan tampil setelah pemilik menerbitkannya.</p></main>;
  return <Portfolio content={content}/>;
}
