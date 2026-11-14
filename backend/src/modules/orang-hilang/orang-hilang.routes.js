const express    = require("express");
const multer     = require("multer");
const path       = require("path");
const crypto     = require("crypto");
const fs         = require("fs");
const controller = require("./orang-hilang.controller");
const db         = require("../../config/database");

const router = express.Router();

/* ---- Multer: foto orang hilang ---- */
const UPLOAD_DIR = path.join(
  __dirname, "..", "..", "..",
  process.env.UPLOAD_DIR || "uploads",
  "orang-hilang"
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
  limits:    { fileSize: 5 * 1024 * 1024, files: 3 },
  fileFilter(_req, file, cb) {
    const allowed = [".jpg", ".jpeg", ".png", ".webp"];
    cb(null, allowed.includes(path.extname(file.originalname).toLowerCase()));
  },
});

// Penting: urutan route sangat penting — spesifik sebelum parameter dinamis
router.get("/", controller.getAll);
router.get("/filters", controller.getFilters);
router.post("/", upload.array("photos", 3), controller.createPublic);

// Cek status laporan orang hilang via kode pelacakan (OH-YYYYMMDD-XXXXXX)
router.get("/tracking/:code", async (req, res) => {
    const code = String(req.params.code || "").trim().toUpperCase();
    if (!code || code.length > 30) {
        return res.status(400).json({ message: "Kode pelacakan tidak valid." });
    }
    try {
        const [rows] = await db.query(
            `SELECT
               id, tracking_code, name, last_seen_location,
               verification_status AS status,
               search_status,
               rejection_reason,
               DATE_FORMAT(reviewed_at, '%Y-%m-%d %H:%i') AS reviewed_at,
               DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS submitted_at
             FROM missing_persons
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
            jenis:            "orang_hilang",
            nama:             r.name,
            location:         r.last_seen_location,
            event_date:       null,
            status:           r.status,          // pending | approved | rejected
            search_status:    r.search_status,   // searching | found | closed
            rejection_reason: r.status === "rejected" ? r.rejection_reason : null,
            reviewed_at:      r.reviewed_at,
            submitted_at:     r.submitted_at,
        });
    } catch (err) {
        console.error("[orang-hilang tracking GET]", err);
        res.status(500).json({ message: "Gagal memeriksa status laporan." });
    }
});

router.get("/:id", controller.getById);

module.exports = router;
