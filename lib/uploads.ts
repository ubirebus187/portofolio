import { HttpError } from './http';
export function detectFile(bytes:Uint8Array):{mime:string;extension:string}|null {
  if(bytes.length>=3 && bytes[0]===255 && bytes[1]===216 && bytes[2]===255)return {mime:'image/jpeg',extension:'jpg'};
  if(bytes.length>=8 && [137,80,78,71,13,10,26,10].every((v,i)=>bytes[i]===v))return {mime:'image/png',extension:'png'};
  const ascii=(a:number,b:number)=>String.fromCharCode(...bytes.slice(a,b));
  if(bytes.length>=12 && ascii(0,4)==='RIFF' && ascii(8,12)==='WEBP')return {mime:'image/webp',extension:'webp'};
  if(bytes.length>=5 && ascii(0,5)==='%PDF-')return {mime:'application/pdf',extension:'pdf'};
  return null;
}
export function validateUpload(bytes:Uint8Array,kind:string) {
  if(bytes.length===0 || bytes.length>3*1024*1024)throw new HttpError(413,'Ukuran berkas harus antara 1 byte dan 3 MB.');
  const file=detectFile(bytes);
  if(!file || (kind==='image'&&!file.mime.startsWith('image/')) || (kind==='pdf'&&file.mime!=='application/pdf'))
    throw new HttpError(400,'Isi berkas tidak sesuai. Gunakan JPG, PNG, WebP, atau PDF yang valid.');
  return file;
}
