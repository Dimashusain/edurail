# Dokumen Riset & Pemahaman Proyek — Edurail

> **Centralized Railway Education** — Platform web edukasi perkeretaapian Indonesia.
> Dokumen ini disusun dari hasil pembacaan langsung terhadap kode sumber (backend + frontend), spesifikasi OpenAPI (`swagger.yaml`), dan dokumen desain (`desain.md`).
> Tanggal analisis: 2026-06-30.

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Domain & Latar Belakang Bisnis](#2-domain--latar-belakang-bisnis)
3. [Arsitektur Sistem (Big Picture)](#3-arsitektur-sistem-big-picture)
4. [Tech Stack](#4-tech-stack)
5. [Struktur Repositori](#5-struktur-repositori)
6. [Backend — Analisis Mendalam](#6-backend--analisis-mendalam)
7. [Frontend — Analisis Mendalam](#7-frontend--analisis-mendalam)
8. [Database / Data Model (Supabase)](#8-database--data-model-supabase)
9. [Autentikasi & Otorisasi (Alur Keamanan)](#9-autentikasi--otorisasi-alur-keamanan)
10. [Penanganan File / Upload Gambar](#10-penanganan-file--upload-gambar)
11. [Visual Design System](#11-visual-design-system)
12. [Pemetaan Rute Halaman](#12-pemetaan-rute-halaman)
13. [Karakteristik Fungsional & Non-Fungsional](#13-karakteristik-fungsional--non-fungsional)
14. [Temuan, Risiko, & Rekomendasi (Code Review)](#14-temuan-risiko--rekomendasi-code-review)
15. [Cara Menjalankan (Runbook)](#15-cara-menjalankan-runbook)
16. [Glosarium](#16-glosarium)

---

## 1. Ringkasan Eksekutif

**Edurail** adalah platform web full-stack yang berfungsi sebagai **hub edukasi perkeretaapian terpusat** untuk masyarakat Indonesia. Tujuannya menjembatani kesenjangan pemahaman publik soal **keselamatan** dan **operasional teknis** kereta api — termasuk bagi *railfans* dan calon profesional perkeretaapian.

**Bentuk produk:** aplikasi dua bagian —
- **Frontend publik** (read-only): beranda, katalog semboyan, katalog jenis kereta, artikel, dan halaman protokol keselamatan.
- **Frontend admin** (CRUD terproteksi): dashboard + manajemen konten untuk semboyan, kereta, dan artikel.

**Pola arsitektur:** client–server terpisah.
- Frontend: **Next.js 16 (App Router) + React 19 + TypeScript + TailwindCSS v4**.
- Backend: **Node.js + Express 5 + Supabase (PostgreSQL) sebagai database**.
- Komunikasi via REST/JSON; autentikasi admin pakai **JWT**; upload gambar via **Supabase Storage**.

**Singkatnya:** proyek ini adalah mini-CMS tematik (perkeretaapian) dengan sisi publik yang "cantik" (glassmorphism, dark navy + electric blue) dan sisi admin yang fungsional untuk mengelola konten edukatif secara real-time.

---

## 2. Domain & Latar Belakang Bisnis

### Problem Statement
Kesenjangan pemahaman publik tentang keselamatan & operasional KA menyebabkan tindakan berbahaya di sekitar perlintasan sebidang dan jalur rel. Informasi resmi tersebar/fragmentasi. Edurail **mensentralisasi** standar teknis menjadi edukasi digital yang mudah dipahami.

### Target Audiens
| Audiens | Kebutuhan |
|---|---|
| **Masyarakat umum** | Pengguna KRL/LRT/MRT, komuter, warga sekitar rel → butuh panduan keselamatan |
| **Railfans** | Dokumentator aktivitas KA → butuh panduan keselamatan resmi saat memotret |
| **Trainee/Siswa** | Calon profesional perkereteapian → butuh materi operasional teknis |

### Konten Domain Utama (sumber: halaman `/safety`, `/semboyan`)
- **RUMAJA** (Ruang Manfaat Jalan): batas aman ±6 m / 15–20 kaki dari as rel.
- **BTKD** (Berhenti, Tengok Kanan-Kiri, Dengar): protokol menyebrang perlintasan sebidang.
- **Semboyan 35**: isyarat klakson lokomotif.
- Kategori semboyan: isyarat tangan petugas, semboyan lampu persinyalan, semboyan suara, papan marka/batas kecepatan.

---

## 3. Arsitektur Sistem (Big Picture)

```
┌─────────────────────────────┐        HTTP/JSON (axios)        ┌──────────────────────────────┐
│   FRONTEND (Next.js 16)     │  ───────────────────────────►   │   BACKEND (Express 5)        │
│   http://localhost:3000     │   Bearer JWT (localStorage)     │   http://localhost:5000/api   │
│                             │   FormData (upload gambar)      │                              │
│  - Publik (SSR/client)      │  ◄───────────────────────────   │  routes → controllers        │
│  - /admin (client, guard)   │                                 │  middleware: auth + upload   │
└─────────────────────────────┘                                 └───────────────┬──────────────┘
                                                                                │ supabase-js
                                                                                ▼
                                                                ┌──────────────────────────────┐
                                                                │   Supabase (Postgres +        │
                                                                │   Storage bucket "edurail")   │
                                                                │   tabel: users, semboyan,     │
                                                                │   kereta, artikel             │
                                                                └──────────────────────────────┘
```

**Catatan pola:** Frontend memakai Next.js App Router dengan komponen **`"use client"`** dominan (data fetching dari sisi klien via axios), bukan Server Components/Server Actions. Backend adalah REST API murni (tanpa SSR rendering).

---

## 4. Tech Stack

### Backend (`backend/package.json`)
| Komponen | Versi | Fungsi |
|---|---|---|
| `express` | ^5.2.1 | Web framework (versi 5 — terbaru) |
| `@supabase/supabase-js` | ^2.108.1 | Klien database + storage |
| `bcryptjs` | ^3.0.3 | Hashing password |
| `jsonwebtoken` | ^9.0.3 | Pembuatan/verifikasi JWT |
| `cookie-parser` | ^1.4.7 | Membaca cookie `token` |
| `cors` | ^2.8.6 | CORS untuk origin frontend |
| `multer` | ^2.1.1 | Parsing `multipart/form-data` (upload) |
| `dotenv` | ^17.4.2 | Memuat `.env` |
| `pg` | ^8.21.0 | *(terpasang tapi tidak terpakai — Supabase dipakai via supabase-js)* |
| `nodemon` (dev) | ^3.1.14 | Hot reload dev server |

### Frontend (`frontend/my-app/package.json`)
| Komponen | Versi | Fungsi |
|---|---|---|
| `next` | 16.2.9 | Framework (App Router, Turbopack) |
| `react` / `react-dom` | 19.2.4 | UI runtime |
| `tailwindcss` | ^4 | Styling (CSS-first config, `@import "tailwindcss"`) |
| `@tailwindcss/postcss` | ^4 | PostCSS plugin Tailwind v4 |
| `axios` | *(implisit terpakai di `src/services/api.ts`, lihat catatan)* | HTTP client |
| `babel-plugin-react-compiler` | 1.0.0 | React Compiler (eksperimental, `reactCompiler: true`) |
| `concurrently` | ^10 | Menjalankan FE + BE bersamaan via `npm run dev` |
| `eslint` + `eslint-config-next` | ^9 / 16.2.9 | Linting |

> **Catatan:** `axios` dipakai di `src/services/api.ts` tetapi **tidak tercantum di `dependencies`** `package.json` — kemungkinan ada sebagai transitive/historis. Lihat bagian [Risiko](#14-temuan-risiko--rekomendasi-code-review).

---

## 5. Struktur Repositori

```
Edurail/
├── desain.md                  # Spesifikasi desain & brief proyek
├── swagger.yaml               # Spesifikasi OpenAPI 3.0.0 (referensi endpoint)
├── .mcp.json                  # Konfigurasi MCP (Chrome DevTools)
├── backend/                   # API server (Express)
│   ├── server.js              # Entry point
│   ├── .env                   # Konfigurasi rahasia (REDACTED)
│   ├── config/supabase.js     # Klien Supabase (service role)
│   ├── controllers/           # Logika bisnis per resource
│   │   ├── authController.js
│   │   ├── semboyanController.js
│   │   ├── keretaController.js
│   │   └── artikelController.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # verifyToken (cookie + Bearer)
│   │   └── upload.js          # multer memoryStorage
│   └── routes/                # Definisi rute per resource
│       ├── authRoutes.js
│       ├── semboyanRoutes.js
│       ├── keretaRoutes.js
│       └── artikelRoutes.js
└── frontend/my-app/           # Aplikasi Next.js
    ├── package.json
    ├── next.config.ts         # reactCompiler: true
    ├── tsconfig.json          # alias "@/*" → ./src/*
    ├── .env.local             # NEXT_PUBLIC_API_URL=http://localhost:5000/api
    └── src/
        ├── middleware.ts       # Next middleware (matcher /admin) — saat ini passthrough
        ├── services/api.ts     # instance axios + retry GET
        ├── lib/auth.ts         # KOSONG (0 byte) — tidak terpakai
        ├── types/              # TS interfaces (semboyan, kereta, artikel, dashboard)
        ├── components/         # Navbar, Footer, Card, IntroLoader + admin/{Navbar,Sidebar}
        └── app/                # App Router pages (lihat §12)
```

---

## 6. Backend — Analisis Mendalam

### 6.1 Entry Point — `server.js`
- Membuat app Express, memasang `cookie-parser`, CORS (origin `http://localhost:3000`, `credentials: true`), dan `express.json()`.
- **Mount routes** di prefix `/api`:
  - `/api/auth` → authRoutes
  - `/api/semboyan` → semboyanRoutes
  - `/api/kereta` → keretaRoutes
  - `/api/artikel` → artikelRoutes
- Endpoint root `GET /` → health check `{ success, message: "EduRail API Running" }`.
- Endpoint contoh proteksi `GET /api/profile` (verifyToken) → mengembalikan `req.user`.
- Fallback `404` JSON `{ success:false, message:"Endpoint tidak ditemukan" }`.
- Listen pada `process.env.PORT || 5000`.

### 6.2 Config — `config/supabase.js`
- Membuat klien Supabase memakai `SUPABASE_URL` + **`SUPABASE_SERVICE_ROLE_KEY`** (kunci server penuh, melewati RLS).

### 6.3 Middleware

**`authMiddleware.js` — `verifyToken`**
- Membaca token dari **`req.cookies.token`** terlebih dahulu; jika tidak ada, fallback ke header `Authorization: Bearer <token>`.
- Verifikasi via `jwt.verify(..., JWT_SECRET)`; attach payload ke `req.user`.
- 401 jika tidak ada token; 403 jika token invalid.

**`upload.js`**
- `multer` dengan `memoryStorage()` — file disimpan di memori (`req.file.buffer`), lalu di-**stream** ke Supabase Storage di controller. Tidak ada disk I/O lokal.
- Nama file dibuat dengan prefix timestamp: `${Date.now()}-${originalname}`.

### 6.4 Controllers

| Controller | Operasi | Catatan penting |
|---|---|---|
| `authController` | `register`, `login` | Register: cek duplikasi email, `bcrypt.hash(pw, 10)`, role di-hardcode `'admin'`. Login: cari user by email, `bcrypt.compare`, lalu `jwt.sign({id,email,role}, JWT_SECRET, {expiresIn:'1d'})`. |
| `semboyanController` | get all, get by id, create, update, delete | Create/update upload gambar ke Supabase Storage bucket `edurail` bila ada `req.file`; simpan public URL. Order by `id` ascending. |
| `keretaController` | get all, get by id, create, update, delete | Pola identik dengan semboyan (upload gambar, bucket `edurail`). |
| `artikelController` | get all, get by id, create, update, delete | **Tanpa upload gambar** (hanya teks: judul, isi, tanggal). Order by `tanggal` descending. |

**Pola respons (penting untuk konsumsi frontend):**
- **GET list** (semboyan/kereta/artikel) → mengembalikan **array langsung** (`res.status(200).json(data)`).
- **GET by id** → objek langsung.
- **Create/Update** → objek dengan `{ message, data }`.
- Inilah sebabnya frontend sering mengecek `Array.isArray(res.data) ?? Array.isArray(res.data.data)` (lihat `admin/dashboard`).

### 6.5 Routes — Matriks Lengkap

| Method | Endpoint | Middleware | Handler |
|---|---|---|---|
| POST | `/api/auth/register` | — | `register` |
| POST | `/api/auth/login` | — | `login` |
| GET | `/api/semboyan` | — | getAllSemboyan |
| GET | `/api/semboyan/:id` | — | getSemboyanById |
| POST | `/api/semboyan` | verifyToken + upload.single('gambar') | createSemboyan |
| PUT | `/api/semboyan/:id` | verifyToken + upload.single('gambar') | updateSemboyan |
| DELETE | `/api/semboyan/:id` | verifyToken | deleteSemboyan |
| GET | `/api/kereta` | — | getAllKereta |
| GET | `/api/kereta/:id` | — | getKeretaById |
| POST | `/api/kereta` | verifyToken + upload.single('gambar') | createKereta |
| PUT | `/api/kereta/:id` | verifyToken + upload.single('gambar') | updateKereta |
| DELETE | `/api/kereta/:id` | verifyToken | deleteKereta |
| GET | `/api/artikel` | — | getAllArtikel |
| GET | `/api/artikel/:id` | — | getArtikelById |
| POST | `/api/artikel` | verifyToken | createArtikel |
| PUT | `/api/artikel/:id` | verifyToken | updateArtikel |
| DELETE | `/api/artikel/:id` | verifyToken | deleteArtikel |

> Pola **public read / protected write**: semua GET publik, semua POST/PUT/DELETE butuh JWT.

---

## 7. Frontend — Analisis Mendalam

### 7.1 Konfigurasi
- **`next.config.ts`**: mengaktifkan `reactCompiler: true` (React Compiler — optimasi otomatis).
- **`tsconfig.json`**: `strict: true`, path alias `@/* → ./src/*`, target ES2017.
- **`.env.local`**: `NEXT_PUBLIC_API_URL=http://localhost:5000/api`.
- **`dev` script** (`package.json`): `concurrently "next dev" "npm --prefix ../../backend run dev"` — satu perintah menjalankan FE + BE.

### 7.2 HTTP Layer — `services/api.ts`
- Instance axios dengan `baseURL = NEXT_PUBLIC_API_URL`, `withCredentials: true`.
- **Request interceptor**: menyematkan `Authorization: Bearer <token>` dari `localStorage`.
- **Response interceptor (retry)**: pada **network error** (tidak ada respon server) untuk method **GET**, retry maksimal **3 kali** dengan jeda **1500 ms**. Berguna saat backend belum siap (cold start).
- `console.log` URL saat init — berguna untuk debugging.

### 7.3 Root Layout — `app/layout.tsx`
- Font **Sora** (Google Fonts) via `next/font`, diekspos sebagai CSS variable `--font-sora`.
- Body: `bg-[#101415]`, `text-[#f3f4f6]`, `font-sans`.
- Menyertakan `<IntroLoader />`, `<Navbar />`, konten, dan `<Footer />`.
- Navbar & Footer **otomatis disembunyikan** di rute `/admin*` (cek `usePathname()`).

### 7.4 Autentikasi Sisi Frontend
- **Login** (`/login`): POST `/auth/login` → simpan `token` & `user` ke `localStorage` → redirect ke `/admin/dashboard`.
- **Register** (`/register`): POST `/auth/register` → redirect ke `/login`.
- **Admin guard** (`app/admin/layout.tsx`): cek `localStorage.getItem("token")`. Jika tidak ada → push `/login`. Menampilkan spinner "Mengecek otorisasi..." selama pengecekan.
- **Logout**: hapus `token`/`user` dari `localStorage`, `window.location.href = "/login"`.
- **Next `middleware.ts`**: matcher `/admin/:path*`, namun implementasinya saat ini **hanya passthrough** (`NextResponse.next()` tanpa pengecekan token server-side). Lihat [Risiko](#14).

### 7.5 Komponen UI
| Komponen | Peran |
|---|---|
| `Navbar` | Navigasi publik, sticky, glassmorphism. Sembunyi di `/admin`. Support modal state via custom event. |
| `Footer` | Footer publik; sembunyi di `/admin`. |
| `Card` | Wrapper glass-card reusable (`glass-card` Tailwind utility). |
| `IntroLoader` | Loader animasi pembuka (animasi `track-slide`). |
| `admin/Sidebar`, `admin/Navbar` | Komponen admin lama (terlihat tidak terpakai — admin layout membangun sidebar-nya sendiri). |

### 7.6 Halaman Publik
- **`/` (Beranda)**: hero + 3 pilar edukasi (Semboyan, Jenis Kereta, Artikel/Safety) + **widget checklist keselamatan interaktif** (state `checklist` + `safetyCertified`).
- **`/semboyan`**: katalog dengan **search/filter** (filter by `nama` & `warna`). Modal detail.
- **`/kereta`**: katalog jenis kereta.
- **`/artikel`**: daftar artikel.
- **`/safety`**: konten statis protokol keselamatan (RUMAJA, BTKD, larangan railfans).

### 7.7 Halaman Admin (`/admin/*`)
- **`/admin/dashboard`**: statistik (total semboyan/kereta/artikel) via `Promise.all` GET ke 3 endpoint. Handle respons yang bisa array atau `{data}`.
- **`/admin/semboyan`** (representatif): form (nama, arti, warna, deskripsi, **upload gambar + preview**) + tabel/grid data + tombol edit/delete. Submit memakai `FormData` (multipart) → cocok dengan `upload.single('gambar')` di backend.
- **`/admin/kereta`**, **`/admin/artikel`**: pola CRUD serupa.

### 7.8 Tipe Data (`src/types/`)
```ts
Semboyan  { id:number; nama:string; arti:string; gambar:string; deskripsi:string; warna:string }
Kereta    { id:number; nama:string; jenis:string; gambar:string; deskripsi:string }
Artikel   { id:number; judul:string; isi:string; tanggal:string }
DashboardStats { totalSemboyan:number; totalKereta:number; totalArtikel:number }
```

---

## 8. Database / Data Model (Supabase)

Empat tabel, direkonstruksi dari controller + `desain.md`. Tidak ada foreign key antar tabel (relasi konseptual, bukan fisik).

### `users` (admin)
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid | PK, `gen_random_uuid()` |
| `nama` | text | nama admin |
| `email` | text | unik, untuk login |
| `password` | text | hash bcrypt |
| `role` | varchar | default `'admin'` |

### `semboyan`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | bigint/int | PK, auto-increment |
| `nama` | text | mis. "Semboyan 35" |
| `arti` | text | arti singkat |
| `gambar` | text | URL (Supabase Storage) |
| `deskripsi` | text | penjelasan mendalam |
| `warna` | text | kategori warna |

### `kereta`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | bigint/int | PK, auto-increment |
| `nama` | text | mis. "CC 206" |
| `jenis` | text | mis. "Lokomotif Diesel Elektrik" |
| `gambar` | text | URL |
| `deskripsi` | text | spesifikasi |

### `artikel`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | bigint/int | PK, auto-increment |
| `judul` | text | judul |
| `isi` | text | konten (teks/HTML/markdown) |
| `tanggal` | date | tanggal rilis |

### Storage
- Bucket **`edurail`** di Supabase Storage menyimpan gambar semboyan & kereta (diakses via public URL).

---

## 9. Autentikasi & Otorisasi (Alur Keamanan)

```
Register:  POST /api/auth/register {nama,email,password}
           → bcrypt hash → insert users(role='admin') → 201

Login:     POST /api/auth/login {email,password}
           → fetch user → bcrypt.compare → jwt.sign({...},JWT_SECRET,{expiresIn:'1d'})
           → 200 { token }
           → FE simpan token ke localStorage

Akses protected:
           GET/POST/PUT/DELETE resource admin
           Header: Authorization: Bearer <token>   (FE interceptor)
           -atau-  Cookie: token=<jwt>             (backend dukung keduanya)
           → verifyToken → req.user {id,email,role}
```

**Karakteristik:**
- Sistem ini **single-role** (`admin` saja) — tidak ada multi-role/permission.
- Public users (masyarakat) **tidak butuh login** untuk membaca konten.
- Token disimpan di **localStorage** (bukan httpOnly cookie) — lihat risiko.

---

## 10. Penanganan File / Upload Gambar

1. Frontend admin membuat `FormData` dengan field `gambar` (File) + field teks.
2. Backend `multer` (`memoryStorage`) menangkap `req.file` di memori.
3. Controller mengunggah `req.file.buffer` ke bucket Supabase `edurail` dengan nama `${Date.now()}-${originalname}` dan `contentType = req.file.mimetype`.
4. Mengambil public URL via `getPublicUrl()` → disimpan ke kolom `gambar`.
5. Saat update: gambar baru hanya akan menimpa bila ada `req.file`; jika tidak, field `gambar` tidak diubah.

> Catatan: file lama di Storage **tidak dihapus** saat update/delete record (orphaned objects) — lihat risiko.

---

## 11. Visual Design System ("Kinetic Blue Academy")

Didefinisikan di `globals.css` + `desain.md`.

| Token | Nilai | Penggunaan |
|---|---|---|
| Navy Dark | `#101415` | Background utama |
| Navy Card | `#161e22` | Panel/sidebar |
| Electric Blue | `#3b82f6` | Aksen, tombol, status aktif |
| Electric Hover | `#2563eb` | Hover state |
| Foreground | `#f3f4f6` | Teks utama |

- **Style:** Modern Glassmorphism (`backdrop-filter: blur`) + subtle gradients + neon glow blobs.
- **Font:** **Sora** (Google Fonts).
- **Utilities kustom:** `.glass-panel`, `.glass-card` (hover lift + glow), `.glass-input`, scrollbar kustom, animasi `track-slide` (tema rel kereta).
- **Atmosfer:** high-tech, bersih, edukatif.

---

## 12. Pemetaan Rute Halaman

| Rute | Tipe | Sumber | Fungsi |
|---|---|---|---|
| `/` | client | `app/page.tsx` | Beranda + widget keselamatan |
| `/semboyan` | client | `app/semboyan/page.tsx` | Katalog semboyan + search |
| `/kereta` | client | `app/kereta/page.tsx` | Katalog jenis kereta |
| `/artikel` | client | `app/artikel/page.tsx` | Daftar artikel |
| `/safety` | client | `app/safety/page.tsx` | Protokol keselamatan (statis) |
| `/login` | client | `app/login/page.tsx` | Login admin |
| `/register` | client | `app/register/page.tsx` | Daftar admin |
| `/admin` | client (guard) | `app/admin/page.tsx` | (redirect/dashboard) |
| `/admin/dashboard` | client | `app/admin/dashboard/page.tsx` | Statistik |
| `/admin/semboyan` | client | `app/admin/semboyan/page.tsx` | CRUD semboyan |
| `/admin/kereta` | client | `app/admin/kereta/page.tsx` | CRUD kereta |
| `/admin/artikel` | client | `app/admin/artikel/page.tsx` | CRUD artikel |

---

## 13. Karakteristik Fungsional & Non-Fungsional

**Fungsional**
- CRUD penuh untuk admin pada 3 entitas (semboyan, kereta, artikel).
- Upload gambar untuk semboyan & kereta.
- Pencarian/filter publik pada katalog semboyan.
- Widget checklist keselamatan interaktif di beranda.

**Non-Fungsional**
- **Responsif:** mobile + desktop 16:9 (grid flex, hamburger `<768px`).
- **Resiliensi:** retry otomatis GET saat backend belum menyala (cold start).
- **UX:** IntroLoader animasi, transisi glass-card, spinner loading.
- **Keamanan (dasar):** bcrypt + JWT + middleware verifyToken.
- **DX:** `concurrently` menjalankan FE+BE sekaligus.

---

## 14. Temuan, Risiko, & Rekomendasi (Code Review)

> Bagian ini adalah analisis kritis, bukan sekadar deskripsi.

### 🔴 Tinggi (keamanan)
1. **Secret ter-expose di repo.** `backend/.env` berisi `SUPABASE_SERVICE_ROLE_KEY` dan `JWT_SECRET` (`edurail123` — sangat lemah) dalam plaintext. **Service role key melewati RLS** — jika bocor, penuh akses ke DB.
   - *Rekomendasi:* rotasi kunci segera, pindahkan secret ke secret manager / `.env` yang **tidak** ikut commit (`.gitignore`), ganti `JWT_SECRET` jadi string acak panjang. *(Nilai kunci sengaja tidak ditampilkan di dokumen ini.)*
2. **Token di `localStorage`.** Rentan XSS. Middleware Next (`middleware.ts`) pada `/admin` hanya passthrough — **tidak ada verifikasi token server-side**, sehingga guard sepenuhnya sisi klien (bisa di-bypass).
   - *Rekomendasi:* simpan token di **httpOnly cookie**; verifikasi di `middleware.ts` server-side.
3. **Tidak ada rate limiting / input validation** pada endpoint auth (potensi brute-force, injection via body).
   - *Rekomendasi:* tambahkan `express-rate-limit` + validator (mis. `zod`/`express-validator`).

### 🟡 Sedang (robustness)
4. **Bahkan jika tidak ada `req.file`**, controller create tetap mengisi `gambar: null` (semboyan/kereta) — OK, namun update mengirim field teks `undefined` yang bisa menimpa data dengan `null` di Supabase bila policy tidak hati-hati. Sebaiknya bangun `updateData` hanya dari field yang terdefinisi.
5. **Inkonsistensi bentuk respons:** GET list → array; create/update → `{message,data}`. Frontend sudah workaround dengan `Array.isArray(...)`, tapi ini friksi. *Rekomendasi:* standardisasi envelope respons.
6. **Orphaned storage objects:** gambar lama tidak dihapus saat update/delete record → menumpuk di Storage. *Rekomendasi:* hapus object lama di Storage saat diganti/dihapus.
7. **`axios` tidak terdaftar di `dependencies`** frontend (meski terpakai). Bisa pecah pada install bersih. *Rekomendasi:* tambahkan eksplisit.
8. **`pg` terpasang tapi tidak terpakai** di backend — dependency mati. *Rekomendasi:* hapus.

### 🟢 Rendah (kebersihan/maintainability)
9. **File mati/konflik:** `src/lib/auth.ts` kosong (0 byte); `components/admin/{Sidebar,Navbar}.tsx` tampak tidak terpakai karena `admin/layout.tsx` membangun nav sendiri. *Rekomendasi:* hapus untuk mengurangi kebingungan.
10. **Tidak ada tes** (unit/integrasi/e2e). *Rekomendasi:* tambahkan minimal smoke test API + tes alur login.
11. **`desain.md` menyebut Next.js "16"** dan struktur sudah sesuai; tidak ada API spec resmi untuk upload (swagger belum mendokumentasikan `multipart`). *Rekomendasi:* perbarui `swagger.yaml` agar mencakup endpoint upload + security bearer.

---

## 15. Cara Menjalankan (Runbook)

### Prasyarat
- Node.js (kompatibel dengan Next 16 / Express 5), npm.
- Akun & project Supabase aktif dengan tabel `users`, `semboyan`, `kereta`, `artikel` + bucket `edurail`.

### Backend
```bash
cd backend
cp .env.example .env     # isi SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET
npm install
npm run dev              # nodemon server.js → http://localhost:5000
```

### Frontend
```bash
cd frontend/my-app
npm install
npm run dev              # menjalankan next dev + backend secara concurrent
                          # http://localhost:3000
```
Atau terpisah: `npm run dev` untuk frontend saja, pastikan backend berjalan di `:5000`.

### Env yang dibutuhkan
- **Backend `.env`**: `PORT`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`.
- **Frontend `.env.local`**: `NEXT_PUBLIC_API_URL=http://localhost:5000/api`.

---

## 16. Glosarium

- **RUMAJA** — Ruang Manfaat Jalan: area di kiri-kanan rel yang harus bebas hambatan.
- **BTKD** — Berhenti, Tengok kanan-kiri, Dengar: protokol menyebrang perlintasan sebidang.
- **Semboyan 35** — isyarat bunyi (klakson) lokomotif.
- **Railfans** — komunitas pencinta/dokumentator kereta api.
- **Glassmorphism** — gaya UI dengan efek transparansi/blur.
- **JWT** — JSON Web Token, mekanisme stateless auth.
- **Service Role Key (Supabase)** — kunci server yang melewati RLS; sangat sensitif.

---

*Dokumen ini bersifat analitis dan dirancang sebagai referensi tunggal untuk memahami keseluruhan proyek Edurail.*
