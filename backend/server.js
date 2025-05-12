const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const ketersediaanRoutes = require("./routes/ketersediaanRoutes");
const { handleSocketConnection } = require("./controllers/socketController");
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", ketersediaanRoutes);

// Middleware untuk memverifikasi token di Socket.IO
io.use(authMiddleware);

io.on("connection", (socket) => {
  handleSocketConnection(socket, io);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
