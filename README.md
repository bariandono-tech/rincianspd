# Sistem Rincian SPD — Imigrasi 2026

Aplikasi web untuk mengelola Surat Perjalanan Dinas (SPD) dengan penyimpanan data kumulatif menggunakan Vercel Postgres.

## Struktur Project

```
├── public/
│   └── index.html      # Frontend (HTML standalone)
├── server.js           # Backend Express + API routes
├── package.json
├── vercel.json         # Konfigurasi deploy Vercel
├── .env.example        # Template environment variables
└── .gitignore
```

## API Endpoints

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | /api/spd | Ambil semua data SPD |
| GET | /api/spd/:id | Ambil satu data SPD |
| POST | /api/spd | Tambah data SPD baru |
| PUT | /api/spd/:id | Update data SPD |
| DELETE | /api/spd/:id | Hapus data SPD |
| GET | /api/spd/stats/summary | Statistik ringkasan |

## Setup Local

```bash
npm install
cp .env.example .env
# Isi .env dengan kredensial Vercel Postgres
npm run dev
```

## Deploy ke Vercel

1. Push ke GitHub
2. Import repo di vercel.com
3. Tambahkan Vercel Postgres di dashboard (Storage > Create Database)
4. Environment variables otomatis tersambung
5. Deploy!
