# Panduan Instalasi - Aplikasi Iuran Bulanan Komplek

Aplikasi ini terdiri dari dua repo terpisah:
- `iuran-komplek-backend` - REST API (Laravel + MySQL)
- `iuran-komplek-frontend` - Antarmuka web (React + Vite)

Panduan ini menjalankan semuanya secara native di komputer/server (tanpa Docker).

---

## 1. Prasyarat

Install terlebih dahulu di komputer/server:

| Kebutuhan | Versi Minimum | Link Unduh |
|---|---|---|
| PHP | 8.3 | https://www.php.net/downloads |
| Composer | 2.x | https://getcomposer.org/download/ |
| Node.js | 20.x (LTS) | https://nodejs.org/en/download |
| MySQL | 8.0 | https://dev.mysql.com/downloads/mysql/ |
| Git | terbaru | https://git-scm.com/downloads |

Ekstensi PHP yang wajib aktif (biasanya sudah bawaan): `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `fileinfo`, `gd` (untuk upload foto KTP).

Cek versi setelah instalasi:
```bash
php -v
composer -V
node -v
mysql --version
```

---

## 2. Setup Database MySQL

Masuk ke MySQL, lalu buat database dan user:

```sql
CREATE DATABASE iuran_komplek CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'iuran_user'@'localhost' IDENTIFIED BY 'password_anda';
GRANT ALL PRIVILEGES ON iuran_komplek.* TO 'iuran_user'@'localhost';
FLUSH PRIVILEGES;
```

Catat nama database, username, dan password ini untuk konfigurasi `.env` backend di langkah berikutnya.

---

## 3. Instalasi Backend (Laravel)

```bash
cd iuran-komplek-backend

# 1. Install dependency PHP
composer install

# 2. Salin file environment
cp .env.example .env

# 3. Generate application key
php artisan key:generate
```

Buka file `.env`, sesuaikan bagian berikut dengan kredensial MySQL dari langkah 2:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=iuran_komplek
DB_USERNAME=iuran_user
DB_PASSWORD=password_anda

FRONTEND_URLS=http://localhost:5173
```

Lanjutkan:

```bash
# 4. Jalankan migration (membuat semua tabel)
php artisan migrate

# 5. Isi data awal (jenis iuran satpam/kebersihan + user login default)
php artisan db:seed

# 6. Buat symlink storage (agar foto KTP bisa diakses lewat URL)
php artisan storage:link

# 7. Jalankan server backend
php artisan serve
```

Backend akan berjalan di `http://localhost:8000`, dengan API di `http://localhost:8000/api`.

**Akun login default** (dari seeder), silakan ganti passwordnya setelah login pertama:
- Email: `rt@komplek.test`
- Password: `password`

### Menjalankan Generate Tagihan Bulanan Otomatis

Tagihan bulanan (satpam & kebersihan) dibuat otomatis lewat scheduler Laravel, hanya untuk rumah berstatus "dihuni". Agar berjalan otomatis setiap bulan, tambahkan cron job berikut di server (`crontab -e`):

```
* * * * * cd /path/ke/iuran-komplek-backend && php artisan schedule:run >> /dev/null 2>&1
```

Atau untuk generate manual kapan saja:
```bash
php artisan billing:generate --month=7 --year=2026
```

---

## 4. Instalasi Frontend (React)

Buka terminal baru (biarkan backend tetap berjalan):

```bash
cd iuran-komplek-frontend

# 1. Install dependency
npm install

# 2. Salin file environment
cp .env.example .env
```

Pastikan isi `.env` menunjuk ke backend yang sudah berjalan:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

Jalankan aplikasi:
```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`. Buka di browser dan login menggunakan akun default di atas.

---

## 5. Build untuk Produksi (opsional)

**Backend**: cukup jalankan di server dengan Nginx/Apache + PHP-FPM mengarah ke folder `public/`, dengan `.env` diset `APP_ENV=production` dan `APP_DEBUG=false`.

**Frontend**:
```bash
cd iuran-komplek-frontend
npm run build
```
Hasil build ada di folder `dist/`, tinggal upload ke hosting static (Nginx, Netlify, Vercel, dll), dan set `FRONTEND_URLS` di `.env` backend sesuai domain frontend produksi.

---

## 6. Verifikasi Instalasi

1. Buka `http://localhost:5173`, login dengan akun default.
2. Coba tambah data rumah dan penghuni di menu **Rumah** dan **Penghuni**.
3. Coba input pembayaran di menu **Pembayaran**.
4. Cek grafik saldo tahunan muncul di halaman **Ringkasan Laporan**.

Jika ada error CORS di console browser, pastikan `FRONTEND_URLS` di `.env` backend sudah sesuai dengan alamat frontend yang diakses, lalu jalankan `php artisan config:clear`.
