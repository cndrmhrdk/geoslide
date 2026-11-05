const express = require("express");
const kejadianRoutes = require("./kejadian.routes");
const statistikRoutes = require("./statistik.routes");

const router = express.Router();

router.use("/kejadian", kejadianRoutes);
router.use("/statistik", statistikRoutes);

module.exports = router;
