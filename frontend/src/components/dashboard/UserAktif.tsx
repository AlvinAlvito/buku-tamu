import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function UserAktif() {
  const [online, setOnline] = useState({ mahasiswa: 0, dosen: 0 });
  const joinedRef = useRef(false); // Mencegah emit ganda
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    console.log("👀 useEffect dipanggil!");
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("❌ No token found");
      return;
    }

    const socket: Socket = io("http://localhost:3000", {
      auth: {
        token: token,
      },
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected to server");

      // Hanya emit sekali saja
      if (!joinedRef.current) {
        socket.emit("user-join");
        joinedRef.current = true;
      }
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Connection error:", err.message);
    });

    socket.on("online-counts", (data) => {
      console.log("📡 Received online-counts", data);
      setOnline(data);
    });

    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
      socketRef.current = null;
    };
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Mahasiswa Online */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Mahasiswa Online
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {online.mahasiswa}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            {online.mahasiswa}
          </Badge>
        </div>
      </div>

      {/* Dosen Aktif */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Dosen Aktif
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {online.dosen}
            </h4>
          </div>
          <Badge color="error">
            <ArrowDownIcon />
            {online.dosen}
          </Badge>
        </div>
      </div>
    </div>
  );
}
