require("dotenv").config();
const db = require("../db");
const jwt = require("jsonwebtoken");
const axios = require("axios");

exports.login = async (req, res) => {
  const { nim, password } = req.body;
  console.log("📥 Request login diterima:", { nim });

  try {
    console.log("🔐 Memulai proses otentikasi...");

    const otentikasiResponse = await axios.post(
      "https://ws.uinsu.ac.id/portal/OtentikasiUser",
      new URLSearchParams({ username: nim, password }),
      {
        headers: { "UINSU-KEY": process.env.UINSU_API_KEY },
        timeout: 7000,
      }
    );

    console.log("✅ Otentikasi sukses:", otentikasiResponse.data);

    const authData = otentikasiResponse.data.OtentikasiUser?.[0];

    if (!authData || !authData.status) {
      console.log("❌ Otentikasi gagal, data tidak valid:", authData);
      return res
        .status(401)
        .json({ message: "Login gagal - data tidak valid" });
    }

    const user = authData.user;
    const hashPassword = authData.password;

    if (!user) {
      console.log("❌ Otentikasi berhasil tapi data user kosong");
      return res.status(401).json({ message: "Login gagal" });
    }

    console.log("🔍 Mengecek user di database lokal...");
    const [results] = await db.query("SELECT * FROM users WHERE nim = ?", [
      nim,
    ]);
    console.log("📦 Hasil query database:", results);

    if (results.length > 0) {
      const dbUser = results[0];
      console.log("✅ User ditemukan di database:", dbUser);

      const token = jwt.sign(
        { id: dbUser.id, nim: dbUser.nim, role: dbUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        message: "Login berhasil",
        user: dbUser,
        token,
      });
    }

    console.log(
      "🆕 User tidak ditemukan di database, memanggil API DataAlumni..."
    );
    const alumniResponse = await axios.post(
      "https://ws.uinsu.ac.id/portal/DataAlumni",
      new URLSearchParams({ nim_mhs: nim }),
      {
        headers: {
          "UINSU-KEY": process.env.UINSU_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 7000,
      }
    );

    console.log("✅ Response DataAlumni diterima:", alumniResponse.data);
    const alumniData = alumniResponse.data.DataAlumni?.[0];

    if (
      !alumniData ||
      (alumniData.status !== true && alumniData.status !== "true")
    ) {
      console.log("❌ Data alumni tidak ditemukan:", alumniData);
      return res.status(404).json({ message: "Data alumni tidak ditemukan" });
    }

    const newUser = {
      name: alumniData.nama_mahasiswa,
      nim: user,
      email: alumniData.email || null,
      password: hashPassword,
      foto_profil: alumniData.mhsFoto || null,
      role: "mahasiswa",
      prodi: alumniData.PRODI || null,
      stambuk: alumniData.mhs_angkatan || null,
      fakultas: alumniData.FAKULTAS || null,
      whatsapp: alumniData.handphone || null,
    };

    console.log("📝 Menyimpan user baru ke database:", newUser);

    const [insertResult] = await db.query("INSERT INTO users SET ?", newUser);
    console.log("✅ User berhasil disimpan:", insertResult);

    const savedUser = {
      id: insertResult.insertId,
      ...newUser,
    };

    const token = jwt.sign(
      { id: insertResult.insertId, nim: newUser.nim, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("🎉 Login dan penyimpanan sukses. Token dibuat.");

    return res.status(200).json({
      message: "Login berhasil & data disimpan",
      user: savedUser,
      token,
    });
  } catch (error) {
    console.error("🔥 ERROR:", error.response?.data || error.message);
    return res.status(500).json({ message: "Terjadi kesalahan saat login" });
  }
};

exports.verifyToken = async (socket, next) => {
  const token = socket.handshake.auth.token;
  console.log("🔐 Incoming socket token:", token);

  if (!token) return next(new Error("Unauthorized"));

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = user;
    console.log("✅ Token valid. User:", user);
    next();
  } catch (err) {
    console.error("❌ Token invalid:", err.message);
    next(new Error("Invalid token"));
  }
};
