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

exports.findFilterOptions = async () => {
  const [provinsi] = await db.query(
    `SELECT DISTINCT de.province AS provinsi ${FROM_PUBLIC}
     WHERE mp.verification_status = 'approved' AND de.province IS NOT NULL
     ORDER BY de.province`
  );
  const [kejadian] = await db.query(
    `SELECT DISTINCT de.id, de.title AS judul, DATE_FORMAT(de.event_date, '%Y-%m-%d') AS tanggal ${FROM_PUBLIC}
     WHERE mp.verification_status = 'approved' AND de.id IS NOT NULL
     ORDER BY tanggal DESC`
  );
  return { provinsi: provinsi.map((p) => p.provinsi), kejadian };
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
