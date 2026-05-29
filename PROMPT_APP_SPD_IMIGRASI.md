# PROMPT: Buat Aplikasi Web RINCIAN SPD — Imigrasi 2026

---

## INSTRUKSI UTAMA

Buatkan aplikasi web **single-file HTML** yang berfungsi sebagai sistem pengisian dan cetak dokumen **Rincian Surat Perjalanan Dinas (SPD)** untuk Kantor Imigrasi Kelas I TPI Pontianak. Seluruh logika (HTML + CSS + JavaScript) harus dalam **satu file `.html`** tanpa dependensi eksternal selain CDN yang diizinkan.

---

## IDENTITAS INSTANSI (Hardcode)

```
KEMENTERIAN IMIGRASI DAN PEMASYARAKATAN REPUBLIK INDONESIA
DIREKTORAT JENDERAL IMIGRASI
KANTOR WILAYAH KALIMANTAN BARAT
KANTOR IMIGRASI KELAS I TPI PONTIANAK
Jalan Letjen. Sutoyo No. 122 Pontianak 78121
Laman: www.pontianak.imigrasi.go.id | Surel: keuangan.kanimptk@gmail.com
```

---

## DESAIN & TEMA

### Warna & Branding
- **Background utama**: `#0A1628` (biru dongker/navy gelap imigrasi)
- **Sidebar/panel**: `#0D1F3C`
- **Card/container**: `#112240` dengan border `#1E3A5F`
- **Accent/highlight**: `#C8A951` (emas imigrasi) dan `#1A6EBD` (biru terang)
- **Teks utama**: `#E8F0FE`
- **Teks sekunder**: `#8BA7C7`
- **Tombol primer**: gradient `#C8A951` → `#A8892F`, teks gelap
- **Tombol cetak**: `#1A6EBD` dengan hover `#1558A0`
- **Input field**: background `#1A2E4A`, border `#2A4A6F`, teks `#E8F0FE`

### Header Aplikasi
Tampilkan header dengan:
- Logo/ikon imigrasi (gunakan emoji 🦅 atau SVG sederhana)
- Judul: **"SISTEM RINCIAN SPD"**
- Subtitle: **"IMIGRASI 2026 | KANTOR IMIGRASI KELAS I TPI PONTIANAK"**
- Tahun dan tagline kecil

### Font
Gunakan `font-family: 'Segoe UI', Arial, sans-serif`.

---

## STRUKTUR NAVIGASI (2 Menu Utama)

```
┌─────────────────────────────────────────┐
│  🦅  SISTEM RINCIAN SPD  IMIGRASI 2026  │
├──────────────────┬──────────────────────┤
│  [ PENGISIAN ]   │  [ DPR PIC ]         │
└──────────────────┴──────────────────────┘
```

Tab aktif ditandai dengan underline emas dan teks terang.

---

## MENU 1: PENGISIAN

### Bagian A — Data Kegiatan (Header SPD)

Form input dengan field berikut:

| Label | Nama Field | Tipe | Contoh |
|---|---|---|---|
| Judul Kegiatan | `judulKegiatan` | textarea | "MELAKUKAN KEGIATAN KOORDINASI TERKAIT CONTACT CENTRE..." |
| Nomor SPT | `nomorSPT` | text | "WIM.16.IMI.1-TI.04.01-2438" |
| Tanggal SPT | `tanggalSPT` | date | 2026-05-05 |
| Nama Program | `namaProgram` | text | "Pengelolaan Teknologi Informasi Keimigrasian" |
| Tanggal Kegiatan | `tanggalKegiatan` | text | "6 sd 8 Mei 2026" |
| Tujuan Kota | `tujuanKota` | text | "Jakarta" |
| PPK (Pejabat Pembuat Komitmen) | `namaPPK` | text | "SYECH MUKHAMAR REZA KHARAMI, S.H." |
| NIP PPK | `nipPPK` | text | "19840831 200312 1 001" |
| Jabatan PPK | `jabatanPPK` | text | "KASI REG, ADMINISTRASI & PELAPORAN" |
| Bendahara | `namaBendahara` | text | "MUHAMMAD REZA, S.H." |
| NIP Bendahara | `nipBendahara` | text | "19840124 200212 1 002" |

