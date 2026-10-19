import { requireAdmin,supabaseRequest,configuration } from '@/lib/supabase';
import { assertSameOrigin,errorResponse,HttpError } from '@/lib/http';
import { validateUpload } from '@/lib/uploads';
export async function POST(request:Request) {
  try {
    assertSameOrigin(request);const {token,user}=await requireAdmin();
    if(Number(request.headers.get('content-length')||0)>3.2*1024*1024)throw new HttpError(413,'Berkas maksimal 3 MB.');
    const data=await request.formData();const input=data.get('file');const kind=data.get('kind');
    if(!(input instanceof File) || !['image','pdf'].includes(String(kind)))throw new HttpError(400,'Pilih berkas yang akan diunggah.');
    if(input.size>3*1024*1024)throw new HttpError(413,'Berkas maksimal 3 MB.');
    const bytes=new Uint8Array(await input.arrayBuffer());const detected=validateUpload(bytes,String(kind));
    const path=`${user.id}/${crypto.randomUUID()}.${detected.extension}`;
    const response=await supabaseRequest(`/storage/v1/object/portfolio-media/${path}`,{method:'POST',headers:{'Content-Type':detected.mime,'x-upsert':'false'},body:bytes},token);
    if(!response.ok)throw new HttpError(503,'Berkas belum terunggah. Periksa bucket dan kebijakan Storage.');
    return Response.json({url:`${configuration().url}/storage/v1/object/public/portfolio-media/${path}`},{headers:{'Cache-Control':'no-store'}});
  }catch(error){return errorResponse(error);}
}
