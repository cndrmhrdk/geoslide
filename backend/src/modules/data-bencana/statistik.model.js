const db = require("../../config/database");

function periodWhere(year, field = "event_date") {
    if (year === "all") return { sql: "", values: [] };
    return {
        sql: ` AND ${field} >= ? AND ${field} < ?`,
        values: [`${year}-01-01`, `${Number(year) + 1}-01-01`]
    };
}

async function getStatistics(year) {
    const period = periodWhere(year);
    const [eventRows] = await db.execute(
        `SELECT COUNT(*) AS event_count,
                COUNT(DISTINCT CONCAT(province, '|', regency)) AS affected_regions,
                COALESCE(SUM(deaths), 0) AS deaths,
                COALESCE(SUM(missing), 0) AS missing_from_events,
                COALESCE(SUM(injured), 0) AS injured,
                COALESCE(SUM(displaced), 0) AS displaced,
                COALESCE(SUM(houses_damaged), 0) AS houses_damaged
         FROM disaster_events
         WHERE verification_status = 'verified'${period.sql}`,
        period.values
    );

    const [monthlyRows] = await db.execute(
        `SELECT MONTH(event_date) AS month, COUNT(*) AS event_count
         FROM disaster_events
         WHERE verification_status = 'verified'${period.sql}
         GROUP BY MONTH(event_date)
         ORDER BY month`,
        period.values
    );

    const [regionRows] = await db.execute(
        `SELECT province, regency, COUNT(*) AS event_count
         FROM disaster_events
         WHERE verification_status = 'verified'${period.sql}
         GROUP BY province, regency
         ORDER BY event_count DESC, province, regency
         LIMIT 10`,
        period.values
    );

    const [missingRows] = await db.execute(
        `SELECT COUNT(*) AS approved_reports,
                COALESCE(SUM(search_status = 'searching'), 0) AS searching,
                COALESCE(SUM(search_status = 'found'), 0) AS found
         FROM missing_persons
         WHERE verification_status = 'approved'`
    );

    const [yearRows] = await db.execute(
        `SELECT DISTINCT YEAR(event_date) AS year
         FROM disaster_events
         WHERE verification_status = 'verified'
         ORDER BY year DESC`
    );

    const eventTotals = eventRows[0];
    const missingTotals = missingRows[0];
    const monthlyByMonth = new Map(monthlyRows.map((row) => [Number(row.month), Number(row.event_count)]));

    return {
        period: year,
        events: {
            total: Number(eventTotals.event_count),
            affectedRegions: Number(eventTotals.affected_regions),
            deaths: Number(eventTotals.deaths),
            missing: Number(eventTotals.missing_from_events),
            injured: Number(eventTotals.injured),
            displaced: Number(eventTotals.displaced),
            housesDamaged: Number(eventTotals.houses_damaged)
        },
        missingPersons: {
            approvedReports: Number(missingTotals.approved_reports),
            searching: Number(missingTotals.searching),
            found: Number(missingTotals.found),
            period: "all"
        },
        monthlyEvents: Array.from({ length: 12 }, (_, index) => ({
            month: index + 1,
            total: monthlyByMonth.get(index + 1) || 0
        })),
        topRegions: regionRows.map((row) => ({
            province: row.province,
            regency: row.regency,
            total: Number(row.event_count)
        })),
        availableYears: yearRows.map((row) => Number(row.year))
    };
}

module.exports = { getStatistics };
