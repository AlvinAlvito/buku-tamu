const db = require('../db');

// GET ketersediaan by user ID
// GET ketersediaan by user ID
exports.getKetersediaanByUserId = async (req, res) => {
  const userId = req.params.id;

  try {
    const [rows] = await db.query(
      `SELECT * FROM tb_ketersediaan WHERE user_id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan.' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};




// UPDATE ketersediaan by ID
exports.updateKetersediaan = (req, res) => {
  const { id } = req.params;
  const { lokasi_kampus, gedung_ruangan, jadwal_libur, status_ketersediaan } = req.body;

  // Validasi input
  if (!lokasi_kampus || !gedung_ruangan || !jadwal_libur || status_ketersediaan === undefined) {
    return res.status(400).json({ error: "Semua field harus diisi." });
  }

  const query = `
    UPDATE tb_ketersediaan
    SET lokasi_kampus = ?, gedung_ruangan = ?, jadwal_libur = ?, status_ketersediaan = ?
    WHERE id = ?`;

  db.query(query, [lokasi_kampus, gedung_ruangan, jadwal_libur, status_ketersediaan, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Gagal memperbarui data." });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Data tidak ditemukan." });
    }
    return res.json({ success: true });
  });
};