### Bagian B — Daftar Pegawai

Tombol **"+ Tambah Pegawai"** menambahkan baris form baru. Maksimal 10 pegawai.

Setiap pegawai memiliki field:

| Label | Nama Field | Tipe | Keterangan |
|---|---|---|---|
| Nama Lengkap | `nama` | text / dropdown | Bisa pilih dari daftar atau ketik manual |
| NIP | `nip` | text | Auto-isi jika pilih dari dropdown |
| Golongan | `golongan` | select | II / III / IV |
| Jabatan | `jabatan` | text | Auto-isi jika pilih dari dropdown |
| Tujuan | `tujuan` | text | Default dari header |
| No SPD | `noSPD` | text | "WIM.16.IMI.1-KU.03.01-2439" |
| Tanggal SPD | `tanggalSPD` | date | |
| Tanggal Pelaksanaan | `tanggalPelaksanaan` | text | "28 sd 28 Mei 2026" |
| Lama (hari) | `lamaHari` | number | Otomatis hitung teks "1 (satu) hari", "2 (dua) hari", dst. |
| Uang Harian | `uangHarian` | number | Nilai rupiah per hari |
| Maskapai Pergi | `maskapaiPergi` | text | "Batik Air (PNK - CGK)" |
| Harga Tiket Pergi | `tiketPergi` | number | |
| Maskapai Pulang | `maskapaiPulang` | text | "Citilink (CGK - PNK)" |
| Harga Tiket Pulang | `tiketPulang` | number | |
| Taksi | `taksi` | number | |
| Taksi Daerah | `taksiDaerah` | number | |
| Transport Antar Kab/Kota | `transportKab` | number | |
| Biaya Penginapan | `penginapan` | number | |
| Uang Representasi | `representasi` | number | |
| No Rekening | `rekening` | text | "BPG 042 655216928301000" |

**Kalkulasi otomatis (tampil di bawah setiap baris pegawai):**
- Total Tiket PP = tiketPergi + tiketPulang
- Jumlah Uang Harian = uangHarian × lamaHari
- **Total Per Pegawai** = Total Tiket PP + Taksi + Taksi Daerah + Transport + Uang Harian Total + Penginapan + Representasi

Tampilkan total dalam format **Rp xxx.xxx.xxx** dengan highlight warna emas.

### Bagian C — Dropdown Daftar Pegawai

Sediakan dropdown autocomplete dengan **daftar pegawai bawaan** berikut (bisa ditambah manual):

