const express = require("express");
const router = express.Router();
const riwayatController = require("../controllers/riwayatController");

router.get("/riwayat", riwayatController.getLogRiwayatByUser);

module.exports = router;
