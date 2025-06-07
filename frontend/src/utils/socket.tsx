import { io, Socket } from "socket.io-client";
import { baseUrl } from "../lib/api";
let socket: Socket | null = null;

export const initSocket = (token: string): Socket => {
  if (!socket) {
    socket = io(`${baseUrl}`, {
      auth: {
        token,
      },
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected with ID:", socket?.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err);
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
