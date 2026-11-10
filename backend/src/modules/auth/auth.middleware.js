const jwt = require("jsonwebtoken");

exports.requireAdmin = (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Silakan login sebagai admin." });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (payload.role !== "admin") throw new Error("bukan admin");
        req.user = payload;
        next();
    } catch (error) {
        res.status(401).json({ message: "Sesi tidak valid atau sudah berakhir. Silakan login ulang." });
    }
};
