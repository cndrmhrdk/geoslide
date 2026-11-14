/**
 * laporan-bencana/index.js — Rute publik untuk pengiriman laporan bencana
 *
 * POST /api/laporan-bencana          — kirim laporan baru + foto
 * GET  /api/laporan-bencana/:code    — cek status lewat kode pelacakan
 */
const express  = require("express");
const multer   = require("multer");
const path     = require("path");
const crypto   = require("crypto");
const fs       = require("fs");
const db       = require("../../config/database");

const router = express.Router();

/* ---- Multer storage: simpan ke uploads/laporan-bencana/ ---- */
const UPLOAD_DIR = path.join(
  __dirname, "..", "..", "..",
  process.env.UPLOAD_DIR || "uploads",
  "laporan-bencana"
);

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename:    (_req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits:    { fileSize: 5 * 1024 * 1024, files: 5 },   // max 5 MB per file, max 5 files
  fileFilter(_req, file, cb) {
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    const ext     = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) return cb(null, true);
    cb(new Error("Hanya file gambar yang diizinkan (JPG, PNG, WEBP, GIF)."));
  },
});

/* ---- Pembuat kode pelacakan unik: GS-YYYYMMDD-XXXXXX ---- */
function makeTrackingCode() {
  const today  = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `GS-${today}-${suffix}`;
}

/* ================================================================
   POST /api/laporan-bencana
   body: multipart/form-data
   fields: reporter_name, reporter_contact, event_date,
           province, regency, district?, village?,
           latitude?, longitude?, description
   files:  photos[] (opsional, max 5)
   ================================================================ */
router.post("/", upload.array("photos", 5), async (req, res) => {
  const {
    reporter_name, reporter_contact,
    event_date, province, regency, district, village,
    latitude, longitude, description,
  } = req.body || {};

  /* Validasi wajib */
  const missing = [];
  if (!reporter_name?.trim())    missing.push("Nama pelapor");
  if (!reporter_contact?.trim()) missing.push("Kontak pelapor");
  if (!event_date?.trim())       missing.push("Tanggal kejadian");
  if (!province?.trim())         missing.push("Provinsi");
  if (!regency?.trim())          missing.push("Kabupaten/Kota");
  if (!description?.trim())      missing.push("Deskripsi kejadian");

  if (missing.length) {
    // Hapus file yang sudah ter-upload jika validasi gagal
    (req.files || []).forEach(f => fs.unlink(f.path, () => {}));
    return res.status(400).json({ message: `Field wajib belum diisi: ${missing.join(", ")}.` });
  }

  /* Generate kode pelacakan unik */
  let tracking_code;
  let attempts = 0;
  do {
    tracking_code = makeTrackingCode();
    const [[{ n }]] = await db.query(
      "SELECT COUNT(*) AS n FROM disaster_reports WHERE tracking_code = ?",
      [tracking_code]
    );
    if (n === 0) break;
  } while (++attempts < 10);

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    /* Simpan laporan */
    const [result] = await conn.query(
      `INSERT INTO disaster_reports
         (tracking_code, reporter_name, reporter_contact, event_date,
          province, regency, district, village,
          latitude, longitude, description, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        tracking_code,
        reporter_name.trim(), reporter_contact.trim(),
        event_date, province.trim(), regency.trim(),
        district?.trim() || null, village?.trim() || null,
        latitude  ? Number(latitude)  : null,
        longitude ? Number(longitude) : null,
        description.trim(),
      ]
    );

    const reportId = result.insertId;

    /* Simpan referensi foto */
    for (const file of (req.files || [])) {
      const relPath = `laporan-bencana/${file.filename}`;
      await conn.query(
        "INSERT INTO event_documents (disaster_report_id, file_path, file_type) VALUES (?, ?, ?)",
        [reportId, relPath, file.mimetype]
      );
    }

    await conn.commit();
    res.status(201).json({
      message:       "Laporan berhasil dikirim. Simpan kode pelacakan Anda.",
      tracking_code,
      report_id:     reportId,
    });
  } catch (err) {
    await conn.rollback();
    (req.files || []).forEach(f => fs.unlink(f.path, () => {}));
    console.error("[laporan-bencana POST]", err);
    res.status(500).json({ message: "Gagal menyimpan laporan. Coba lagi." });
  } finally {
    conn.release();
  }
});

/* ================================================================
   GET /api/laporan-bencana/:code — cek status laporan
   ================================================================ */
router.get("/:code", async (req, res) => {
  const code = String(req.params.code || "").trim().toUpperCase();
  if (!code || code.length > 30) {
    return res.status(400).json({ message: "Kode pelacakan tidak valid." });
  }

  try {
    const [rows] = await db.query(
      `SELECT
         id, tracking_code, event_date, province, regency,
         status, rejection_reason, reviewed_at,
         DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS submitted_at
       FROM disaster_reports
       WHERE tracking_code = ?
       LIMIT 1`,
      [code]
    );

    if (!rows[0]) {
      return res.status(404).json({ message: "Kode pelacakan tidak ditemukan." });
    }

    const r = rows[0];
    res.json({
      tracking_code:    r.tracking_code,
      event_date:       r.event_date,
      location:         `${r.regency}, ${r.province}`,
      status:           r.status,            // pending | approved | rejected
      rejection_reason: r.status === "rejected" ? r.rejection_reason : null,
      reviewed_at:      r.reviewed_at,
      submitted_at:     r.submitted_at,
    });
  } catch (err) {
    console.error("[laporan-bencana GET]", err);
    res.status(500).json({ message: "Gagal memeriksa status laporan." });
  }
});

module.exports = router;
