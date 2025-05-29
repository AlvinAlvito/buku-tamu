const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/admin/prodi", adminController.getAllProdi);
router.get("/admin/prodi/:namaProdi/users", adminController.getUsersByProdi);
router.get("/admin/prodi/:namaProdi/riwayat", adminController.getRiwayatByProdi);

module.exports = router;
