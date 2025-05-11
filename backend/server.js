const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const jwt = require("jsonwebtoken"); // Pastikan kamu sudah install jsonwebtoken
require("dotenv").config();

const authRoutes = require("./routes/auth");
const ketersediaanRoutes = require("./routes/ketersediaanRoutes");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", ketersediaanRoutes);

// Data penyimpanan sementara
const onlineUsers = { mahasiswa: 0, dosen: 0 };
const socketRoleMap = {}; // socket.id => "mahasiswa" / "dosen"

// Middleware untuk memverifikasi token di Socket.IO
io.use((socket, next) => {
  const token = socket.handshake.auth.token; // Ambil token dari socket.handshake.auth

  if (!token) {
    return next(new Error("Unauthorized")); // Jika token tidak ada, tolak koneksi
  }

  try {
    // Verifikasi token
    const user = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = user; // Simpan data user di socket (seperti role)
    next(); // Jika token valid, lanjutkan koneksi
  } catch (err) {
    next(new Error("Invalid token")); // Jika token tidak valid, tolak koneksi
  }
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("🟢 New client connected");

  // Ambil role user dari socket.user yang sudah diset oleh middleware
  const role = socket.user?.role;

  socket.on("user-join", () => {
    if (role === "mahasiswa" || role === "dosen") {
      socketRoleMap[socket.id] = role;
      onlineUsers[role]++;
      io.emit("online-counts", onlineUsers);
      console.log("✅", role, "connected:", onlineUsers);
    }
  });

  socket.on("disconnect", () => {
    const role = socketRoleMap[socket.id];
    if (role && onlineUsers[role] > 0) {
      onlineUsers[role]--;
      delete socketRoleMap[socket.id];
      io.emit("online-counts", onlineUsers);
      console.log("⛔", role, "disconnected:", onlineUsers);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
