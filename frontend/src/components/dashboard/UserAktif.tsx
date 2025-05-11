import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function UserAktif() {
  const [online, setOnline] = useState({ mahasiswa: 0, dosen: 0 });

  useEffect(() => {
    // Inisialisasi socket saat komponen mount
    const socket: Socket = io("http://localhost:3000", {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("✅ Connected to server");
      socket.emit("user-join", "mahasiswa");
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Connection error:", err.message);
    });

    socket.on("online-counts", (data) => {
      console.log("📡 Received online-counts", data);
      setOnline(data);
    });

    // Cleanup
    return () => {
      socket.disconnect(); // putuskan koneksi saat unmount
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
