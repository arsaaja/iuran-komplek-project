# ERD - Aplikasi Iuran Bulanan Komplek

Diagram ini menggambarkan relasi antar tabel database (MySQL). Bisa dibuka dengan
editor/plugin yang mendukung Mermaid (contoh: ekstensi "Markdown Preview Mermaid Support"
di VS Code), atau ditempel ke https://mermaid.live untuk melihat visualisasinya.

```mermaid
erDiagram
  RESIDENTS ||--o| HOUSES : "dihuni di"
  RESIDENTS ||--o{ HOUSE_RESIDENT_HISTORIES : punya
  HOUSES ||--o{ HOUSE_RESIDENT_HISTORIES : mencatat
  RESIDENTS ||--o{ PAYMENTS : membayar
  HOUSES ||--o{ PAYMENTS : untuk
  PAYMENTS ||--|{ PAYMENT_ITEMS : terdiri
  DUE_TYPES ||--o{ PAYMENT_ITEMS : jenis
  DUE_TYPES ||--o{ BILLING_PERIODS : jenis
  HOUSES ||--o{ BILLING_PERIODS : ditagih
  RESIDENTS ||--o{ BILLING_PERIODS : ditagih
  PAYMENT_ITEMS ||--o| BILLING_PERIODS : melunasi
  USERS ||--o{ PAYMENTS : mencatat
  USERS ||--o{ EXPENSES : mencatat

  RESIDENTS {
    bigint id PK
    string name
    string ktp_photo_path
    enum resident_type
    string phone_number
    enum marital_status
    boolean is_active
  }
  HOUSES {
    bigint id PK
    string house_number
    enum house_type
    enum status
    bigint current_resident_id FK
  }
  HOUSE_RESIDENT_HISTORIES {
    bigint id PK
    bigint house_id FK
    bigint resident_id FK
    date start_date
    date end_date
  }
  DUE_TYPES {
    bigint id PK
    string code
    string name
    decimal amount
    boolean is_active
  }
  PAYMENTS {
    bigint id PK
    bigint resident_id FK
    bigint house_id FK
    date payment_date
    decimal total_amount
    bigint created_by FK
  }
  PAYMENT_ITEMS {
    bigint id PK
    bigint payment_id FK
    bigint due_type_id FK
    tinyint period_month
    smallint period_year
    decimal amount
    enum status
  }
  BILLING_PERIODS {
    bigint id PK
    bigint house_id FK
    bigint resident_id FK
    bigint due_type_id FK
    tinyint period_month
    smallint period_year
    decimal amount
    enum status
    bigint payment_item_id FK
  }
  EXPENSES {
    bigint id PK
    string category
    decimal amount
    date expense_date
    string description
    bigint created_by FK
  }
  USERS {
    bigint id PK
    string name
    string email
    string role
  }
```

## Penjelasan Relasi Kunci

- **RESIDENTS - HOUSES**: satu rumah punya nol atau satu penghuni aktif (`current_resident_id`). Jika rumah berstatus "dihuni", kolom ini wajib terisi (divalidasi di aplikasi, bukan hanya di database).
- **HOUSE_RESIDENT_HISTORIES**: mencatat setiap kali penghuni sebuah rumah berganti. `end_date` kosong berarti penghuni tersebut masih tinggal sampai sekarang.
- **PAYMENTS - PAYMENT_ITEMS**: satu transaksi pembayaran (`PAYMENTS`) bisa memiliki banyak baris `PAYMENT_ITEMS`, sehingga satu kali bayar bisa mencakup beberapa bulan sekaligus (misalnya bayar kebersihan untuk 12 bulan) dan beberapa jenis iuran sekaligus.
- **BILLING_PERIODS**: tabel "tagihan seharusnya" yang di-generate otomatis tiap bulan hanya untuk rumah berstatus dihuni. Baris ini ditandai lunas dan ditautkan ke `PAYMENT_ITEMS` begitu ada pembayaran yang cocok.
- **EXPENSES**: berdiri sendiri, dipakai untuk kebutuhan laporan saldo (pemasukan dari `PAYMENT_ITEMS` dikurangi pengeluaran dari tabel ini).
