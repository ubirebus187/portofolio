# Status pemeriksaan

**Catatan pembaruan V3 (19 Oktober 2026):** `package.json` menerima Node.js `>=20.9.0 <23` dan npm `>=10 <11`, sementara `.nvmrc` dan `.node-version` memakai Node.js 22. Hasil pengujian lama di bawah berasal dari paket awal dan **tidak** menjadi bukti build terbaru. Pada V3, kontrol preview ID/EN dan tema telah diuji lewat Chromium di 1440 dan 390 px, termasuk pergantian kembali dan pemulihan pilihan tersimpan. Store preferensi Next.js diuji secara terpisah. Sintaks 39 file TypeScript/TSX sudah diperiksa; `npm run typecheck`, `npm test`, dan `npm run build` masih perlu dijalankan setelah dependensi tersedia. Tidak dapat melakukan install paket karena DNS registry npm tidak tersedia pada lingkungan pengerjaan.

- Build produksi Next.js 16.3.4: berhasil.
- Pemeriksaan TypeScript: berhasil.
- Pengujian unit: 16 lulus, 0 gagal.
- Ekspor pratinjau React mandiri: berhasil; 11 gambar dan CV tertanam.
- PDF unduhan disalin utuh dari berkas pengguna, 12 halaman.
- Belum diuji: browser visual, integrasi Supabase nyata, eksekusi migrasi pada database pengguna, login/unggah/publikasi end-to-end, dan deployment Vercel.

Pengujian unit memeriksa validitas seed, penyaringan proyek draft dan catatan internal, keamanan URL, keunikan slug/ID, Origin request, batas pembacaan JSON, signature/ukuran berkas, username login, sesi kosong/kedaluwarsa/non-admin, membership database, rate limit upstream, dan pengalihan dashboard saat konfigurasi belum lengkap. Permintaan Auth/REST pada unit test menggunakan respons tiruan; tes tersebut tidak membuktikan koneksi Supabase nyata. Build menggunakan dependensi yang tersedia melalui runtime. Pemeriksaan tidak merupakan klaim bahwa integrasi layanan eksternal sudah aktif.
