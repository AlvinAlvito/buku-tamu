const db = require("../db");
const { getIO } = require("../socket/socket");


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

exports.getAllKetersediaan = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT *, link_maps FROM tb_ketersediaan`
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan." });
    }

    // Kirim seluruh data (bukan cuma rows[0])
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};


// UPDATE ketersediaan by ID termasuk field link_maps
exports.updateKetersediaan = async (req, res) => {
  console.log("MASUK CONTROLLER UPDATE");

  const { id } = req.params;
  const {
    lokasi_kampus,
    gedung_ruangan,
    jadwal_libur,
    status_ketersediaan,
    link_maps,
    waktu_mulai,
    waktu_selesai,
  } = req.body;

  // Buat object field yang ingin diupdate (hanya jika ada isinya)
  const fieldsToUpdate = {};
  if (lokasi_kampus !== undefined) fieldsToUpdate.lokasi_kampus = lokasi_kampus;
  if (gedung_ruangan !== undefined) fieldsToUpdate.gedung_ruangan = gedung_ruangan;
  if (jadwal_libur !== undefined) fieldsToUpdate.jadwal_libur = jadwal_libur;
  if (status_ketersediaan !== undefined) fieldsToUpdate.status_ketersediaan = status_ketersediaan;
  if (link_maps !== undefined) fieldsToUpdate.link_maps = link_maps;
  if (waktu_mulai !== undefined) fieldsToUpdate.waktu_mulai = waktu_mulai;
  if (waktu_selesai !== undefined) fieldsToUpdate.waktu_selesai = waktu_selesai;

  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({ error: "Tidak ada field yang dikirim untuk diupdate." });
  }

  // Buat bagian SET dari query secara dinamis
  const setClause = Object.keys(fieldsToUpdate)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = Object.values(fieldsToUpdate);

  const query = `UPDATE tb_ketersediaan SET ${setClause} WHERE id = ?`;

  db.query(query, [...values, id], async (err, results) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).json({ error: "Gagal memperbarui data." });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Data tidak ditemukan." });
    }

    console.log("UPDATE BERHASIL");

    try {
      const [rows] = await db.promise().query(`
        SELECT k.id, k.user_id, u.name, u.nim, u.foto_profil,
               k.lokasi_kampus, k.gedung_ruangan, k.link_maps,
               k.jadwal_libur, k.status_ketersediaan,
               k.waktu_mulai, k.waktu_selesai
        FROM tb_ketersediaan k
        JOIN users u ON k.user_id = u.id
      `);

      const io = getIO();
      if (io) {
        io.emit("updateDaftarDosen", rows);
        console.log(`Emit updateDaftarDosen dengan ${rows.length} data`);
      } else {
        console.warn("Socket.IO tidak tersedia");
      }
    } catch (error) {
      console.error("Error ambil data setelah update:", error);
    }

    return res.json({ success: true });
  });
};

