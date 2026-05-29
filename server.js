require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sql } = require('@vercel/postgres');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── INIT DATABASE ───────────────────────────────────────────────────────────
async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS spd_data (
        id SERIAL PRIMARY KEY,
        nama_pegawai VARCHAR(255) NOT NULL,
        nip VARCHAR(50),
        jabatan VARCHAR(255),
        tujuan VARCHAR(255),
        keperluan TEXT,
        tanggal_berangkat DATE,
        tanggal_kembali DATE,
        lama_perjalanan INT,
        biaya_transport NUMERIC(15, 2) DEFAULT 0,
        biaya_penginapan NUMERIC(15, 2) DEFAULT 0,
        biaya_harian NUMERIC(15, 2) DEFAULT 0,
        total_biaya NUMERIC(15, 2) DEFAULT 0,
        status VARCHAR(50) DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Database initialized');
  } catch (err) {
    console.error('❌ DB init error:', err.message);
  }
}

// ─── API ROUTES ───────────────────────────────────────────────────────────────

// GET semua data SPD
app.get('/api/spd', async (req, res) => {
  try {
    const { rows } = await sql`SELECT * FROM spd_data ORDER BY created_at DESC`;
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET satu data SPD by ID
app.get('/api/spd/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await sql`SELECT * FROM spd_data WHERE id = ${id}`;
    if (rows.length === 0) return res.status(404).json({ success: false, error: 'Data tidak ditemukan' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST tambah data SPD baru
app.post('/api/spd', async (req, res) => {
  try {
    const {
      nama_pegawai, nip, jabatan, tujuan, keperluan,
      tanggal_berangkat, tanggal_kembali, lama_perjalanan,
      biaya_transport, biaya_penginapan, biaya_harian,
      total_biaya, status
    } = req.body;

    const { rows } = await sql`
      INSERT INTO spd_data (
        nama_pegawai, nip, jabatan, tujuan, keperluan,
        tanggal_berangkat, tanggal_kembali, lama_perjalanan,
        biaya_transport, biaya_penginapan, biaya_harian,
        total_biaya, status
      ) VALUES (
        ${nama_pegawai}, ${nip}, ${jabatan}, ${tujuan}, ${keperluan},
        ${tanggal_berangkat}, ${tanggal_kembali}, ${lama_perjalanan},
        ${biaya_transport}, ${biaya_penginapan}, ${biaya_harian},
        ${total_biaya}, ${status || 'draft'}
      )
      RETURNING *
    `;
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update data SPD
app.put('/api/spd/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nama_pegawai, nip, jabatan, tujuan, keperluan,
      tanggal_berangkat, tanggal_kembali, lama_perjalanan,
      biaya_transport, biaya_penginapan, biaya_harian,
      total_biaya, status
    } = req.body;

    const { rows } = await sql`
      UPDATE spd_data SET
        nama_pegawai = ${nama_pegawai},
        nip = ${nip},
        jabatan = ${jabatan},
        tujuan = ${tujuan},
        keperluan = ${keperluan},
        tanggal_berangkat = ${tanggal_berangkat},
        tanggal_kembali = ${tanggal_kembali},
        lama_perjalanan = ${lama_perjalanan},
        biaya_transport = ${biaya_transport},
        biaya_penginapan = ${biaya_penginapan},
        biaya_harian = ${biaya_harian},
        total_biaya = ${total_biaya},
        status = ${status},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    if (rows.length === 0) return res.status(404).json({ success: false, error: 'Data tidak ditemukan' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE data SPD
app.delete('/api/spd/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await sql`DELETE FROM spd_data WHERE id = ${id}`;
    res.json({ success: true, message: 'Data berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET statistik ringkasan
app.get('/api/spd/stats/summary', async (req, res) => {
  try {
    const { rows } = await sql`
      SELECT
        COUNT(*) AS total_spd,
        SUM(total_biaya) AS total_anggaran,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) AS total_approved,
        COUNT(CASE WHEN status = 'draft' THEN 1 END) AS total_draft
      FROM spd_data
    `;
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── CATCH-ALL: serve index.html ──────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await initDB();
});
