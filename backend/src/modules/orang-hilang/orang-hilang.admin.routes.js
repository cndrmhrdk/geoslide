const express = require("express");
const controller = require("./orang-hilang.controller");
const { requireAdmin } = require("../auth/auth.middleware");

const router = express.Router();
router.use(requireAdmin);

router.get("/", controller.adminGetAll);
router.patch("/:id/verification", controller.adminVerifikasi);
router.patch("/:id/search-status", controller.adminStatusPencarian);

module.exports = router;
