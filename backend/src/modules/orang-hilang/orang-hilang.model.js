const db = require("../../config/database");

// Tanggal diformat langsung di SQL agar tidak bergantung pada pengaturan zona waktu pool.
const SELECT_PUBLIC = `
  mp.id, mp.name, mp.age, mp.gender, mp.physical_description,
  mp.last_seen_location,
  DATE_FORMAT(mp.last_seen_at, '%Y-%m-%d %H:%i:%s') AS last_seen_at,
  mp.search_status, mp.public_contact_note, mp.public_consent,
  DATE_FORMAT(mp.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
  de.id AS event_id, de.title AS event_title,
  DATE_FORMAT(de.event_date, '%Y-%m-%d') AS event_date,
  de.province, de.regency, de.district, de.village,
  (SELECT d.file_path FROM missing_person_documents d
     WHERE d.missing_person_id = mp.id ORDER BY d.id ASC LIMIT 1) AS photo_path
`;

const FROM_PUBLIC = `
  FROM missing_persons mp
  LEFT JOIN disaster_events de ON de.id = mp.disaster_event_id
`;

function buildPublicWhere({ q, province, regency, eventId, status }) {
  // Hanya laporan yang sudah diverifikasi admin yang boleh tampil publik.
  const where = ["mp.verification_status = 'approved'"];
  const params = [];

  if (q) { where.push("mp.name LIKE ?"); params.push(`%${q}%`); }
  if (province) { where.push("de.province = ?"); params.push(province); }
  if (regency) { where.push("de.regency = ?"); params.push(regency); }
  if (eventId) { where.push("mp.disaster_event_id = ?"); params.push(eventId); }
  if (status) { where.push("mp.search_status = ?"); params.push(status); }

  return { sql: `WHERE ${where.join(" AND ")}`, params };
}

