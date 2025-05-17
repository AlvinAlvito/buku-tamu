const express = require("express");
const router = express.Router();
const daftarDosenController = require("../controllers/daftarDosenController");

router.get("/daftar-dosen", daftarDosenController.getAllDaftarDosen);
router.get("/daftar-dosen/:id", daftarDosenController.getDaftarDosenById);
router.put('/daftar-dosen/update-status', daftarDosenController.updateAllDaftarDosen);

module.exports = router;
