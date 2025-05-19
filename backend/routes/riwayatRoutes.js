const express = require("express");
const router = express.Router();
const riwayatController = require("../controllers/riwayatController");

router.get("/antrian-dosen/:id", riwayatController.getLogRiwayatByDosenId);

module.exports = router;
