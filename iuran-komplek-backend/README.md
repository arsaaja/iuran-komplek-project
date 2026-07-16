# Iuran Komplek - Backend API (Laravel)

Backend REST API untuk aplikasi pengelolaan iuran bulanan komplek (satpam & kebersihan),
data penghuni, rumah, pembayaran, pengeluaran, dan laporan.

Lihat panduan instalasi lengkap di file `PANDUAN-INSTALASI.md` pada root repo utama.

## Ringkasan Fitur
- Manajemen Penghuni (CRUD): nama, foto KTP, status tetap/kontrak, no telepon, status pernikahan.
- Manajemen Rumah (CRUD): status dihuni/tidak dihuni, wajib terhubung penghuni jika dihuni, riwayat penghuni.
- Manajemen Jenis Iuran: satpam (Rp100.000) & kebersihan (Rp15.000), nominal bisa diubah lewat admin.
- Pembayaran: satu transaksi bisa mencakup banyak bulan & banyak jenis iuran sekaligus (mis. bayar kebersihan 1 tahun).
- Generate tagihan bulanan otomatis (hanya rumah berstatus dihuni yang ditagih).
- Pengeluaran: pencatatan biaya operasional (gaji satpam, alat kebersihan, dll).
- Laporan: ringkasan saldo bulanan (grafik 1 tahun) dan detail pemasukan/pengeluaran per bulan.

## Menjalankan Secara Lokal (tanpa Docker)
Lihat `PANDUAN-INSTALASI.md`.
