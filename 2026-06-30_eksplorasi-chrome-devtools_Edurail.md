# Eksplorasi Aplikasi Edurail via Chrome DevTools MCP

> **Tanggal:** 2026-06-30
> **Metode:** Pengujian eksploratori end-to-end menggunakan MCP Chrome DevTools terhadap frontend (`http://localhost:3000`) + backend (`http://localhost:5000`).
> **Sumber pemahaman baseline:** `RISET.md`.

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Hasil Eksplorasi per Halaman](#2-hasil-eksplorasi-per-halaman)
3. [Verifikasi Alur End-to-End](#3-verifikasi-alur-end-to-end)
4. [Temuan Baru (di luar RISET)](#4-temuan-baru-di-luar-riset)
5. [Catatan Keamanan Terkonfirmasi](#5-catatan-keamanan-terkonfirmasi)
6. [Daftar yang Perlu Diperbaiki & Solusi](#6-daftar-yang-perlu-diperbaiki--solusi)
7. [Prioritas Rekomendasi](#7-prioritas-rekomendasi)
8. [Lampiran: Bukti Jaringan (Network)](#8-lampiran-bukti-jaringan-network)

---

## 1. Ringkasan Eksekutif

**Status keseluruhan: APLIKASI BERFUNGSI dengan baik.** Semua fitur inti (baca publik, autentikasi, CRUD admin) terverifikasi bekerja end-to-end. Tidak ditemukan bug yang menghalangi penggunaan. Beberapa temuan baru muncul di luar apa yang sudah didokumentasikan di `RISET.md`, dan sejumlah isu keamanan/robustness yang sudah disebut RISET **terkonfirmasi nyata** saat pengujian.

**Temuan paling signifikan:**
- Respons `POST` pada resource mengembalikan `data` sebagai **array** `[{...}]`, bukan objek tunggal seperti yang didokumentasikan RISET — inkonsistensi bentuk respons yang nyata.
- Ada **data sampah** di tabel semboyan (record `qw/qw/wq` dan gambar broken `https://example.com/35.jpg`).
- JWT secret sangat lemah (`edurail123`) → token dapat di-forged (terkonfirmasi dari payload base64 yang terlihat jelas).

---

## 2. Hasil Eksplorasi per Halaman

### 2.1 Beranda `/` ✅
- Termuat penuh, tanpa console error.
- Hero + 3 pilar edukasi (Semboyan, Jenis Kereta, Artikel/Safety).
- **Widget checklist keselamatan interaktif** (4 poin: jarak 4,5 m, BTKD, larangan railfans, patuh isyarat).
- Panduan darurat kendaraan mogok di perlintasan.
- Navbar sticky glassmorphism, Footer aktif.

### 2.2 Semboyan `/semboyan` ✅
- `GET /api/semboyan` → **200**, response berupa **array langsung** (3 item).
- **Search/filter bekerja**: input "35" → terfilter hanya "Semboyan 35".
- **Modal detail bekerja**: klik "Lihat Detail Aturan" → modal muncul dengan arti + deskripsi; tombol "Tutup Panduan" berfungsi.
- Catatan data: ada record "qw/qw/wq" tanpa gambar ("Gambar Tidak Tersedia") dan gambar `https://example.com/35.jpg` yang broken.

### 2.3 Kereta `/kereta` ✅
- Galeri **6 item nyata**: Luxury New Gen, Ekonomi Subsidi (PSO), CC 203, Eksekutif Stainless Steel New Gen, CC 201, CC 206.
- Gambar dimuat dari Supabase Storage (`...supabase.co/storage/v1/object/public/edurail/...`) — semua sukses.
- **Filter kategori bekerja**: tombol "Lokomotif" → menampilkan hanya CC 203, CC 201, CC 206.
- Deskripsi lengkap (kapasitas, fasilitas, spesifikasi teknis).

### 2.4 Artikel `/artikel` ✅
- List artikel (1 item: "Mengenal Semboyan 35", kategori Edukasi, 10 Juni 2026).
- **Modal detail bekerja**: "Baca Artikel Lengkap" → modal; "Tutup Bacaan" berfungsi.

### 2.5 Halaman Auth `/register` & `/login` ✅
- **Register** → `POST /api/auth/register` **201 Created**, alert "Registrasi Admin berhasil! Silakan login.".
- **Login** → `POST /api/auth/login` sukses, token disimpan ke `localStorage`, redirect ke `/admin/dashboard`.

### 2.6 Admin `/admin/*` ✅
- **Guard bekerja**: `GET /admin/dashboard` tanpa token → **redirect ke `/login`**.
- **Dashboard**: statistik real-time (TOTAL SEMBOYAN: 3, TOTAL KERETA: 6, TOTAL ARTIKEL: 1) via `Promise.all` GET ke 3 endpoint.
- **CRUD semboyan** (representatif):
  - Create → `POST /api/semboyan` **201**, multipart/form-data + `Authorization: Bearer <JWT>`.
  - Delete → `DELETE /api/semboyan/4` **200**, lalu list auto-refresh.
  - Form punya field: nama, arti, warna, deskripsi, upload gambar.

---

## 3. Verifikasi Alur End-to-End

| # | Alur | Metode | Hasil |
|---|---|---|---|
| 1 | Baca semboyan publik | Network GET 200 + render | ✅ |
| 2 | Search semboyan | Fill input "35" | ✅ filter bekerja |
| 3 | Modal detail semboyan/artikel | Klik + tutup | ✅ |
| 4 | Filter kereta by kategori | Klik "Lokomotif" | ✅ |
| 5 | Register admin | Form UI | ✅ POST 201 |
| 6 | Login admin | Form UI | ✅ JWT, redirect dashboard |
| 7 | Guard admin (no token) | Navigate ke /admin/dashboard | ✅ redirect /login |
| 8 | Dashboard statistik | Render angka | ✅ (3/6/1) |
| 9 | CRUD — Create semboyan | Form UI | ✅ POST 201 |
| 10 | CRUD — Delete semboyan | Klik Hapus + confirm | ✅ DELETE 200 |

---

## 4. Temuan Baru (di luar RISET)

### 🔶 N1 — Respons POST mengembalikan `data` sebagai array
- **Fakta:** `POST /api/semboyan` → response body:
  ```json
  {"message":"Semboyan berhasil ditambahkan","data":[{"id":4,"nama":"Semboyan Test MCP","arti":"Hanya untuk pengujian","gambar":null,"deskripsi":"","warna":"Ungu"}]}
  ```
  `data` adalah **array** `[{...}]`, padahal operasi create hanya menghasilkan 1 record.
- **Dampak:** RISET §14 #5 mencatat inkonsistensi bentuk respons (list array vs create objek). Faktanya `create` pun **juga array**, bukan objek tunggal — bentuk respons belum distandarisasi dan bisa membingungkan konsumen API. Frontend saat ini tidak bergantung pada bentuk ini, tapi ini friksi kontrak API.

### 🔶 N2 — Data sampah di tabel semboyan
- Record `id=3` (`nama="qw"`, `arti="qw"`, `warna="wq"`) — jelas data test iseng.
- Record `id=1` (`Semboyan 35`) memakai gambar placeholder `https://example.com/35.jpg` yang **broken** (bukan URL Supabase Storage).
- **Dampak:** tampilan publik tidak profesional; gambar broken muncul sebagai ikon rusak.

### 🔶 N3 — Field `deskripsi` kosong saat create tanpa input deskripsi
- Saat create semboyan hanya mengisi nama/arti/warna (deskripsi dikosongkan), request body mengirim `deskripsi` sebagai string kosong `""`. Backend menerimanya tanpa validasi.
- **Dampak:** minor — data null/empty masuk DB tanpa penolakan. Bisa diperketat dengan validasi.

### 🔶 N4 — Form fill via automation (UX/tooling)
- Mengisi React controlled component (input `<input>`) melalui manipulasi DOM langsung sering **tidak terdaftar** sebagai state React — field `required` tetap dianggap kosong oleh validasi native browser ("Please fill out this field"). Hanya field yang kebetulan terisi yang lolos.
- **Dampak:** bukan bug kode aplikasi, tapi **relevan untuk tooling test otomatis** (Playwright/Selenium/cypress) — harus memakai event simulasi pengetikan nyata, bukan `element.value = ...`. Worth documenting agar tidak menggigit tim QA nanti.

---

## 5. Catatan Keamanan Terkonfirmasi

Isu yang sudah disebut `RISET.md §14` dan **terverifikasi nyata** saat eksplorasi:

| Isu | Bukti dari eksplorasi |
|---|---|
| **Token di localStorage** (rentan XSS) | Request header: `authorization: Bearer eyJ...` — token diambil dari localStorage via interceptor axios. |
| **JWT secret sangat lemah** (`edurail123`) | JWT payload (base64) terbaca jelas: `{id,email,role,iat,exp}`. Karena secret lemah & publik di `.env`, token dapat di-forged → akses admin palsu. |
| **Middleware Next hanya passthrough** | Guard admin sepenuhnya sisi-klien (cek `localStorage.getItem("token")`). Verifikasi server-side tidak ada. |
| **Tidak ada rate limiting** | Tidak ada tanda throttle pada percobaan register/login berulang. |

> Catatan: secret service-role Supabase & `JWT_SECRET` berada plaintext di `backend/.env`. **Nilai kunci sengaja tidak direplikasi di dokumen ini.**

---

## 6. Daftar yang Perlu Diperbaiki & Solusi

Dikelompokkan menurut severitas. Setiap item punya **masalah** + **solusi konkret**.

### 🔴 TINGGI — Keamanan

#### P1. Rotasi & amankan secret
- **Masalah:** `SUPABASE_SERVICE_ROLE_KEY` (lewati RLS) + `JWT_SECRET="edurail123"` (sangat lemah) ter-expose plaintext di `backend/.env`.
- **Solusi:**
  1. Rotasi `JWT_SECRET` ke string acak panjang (≥ 64 char, `openssl rand -hex 32`).
  2. Rotasi service-role key di dashboard Supabase.
  3. Pastikan `backend/.env` ada di `.gitignore` (dan sudah di-purge dari history git bila terlanjur commit: `git filter-repo` / BFG).
  4. Untuk produksi, pakai secret manager / env var platform (bukan file yang ikut deploy).

#### P2. Pindahkan token JWT ke httpOnly cookie + verifikasi server-side
- **Masalah:** Token di `localStorage` (rentan XSS); guard admin murni sisi-klien, bisa di-bypass.
- **Solusi:**
  1. Backend: setel JWT di **httpOnly + Secure + SameSite** cookie saat login (`res.cookie('token', jwt, {httpOnly:true, secure:true, sameSite:'lax', maxAge:...})`).
  2. `verifyToken` sudah membaca cookie `req.cookies.token` — cukup hapus path header Bearer dari FE agar tidak bocor ke JS.
  3. Frontend: hapus simpan localStorage; axios tetap `withCredentials:true`.
  4. `frontend/.../middleware.ts`: verifikasi token server-side (cek keberadaan/expiry) — blokir akses `/admin/*` lebih awal, bukan passthrough.

#### P3. Tambah rate limiting + input validation
- **Masalah:** endpoint auth rawan brute-force; body tidak divalidasi.
- **Solusi:**
  1. `npm i express-rate-limit` → pasang limiter ketat pada `/api/auth/login` & `/api/auth/register` (mis. 5 percobaan / 15 menit per IP).
  2. `npm i zod` (atau `express-validator`) → validasi email format, panjang password minimal, field wajib, sebelum diproses controller.

### 🟡 SEDANG — Robustness / Konsistensi

#### P4. Standardisasi bentuk respons API
- **Masalah:** GET list → array; GET by id → objek; POST/PUT → `{message, data}` dengan `data` **array** (N1). Frontend harus workaround `Array.isArray(...)`.
- **Solusi:** buat helper envelope respons konsisten, mis. semua respons non-error: `{ success: true, data: <objek|array> }`. Sesuaikan controller & frontend. Update `swagger.yaml`.

#### P5. Hapus data sampah & perbaiki gambar broken (N2)
- **Masalah:** record `qw/qw/wq` dan gambar `example.com` membuat tampilan publik kotor.
- **Solusi:**
  1. Hapus record `id=3` semboyan (`qw`) via UI admin atau SQL.
  2. Ganti gambar `Semboyan 35` dengan asset valid di Supabase Storage (atau hapus URL sampah).
  3. Tambah fallback UI: bila `gambar` null/broken → tampilkan placeholder desain, bukan `<img>` rusak.

#### P6. Cleanup orphaned storage objects
- **Masalah:** gambar lama tidak dihapus dari Supabase Storage saat update/delete record (RISET §14 #6).
- **Solusi:** di controller update/delete, panggil `supabase.storage.from('edurail').remove([path])` untuk file lama (extract path dari URL sebelumnya) sebelum/sepuluh operasi.

#### P7. Bangun `updateData` hanya dari field terdefinisi
- **Masalah:** update bisa menimpa field dengan `null`/`undefined` bila policy tidak hati-hati (RISET §14 #4).
- **Solusi:** di controller update, konstruksi objek update hanya berisi key yang `!== undefined`:
  ```js
  const updateData = {};
  if (nama !== undefined) updateData.nama = nama;
  // ... dst
  ```

#### P8. Eksplisitkan dependency frontend
- **Masalah:** `axios` dipakai di `services/api.ts` tapi tidak terdaftar di `dependencies` (RISET §14 #7).
- **Solusi:** `npm i axios` di `frontend/my-app` agar `package.json` mencantumkannya eksplisit (mencegah pecah pada install bersih).

#### P9. Hapus dependency mati backend
- **Masalah:** `pg` terpasang tapi tak terpakai (RISET §14 #8).
- **Solusi:** `npm uninstall pg` di `backend`.

### 🟢 RENDAH — Kebersihan / Maintainability

#### P10. Hapus file mati
- **Masalah:** `src/lib/auth.ts` kosong (0 byte); `components/admin/{Sidebar,Navbar}.tsx` tampak tak terpakai (RISET §14 #9).
- **Solusi:** hapus ketiganya setelah konfirmasi tidak direferensikan (grep import).

#### P11. Tambah tes otomatis
- **Masalah:** tidak ada unit/integrasi/e2e (RISET §14 #10).
- **Solusi:** minimal smoke test:
  - API (Supertest): health check `GET /`, login gagal/sukses, GET publik semboyan/kereta/artikel.
  - E2E (Playwright): alur register → login → dashboard.
  - Catatan tooling: gunakan event pengetikan nyata untuk React controlled input (lihat N4).

#### P12. Update dokumentasi swagger
- **Masalah:** `swagger.yaml` belum mendokumentasikan endpoint upload `multipart` dan security bearer (RISET §14 #11).
- **Solusi:** tambahkan definisi `requestBody` multipart untuk POST/PUT semboyan & kereta, serta `securitySchemes: bearerAuth` global.

#### P13. Validasi field deskripsi opsional (N3)
- **Masalah:** `deskripsi` kosong diterima apa adanya.
- **Solusi:** gabung dengan P3 — bila ingin wajib, tambahkan di validator; bila opsional, pertahankan tapi normalisasi (null vs "").

---

## 7. Prioritas Rekomendasi

Urutan kerja yang disarankan (dampak / usaha):

1. **P5** — Bersihkan data sampah + gambar broken (cepat, dampak visual langsung).
2. **P1** — Rotasi JWT secret & amankan `.env` (krusial sebelum produksi).
3. **P2** — httpOnly cookie + middleware server-side (keamanan auth).
4. **P3** — Rate limiting + validasi (brute-force).
5. **P4** — Standardisasi envelope respons (sekali jalan, kurangi friksi).
6. **P8, P9, P10** — Bersih-bersih dependency & file mati (mechanical, cepat).
7. **P6, P7** — Orphan cleanup + updateData aman (robustness).
8. **P12, P11, P13** — Dokumentasi swagger + tes + validasi minor (jangka panjang).

---

## 8. Lampiran: Bukti Jaringan (Network)

Request-request kunci yang diamati selama eksplorasi:

| reqid | Method | URL | Status | Catatan |
|---|---|---|---|---|
| 46 | GET | `/api/semboyan` | 200 | array 3 item (data publik) |
| 158 | POST | `/api/auth/register` | 201 | register admin baru |
| 257/258 | GET | `/api/semboyan` | 304 | dashboard stats (cached) |
| 261 | POST | `/api/semboyan` | 201 | create — `data` array (N1) |
| 263 | GET | `/api/semboyan` | 200 | refresh setelah create |
| 265 | DELETE | `/api/semboyan/4` | 200 | delete test record |
| 267 | GET | `/api/semboyan` | 200 | refresh setelah delete |

**Sample response POST (N1):**
```json
{"message":"Semboyan berhasil ditambahkan","data":[{"id":4,"nama":"Semboyan Test MCP","arti":"Hanya untuk pengujian","gambar":null,"deskripsi":"","warna":"Ungu"}]}
```

**Sample JWT payload (terlihat plaintext base64):**
```json
{"id":8,"email":"tester@edurail.local","role":"admin","iat":1782804658,"exp":1782891058}
```

---

*Dokumen ini melengkapi `RISET.md` dengan bukti empiris dari pengujian langsung aplikasi.*
