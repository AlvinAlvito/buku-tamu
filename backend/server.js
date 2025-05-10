const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();

const authRoutes = require("./routes/auth");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// Socket.IO logic
const onlineUsers = { mahasiswa: 0, dosen: 0 };

io.on("connection", (socket) => {
  console.log("🟢 New client connected");

  socket.on("user-join", (role) => {
    if (role === "mahasiswa" || role === "dosen") {
      onlineUsers[role]++;
      io.emit("online-counts", onlineUsers);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected");
    // Tidak tahu role user, jadi tidak dikurangi
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
