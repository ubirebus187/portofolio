import { AdminDashboard } from '@/components/admin-dashboard';
import { isAdminConfigured,requireAdmin,getDraft } from '@/lib/supabase';
import { HttpError } from '@/lib/http';
import { ADMIN_LOGIN_PATH } from '@/lib/admin-paths';
import { redirect } from 'next/navigation';
export const dynamic='force-dynamic';
export const metadata={title:'Portfolio Studio',robots:{index:false,follow:false}};
export default async function AdminPage(){
  // Fail closed, including when database or admin credentials are not configured.
  if(!isAdminConfigured())redirect(ADMIN_LOGIN_PATH);
  let session;
  try {session=await requireAdmin();}
  catch(error){if(error instanceof HttpError&&(error.status===401||error.status===403))redirect(ADMIN_LOGIN_PATH);throw error;}
  const draft=await getDraft(session.token);
  return <AdminDashboard initial={draft.content} initialRevision={draft.revision} initialPublishedRevision={draft.published_revision}/>;
}
