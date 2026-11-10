const model = require("./orang-hilang.model");

const SEARCH_STATUSES = ["searching", "found", "closed"];
const VERIFICATIONS = ["pending", "approved", "rejected"];

// Hanya field publik. JANGAN menambahkan reporter_name, reporter_contact,
// tracking_code, admin_note, atau rejection_reason ke respons publik.
function toPublic(r) {
    return {
        id: r.id,
        nama: r.name,
        usia: r.age,
        jenisKelamin: r.gender, // male | female | unknown
        // Foto hanya keluar bila pelapor mengizinkan publikasi.
        foto: r.public_consent && r.photo_path ? `/uploads/${r.photo_path}` : null,
        ciriFisik: r.physical_description,
        lokasiTerakhir: r.last_seen_location,
        waktuTerakhirTerlihat: r.last_seen_at,
        status: r.search_status, // searching | found | closed
        catatanKontak: r.public_contact_note,
        diperbaruiPada: r.updated_at,
        kejadian: r.event_id
            ? {
                id: r.event_id,
                judul: r.event_title,
                tanggal: r.event_date,
                provinsi: r.province,
                kabupaten: r.regency,
                kecamatan: r.district,
                desa: r.village,
            }
            : null,
    };
}

// Ambil parameter teks dari query string. Menolak array/objek (mis. ?q=a&q=b)
// dan teks terlalu panjang, agar tidak merusak query SQL.
function readText(value, max = 100) {
    if (value === undefined) return { value: undefined };
    if (typeof value !== "string" || value.length > max) return { invalid: true };
    return { value: value.trim() || undefined };
}

// Escape karakter wildcard LIKE (% dan _) agar pencarian nama bersifat literal.
const escapeLike = (text) => text.replace(/[\\%_]/g, "\\$&");

const paging = (query, defaultLimit, maxLimit) => {
    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit, 10) || defaultLimit, 1), maxLimit);
    return { page, limit, offset: (page - 1) * limit };
};

const serverError = (res, error) => {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
};

// ---------- Publik ----------
exports.getAll = async (req, res) => {
    try {
        const q = readText(req.query.q);
        const province = readText(req.query.province);
        const regency = readText(req.query.regency);
        if (q.invalid || province.invalid || regency.invalid) {
            return res.status(400).json({ message: "Parameter pencarian atau filter tidak valid." });
        }

        const { event_id, status } = req.query;
        if (status !== undefined && status !== "" && !SEARCH_STATUSES.includes(status)) {
            return res.status(400).json({ message: "Status pencarian tidak valid." });
        }
        if (event_id !== undefined && event_id !== "" && !/^\d+$/.test(String(event_id))) {
            return res.status(400).json({ message: "Parameter event_id harus berupa angka." });
        }
        const { page, limit, offset } = paging(req.query, 12, 50);

        const { rows, total } = await model.findPublic(
            {
                q: q.value && escapeLike(q.value),
                province: province.value,
                regency: regency.value,
                eventId: event_id ? Number(event_id) : undefined,
                status: status || undefined,
            },
            limit,
            offset
        );

        res.json({
            data: rows.map(toPublic),
            meta: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) },
        });
    } catch (error) {
        serverError(res, error);
    }
};

exports.getFilters = async (req, res) => {
    try {
        res.json(await model.findFilterOptions());
    } catch (error) {
        serverError(res, error);
    }
};

exports.getById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const row = Number.isInteger(id) && id > 0 ? await model.findPublicById(id) : null;
        if (!row) return res.status(404).json({ message: "Laporan tidak ditemukan." });
        res.json({ data: toPublic(row) });
    } catch (error) {
        serverError(res, error);
    }
};

// ---------- Admin ----------
exports.adminGetAll = async (req, res) => {
    try {
        const { verification_status, search_status } = req.query;
        const q = readText(req.query.q);
        if (q.invalid) return res.status(400).json({ message: "Parameter q tidak valid." });
        if (verification_status && !VERIFICATIONS.includes(verification_status)) {
            return res.status(400).json({ message: "Status verifikasi tidak valid." });
        }
        if (search_status && !SEARCH_STATUSES.includes(search_status)) {
            return res.status(400).json({ message: "Status pencarian tidak valid." });
        }
        const { page, limit, offset } = paging(req.query, 20, 100);
        const { rows, total } = await model.findAdminList(
            { verificationStatus: verification_status, searchStatus: search_status, q: q.value && escapeLike(q.value) },
            limit,
            offset
        );
        res.json({
            data: rows,
            meta: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) },
        });
    } catch (error) {
        serverError(res, error);
    }
};

exports.adminVerifikasi = async (req, res) => {
    try {
        const { verification_status, rejection_reason, admin_note } = req.body || {};
        if (!["approved", "rejected"].includes(verification_status)) {
            return res.status(400).json({ message: "verification_status harus 'approved' atau 'rejected'." });
        }
        const alasan = String(rejection_reason || "").trim();
        if (verification_status === "rejected" && !alasan) {
            return res.status(400).json({ message: "Alasan penolakan wajib diisi." });
        }
        const ok = await model.updateVerification(
            Number(req.params.id),
            { status: verification_status, rejectionReason: alasan, adminNote: admin_note },
            req.user.id
        );
        if (!ok) return res.status(404).json({ message: "Laporan tidak ditemukan." });
        res.json({ message: "Status verifikasi diperbarui." });
    } catch (error) {
        serverError(res, error);
    }
};

exports.adminStatusPencarian = async (req, res) => {
    try {
        const { search_status, admin_note } = req.body || {};
        if (!SEARCH_STATUSES.includes(search_status)) {
            return res.status(400).json({ message: "search_status harus 'searching', 'found', atau 'closed'." });
        }
        const ok = await model.updateSearchStatus(Number(req.params.id), search_status, admin_note);
        if (!ok) return res.status(404).json({ message: "Laporan tidak ditemukan." });
        res.json({ message: "Status pencarian diperbarui." });
    } catch (error) {
        serverError(res, error);
    }
};
