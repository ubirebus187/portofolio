import { cookies } from 'next/headers';
import { assertSameOrigin,errorResponse,readJson } from '@/lib/http';
import { configuration,SESSION_COOKIE,supabaseRequest } from '@/lib/supabase';
import { adminIdentity,loginAdmin } from '@/lib/admin-auth';
export async function POST(request:Request) {
  try {
    assertSameOrigin(request);configuration();
    const session=await loginAdmin(await readJson(request,4096),adminIdentity(),supabaseRequest);
    (await cookies()).set(SESSION_COOKIE,session.token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:session.expires});
    return Response.json({ok:true},{headers:{'Cache-Control':'no-store'}});
  }catch(error){return errorResponse(error);}
}
