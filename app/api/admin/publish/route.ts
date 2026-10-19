import { requireAdmin,rpc,getDraft } from '@/lib/supabase';
import { assertSameOrigin,errorResponse,HttpError,readJson } from '@/lib/http';
import { revisionSchema,contentSchema } from '@/lib/schema';
export async function POST(request:Request) {
  try {
    assertSameOrigin(request);const {token}=await requireAdmin();
    const body=await readJson(request,4096);const revision=revisionSchema.safeParse(body.revision);
    if(!revision.success)throw new HttpError(400,'Revisi konten tidak valid.');
    const draft=await getDraft(token);contentSchema.parse(draft.content);
    const result=await rpc('publish_portfolio',{p_expected_revision:revision.data},token);
    return Response.json(result,{headers:{'Cache-Control':'no-store'}});
  }catch(error){return errorResponse(error);}
}
