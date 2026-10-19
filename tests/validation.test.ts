import test from 'node:test';
import assert from 'node:assert/strict';
import { contentSchema,isSafeLink,publicContent } from '../lib/schema';
import { assertSameOrigin,readJson,HttpError } from '../lib/http';
import { detectFile,validateUpload } from '../lib/uploads';
import seed from '../data/seed.json';

test('CV seed is valid and does not add unprovided TypeScript claims',()=>{
 const content=contentSchema.parse(seed);assert.equal(content.experience.length,6);assert.equal(content.projects.length,11);
 assert.ok(!content.skillGroups.flatMap(x=>x.items).includes('TypeScript'));
});
test('publication excludes drafts and internal notes without modifying source',()=>{
 const content=contentSchema.parse(seed);content.projects[0].status='draft';
 const published=publicContent(content);assert.equal(published.projects.length,10);
 assert.ok(published.projects.every(x=>x.note===''));assert.notEqual(content.projects[1].note,'');
});
test('unsafe schemes and protocol-relative URLs are rejected',()=>{
 for(const url of ['javascript:alert(1)','data:text/html,<script>','//evil.example/x','/../secret','/\\evil','http://plain.example']) assert.equal(isSafeLink(url),false,url);
 for(const url of ['','/projects/cv-02.jpg','https://example.com/project'])assert.equal(isSafeLink(url),true,url);
});
test('duplicate project slugs are rejected',()=>{
 const content=structuredClone(seed);content.projects[1].slug=content.projects[0].slug;assert.equal(contentSchema.safeParse(content).success,false);
});
test('duplicate IDs are rejected',()=>{
 const content=structuredClone(seed);content.experience[1].id=content.experience[0].id;assert.equal(contentSchema.safeParse(content).success,false);
});
test('CSRF origin check rejects foreign and missing origins',()=>{
 assert.throws(()=>assertSameOrigin(new Request('https://portfolio.example/api/admin/content',{headers:{origin:'https://evil.example'}})),HttpError);
 assert.throws(()=>assertSameOrigin(new Request('https://portfolio.example/api/admin/content')),HttpError);
 assert.doesNotThrow(()=>assertSameOrigin(new Request('https://portfolio.example/api/admin/content',{headers:{origin:'https://portfolio.example'}})));
});
test('bounded JSON reader rejects oversized and malformed bodies',async()=>{
 await assert.rejects(()=>readJson(new Request('https://example.com',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({large:'x'.repeat(200)})}),30),HttpError);
 await assert.rejects(()=>readJson(new Request('https://example.com',{method:'POST',headers:{'content-type':'application/json'},body:'invalid'})),HttpError);
 const data=await readJson(new Request('https://example.com',{method:'POST',headers:{'content-type':'application/json'},body:'{"revision":1}'}));assert.equal(data.revision,1);
});
test('uploads inspect content signatures, size, and expected media type',()=>{
 const png=new Uint8Array([137,80,78,71,13,10,26,10]);const pdf=Buffer.from('%PDF-1.7');
 assert.equal(detectFile(png)?.mime,'image/png');assert.equal(validateUpload(pdf,'pdf').extension,'pdf');
 assert.throws(()=>validateUpload(pdf,'image'),HttpError);assert.throws(()=>validateUpload(Buffer.from('<svg onload="alert(1)">'),'image'),HttpError);
 assert.throws(()=>validateUpload(new Uint8Array(3*1024*1024+1),'image'),HttpError);
});
