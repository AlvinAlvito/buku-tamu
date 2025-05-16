const db = require("../db"); // pastikan koneksi db sudah disiapkan dengan mysql2/promise

// GET ketersediaan by user_id
exports.getAllDaftarDosen = async (req, res) => {
  const userId = req.params.userId;

  try {
  const [rows] = await db.query(
  `SELECT 
     k.id, 
     k.user_id, 
     u.name, 
     u.nim,     
     u.foto_profil,     -- Tambahkan ini
     k.lokasi_kampus, 
     k.gedung_ruangan, 
     k.link_maps, 
     k.jadwal_libur, 
     k.status_ketersediaan, 
     k.created_at, 
     k.updated_at
   FROM tb_ketersediaan k
   JOIN users u ON k.user_id = u.id`
);


    if (rows.length === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan." });
    }

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};