exports.findPublic = async (filter, limit, offset) => {
  const { sql, params } = buildPublicWhere(filter);

  const [[{ total }]] = await db.query(`SELECT COUNT(*) AS total ${FROM_PUBLIC} ${sql}`, params);
  const [rows] = await db.query(
    `SELECT ${SELECT_PUBLIC} ${FROM_PUBLIC} ${sql}
     ORDER BY FIELD(mp.search_status, 'searching', 'found', 'closed'), mp.updated_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  return { rows, total };
};

exports.findPublicById = async (id) => {
  const [rows] = await db.query(
    `SELECT ${SELECT_PUBLIC} ${FROM_PUBLIC}
     WHERE mp.id = ? AND mp.verification_status = 'approved' LIMIT 1`,
    [id]
  );
  return rows[0] || null;
};

// ---------- Opsi filter (provinsi, kabupaten, kejadian, status saling sinkron) ----------

const SEARCH_STATUSES = [
  { nilai: "searching", label: "Sedang dicari" },
  { nilai: "found", label: "Ditemukan" },
  { nilai: "closed", label: "Pencarian ditutup" },
];

const clean = (v) => {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
};

const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

// Label dropdown yang membedakan satu kejadian dari yang lain,
// misalnya "Tanah Longsor — Kab. Banjarnegara, 15 Nov 2025 (7 laporan)".
function buatLabel(k) {
  const [y, m, d] = String(k.tanggal).split("-");
  const tgl = `${Number(d)} ${BULAN[Number(m) - 1]} ${y}`;
  const wilayah = String(k.kabupaten || "").replace(/^Kabupaten /, "Kab. ");
  return `${k.judul} — ${wilayah}, ${tgl} (${k.jumlah_laporan} laporan)`;
}

/**
 * Merapikan pilihan pengguna supaya tidak saling bertentangan.
 * - Jika kejadian dipilih, provinsi & kabupaten ikut kejadian itu.
 * - Jika kabupaten tidak ada di provinsi terpilih, kabupaten dibuang.
 * - Nilai yang tidak dikenal dibuang.
 */
async function normalizeSelection({ province, regency, eventId, status }) {
  let prov = clean(province);
  let reg = clean(regency);
  let evId = clean(eventId) ? Number.parseInt(eventId, 10) : null;
  if (Number.isNaN(evId)) evId = null;
  const st = SEARCH_STATUSES.some((s) => s.nilai === clean(status)) ? clean(status) : null;

  if (evId) {
    const [rows] = await db.query(
      `SELECT province, regency FROM disaster_events
       WHERE id = ? AND verification_status = 'verified' LIMIT 1`,
      [evId]
    );
    if (rows[0]) {
      prov = rows[0].province;
      reg = rows[0].regency;
    } else {
      evId = null;
    }
  }

  if (!evId) {
    if (reg && !prov) {
      const [rows] = await db.query(
        `SELECT province FROM disaster_events
         WHERE verification_status = 'verified' AND regency = ? LIMIT 1`,
        [reg]
      );
      if (rows[0]) prov = rows[0].province;
      else reg = null;
    }
    if (prov) {
      const [rows] = await db.query(
        `SELECT 1 FROM disaster_events
         WHERE verification_status = 'verified' AND province = ? LIMIT 1`,
        [prov]
      );
      if (!rows[0]) { prov = null; reg = null; }
    }
    if (prov && reg) {
      const [rows] = await db.query(
        `SELECT 1 FROM disaster_events
         WHERE verification_status = 'verified' AND province = ? AND regency = ? LIMIT 1`,
        [prov, reg]
      );
      if (!rows[0]) reg = null;
    }
  }

  return { province: prov, regency: reg, eventId: evId, status: st };
}

/**
 * filter: { province, regency, eventId, status, hanyaLaporan }
 * Provinsi & kabupaten selalu dari semua kejadian terverifikasi (kecuali hanyaLaporan=1).
 * Kejadian: default hanya yang punya laporan orang hilang; semuaKejadian=1 menampilkan semuanya.
 * Tiap kejadian membawa `label` (judul + kabupaten + tanggal + jumlah laporan) untuk teks dropdown.
 */
exports.findFilterOptions = async (filter = {}) => {
  const sel = await normalizeSelection(filter);
  const onlyReports = ["1", "true", true].includes(filter.hanyaLaporan);
  // Dropdown kejadian: secara default hanya kejadian yang punya laporan orang hilang.
  // Kirim semuaKejadian=1 untuk menampilkan semua kejadian terverifikasi.
  const semuaKejadian = ["1", "true", true].includes(filter.semuaKejadian);

  const statusJoin = sel.status ? " AND mp.search_status = ?" : "";
  const statusParams = sel.status ? [sel.status] : [];

  // Syarat "punya laporan" untuk daftar provinsi & kabupaten.
  const hasReport = onlyReports
    ? ` AND EXISTS (SELECT 1 FROM missing_persons x
                    WHERE x.disaster_event_id = de.id AND x.verification_status = 'approved'
                    ${sel.status ? "AND x.search_status = ?" : ""})`
    : "";
  const hasReportParams = onlyReports ? statusParams : [];

  // 1) Provinsi: selalu dari semua kejadian terverifikasi.
  const [provinsiRows] = await db.query(
    `SELECT DISTINCT de.province AS provinsi FROM disaster_events de
     WHERE de.verification_status = 'verified' AND de.province IS NOT NULL AND de.province <> ''
     ${hasReport}
     ORDER BY de.province`,
    hasReportParams
  );

  // 2) Kabupaten: hanya terisi setelah provinsi dipilih.
  let kabupaten = [];
  if (sel.province) {
    const [rows] = await db.query(
      `SELECT DISTINCT de.regency AS kabupaten FROM disaster_events de
       WHERE de.verification_status = 'verified' AND de.province = ?
         AND de.regency IS NOT NULL AND de.regency <> ''
       ${hasReport}
       ORDER BY de.regency`,
      [sel.province, ...hasReportParams]
    );
    kabupaten = rows.map((r) => r.kabupaten);
  }

  // 3) Kejadian: ikut provinsi & kabupaten terpilih, jumlah laporan ikut status terpilih.
  const evWhere = ["de.verification_status = 'verified'"];
  const evParams = [...statusParams];
  if (sel.province) { evWhere.push("de.province = ?"); evParams.push(sel.province); }
  if (sel.regency) { evWhere.push("de.regency = ?"); evParams.push(sel.regency); }

  const [kejadianRows] = await db.query(
    `SELECT de.id, de.title AS judul, de.regency AS kabupaten, de.province AS provinsi,
            DATE_FORMAT(de.event_date, '%Y-%m-%d') AS tanggal,
            COUNT(mp.id) AS jumlah_laporan
     FROM disaster_events de
     LEFT JOIN missing_persons mp
            ON mp.disaster_event_id = de.id AND mp.verification_status = 'approved'${statusJoin}
     WHERE ${evWhere.join(" AND ")}
     GROUP BY de.id, de.title, de.regency, de.province, de.event_date
     ${onlyReports || !semuaKejadian ? "HAVING COUNT(mp.id) > 0" : ""}
     ORDER BY de.event_date DESC, de.id DESC
     LIMIT 500`,
    evParams
  );

  // 4) Status: jumlahnya ikut provinsi, kabupaten, dan kejadian terpilih.
  const stWhere = ["mp.verification_status = 'approved'"];
  const stParams = [];
  if (sel.province) { stWhere.push("de.province = ?"); stParams.push(sel.province); }
  if (sel.regency) { stWhere.push("de.regency = ?"); stParams.push(sel.regency); }
  if (sel.eventId) { stWhere.push("mp.disaster_event_id = ?"); stParams.push(sel.eventId); }

  const [statusRows] = await db.query(
    `SELECT mp.search_status AS nilai, COUNT(*) AS jumlah ${FROM_PUBLIC}
     WHERE ${stWhere.join(" AND ")}
     GROUP BY mp.search_status`,
    stParams
  );
  const statusCount = Object.fromEntries(statusRows.map((r) => [r.nilai, Number(r.jumlah)]));

  return {
    provinsi: provinsiRows.map((p) => p.provinsi),
    kabupaten,
    kejadian: kejadianRows.map((k) => {
      const item = { ...k, jumlah_laporan: Number(k.jumlah_laporan) };
      return { ...item, label: buatLabel(item) };
    }),
    status: SEARCH_STATUSES.map((s) => ({ ...s, jumlah: statusCount[s.nilai] || 0 })),
    // Pilihan yang sudah dirapikan; frontend sebaiknya menyetel dropdown sesuai nilai ini.
    terpilih: sel,
  };
};

// ---------- Admin ----------
exports.findAdminList = async ({ verificationStatus, searchStatus, q }, limit, offset) => {
  const where = ["1=1"];
  const params = [];
  if (verificationStatus) { where.push("mp.verification_status = ?"); params.push(verificationStatus); }
  if (searchStatus) { where.push("mp.search_status = ?"); params.push(searchStatus); }
  if (q) { where.push("mp.name LIKE ?"); params.push(`%${q}%`); }
  const sql = `WHERE ${where.join(" AND ")}`;

  const [[{ total }]] = await db.query(`SELECT COUNT(*) AS total FROM missing_persons mp ${sql}`, params);
  const [rows] = await db.query(
    `SELECT mp.*, de.title AS event_title
     FROM missing_persons mp
     LEFT JOIN disaster_events de ON de.id = mp.disaster_event_id
     ${sql}
     ORDER BY mp.created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  return { rows, total };
};

exports.updateVerification = async (id, { status, rejectionReason, adminNote }, adminId) => {
  const [result] = await db.query(
    `UPDATE missing_persons
     SET verification_status = ?, rejection_reason = ?, admin_note = COALESCE(?, admin_note),
         reviewed_by = ?, reviewed_at = NOW()
     WHERE id = ?`,
    [status, status === "rejected" ? rejectionReason : null, adminNote ?? null, adminId, id]
  );
  return result.affectedRows > 0;
};

exports.updateSearchStatus = async (id, status, adminNote) => {
  const [result] = await db.query(
    `UPDATE missing_persons SET search_status = ?, admin_note = COALESCE(?, admin_note) WHERE id = ?`,
    [status, adminNote ?? null, id]
  );
  return result.affectedRows > 0;
};