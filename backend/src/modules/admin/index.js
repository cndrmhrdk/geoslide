/**
 * admin.routes.js — Semua route admin GeoSlide
 * Semua route di sini dilindungi oleh requireAdmin middleware.
 */
const express = require("express");
const bcrypt  = require("bcryptjs");
const db      = require("../../config/database");
const { requireAdmin } = require("../auth/auth.middleware");

const router = express.Router();
router.use(requireAdmin);

/* ================================================================
   DASHBOARD
   ================================================================ */

// GET /api/admin/dashboard/stats
router.get("/dashboard/stats", async (req, res) => {
    try {
        const [[{ total_events }]]  = await db.query("SELECT COUNT(*) AS total_events FROM disaster_events");
        const [[{ total_reports }]] = await db.query("SELECT COUNT(*) AS total_reports FROM disaster_reports");
        const [[{ pending_reports }]] = await db.query("SELECT COUNT(*) AS pending_reports FROM disaster_reports WHERE status = 'pending'");
        const [[{ approved_reports }]] = await db.query("SELECT COUNT(*) AS approved_reports FROM disaster_reports WHERE status = 'approved'");
        const [[{ rejected_reports }]] = await db.query("SELECT COUNT(*) AS rejected_reports FROM disaster_reports WHERE status = 'rejected'");
        const [[{ total_missing }]] = await db.query("SELECT COUNT(*) AS total_missing FROM missing_persons");
        res.json({ total_events, total_reports, pending_reports, approved_reports, rejected_reports, total_missing });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal memuat statistik." });
    }
});

// GET /api/admin/dashboard/monthly — kejadian per bulan tahun berjalan
router.get("/dashboard/monthly", async (req, res) => {
    try {
        const year = new Date().getFullYear();
        const [rows] = await db.query(
            `SELECT MONTH(event_date) AS m, COUNT(*) AS count
             FROM disaster_events
             WHERE YEAR(event_date) = ?
             GROUP BY m ORDER BY m`,
            [year]
        );
        const MONTHS = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
        const result = MONTHS.map((month, i) => {
            const found = rows.find(r => r.m === i + 1);
            return { month, count: found ? Number(found.count) : 0 };
        });
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal memuat data bulanan." });
    }
});

/* ================================================================
   DATA BENCANA
   ================================================================ */

// GET /api/admin/data-bencana
router.get("/data-bencana", async (req, res) => {
    try {
        const page  = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 100);
        const offset = (page - 1) * limit;
        const { search, verification_status } = req.query;

        const conditions = [];
        const params     = [];
        if (search) { conditions.push("(title LIKE ? OR province LIKE ? OR regency LIKE ?)"); const s = `%${search}%`; params.push(s, s, s); }
        if (verification_status && verification_status !== "all") { conditions.push("verification_status = ?"); params.push(verification_status); }
        const where = conditions.length ? "WHERE " + conditions.join(" AND ") : "";

        const [[{ total }]] = await db.query(`SELECT COUNT(*) AS total FROM disaster_events ${where}`, params);
        const [rows] = await db.query(`SELECT * FROM disaster_events ${where} ORDER BY event_date DESC LIMIT ? OFFSET ?`, [...params, limit, offset]);
        res.json({ data: rows, total, page, limit });
    } catch (err) { console.error(err); res.status(500).json({ message: "Gagal memuat data bencana." }); }
});

