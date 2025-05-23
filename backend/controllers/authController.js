require("dotenv").config();
const db = require("../db");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const apiBaseUrl = process.env.UINSU_API_URL;

exports.register = async (req, res) => {
  const { name, nim, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const [result] = await db.execute(
      "INSERT INTO users (name, nim, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [name, nim, email, hashedPassword, role]
    );

    console.log("User insert result:", result);

    const userId = result.insertId;
    console.log("New user ID:", userId);
    console.log("Role received:", role);

    if (role === "dosen") {
      console.log("Inserting into tb_ketersediaan...");

      await db.execute(
        "INSERT INTO tb_ketersediaan (user_id, lokasi_kampus, status_ketersediaan, link_maps, gedung_ruangan) VALUES (?, ?, ?, ?, ?)",
        [userId, null, "Tidak Tersedia", null, "-"]
      );

      console.log("Insert into tb_ketersediaan sukses");
    }

    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { nim, password } = req.body;

  try {
    // Login Akun di Database Lokal
    const [results] = await db.query("SELECT * FROM users WHERE nim = ?", [nim]);

    if (results.length > 0) {
      const dbUser = results[0];
      const isMahasiswa = dbUser.role === "mahasiswa";

      if (isMahasiswa) {
        if (password !== dbUser.password) {
          return res.status(401).json({ message: "Password salah (mahasiswa)" });
        }
      } else {
        const isPasswordValid = await bcrypt.compare(password, dbUser.password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: "Password salah (lokal)" });
        }
      }

      // Buat token
      const token = jwt.sign(
        {
          id: dbUser.id,
          nim: dbUser.nim,
          name: dbUser.name,
          role: dbUser.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        message: "Login berhasil (user lokal/mahasiswa)",
        user: dbUser,
        token,
      });
    }

    // Login Mahasiswa ke API SIA
    const otentikasiResponse = await axios.post(
      `${apiBaseUrl}/OtentikasiUser`,
      new URLSearchParams({ username: nim, password }),
      {
        headers: { "UINSU-KEY": process.env.UINSU_API_KEY },
        timeout: 7000,
      }
    );

    const authData = otentikasiResponse.data.OtentikasiUser?.[0];
    if (!authData || !authData.status) {
      return res.status(401).json({ message: "Login gagal - data tidak valid" });
    }

    const user = authData.user;
    const hashPassword = password; 

    // Ambil data mahasiswa dari API
    const alumniResponse = await axios.post(
      `${apiBaseUrl}/DataAlumni`,
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

    const [insertResult] = await db.query("INSERT INTO users SET ?", newUser);
    const savedUser = {
      id: insertResult.insertId,
      ...newUser,
    };

    const token = jwt.sign(
      {
        id: savedUser.id,
        nim: savedUser.nim,
        name: savedUser.name,
        role: savedUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login berhasil (API SIA) & data disimpan",
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
