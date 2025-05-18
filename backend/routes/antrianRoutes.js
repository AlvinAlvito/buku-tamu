const express = require("express");
const router = express.Router();
const antrianController = require("../controllers/antrianController");

router.post("/tambah-antrian", antrianController.insertAntrian);
router.get("/antrian-dosen/:id", antrianController.getAntrianDosenById);

module.exports = router;
