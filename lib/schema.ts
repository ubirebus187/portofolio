import { z } from 'zod';

const text = z.string().trim().max(12000);
const short = z.string().trim().max(200);
const required = short.min(1, 'Kolom ini wajib diisi.');
export function isSafeLink(value: string): boolean {
  if (!value) return true;
  if (/^\/[a-zA-Z0-9_./-]*$/.test(value) && !value.startsWith('//') && !value.includes('..')) return true;
  try { return new URL(value).protocol === 'https:'; } catch { return false; }
}
const link = z.string().trim().max(2048).refine(isSafeLink, 'Gunakan URL HTTPS atau jalur lokal /nama-file.');
const id = required;
export const projectSchema = z.object({
  id, slug: required.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug hanya huruf kecil, angka, dan tanda hubung.'),
  title: required, category: required, summary: text.max(500), description: text,
  role: short, year: short, technologies: z.array(short).max(40),
  image: link, gallery: z.array(link).max(12), demoUrl: link, repositoryUrl: link,
  status: z.enum(['draft','published']), featured: z.boolean(), note: text,
});
const englishFields = (names:readonly string[]) => z.object(
  Object.fromEntries(names.map(name=>[name,text])) as Record<string,typeof text>
).partial();
const englishTranslations = z.object({
  profile: englishFields(['headline','intro','about','availability']).optional(),
  projects: z.record(englishFields(['title','category','summary','description','role'])).optional(),
  experience: z.record(englishFields(['role','period','description'])).optional(),
  education: z.record(englishFields(['degree','period','detail'])).optional(),
  skillGroups: z.record(englishFields(['title'])).optional(),
  certificates: z.record(englishFields(['title','issuer'])).optional(),
}).optional();
export const contentSchema = z.object({
  profile: z.object({
    name: required, headline: required, intro: text.max(1000), about: text,
    email: z.string().trim().email(), phone: z.string().trim().max(30).regex(/^[+0-9 ()-]*$/),
    location: short, photo: link, cvUrl: link, github: link, linkedin: link, availability: short,
  }),
  experience: z.array(z.object({id,role:required,company:required,period:short,description:text})).max(50),
  education: z.array(z.object({id,institution:required,degree:required,period:short,detail:text})).max(20),
  skillGroups: z.array(z.object({id,title:required,items:z.array(short).max(50)})).max(15),
  projects: z.array(projectSchema).max(100),
  certificates: z.array(z.object({id,title:required,issuer:short,date:short,url:link,image:link})).max(100),
  translations: englishTranslations,
}).superRefine((data, ctx) => {
  const seen = new Set<string>();
  for (let i=0; i<data.projects.length; i++) {
    const slug=data.projects[i].slug;
    if(seen.has(slug)) ctx.addIssue({code:'custom',path:['projects',i,'slug'],message:'Slug proyek harus unik.'});
    seen.add(slug);
  }
  for (const collection of ['projects','experience','education','skillGroups','certificates'] as const) {
    if(new Set(data[collection].map(x=>x.id)).size !== data[collection].length)
      ctx.addIssue({code:'custom',path:[collection],message:'ID dalam daftar harus unik.'});
  }
});
export type Content = z.infer<typeof contentSchema>;
export type Project = z.infer<typeof projectSchema>;
export function publicContent(content: Content): Content {
  return {...content, projects:content.projects.filter(p=>p.status==='published').map(p=>({...p,note:''}))};
}
export const revisionSchema = z.number().int().nonnegative();
