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

  if (
    !lokasi_kampus ||
    !gedung_ruangan ||
    !jadwal_libur ||
    status_ketersediaan === undefined ||
    !waktu_mulai ||
    !waktu_selesai
  ) {
    return res.status(400).json({ error: "Semua field harus diisi." });
  }

  const query = `
    UPDATE tb_ketersediaan
    SET lokasi_kampus = ?, gedung_ruangan = ?, jadwal_libur = ?, status_ketersediaan = ?, link_maps = ?, waktu_mulai = ?, waktu_selesai = ?
    WHERE id = ?`;

  db.query(
    query,
    [
      lokasi_kampus,
      gedung_ruangan,
      jadwal_libur,
      status_ketersediaan,
      link_maps,
      waktu_mulai,
      waktu_selesai,
      id,
    ],
    async (err, results) => {
      if (err) {
        console.error("Query error:", err);
        return res.status(500).json({ error: "Gagal memperbarui data." });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Data tidak ditemukan." });
      }

      console.log("UPDATE BERHASIL");

      // Ambil data terbaru setelah update
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
        
        if (!io) {
          console.warn("Socket.IO tidak tersedia");
        } else {
          io.emit("updateDaftarDosen", rows);
          console.log(`Emit updateDaftarDosen dengan ${rows.length} data`);
        }
      } catch (error) {
        console.error("Error ambil data setelah update:", error);
      }

      return res.json({ success: true });
    }
  );
};

