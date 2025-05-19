const express = require("express");
const router = express.Router();
const antrianController = require("../controllers/antrianController");

router.post("/tambah-antrian", antrianController.insertAntrian);
router.get("/antrian-dosen/:id", antrianController.getAntrianDosenById);
router.put("/update-status-pemanggilan/:antrianId", antrianController.updateStatusPemanggilan);
router.put("/update-status-pemanggilan-selesai/:antrianId", antrianController.updateStatusPemanggilanSelesai);

module.exports = router;
