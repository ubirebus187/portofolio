import { requireAdmin,getDraft,rpc } from '@/lib/supabase';
import { assertSameOrigin,errorResponse,HttpError,readJson } from '@/lib/http';
import { contentSchema,revisionSchema } from '@/lib/schema';
import { z } from 'zod';
export async function GET() {
  try {const {token}=await requireAdmin();return Response.json(await getDraft(token),{headers:{'Cache-Control':'no-store'}});}
  catch(error){return errorResponse(error);}
}
export async function PUT(request:Request) {
  try {
    assertSameOrigin(request);const {token}=await requireAdmin();
    const parsed=z.object({content:contentSchema,revision:revisionSchema}).safeParse(await readJson(request));
    if(!parsed.success)throw new HttpError(400,parsed.error.issues.map(i=>`${i.path.join('.')}: ${i.message}`).slice(0,4).join(' | '));
    const result=await rpc('save_portfolio_draft',{p_content:parsed.data.content,p_expected_revision:parsed.data.revision},token);
    return Response.json(result,{headers:{'Cache-Control':'no-store'}});
  }catch(error){return errorResponse(error);}
}
