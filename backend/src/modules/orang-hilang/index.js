const express = require("express");
const adminRoutes = require("./orang-hilang.admin.routes");
const publicRoutes = require("./orang-hilang.routes");

const router = express.Router();

// Admin dipasang lebih dulu supaya "/admin" tidak dianggap sebagai ":id"
router.use("/admin", adminRoutes);
router.use("/", publicRoutes);

module.exports = router;
