import test from 'node:test';
import assert from 'node:assert/strict';
import { contentSchema } from '../lib/schema';
import { localizedContent,interfaceText } from '../lib/portfolio-i18n';
import seed from '../data/seed.json';

test('all initial portfolio entries have a consistent English edition',()=>{
  const content=contentSchema.parse(seed);
  const en=localizedContent(content,'en');
  assert.equal(en.profile.intro.startsWith('I build'),true);
  assert.equal(en.experience[0].period.includes('Present'),true);
  assert.equal(en.education[0].degree.startsWith("Bachelor's"),true);
  assert.equal(en.projects.length,content.projects.length);
  assert.equal(en.projects[0].category,'Internal System');
  assert.equal(interfaceText.en.work,'Projects');
  assert.equal(interfaceText.id.work,'Proyek');
});

test('the English version does not silently overwrite Indonesian editorial updates',()=>{
  const content=contentSchema.parse(seed);
  content.profile.intro='Perkenalan baru oleh pemilik.';
  content.projects[0].summary='Ringkasan terbaru oleh pemilik.';
  const en=localizedContent(content,'en');
  assert.equal(en.profile.intro,content.profile.intro);
  assert.equal(en.projects[0].summary,content.projects[0].summary);
});

test('owner-written English overrides the initial CV translation',()=>{
  const content=contentSchema.parse(seed);
  content.translations={profile:{intro:'My updated biography'},projects:{'project-1':{summary:'English custom summary'}}};
  const en=localizedContent(content,'en');
  assert.equal(en.profile.intro,'My updated biography');
  assert.equal(en.projects[0].summary,'English custom summary');
  assert.equal(localizedContent(content,'id').profile.intro,content.profile.intro);
});
