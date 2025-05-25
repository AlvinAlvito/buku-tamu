const { mahasiswaSockets } = require("../socket/socketState");
const { getIO } = require("../socket/socket");

const activeUsers = new Map();
const onlineUsers = { mahasiswa: 0, dosen: 0 };
const socketRoleMap = {};
let ioGlobal = null;

// Di awal file manapun kamu pakai mahasiswaSockets
console.log(
  "🧪 Di file ini, isi awal mahasiswaSockets:",
  Array.from(mahasiswaSockets.entries())
);

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
  
  if (!ioGlobal) ioGlobal = io;
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

  // Tangani event mahasiswa join antrian
  socket.on("join_antrian", (antrianId) => {
    const key = String(antrianId); // ✅ pastikan key adalah string
    let set = mahasiswaSockets.get(key);
    if (!set) {
      set = new Set();
      mahasiswaSockets.set(key, set);
    }
    set.add(socket.id);

    console.log(`✅ Socket ${socket.id} JOIN antrianId ${key}`);
    console.log("📦 mahasiswaSockets TERKINI:", [
      ...mahasiswaSockets.entries(),
    ]);
  });

  socket.on("manual-logout", () => {
    socket.disconnect(true);
    console.log("👋 Manual logout by", userId);
  });

  socket.on("disconnect", () => {
    handleDisconnect(socket, io);
    console.log("⛔", userId, "disconnected:", onlineUsers);
  });

  for (const [antrianId, socketSet] of mahasiswaSockets.entries()) {
    if (socketSet.has(socket.id)) {
      socketSet.delete(socket.id);
      if (socketSet.size === 0) {
        mahasiswaSockets.delete(antrianId);
      }
    }
  }
}

// Fungsi helper untuk emit event panggilan ke mahasiswa by antrianId
function panggilMahasiswaSocket(antrianId, antrianData) {
  const io = getIO(); 

  const key = String(antrianId); 
  const socketSet = mahasiswaSockets.get(key);

  console.log("🧪 Cek mahasiswaSockets antrianId:", key);
  console.log(
    "📦 Isi mahasiswaSockets sekarang:",
    new Map([...mahasiswaSockets])
  );

  if (!socketSet || socketSet.size === 0) {
    console.log(`❌ Tidak ada mahasiswa di antrianId ${key}`);
    return;
  }

  const allActiveSocketIds = Array.from(io.sockets.sockets.keys());
  console.log("🔍 Semua socket aktif:", allActiveSocketIds);
  console.log(`🎯 Socket untuk antrianId ${key}:`, Array.from(socketSet));

  let emitted = false;

  for (const socketId of socketSet) {
    if (io.sockets.sockets.has(socketId)) {
      io.to(socketId).emit("panggil_mahasiswa", {
        mahasiswa_id: antrianData.mahasiswa_id,
        mahasiswa_nama: antrianData.mahasiswa_name,
        message: "Anda dipanggil oleh dosen",
        countdown: 60,
        waktu: new Date().toISOString(),
      });

      console.log(
        `📣 Emit panggilan ke socket ${socketId} untuk antrianId ${key}`
      );
      emitted = true;
    } else {
      console.log(
        `⚠️ Socket ${socketId} tidak aktif. Dihapus dari antrianId ${key}`
      );
      socketSet.delete(socketId); // bersihkan jika mati
    }
  }

  if (!emitted) {
    console.log(`❌ Tidak ada socket aktif untuk antrianId ${key}`);
  }
}

// function broadcastUpdateDaftarDosen(data) {
//   if (!ioGlobal) {
//     console.warn("Socket.IO server belum siap, emit updateDaftarDosen gagal.");
//     return;
//   }
//   console.log("Emit updateDaftarDosen dengan data:", rows.length);
//   ioGlobal.emit("updateDaftarDosen", data);
//   console.log(`Emit updateDaftarDosen dengan ${data.length} data`);
// }


module.exports = {
  handleSocketConnection,
  handleDisconnect,
  panggilMahasiswaSocket,
    // broadcastUpdateDaftarDosen,
};
