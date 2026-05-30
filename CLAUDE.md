# CLAUDE.md — Sistem Rincian SPD Imigrasi

Panduan teknis untuk Claude Code saat bekerja di project ini.

## Tentang Project

Aplikasi web untuk membuat dan mengelola **Surat Perjalanan Dinas (SPD)** Kantor Imigrasi Pontianak. Fitur utama:
- Input data perjalanan dinas per pegawai (transport, penginapan, uang harian)
- Kalkulasi otomatis total biaya
- Simpan/muat/edit sesi per kegiatan ke database
- Cetak rekap biaya per pegawai maupun keseluruhan
- Kelola data tersimpan (tab Kelola Rekap)

## Struktur File

```
├── server.js              # Backend Express — semua API routes & DB init
├── package.json           # Dependencies & npm scripts
├── vercel.json            # Konfigurasi deploy serverless Vercel
├── .env                   # Kredensial database (tidak di-commit)
├── .env.example           # Template .env
│
├── public/
│   ├── unpacked.html      # Frontend utama — EDIT FILE INI untuk development
│   ├── index.html         # Frontend ter-pack/compressed (production build)
│   └── logo-imigrasi.png  # Logo resmi imigrasi
│
├── pack.ps1               # Bundler: compress unpacked.html → index.html
├── unpack.js              # Decompressor: buka isi index.html untuk inspeksi
└── unpack.ps1             # PowerShell wrapper untuk unpack.js
```

## Workflow Development

### Menjalankan lokal
```bash
npm install
cp .env.example .env   # lalu isi kredensial Vercel Postgres
npm run dev            # nodemon + auto-reload
```
Server berjalan di `http://localhost:3000`. Frontend di-serve dari `public/unpacked.html`.

### Edit frontend
Selalu edit [public/unpacked.html](public/unpacked.html) — bukan `index.html`.  
`index.html` adalah hasil build ter-compress dan akan tertimpa saat pack.

### Build untuk production
```powershell
.\pack.ps1
```
Menghasilkan `public/index.html` yang ter-compressed dari `unpacked.html`.

### Deploy
Push ke GitHub → Vercel auto-deploy. Route dan build dikonfigurasi di `vercel.json`.

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Runtime | Node.js >= 18 |
| Backend | Express.js 4.18.2 |
| Database | PostgreSQL via `pg` 8.11.3 (Neon/Vercel Postgres) |
| Frontend | Vanilla JS + CSS inline (tidak ada framework) |
| Dev tools | Nodemon, cross-env |
| Deploy | Vercel (serverless) |

## Database

Dua tabel diinisialisasi otomatis saat `initDB()` dipanggil di startup:

### `spd_sessions`
Menyimpan satu sesi penuh (satu kegiatan, bisa banyak pegawai) sebagai JSONB.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | SERIAL PK | |
| `judul_kegiatan` | VARCHAR(500) | Nama kegiatan |
| `nomor_spt` | VARCHAR(100) | Nomor SPT |
| `data` | JSONB | Objek `{ header, pegawai[] }` lengkap |
| `created_at` | TIMESTAMP | |

### `spd_data`
Menyimpan record SPD individual per pegawai.

| Kolom | Tipe |
|-------|------|
| `id` | SERIAL PK |
| `nama_pegawai`, `nip`, `jabatan` | VARCHAR |
| `tujuan`, `keperluan` | VARCHAR/TEXT |
| `tanggal_berangkat`, `tanggal_kembali` | DATE |
| `lama_perjalanan` | INT |
| `biaya_transport`, `biaya_penginapan`, `biaya_harian`, `total_biaya` | NUMERIC(15,2) |
| `status` | VARCHAR — default `'draft'` |
| `created_at`, `updated_at` | TIMESTAMP |

## API Endpoints

### Sessions (satu kegiatan = satu sesi)

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | `/api/sessions` | Simpan sesi baru |
| GET | `/api/sessions` | List semua sesi |
| PUT | `/api/sessions/:id` | Update sesi yang ada |
| DELETE | `/api/sessions/:id` | Hapus sesi |

Body POST/PUT: `{ header: { judulKegiatan, nomorSPT, ... }, pegawai: [...] }`

### SPD Data (record individual)

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/spd` | List semua record |
| GET | `/api/spd/:id` | Ambil satu record |
| POST | `/api/spd` | Tambah record baru |
| PUT | `/api/spd/:id` | Update record |
| DELETE | `/api/spd/:id` | Hapus record |
| GET | `/api/spd/stats/summary` | Statistik ringkasan |

## Environment Variables

```env
POSTGRES_URL=              # Connection string utama (dengan sslmode)
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=
```

SSL ditangani otomatis di `server.js`: jika `DATABASE_URL` sudah mengandung `sslmode`, tidak perlu set ulang.

## Hal Penting

- **Jangan edit `public/index.html` secara langsung** — file ini di-generate oleh `pack.ps1` dan akan tertimpa.
- Frontend adalah **satu file HTML besar** tanpa framework — semua logic JS ada di dalam `unpacked.html`.
- Koneksi DB menggunakan `DATABASE_URL` dari env (Neon connection string sudah include SSL).
- `server.js` di-export sebagai `module.exports = app` untuk Vercel serverless.
- Route catch-all `GET *` di `server.js` serve `unpacked.html` (development) atau `index.html` (production ditangani Vercel static).
