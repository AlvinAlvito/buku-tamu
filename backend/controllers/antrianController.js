const db = require('../db'); // Pastikan ini export dari mysql2/promise

exports.insertAntrian = async (req, res) => {
  try {
    const { mahasiswa_id, dosen_id, alasan } = req.body;

    if (!mahasiswa_id || !dosen_id || !alasan) {
      return res.status(400).json({ message: 'Semua field wajib diisi.' });
    }

    // Cek user roles
    const [users] = await db.execute(
      'SELECT id, role FROM users WHERE id IN (?, ?)',
      [mahasiswa_id, dosen_id]
    );

    if (users.length !== 2) {
      return res.status(400).json({ message: 'ID mahasiswa atau dosen tidak ditemukan.' });
    }

    const roles = {};
    users.forEach(user => {
      roles[user.id] = user.role;
    });

    if (roles[mahasiswa_id] !== 'mahasiswa' || roles[dosen_id] !== 'dosen') {
      return res.status(400).json({ message: 'Peran mahasiswa/dosen tidak valid.' });
    }

    // Cek antrian aktif
    const [dupeResults] = await db.execute(
      `SELECT * FROM tb_antrian 
       WHERE mahasiswa_id = ? AND dosen_id = ? AND status IN ('menunggu', 'proses')`,
      [mahasiswa_id, dosen_id]
    );

    if (dupeResults.length > 0) {
      return res.status(409).json({ message: 'Anda sudah memiliki antrian aktif dengan dosen ini.' });
    }

    // Insert antrian baru
    const [insertResult] = await db.execute(
      `INSERT INTO tb_antrian (mahasiswa_id, dosen_id, waktu_pendaftaran, alasan, status)
       VALUES (?, ?, NOW(), ?, 'menunggu')`,
      [mahasiswa_id, dosen_id, alasan]
    );

    return res.status(201).json({
      message: 'Antrian berhasil diajukan.',
      data: {
        id: insertResult.insertId,
        mahasiswa_id,
        dosen_id,
        alasan,
        status: 'menunggu',
        waktu_pendaftaran: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }
    });

  } catch (error) {
    console.error('Error tidak terduga:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};
