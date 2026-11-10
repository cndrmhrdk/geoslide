const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const db = require("../../config/database");

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { message: "Terlalu banyak percobaan login. Coba lagi beberapa menit lagi." },
});

// POST /api/auth/login  { email, password }
router.post("/login", loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({ message: "Email dan password wajib diisi." });
        }

        const [rows] = await db.query(
            "SELECT id, name, email, password, role, is_active FROM users WHERE email = ? LIMIT 1",
            [email]
        );
        const user = rows[0];
        const ok = user && user.is_active && (await bcrypt.compare(password, user.password));
        if (!ok) return res.status(401).json({ message: "Email atau password salah." });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || "8h",
        });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
});

module.exports = router;
