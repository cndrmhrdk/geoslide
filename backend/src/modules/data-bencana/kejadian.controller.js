const kejadianModel = require("./kejadian.model");

function parseYear(value) {
    if (value === undefined || value === "all") return "all";
    if (typeof value !== "string" || !/^\d{4}$/.test(value)) return null;

    const year = Number(value);
    return year >= 1900 && year <= 2100 ? value : null;
}

async function listEvents(req, res) {
    const year = parseYear(req.query.year);
    const rawSearch = req.query.search;
    const rawLimit = req.query.limit;
    const rawProvince = req.query.province;
    const rawRegency = req.query.regency;

    if (!year) {
        return res.status(400).json({ message: "Parameter year harus berupa tahun yang valid atau 'all'." });
    }
    if (rawSearch !== undefined && (typeof rawSearch !== "string" || rawSearch.length > 100)) {
        return res.status(400).json({ message: "Parameter search harus berupa teks maksimal 100 karakter." });
    }
    if (rawProvince !== undefined && (typeof rawProvince !== "string" || rawProvince.length > 100)) {
        return res.status(400).json({ message: "Parameter province harus berupa teks maksimal 100 karakter." });
    }
    if (rawRegency !== undefined && (typeof rawRegency !== "string" || rawRegency.length > 100)) {
        return res.status(400).json({ message: "Parameter regency harus berupa teks maksimal 100 karakter." });
    }
    if (rawLimit !== undefined && (!/^\d+$/.test(String(rawLimit)) || Number(rawLimit) < 1)) {
        return res.status(400).json({ message: "Parameter limit harus berupa bilangan positif." });
    }

    const limit = Math.min(Number(rawLimit) || 500, 1000);

    try {
        const result = await kejadianModel.getEvents({
            year,
            search: rawSearch?.trim() || "",
            province: rawProvince?.trim() || "",
            regency: rawRegency?.trim() || "",
            limit
        });

        return res.json({
            data: result.events,
            count: result.events.length,
            hasMore: result.hasMore,
            availableYears: result.availableYears,
            filters: {
                year,
                search: rawSearch?.trim() || "",
                province: rawProvince?.trim() || "",
                regency: rawRegency?.trim() || ""
            }
        });
    } catch (error) {
        console.error("Gagal mengambil kejadian bencana:", error);
        return res.status(500).json({ message: "Data kejadian bencana gagal dimuat." });
    }
}

module.exports = { listEvents };
