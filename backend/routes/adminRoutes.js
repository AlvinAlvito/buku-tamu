const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/admin/prodi", adminController.getAllProdi);
router.get("/admin/prodi/:namaProdi/users", adminController.getUsersByProdi);
router.get("/admin/prodi/:namaProdi/riwayat", adminController.getRiwayatByProdi);
router.get("/admin/prodi/profil/dosen", adminController.getProfilDosen);
router.get("/admin/prodi/profil/mahasiswa", adminController.getProfilMahasiswa);
router.get("/admin/prodi/:namaProdi/grafik-tujuan", adminController.getGrafikTujuanByProdi);



module.exports = router;
