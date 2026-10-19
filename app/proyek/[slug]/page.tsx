import { getPublished } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { ProjectDetail } from '@/components/project-detail';
export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}) {const {content}=await getPublished();const {slug}=await params;const p=content.projects.find(x=>x.slug===slug);return {title:p?.title||'Proyek',description:p?.summary};}
export default async function ProjectPage({params}:{params:Promise<{slug:string}>}){
  const {content,published}=await getPublished();const {slug}=await params;
  if(!published||!content.projects.some(p=>p.slug===slug))notFound();
  return <ProjectDetail content={content} slug={slug}/>;
}
