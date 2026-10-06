# RZ STORE - E-Commerce Platform

**PT RZ E-Commerce Group**  
*Tagline: "Your Everyday Needs"*

Aplikasi e-commerce multi-kategori full-stack modern, scalable, dan production-ready yang dibangun dengan **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma**, autentikasi berbasis session token aman, keranjang belanja interaktif, checkout dinamis, arsitektur kurir & pembayaran modular, pelacakan pesanan real-time, serta panel kendali admin yang lengkap.

---

## 🎨 Identitas Brand & Palet Visual

- **Primary Color**: Navy Blue `#003366`
- **Dark Navy**: `#002244` & `#001830`
- **Accent Color**: Gold / Warm Yellow `#FFDB58` (digunakan secara presisi untuk badge promo, rating bintang, flash sale, dan CTA tertentu)
- **Background**: Putih `#FFFFFF` & Soft Light Gray `#F5F5F5`
- **Teks Utama**: `#172033`
- **Teks Sekunder**: `#64748B`
- **Tipografi**: Heading (`Montserrat`), Body (`Lato`)
- **Logo Resmi**: Menggunakan file logo resmi RZ Store di `public/images/logo.png`.

---

## 🚀 Fitur & Halaman Utama

### 1. Halaman Publik & Katalog Belanja
- **Homepage (`/`)**:
  - Sticky Announcement Top Bar ("*Gratis Ongkir min. belanja Rp200.000*")
  - Sticky Navbar dengan live search autocomplete, category drop-down, dan notifikasi badge keranjang & wishlist
  - Responsive Mobile Drawer & Bottom Navigation Bar
  - Hero Carousel interaktif dengan indikator & kontrol navigasi
  - Value Proposition (Gratis Ongkir, Garansi Original 100%, Pembayaran Lengkap, CS 24/7)
  - Grid Kategori Utama
  - **Flash Sale Section** dengan live countdown timer (HH : MM : SS) dan progress bar stok tersisa
  - Product Showcase Tabs (*Terlaris*, *Produk Baru*, *Pilihan Editor*)
  - Testimonial Pelanggan (Rating 4.8/5)
  - Social Feed & Newsletter
  - Footer komprehensif bergaya dark navy
- **Katalog Lengkap (`/shop`)**:
  - Filter sidebar (Kategori, Rentang Harga, Rating, Diskon, Ketersediaan Stok)
  - Sorting (Terpopuler, Terbaru, Harga Terendah, Harga Tertinggi, Rating Tertinggi)
  - Drawer filter untuk perangkat mobile
- **Kategori Produk (`/category/[slug]`)**: Menampilkan produk spesifik per kategori.
- **Detail Produk (`/product/[slug]`)**:
  - Galeri gambar produk
  - Pemilihan varian (warna, ukuran) dan kuantitas
  - Badge jaminan keaslian & garansi resmi
  - Tab informasi (Deskripsi, Spesifikasi Teknis, Ulasan Pembeli)
  - Rekomendasi produk serupa
- **Pencarian Produk (`/search`)**: Pencarian instan berdasarkan nama, kategori, brand, atau deskripsi dengan fallback saran pencarian jika tidak ada hasil.
- **Wishlist (`/wishlist`)**: Pengelolaan produk favorit dengan tombol instan pindah ke keranjang.

### 2. Transaksi & Pemesanan
- **Keranjang Belanja (`/cart`)**:
  - Checkbox pemilihan item individual & pilih semua (*select all*)
  - Ubah kuantitas & hapus item
  - Progress bar dinamis menuju Gratis Ongkir (min. Rp 200.000)
  - Input voucher diskon toko dengan validasi live API
  - Rincian biaya transparan
- **Checkout (`/checkout`)**:
  - Alamat pengiriman lengkap
  - Pilihan jasa ekspedisi terpercaya (JNE, J&T, SiCepat, Ninja Express, Pos Indonesia) dengan kalkulasi tarif otomatis
  - Pilihan metode pembayaran (QRIS instan, Virtual Account BCA/Mandiri, E-Wallet GoPay/OVO/DANA, Cash on Delivery)
  - Validasi voucher belanja dan ringkasan pembayaran akhir
