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
         u.foto_profil,    
         k.lokasi_kampus, 
         k.gedung_ruangan, 
         k.link_maps, 
         k.jadwal_libur, 
         k.status_ketersediaan, 
         k.waktu_mulai,
         k.waktu_selesai,
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

// Misal dalam route update dosen
exports.updateAllDaftarDosen = async (req, res) => {
  const { id, status } = req.body;
  try {
    await db.query("UPDATE tb_ketersediaan SET status_ketersediaan = ? WHERE id = ?", [status, id]);

    // Dapatkan data terbaru setelah update
    const [rows] = await db.query(`
      SELECT k.id, k.user_id, u.name, u.nim, u.foto_profil,
             k.lokasi_kampus, k.gedung_ruangan, k.link_maps,
             k.jadwal_libur, k.status_ketersediaan,
             k.waktu_mulai, k.waktu_selesai
      FROM tb_ketersediaan k
      JOIN users u ON k.user_id = u.id
    `);

    // Emit ke semua client
    console.log(`Emit updateDaftarDosen dengan ${rows.length} data`);  // Tambah log ini

    res.json({ message: "Status berhasil diubah." });
  } catch (error) {
    console.error("Error update status dosen:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat mengupdate." });
  }
};

exports.getDaftarDosenById = async (req, res) => {
  const dosenId = req.params.id;

  try {
    const [rows] = await db.query(
      `SELECT 
         k.id, 
         k.user_id, 
         u.name, 
         u.nim,
         u.email,
         u.role,
         u.facebook,
         u.twitter,
         u.linkedin,
         u.instagram,
         u.whatsapp,
         u.bio,
         u.foto_profil,     
         k.lokasi_kampus, 
         k.gedung_ruangan, 
         k.link_maps, 
         k.jadwal_libur, 
         k.status_ketersediaan,
         k.waktu_mulai,
         k.waktu_selesai,
         k.created_at, 
         k.updated_at
       FROM tb_ketersediaan k
       JOIN users u ON k.user_id = u.id
       WHERE k.id = ?`,
      [dosenId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Dosen tidak ditemukan." });
    }

    res.json(rows[0]); 
  } catch (error) {
    console.error("Error getDaftarDosenById:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};
