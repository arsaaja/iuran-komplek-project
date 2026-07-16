# Aplikasi Iuran Bulanan Komplek

Backend (Laravel) dan Frontend (React) dibuat sebagai dua repo/folder terpisah:
- `iuran-komplek-backend/` - REST API
- `iuran-komplek-frontend/` - Antarmuka web

Lihat `PANDUAN-INSTALASI.md` untuk cara menjalankan (tanpa Docker), dan `docs/ERD.md` untuk skema database.

---

## Rangkuman Hasil per Fitur

### 1. Kelola Penghuni (Create/Update)
- Form input: nama, upload foto KTP, status penghuni (tetap/kontrak), no. telepon, status pernikahan.
- Foto KTP disimpan lewat Laravel Storage dan diakses lewat URL publik.
- Backend: `ResidentController`, `StoreResidentRequest`, `UpdateResidentRequest`.
- Frontend: `ResidentList.jsx`, `ResidentForm.jsx`.

### 2. Kelola Rumah (Create/Update)
- Form input: nomor rumah, tipe (tetap/kontrak), status (dihuni/tidak dihuni).
- Validasi: jika status diset "dihuni", field penghuni **wajib** dipilih (divalidasi di `StoreHouseRequest`/`UpdateHouseRequest` menggunakan `Rule::requiredIf`).
- Setiap perubahan penghuni pada satu rumah otomatis tercatat di tabel riwayat (`house_resident_histories`), termasuk kapan mulai dan kapan berakhir.
- Backend: `HouseController`, endpoint tambahan `GET /houses/{id}/histories`.
- Frontend: `HouseList.jsx`, `HouseForm.jsx`, `HouseHistory.jsx` (modal riwayat).

### 3. Kelola Jenis Iuran
- Dua jenis default: Iuran Satpam (Rp100.000) dan Iuran Kebersihan (Rp15.000), diisi lewat seeder.
- Nominal bisa diubah sewaktu-waktu lewat halaman **Jenis Iuran** tanpa mengubah kode program.
- Backend: `DueTypeController`.
- Frontend: `DueTypeList.jsx`.

### 4. Kelola Pembayaran
- Satu transaksi pembayaran bisa mencakup **beberapa jenis iuran sekaligus** dan **rentang beberapa bulan sekaligus** (misalnya bayar iuran kebersihan untuk 12 bulan dalam satu kali input), sesuai kebutuhan bahwa iuran kebersihan sering dibayar tahunan sedangkan satpam bulanan.
- Setiap pembayaran otomatis menandai tagihan terkait (`billing_periods`) menjadi lunas.
- Backend: `PaymentService` (logika transaksi), `PaymentController`.
- Frontend: `PaymentForm.jsx` (pilih penghuni, centang jenis iuran, pilih rentang bulan), `PaymentList.jsx`.

### 5. Tagihan Bulanan Otomatis
- Perintah `php artisan billing:generate` (dijadwalkan otomatis tiap tanggal 1 lewat scheduler Laravel) membuat tagihan bulan berjalan **hanya untuk rumah berstatus "dihuni"**.
- Rumah kontrak yang sedang kosong otomatis tidak menghasilkan tagihan, sesuai aturan "rumah kontrak hanya ditagih ketika ada penghuninya".
- Backend: `BillingGeneratorService`, `app/Console/Commands/GenerateMonthlyBilling.php`.

### 6. Pengeluaran
- Pencatatan biaya operasional (gaji satpam, alat kebersihan, dan lain-lain) sebagai data pembanding pemasukan pada laporan.
- Backend: `ExpenseController`.
- Frontend: `ExpenseList.jsx`, `ExpenseForm.jsx`.

### 7. Laporan Ringkasan (Grafik 1 Tahun)
- Menampilkan total pemasukan, total pengeluaran, dan saldo berjalan per bulan dalam bentuk grafik gabungan bar + garis untuk satu tahun penuh, beserta kartu ringkasan total.
- Backend: `ReportService::yearlySummary()`, endpoint `GET /reports/summary?year=2026`.
- Frontend: `SummaryDashboard.jsx` dengan `MonthlyBalanceChart.jsx` (menggunakan Recharts).

### 8. Laporan Detail Bulanan
- Menampilkan rincian pemasukan (siapa membayar, rumah mana, jenis iuran apa) dan rincian pengeluaran untuk satu bulan tertentu yang dipilih pengguna.
- Backend: `ReportService::monthlyDetail()`, endpoint `GET /reports/monthly-detail?month=7&year=2026`.
- Frontend: `MonthlyDetailReport.jsx`.

### 9. Autentikasi
- Login berbasis token (Laravel Sanctum), dipakai oleh React lewat header `Authorization: Bearer <token>`.
- Backend: `AuthController`.
- Frontend: `AuthContext.jsx`, `useAuth.js`, `PrivateRoute.jsx`.

---

## Struktur Folder Ringkas

```
iuran-komplek-project/
├── docs/
│   └── ERD.md
├── iuran-komplek-backend/      (Laravel - repo terpisah)
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   ├── Http/Requests/
│   │   ├── Http/Resources/
│   │   ├── Models/
│   │   ├── Services/
│   │   └── Console/Commands/
│   ├── database/migrations/
│   ├── database/seeders/
│   └── routes/api.php
├── iuran-komplek-frontend/     (React - repo terpisah)
│   └── src/
│       ├── api/
│       ├── context/
│       ├── components/
│       ├── features/
│       ├── pages/
│       └── routes/
└── PANDUAN-INSTALASI.md
```

## Catatan Penting

- **Tanpa Docker**: seluruh panduan instalasi menggunakan PHP, Composer, Node, dan MySQL yang diinstal langsung di komputer/server (lihat `PANDUAN-INSTALASI.md`).
- **Terpisah**: backend dan frontend adalah dua folder/repo independen, saling terhubung hanya lewat REST API (dengan CORS diatur di `config/cors.php` pada backend).