// POST /api/admin/data-bencana
router.post("/data-bencana", async (req, res) => {
    try {
        const { title, event_date, province, regency, district, village, latitude, longitude, description,
                deaths, missing, injured, displaced, houses_damaged, source_note, verification_status } = req.body;
        if (!title || !event_date || !province || !regency) {
            return res.status(400).json({ message: "Judul, tanggal, provinsi, dan kabupaten wajib diisi." });
        }
        const [result] = await db.query(
            `INSERT INTO disaster_events (title, event_date, province, regency, district, village, latitude, longitude,
             description, deaths, missing, injured, displaced, houses_damaged, source_note, verification_status, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, event_date, province, regency, district||null, village||null, latitude||null, longitude||null,
             description||null, deaths||0, missing||0, injured||0, displaced||0, houses_damaged||0,
             source_note||null, verification_status||"unverified", req.user.id]
        );
        res.status(201).json({ message: "Kejadian berhasil ditambahkan.", id: result.insertId });
    } catch (err) { console.error(err); res.status(500).json({ message: "Gagal menambahkan kejadian." }); }
});

// PUT /api/admin/data-bencana/:id
router.put("/data-bencana/:id", async (req, res) => {
    try {
        const { title, event_date, province, regency, district, village, latitude, longitude, description,
                deaths, missing, injured, displaced, houses_damaged, source_note, verification_status } = req.body;
        const [result] = await db.query(
            `UPDATE disaster_events SET title=?, event_date=?, province=?, regency=?, district=?, village=?, latitude=?,
             longitude=?, description=?, deaths=?, missing=?, injured=?, displaced=?, houses_damaged=?,
             source_note=?, verification_status=? WHERE id=?`,
            [title, event_date, province, regency, district||null, village||null, latitude||null, longitude||null,
             description||null, deaths||0, missing||0, injured||0, displaced||0, houses_damaged||0,
             source_note||null, verification_status||"unverified", req.params.id]
        );
        if (!result.affectedRows) return res.status(404).json({ message: "Kejadian tidak ditemukan." });
        res.json({ message: "Kejadian berhasil diperbarui." });
    } catch (err) { console.error(err); res.status(500).json({ message: "Gagal memperbarui kejadian." }); }
});

// DELETE /api/admin/data-bencana/:id
router.delete("/data-bencana/:id", async (req, res) => {
    try {
        const [result] = await db.query("DELETE FROM disaster_events WHERE id=?", [req.params.id]);
        if (!result.affectedRows) return res.status(404).json({ message: "Kejadian tidak ditemukan." });
        res.json({ message: "Kejadian berhasil dihapus." });
    } catch (err) { console.error(err); res.status(500).json({ message: "Gagal menghapus kejadian." }); }
});

// PATCH /api/admin/data-bencana/:id/verification
router.patch("/data-bencana/:id/verification", async (req, res) => {
    try {
        const { verification_status } = req.body;
        if (!["verified","unverified"].includes(verification_status)) {
            return res.status(400).json({ message: "Status tidak valid." });
        }
        const [result] = await db.query("UPDATE disaster_events SET verification_status=? WHERE id=?", [verification_status, req.params.id]);
        if (!result.affectedRows) return res.status(404).json({ message: "Kejadian tidak ditemukan." });
        res.json({ message: "Status verifikasi diperbarui." });
    } catch (err) { console.error(err); res.status(500).json({ message: "Gagal memperbarui verifikasi." }); }
});

/* ================================================================
   LAPORAN BENCANA
   ================================================================ */

// GET /api/admin/laporan
router.get("/laporan", async (req, res) => {
    try {
        const page  = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 100);
        const offset = (page - 1) * limit;
        const { search, status } = req.query;

        const conditions = [];
        const params     = [];
        if (search) { conditions.push("(reporter_name LIKE ? OR province LIKE ? OR regency LIKE ?)"); const s = `%${search}%`; params.push(s, s, s); }
        if (status && status !== "all") { conditions.push("status = ?"); params.push(status); }
        const where = conditions.length ? "WHERE " + conditions.join(" AND ") : "";

        const [[{ total }]] = await db.query(`SELECT COUNT(*) AS total FROM disaster_reports ${where}`, params);
        const [rows] = await db.query(`SELECT * FROM disaster_reports ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, limit, offset]);
        res.json({ data: rows, total, page, limit });
    } catch (err) { console.error(err); res.status(500).json({ message: "Gagal memuat laporan." }); }
});

