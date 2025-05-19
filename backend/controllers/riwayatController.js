const db = require("../db"); 

exports.getLogRiwayatByDosenId = async (req, res) => {
  const dosenId = req.params.id; 

  try {
    const [rows] = await db.execute(
      `SELECT 
         l.*, 
         m.name AS mahasiswa_name, 
         m.email AS mahasiswa_email,
         m.role AS mahasiswa_role,
         d.name AS dosen_name,
         d.email AS dosen_email
       FROM tb_log_riwayat l
       JOIN users m ON l.mahasiswa_id = m.id
       JOIN users d ON l.dosen_id = d.id
       WHERE l.dosen_id = ?
       ORDER BY l.waktu_pendaftaran DESC`,
      [dosenId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error getLogRiwayatByDosenId:", error);
    res.status(500).json({ message: 'Gagal mengambil data log riwayat', error: error.message });
  }
};