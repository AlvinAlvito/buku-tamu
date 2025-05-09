const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // sesuaikan dengan port React kamu
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

let onlineMahasiswa = 0;
let onlineDosen = 0;

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  socket.on("user-join", (userType) => {
    if (userType === "mahasiswa") onlineMahasiswa++;
    if (userType === "dosen") onlineDosen++;

    io.emit("online-counts", { mahasiswa: onlineMahasiswa, dosen: onlineDosen });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
    onlineMahasiswa = Math.max(onlineMahasiswa - 1, 0);
    onlineDosen = Math.max(onlineDosen - 1, 0);

    io.emit("online-counts", { mahasiswa: onlineMahasiswa, dosen: onlineDosen });
  });
});

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// ===> Tambahan bagian simulasi pengujian otomatis setiap 5 detik
setInterval(() => {
  const dummyMahasiswa = Math.floor(Math.random() * 10); // 0–9
  const dummyDosen = Math.floor(Math.random() * 5);      // 0–4

  io.emit("online-counts", {
    mahasiswa: dummyMahasiswa,
    dosen: dummyDosen
  });

  console.log("Simulasi data online dikirim:", {
    mahasiswa: dummyMahasiswa,
    dosen: dummyDosen
  });
}, 5000); // setiap 5 detik

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

io.on("connection", (socket) => {
    console.log("✅ User connected: ", socket.id);
  });
  
