# Muhamad Aliamsyah — Portfolio Studio

Website portofolio dan dashboard admin, dibuat berdasarkan **CV Muhamad Aliamsyah.pdf**.

**Stack:** Next.js App Router + React + TypeScript + CSS + Supabase PostgreSQL/Auth/Storage. Target hosting: Vercel. Integrasi Supabase memakai REST API melalui kode server Next.js; tidak memerlukan service-role key.

## Isi dan status proyek

- Website responsif dengan galeri proyek, filter kategori, detail proyek, pengalaman, pendidikan, keahlian, kontak, dan unduh CV.
- **Pembaruan visual:** foto pribadi pada hero dengan efek 3D tilt interaktif, kubus 3D CSS yang berotasi, orbit halus, scroll-reveal, dan hover berlapis; animasi mengikuti pengaturan *reduced motion*.
- **Dua bahasa:** tombol **ID / EN** pada halaman beranda, detail proyek, dan CV online. Teks awal CV sudah diterjemahkan (profil, pengalaman, pendidikan, dan 11 proyek). Bahasa pilihan disimpan di browser.
- **Dark / light mode:** tombol tema di navigasi dan halaman pendukung; otomatis mengikuti tema sistem jika belum pernah memilih, kemudian menyimpan preferensi lokal.
- **Dashboard terjemahan:** menu **Bahasa Inggris** memungkinkan pemilik mengedit salinan Inggris. Kolom bahasa Indonesia tetap di bagian admin semula. Jika konten asli diedit, periksa/isi terjemahan Inggris agar keduanya tetap selaras.
- **Tanpa banner pratinjau** di bagian atas website publik, termasuk saat menggunakan data lokal.

- Dashboard dengan editor profil, proyek, pengalaman, pendidikan, keahlian, sertifikat, dan CV/tautan.
- Tambah, edit, hapus, atur urutan, simpan draft, pratinjau, dan publikasi.
- Proyek dapat disembunyikan sebagai draft dan ditandai unggulan.
- Gambar JPG/PNG/WebP serta PDF maksimal 3 MB per unggahan.
- CV online pada `/cv` mengikuti data terbit dan menyediakan cetak / Save as PDF lewat browser.
- PDF pada tombol unduh adalah salinan berkas CV asli (12 halaman), sampai diganti melalui admin.
- Backend dan SQL tersedia, tetapi **akun Supabase dan Vercel belum dihubungkan atau dibuat untuk pemilik**.
- Login khusus: `/studio-aliamsyah/masuk`, menggunakan **username + password**. Dashboard berada di `/studio-aliamsyah`.
- Dashboard selalu memerlukan sesi admin, termasuk saat konfigurasi belum lengkap. Tanpa konfigurasi, halaman login terkunci; tidak ada fallback demo di aplikasi Next.js.
- URL lama `/admin` dan `/admin/login` mengalihkan ke URL khusus. Tautan admin tidak ditampilkan di website publik.

## Lihat desainnya tanpa instalasi

Buka `preview.html` langsung di Chrome, Edge, atau browser modern. File ini adalah **pratinjau visual interaktif website publik**, dapat dibuka tanpa Supabase atau menjalankan server. Foto, contoh proyek, dan CV PDF sudah tertanam di dalamnya. Uji tombol **ID / EN**, ikon bulan/matahari, kategori proyek, detail proyek, dan kartu 3D dengan mouse. Tidak ada banner "Pratinjau desain" di bagian atas.

Jika data dalam `data/seed.json` atau gambar lokal berubah, jalankan `python scripts/build-offline-preview.py` untuk memperbarui pratinjau. Python 3.10+ diperlukan hanya untuk generator pratinjau sederhana ini.

**Opsional: demo dashboard tanpa Supabase.** Setelah menjalankan `npm install`, gunakan `npm run preview:export` untuk membuat ulang `preview.html` sebagai demo React yang mencakup **Website** dan **Studio demo** (pemilihnya berada di pojok bawah, bukan di atas). Login demo memakai username `aliamsyah` dengan password `DemoStudio2026!`. Kredensial ini berlaku untuk demo HTML saja dan **tidak** dapat dipakai masuk ke situs Next.js. Perubahan demo disimpan lokal di browser, bukan di database. Perlu diketahui bahwa perintah ini menimpa file `preview.html`; jalankan kembali generator Python untuk mengembalikan pratinjau visual website.