```javascript
const daftarPegawai = [
  { nama: "MOKHAMAD REZA SULAEMAN, A.Md.Im., S.IP.", nip: "19800921 200112 1 001", pangkat: "PENATA TK. I / (III/d)", jabatan: "PLT. KEPALA RUDENIM PONTIANAK" },
  { nama: "ITA ANGGRIANI, S.H.", nip: "19721013 199203 2 001", pangkat: "PENATA TK. I / (III/d)", jabatan: "KEPALA SUB BAGIAN TATA USAHA" },
  { nama: "FAJAR DWI PRASETYO, A.Md.,S.Kom", nip: "19800913 200901 1 008", pangkat: "PENATA TK. I / (III/d)", jabatan: "KASI KEAMANAN DAN KETERTIBAN" },
  { nama: "MUHAMMAD REZA, S.H.", nip: "19840124 200212 1 002", pangkat: "PENATA / (III/c)", jabatan: "KASI PERAWATAN DAN KESEHATAN" },
  { nama: "SYECH MUKHAMAR REZA KHARAMI, S.H.", nip: "19840831 200312 1 001", pangkat: "PENATA / (III/c)", jabatan: "KASI REG, ADMINISTRASI & PELAPORAN" },
  { nama: "FREDERICK A. RUHUPATTY, S.S.", nip: "19770401 200912 1 002", pangkat: "PENATA TK. I / (III/d)", jabatan: "KEPALA URUSAN UMUM" },
  { nama: "SAULINA SIMORANGKIR, S.S.", nip: "19800803 200912 2 001", pangkat: "PENATA TK. I / (III/d)", jabatan: "KASUBSI REGISTRASI" },
  { nama: "YAKUB SAPUTRA SIMANJUNTAK, S.P.", nip: "19830521 200604 1 001", pangkat: "PENATA TK. I / (III/d)", jabatan: "KASUBSI KETERTIBAN" },
  { nama: "FITRIADI TULUS", nip: "19680516 199003 1 003", pangkat: "PENATA MUDA Tk. I / (III/b)", jabatan: "KASUBSI ADMINISTRASI DAN PELAPORAN" },
  { nama: "TARMUJI", nip: "19680727 199103 1 002", pangkat: "PENATA MUDA Tk. I / (III/b)", jabatan: "KASUBSI KESEHATAN" },
  { nama: "HARYANTO", nip: "19711104 199103 1 001", pangkat: "PENATA MUDA Tk. I / (III/b)", jabatan: "KASUBSI PERAWATAN" },
  { nama: "TEDY SUMPONO", nip: "19810907 200501 1 001", pangkat: "PENATA MUDA TK. I / (III/b)", jabatan: "KASUBSI KEAMANAN" },
  { nama: "HARDIAN RAMADHANA SESTYANTO, S.H.", nip: "19880425 201212 1 003", pangkat: "PENATA MUDA TK. I / (III/b)", jabatan: "KAUR KEUANGAN" },
  { nama: "GORGA ARISANDY SIREGAR, S.Kom.", nip: "19920703 201712 1 001", pangkat: "PENATA MUDA TK. I / (III/b)", jabatan: "KAUR KEPEGAWAIAN" },
  { nama: "IRWANSYAH, S.H.", nip: "19701017 199703 1 001", pangkat: "PENATA TK. I / (III/d)", jabatan: "PENYUSUN LAPORAN DAN HASIL EVALUASI" },
  { nama: "MUHAMMAD IQBAL, A.Md.Im., S.H., M.Si.", nip: "19840930 200312 1 002", pangkat: "PENATA TK. I / (III/d)", jabatan: "ANALIS PENGELOLAAN KEUANGAN APBN AHLI MUDA" },
  { nama: "AGUS DINARIA, S.H.", nip: "19870806 200604 2 001", pangkat: "PENATA TK. I / (III/d)", jabatan: "PENYUSUN RENCANA KERJA & ANGGARAN" },
  { nama: "WIRA PRATAMA ELVIRA PUTRI, S.ST.", nip: "19871207 200903 2 003", pangkat: "PENATA TK. I / (III/d)", jabatan: "PENGOLAH DATA KESEHATAN" },
  { nama: "MUHAMMAD FAJAR WAHYUDI, A.Md.", nip: "19831005 200901 1 015", pangkat: "PENATA / (III/c)", jabatan: "PENGELOLA DATA KEAMANAN DAN KETERTIBAN" },
  { nama: "HILMAN FIRDAUS, S.Kom.", nip: "19870306 200901 1 002", pangkat: "PENATA / (III/c)", jabatan: "PENYUSUN LAPORAN DAN HASIL EVALUASI" },
  { nama: "M. IRWANTO RAHMAWAN", nip: "19760108 200112 1 001", pangkat: "PENATA MUDA Tk. I / (III/b)", jabatan: "PENGELOLA KEAMANAN DAN KETERTIBAN" },
  { nama: "YUSDIAWAN", nip: "19770530 200212 1 001", pangkat: "PENATA MUDA Tk. I / (III/b)", jabatan: "PENGOLAH DATA LAPORAN KEAMANAN DAN KETERTIBAN" },
  { nama: "GALIH NOFRIO NANDA, S.IP.", nip: "19841109 201712 1 001", pangkat: "PENATA MUDA Tk. I / (III/b)", jabatan: "ANALIS KEIMIGRASIAN PERTAMA" },
  { nama: "CHANDRA HADINATA, S.E.", nip: "19910117 201503 1 004", pangkat: "PENATA MUDA TK. I / (III/b)", jabatan: "PENGELOLA DATA" },
  { nama: "ARIANDI, S.H.", nip: "19880119 200801 1 001", pangkat: "PENATA MUDA / (III/a)", jabatan: "KOMANDAN JAGA PEMASYARAKATAN/KEIMIGRASIAN" },
  { nama: "AGUNG SUPRABOWO, A.Md.Kep.", nip: "19900214 201503 1 006", pangkat: "PENATA MUDA / (III/a)", jabatan: "KOMANDAN JAGA PEMASYARAKATAN/KEIMIGRASIAN" },
  { nama: "WAN RHOMA DONNY, A.Md.", nip: "19900420 201503 1 002", pangkat: "PENATA MUDA / (III/a)", jabatan: "PENGELOLA DATA KEPEGAWAIAN" },
  { nama: "MOCHAMAD HENDRO TRIYONO, A.Md.", nip: "19900816 201503 1 003", pangkat: "PENATA MUDA / (III/a)", jabatan: "PENGOLAH DATA LAPORAN" },
  { nama: "DEWA GEDE GUNA SUWASTAWA, A.Md.", nip: "19930822 201712 1 001", pangkat: "PENATA MUDA / (III/a)", jabatan: "PEMERIKSA KEIMIGRASIAN MAHIR" },
  { nama: "JANUARTI TRI NINGSIH, S.H.", nip: "19940115 201212 2 001", pangkat: "PENATA MUDA / (III/a)", jabatan: "PENGOLAH BAHAN EVALUASI DAN PELAPORAN" }
];
```

