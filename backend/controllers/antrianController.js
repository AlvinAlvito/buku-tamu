const db = require("../db"); 

exports.insertAntrian = async (req, res) => {
  try {
    const { mahasiswa_id, dosen_id, alasan } = req.body;

    if (!mahasiswa_id || !dosen_id || !alasan) {
      return res.status(400).json({ message: "Semua field wajib diisi." });
    }

    // Cek user roles
    const [users] = await db.execute(
      "SELECT id, role FROM users WHERE id IN (?, ?)",
      [mahasiswa_id, dosen_id]
    );

    if (users.length !== 2) {
      return res
        .status(400)
        .json({ message: "ID mahasiswa atau dosen tidak ditemukan." });
    }

    const roles = {};
    users.forEach((user) => {
      roles[user.id] = user.role;
    });

    if (roles[mahasiswa_id] !== "mahasiswa" || roles[dosen_id] !== "dosen") {
      return res
        .status(400)
        .json({ message: "Peran mahasiswa/dosen tidak valid." });
    }

    // Cek antrian aktif
    const [dupeResults] = await db.execute(
      `SELECT * FROM tb_antrian 
       WHERE mahasiswa_id = ? AND dosen_id = ? AND status IN ('menunggu', 'proses')`,
      [mahasiswa_id, dosen_id]
    );

    if (dupeResults.length > 0) {
      return res
        .status(409)
        .json({
          message: "Anda sudah memiliki antrian aktif dengan dosen ini.",
        });
    }

    // Insert antrian baru
    const [insertResult] = await db.execute(
      `INSERT INTO tb_antrian (mahasiswa_id, dosen_id, waktu_pendaftaran, alasan, status)
       VALUES (?, ?, NOW(), ?, 'menunggu')`,
      [mahasiswa_id, dosen_id, alasan]
    );

    return res.status(201).json({
      message: "Antrian berhasil diajukan.",
      data: {
        id: insertResult.insertId,
        mahasiswa_id,
        dosen_id,
        alasan,
        status: "menunggu",
        waktu_pendaftaran: new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
      },
    });
  } catch (error) {
    console.error("Error tidak terduga:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

// antrianController.js
exports.getAntrianDosenById = async (req, res) => {
  const dosenId = req.params.id; 

  try {
    const [rows] = await db.execute(
      `SELECT 
         a.*, 
         u.name AS mahasiswa_name, 
         u.foto_profil AS mahasiswa_foto, 
         u.role AS mahasiswa_role
       FROM tb_antrian a
       JOIN users u ON a.mahasiswa_id = u.id
       WHERE a.dosen_id = ?
       ORDER BY a.waktu_pendaftaran DESC`,
      [dosenId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data antrian', error });
  }
};


exports.updateStatusPemanggilan = async (req, res) => {
  const { antrianId } = req.params;

  try {
    const [result] = await db.execute(
      `UPDATE tb_antrian SET status = 'Proses' WHERE id = ?`,
      [antrianId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Data antrian tidak ditemukan' });
    }

    res.json({ message: 'Status berhasil diperbarui menjadi Proses' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui status', error });
  }
};
exports.updateStatusPemanggilanSelesai = async (req, res) => {
  const { antrianId } = req.params;

  try {
    const [result] = await db.execute(
      `UPDATE tb_antrian SET status = 'selesai' WHERE id = ?`,
      [antrianId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Data antrian tidak ditemukan' });
    }

    res.json({ message: 'Status berhasil diperbarui menjadi selesai' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui status', error });
  }
};