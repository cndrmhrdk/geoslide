const express = require("express");
const statistikController = require("./statistik.controller");

const router = express.Router();

router.get("/", statistikController.getStatistics);

module.exports = router;
