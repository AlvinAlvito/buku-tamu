const activeUsers = new Map();
const onlineUsers = { mahasiswa: 0, dosen: 0 };
const socketRoleMap = {};

function handleDisconnect(socket, io) {
  const meta = socketRoleMap[socket.id];
  if (!meta) return;

  const { userId, role } = meta;
  const userSockets = activeUsers.get(userId);

  if (userSockets) {
    userSockets.delete(socket.id);
    if (userSockets.size === 0) {
      activeUsers.delete(userId);
      onlineUsers[role] = Math.max(onlineUsers[role] - 1, 0);
    }
  }

  delete socketRoleMap[socket.id];
  io.emit("online-counts", onlineUsers);
  console.log("⛔", role, "disconnected:", onlineUsers);
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

  console.log("✅", role, "connected:", onlineUsers);
  io.emit("online-counts", onlineUsers);

  socket.on("manual-logout", () => {
    handleDisconnect(socket, io);
    socket.disconnect(true);
    console.log("👋 Manual logout by", role);
  });

  socket.on("disconnect", () => {
    handleDisconnect(socket, io);
    console.log("⛔", role, "disconnected:", onlineUsers);
  });
}

module.exports = { handleSocketConnection, handleDisconnect };