- **Rincian Pesanan (`/order/[orderNumber]`)**:
  - Tampilan nomor order format resmi: `RZ-YYYYMMDD-XXXXX`
  - Panduan pembayaran otomatis (QRIS / Virtual Account) beserta tombol salin nominal
  - Tombol instan ke pelacakan kurir realtime
- **Lacak Pesanan (`/track-order`)**:
  - Pencarian berdasarkan Nomor Pesanan atau Nomor Resi Kurir (AWB)
  - Visualisasi 7 tahapan pengiriman:
    1. *Pesanan dibuat*
    2. *Pembayaran dikonfirmasi*
    3. *Pesanan diproses*
    4. *Paket diserahkan ke kurir*
    5. *Paket dalam perjalanan*
    6. *Paket tiba di tujuan*
    7. *Paket diterima*
  - Riwayat checkpoint riil bersumber dari `ShippingProvider`

### 3. Autentikasi & Akun Pelanggan
- **Login (`/auth/login`)**: Dukungan email/password, session JWT terenkripsi, tombol demo sekali klik untuk Customer dan Admin.
- **Registrasi (`/auth/register`)**: Pendaftaran akun baru dengan validasi kata sandi dan alamat awal.
- **Dashboard Akun Pelanggan**:
  - `/account`: Ringkasan profil dan statistik pesanan
  - `/account/orders`: Riwayat belanja dengan filter status pesanan
  - `/account/addresses`: Buku alamat pengiriman (tambah, ubah, hapus, atur alamat utama)
  - `/account/profile`: Kelola nama, email, dan nomor WhatsApp
  - `/account/settings`: Ganti kata sandi dan pengaturan notifikasi

### 4. Admin Dashboard (`/admin`)
- **Dashboard Ringkasan (`/admin`)**:
  - Total pendapatan, total pesanan, jumlah pelanggan, dan total produk aktif
  - Status pipeline pesanan (*Menunggu Bayar*, *Perlu Dikemas*, *Dalam Pengiriman*, *Selesai*)
  - Grafik pertumbuhan omset penjualan bulanan
  - Tabel pesanan masuk terbaru
- **Manajemen Produk (`/admin/products` & `/admin/products/create`)**:
  - Tambah produk dengan varian, stok, harga diskon, dan foto produk
  - Toggle status aktif/nonaktif dan hapus produk
- **Kategori Produk (`/admin/categories`)**: Tambah, ubah, dan kelola kategori unggulan.
- **Pesanan Masuk (`/admin/orders`)**:
  - Filter pesanan berdasarkan status
  - Modal pengubahan status pesanan
  - Input nama kurir & nomor resi AWB yang langsung terintegrasi ke pelacakan publik
  - Tambah log catatan checkpoint pengiriman
- **Pengiriman & Ekspedisi (`/admin/shipments`)**: Daftar seluruh paket aktif dengan link pelacakan langsung.
- **Data Pelanggan (`/admin/customers`)**: Daftar customer dan blokir/aktifkan akun.
- **Voucher Promo (`/admin/coupons`)**: Buat kupon diskon persentase atau nominal tetap dengan kuota dan tanggal kedaluwarsa.
- **Ulasan Produk (`/admin/reviews`)**: Moderasi ulasan dan rating pembeli.
- **Pengaturan Toko (`/admin/settings`)**: Konfigurasi identitas toko, kontak WhatsApp, dan informasi integrasi API.

---

## 🛠️ Arsitektur & Teknologi

| Komponen | Teknologi |
| :--- | :--- |
| **Framework** | Next.js 16+ (App Router) |
| **Bahasa** | TypeScript |
| **Styling** | Tailwind CSS v4 & Lucide React Icons |
| **Database ORM** | Prisma (`prisma/schema.prisma`) |
| **Data Repository** | Atomic JSON Engine (`src/lib/db.ts`) dengan skema Prisma siap PostgreSQL |
| **Autentikasi** | Secure HTTP-Only Cookie + JSON Web Token (JWT) |
| **Enkripsi** | bcryptjs |

