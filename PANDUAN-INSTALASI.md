# Panduan Instalasi (Versi Mudah) - Aplikasi Iuran Bulanan Komplek

Ikuti langkah-langkah di bawah ini **satu per satu, dari atas ke bawah**. Jangan lompat
langkah. Kalau ada perintah yang errornya, cek dulu bagian **Troubleshooting** di paling
bawah sebelum lanjut.

Aplikasi ini punya 2 bagian yang harus dijalankan bersamaan di 2 jendela terminal berbeda:

- **Backend** (Laravel) - otaknya, tempat data diproses
- **Frontend** (React) - tampilan yang dilihat user di browser

---

## Langkah 0: Cek Software yang Harus Ada

Buka terminal / command prompt, ketik satu-satu perintah ini. Kalau muncul nomor versi,
berarti sudah terinstall. Kalau muncul tulisan "command not found", berarti belum, dan
harus diinstall dulu lewat link yang disediakan.

| Perintah Cek      | Contoh Hasil Normal  | Kalau Belum Ada, Install Dari                    |
| ----------------- | -------------------- | ------------------------------------------------ |
| `php -v`          | PHP 8.3.x            | https://www.php.net/downloads                    |
| `composer -V`     | Composer version 2.x | https://getcomposer.org/download/                |
| `node -v`         | v20.x.x              | https://nodejs.org/en/download (pilih versi LTS) |
| `npm -v`          | 10.x.x               | (otomatis ikut terinstall bersama Node.js)       |
| `mysql --version` | mysql Ver 8.0.x      | https://dev.mysql.com/downloads/mysql/           |
| `git --version`   | git version 2.x      | https://git-scm.com/downloads                    |

Kalau semua sudah muncul nomor versinya, lanjut ke Langkah 1.

---

## Langkah 1: Siapkan Database

1. Buka terminal, masuk ke MySQL dengan perintah:

   ```
   mysql -u root -p
   ```

   Lalu masukkan password MySQL kamu (kalau belum pernah diset password, coba langsung
   tekan Enter tanpa isi apa-apa).

2. Setelah masuk (tandanya prompt berubah jadi `mysql>`), copy-paste 3 baris perintah ini
   satu-satu, lalu tekan Enter setelah masing-masing baris:

   ```sql
   CREATE DATABASE iuran_komplek CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'iuran_user'@'localhost' IDENTIFIED BY 'password123';
   GRANT ALL PRIVILEGES ON iuran_komplek.* TO 'iuran_user'@'localhost';
   ```

   Lalu terakhir:

   ```sql
   FLUSH PRIVILEGES;
   ```

3. Keluar dari MySQL dengan mengetik:
   ```sql
   EXIT;
   ```

Catatan: nama database `iuran_komplek`, username `iuran_user`, dan password `password123`
di atas akan dipakai lagi di Langkah 2. Boleh diganti sesuai selera, asal konsisten dipakai
di semua langkah berikutnya.

---

## Langkah 2: Jalankan Backend (Laravel)

Buka **terminal pertama**, lalu jalankan perintah ini satu-satu (tunggu sampai selesai
sebelum lanjut ke baris berikutnya):

```bash
cd iuran-komplek-backend
composer install
```

Tunggu sampai proses download selesai (bisa 1-3 menit tergantung koneksi internet).

```bash
cp .env.example .env
php artisan key:generate
```

Sekarang buka file `.env` (ada di dalam folder `iuran-komplek-backend`) pakai text editor
apa saja (Notepad, VS Code, dll). Cari bagian ini dan ganti sesuai Langkah 1 tadi:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=iuran_komplek
DB_USERNAME=iuran_user
DB_PASSWORD=password123
```

Simpan file `.env`, lalu kembali ke terminal, jalankan:

```bash
php artisan migrate
php artisan db:seed
php artisan storage:link
php artisan serve
```

Kalau berhasil, akan muncul tulisan seperti:

```
INFO  Server running on [http://127.0.0.1:8000].
```

**Biarkan terminal ini tetap terbuka dan menyala.** Jangan ditutup selama aplikasi masih
dipakai.

Akun login default (bisa dipakai untuk tes):

- Email: `rt@komplek.test`
- Password: `password`

---

## Langkah 3: Jalankan Frontend (React)

Buka **terminal kedua** (baru, jangan tutup terminal pertama), lalu jalankan:

```bash
cd iuran-komplek-frontend
npm install
```

Tunggu sampai selesai (biasanya 1-2 menit).

```bash
cp .env.example .env
npm run dev
```

Kalau berhasil, akan muncul tulisan seperti:

```
Local:   http://localhost:5173/
```

Buka link tersebut di browser (Chrome/Firefox/Edge), lalu login pakai akun default di atas.

---

## Troubleshooting (Solusi Masalah Umum)

**"composer: command not found" atau "php: command not found"**
Berarti PHP/Composer belum terinstall atau belum masuk ke PATH sistem. Install ulang dari
link di Langkah 0, lalu restart terminal (tutup, buka lagi).

**Error saat `composer install`: "requires ext-xxx"**
Ada ekstensi PHP yang belum aktif. Buka file `php.ini`, cari baris `;extension=nama_ext`,
hapus tanda titik koma `;` di depannya, simpan, lalu ulangi `composer install`.

**Error `SQLSTATE[HY000] [1045] Access denied for user`**
Username/password MySQL di file `.env` tidak cocok dengan yang dibuat di Langkah 1. Cek
ulang, pastikan sama persis (huruf besar/kecil juga berpengaruh).

**Error `SQLSTATE[HY000] [2002] Connection refused` saat migrate**
Service MySQL belum menyala. Jalankan MySQL dari aplikasi seperti XAMPP/Laragon/MySQL
Workbench, atau lewat command `sudo service mysql start` (Linux/Mac) / buka "Services" lalu
cari "MySQL" (Windows), lalu ulangi `php artisan migrate`.

**Error "Port 8000 already in use" saat `php artisan serve`**
Ada aplikasi lain yang sudah pakai port 8000. Jalankan dengan port lain:

```bash
php artisan serve --port=8001
```

Lalu ubah juga `VITE_API_BASE_URL` di file `.env` frontend jadi `http://localhost:8001/api`.

**Error "Port 5173 already in use" saat `npm run dev`**
Sama seperti di atas, Vite otomatis akan menyarankan pindah ke port lain (misalnya 5174).
Ikuti saja saran yang muncul di terminal.

**Halaman frontend kebuka tapi data tidak muncul / error di console browser tentang CORS**
Cek file `.env` di folder backend, pastikan ada baris:

```
FRONTEND_URLS=http://localhost:5173
```

Sesuaikan port-nya dengan port frontend yang benar-benar berjalan. Setelah diubah, jalankan:

```bash
php artisan config:clear
```

lalu restart `php artisan serve`.

**Foto KTP tidak muncul / error 404 saat dibuka**
Pastikan sudah menjalankan `php artisan storage:link` di Langkah 2. Kalau sudah tapi masih
gagal, hapus folder `public/storage` (kalau ada), lalu jalankan ulang perintah tersebut.

**Lupa/salah input saat seed data (`php artisan db:seed`) dan mau mengulang dari awal**

```bash
php artisan migrate:fresh --seed
```

Perintah ini akan menghapus semua tabel dan membuatnya ulang dari nol beserta data awal.
**Hati-hati**, semua data yang sudah diinput sebelumnya akan hilang.

---

Kalau semua langkah di atas sudah dicoba dan masih gagal, catat pesan error lengkapnya
(screenshot terminal), supaya lebih mudah ditelusuri penyebabnya.
