# SUPRID_APP

**SUPRID_APP** adalah aplikasi pemesanan makanan modern yang dibangun menggunakan **Ionic Framework v7** dan **Angular**.  
Aplikasi ini dirancang untuk memudahkan pelanggan dalam memesan menu restoran secara digital, dengan pengalaman antarmuka yang elegan dan interaktif.

---

## 🚀 Fitur Utama

- ✅ **Autentikasi Pengguna**  
  - Login dan Registrasi  
  - Autentikasi berbasis Session Cookie (bukan token JWT)

- 🍽️ **Halaman Home**  
  - Tampilkan menu makanan  
  - Tombol favorit & tambahkan ke keranjang  
  - Gaya tampilan Ghibli, lembut, dan profesional

- ❤️ **Menu Favorit**  
  - Tambah atau hapus favorit  
  - Akses cepat dari halaman profil

- 🛒 **Keranjang Belanja**  
  - Menampilkan daftar makanan yang dipilih  
  - Pengaturan jumlah, total harga otomatis  
  - Lanjut ke pemesanan

- 📦 **Pesanan**  
  - Lihat pesanan aktif dan riwayat pesanan  
  - Konfirmasi penerimaan pesanan  
  - Rincian detail: nama menu, jumlah, harga, metode pembayaran, alamat/meja

- 👤 **Profil Pengguna**  
  - Informasi data diri  
  - Menu favorit pengguna  
  - Logout

---

## Teknologi yang Digunakan

| Teknologi       | Keterangan                                 |
|-----------------|---------------------------------------------|
| **Ionic v7**     | Framework utama UI mobile                  |
| **Angular**      | Kerangka kerja SPA untuk frontend          |
| **PHP & MySQL**  | Backend API dan database                   |
| **SCSS**         | Untuk styling tema dan variabel warna      |
| **Session ID**   | Autentikasi berbasis session & cookie      |

---

## Struktur Folder Penting
src/
├── app/
│ ├── auth/ ← Halaman login & register
│ ├── pages/ ← Home, Keranjang, Pesanan, dll
│ ├── services/ ← HTTP service & auth service
│ ├── guards/ ← Route guard berdasarkan session
│ └── tabs/ ← Navigasi utama
├── assets/ ← Gambar-gambar menu
├── environments/ ← Konfigurasi environment
├── theme/ ← Styling dan warna