---

## 📦 Akun Demo untuk Pengujian Cepat

| Role | Email | Password | Hak Akses |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@rzstore.com` | `user123` | Belanja, Keranjang, Checkout, Akun Pelanggan |
| **Admin** | `admin@rzstore.com` | `admin123` | Akses penuh ke seluruh menu `/admin` |

*Nomor Pesanan Demo untuk Lacak Pengiriman:*
- **Nomor Pesanan**: `RZ-20261007-00125`
- **Nomor Resi (AWB)**: `JNE982736411029`

---

## 💻 Panduan Instalasi & Menjalankan Proyek

### 1. Kloning & Masuk ke Direktori
```bash
cd d:\xampp\htdocs\Rzstore
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment (`.env`)
Salin atau buat file `.env` di root direktori proyek:
```env
# Koneksi Database PostgreSQL (Untuk Production)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rzstore?schema=public"

# Kunci Enkripsi Sesi
JWT_SECRET="rzstore_super_secure_secret_key_2026_jwt_token"

# Base URL Aplikasi
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Integrasi API Ekspedisi Kurir (JNE / J&T / SiCepat / Ninja / Pos Indonesia)
SHIPPING_API_KEY=""
SHIPPING_API_BASE_URL="https://api.rajaongkir.com/starter"

# Integrasi Payment Gateway (Midtrans / Xendit / Duitku)
PAYMENT_MERCHANT_ID=""
PAYMENT_SERVER_KEY=""
PAYMENT_CLIENT_KEY=""
```

### 4. Menjalankan Server Development
```bash
npm run dev
```
Buka browser di: [http://localhost:3000](http://localhost:3000)

### 5. Membangun Bundle Produksi
```bash
npm run build
npm start
```

---

## 🚚 Cara Menghubungkan API Ekspedisi Kurir (Shipping Provider)

Arsitektur kurir dibuat modular berbasis interface di `src/lib/shipping/shipping-provider.ts`:

```ts
export interface ShippingProvider {
  name: string;
  calculateRates(params: RateParams): Promise<CourierOption[]>;
  createWaybill(params: WaybillParams): Promise<WaybillResult>;
  trackShipment(trackingNumber: string): Promise<TrackingResult>;
}
```

Untuk menghubungkan penyedia riil (seperti RajaOngkir, Biteship, atau API JNE/SiCepat resmi):
1. Buka `src/lib/shipping/shipping-provider.ts`.
2. Masukkan URL endpoint provider dan API key dari `process.env.SHIPPING_API_KEY`.
3. Model abstraksi telah menyediakan pemetaan otomatis ke respon interface `CourierOption` dan `TrackingResult`.

---

## 💳 Cara Menghubungkan Payment Gateway

Arsitektur sistem pembayaran dikelola melalui `src/lib/payment/payment-provider.ts`:

```ts
export interface PaymentProvider {
  name: string;
  createPayment(params: CreatePaymentParams): Promise<PaymentResponse>;
  checkStatus(transactionId: string): Promise<PaymentStatusResponse>;
}
```

Tersedia provider siap pakai untuk:
- `QRISProvider`: Menghasilkan QR code instan
- `VirtualAccountProvider`: Menghasilkan nomor VA bank (BCA, Mandiri, BRI, BNI)
- `EWalletProvider`: Menghubungkan dompet digital (GoPay, OVO, DANA)
- `CODPaymentProvider`: Penanganan bayar di tempat

Masukkan kredensial gateway pada file `.env` (`PAYMENT_SERVER_KEY`), dan sesuaikan pemanggilan API HTTP di masing-masing class provider.

---

## 🗄️ Database PostgreSQL & Prisma Migration

1. Pastikan server PostgreSQL aktif dan variabel `DATABASE_URL` di `.env` sudah sesuai.
2. Jalankan perintah migrasi:
```bash
npx prisma migrate dev --name init
```
3. Generate prisma client:
```bash
npx prisma generate
```

---

© 2026 **PT RZ E-Commerce Group**. All rights reserved.
