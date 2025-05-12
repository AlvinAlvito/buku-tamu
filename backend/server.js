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
const activeUsers = new Map(); // userId => Set of socket.id (bisa multi tab)

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
});

// Socket.IO logic
io.on("connection", (socket) => {
  const { id: userId, role } = socket.user;

  if (!["mahasiswa", "dosen"].includes(role)) return;

  // Simpan userId ke socket.id
  if (!activeUsers.has(userId)) {
    activeUsers.set(userId, new Set());
    onlineUsers[role]++; // Hanya tambah kalau ini user pertama kali muncul
  }

  activeUsers.get(userId).add(socket.id);
  socketRoleMap[socket.id] = { userId, role };

  console.log("✅", role, "connected:", onlineUsers);
  io.emit("online-counts", onlineUsers);

  socket.on("disconnect", () => {
    const { userId, role } = socketRoleMap[socket.id] || {};

    if (userId && activeUsers.has(userId)) {
      const sockets = activeUsers.get(userId);
      sockets.delete(socket.id);

      if (sockets.size === 0) {
        activeUsers.delete(userId);
        onlineUsers[role]--;
      }

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
