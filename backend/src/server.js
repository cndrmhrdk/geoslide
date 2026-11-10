const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const db = require("./config/database");
const dataBencanaRoutes = require("./modules/data-bencana");
const orangHilangRoutes = require("./modules/orang-hilang");
const authRoutes = require("./modules/auth");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/data-bencana", dataBencanaRoutes);
app.use("/api/orang-hilang", orangHilangRoutes);
app.use("/api/auth", authRoutes);

// Foto orang hilang (path hanya dikirim API bila ada izin publikasi)
app.use("/uploads", express.static(path.join(__dirname, "..", process.env.UPLOAD_DIR || "uploads")));

// Halaman utama API
app.get("/", (req, res) => {
    res.send("LENTERA API berhasil berjalan!");
});

// Tes koneksi database
app.get("/api/test-db", async (req, res) => {
    try {
        const [rows] = await db.query("SHOW TABLES");

        res.json({
            message: "Koneksi database berhasil!",
            database: process.env.DB_NAME,
            tables: rows
        });

    } catch (error) {
        res.status(500).json({
            message: "Koneksi database gagal!",
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});