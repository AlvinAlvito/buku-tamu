require('dotenv').config(); 
const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const { init, getIO } = require("./socket/socket");
const authRoutes = require("./routes/auth");
const ketersediaanRoutes = require("./routes/ketersediaanRoutes");
const profilRoutes = require("./routes/profilRoutes");
const daftarDosenRoutes = require("./routes/daftarDosenRoutes");
const antrianRoutes = require("./routes/antrianRoutes");
const riwayatRoutes = require("./routes/riwayatRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { handleSocketConnection } = require("./controllers/socketController");
const authMiddleware = require("./middlewares/authMiddleware");
const app = express();
const server = http.createServer(app);
const io = init(server); 
app.use(cors());
app.use(express.json());
// ✅ Middleware anti-cache
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  handleSocketConnection(socket, io);
});

app.use((req, res, next) => {
  req.io = io; 
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api", ketersediaanRoutes);
app.use("/api", profilRoutes);
app.use("/api", daftarDosenRoutes);
app.use("/api", antrianRoutes);
app.use("/api", riwayatRoutes);
app.use("/api", adminRoutes);

io.use(authMiddleware);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