Ketika nama dipilih dari dropdown, **NIP, Golongan, dan Jabatan otomatis terisi**.

### Bagian D — Tombol Aksi

Di bawah form terdapat tombol:
- **[💾 Simpan Data]** — menyimpan ke localStorage
- **[🖨️ Cetak Nominatif]** — membuka preview cetak Nominatif
- **[🖨️ Cetak DPR PIC]** — pindah ke menu DPR PIC dengan data terisi
- **[🖨️ Cetak Rincian SPD Semua]** — mencetak semua sheet rincian per pegawai sekaligus
- **[🗑️ Reset Form]** — konfirmasi sebelum reset

---

## MENU 2: DPR PIC

Menu ini menampilkan **preview dan cetak** dokumen **DAFTAR PENGELUARAN RILL (DPR) untuk PIC / Ketua Tim**.

### Struktur Dokumen DPR PIC

```
[KOP SURAT INSTANSI]
DAFTAR PENGELUARAN RILL
[Judul Kegiatan]
[Kode Anggaran]

Yang bertandatangan dibawah ini:
  NAMA    : [nama PPK]
  NIP     : [nip PPK]
  JABATAN : [jabatan PPK]

Berdasarkan Surat Perintah Tanggal: [tanggal SPT]
  Nomor: [nomor SPT]

dengan ini menyatakan dengan sesungguhnya bahwa:
1. Biaya belanja yang dikeluarkan meliputi:

┌────┬──────────────────────────────────┬──────────────┬──────────────┐
│ No │ RINCIAN BIAYA                    │ JUMLAH       │ KET.         │
├────┼──────────────────────────────────┼──────────────┼──────────────┤
│ 01 │ Biaya Uang Harian untuk          │ Rp xxx       │              │
│    │ [n] orang selama [x] hari        │              │              │
│    │ [n] Org x [x] Hari x [nominal]  │              │              │
├────┼──────────────────────────────────┼──────────────┼──────────────┤
│ 02 │ Tiket Perjalanan PP              │ Rp xxx       │ Bukti Lamp.  │
├────┼──────────────────────────────────┼──────────────┼──────────────┤
│ 03 │ Biaya Penginapan                 │ Rp xxx       │ Bukti Lamp.  │
├────┼──────────────────────────────────┼──────────────┼──────────────┤
│ 04 │ Biaya Taksi/Transport            │ Rp xxx       │ Bukti Lamp.  │
├────┼──────────────────────────────────┼──────────────┼──────────────┤
│    │ JUMLAH                           │ Rp xxx       │              │
│    │ [terbilang dalam huruf kapital]  │              │              │
└────┴──────────────────────────────────┴──────────────┴──────────────┘

2. Jumlah uang tersebut benar-benar dikeluarkan untuk pelaksanaan kegiatan...
   [teks pernyataan standar]

                              Pontianak, [tanggal]
  Mengetahui,                 Penerima,
  PEJABAT PEMBUAT KOMITMEN    [jabatan PPK]

  [nama PPK]                  [nama PPK]
  NIP. [nip PPK]              NIP. [nip PPK]
```

