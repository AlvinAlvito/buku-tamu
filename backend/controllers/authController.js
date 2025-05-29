require("dotenv").config();
const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const localUserService = require("../services/localUserService");
const mahasiswaService = require("../services/mahasiswaService");
const dosenService = require("../services/dosenService");

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
    // 1. Cek apakah user sudah ada di DB lokal
    const user = await localUserService.findUserByNim(nim);

    if (user) {
      const isPasswordValid = await localUserService.checkLocalUserPassword(
        user,
        password
      );

      if (!isPasswordValid) {
        return res.status(401).json({
          message: `Password salah (${user.role})`,
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          nim: user.nim,
          name: user.name,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        message: "Login berhasil (user lokal)",
        user,
        token,
      });
    }

    // 2. Tentukan apakah ini dosen atau mahasiswa berdasarkan format NIM/NIDN
    const isDosen = nim.length === 16;
    const isMahasiswa = nim.length >= 7 && nim.length <= 12;

    let newUser;

    if (isDosen) {
      newUser = await dosenService.loginDosenViaApi(nim, password);
    } else if (isMahasiswa) {
      newUser = await mahasiswaService.loginMahasiswaViaApi(nim, password);
    } else {
      // Bisa tangani error kalau format nim tidak sesuai
      return res.status(400).json({ message: "Format NIM tidak valid" });
    }

    const token = jwt.sign(
      {
        id: newUser.id,
        nim: newUser.nim,
        name: newUser.name,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login berhasil (API eksternal)",
      user: newUser,
      token,
    });
  } catch (error) {
    console.error("🔥 ERROR:", error.response?.data || error.message);
    return res.status(500).json({
      message: error.message || "Terjadi kesalahan saat login",
    });
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
