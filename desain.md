# Project Brief & Design Specification: Edurail

Dokumen ini berisi rangkuman proyek, visual design guidelines, arsitektur teknis frontend dan backend, serta struktur data dari platform **Edurail (Centralized Railway Education)**.

---

## 1. Project Overview & Context

Edurail adalah platform web edukasi berbasis *high-fidelity* yang dirancang untuk mensentralisasi dan menyederhanakan pengetahuan perkeretaapian bagi masyarakat umum Indonesia serta komunitas pecinta kereta api (*railfans*). Platform ini mengatasi fragmentasi informasi keselamatan dan operasional dengan menyediakan hub pendidikan yang terstruktur dan mudah diakses.

### Core Problem Statement
Terdapat kesenjangan pemahaman publik yang signifikan terkait keselamatan dan operasional kereta api di Indonesia. Tindakan berbahaya di sekitar perlintasan sebidang dan aktivitas di dekat jalur rel sering kali disebabkan oleh kurangnya informasi yang jelas dan terpusat. Edurail menjembatani kesenjangan ini dengan mentransformasikan standar teknis menjadi edukasi digital yang menarik dan mudah dipahami.

### Target Audience
*   **Masyarakat Umum (The General Public):** Pengguna KRL/LRT/MRT, komuter, dan warga yang tinggal di sekitar jalur rel kereta api.
*   **Railfans:** Pencinta dan antusias kereta api yang mendokumentasikan kegiatan perkeretaapian dan membutuhkan panduan keselamatan resmi.
*   **Trainee/Siswa:** Individu yang baru memulai pendidikan profesional perkeretaapian.

---

## 2. Visual Direction: "Kinetic Blue Academy"

Visual Edurail dirancang untuk memberikan kesan modern, futuristik, tepercaya, dan interaktif.

*   **Style:** Modern Glassmorphism (efek transparansi/blur menggunakan CSS backdrop-filter) dan gradasi halus (*subtle gradients*).
*   **Palette:**
    *   **Deep Navy (`#101415`):** Digunakan sebagai warna dasar utama (background) untuk memberikan kestabilan dan kedalaman atmosfer malam rel kereta.
    *   **Electric Blue (`#3b82f6` / HSL: `217, 91%, 60%`):** Digunakan sebagai warna aksen untuk elemen interaktif, tombol, status aktif, dan melambangkan energi teknis perkeretaapian.
    *   **Secondary/Slate Neutral (`#1f2937` / `#f3f4f6`):** Menyeimbangkan kontras teks.
*   **Typography:**
    *   Menggunakan font **Sora** (Sans-serif) yang diimpor melalui Google Fonts untuk memberikan tampilan bersih, modern, dan bernuansa industrial.
*   **Atmosphere:** Profesional, berteknologi tinggi (*high-tech*), bersih, dan edukatif.

---

## 3. Tech Stack & Architecture

