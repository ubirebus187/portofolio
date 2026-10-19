-- Imports editable CV data as a draft only. Does not overwrite existing content.
insert into public.site_drafts(id,content) values(1,$portfolio_seed$
{
  "profile": {
    "name": "Muhamad Aliamsyah",
    "headline": "Application Engineer & Full-Stack Developer",
    "intro": "Saya membangun aplikasi web, mengembangkan pengalaman Roblox, dan menangani operasional IT. Menghubungkan kebutuhan bisnis dengan implementasi teknis yang terstruktur.",
    "about": "Pengalaman saya mencakup pengembangan aplikasi, pengujian, deployment, optimasi performa, administrasi server Linux, jaringan, dan dukungan teknis. Saya terbiasa bekerja bersama tim lintas fungsi untuk menerjemahkan kebutuhan menjadi aplikasi yang dapat digunakan.",
    "email": "amsyah264@gmail.com",
    "phone": "+6285157664203",
    "location": "",
    "photo": "/profile/muhamad-aliamsyah.jpg",
    "cvUrl": "/cv-muhamad-aliamsyah.pdf",
    "github": "",
    "linkedin": "",
    "availability": ""
  },
  "experience": [
    {
      "id": "exp-1",
      "role": "Freelance Roblox Developer",
      "company": "Freelance",
      "period": "Sep 2025 — Sekarang",
      "description": "Mengembangkan game dan pengalaman di platform Roblox secara freelance."
    },
    {
      "id": "exp-2",
      "role": "Application Engineer",
      "company": "Samudera Indonesia",
      "period": "Feb 2025 — Sep 2025",
      "description": "Mengembangkan frontend dengan Next.js dan backend dengan NestJS. Berkolaborasi dengan tim lintas fungsi dan product manager, mengintegrasikan sumber data, menyusun laporan Jasper Reports, serta melakukan troubleshooting aplikasi."
    },
    {
      "id": "exp-3",
      "role": "Freelance Full Stack Developer",
      "company": "Freelance",
      "period": "Jan 2022 — Jan 2025",
      "description": "Mengembangkan Client Request System menggunakan Laravel dan MySQL, RESTful API, serta antarmuka responsif dengan Bootstrap dan jQuery. Melakukan pengujian, debugging, dan optimasi performa."
    },
    {
      "id": "exp-4",
      "role": "PHP Developer",
      "company": "PT Dinamika Digital Semesta",
      "period": "Jan 2023 — Mar 2023",
      "description": "Membangun dan melakukan deployment aplikasi PHP dan Laravel. Mengoptimalkan kode aplikasi yang sudah berjalan serta melakukan pengujian fungsional dan debugging."
    },
    {
      "id": "exp-5",
      "role": "Full Stack JavaScript Intern",
      "company": "PT Qbit",
      "period": "Okt 2022 — Des 2022",
      "description": "Berkontribusi pada sistem internal menggunakan NestJS, ReactJS, dan PostgreSQL. Menyiapkan dokumentasi teknis serta membantu pengujian dan deployment."
    },
    {
      "id": "exp-6",
      "role": "IT Staff",
      "company": "PT Vivamedika",
      "period": "Feb 2019 — Mei 2022",
      "description": "Mengelola server, jaringan, dan workstation. Memelihara website perusahaan dan sistem internal serta mengusulkan solusi IT untuk mendukung operasional."
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "institution": "Universitas Nusa Mandiri",
      "degree": "Sarjana Teknik Informatika",
      "period": "Sep 2019 — Des 2023",
      "detail": "IPK 3,5"
    }
  ],
  "skillGroups": [
    {
      "id": "skill-1",
      "title": "Development",
      "items": [
        "PHP",
        "Laravel",
        "JavaScript",
        "Next.js",
        "NestJS",
        "ReactJS",
        "Vue.js",
        "Go"
      ]
    },
    {
      "id": "skill-2",
      "title": "Data & Integration",
      "items": [
        "MySQL",
        "PostgreSQL",
        "RESTful APIs",
        "Jasper Reports"
      ]
    },
    {
      "id": "skill-3",
      "title": "Infrastructure & Tools",
      "items": [
        "Linux",
        "VPS",
        "cPanel",
        "HestiaCP",
        "Networking",
        "Roblox"
      ]
    },
    {
      "id": "skill-4",
      "title": "Engineering Practice",
      "items": [
        "Testing",
        "Debugging",
        "System Optimization",
        "Technical Documentation",
        "IT Support"
      ]
    }
  ],
  "projects": [
    {
      "id": "project-1",
      "slug": "client-request-system",
      "title": "Client Request System",
      "category": "Sistem Internal",
      "summary": "Tampilan formulir permintaan layanan dari lampiran CV.",
      "description": "Tampilan formulir permintaan layanan dari lampiran CV.",
      "role": "",
      "year": "",
      "technologies": [],
      "image": "/projects/cv-02.jpg",
      "gallery": [],
      "demoUrl": "",
      "repositoryUrl": "",
      "status": "published",
      "featured": true,
      "note": "Judul sementara berdasarkan tampilan; lengkapi nama resmi, peran, teknologi, dan tautan sebelum publikasi."
    },
    {
      "id": "project-2",
      "slug": "dashboard-operasional",
      "title": "Dashboard Operasional",
      "category": "Sistem Internal",
      "summary": "Tampilan ringkasan data dan daftar aktivitas dari lampiran CV.",
      "description": "Tampilan ringkasan data dan daftar aktivitas dari lampiran CV.",
      "role": "",
      "year": "",
      "technologies": [],
      "image": "/projects/cv-03.jpg",
      "gallery": [],
      "demoUrl": "",
      "repositoryUrl": "",
      "status": "published",
      "featured": true,
      "note": "Judul sementara berdasarkan tampilan; lengkapi nama resmi, peran, teknologi, dan tautan sebelum publikasi."
    },
    {
      "id": "project-3",
      "slug": "website-produk",
      "title": "Website Produk",
      "category": "Website",
      "summary": "Tampilan informasi produk dari lampiran CV.",
      "description": "Tampilan informasi produk dari lampiran CV.",
      "role": "",
      "year": "",
      "technologies": [],
      "image": "/projects/cv-04.jpg",
      "gallery": [],
      "demoUrl": "",
      "repositoryUrl": "",
      "status": "published",
      "featured": false,
      "note": "Judul sementara berdasarkan tampilan; lengkapi nama resmi, peran, teknologi, dan tautan sebelum publikasi."
    },
    {
      "id": "project-4",
      "slug": "dashboard-administrasi",
      "title": "Dashboard Administrasi",
      "category": "Sistem Internal",
      "summary": "Tampilan administrasi aplikasi dari lampiran CV.",
      "description": "Tampilan administrasi aplikasi dari lampiran CV.",
      "role": "",
      "year": "",
      "technologies": [],
      "image": "/projects/cv-05.jpg",
      "gallery": [],
      "demoUrl": "",
      "repositoryUrl": "",
      "status": "published",
      "featured": false,
      "note": "Judul sementara berdasarkan tampilan; lengkapi nama resmi, peran, teknologi, dan tautan sebelum publikasi."
    },
    {
      "id": "project-5",
      "slug": "dashboard-layanan",
      "title": "Dashboard Layanan",
      "category": "Sistem Internal",
      "summary": "Tampilan pengelolaan layanan dari lampiran CV.",
      "description": "Tampilan pengelolaan layanan dari lampiran CV.",
      "role": "",
      "year": "",
      "technologies": [],
      "image": "/projects/cv-06.jpg",
      "gallery": [],
      "demoUrl": "",
      "repositoryUrl": "",
      "status": "published",
      "featured": false,
      "note": "Judul sementara berdasarkan tampilan; lengkapi nama resmi, peran, teknologi, dan tautan sebelum publikasi."
    },
    {
      "id": "project-6",
      "slug": "website-kesehatan",
      "title": "Website Kesehatan",
      "category": "Website",
      "summary": "Tampilan website layanan kesehatan dari lampiran CV.",
      "description": "Tampilan website layanan kesehatan dari lampiran CV.",
      "role": "",
      "year": "",
      "technologies": [],
      "image": "/projects/cv-07.jpg",
      "gallery": [],
      "demoUrl": "",
      "repositoryUrl": "",
      "status": "published",
      "featured": true,
      "note": "Judul sementara berdasarkan tampilan; lengkapi nama resmi, peran, teknologi, dan tautan sebelum publikasi."
    },
    {
      "id": "project-7",
      "slug": "peta-operasional",
      "title": "Peta Operasional",
      "category": "Sistem Internal",
      "summary": "Tampilan aplikasi berbasis peta dari lampiran CV.",
      "description": "Tampilan aplikasi berbasis peta dari lampiran CV.",
      "role": "",
      "year": "",
      "technologies": [],
      "image": "/projects/cv-08.jpg",
      "gallery": [],
      "demoUrl": "",
      "repositoryUrl": "",
      "status": "published",
      "featured": true,
      "note": "Judul sementara berdasarkan tampilan; lengkapi nama resmi, peran, teknologi, dan tautan sebelum publikasi."
    },
    {
      "id": "project-8",
      "slug": "website-manfaat-kesehatan",
      "title": "Website Manfaat Kesehatan",
      "category": "Website",
      "summary": "Tampilan informasi manfaat jaminan kesehatan dari lampiran CV.",
      "description": "Tampilan informasi manfaat jaminan kesehatan dari lampiran CV.",
      "role": "",
      "year": "",
      "technologies": [],
      "image": "/projects/cv-09.jpg",
      "gallery": [],
      "demoUrl": "",
      "repositoryUrl": "",
      "status": "published",
      "featured": false,
      "note": "Judul sementara berdasarkan tampilan; lengkapi nama resmi, peran, teknologi, dan tautan sebelum publikasi."
    },
    {
      "id": "project-9",
      "slug": "website-kuliner",
      "title": "Website Kuliner",
      "category": "Website",
      "summary": "Tampilan website kuliner dari lampiran CV.",
      "description": "Tampilan website kuliner dari lampiran CV.",
      "role": "",
      "year": "",
      "technologies": [],
      "image": "/projects/cv-10.jpg",
      "gallery": [],
      "demoUrl": "",
      "repositoryUrl": "",
      "status": "published",
      "featured": false,
      "note": "Judul sementara berdasarkan tampilan; lengkapi nama resmi, peran, teknologi, dan tautan sebelum publikasi."
    },
    {
      "id": "project-10",
      "slug": "website-transportasi",
      "title": "Website Transportasi",
      "category": "Website",
      "summary": "Tampilan website perjalanan dan transportasi dari lampiran CV.",
      "description": "Tampilan website perjalanan dan transportasi dari lampiran CV.",
      "role": "",
      "year": "",
      "technologies": [],
      "image": "/projects/cv-11.jpg",
      "gallery": [],
      "demoUrl": "",
      "repositoryUrl": "",
      "status": "published",
      "featured": false,
      "note": "Judul sementara berdasarkan tampilan; lengkapi nama resmi, peran, teknologi, dan tautan sebelum publikasi."
    },
    {
      "id": "project-11",
      "slug": "katalog-menu",
      "title": "Katalog Menu",
      "category": "Website",
      "summary": "Tampilan katalog makanan dan minuman dari lampiran CV.",
      "description": "Tampilan katalog makanan dan minuman dari lampiran CV.",
      "role": "",
      "year": "",
      "technologies": [],
      "image": "/projects/cv-12.jpg",
      "gallery": [],
      "demoUrl": "",
      "repositoryUrl": "",
      "status": "published",
      "featured": false,
      "note": "Judul sementara berdasarkan tampilan; lengkapi nama resmi, peran, teknologi, dan tautan sebelum publikasi."
    }
  ],
  "certificates": []
}
$portfolio_seed$::jsonb) on conflict(id) do nothing;
