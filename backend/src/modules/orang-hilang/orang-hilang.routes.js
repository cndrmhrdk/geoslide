const express  = require("express");
const multer   = require("multer");
const path     = require("path");
const crypto   = require("crypto");
const fs       = require("fs");
const controller = require("./orang-hilang.controller");

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

// Penting: "/filters" harus sebelum "/:id"
router.get("/", controller.getAll);
router.get("/filters", controller.getFilters);
router.post("/", upload.array("photos", 3), controller.createPublic);
router.get("/:id", controller.getById);

module.exports = router;
