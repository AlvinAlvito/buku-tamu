const express = require("express");
const router = express.Router();
const daftarDosenController = require("../controllers/daftarDosenController");

router.get("/daftar-dosen", daftarDosenController.getAllDaftarDosen);

module.exports = router;
