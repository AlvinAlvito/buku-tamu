const axios = require("axios");
const db = require("../db");
const md5 = require("md5"); // pastikan sudah install: npm install md5

const apiPortal = process.env.UINSU_API_PORTAL;

async function loginMahasiswaViaApi(nim,password, authData) {
  try {
    // 1. Cek apakah user sudah ada di DB lokal
    const [existingUsers] = await db.query(
      "SELECT * FROM users WHERE nim = ? AND role = 'mahasiswa'",
      [nim]
    );

    if (existingUsers.length > 0) {
      const user = existingUsers[0];
      return {
        id: user.id,
        name: user.name,
        nim: user.nim,
        email: user.email,
        foto_profil: user.foto_profil,
        role: user.role,
        prodi: user.prodi,
        stambuk: user.stambuk,
        fakultas: user.fakultas,
        whatsapp: user.whatsapp,
      };
    }

    if (!authData) {
      throw new Error("AuthData harus diberikan ke fungsi loginMahasiswaViaApi");
    }

    // 2. Ambil data mahasiswa dari API DataAlumni
    const alumniResponse = await axios.post(
      `${apiPortal}/DataAlumni`,
      new URLSearchParams({ nim_mhs: nim }),
      {
        headers: {
          "UINSU-KEY": process.env.UINSU_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 7000,
      }
    );

    const alumniData = alumniResponse.data.DataAlumni?.[0];
    if (
      !alumniData ||
      (alumniData.status !== true && alumniData.status !== "true")
    ) {
      throw new Error("Data mahasiswa tidak ditemukan di API");
    }

    // 3. Simpan ke DB lokal
    const newUser = {
      name: alumniData.nama_mahasiswa,
      nim: nim,
      email: alumniData.email || null,
      password: authData.password, 
      foto_profil: alumniData.mhsFoto || null,
      role: "mahasiswa",
      prodi: alumniData.PRODI || null,
      stambuk: alumniData.mhs_angkatan || null,
      fakultas: alumniData.FAKULTAS || null,
      whatsapp: alumniData.handphone || null,
    };

    const [insertResult] = await db.query("INSERT INTO users SET ?", newUser);

    return {
      id: insertResult.insertId,
      ...newUser,
    };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  loginMahasiswaViaApi,
};
