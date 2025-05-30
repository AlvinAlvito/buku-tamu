const db = require("../db");

exports.getAllProdi = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        fakultas,
        prodi,
        SUM(CASE WHEN role = 'mahasiswa' THEN 1 ELSE 0 END) AS jumlah_mahasiswa,
        SUM(CASE WHEN role = 'dosen' THEN 1 ELSE 0 END) AS jumlah_dosen
      FROM users
      WHERE prodi IS NOT NULL AND fakultas IS NOT NULL
      GROUP BY fakultas, prodi
      ORDER BY fakultas, prodi
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error getProdiSummary:", error);
    res.status(500).json({
      message: "Gagal mengambil data prodi",
      error: error.message,
    });
  }
};

exports.getUsersByProdi = async (req, res) => {
  const { namaProdi } = req.params;

  if (!namaProdi) {
    return res.status(400).json({ message: "Parameter namaProdi harus diisi" });
  }

  try {
    const [rows] = await db.execute(
      `
      SELECT 
        u.id,
        u.name,
        u.nim,
        u.foto_profil,
        u.role,
        u.prodi,
        u.fakultas,
        u.stambuk,

        -- Jumlah antrian sedang berlangsung (user sebagai mahasiswa atau dosen)
        (
          SELECT COUNT(*) 
          FROM tb_antrian a 
          WHERE (a.mahasiswa_id = u.id OR a.dosen_id = u.id)
          AND a.status IN ('menunggu', 'proses')
        ) AS jumlah_antrian_berlangsung,

        -- Jumlah antrian selesai (user sebagai mahasiswa atau dosen)
        (
          SELECT COUNT(*) 
          FROM tb_antrian a 
          WHERE (a.mahasiswa_id = u.id OR a.dosen_id = u.id)
          AND a.status = 'selesai'
        ) AS jumlah_antrian_selesai

      FROM users u
      WHERE u.prodi = ?
      ORDER BY u.name ASC
      `,
      [namaProdi]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error getUsersByProdi:", error);
    res.status(500).json({
      message: "Gagal mengambil data pengguna berdasarkan prodi",
      error: error.message,
    });
  }
};

exports.getRiwayatByProdi = async (req, res) => {
  const { namaProdi } = req.params;

  if (!namaProdi) {
    return res.status(400).json({ message: "Parameter namaProdi wajib diisi" });
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
        dsn.prodi AS prodi_dosen,

        lr.waktu_selesai,
        lr.status,
        lr.created_at,
        a.alasan,
        a.waktu_pendaftaran
      FROM tb_log_riwayat lr
      LEFT JOIN users mhs ON lr.mahasiswa_id = mhs.id
      LEFT JOIN users dsn ON lr.dosen_id = dsn.id
      LEFT JOIN tb_antrian a ON lr.antrian_id = a.id
      WHERE mhs.prodi = ? OR dsn.prodi = ?
      ORDER BY lr.created_at DESC
      `,
      [namaProdi, namaProdi]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error getRiwayatByProdi:", error);
    res.status(500).json({
      message: "Gagal mengambil data riwayat berdasarkan prodi",
      error: error.message,
    });
  }
};

exports.getProfilDosen = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Parameter id harus diisi" });
  }

  try {
    // Ambil data profil dosen + ketersediaan
    const [[profil]] = await db.execute(
      `
  SELECT 
    u.id,
    u.name,
    u.nim,
    u.foto_profil,
    u.role,
    u.prodi,
    u.fakultas,
    u.email,
    u.whatsapp,
    u.bio,

    k.lokasi_kampus,
    k.gedung_ruangan,
    k.link_maps,
    k.jadwal_libur,
    k.status_ketersediaan,
    k.waktu_mulai,
    k.waktu_selesai

  FROM users u
  LEFT JOIN tb_ketersediaan k ON u.id = k.user_id
  WHERE u.id = ? AND u.role = 'dosen'
  `,
      [id]
    );
    if (!profil) {
      return res.status(404).json({ message: "Dosen tidak ditemukan" });
    }

    // Ambil seluruh antrian dosen ini
    const [antrian] = await db.execute(
      `
  SELECT 
    m.name AS nama_mahasiswa,
    m.nim AS nim_mahasiswa,
    m.foto_profil AS foto_mahasiswa,
    m.prodi AS prodi_mahasiswa,
    m.stambuk AS stambuk_mahasiswa,

    d.name AS nama_dosen,
    d.nim AS nim_dosen,
    d.foto_profil AS foto_dosen,

    a.status,
    a.alasan,
    a.waktu_pendaftaran

  FROM tb_antrian a
  JOIN users m ON a.mahasiswa_id = m.id
  JOIN users d ON a.dosen_id = d.id
  WHERE a.dosen_id = ?
  ORDER BY a.waktu_pendaftaran DESC
  `,
      [id]
    );

    res.json({
      profil,
      antrian,
    });
  } catch (error) {
    console.error("Error getProfilDosen:", error);
    res.status(500).json({
      message: "Gagal mengambil data profil dosen",
      error: error.message,
    });
  }
};

exports.getProfilMahasiswa = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Parameter id harus diisi" });
  }

  try {
    // Ambil data profil mahasiswa
    const [[profil]] = await db.execute(
      `
      SELECT 
        u.id,
        u.name,
        u.nim,
        u.foto_profil,
        u.role,
        u.prodi,
        u.fakultas,
        u.email,
        u.whatsapp,
        u.bio
      FROM users u
      WHERE u.id = ? AND u.role = 'mahasiswa'
      `,
      [id]
    );

    if (!profil) {
      return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    }

    // Ambil seluruh antrian milik mahasiswa ini
const [antrian] = await db.execute(
  `
  SELECT 
    m.name AS nama_mahasiswa,
    m.nim AS nim_mahasiswa,
    m.foto_profil AS foto_mahasiswa,
    m.prodi AS prodi_mahasiswa,
    m.stambuk AS stambuk_mahasiswa,

    d.name AS nama_dosen,
    d.nim AS nim_dosen,
    d.foto_profil AS foto_dosen,
    d.prodi AS prodi_dosen,
    d.fakultas AS fakultas_dosen,

    a.status,
    a.alasan,
    a.waktu_pendaftaran

  FROM tb_antrian a
  JOIN users m ON a.mahasiswa_id = m.id
  JOIN users d ON a.dosen_id = d.id
  WHERE a.mahasiswa_id = ?
  ORDER BY a.waktu_pendaftaran DESC
  `,
  [id]
);


    res.json({
      profil,
      antrian,
    });
  } catch (error) {
    console.error("Error getProfilMahasiswa:", error);
    res.status(500).json({
      message: "Gagal mengambil data profil mahasiswa",
      error: error.message,
    });
  }
};
