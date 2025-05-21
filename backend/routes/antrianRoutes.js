const express = require("express");
const router = express.Router();
const antrianController = require("../controllers/antrianController");


router.post("/tambah-antrian", antrianController.insertAntrian);
router.get("/antrian-dosen/:id", antrianController.getAntrianDosenById);
router.put("/update-status-pemanggilan/:antrianId", antrianController.updateStatusPemanggilan);
router.put("/update-status-pemanggilan-selesai/:antrianId", antrianController.updateStatusPemanggilanSelesai);
router.put("/update-status-pemanggilan-batalkan/:antrianId", antrianController.updateStatusBatalkanAntrian);
router.put('/antrian/:antrianId/panggil', antrianController.panggilMahasiswa);

module.exports = router;
