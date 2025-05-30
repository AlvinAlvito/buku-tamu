const db = require("../db");

exports.getLogRiwayatByUser = async (req, res) => {
  const { id, role } = req.query;

  if (!id || !role) {
    return res
      .status(400)
      .json({ message: "Parameter id dan role harus diisi" });
  }

  let whereClause = "";
  if (role === "dosen") {
    whereClause = "lr.dosen_id = ?";
  } else if (role === "mahasiswa") {
    whereClause = "lr.mahasiswa_id = ?";
  } else {
    return res
      .status(400)
      .json({ message: "Role tidak valid, harus 'dosen' atau 'mahasiswa'" });
  }

  try {
    const [rows] = await db.execute(
      `
      SELECT 
        lr.id,
        lr.antrian_id,
        lr.mahasiswa_id,
        mhs.name AS nama_mahasiswa,
        mhs.nim AS nim_mahasiswa,
        mhs.foto_profil AS foto_mahasiswa,
        mhs.prodi AS prodi_mahasiswa,
        mhs.stambuk AS stambuk_mahasiswa,
        
        lr.dosen_id,
        dsn.name AS nama_dosen,
        dsn.nim AS nim_dosen,
        dsn.foto_profil AS foto_dosen,

        lr.waktu_selesai,
        lr.status,
        lr.created_at,
        a.alasan,
        a.tujuan,
        a.waktu_pendaftaran
      FROM tb_log_riwayat lr
      LEFT JOIN users mhs ON lr.mahasiswa_id = mhs.id
      LEFT JOIN users dsn ON lr.dosen_id = dsn.id
      LEFT JOIN tb_antrian a ON lr.antrian_id = a.id
      WHERE ${whereClause}
      ORDER BY lr.created_at DESC

      `,
          [id]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error getLogRiwayatByUser:", error);
    res.status(500).json({
      message: "Gagal mengambil data log riwayat",
      error: error.message,
    });
  }
};