// GET /api/admin/laporan/:id
router.get("/laporan/:id", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM disaster_reports WHERE id=? LIMIT 1", [req.params.id]);
        if (!rows[0]) return res.status(404).json({ message: "Laporan tidak ditemukan." });
        res.json({ data: rows[0] });
    } catch (err) { console.error(err); res.status(500).json({ message: "Gagal memuat laporan." }); }
});

// PATCH /api/admin/laporan/:id/status
router.patch("/laporan/:id/status", async (req, res) => {
    try {
        const { status, rejection_reason } = req.body;
        if (!["approved","rejected"].includes(status)) {
            return res.status(400).json({ message: "Status harus 'approved' atau 'rejected'." });
        }
        if (status === "rejected" && !String(rejection_reason||"").trim()) {
            return res.status(400).json({ message: "Alasan penolakan wajib diisi." });
        }
        const [result] = await db.query(
            "UPDATE disaster_reports SET status=?, rejection_reason=?, reviewed_by=?, reviewed_at=NOW() WHERE id=?",
            [status, rejection_reason||null, req.user.id, req.params.id]
        );
        if (!result.affectedRows) return res.status(404).json({ message: "Laporan tidak ditemukan." });
        res.json({ message: `Laporan berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}.` });
    } catch (err) { console.error(err); res.status(500).json({ message: "Gagal memperbarui status laporan." }); }
});

/* ================================================================
   SUMBER DATA
   ================================================================ */

// GET /api/admin/sumber-data
router.get("/sumber-data", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM data_sources ORDER BY created_at DESC");
        res.json({ data: rows });
    } catch (err) { console.error(err); res.status(500).json({ message: "Gagal memuat sumber data." }); }
});

// POST /api/admin/sumber-data
router.post("/sumber-data", async (req, res) => {
    try {
        const { name, url, data_period, retrieved_at, format, limitations } = req.body;
        if (!name) return res.status(400).json({ message: "Nama sumber wajib diisi." });
        const [result] = await db.query(
            "INSERT INTO data_sources (name, url, data_period, retrieved_at, format, limitations) VALUES (?,?,?,?,?,?)",
            [name, url||null, data_period||null, retrieved_at||null, format||null, limitations||null]
        );
        res.status(201).json({ message: "Sumber data ditambahkan.", id: result.insertId });
    } catch (err) { console.error(err); res.status(500).json({ message: "Gagal menambahkan sumber data." }); }
});

// PUT /api/admin/sumber-data/:id
router.put("/sumber-data/:id", async (req, res) => {
    try {
        const { name, url, data_period, retrieved_at, format, limitations } = req.body;
        const [result] = await db.query(
            "UPDATE data_sources SET name=?, url=?, data_period=?, retrieved_at=?, format=?, limitations=? WHERE id=?",
            [name, url||null, data_period||null, retrieved_at||null, format||null, limitations||null, req.params.id]
        );
        if (!result.affectedRows) return res.status(404).json({ message: "Sumber data tidak ditemukan." });
        res.json({ message: "Sumber data diperbarui." });
    } catch (err) { console.error(err); res.status(500).json({ message: "Gagal memperbarui sumber data." }); }
});

// DELETE /api/admin/sumber-data/:id
router.delete("/sumber-data/:id", async (req, res) => {
    try {
        const [result] = await db.query("DELETE FROM data_sources WHERE id=?", [req.params.id]);
        if (!result.affectedRows) return res.status(404).json({ message: "Sumber data tidak ditemukan." });
        res.json({ message: "Sumber data dihapus." });
    } catch (err) { console.error(err); res.status(500).json({ message: "Gagal menghapus sumber data." }); }
});

