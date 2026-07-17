# Dokumentasi Fitur - Aplikasi Iuran Bulanan Komplek

Cara pakai dokumen ini: taruh foto screenshot aplikasi di folder yang sama (folder root)
dengan file dokumentasi ini, beri nama file sesuai yang tertulis di bawah tiap fitur (atau
kalau nama filenya beda, tinggal sesuaikan nama di dalam tanda kurung pada link gambar).
Kalau dokumen ini nanti ditempel ke badan email dalam format HTML/Word, link gambar akan
otomatis menampilkan fotonya.

---

## 1. Kelola Penghuni

![Kelola Penghuni](./doc-1-kelola-penghuni.png)

Fitur ini digunakan untuk mencatat data setiap penghuni komplek secara lengkap, mulai dari
nama, foto KTP, status sebagai penghuni tetap atau kontrak, nomor telepon, hingga status
pernikahan, dan seluruh data tersebut bisa ditambah maupun diubah kapan saja lewat satu
form yang sama sehingga admin tidak perlu berpindah halaman.

## 2. Kelola Rumah dan Riwayat Penghuni

![Kelola Rumah](./doc-2-kelola-rumah.png)

Fitur ini mencatat data setiap rumah di komplek berupa nomor rumah, tipe tetap atau
kontrak, serta status huninya, dan secara otomatis mewajibkan pengisian nama penghuni
setiap kali status rumah diubah menjadi dihuni sehingga tidak mungkin ada rumah berstatus
dihuni tanpa penghuni yang jelas, sekaligus menyimpan riwayat pergantian penghuni dari
waktu ke waktu yang bisa dibuka kembali kapan saja.

## 3. Kelola Jenis Iuran

![Kelola Jenis Iuran](./doc-3-jenis-iuran.png)

Fitur ini mengelola dua jenis iuran yang berlaku di komplek, yaitu iuran satpam dan iuran
kebersihan, di mana nominal masing-masing bisa diubah kapan saja langsung dari halaman ini
tanpa perlu mengutak-atik kode program, sehingga tetap fleksibel jika suatu saat nominal
iurannya perlu disesuaikan.

## 4. Pembayaran Iuran

![Pembayaran Iuran](./doc-4-pembayaran.png)

Fitur ini mencatat pembayaran iuran dari penghuni, dengan setiap transaksi bisa berisi
beberapa rincian sekaligus di mana masing-masing rincian bebas memilih jenis iuran serta
rentang bulan pembayarannya sendiri, sehingga penghuni bisa membayar satu bulan saja atau
sekaligus untuk rentang beberapa bulan seperti satu tahun penuh, baik untuk iuran satpam
maupun kebersihan tanpa ada batasan salah satu harus bulanan atau tahunan.

## 5. Tagihan Bulanan Otomatis

![Tagihan Bulanan Otomatis](./doc-5-tagihan-otomatis.png)

Sistem membuat tagihan bulanan secara otomatis setiap awal bulan khusus untuk rumah yang
sedang berstatus dihuni, sehingga rumah kontrak yang kosong tidak akan mendapatkan tagihan
sampai ada penghuni baru yang mengisinya, sesuai dengan aturan bahwa rumah kontrak hanya
ditagih ketika benar-benar ada penghuninya.

## 6. Pengeluaran

![Pengeluaran](./doc-6-pengeluaran.png)

Fitur ini mencatat pengeluaran operasional komplek seperti gaji satpam atau pembelian alat
kebersihan, yang nantinya menjadi pembanding terhadap data pemasukan pada halaman laporan
untuk menghitung sisa saldo yang sebenarnya.

## 7. Laporan Ringkasan (Grafik 1 Tahun)

![Laporan Ringkasan](./doc-7-laporan-ringkasan.png)

Halaman ini menampilkan ringkasan pemasukan, pengeluaran, dan sisa saldo untuk satu tahun
penuh dalam bentuk grafik, sehingga tren keuangan komplek per bulan beserta saldo yang
terus berjalan dari bulan ke bulan bisa langsung terlihat tanpa perlu membuka data mentah
satu per satu.

## 8. Detail Laporan Bulanan

![Detail Laporan Bulanan](./doc-8-laporan-bulanan.png)

Halaman ini menampilkan rincian lengkap pemasukan, yaitu siapa yang membayar, rumah mana,
dan jenis iuran apa, beserta rincian pengeluaran pada bulan tertentu yang dipilih, sehingga
memudahkan penelusuran detail transaksi di bulan tersebut kapan pun dibutuhkan.

## 9. Login dan Keamanan Akses

![Login](./doc-9-login.png)

Akses ke aplikasi dilindungi dengan sistem login berbasis token, sehingga hanya pengguna
yang memiliki akun, seperti Pak RT atau bendahara, yang bisa masuk dan mengelola data,
dengan setiap permintaan data dari aplikasi wajib menyertakan token login yang sah.
