import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = (token: string) => {
  socket = io("http://localhost:3000", {
    auth: { token },
    transports: ["websocket"],
  });
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log("🔌 Socket manually disconnected.");
    socket = null;
  }
};
