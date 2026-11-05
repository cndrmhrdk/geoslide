const express = require("express");
const kejadianController = require("./kejadian.controller");

const router = express.Router();

router.get("/", kejadianController.listEvents);

module.exports = router;
