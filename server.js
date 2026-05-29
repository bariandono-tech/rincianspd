require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── INIT DATABASE ───────────────────────────────────────────────────────────
async function initDB() {
  try {
    await pool.query(`
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
    `);
    console.log('✅ Database initialized');
  } catch (err) {
    console.error('❌ DB init error:', err.message);
  }
}

// ─── API ROUTES ───────────────────────────────────────────────────────────────

app.get('/api/spd', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM spd_data ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/spd/stats/summary', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        COUNT(*) AS total_spd,
        SUM(total_biaya) AS total_anggaran,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) AS total_approved,
        COUNT(CASE WHEN status = 'draft' THEN 1 END) AS total_draft
      FROM spd_data
    `);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/spd/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM spd_data WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, error: 'Data tidak ditemukan' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/spd', async (req, res) => {
  try {
    const {
      nama_pegawai, nip, jabatan, tujuan, keperluan,
      tanggal_berangkat, tanggal_kembali, lama_perjalanan,
      biaya_transport, biaya_penginapan, biaya_harian,
      total_biaya, status
    } = req.body;

    const { rows } = await pool.query(`
      INSERT INTO spd_data (
        nama_pegawai, nip, jabatan, tujuan, keperluan,
        tanggal_berangkat, tanggal_kembali, lama_perjalanan,
        biaya_transport, biaya_penginapan, biaya_harian,
        total_biaya, status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING *
    `, [nama_pegawai, nip, jabatan, tujuan, keperluan,
        tanggal_berangkat, tanggal_kembali, lama_perjalanan,
        biaya_transport, biaya_penginapan, biaya_harian,
        total_biaya, status || 'draft']);

    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/spd/:id', async (req, res) => {
  try {
    const {
      nama_pegawai, nip, jabatan, tujuan, keperluan,
      tanggal_berangkat, tanggal_kembali, lama_perjalanan,
      biaya_transport, biaya_penginapan, biaya_harian,
      total_biaya, status
    } = req.body;

    const { rows } = await pool.query(`
      UPDATE spd_data SET
        nama_pegawai=$1, nip=$2, jabatan=$3, tujuan=$4, keperluan=$5,
        tanggal_berangkat=$6, tanggal_kembali=$7, lama_perjalanan=$8,
        biaya_transport=$9, biaya_penginapan=$10, biaya_harian=$11,
        total_biaya=$12, status=$13, updated_at=CURRENT_TIMESTAMP
      WHERE id=$14 RETURNING *
    `, [nama_pegawai, nip, jabatan, tujuan, keperluan,
        tanggal_berangkat, tanggal_kembali, lama_perjalanan,
        biaya_transport, biaya_penginapan, biaya_harian,
        total_biaya, status, req.params.id]);

    if (rows.length === 0) return res.status(404).json({ success: false, error: 'Data tidak ditemukan' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/spd/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM spd_data WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Data berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await initDB();
});
