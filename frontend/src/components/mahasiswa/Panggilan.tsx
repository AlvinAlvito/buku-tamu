import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { initSocket } from "../../utils/socket";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import { BellIcon } from "lucide-react";
import { baseUrl } from "../../lib/api";
declare global {
  interface Window {
    NotifyFlutter?: {
      postMessage: (message: string) => void;
    };
  }
}

export default function BuatJanji() {
  const { id } = useParams();
  const { isOpen, openModal, closeModal } = useModal();

  const [countdown, setCountdown] = useState(60);
  const [dosenId, setDosenId] = useState<number | null>(null);
  const [antrianId, setAntrianId] = useState<number | null>(null);
  const [, setSocket] = useState<any>(null);

  // Ambil dosenId berdasarkan id ketersediaan dari URL
  useEffect(() => {
    const fetchDosenId = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/ketersediaan/`);
        const data = await res.json();

        const ketersediaan = data.find((item: any) => item.id === parseInt(id!));
        if (ketersediaan) {
          setDosenId(ketersediaan.user_id);
        } else {
          console.error("Data ketersediaan tidak ditemukan");
        }
      } catch (err) {
        console.error("Gagal fetch ketersediaan:", err);
      }
    };

    if (id) {
      fetchDosenId();
    }
  }, [id]);

  useEffect(() => {
    // Ambil antrian milik mahasiswa sendiri berdasarkan dosenId
    const fetchAntrianSaya = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/antrian-dosen/${dosenId}`);
        if (!res.ok) throw new Error("Gagal fetch antrian dosen");

        const data = await res.json();
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        const antrianSaya = data.find(
          (item: any) => item.mahasiswa_id === user.id && item.status === "menunggu"
        );

        if (antrianSaya) {
          setAntrianId(antrianSaya.id);
        } else {
          console.warn("Mahasiswa belum daftar antrian atau sudah selesai");
          setAntrianId(null);
        }
      } catch (err) {
        console.error("Fetch antrian error:", err);
      }
    };

    if (dosenId !== null) {
      fetchAntrianSaya();
    }
  }, [dosenId]);

  // Init socket dan join antrian berdasarkan antrianId
  useEffect(() => {
    if (!antrianId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token tidak ditemukan");
      return;
    }

    const sock = initSocket(token);
    setSocket(sock);

    const handleConnect = () => {
      console.log("Socket connected, join antrianId:", antrianId);
      sock.emit("join_antrian", antrianId);
      console.log("🔼 joinAntrian dikirim");
    };

    if (sock.connected) {
      handleConnect();
    } else {
      sock.once("connect", handleConnect);
    }

    const handlePanggilan = (data: any) => {
      console.log("Dipanggil dengan data:", data);
      openModal();
      setCountdown(60);
    };

    sock.on("panggil_mahasiswa", handlePanggilan);

    return () => {
      sock.off("panggil_mahasiswa", handlePanggilan);
      sock.off("connect", handleConnect);
      // jangan disconnect socket karena pakai singleton
    };
  }, [antrianId, openModal]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    let vibrateInterval: ReturnType<typeof setInterval>;
    let audio: HTMLAudioElement;

    // Helper aman untuk vibrasi
    const safeVibrate = (pattern: number | number[]) => {
      if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
        navigator.vibrate(pattern);
      }

      // ✅ Kirim perintah ke Flutter WebView agar getar
      if (window.NotifyFlutter && typeof window.NotifyFlutter.postMessage === "function") {
        window.NotifyFlutter.postMessage("vibrate");
      }
    };

    // Fungsi untuk mainkan suara
    const triggerSound = () => {
      // Untuk browser biasa
      audio = new Audio("https://raw.githubusercontent.com/AlvinAlvito/buku-tamu/main/frontend/public/ringtone.mp3");
      audio.loop = true;
      audio.play().catch((err) => {
        console.warn("Autoplay gagal. Mungkin belum ada interaksi pengguna:", err);
      });

      // ✅ Kirim perintah ke Flutter WebView agar bunyi
      if (window.NotifyFlutter && typeof window.NotifyFlutter.postMessage === "function") {
        window.NotifyFlutter.postMessage("sound");
      }
    };

    if (isOpen) {
      triggerSound();
      safeVibrate([400, 200]);

      vibrateInterval = setInterval(() => {
        safeVibrate([400, 200]);
      }, 600);

      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            clearInterval(vibrateInterval);
            if (audio) audio.pause();

            if (window.NotifyFlutter) window.NotifyFlutter.postMessage("stop");

            safeVibrate(0);
            closeModal();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Cleanup
    return () => {
      clearInterval(timer);
      clearInterval(vibrateInterval);
      if (audio) audio.pause();
      safeVibrate(0);
    };
  }, [isOpen, closeModal]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-xl m-4">
        <div className="relative w-full p-6 lg:p-10 overflow-y-auto rounded-2xl bg-white shadow-xl dark:bg-gray-900 transition-all duration-300">
          <div className="flex flex-col items-center text-center">
            <BellIcon className="w-12 h-12 text-yellow-500 mb-4 animate-bounce" />
            <h4 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
              Antrian Anda Sudah Selesai!
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md">
              Antrian Sudah Selesai. Dosen sedang menunggu Anda! Silakan segera temui dosen Anda dalam waktu...
            </p>

            <div className="flex items-center justify-center gap-2 bg-yellow-100 dark:bg-yellow-900 px-6 py-4 rounded-xl mb-6 shadow-inner">
              <span className="text-5xl font-bold text-yellow-700 dark:text-yellow-300">{countdown}</span>
              <span className="text-lg font-medium text-yellow-700 dark:text-yellow-300">detik</span>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
