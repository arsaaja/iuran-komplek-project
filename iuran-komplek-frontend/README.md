# Iuran Komplek - Frontend (React + Vite)

Frontend untuk aplikasi pengelolaan iuran bulanan komplek. Berkomunikasi dengan backend
Laravel melalui REST API (lihat variabel `VITE_API_BASE_URL` di file `.env`).

Lihat panduan instalasi lengkap di file `PANDUAN-INSTALASI.md` pada root repo utama.

## Ringkasan Fitur
- Login (autentikasi token via Sanctum).
- Kelola Penghuni: tambah/ubah data penghuni beserta upload foto KTP.
- Kelola Rumah: tambah/ubah rumah, status dihuni/tidak dihuni, dan riwayat penghuni.
- Kelola Jenis Iuran: ubah nominal iuran satpam & kebersihan.
- Pembayaran: input pembayaran dengan pilihan banyak jenis iuran & rentang bulan (mendukung bayar 1 tahun sekaligus).
- Pengeluaran: input & daftar pengeluaran operasional.
- Laporan: ringkasan saldo bulanan dengan grafik 1 tahun, dan detail pemasukan/pengeluaran per bulan tertentu.

## Menjalankan Secara Lokal (tanpa Docker)
Lihat `PANDUAN-INSTALASI.md`.
