const express = require("express");
const controller = require("./orang-hilang.controller");

const router = express.Router();

// Penting: "/filters" harus sebelum "/:id"
router.get("/", controller.getAll);
router.get("/filters", controller.getFilters);
router.get("/:id", controller.getById);

module.exports = router;
