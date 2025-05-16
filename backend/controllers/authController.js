const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, nim, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Insert user
    const [result] = await db.execute(
      "INSERT INTO users (name, nim, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [name, nim, email, hashedPassword, role]
    );

    console.log("User insert result:", result);

    const userId = result.insertId;
    console.log("New user ID:", userId);
    console.log("Role received:", role);

    // Cek dan insert ke tb_ketersediaan jika role dosen
    if (role === "dosen") {
      console.log("Inserting into tb_ketersediaan...");

      await db.execute(
        "INSERT INTO tb_ketersediaan (user_id, lokasi_kampus, status_ketersediaan, link_maps, gedung_ruangan) VALUES (?, ?, ?, ?, ?)",
        [userId, null, null, null, '-']
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
    const [users] = await db.execute("SELECT * FROM users WHERE nim = ?", [
      nim,
    ]);

    if (users.length === 0)
      return res.status(404).json({ error: "User not found" });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      token,
      user: { 
        id: user.id,
        name: user.name, 
        role: user.role ,
        nim: user.nim,
        email: user.email,
        facebook: user.facebook,
        twitter: user.twitter,
        instagram: user.instagram,
        whatsapp: user.whatsapp,
        bio: user.bio      
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyToken = async(socket, next) =>{
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
}

