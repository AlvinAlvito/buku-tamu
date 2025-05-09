const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { nama, nim, email, password, posisi } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.execute(
      "INSERT INTO users (nama, nim, email, password, posisi) VALUES (?, ?, ?, ?, ?)",
      [nama, nim, email, hashedPassword, posisi]
    );
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
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
      { id: user.id, posisi: user.posisi },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      token,
      user: { 
        id: user.id,
        nama: user.nama, 
        posisi: user.posisi 
      
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