// GET /api/admin/sumber-data/logs — riwayat impor
router.get("/sumber-data/logs", async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT il.*, ds.name AS source_name
             FROM import_logs il
             LEFT JOIN data_sources ds ON ds.id = il.data_source_id
             ORDER BY il.created_at DESC LIMIT 100`
        );
        res.json({ data: rows });
    } catch (err) { console.error(err); res.status(500).json({ message: "Gagal memuat riwayat impor." }); }
});

/* ================================================================
   KELOLA AKUN ADMIN
   ================================================================ */

// GET /api/admin/akun
router.get("/akun", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id, name, email, role, is_active, created_at, updated_at FROM users ORDER BY created_at ASC");
        res.json({ data: rows });
    } catch (err) { console.error(err); res.status(500).json({ message: "Gagal memuat akun admin." }); }
});

// POST /api/admin/akun
router.post("/akun", async (req, res) => {
    try {
        const { name, email, password, is_active } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: "Nama, email, dan password wajib diisi." });
        if (password.length < 6) return res.status(400).json({ message: "Password minimal 6 karakter." });
        const hash = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            "INSERT INTO users (name, email, password, role, is_active) VALUES (?, ?, ?, 'admin', ?)",
            [name, email, hash, is_active !== undefined ? is_active : 1]
        );
        res.status(201).json({ message: "Akun admin berhasil dibuat.", id: result.insertId });
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "Email sudah digunakan." });
        console.error(err); res.status(500).json({ message: "Gagal membuat akun." });
    }
});

// PUT /api/admin/akun/:id
router.put("/akun/:id", async (req, res) => {
    try {
        const { name, email, password, is_active } = req.body;
        if (!name || !email) return res.status(400).json({ message: "Nama dan email wajib diisi." });
        let query, params;
        if (password && password.trim()) {
            if (password.length < 6) return res.status(400).json({ message: "Password minimal 6 karakter." });
            const hash = await bcrypt.hash(password, 10);
            query  = "UPDATE users SET name=?, email=?, password=?, is_active=? WHERE id=?";
            params = [name, email, hash, is_active !== undefined ? is_active : 1, req.params.id];
        } else {
            query  = "UPDATE users SET name=?, email=?, is_active=? WHERE id=?";
            params = [name, email, is_active !== undefined ? is_active : 1, req.params.id];
        }
        const [result] = await db.query(query, params);
        if (!result.affectedRows) return res.status(404).json({ message: "Akun tidak ditemukan." });
        res.json({ message: "Akun berhasil diperbarui." });
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "Email sudah digunakan." });
        console.error(err); res.status(500).json({ message: "Gagal memperbarui akun." });
    }
});

// PATCH /api/admin/akun/:id/status — toggle aktif/nonaktif
router.patch("/akun/:id/status", async (req, res) => {
    try {
        if (Number(req.params.id) === req.user.id) {
            return res.status(400).json({ message: "Tidak dapat mengubah status akun sendiri." });
        }
        const { is_active } = req.body;
        const [result] = await db.query("UPDATE users SET is_active=? WHERE id=?", [is_active ? 1 : 0, req.params.id]);
        if (!result.affectedRows) return res.status(404).json({ message: "Akun tidak ditemukan." });
        res.json({ message: "Status akun diperbarui." });
    } catch (err) { console.error(err); res.status(500).json({ message: "Gagal memperbarui status akun." }); }
});

// DELETE /api/admin/akun/:id
router.delete("/akun/:id", async (req, res) => {
    try {
        if (Number(req.params.id) === req.user.id) {
            return res.status(400).json({ message: "Tidak dapat menghapus akun sendiri." });
        }
        const [result] = await db.query("DELETE FROM users WHERE id=?", [req.params.id]);
        if (!result.affectedRows) return res.status(404).json({ message: "Akun tidak ditemukan." });
        res.json({ message: "Akun berhasil dihapus." });
    } catch (err) { console.error(err); res.status(500).json({ message: "Gagal menghapus akun." }); }
});

module.exports = router;
