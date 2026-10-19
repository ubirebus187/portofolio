import type { Content } from './schema';
import seed from '../data/seed.json';
import seedEn from '../data/seed-en.json';

export type Locale = 'id' | 'en';

export const interfaceText = {
  id: {
    skip: 'Lewati ke konten', home: 'Beranda', navigation: 'Navigasi utama',
    work: 'Proyek', experience: 'Pengalaman', about: 'Tentang', contact: 'Mari terhubung',
    language: 'Pilih bahasa', themeLight: 'Aktifkan mode terang', themeDark: 'Aktifkan mode gelap',
    explore: 'Jelajahi karya', downloadCV: 'Unduh CV',
    artOne: 'Dari kebutuhan,', artTwo: 'menjadi solusi.',
    workEyebrow: '01 / PORTOFOLIO', workTitle1: 'Karya yang', workTitle2: 'berbicara',
    workLead: 'Aplikasi, website, dan pengalaman digital. Jelajahi dokumentasi proyek di bawah ini.',
    all: 'Semua', empty: 'Belum ada proyek dalam kategori ini.',
    showLess: 'Tampilkan lebih sedikit', viewAll: 'Lihat semua proyek',
    experienceEyebrow: '02 / PENGALAMAN', experienceTitle1: 'Perjalanan', experienceTitle2: 'profesional',
    experienceLead: 'Dari operasional IT hingga pengembangan aplikasi dan pengalaman interaktif.', viewCV: 'Lihat CV online',
    aboutEyebrow: '03 / TENTANG SAYA', aboutTitle1: 'Teknologi dengan', aboutTitle2: 'tujuan yang jelas',
    education: 'PENDIDIKAN', certificates: 'Sertifikasi', certificateLink: 'Lihat sertifikat',
    contactEyebrow: 'PUNYA IDE ATAU KESEMPATAN?', contactTitle1: 'Mari mulai', contactTitle2: 'percakapan',
    contactLead: 'Hubungi saya untuk membahas proyek, kolaborasi, atau peluang profesional.',
    phone: 'TELEPON', backTop: 'Kembali ke atas', projectView: 'Lihat', image: 'Tampilan',
    detailsBack: 'Kembali ke portofolio', detailsAbout: 'Tentang proyek', myRole: 'PERAN SAYA',
    technologies: 'TEKNOLOGI', openProject: 'Lihat proyek', repository: 'Repository',
    cvBack: 'Portofolio', cvProfile: 'Profil', cvExperience: 'Pengalaman', cvEducation: 'Pendidikan',
    cvSkills: 'Keahlian', cvCertificates: 'Sertifikat',
    notAvailable: 'Belum tersedia',
  },
  en: {
    skip: 'Skip to content', home: 'Home', navigation: 'Main navigation',
    work: 'Projects', experience: 'Experience', about: 'About', contact: "Let's connect",
    language: 'Choose language', themeLight: 'Switch to light mode', themeDark: 'Switch to dark mode',
    explore: 'Explore projects', downloadCV: 'Download CV',
    artOne: 'From ideas,', artTwo: 'to solutions.',
    workEyebrow: '01 / SELECTED WORK', workTitle1: 'Work that', workTitle2: 'speaks',
    workLead: 'Apps, websites, and interactive experiences. Explore selected projects below.',
    all: 'All', empty: 'No projects found in this category.',
    showLess: 'Show fewer', viewAll: 'View all projects',
    experienceEyebrow: '02 / EXPERIENCE', experienceTitle1: 'My professional', experienceTitle2: 'journey',
    experienceLead: 'From IT operations to application engineering and interactive experiences.', viewCV: 'View online CV',
    aboutEyebrow: '03 / ABOUT ME', aboutTitle1: 'Technology with', aboutTitle2: 'clear purpose',
    education: 'EDUCATION', certificates: 'Certifications', certificateLink: 'View certificate',
    contactEyebrow: 'HAVE AN IDEA OR OPPORTUNITY?', contactTitle1: "Let's start a", contactTitle2: 'conversation',
    contactLead: "Get in touch to discuss projects, collaboration, or career opportunities.",
    phone: 'PHONE', backTop: 'Back to top', projectView: 'View', image: 'Preview of',
    detailsBack: 'Back to portfolio', detailsAbout: 'About the project', myRole: 'MY ROLE',
    technologies: 'TECHNOLOGIES', openProject: 'View project', repository: 'Repository',
    cvBack: 'Portfolio', cvProfile: 'Profile', cvExperience: 'Experience', cvEducation: 'Education',
    cvSkills: 'Skills', cvCertificates: 'Certificates',
    notAvailable: 'Not available yet',
  },
} as const;

// English values can be supplied by the admin editor. Seed translations apply only
// while the corresponding Indonesian field is unchanged from the original CV.
// This avoids silently replacing custom editorial content with stale translations.
export function localizedContent(content: Content, locale: Locale): Content {
  if (locale === 'id') return content;
  type Section = 'profile' | 'projects' | 'experience' | 'education' | 'skillGroups' | 'certificates';
  function translate(section:Section, id:string|undefined, field:string, original:string):string {
    const fromAdmin = section === 'profile'
      ? (content.translations?.profile as Record<string,string>|undefined)?.[field]
      : (content.translations?.[section] as Record<string,Record<string,string>>|undefined)?.[id ?? '']?.[field];
    if (fromAdmin?.trim()) return fromAdmin;
    const seedValues = section === 'profile' ? seed.profile
      : (seed[section] as Array<{id:string}>).find(x=>x.id===id);
    const fallbackValues = section === 'profile' ? seedEn.profile
      : (seedEn[section] as Record<string,Record<string,string>>)[id ?? ''];
    const baseline = (seedValues as unknown as Record<string,unknown>|undefined)?.[field];
    const fallback = (fallbackValues as Record<string,string>|undefined)?.[field];
    return original===baseline && typeof fallback==='string' && fallback.length ? fallback : original;
  }
  const profile = {...content.profile};
  for (const field of ['headline','intro','about','availability'] as const) {
    profile[field] = translate('profile',undefined,field,profile[field]);
  }
  const map = <K extends Exclude<Section,'profile'>>(section:K, items:Content[K]) =>
    (items as Array<Record<string,unknown>&{id:string}>).map(item=>{
      const next = {...item};
      const fields:Record<string,string[]> = {
        projects:['title','category','summary','description','role'],
        experience:['role','period','description'],
        education:['degree','period','detail'],
        skillGroups:['title'],
        certificates:['title','issuer'],
      };
      for (const field of fields[section]) {
        if (typeof next[field]==='string') next[field]=translate(section,item.id,field,next[field] as string);
      }
      return next;
    });
  return {
    ...content, profile,
    projects:map('projects',content.projects) as Content['projects'],
    experience:map('experience',content.experience) as Content['experience'],
    education:map('education',content.education) as Content['education'],
    skillGroups:map('skillGroups',content.skillGroups) as Content['skillGroups'],
    certificates:map('certificates',content.certificates) as Content['certificates'],
  };
}