### Backend: Node.js, Express & Supabase
*   **Express Server:** Terletak pada [backend/server.js](file:///c:/Kuliah/Rekayasa%20Web/Edurail/backend/server.js) yang berjalan pada port `5000` (atau port lingkungan).
*   **Database:** Supabase Client ([backend/config/supabase.js](file:///c:/Kuliah/Rekayasa%20Web/Edurail/backend/config/supabase.js)) untuk menyimpan data pengguna, semboyan, kereta, dan artikel.
*   **Keamanan & Auth:** Menggunakan `bcryptjs` untuk enkripsi password dan `jsonwebtoken` (JWT) untuk session administrator.
*   **Middleware:** CORS (diizinkan untuk frontend di port `3000`), `cookie-parser` untuk pengelolaan session token.

### Frontend: Next.js & TailwindCSS v4
*   **Framework:** Next.js 16 (App Router) di dalam folder [frontend/my-app](file:///c:/Kuliah/Rekayasa%20Web/Edurail/frontend/my-app).
*   **Language:** TypeScript.
*   **Styling:** TailwindCSS v4 dengan konfigurasi modern di [frontend/my-app/src/app/globals.css](file:///c:/Kuliah/Rekayasa%20Web/Edurail/frontend/my-app/src/app/globals.css).

---

## 4. Information Architecture & Workspace Structure

Struktur halaman frontend dan backend Edurail dipetakan langsung dengan folder repositori sebagai berikut:

### Frontend Pages & Components
Rute halaman utama terletak di dalam direktori [frontend/my-app/src/app](file:///c:/Kuliah/Rekayasa%20Web/Edurail/frontend/my-app/src/app):

1.  **Beranda (Homepage):** [page.tsx](file:///c:/Kuliah/Rekayasa%20Web/Edurail/frontend/my-app/src/app/page.tsx)
    *   Pintu masuk utama yang menampilkan misi platform, pilar edukasi, dan modul keselamatan cepat.
2.  **Semboyan (Signaling Catalog):** Folder [/semboyan](file:///c:/Kuliah/Rekayasa%20Web/Edurail/frontend/my-app/src/app/semboyan)
    *   Katalog visual interaktif tentang isyarat tangan, isyarat lampu, semboyan suara, dan papan marka.
3.  **Jenis Kereta (Rolling Stock):** Folder [/kereta](file:///c:/Kuliah/Rekayasa%20Web/Edurail/frontend/my-app/src/app/kereta)
    *   Spesifikasi teknis lokomotif listrik/diesel, kereta penumpang, dan armada KRL/LRT di Indonesia.
4.  **Knowledge & Safety Hub (Artikel):** Folder [/artikel](file:///c:/Kuliah/Rekayasa%20Web/Edurail/frontend/my-app/src/app/artikel) dan [/safety](file:///c:/Kuliah/Rekayasa%20Web/Edurail/frontend/my-app/src/app/safety)
    *   Kumpulan protokol keselamatan perkeretaapian (seperti Batas Aman 15 Kaki, Checklist Perlintasan) serta artikel edukasi mendalam.
5.  **Autentikasi:** Folder [/login](file:///c:/Kuliah/Rekayasa%20Web/Edurail/frontend/my-app/src/app/login) dan [/register](file:///c:/Kuliah/Rekayasa%20Web/Edurail/frontend/my-app/src/app/register)
    *   Halaman masuk dan pendaftaran untuk administrator Edurail.
6.  **Admin Dashboard & Management Engine:** Folder [/admin](file:///c:/Kuliah/Rekayasa%20Web/Edurail/frontend/my-app/src/app/admin)
    *   Interface manajemen konten berbasis CRUD untuk mengontrol data semboyan, spesifikasi lokomotif/kereta, dan isi artikel secara real-time.

---

## 5. API Spec & Database Models (Supabase Relation)

Berdasarkan spesifikasi OpenAPI di [swagger.yaml](file:///c:/Kuliah/Rekayasa%20Web/Edurail/swagger.yaml) dan controller backend di [backend/controllers](file:///c:/Kuliah/Rekayasa%20Web/Edurail/backend/controllers), berikut adalah relasi dan struktur data tabel Supabase yang digunakan:

### Database Schema

#### A. Tabel `users`
Tabel ini digunakan untuk mendata administrator platform.
*   `id`: `uuid` (Primary Key, default: `gen_random_uuid()`)
*   `nama`: `varchar` / `text` (Nama admin)
*   `email`: `varchar` / `text` (Email unik, untuk login)
*   `password`: `text` (Password terenkripsi bcrypt)
*   `role`: `varchar` (Default: `'admin'`)

#### B. Tabel `semboyan`
Katalog isyarat dan tanda perkeretaapian.
*   `id`: `bigint` / `integer` (Primary Key, Auto-increment)
*   `nama`: `text` (Contoh: "Semboyan 35")
*   `arti`: `text` (Arti singkat semboyan)
*   `gambar`: `text` (URL gambar/ilustrasi semboyan)
*   `deskripsi`: `text` (Penjelasan mendalam aturan semboyan)
*   `warna`: `text` (Kategori warna semboyan/tanda visual)

#### C. Tabel `kereta`
Spesifikasi lokomotif dan armada kereta.
*   `id`: `bigint` / `integer` (Primary Key, Auto-increment)
*   `nama`: `text` (Contoh: "CC 206")
*   `jenis`: `text` (Contoh: "Lokomotif Diesel Elektrik")
*   `gambar`: `text` (URL gambar beresolusi tinggi)
*   `deskripsi`: `text` (Spesifikasi mesin, berat, daya, atau sejarah)

#### D. Tabel `artikel`
Konten artikel edukasi dan panduan keselamatan.
*   `id`: `bigint` / `integer` (Primary Key, Auto-increment)
*   `judul`: `text` (Judul artikel)
*   `isi`: `text` (Konten artikel dalam format teks / HTML / markdown)
*   `tanggal`: `date` (Tanggal rilis artikel)

---

## 6. Backend API Route Mappings

Backend API didefinisikan pada [backend/routes](file:///c:/Kuliah/Rekayasa%20Web/Edurail/backend/routes):

| HTTP Method | Route Endpoint | Middleware / Auth | Deskripsi | Controller Handler |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | None | Pendaftaran akun admin baru | [register](file:///c:/Kuliah/Rekayasa%20Web/Edurail/backend/controllers/authController.js#L6) |
| **POST** | `/api/auth/login` | None | Login admin & generate JWT token | [login](file:///c:/Kuliah/Rekayasa%20Web/Edurail/backend/controllers/authController.js#L64) |
| **GET** | `/api/semboyan` | None | Ambil seluruh data katalog semboyan | [semboyanController](file:///c:/Kuliah/Rekayasa%20Web/Edurail/backend/controllers/semboyanController.js) |
| **GET** | `/api/semboyan/:id` | None | Detail spesifik suatu semboyan | [semboyanController](file:///c:/Kuliah/Rekayasa%20Web/Edurail/backend/controllers/semboyanController.js) |
| **POST** | `/api/semboyan` | JWT (Bearer Token) | Tambah data semboyan baru | [semboyanController](file:///c:/Kuliah/Rekayasa%20Web/Edurail/backend/controllers/semboyanController.js) |
| **PUT** | `/api/semboyan/:id` | JWT (Bearer Token) | Update informasi semboyan | [semboyanController](file:///c:/Kuliah/Rekayasa%20Web/Edurail/backend/controllers/semboyanController.js) |
| **DELETE**| `/api/semboyan/:id` | JWT (Bearer Token) | Hapus semboyan dari katalog | [semboyanController](file:///c:/Kuliah/Rekayasa%20Web/Edurail/backend/controllers/semboyanController.js) |
| **GET** | `/api/kereta` | None | Ambil daftar armada kereta/lokomotif | [keretaController](file:///c:/Kuliah/Rekayasa%20Web/Edurail/backend/controllers/keretaController.js) |
| **POST** | `/api/kereta` | JWT (Bearer Token) | Tambah spesifikasi kereta baru | [keretaController](file:///c:/Kuliah/Rekayasa%20Web/Edurail/backend/controllers/keretaController.js) |
| **PUT** | `/api/kereta/:id` | JWT (Bearer Token) | Ubah spesifikasi kereta | [keretaController](file:///c:/Kuliah/Rekayasa%20Web/Edurail/backend/controllers/keretaController.js) |
| **DELETE**| `/api/kereta/:id` | JWT (Bearer Token) | Hapus data kereta | [keretaController](file:///c:/Kuliah/Rekayasa%20Web/Edurail/backend/controllers/keretaController.js) |
| **GET** | `/api/artikel` | None | Ambil seluruh daftar artikel edukasi | [artikelController](file:///c:/Kuliah/Rekayasa%20Web/Edurail/backend/controllers/artikelController.js) |
| **POST** | `/api/artikel` | JWT (Bearer Token) | Publikasikan artikel baru | [artikelController](file:///c:/Kuliah/Rekayasa%20Web/Edurail/backend/controllers/artikelController.js) |
| **PUT** | `/api/artikel/:id` | JWT (Bearer Token) | Sunting isi artikel | [artikelController](file:///c:/Kuliah/Rekayasa%20Web/Edurail/backend/controllers/artikelController.js) |
| **DELETE**| `/api/artikel/:id` | JWT (Bearer Token) | Hapus artikel edukasi | [artikelController](file:///c:/Kuliah/Rekayasa%20Web/Edurail/backend/controllers/artikelController.js) |

---

## 7. Functional & Non-Functional Design Guidelines

1.  **Responsiveness (Mobile & Desktop 16:9):**
    *   Layout dioptimalkan untuk rasio aspek desktop 16:9 dengan panel navigasi yang ramah pembacaan.
    *   Elemen grid flex/grid untuk mobile, mereduksi menu navigasi menjadi hamburger menu pada layar `< 768px`.
2.  **Safety Emergency Modules Pinning:**
    *   Halaman Beranda dan halaman artikel menyematkan widget / tombol quick-access melayang berwarna merah/kuning cerah untuk **Panduan Darurat Perlintasan Sebidang**.
3.  **Media-Rich Learning:**
    *   Visualisasi data perkeretaapian harus didukung oleh kartu data berbayang (glassmorphism shadow) dengan gambar beresolusi tinggi, diunggah via URL atau Supabase Storage.
