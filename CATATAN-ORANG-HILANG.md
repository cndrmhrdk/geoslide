# Update: Informasi Orang Hilang

Ekstrak zip ini ke folder `geoslide/` (gabung/timpa). File yang ditimpa: `backend/src/server.js`,
`backend/package.json`, `frontend/vite.config.js`, `frontend/src/App.jsx`, `frontend/src/pages/InformasiOrangHilang.jsx`.

## Langkah
1. Impor `geoslide_schema_baru.sql` ke database (nama sama dengan `DB_NAME` di `backend/.env`).
2. (Opsional) Impor `geoslide_data_contoh_orang_hilang.sql` untuk data uji.
3. Backend: `cd backend`, `npm install`, tambahkan `JWT_SECRET` dan `UPLOAD_DIR` ke `.env` (lihat `.env.example`), lalu `npm run dev`.
4. Frontend: `cd frontend`, `npm run dev`, buka http://localhost:5173/informasi-orang-hilang
5. Akun admin untuk uji API: `npm run create-admin -- "Nama" email@contoh.com PasswordKuat123` (di folder backend).

## API
Publik: GET /api/orang-hilang, /api/orang-hilang/filters, /api/orang-hilang/:id
Admin (Bearer token dari POST /api/auth/login):
- GET   /api/orang-hilang/admin?verification_status=pending
- PATCH /api/orang-hilang/admin/:id/verification   { verification_status, rejection_reason?, admin_note? }
- PATCH /api/orang-hilang/admin/:id/search-status  { search_status: searching|found|closed, admin_note? }
