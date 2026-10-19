import { cookies } from 'next/headers';
import { assertSameOrigin,errorResponse } from '@/lib/http';
import { SESSION_COOKIE,supabaseRequest } from '@/lib/supabase';
export async function POST(request:Request) {
  try {
    assertSameOrigin(request);const jar=await cookies();const token=jar.get(SESSION_COOKIE)?.value;
    if(token)await supabaseRequest('/auth/v1/logout?scope=local',{method:'POST'},token).catch(()=>null);
    jar.delete(SESSION_COOKIE);return Response.json({ok:true},{headers:{'Cache-Control':'no-store'}});
  }catch(error){return errorResponse(error);}
}
