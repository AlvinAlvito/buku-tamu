import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function initSocket(token: string): Socket {
  if (socket) return socket; // reuse jika sudah ada

  socket = io("http://localhost:3000", {
    auth: { token },
    transports: ["websocket"],
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
    socket = null;
  });

  return socket;
}

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
    socket = null;
  } else {
    console.warn("Socket belum terhubung, tidak bisa disconnect.");
  }
};

export const getSocket = (): Socket | null => socket;
