// Server-side username mapping; no password or email is sent to the client.
import { z } from 'zod';
import { HttpError } from './http';

const usernameSchema = z.string().trim().min(3).max(64).regex(/^[a-zA-Z0-9._-]+$/).transform(s=>s.toLowerCase());
const loginSchema = z.object({username:usernameSchema,password:z.string().min(1).max(256)}).strict();
const identitySchema = z.object({username:usernameSchema,email:z.string().email(),userId:z.string().uuid()});
export type AdminIdentity = z.infer<typeof identitySchema>;
type Requester = (path:string, options?:RequestInit, token?:string)=>Promise<Response>;

export function adminIdentity(env:Record<string,string|undefined>=process.env):AdminIdentity {
  const parsed=identitySchema.safeParse({username:env.ADMIN_USERNAME,email:env.ADMIN_EMAIL,userId:env.ADMIN_USER_ID});
  if(!parsed.success)throw new HttpError(503,'Akses admin belum dikonfigurasi. Lengkapi pengaturan server sesuai README.');
  return parsed.data;
}

export async function verifyAdminToken(token:string|undefined,identity:AdminIdentity,request:Requester) {
  if(!token)throw new HttpError(401,'Silakan masuk untuk mengelola konten.');
  const response=await request('/auth/v1/user',{},token);
  if(!response.ok)throw new HttpError(401,'Sesi berakhir. Masuk kembali untuk melanjutkan.');
  const user=await response.json();
  if(user.id!==identity.userId)throw new HttpError(403,'Akun ini tidak memiliki akses admin.');
  const membership=await request(`/rest/v1/admin_users?select=user_id&user_id=eq.${encodeURIComponent(user.id)}`,{},token);
  if(!membership.ok || !(await membership.json()).some((row:{user_id:string})=>row.user_id===user.id))
    throw new HttpError(403,'Akun ini tidak memiliki akses admin.');
  return {token,user};
}

export async function loginAdmin(input:unknown,identity:AdminIdentity,request:Requester) {
  const parsed=loginSchema.safeParse(input);
  if(!parsed.success)throw new HttpError(400,'Isi username dan kata sandi yang valid.');
  if(parsed.data.username!==identity.username)throw new HttpError(401,'Username atau kata sandi tidak sesuai.');
  const response=await request('/auth/v1/token?grant_type=password',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({email:identity.email,password:parsed.data.password})
  });
  if(!response.ok)throw new HttpError(response.status===429?429:401,response.status===429?'Terlalu banyak percobaan masuk. Tunggu lalu coba kembali.':'Username atau kata sandi tidak sesuai.');
  const session=await response.json();
  if(typeof session.access_token!=='string'||!session.access_token)throw new HttpError(401,'Login gagal. Silakan coba kembali.');
  await verifyAdminToken(session.access_token,identity,request);
  const expires=Math.max(1,Math.min(Number(session.expires_in)||3600,3600));
  return {token:session.access_token as string,expires};
}
