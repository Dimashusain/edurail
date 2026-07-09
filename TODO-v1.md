# TODO-v1 — Perbaikan Edurail

> **Sumber:** `2026-06-30_eksplorasi-chrome-devtools_Edurail.md` §6 *Daftar yang Perlu Diperbaiki & Solusi*
> **Baseline:** `RISET.md`
> **Konvensi:** centang `[x]` saat selesai. Setiap item merujuk ke id asal (P1–P13) + temuan (N1–N4) jika ada.

---

## 🔴 TINGGI — Keamanan

- [ ] **P1 — Rotasi & amankan secret** _(sebagian; lihat catatan)_
  - [x] Rotasi `JWT_SECRET` ke string acak ≥ 64 char (`openssl rand -hex 32`) di `backend/.env`
  - [ ] Rotasi `SUPABASE_SERVICE_ROLE_KEY` di dashboard Supabase _(butuh akses dashboard — tugas manual)_
  - [x] Pastikan `backend/.env` ada di `.gitignore` _(dibuat `.gitignore` root; proyek belum ada repo git, jadi purge history N/A)_
  - [ ] Untuk produksi: pindahkan secret ke env var platform / secret manager (bukan file deploy)

- [x] **P2 — JWT ke httpOnly cookie + verifikasi server-side**
  - [x] Backend: set cookie `httpOnly + Secure + SameSite=lax` saat login (`res.cookie('token', jwt, {...})`)
  - [x] Backend: pastikan `verifyToken` membaca `req.cookies.token` (hapus ketergantungan path header Bearer dari FE)
  - [x] Frontend: hapus simpanan `localStorage` token; set axios `withCredentials: true`
  - [x] Frontend: `middleware.ts` — verifikasi token server-side (cek keberadaan/expiry), blokir `/admin/*` lebih awal (bukan passthrough)

- [ ] **P3 — Rate limiting + input validation**
  - [ ] `npm i express-rate-limit` → limiter ketat di `/api/auth/login` & `/api/auth/register` (~5 percobaan / 15 menit per IP)
  - [ ] `npm i zod` (atau `express-validator`) → validasi format email, panjang password minimal, field wajib
  - [ ] (lihat juga P13) — normalisasi/validasi field `deskripsi`

---

## 🟡 SEDANG — Robustness / Konsistensi

- [ ] **P4 — Standardisasi bentuk respons API** *(temuan N1)*
  - [ ] Buat helper envelope respons konsisten, mis. `{ success: true, data: <objek|array> }` untuk semua respons non-error
  - [ ] Sesuaikan semua controller (semboyan, kereta, artikel) agar `data` POST/PUT berupa objek tunggal (bukan array)
  - [ ] Sesuaikan konsumsi frontend (hapus workaround `Array.isArray(...)`)
  - [ ] Update `swagger.yaml`

- [ ] **P5 — Hapus data sampah & perbaiki gambar broken** *(temuan N2)*
  - [ ] Hapus record semboyan `id=3` (`qw/qw/wq`) via UI admin / SQL
  - [ ] Ganti gambar `Semboyan 35` (record `id=1`) — hapus URL `https://example.com/35.jpg`, pakai asset valid di Supabase Storage
  - [ ] Tambah fallback UI: bila `gambar` null/broken → tampilkan placeholder desain, bukan `<img>` rusak

- [ ] **P6 — Cleanup orphaned storage objects**
  - [ ] Di controller update/delete (semboyan & kereta): panggil `supabase.storage.from('edurail').remove([path])` untuk file lama sebelum/sesudah operasi
  - [ ] Ekstrak path lama dari URL sebelumnya sebelum remove

- [ ] **P7 — Bangun `updateData` hanya dari field terdefinisi**
  - [ ] Di controller update: konstruksi objek hanya berisi key yang `!== undefined`
  ```js
  const updateData = {};
  if (nama !== undefined) updateData.nama = nama;
  if (arti !== undefined) updateData.arti = arti;
  // ... dst untuk semua field
  ```

- [ ] **P8 — Eksplisitkan dependency frontend**
  - [ ] `npm i axios` di `frontend/my-app` agar tercatat eksplisit di `package.json`

- [ ] **P9 — Hapus dependency mati backend**
  - [ ] `npm uninstall pg` di `backend` (verifikasi tak ada import `pg` lebih dulu)

---

## 🟢 RENDAH — Kebersihan / Maintainability

- [ ] **P10 — Hapus file mati**
  - [ ] Verifikasi tidak ada import: `grep -r` untuk `lib/auth`, `components/admin/Sidebar`, `components/admin/Navbar`
  - [ ] Hapus `src/lib/auth.ts` (0 byte)
  - [ ] Hapus `components/admin/Sidebar.tsx` & `components/admin/Navbar.tsx` bila benar-benar tak terpakai

- [ ] **P11 — Tambah tes otomatis**
  - [ ] API (Supertest): health check `GET /`, login gagal/sukses, GET publik semboyan/kereta/artikel
  - [ ] E2E (Playwright): alur register → login → dashboard
  - [ ] Catatan tooling: gunakan event pengetikan nyata untuk React controlled input (lihat temuan **N4**), bukan `element.value = ...`

- [ ] **P12 — Update dokumentasi swagger**
  - [ ] Tambah `requestBody` multipart untuk POST/PUT semboyan & kereta
  - [ ] Tambah `securitySchemes: bearerAuth` global + `security` di endpoint terproteksi

- [ ] **P13 — Validasi field `deskripsi` opsional** *(temuan N3)*
  - [ ] Gabung dengan P3: bila wajib → tambahkan di validator; bila opsional → normalisasi (`null` vs `""`)

---

## Urutan Kerja Disarankan (Prioritas Rekomendasi)

1. **P5** — Bersihkan data sampah + gambar broken (cepat, dampak visual langsung)
2. **P1** — Rotasi JWT secret & amankan `.env` (krusial sebelum produksi)
3. **P2** — httpOnly cookie + middleware server-side
4. **P3** — Rate limiting + validasi
5. **P4** — Standardisasi envelope respons
6. **P8, P9, P10** — Bersih-bersih dependency & file mati (mechanical, cepat)
7. **P6, P7** — Orphan cleanup + updateData aman
8. **P12, P11, P13** — Swagger + tes + validasi minor (jangka panjang)

---

*Progress 1/13 item utama. (P1 sebagian: JWT_SECRET ter-rotasi & .gitignore dibuat; rotasi Supabase key + secret manager produksi masih outstanding. P2 selesai: JWT dipindah ke httpOnly cookie, middleware server-side blokir `/admin/*`.)*
