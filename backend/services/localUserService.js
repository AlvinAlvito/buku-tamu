const bcrypt = require("bcryptjs");
const crypto = require("crypto"); // untuk md5
const db = require("../db");

async function findUserByNim(nim) {
  const [results] = await db.query("SELECT * FROM users WHERE nim = ?", [nim]);
  return results.length > 0 ? results[0] : null;
}

async function checkLocalUserPassword(user, password) {
  if (user.role === "mahasiswa") {
    // Hash input password dengan MD5
    const inputPasswordHash = crypto.createHash("md5").update(password).digest("hex");
    return inputPasswordHash === user.password;
  } else {
    // Untuk admin/superadmin pakai bcrypt
    return await bcrypt.compare(password, user.password);
  }
}

module.exports = {
  findUserByNim,
  checkLocalUserPassword,
};