---

## OUTPUT 3: RINCIAN BIAYA PERJALANAN DINAS (Per Pegawai)

Setiap pegawai yang diinput menghasilkan dokumen **RINCIAN BIAYA PERJALANAN DINAS** dengan format:

```
RINCIAN BIAYA PERJALANAN DINAS
  Lampiran SPD Nomor  : [noSPD]
  Tanggal             : [tanggalSPD]

┌────┬──────────────────────────────────────────────────────┬─────────────┬──────────────┐
│ NO │ PERINCIAN BIAYA                                      │ JUMLAH (Rp) │ KETERANGAN   │
├────┼──────────────────────────────────────────────────────┼─────────────┼──────────────┤
│  1 │ [namaProgram]                                        │             │              │
│    │ An. [namaPegawai]                                    │             │              │
│    │ [tanggalKegiatan]                                    │             │              │
│    │ Belanja Perjalanan Biasa                             │             │              │
│    │  - Tiket Pesawat                                     │ Rp xxx      │              │
│    │    [maskapaiPergi] ([total tiket])                   │ Rp xxx      │ Bukti Lamp.  │
│    │    [maskapaiPulang]                                  │ Rp xxx      │ Bukti Lamp.  │
│    │  - Uang Harian  [n] x [nominal]                     │ Rp xxx      │ Tidak Ada Bkt│
│    │  - Penginapan                                        │ Rp xxx      │ Bukti Lamp.  │
│    │  - Taksi                                             │ Rp xxx      │ Bukti Lamp.  │
│    │  - Transport Dalam Kab/Kota                          │ Rp xxx      │ Tidak Ada Bkt│
├────┼──────────────────────────────────────────────────────┼─────────────┼──────────────┤
│    │ JUMLAH                                               │ Rp xxx      │              │
│    │ [TERBILANG HURUF KAPITAL]                            │             │              │
└────┴──────────────────────────────────────────────────────┴─────────────┴──────────────┘

                                    Pontianak, [tanggal]
  Telah Dibayar Sejumlah            Telah menerima jumlah uang sebesar
  Rp [jumlah]                       Rp [jumlah]

  Bendahara Pengeluaran,            Yang Menerima,
  [namaBendahara]                   [namaPegawai]
  NIP. [nipBendahara]               NIP. [nipPegawai]

─────────────────────────────────────────────────────────
PERHITUNGAN SPD RAMPUNG
  Ditetapkan sejumlah     : Rp [jumlah]
  Yang telah dibayar      : Rp [jumlah]
  Sisa Kurang / Lebih     : Rp 0

                              Pejabat Pembuat Komitmen,
                              [namaPPK]
                              NIP. [nipPPK]

─────────────────────────────────────────────────────────
DAFTAR PENGELUARAN RILL (Individual)
  Yang bertanda tangan di bawah ini:
  Nama    : [namaPegawai]
  NIP     : [nipPegawai]
  Jabatan : [jabatanPegawai]

  Berdasarkan SPD Nomor: [noSPD] tanggal [tanggalSPD]
  dengan ini menyatakan dengan sesungguhnya bahwa:
  [pernyataan standar]
```

---

## OUTPUT 4: DAFTAR NOMINATIF

Tabel ringkasan semua pegawai dalam satu halaman:

