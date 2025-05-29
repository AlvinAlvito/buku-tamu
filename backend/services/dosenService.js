const axios = require("axios");
const db = require("../db");

const apiBima = process.env.UINSU_API_BIMA;

async function loginDosenViaApi(nip, password) {
  try {
    // 1. Cek apakah dosen sudah ada di tabel users
    const [existingUsers] = await db.query(
      "SELECT * FROM users WHERE nim = ? AND role = 'dosen'",
      [nip]
    );

    if (existingUsers.length > 0) {
      // Sudah pernah login sebelumnya, langsung return data user
      return {
        id: existingUsers[0].id,
        name: existingUsers[0].name,
        nim: existingUsers[0].nim,
        email: existingUsers[0].email,
        foto_profil: existingUsers[0].foto_profil,
        role: existingUsers[0].role,
        prodi: existingUsers[0].prodi,
        stambuk: existingUsers[0].stambuk,
        fakultas: existingUsers[0].fakultas,
        whatsapp: existingUsers[0].whatsapp,
      };
    }

    // 2. Otentikasi ke API SIA
    const otentikasiResponse = await axios.post(
      `${apiBima}/OtentikasiUser`,
      new URLSearchParams({ username: nip, password }),
      {
        headers: { "UINSU-KEY": process.env.UINSU_API_KEY },
        timeout: 7000,
      }
    );

    const authData = otentikasiResponse.data.OtentikasiUser?.[0];
    if (!authData || !authData.status) {
      throw new Error("Login gagal - data tidak valid");
    }

    // 3. Ambil data dosen detail
    const dosenResponse = await axios.post(
      `${apiBima}/DataDosen`,
      new URLSearchParams({ nip_dsn: nip }),
      {
        headers: {
          "UINSU-KEY": process.env.UINSU_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 7000,
      }
    );

    const dosenData = dosenResponse.data.DataDosen?.[0];
    if (
      !dosenData ||
      (dosenData.status !== true && dosenData.status !== "true")
    ) {
      throw new Error("Data dosen tidak ditemukan");
    }

    // Gabungkan nama dengan gelar depan dan belakang
    const gelarDepan = dosenData.dsn_glrdepan?.trim();
    const nama = dosenData.dsn_nama?.trim();
    const gelarBelakang = dosenData.dsn_glrbelakang?.trim();

    let fullName = nama;
    if (gelarDepan) {
      fullName = `${gelarDepan} ${fullName}`;
    }
    if (gelarBelakang) {
      fullName = `${fullName}, ${gelarBelakang}`;
    }

    // 4. Simpan ke database lokal (users)
    const newUser = {
      name: fullName,
      nim: dosenData.dsn_nip,
      email: dosenData.dsn_email || null,
      password: authData.password,
      foto_profil: dosenData.dsn_urlfoto || null,
      role: "dosen",
      prodi: dosenData.dsn_programstudi
        ? dosenData.dsn_programstudi
            .replace(/^Prodi\s+/i, "")
            .trim()
            .toUpperCase()
        : null,
      stambuk: null,
      fakultas: dosenData.dsn_fakultas || null,
      whatsapp: dosenData.dsn_hp || null,
    };

    const [insertResult] = await db.query("INSERT INTO users SET ?", newUser);
    const userId = insertResult.insertId;

    // 5. Tambahkan ke tb_ketersediaan untuk dosen
    await db.execute(
      "INSERT INTO tb_ketersediaan (user_id, lokasi_kampus, status_ketersediaan, link_maps, gedung_ruangan) VALUES (?, ?, ?, ?, ?)",
      [userId, null, "Tidak Tersedia", null, "-"]
    );

    return {
      id: userId,
      ...newUser,
    };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  loginDosenViaApi,
};
