import { getPublished } from '@/lib/supabase';
import { OnlineCV } from '@/components/online-cv';
export const dynamic='force-dynamic';
export const metadata={title:'CV Online'};
export default async function CVPage(){
  const {content,published}=await getPublished();
  if(!published)return <main className="setup-page">CV belum dipublikasikan.</main>;
  return <OnlineCV content={content}/>;
}