```
DAFTAR NOMINATIF PEMBAYARAN PERJALANAN DINAS
[judulKegiatan]
SESUAI SURAT PERINTAH TUGAS NO: [nomorSPT] TANGGAL: [tanggalSPT]

┌────┬──────────────────────┬─────┬──────────────────┬───────────┬──────────────┬───────────────────────────────────────┬──────────────────────┬────────┐
│ No │ Nama / NIP           │ Gol │ Jabatan          │ Tujuan    │ Tgl Kegiatan │ Biaya Perjalanan                       │ Rekening             │  TTD   │
│    │                      │     │                  │           │              ├──────────┬──────┬──────┬──────┬────────┤                      │        │
│    │                      │     │                  │           │              │ Tiket PP │ Taksi│ TDae │ U.Hr │ Pnp    │                      │        │
├────┼──────────────────────┼─────┼──────────────────┼───────────┼──────────────┼──────────┼──────┼──────┼──────┼────────┼──────────────────────┼────────┤
│  1 │ [nama]               │ III │ [jabatan]        │ Jakarta   │ 28 Mei 2026  │ x,xxx    │  xxx │  xxx │  xxx │  xxx   │ BPG 042 xxx          │  [1]   │
│    │ [nip]                │     │                  │           │              │          │      │      │      │        │                      │        │
├────┼──────────────────────┼─────┼──────────────────┼───────────┼──────────────┼──────────┼──────┼──────┼──────┼────────┼──────────────────────┼────────┤
│    │ TOTAL                │     │                  │           │              │          │      │      │      │        │                      │        │
└────┴──────────────────────┴─────┴──────────────────┴───────────┴──────────────┴──────────┴──────┴──────┴──────┴────────┴──────────────────────┴────────┘

  Mengetahui,                                   Pontianak, [tanggal]
  Pejabat Pembuat Komitmen,                     Bendahara Pengeluaran,

  [namaPPK]                                     [namaBendahara]
  NIP. [nipPPK]                                 NIP. [nipBendahara]
```

---

## FUNGSI UTILITAS WAJIB

### 1. Terbilang (angka → huruf Indonesia)
```javascript
// Fungsi terbilang lengkap untuk nominal rupiah
// Contoh: 5368410 → "LIMA JUTA TIGA RATUS ENAM PULUH DELAPAN RIBU EMPAT RATUS SEPULUH RUPIAH"
function terbilang(angka) { ... }
```

### 2. Format Rupiah
```javascript
function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
}
```

### 3. Lama Hari ke Teks
```javascript
// 1 → "1 (satu) hari", 3 → "3 (tiga) hari", dll.
function lamaHariTeks(n) { ... }
```

### 4. Format Tanggal Indonesia
```javascript
// "2026-05-28" → "28 Mei 2026"
function formatTanggalID(tgl) { ... }
```

### 5. Simpan/Load localStorage
Data form disimpan otomatis ke localStorage setiap perubahan, dan dimuat ulang saat halaman dibuka.

---

## FITUR CETAK

Semua output dokumen harus **print-ready**:
- Tombol **"🖨️ Cetak"** membuka `window.print()` atau `printJS`
- Saat print, sembunyikan UI navigasi, tampilkan hanya dokumen
- Ukuran kertas: A4 portrait
- Margin: 2cm semua sisi
- Font cetak: Times New Roman 11pt untuk konten dokumen
- Nomor halaman otomatis untuk Nominatif jika lebih dari 1 halaman
- Tambahkan tombol **"Cetak Semua Rincian SPD"** yang mencetak dokumen pegawai 1 s/d n berurutan

---

## ATURAN PENTING

1. **Single-file**: Semua dalam satu `.html`, tidak ada file eksternal kecuali CDN
2. **No backend**: Murni frontend, kalkulasi di browser
3. **Responsive**: Tampil baik di layar lebar (1280px+) dan saat cetak
4. **localStorage**: Data tidak hilang jika tab di-refresh
5. **Validasi**: Field wajib (Nama, NIP, No SPD, Tanggal) diberi indikator merah jika kosong saat cetak
6. **Terbilang**: Wajib diimplementasi untuk semua jumlah rupiah pada dokumen cetak
7. **Kop surat**: Muncul di setiap halaman dokumen cetak, bukan di UI app
8. **Print CSS**: Gunakan `@media print` untuk mengatur tampilan cetak

