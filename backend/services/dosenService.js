const axios = require("axios");
const db = require("../db");

const apiBima = process.env.UINSU_API_BIMA;

async function loginDosenViaApi(nim, password, authData) {
  console.log("Login dosen via API...");

  try {
    // 1. Cek user lokal
    const [existingUsers] = await db.query(
      "SELECT * FROM users WHERE nim = ? AND role = 'dosen'",
      [nim]
    );

    if (existingUsers.length > 0) {
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

    // 2. Karena authData sudah dari controller, jangan lagi otentikasi ulang
    if (!authData) {
      throw new Error("AuthData harus diberikan ke fungsi loginDosenViaApi");
    }

    // 3. Ambil data dosen dari API BIMA
    const dosenResponse = await axios.get(`${apiBima}/DataDosen`, {
      headers: { "UINSU-KEY": process.env.UINSU_API_KEY },
      params: { nip: nim },
      timeout: 7000,
    });

    const dosenData = dosenResponse.data.DataDosen?.[0];
    if (!dosenData || (dosenData.status !== true && dosenData.status !== "true")) {
      throw new Error("Data dosen tidak ditemukan di API");
    }

    // 4. Format nama lengkap
    let fullName = dosenData.dsn_nama?.trim();
    if (dosenData.dsn_glrdepan) fullName = `${dosenData.dsn_glrdepan.trim()} ${fullName}`;
    if (dosenData.dsn_glrbelakang) fullName = `${fullName}, ${dosenData.dsn_glrbelakang.trim()}`;

    // 5. Simpan user baru dengan password dari authData
    const newUser = {
      name: fullName,
      nim: dosenData.dsn_nip,
      email: dosenData.dsn_email || null,
      password: authData.password,  // gunakan password dari authData
      foto_profil: dosenData.dsn_urlfoto || null,
      role: "dosen",
      prodi: dosenData.dsn_programstudi
        ? dosenData.dsn_programstudi.replace(/^Prodi\s+/i, "").trim().toUpperCase()
        : null,
      stambuk: null,
      fakultas: dosenData.dsn_fakultas || null,
      whatsapp: dosenData.dsn_hp || null,
    };

    const [insertResult] = await db.query("INSERT INTO users SET ?", newUser);
    const userId = insertResult.insertId;

    // 6. Insert ke tb_ketersediaan
    await db.execute(
      `INSERT INTO tb_ketersediaan 
      (user_id, lokasi_kampus, status_ketersediaan, link_maps, gedung_ruangan) 
      VALUES (?, ?, ?, ?, ?)`,
      [userId, null, "Tidak Tersedia", null, "-"]
    );

    return { id: userId, ...newUser };
  } catch (error) {
    throw error;
  }
}


module.exports = {
  loginDosenViaApi,
};
