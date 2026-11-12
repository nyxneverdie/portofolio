# Portfolio Faris

Portfolio statis untuk Faris, full-stack developer dari Yogyakarta. Foto dan tiga proyek masih memakai placeholder agar dapat diganti dengan materi asli.

## Jalankan di localhost

Pasang Node.js 20 atau lebih baru, lalu buka terminal di direktori proyek:

```sh
npm install
npm run dev
```

Buka **http://localhost:4173/**. Perintah `dev` membuat ulang bundle dan menjalankan server lokal. Tekan `Ctrl+C` untuk menghentikan server. Setelah mengubah sumber, hentikan dan jalankan kembali `npm run dev` untuk membangun ulang.

Untuk menggunakan port lain di macOS/Linux:

```sh
PORT=3000 npm run dev
```

Di PowerShell:

```powershell
$env:PORT=3000; npm run dev
```

Untuk hanya menjalankan hasil build yang sudah ada, gunakan `npm start`. Untuk membuat build tanpa server, gunakan `npm run build`. Pemeriksaan dasar tersedia melalui `npm run check`.

## Mengganti placeholder

- Foto: ganti `Asset/img/faris-portrait.svg` atau perbarui rujukannya di `src/app.jsx` dan preload di `index.html`.
- Proyek: ubah tiga entri di `src/data/projects.json`, termasuk gambar, judul, deskripsi, tautan, dan kategori. Tiga entri pertama tampil sebagai karya pilihan.
- Profil dan kontak tambahan: perbarui isi di `src/app.jsx`. Jangan menambahkan penghargaan atau angka yang belum diketahui.

Jalankan `npm run build` setelah perubahan. Untuk hosting statis, unggah `index.html` dan direktori `Asset/` bersama-sama. Font Google membutuhkan koneksi internet.

## Deploy ke Vercel

1. Push proyek ini ke repository GitHub, GitLab, atau Bitbucket.
2. Di dashboard Vercel, pilih **Add New → Project**, lalu impor repository tersebut.
3. Biarkan konfigurasi di `vercel.json` digunakan: build menjalankan `node scripts/build-vercel.mjs` dan output berada di `dist`. Tidak ada environment variable yang diperlukan.
4. Pilih **Deploy**. Vercel akan membuat URL untuk situs. Push berikutnya akan memicu deployment melalui integrasi Git.

Untuk memeriksa output deployment sebelum mengunggah:

```sh
node scripts/build-vercel.mjs
```

Folder `dist/` hanya berisi `index.html` dan `Asset/`. Foto dan proyek masih placeholder; ganti dengan materi asli sebelum dipublikasikan sebagai portfolio final.