---

## CONTOH DATA TEST

Gunakan data berikut sebagai default/placeholder untuk testing:

```javascript
const contohData = {
  judulKegiatan: "MELAKUKAN KEGIATAN KOORDINASI TERKAIT CONTACT CENTRE DAN PENANGANAN PENGADUAN PADA KANTOR IMIGRASI KELAS I TPI PONTIANAK KE DIREKTORAT JENDERAL IMIGRASI JAKARTA",
  nomorSPT: "WIM.16.IMI.1-TI.04.01-2438",
  tanggalSPT: "2026-05-05",
  namaProgram: "Pengelolaan Teknologi Informasi Keimigrasian",
  tanggalKegiatan: "6 sd 8 Mei 2026",
  tujuanKota: "Jakarta",
  namaPPK: "SYECH MUKHAMAR REZA KHARAMI, S.H.",
  nipPPK: "19840831 200312 1 001",
  jabatanPPK: "KASI REG, ADMINISTRASI & PELAPORAN",
  namaBendahara: "MUHAMMAD REZA, S.H.",
  nipBendahara: "19840124 200212 1 002",
  pegawai: [
    {
      nama: "SYECH MUKHAMAR REZA KHARAMI, S.H.",
      nip: "19840831 200312 1 001",
      golongan: "III",
      jabatan: "KASI REG, ADMINISTRASI & PELAPORAN",
      tujuan: "Jakarta",
      noSPD: "WIM.16.IMI.1-KU.03.01-2439",
      tanggalSPD: "2026-05-25",
      tanggalPelaksanaan: "28 sd 28 Mei 2026",
      lamaHari: 1,
      uangHarian: 530000,
      maskapaiPergi: "Batik Air (PNK - CGK)",
      tiketPergi: 1550263,
      maskapaiPulang: "Citilink (CGK - PNK)",
      tiketPulang: 1481947,
      taksi: 250000,
      taksiDaerah: 96200,
      transportKab: 0,
      penginapan: 1460000,
      representasi: 0,
      rekening: "BPG 042 655216928301000"
    },
    {
      nama: "SAULINA SIMORANGKIR, S.S.",
      nip: "19800803 200912 2 001",
      golongan: "III",
      jabatan: "KASUBSI REGISTRASI",
      tujuan: "Jakarta",
      noSPD: "WIM.16.IMI.1-KU.03.01-2440",
      tanggalSPD: "2026-05-27",
      tanggalPelaksanaan: "28 sd 28 Mei 2026",
      lamaHari: 1,
      uangHarian: 530000,
      maskapaiPergi: "Batik Air (PNK - CGK)",
      tiketPergi: 1550263,
      maskapaiPulang: "Citilink (CGK - PNK)",
      tiketPulang: 1481947,
      taksi: 500000,
      taksiDaerah: 311500,
      transportKab: 0,
      penginapan: 1460000,
      representasi: 0,
      rekening: "BPG 042 655216928301000"
    }
  ]
};
```

---

## RINGKASAN OUTPUT YANG DIHASILKAN APP

| Dokumen | Isi | Tombol Cetak |
|---|---|---|
| **Nominatif** | Tabel ringkasan semua pegawai | ✅ |
| **DPR PIC** | Daftar Pengeluaran Rill untuk PIC/Ketua Tim | ✅ |
| **Rincian SPD [Nama]** | Rincian biaya per individu | ✅ per orang |
| **Cetak Semua** | Semua rincian SPD sekaligus | ✅ |

---

*Prompt ini dibuat berdasarkan file Master.Perjadin tikkim JAKARTA - Navigasi2.xlsm milik Kantor Imigrasi Kelas I TPI Pontianak. Versi: 2026-05-28.*
