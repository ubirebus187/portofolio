# Arah UI/UX — Editorial Minimal

Tampilan memprioritaskan identitas, bukti karya, perjalanan profesional, dan cara menghubungi pemilik. Komposisi dibuat khusus untuk portofolio ini.

| Elemen | Pilihan |
|---|---|
| Latar publik | Putih hangat `#FAF9F6` |
| Teks utama | Navy gelap `#172638` |
| Aksen | Biru `#2859D9` |
| Penutup / kontak | Navy `#14263D` |
| Latar dashboard | Abu lembut `#F4F6FA` |
| Tipografi | Manrope untuk judul; DM Sans untuk isi; Arial sebagai cadangan |
| Gambar | Screenshot proyek dari CV; tidak memakai foto orang pengganti |
| Bentuk | Garis tipis, sudut sedang, bayangan ringan |
| Animasi | Transisi singkat pada interaksi, menghormati reduced motion |

Website publik menggunakan hero asimetris, monogram MA, galeri dua kolom pada desktop, linimasa pengalaman, kelompok keahlian, dan blok kontak berwarna navy. Pada HP, konten menjadi satu kolom.

Dashboard menggunakan sidebar, judul halaman yang jelas, pemberitahuan simpan, dan tombol Simpan draft terpisah dari Publikasikan. Warna status dilengkapi teks. Statistik hanya menghitung data nyata yang ada, tanpa angka pengunjung atau capaian rekaan.

Formulir memakai label yang selalu terlihat. Status loading/error/sukses ditampilkan. Penghapusan memerlukan konfirmasi. Focus ring, skip link, navigasi keyboard, serta dialog native disertakan. Perilaku browser visual tetap perlu diperiksa sebagaimana ACCEPTANCE.md.

## Penyempurnaan UI

- Hero monogram navy, komposisi lebih lapang, kartu proyek putih dengan gambar dan informasi yang terpisah jelas.
- Tipografi formulir 14 px desktop dan 16 px HP, label tetap terlihat, jarak kolom dan panel konsisten.
- Sidebar navy, ringkasan publikasi, kartu statistik, pencarian proyek, serta tombol simpan yang selalu mudah dijangkau.
- Di layar <=900 px, sidebar menjadi menu yang bisa dibuka/tutup; tombol Keluar tetap tersedia.
- Login dua kolom dengan panel identitas dan form yang ringkas. Di HP menjadi satu kolom. Password memiliki tombol tampil/sembunyikan.
- Navigasi admin tidak ditampilkan pada halaman publik. Login khusus tetap memakai autentikasi server.

## Revisi visual: Oktober 2026

- Foto asli pemilik menjadi elemen dominan pada hero, dengan monogram sebagai aksen latar. Aset disimpan lokal di `public/profile/muhamad-aliamsyah.jpg`.
- Kartu visual memakai *pointer-controlled 3D tilt*, kubus CSS berputar, dua cincin orbit, highlight dinamis, dan kedalaman pada kartu proyek/keahlian. Semua efek menjaga isi tetap terbaca; `prefers-reduced-motion` menonaktifkan gerak yang tidak diperlukan.
- Aplikasi publik memiliki tema terang/gelap dan kontrol bahasa ID/EN. Preferensi tersimpan secara lokal di perangkat pengunjung.
- Terjemahan Inggris berasal dari data CV awal dan dapat diperbarui lewat tab baru **Bahasa Inggris**. Perubahan pada teks Indonesia tidak dipaksa menggunakan terjemahan seed yang sudah tidak sesuai.
- Banner desain pada bagian atas beranda telah dihapus. Versi pratinjau offline bawaan mengikuti tampilan publik terbaru, dan generator React demo tersedia terpisah.