## 1. Menjalankan aplikasi di laptop

**Persyaratan:** Node.js **>=20.9.0 <23** (Node.js 20.9+ atau Node.js 22) dan **npm >=10 <11**. File `.nvmrc` dan `.node-version` menyarankan Node.js **22**. Pengaturan `engines` pada `package.json` menerima kedua seri tersebut. Project menggunakan npm, bukan pnpm.

Pastikan versi terpasang:

```bash
node -v
npm -v
```

Jika menggunakan nvm (macOS/Linux), jalankan `nvm install 22` dan `nvm use 22`. Di Windows, gunakan Node.js 22, misalnya melalui penginstal resmi atau nvm-windows. Node.js 20.9+ juga memenuhi `engines`, tetapi Node.js 22 disarankan. Bila versi npm bukan 10, jalankan `npm install -g npm@10.9.2` setelah Node.js aktif.

Di dalam folder `aliamsyah-portfolio` jalankan:

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`. Untuk admin, buka `http://localhost:3000/studio-aliamsyah/masuk`.

**Penting untuk instalasi pertama:** Berkas `pnpm-lock.yaml` lama telah dihapus. `package-lock.json` belum disertakan karena pembuatan lockfile npm memerlukan resolusi paket dari registry dan tidak dilakukan secara online pada revisi ini. `npm install` akan membuat `package-lock.json` yang valid dengan npm 10; simpan/commit file tersebut agar instalasi berikutnya dapat memakai `npm ci` dengan versi dependensi terkunci. Jangan menjalankan `npm ci` sebelum lockfile terbentuk.

Untuk build dan pemeriksaan setelah instalasi:

```bash
npm run typecheck
npm test
npm run build
npm start
```

## 2. Membuat proyek Supabase

1. Masuk ke dashboard Supabase dan buat proyek baru.
2. Buka SQL Editor. Jalankan `supabase/01-schema.sql`.
3. Jalankan `supabase/02-seed.sql`. Data CV dimasukkan sebagai **draft** dan belum dipublikasikan.
4. Di Authentication > Users, buat satu akun admin dengan email dan kata sandi yang kamu tentukan. Pastikan email terkonfirmasi.
5. Salin UUID akun dari daftar Users.
6. Buka `supabase/03-admin.sql`, ganti `YOUR_ADMIN_AUTH_USER_UUID` dengan UUID tersebut, lalu jalankan.
7. Pada pengaturan Authentication, nonaktifkan pendaftaran pengguna publik. Aplikasi tidak menyediakan halaman pendaftaran.
8. Pastikan bucket `portfolio-media` tersedia. Migrasi sudah membuat bucket serta kebijakan unggahnya.

Jika mengulangi migrasi, `02-seed.sql` tidak menimpa draft yang sudah ada.

## 3. Menghubungkan aplikasi

Salin `.env.example` menjadi `.env.local` dan isi:

```dotenv
SUPABASE_URL=https://PROJECT_KAMU.supabase.co
SUPABASE_PUBLISHABLE_KEY=KUNCI_PUBLISHABLE_ATAU_ANON
ADMIN_USER_ID=UUID_AKUN_ADMIN
ADMIN_USERNAME=aliamsyah
ADMIN_EMAIL=EMAIL_AKUN_ADMIN_SUPABASE
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- Ambil URL proyek serta publishable key dari dashboard Supabase. Legacy anon key juga didukung.
- `ADMIN_USER_ID` harus sama dengan UUID yang dimasukkan ke tabel `admin_users`.
- `ADMIN_USERNAME` adalah username pilihanmu (3–64 karakter: huruf, angka, titik, garis bawah, atau tanda hubung). Huruf besar/kecil diperlakukan sama.
- `ADMIN_EMAIL` harus sama dengan email akun Supabase Auth yang dibuat di langkah sebelumnya. Pemetaan username ke email terjadi di server.
- Password login adalah password akun Supabase Auth tersebut. Tidak ada password bawaan untuk aplikasi, dan password tidak diletakkan pada environment variables atau kode server.
- Akun demo HTML tidak bisa digunakan untuk login di aplikasi Next.js.
- Tidak perlu database password atau service-role key di aplikasi.
- Variabel tanpa `NEXT_PUBLIC_` dipakai hanya di server.
- Restart `npm run dev` setelah mengubah `.env.local`.
- Buka `/studio-aliamsyah/masuk`, lalu masuk dengan `ADMIN_USERNAME` dan password akun Supabase Auth. Email tidak dimasukkan ke formulir login.
- Isi atau periksa proyek; klik **Simpan draft** kemudian **Publikasikan**.
- Halaman publik pertama kali menampilkan pesan bahwa portofolio disiapkan sampai publikasi pertama dilakukan.

Login menggunakan cookie HttpOnly, SameSite=Strict, dan Secure pada build production. Sesi berlaku maksimal satu jam (atau lebih singkat jika token Supabase kedaluwarsa). Aplikasi sengaja tidak menyimpan refresh token. Jika sesi habis, masuk kembali di tab lain; formulir yang belum disimpan tetap berada di tab editor. Password produksi tidak memiliki nilai bawaan dan tidak disimpan di kode. Semua API admin memeriksa token Auth dan keanggotaan `admin_users` di server; alamat khusus tidak menggantikan pemeriksaan sesi. Jika ingin mengganti password, perbarui akun melalui Supabase Authentication.

## 4. Mengisi konten

| Menu | Yang bisa diubah |
|---|---|
| Profil & biodata | Nama, headline, perkenalan, tentang saya, email, telepon, lokasi, foto, status ketersediaan |
| Portofolio | Nama, kategori, slug, ringkasan, uraian, peran, tahun, teknologi, gambar, galeri URL, tautan demo/repository, status, unggulan |
| Pengalaman | Jabatan, perusahaan, periode, uraian, urutan |
| Pendidikan | Institusi, program studi, periode, keterangan, urutan |
| Keahlian | Kelompok dan daftar keahlian, urutan |
| Sertifikat | Nama, penerbit, tanggal, tautan verifikasi, gambar, urutan |
| CV & tautan | CV PDF, GitHub, LinkedIn, akses CV online |

- Simpan draft tidak mengubah website publik.
- Publikasikan menerbitkan snapshot draft tersimpan. Proyek berstatus Draft dan catatan internal dikeluarkan dari snapshot publik.
- Tombol publikasi nonaktif selama ada perubahan yang belum disimpan.
- Dua tab tidak dapat diam-diam menimpa draft yang sama: revisi lama ditolak dengan pesan konflik.
- Konten halaman publik dibaca saat request (`force-dynamic`, fetch `no-store`), sehingga tidak memerlukan deployment ulang untuk perubahan data. Halaman yang sedang terbuka perlu dimuat ulang untuk melihat publikasi baru.
- Gambar/PDF menggunakan **bucket publik**. URL berkas yang sudah diunggah dapat dibuka walaupun konten proyeknya masih draft. Hanya unggah aset yang memang ditujukan untuk publik.
- Menghapus proyek tidak otomatis menghapus berkas Storage, karena berkas dapat dipakai di lebih dari satu tempat. Hapus berkas yang tidak lagi dipakai lewat Supabase Storage.
- PDF unggahan berbeda dari CV online. Untuk PDF berdasarkan data terbaru, buka `/cv`, klik Cetak / Simpan PDF, pilih Save as PDF. Ini memakai fitur cetak browser, bukan generator PDF server.

## 5. Deploy ke Vercel

**Catatan lingkungan:** Proyek menerima Node.js 20.9+ sampai sebelum Node.js 23. Untuk deployment produksi, **Node.js 22** lebih disarankan karena Node.js 20 telah mencapai akhir masa dukungan. Periksa versi runtime yang diizinkan penyedia hosting dan pastikan npm versi 10.

1. Buat repository GitHub milikmu dan unggah proyek ini. Sertakan folder app, components, lib, public, data, supabase, scripts, tests, serta file konfigurasi. Jalankan `npm install` terlebih dahulu dan sertakan `package-lock.json` yang dihasilkan.
2. Jangan unggah `.env.local`, `node_modules`, atau `.next`.
3. Di Vercel, buat New Project dan import repository tersebut.
4. Framework preset: **Next.js**. Root Directory: folder tempat `package.json` berada.
5. Pilih runtime **Node.js 22** dan npm 10 jika tersedia pada penyedia hosting. Build Command: `npm run build`. Install Command: `npm ci` setelah `package-lock.json` sudah dibuat dan di-commit, atau `npm install` untuk instalasi pertama. Jangan memilih Node.js 24 tanpa mengubah batas `<23` di `engines` dan menguji dependensinya terlebih dahulu.
6. Masukkan keenam environment variables pada Settings > Environment Variables. Gunakan URL domain website untuk `NEXT_PUBLIC_SITE_URL`.
7. Deploy. Jika baru mengetahui domain setelah deployment pertama, perbarui `NEXT_PUBLIC_SITE_URL` lalu deploy ulang.
8. Masuk ke `/studio-aliamsyah/masuk`, periksa konten, dan publikasikan.
9. Buka halaman publik melalui jendela privat untuk memeriksa bahwa pengunjung dapat membaca konten dan tidak dapat membuka admin.

Paket hosting dan batas layanan mengikuti ketentuan Vercel/Supabase saat digunakan. Tidak ada klaim bahwa hosting seluruh kebutuhan selalu gratis.

## Data awal dan hal yang perlu dilengkapi

Profil, enam pengalaman kerja, pendidikan, serta keahlian berasal dari CV yang diberikan. Uraian diterjemahkan dan diringkas dalam bahasa Indonesia tanpa menambahkan metrik baru. Persentase pencapaian pada CV tidak diulang dalam website, dan tetap ada di PDF asli.

Sebelas gambar proyek diambil dari halaman 2–12 PDF. Nama proyek merupakan **label deskriptif sementara** berdasarkan tampilannya. Relasi screenshot dengan pemberi kerja, peran spesifik, tahun, stack proyek, URL demo, dan repository tidak diasumsikan. Setiap proyek diberi catatan admin untuk dilengkapi sebelum publikasi. Tidak ada proyek Roblox, sertifikat, foto diri, GitHub, atau LinkedIn yang dikarang.

## Batas verifikasi

Pada paket awal sebelum revisi ini, build Next.js dan pengujian unit pernah dilaporkan berhasil. **Dalam revisi ini**, pratinjau HTML dijalankan melalui Chromium headless pada lebar 1440 dan 390 piksel dan tombol ID/EN, gelap/terang, pilihan tersimpan, serta foto berhasil diverifikasi tanpa error JavaScript. Modul penyimpanan preferensi yang digunakan Next.js juga diuji secara terisolasi, dan sintaks 39 berkas TypeScript/TSX lulus pemeriksaan transpilation. **Build dan typecheck Next.js secara lengkap belum diuji**, karena dependensi tidak dapat dipasang saat registry npm tidak terjangkau. Jalankan `npm install`, `npm run typecheck`, `npm test`, dan `npm run build` di Node.js 22/npm 10 sebelum deployment produksi.

Koneksi dengan Supabase nyata, migrasi SQL terhadap instance pemilik, login end-to-end, unggah nyata, publikasi online, serta pengujian browser visual belum dilakukan karena akun layanan belum dihubungkan dan browser pengujian tidak tersedia. Gunakan `docs/ACCEPTANCE.md` setelah konfigurasi.

## Struktur kode

- `app/` — halaman dan endpoint Next.js.
- `components/` — frontend publik, dashboard, login, dan cetak.
- `lib/admin-auth.ts` — validasi login username, verifikasi token, dan membership admin.
- `lib/admin-paths.ts` — URL khusus admin.
- `lib/supabase.ts` — integrasi Supabase REST, autentikasi, dan pembacaan konten.
- `lib/schema.ts` — validasi konten dan penyaringan data publik.
- `lib/http.ts` — pemeriksaan Origin serta pembacaan JSON berbatas ukuran.
- `lib/uploads.ts` — tipe dan ukuran berkas yang diterima.
- `supabase/` — migrasi, seed, dan pendaftaran admin.
- `data/seed.json` — sumber konten awal berdasarkan CV.
- `public/` — gambar proyek dan CV asli.
- `scripts/` — pembuat pratinjau HTML mandiri dari komponen aplikasi.
- `tests/` — pengujian unit.

## Referensi implementasi

- https://nextjs.org/docs/app/guides/backend-for-frontend
- https://nextjs.org/docs/app/getting-started/installation
- https://supabase.com/docs/guides/api
- https://supabase.com/docs/guides/auth/passwords
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/storage/uploads/standard-uploads
- https://vercel.com/docs/frameworks/full-stack/nextjs
- https://www.w3.org/WAI/tutorials/page-structure/

## Catatan pembaruan 2026-10-19

- Foto awal tersedia pada `public/profile/muhamad-aliamsyah.jpg` dan ditentukan pada `data/seed.json` serta `supabase/02-seed.sql`. Komponen publik memakai foto tersebut sebagai fallback jika publikasi Supabase lama masih memiliki `profile.photo` kosong. Anda dapat mengganti foto melalui tab **Profil & biodata** di dashboard setelah koneksi Supabase aktif.
- Terjemahan awal Inggris terdapat pada `data/seed-en.json`. Terjemahan ini digunakan **hanya** apabila nilai Indonesia sama dengan data CV awal. Teks Indonesia yang diubah tidak otomatis diterjemahkan; versi Inggris dapat disimpan melalui menu **Bahasa Inggris** untuk menghindari terjemahan usang atau rekaan.
- Kode berikut menambahkan `translations` sebagai properti **opsional** dalam struktur konten; publikasi Supabase yang sudah ada tetap dapat dibaca tanpa migrasi skema baru. Simpan draft & publikasikan lagi untuk menyimpan perubahan bilingual.
- Bahasa dan mode terang/gelap disimpan dengan `localStorage` pada perangkat pengunjung, bukan di database. Tidak ada layanan berbayar untuk efek 3D CSS.
- Pengujian build penuh tetap harus dilakukan setelah dependensi terpasang di Node.js 22 dan npm 10 sesuai persyaratan proyek.

## Pembaruan V3: Kontrol bahasa dan mode tampilan

- ID/EN mengubah teks navigasi, hero, pengalaman, bagian tentang, kartu proyek, dan label lainnya secara langsung. Data awal memiliki terjemahan Inggris; untuk teks pemilik yang diperbarui, lengkapi terjemahan di menu **Bahasa Inggris**.
- Pengelolaan preferensi di aplikasi Next.js kini menggunakan `useSyncExternalStore` melalui `lib/site-preferences-store.ts`, sehingga kontrol pada halaman beranda, CV online, dan detail proyek berbagi state yang sama. Klik mengganti atribut `html[lang]` dan `html[data-theme]` **langsung**, bukan menunggu efek setelah render.
- Pilihan tersimpan di `localStorage` dan tersinkronisasi antar-tab. Jika browser memblokir penyimpanan, kontrol tetap merespons selama halaman terbuka.
- Tema sekarang memiliki label **Terang/Gelap** atau **Light/Dark** di desktop, plus atribut `aria-pressed`. Pada mobile, ikon tetap tersedia.
- Versi `preview.html` memakai logika interaktif yang sudah diperbaiki. Ganti tema di pratinjau tidak lagi memuat ulang seluruh konten; penggantian bahasa mengubah teks halaman. Jika pratinjau lama masih terbuka, tutup lalu buka **file `preview.html` dari ZIP V3**, bukan file dari ZIP sebelumnya.
- Jalankan `npm test` untuk pengujian preferensi setelah dependensi terpasang. Daftar uji manual tambahan ada di `docs/ACCEPTANCE.md`.
