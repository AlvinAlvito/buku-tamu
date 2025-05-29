const axios = require("axios");
const db = require("../db");
const md5 = require("md5"); // pastikan sudah install: npm install md5

const apiPortal = process.env.UINSU_API_PORTAL;

async function loginMahasiswaViaApi(nim, password) {
  try {
    // 1. Cek apakah mahasiswa sudah ada di tabel users
    const [existingUsers] = await db.query("SELECT * FROM users WHERE nim = ? AND role = 'mahasiswa'", [nim]);

    if (existingUsers.length > 0) {
      // Sudah pernah login sebelumnya, return data user
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

    // 2. Otentikasi ke API Portal
    const otentikasiResponse = await axios.post(
      `${apiPortal}/OtentikasiUser`,
      new URLSearchParams({ username: nim, password }),
      {
        headers: { "UINSU-KEY": process.env.UINSU_API_KEY },
        timeout: 7000,
      }
    );

    const authData = otentikasiResponse.data.OtentikasiUser?.[0];
    if (!authData || !authData.status) {
      throw new Error("Login gagal - data tidak valid");
    }

    // 3. Ambil data mahasiswa detail
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
    if (!alumniData || (alumniData.status !== true && alumniData.status !== "true")) {
      throw new Error("Data alumni tidak ditemukan");
    }

    // 4. Simpan ke database lokal
    const newUser = {
      name: alumniData.nama_mahasiswa,
      nim: authData.user,
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
