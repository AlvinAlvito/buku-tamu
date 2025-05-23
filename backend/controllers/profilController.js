const db = require("../db");

// Get profil user berdasarkan user id
exports.getProfilByUserId = async (req, res) => {
  const userId = req.params.id;

  try {
    const [rows] = await db.query(
      `SELECT name, nim, email, role, facebook, twitter, linkedin, instagram, whatsapp, bio FROM users WHERE id = ?`,
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

// Update profil user berdasarkan user id
exports.updateProfil = (req, res) => {
  console.log("MASUK CONTROLLER UPDATE");

  const { id } = req.params;
  // Extract hanya kolom yang boleh diupdate
  const { facebook, twitter, linkedin, instagram, whatsapp, bio } = req.body;

  // Tidak wajib semua kolom harus ada, karena "tidak ada isinya pun tidak masalah"
  // Jadi validasi bisa dilewati

  const query = `
    UPDATE users
    SET facebook = ?, twitter = ?, linkedin = ?, instagram = ?, whatsapp = ?, bio = ?
    WHERE id = ?`;

  db.query(
    query,
    [
      facebook || null,
      twitter || null,
      linkedin || null,
      instagram || null,
      whatsapp || null,
      bio || null,
      id,
    ],
    (err, results) => {
      if (err) {
        console.error("Query error:", err);
        return res.status(500).json({ error: "Gagal memperbarui data." });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Data tidak ditemukan." });
      }

      console.log("UPDATE BERHASIL");
      return res.json({ success: true });
    }
  );
};

exports.getAllUser = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT name, nim, foto_profil, role, prodi, stambuk, created_at FROM users`
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Belum ada data pengguna." });
    }

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};
