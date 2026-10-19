import test from 'node:test';
import assert from 'node:assert/strict';
import {adminIdentity,loginAdmin,verifyAdminToken,type AdminIdentity} from '../lib/admin-auth';
import {HttpError} from '../lib/http';
import AdminPage from '../app/studio-aliamsyah/page';
import LegacyAdminPage from '../app/admin/page';
import {ADMIN_LOGIN_PATH,ADMIN_PATH} from '../lib/admin-paths';

const identity:AdminIdentity={username:'aliamsyah',email:'owner@example.com',userId:'12345678-1234-4234-8234-123456789abc'};
const fails=(status:number)=>(error:unknown)=>error instanceof HttpError && error.status===status;
const unused=async()=>{assert.fail('No upstream request should occur');};

test('admin setup fails closed when required identity fields are absent or invalid',()=>{
 assert.throws(()=>adminIdentity({}),fails(503));
 assert.throws(()=>adminIdentity({ADMIN_USERNAME:'aliamsyah',ADMIN_USER_ID:identity.userId}),fails(503));
 assert.throws(()=>adminIdentity({ADMIN_USERNAME:'ali amsyah',ADMIN_EMAIL:identity.email,ADMIN_USER_ID:identity.userId}),fails(503));
 assert.deepEqual(adminIdentity({ADMIN_USERNAME:'Aliamsyah',ADMIN_EMAIL:identity.email,ADMIN_USER_ID:identity.userId}),identity);
});
test('dashboard without configuration redirects to special login; legacy URL redirects safely',async()=>{
 const keys=['SUPABASE_URL','SUPABASE_PUBLISHABLE_KEY','ADMIN_USERNAME','ADMIN_EMAIL','ADMIN_USER_ID'];
 const previous=Object.fromEntries(keys.map(k=>[k,process.env[k]]));keys.forEach(k=>delete process.env[k]);
 try {
  await assert.rejects(()=>AdminPage(),(e:unknown)=>String((e as {digest?:string}).digest).includes(`;${ADMIN_LOGIN_PATH};`));
  assert.throws(()=>LegacyAdminPage(),(e:unknown)=>String((e as {digest?:string}).digest).includes(`;${ADMIN_PATH};`));
 }finally{for(const key of keys){if(previous[key]===undefined)delete process.env[key];else process.env[key]=previous[key];}}
});
test('missing and expired sessions never return admin data',async()=>{
 await assert.rejects(()=>verifyAdminToken(undefined,identity,unused),fails(401));
 await assert.rejects(()=>verifyAdminToken('expired',identity,async()=>Response.json({error:'expired'},{status:401})),fails(401));
});
test('a valid token belonging to a different user is not an admin session',async()=>{
 let calls=0;
 await assert.rejects(()=>verifyAdminToken('valid-user-token',identity,async()=>{calls++;return Response.json({id:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'});}),fails(403));
 assert.equal(calls,1);
});
test('correct user without matching database membership is rejected',async()=>{
 for(const membership of [Response.json([]),Response.json([{user_id:'someone-else'}]),Response.json({error:'permission denied'},{status:403})]){
  await assert.rejects(()=>verifyAdminToken('token',identity,async(path)=>path==='/auth/v1/user'?Response.json({id:identity.userId}):membership),fails(403));
 }
});
test('wrong username and wrong password produce the same generic failure',async()=>{
 const input={username:'not-owner',password:'incorrect'};
 let usernameError='',passwordError='';
 try{await loginAdmin(input,identity,unused);}catch(e){assert.ok(fails(401)(e));usernameError=(e as Error).message;}
 try{await loginAdmin({...input,username:identity.username},identity,async()=>Response.json({error:'invalid_grant'},{status:400}));}catch(e){assert.ok(fails(401)(e));passwordError=(e as Error).message;}
 assert.equal(usernameError,passwordError);
 await assert.rejects(()=>loginAdmin({email:identity.email,password:'incorrect'},identity,unused),fails(400));
});
test('username login maps email on server, verifies token and membership, and caps session lifetime',async()=>{
 const calls:string[]=[];
 const session=await loginAdmin({username:' Aliamsyah ',password:'test-password'},identity,async(path,options,token)=>{
  calls.push(path);
  if(path.startsWith('/auth/v1/token')){
   assert.deepEqual(JSON.parse(String(options?.body)),{email:identity.email,password:'test-password'});
   return Response.json({access_token:'server-token',expires_in:7200});
  }
  assert.equal(token,'server-token');
  if(path==='/auth/v1/user')return Response.json({id:identity.userId});
  return Response.json([{user_id:identity.userId}]);
 });
 assert.equal(calls.length,3);assert.deepEqual(session,{token:'server-token',expires:3600});
});
test('login respects upstream rate limits and does not issue a session',async()=>{
 await assert.rejects(()=>loginAdmin({username:identity.username,password:'test'},identity,async()=>Response.json({}, {status:429})),fails(429));
});
