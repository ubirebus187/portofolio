# Pemeriksaan setelah Supabase terhubung

Jalankan di proyek Supabase pengujian atau dengan data draft sebelum publikasi.

1. **Publik anonim:** `/` dapat dibaca setelah publikasi. `/studio-aliamsyah` mengalihkan pengguna anonim ke `/studio-aliamsyah/masuk`. URL lama `/admin` dan `/admin/login` mengarah ke URL khusus. Saat konfigurasi belum lengkap, dashboard tetap tidak dirender dan login menampilkan pesan belum aktif. Endpoint GET `/api/admin/content` tanpa cookie mengembalikan 401.
2. **Login username:** username/password salah ditolak. Email tidak diterima sebagai pengganti username. Username valid + password Supabase valid membuat cookie HttpOnly, Secure production, SameSite Strict. **Akun selain admin:** akun valid yang UUID-nya tidak cocok ditolak. Membuat akun tidak otomatis memberi hak admin. Tabel admin_users tidak bisa ditulis pengguna biasa.
3. **Draft privat:** ubah ringkasan profil dan simpan. Browser privat tetap melihat versi terbit lama. Proyek berstatus Draft tidak muncul di daftar, detail, maupun snapshot site_publications.
4. **Publikasi:** setelah menyimpan, klik Publikasikan. Muat ulang website publik dan periksa ringkasan terbaru. Catatan internal proyek tidak muncul dalam respons publik.
5. **Konflik dua tab:** buka dua editor pada revisi yang sama. Simpan tab A, lalu simpan tab B. Tab B harus menolak perubahan dengan pesan konflik, tanpa menimpa tab A.
6. **Media:** JPG/PNG/WebP valid dan PDF valid <=3 MB berhasil; SVG, konten HTML dengan ekstensi .jpg, serta berkas >3 MB ditolak. URL yang tersimpan tetap dapat diakses setelah redeploy. Bucket media memang publik.
7. **Akses database:** role anon tidak memiliki privilege SELECT atas site_drafts. Akun authenticated non-admin tidak membaca draft atau menjalankan RPC perubahan. Akun admin hanya menulis lewat RPC yang memeriksa membership dan revisi.
8. **Sesi:** logout menghapus cookie. Setelah token kedaluwarsa, perubahan data ditolak sampai login kembali; tidak ada hasil 'berhasil' semu.
9. **Formulir:** tambah/edit/hapus/reorder tiap koleksi. Slug duplikat dan URL javascript: ditolak. Perubahan yang belum disimpan memicu peringatan saat meninggalkan halaman.
10. **CV:** tautan PDF membuka berkas asli/penggantinya. `/cv` memakai konten terbit terbaru. Cetak menjadi PDF berukuran A4 dan periksa page break.
11. **Responsif:** periksa lebar 390, 768, dan 1440 px. Menu publik dan sidebar admin mobile bisa dibuka/ditutup, tombol Keluar tersedia di HP, tabel/form tidak melebar, fokus keyboard terlihat, dan dialog pratinjau dapat ditutup dengan Escape.
12. **Navigasi:** filter kategori, lihat semua proyek, detail proyek, tombol email/telepon, dan tautan eksternal bekerja. Galeri tanpa proyek dan sertifikat kosong ditangani dengan benar.

13. **Pratinjau HTML bawaan:** file `preview.html` menampilkan versi publik dengan foto, pemilih ID/EN, tema terang/gelap, filter, detail proyek, dan responsif. File visual bawaan tidak berisi simulasi admin. Jika menjalankan `npm run preview:export`, file ini berubah menjadi demo React dengan pemilih **Studio demo** dan login simulasi; tidak ada sesi aplikasi online.
14. **Bahasa Inggris di dashboard:** ubah satu terjemahan pada menu **Bahasa Inggris**, simpan dan publikasikan. Periksa halaman depan, detail proyek, dan CV ketika EN aktif. Konten Indonesia tidak berubah. Jika terjemahan khusus belum ada pada konten baru, tampilkan teks aslinya, jangan tampilkan terjemahan CV lama yang tidak cocok.
15. **Preferensi pengunjung:** pilihan ID/EN dan tema bertahan setelah refresh dan berpindah halaman. Periksa mode `prefers-reduced-motion` supaya animasi tidak menghalangi akses.

Hasil pemeriksaan ini belum diklaim lulus sebelum dijalankan pada layanan nyata.

16. **Uji kontrol V3:** di beranda klik EN lalu cek teks hero berubah dari "Saya membangun" ke "I build" dan navigasi "Proyek" ke "Projects". Klik ID dan pastikan kembali. Klik tema, cek latar gelap lalu terang dan `aria-pressed` berubah. Refresh lalu buka `/cv` atau detail proyek untuk memastikan preferensi tersimpan serta sinkron. Ulangi di HP. Bila JS diblokir oleh ekstensi/CSP, izinkan JavaScript pada situs, bukan membuka screenshot statis.
17. **Pengujian versi Node:** pastikan `node -v` adalah 20.9+ atau 22.x dan `npm -v` adalah 10.x, lalu jalankan `npm install`, `npm run typecheck`, `npm test`, `npm run build`. Lakukan pengujian lagi pada deployment nyata karena demo HTML tidak menggantikan Next.js.
