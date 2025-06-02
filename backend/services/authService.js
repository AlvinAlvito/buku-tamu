const axios = require("axios");
const db = require("../db");

const apiPortal = process.env.UINSU_API_PORTAL;
const apiBima = process.env.UINSU_API_BIMA;

async function loginUserViaPortalApi(username, password) {
  try {
    // Step 1: Otentikasi via portal
    const response = await axios.post(
      `${apiPortal}/OtentikasiUser`,
      new URLSearchParams({ username, password }),
      {
        headers: {
          "UINSU-KEY": process.env.UINSU_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 7000,
      }
    );

    const authData = response.data?.OtentikasiUser?.[0];

    if (!authData || authData.status !== true) {
      throw new Error("Autentikasi gagal.");
    }

    // Step 2: Cek apakah user sudah ada di DB lokal
    const [existingUsers] = await db.query(
      "SELECT * FROM users WHERE nim = ?",
      [username]
    );

    if (existingUsers.length > 0) {
      return existingUsers[0];
    }

    let newUser = {
      nim: authData.user,
      name: authData.nama_lengkap,
      email: null,
      password: authData.password,
      foto_profil: authData.foto || null,
      role: authData.role === "2" ? "dosen" : "mahasiswa",
      prodi: authData.nama_prodi,
      fakultas: null,
      whatsapp: null,
      stambuk: authData.role === "1" ? authData.referensi_id : null,
    };

    // Step 3: Jika dosen, ambil detail dari BIMA
    if (authData.role === "2") {
      const dosenDetailResponse = await axios.post(
        `${apiBima}/DataDosen`,
        new URLSearchParams({ nip_dsn: username }),
        {
          headers: {
            "UINSU-KEY": process.env.UINSU_API_KEY,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          timeout: 7000,
        }
      );

      const dosenData = dosenDetailResponse.data.DataDosen?.[0];

      if (dosenData) {
        const gelarDepan = dosenData.dsn_glrdepan?.trim() || "";
        const nama = dosenData.dsn_nama?.trim() || "";
        const gelarBelakang = dosenData.dsn_glrbelakang?.trim() || "";

        newUser.name = [gelarDepan, nama, gelarBelakang]
          .filter(Boolean)
          .join(" ")
          .trim();

        newUser.email = dosenData.dsn_email || null;
        newUser.fakultas = dosenData.dsn_fakultas || null;
        newUser.whatsapp = dosenData.dsn_hp || null;
        newUser.foto_profil = dosenData.dsn_urlfoto || null;
        newUser.stambuk = null;
      }
    }

    // Step 4: Simpan ke database
    const [insertResult] = await db.query("INSERT INTO users SET ?", newUser);
    newUser.id = insertResult.insertId;

    // Step 5: Tambahan (khusus dosen)
    if (newUser.role === "dosen") {
      await db.execute(
        "INSERT INTO tb_ketersediaan (user_id, lokasi_kampus, status_ketersediaan, link_maps, gedung_ruangan) VALUES (?, ?, ?, ?, ?)",
        [newUser.id, null, "Tidak Tersedia", null, "-"]
      );
    }

    return newUser;
  } catch (error) {
    console.error("❌ Login error:", error.message);
    throw error;
  }
}

module.exports = {
  loginUserViaPortalApi,
};
