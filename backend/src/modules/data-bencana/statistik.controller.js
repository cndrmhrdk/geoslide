const statistikModel = require("./statistik.model");

function parseYear(value) {
    if (value === undefined || value === "all") return "all";
    if (typeof value !== "string" || !/^\d{4}$/.test(value)) return null;

    const year = Number(value);
    return year >= 1900 && year <= 2100 ? value : null;
}

async function getStatistics(req, res) {
    const year = parseYear(req.query.year);

    if (!year) {
        return res.status(400).json({ message: "Parameter year harus berupa tahun yang valid atau 'all'." });
    }

    try {
        const statistics = await statistikModel.getStatistics(year);
        return res.json(statistics);
    } catch (error) {
        console.error("Gagal mengambil statistik bencana:", error);
        return res.status(500).json({ message: "Statistik bencana gagal dimuat." });
    }
}

module.exports = { getStatistics };
