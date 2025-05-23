const { mahasiswaSockets } = require('../socket/socketState');
const { getIO } = require('../socket/socket');

const activeUsers = new Map();
const onlineUsers = { mahasiswa: 0, dosen: 0 };
const socketRoleMap = {};
// Di awal file manapun kamu pakai mahasiswaSockets
console.log("🧪 Di file ini, isi awal mahasiswaSockets:", Array.from(mahasiswaSockets.entries()));

function handleDisconnect(socket, io) {
  const meta = socketRoleMap[socket.id];
  if (!meta) return;

  const { userId, role, name } = meta;
  const userSockets = activeUsers.get(userId);

  if (userSockets) {
    userSockets.delete(socket.id);
    if (userSockets.size === 0) {
      activeUsers.delete(userId);
      onlineUsers[role] = Math.max(onlineUsers[role] - 1, 0);
    }
  }

  // Hapus dari mahasiswaSockets jika ada yang cocok dengan socket.id
  for (const [antrianId, sockId] of mahasiswaSockets.entries()) {
    if (sockId === socket.id) {
      mahasiswaSockets.delete(antrianId);
      break;
    }
  }

  delete socketRoleMap[socket.id];
  io.emit("online-counts", onlineUsers);
  console.log(`⛔ ${userId} (${name}) disconnected:`, onlineUsers);
}


function handleSocketConnection(socket, io) {
  const { id: userId, role } = socket.user;

  if (!["mahasiswa", "dosen"].includes(role)) return;

  if (!activeUsers.has(userId)) {
    activeUsers.set(userId, new Set());
    onlineUsers[role]++;
  }
  activeUsers.get(userId).add(socket.id);
  socketRoleMap[socket.id] = { userId, role };

  console.log("✅", userId, "connected:", onlineUsers);
  io.emit("online-counts", onlineUsers);

  socket.emit("updateDaftarDosen", [{ test: "test data" }]);

  // Tangani event mahasiswa join antrian
 socket.on("joinAntrian", (antrianId) => {
  mahasiswaSockets.set(antrianId, socket.id);
  console.log(`Socket ${socket.id} join antrianId ${antrianId}`);
  console.log("🧪 mahasiswaSockets sekarang:", Array.from(mahasiswaSockets.entries()));
});


  socket.on("manual-logout", () => {
    socket.disconnect(true);
    console.log("👋 Manual logout by", userId);
  });

  socket.on("disconnect", () => {
    handleDisconnect(socket, io);
    console.log("⛔", userId, "disconnected:", onlineUsers);
  });
}

// Fungsi helper untuk emit event panggilan ke mahasiswa by antrianId
function panggilMahasiswaSocket(antrianId, antrianData) {
  const socketId = mahasiswaSockets.get(antrianId);
  const io = getIO();

  console.log("📦 mahasiswaSockets.get(", antrianId, ") =", socketId);
  const allSocketIds = Array.from(io.sockets.sockets.keys());
  console.log("🔍 Semua socket aktif:", allSocketIds);

  if (!socketId || !io.sockets.sockets.has(socketId)) {
    console.log(`❌ Socket mahasiswa untuk antrianId ${antrianId} tidak ditemukan atau tidak aktif`);
    return;
  }

  io.to(socketId).emit("panggil_mahasiswa", {
    mahasiswa_id: antrianData.mahasiswa_id,
    mahasiswa_nama: antrianData.mahasiswa_name,
    message: "Anda dipanggil oleh dosen",
    countdown: 60,
    waktu: new Date().toISOString(), // misal waktu sekarang, bisa diubah sesuai data
  });

  console.log(`📣 Emit panggilan ke socket ${socketId} untuk antrianId ${antrianId}`);
}

module.exports = {
  handleSocketConnection,
  handleDisconnect,
  panggilMahasiswaSocket,
};
