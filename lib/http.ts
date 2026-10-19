export class HttpError extends Error {
  constructor(public status:number,message:string) { super(message); }
}
export function assertSameOrigin(request: Request) {
  const origin=request.headers.get('origin');
  if(!origin || new URL(request.url).origin !== origin)
    throw new HttpError(403,'Permintaan berasal dari halaman yang tidak diizinkan.');
}
export async function readJson(request:Request, maxBytes=1_000_000) {
  if(!request.headers.get('content-type')?.includes('application/json')) throw new HttpError(415,'Format permintaan harus JSON.');
  const reader=request.body?.getReader();
  if(!reader) throw new HttpError(400,'Data kosong.');
  let size=0;const chunks:Uint8Array[]=[];
  while(true) {const {done,value}=await reader.read();if(done)break;size+=value.length;
    if(size>maxBytes){await reader.cancel();throw new HttpError(413,'Ukuran data terlalu besar.');}chunks.push(value);}
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw new HttpError(400,'JSON tidak valid.'); }
}
export function errorResponse(error:unknown):Response {
  if(error instanceof HttpError) return Response.json({error:error.message},{status:error.status,headers:{'Cache-Control':'no-store'}});
  return Response.json({error:'Layanan belum dapat memproses permintaan. Periksa konfigurasi atau coba lagi.'},{status:500,headers:{'Cache-Control':'no-store'}});
}
