const db = require("../../config/database");

async function getEvents({ year, search, province, regency, limit }) {
    const conditions = [
        "verification_status = 'verified'",
        "latitude BETWEEN -90 AND 90",
        "longitude BETWEEN -180 AND 180"
    ];
    const values = [];

    if (year !== "all") {
        conditions.push("event_date >= ? AND event_date < ?");
        values.push(`${year}-01-01`, `${Number(year) + 1}-01-01`);
    }

    if (search) {
        conditions.push("(title LIKE ? OR province LIKE ? OR regency LIKE ? OR district LIKE ?)");
        const searchTerm = `%${search}%`;
        values.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    if (province) {
        conditions.push("province LIKE ?");
        values.push(`%${province}%`);
    }
    if (regency) {
        conditions.push("regency LIKE ?");
        values.push(`%${regency}%`);
    }

    values.push(limit + 1);
    const [rows] = await db.execute(
        `SELECT id, title, event_date, province, regency, district, village,
                latitude, longitude, description, deaths, missing, injured,
                displaced, houses_damaged, source_note
         FROM disaster_events
         WHERE ${conditions.join(" AND ")}
         ORDER BY event_date DESC, id DESC
         LIMIT ?`,
        values
    );
    const [yearRows] = await db.execute(
        `SELECT DISTINCT YEAR(event_date) AS year
         FROM disaster_events
         WHERE verification_status = 'verified'
           AND latitude BETWEEN -90 AND 90
           AND longitude BETWEEN -180 AND 180
         ORDER BY year DESC`
    );

    const hasMore = rows.length > limit;
    const events = rows.slice(0, limit).map((event) => ({
        ...event,
        latitude: Number(event.latitude),
        longitude: Number(event.longitude)
    }));

    return {
        events,
        hasMore,
        availableYears: yearRows.map((row) => Number(row.year))
    };
}

module.exports = { getEvents };
