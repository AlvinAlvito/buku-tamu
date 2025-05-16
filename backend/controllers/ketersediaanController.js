const db = require("../db");

// Ambil data ketersediaan berdasarkan user_id, termasuk field link_maps
exports.getKetersediaanByUserId = async (req, res) => {
  const userId = req.params.id;

  try {
    const [rows] = await db.query(
      `SELECT *, link_maps FROM tb_ketersediaan WHERE user_id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan." });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

// UPDATE ketersediaan by ID termasuk field link_maps
exports.updateKetersediaan = (req, res) => {
  console.log("MASUK CONTROLLER UPDATE"); // 👈 log ini

  const { id } = req.params;
  const { lokasi_kampus, gedung_ruangan, jadwal_libur, status_ketersediaan, link_maps } = req.body;

  console.log("BODY:", req.body);
  console.log("PARAMS:", req.params);
  
  if (!lokasi_kampus || !gedung_ruangan || !jadwal_libur || status_ketersediaan === undefined) {
    return res.status(400).json({ error: "Semua field harus diisi." });
  }

  const query = `
    UPDATE tb_ketersediaan
    SET lokasi_kampus = ?, gedung_ruangan = ?, jadwal_libur = ?, status_ketersediaan = ?, link_maps = ?
    WHERE id = ?`;

  db.query(query, [lokasi_kampus, gedung_ruangan, jadwal_libur, status_ketersediaan, link_maps, id], (err, results) => {
    if (err) {
      console.error("Query error:", err); // 👈 log error
      return res.status(500).json({ error: "Gagal memperbarui data." });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Data tidak ditemukan." });
    }

    console.log("UPDATE BERHASIL"); // 👈 log sukses
    return res.json({ success: true });
  });
};


