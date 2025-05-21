// socket/socket.js
let io = null;

function init(server) {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  return io;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
}

module.exports = {
  init,     // ✅ Pastikan fungsi ini diekspor
  getIO,
};
