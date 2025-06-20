import Badge from "../ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import { UserCheck, TimerIcon, Megaphone, CheckCircle, Trash2, XCircle, UserX, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";
import { initSocket, getSocket, disconnectSocket } from "../../utils/socket";
import { baseUrl } from "../../lib/api";



type Antrian = {
  id: number;
  mahasiswa_id: number;
  dosen_id: number;
  waktu_pendaftaran: string;
  tujuan: string;
  alasan: string;
  status: "menunggu" | "proses" | "selesai" | "dibatalkan";
  mahasiswa_name: string;
  mahasiswa_foto: string;
  mahasiswa_role: string;
  mahasiswa_nim: string;
  mahasiswa_prodi: string;
  mahasiswa_stambuk: string;
};

export default function AntrianDosen() {
  const { isOpen, openModal, closeModal } = useModal();
  const [isSelesaiOpen, setIsSelesaiOpen] = useState(false);
  const [isBatalkanOpen, setIsBatalkanOpen] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [antrianData, setAntrianData] = useState<Antrian[]>([]);
  const [selectedAntrian, setSelectedAntrian] = useState<Antrian | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const dosenId = user?.id || null;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    initSocket(token);

    return () => {
      disconnectSocket();
    };
  }, []);



  const fetchAntrian = () => {
    fetch(`${baseUrl}/api/antrian-dosen/${dosenId}`)
      .then((res) => res.json())
      .then((data) => setAntrianData(data))
      .catch((err) => console.error("Fetch error:", err));
  };

  useEffect(() => {
    if (dosenId) {
      fetchAntrian();
    }
  }, [dosenId]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    if (isOpen) {
      setCountdown(60);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            closeModal();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isOpen, closeModal]);

  const handlePanggil = async (antrian: Antrian) => {
    try {
      const response = await fetch(`${baseUrl}/api/antrian/${antrian.id}/panggil`, {
        method: "PUT",
      });

      const contentType = response.headers.get("content-type") || "";
      let data = null;

      if (contentType.includes("application/json")) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data?.message || "Gagal memanggil mahasiswa");
      }

      setSelectedAntrian(antrian);
      openModal();

      console.log("Mahasiswa dipanggil pada:", data?.called_at);

      // ✅ Emit event ke mahasiswa
      const socket = getSocket();
      if (socket) {
        socket.emit("panggil_mahasiswa", {
          mahasiswa_id: antrian.mahasiswa_id,
          mahasiswa_nama: antrian.mahasiswa_name,
          antrian_id: antrian.id,
          waktu: data?.called_at,
        });
      }


      fetchAntrian();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error saat memanggil mahasiswa:", error);
        alert(error.message);
      } else {
        console.error("Error saat memanggil mahasiswa:", error);
        alert("Gagal memanggil mahasiswa");
      }
    }
  };

  const handleSudahHadir = async () => {
    if (!selectedAntrian) return;

    try {
      const response = await fetch(`${baseUrl}/api/update-status-pemanggilan/${selectedAntrian.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Status mahasiswa diperbarui menjadi 'Proses'");
        closeModal();
        fetchAntrian();
      } else {
        toast.error(data.message || "Gagal memperbarui status.");
      }
    } catch (error) {
      console.error("Error saat update status:", error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  const handleSelesai = (antrian: Antrian) => {
    setSelectedAntrian(antrian);
    setIsSelesaiOpen(true);
  };
  const handleBatalkan = (antrian: Antrian) => {
    setSelectedAntrian(antrian);
    setIsBatalkanOpen(true);
  };


  const handleSudahSelesai = async () => {
    if (!selectedAntrian) return;

    try {
      const response = await fetch(`${baseUrl}/api/update-status-pemanggilan-selesai/${selectedAntrian.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Status mahasiswa diperbarui menjadi 'Selesai'");
        setIsSelesaiOpen(false);
        fetchAntrian();
      } else {
        toast.error(data.message || "Gagal memperbarui status.");
      }
    } catch (error) {
      console.error("Error saat update status:", error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  const handleSudahDibatalkan = async () => {
    if (!selectedAntrian) return;

    try {
      const response = await fetch(`${baseUrl}/api/update-status-pemanggilan-batalkan/${selectedAntrian.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Status mahasiswa diperbarui menjadi 'Dibatalkan'");
        setIsBatalkanOpen(false);
        fetchAntrian();
      } else {
        toast.error(data.message || "Gagal memperbarui status.");
      }
    } catch (error) {
      console.error("Error saat update status:", error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  function getTimeAgo(waktuPendaftaran: string): string {
    const now = new Date();
    const waktu = new Date(waktuPendaftaran);
    const diffInMs = now.getTime() - waktu.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInMinutes < 1) return "(baru saja)";
    if (diffInMinutes < 60) return `(${diffInMinutes} menit yang lalu)`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `(${diffInHours} jam yang lalu)`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `(${diffInDays} hari yang lalu)`;
  }

  const handleRefresh = () => {
    fetchAntrian();
  };

  useEffect(() => {
    handleRefresh();
    const interval = setInterval(() => {
      handleRefresh();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  function toTitleCase(str: string | undefined): string {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  const antrianAktif = antrianData
    .filter(item => item.status === "menunggu" || item.status === "proses")
    .sort((a, b) => new Date(a.waktu_pendaftaran).getTime() - new Date(b.waktu_pendaftaran).getTime());

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Antrian Mahasiswa Anda Saat ini
          </h3>
        </div>
        <button onClick={handleRefresh} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
          <RotateCcw className="w-4 h-4" /> Refresh
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {antrianAktif.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 col-span-full text-center">
            Tidak ada antrian mahasiswa saat ini.
          </p>
        )}

        {antrianData
          .filter(item => item.status === "menunggu" || item.status === "proses")
          .sort((a, b) => new Date(a.waktu_pendaftaran).getTime() - new Date(b.waktu_pendaftaran).getTime())
          .map((item, index) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <img
                  src={
                    item.mahasiswa_foto
                      ? `https://pmb.uinsu.ac.id/file/photo/${item.mahasiswa_foto}`
                      : "/images/user/owner.jpg"
                  }
                  alt="User"
                  className="w-14 h-14 rounded-xl object-cover"
                />

                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    {toTitleCase(item.mahasiswa_name)}
                  </p>
                  <p className="text-gray-500 text-sm dark:text-gray-400">
                    {item.mahasiswa_nim} | {toTitleCase(item.mahasiswa_prodi)} ({item.mahasiswa_stambuk})
                  </p>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${item.status === "menunggu"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-white"
                    : "bg-green-100 text-green-800 dark:bg-green-800 dark:text-white"
                    }`}
                >
                  #{index + 1}
                </div>
              </div>


              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  <span className="font-medium text-gray-700 dark:text-white">
                    Waktu Pendaftaran <br />
                  </span>
                  {new Date(item.waktu_pendaftaran).toLocaleString()}{" "}
                  <span className="text-sm text-success-500">
                    {getTimeAgo(item.waktu_pendaftaran)}
                  </span>
                </p>

                <p>
                  <span className="font-medium text-gray-700 dark:text-white">
                    Kategori <br />
                  </span>{" "}
                  {item.tujuan?.startsWith("Bimbingan") ? "Bimbingan Skripsi" : "Bimbingan Akademik"}
                </p>

                <p>
                  <span className="font-medium text-gray-700 dark:text-white">
                    Tujuan <br />
                  </span>{" "}
                  {item.tujuan},  {item.alasan}
                </p>

                <p>
                  <span className="font-medium text-gray-700 dark:text-white">
                    Status
                  </span>{" "}
                  <Badge
                    size="sm"
                    color={
                      item.status === "proses"
                        ? "success"
                        : item.status === "menunggu"
                          ? "warning"
                          : item.status === "dibatalkan"
                            ? "error"
                            : "primary"
                    }
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Badge>
                </p>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 w-full">
                <Button
                  size="sm"
                  onClick={() => handleBatalkan(item)}
                  variant="danger"
                  className="w-full flex items-center gap-2 justify-center"
                >
                  <Trash2 size={16} />
                  Hapus
                </Button>

                <Button
                  size="sm"
                  onClick={() => handleSelesai(item)}
                  variant="success"
                  className="w-full flex items-center gap-2 justify-center"
                >
                  <CheckCircle size={16} />
                  Selesai
                </Button>
                <Button
                  onClick={() => handlePanggil(item)}
                  size="sm"
                  variant={item.status === "menunggu" ? "primary" : "outline"}
                  className="w-full flex items-center gap-2 justify-center"
                  disabled={item.status !== "menunggu"}
                >
                  <Megaphone size={16} />
                  Panggil
                </Button>



              </div>
            </div>
          ))}
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-xl min-h-[400px] m-4">
        <div className="relative w-full p-6 lg:p-10 overflow-y-auto rounded-2xl bg-white shadow-xl dark:bg-gray-900 transition-all duration-300">
          <div className="flex flex-col items-center text-center">
            <TimerIcon className="w-12 h-12 text-primary mb-4 font-semibold text-gray-800 dark:text-white animate-pulse" />
            <h4 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
              Sedang Memanggil Mahasiswa
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Sedang Memanggil Mahasiswa. Jika Mahasiswa belum datang juga saat dipanggil, Lewatkan saja dulu & Panggil Mahasiswa yang lain. Harap tunggu dalam waktu berikut...
            </p>

            <div className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 px-6 py-4 rounded-xl mb-6">
              <span className="text-5xl font-bold text-gray-800 dark:text-white">{countdown}</span>
              <span className="text-lg font-medium text-gray-600 dark:text-gray-300">detik</span>
            </div>

            <div className="w-full grid grid-cols-2 gap-2 mt-3 justify-end">
              <Button size="sm" variant="warning" className="w-full md:w-auto" onClick={closeModal}>
                Batalkan
              </Button>

              <Button size="sm" variant="success" className="w-full md:w-auto" onClick={handleSudahHadir}>
                <UserCheck size={16} /> Mahasiswa Sudah Hadir
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isSelesaiOpen}
        onClose={() => setIsSelesaiOpen(false)}
        className="max-w-lg m-4 animate-fade-in"
      >
        <div className="relative w-full p-6 lg:p-10 rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700 transition-all">
          <div className="flex flex-col items-center text-center space-y-4">
            <UserCheck className="w-14 h-14 text-green-600 dark:text-green-400" />

            <h4 className="text-2xl font-bold text-gray-800 dark:text-white">
              Konfirmasi Selesai
            </h4>

            <p className="text-gray-600 dark:text-gray-300">
              Apakah mahasiswa sudah hadir dan telah menyelesaikan proses bimbingan?
            </p>

            <div className="w-full grid grid-cols-2 gap-4 pt-6">

              <Button
                size="sm"
                variant="warning"
                className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700"
                onClick={() => setIsSelesaiOpen(false)}
              >
                <XCircle size={18} /> Batalkan
              </Button>

              <Button
                size="sm"
                variant="success"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleSudahSelesai}
              >
                <UserCheck size={18} /> Tandai Selesai
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isBatalkanOpen}
        onClose={() => setIsBatalkanOpen(false)}
        className="max-w-lg m-4 animate-fade-in"
      >
        <div className="relative w-full p-6 lg:p-10 rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700 transition-all">
          <div className="flex flex-col items-center text-center space-y-4">
            <UserX className="w-14 h-14 text-red-600 dark:text-red-400" />

            <h4 className="text-2xl font-bold text-gray-800 dark:text-white">
              Konfirmasi Hapus Dari Antrian
            </h4>

            <p className="text-gray-600 dark:text-gray-300">
              Apakah anda yakin ingin menghapus mahasiswa ini dari antrian? Tidak ingin Memanggilnya ulang atau mencoba panggil Mahasiswa Lain dulu?
            </p>

            <div className="w-full grid grid-cols-2 gap-4 pt-6">

              <Button
                size="sm"
                variant="warning"
                className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700"
                onClick={() => setIsBatalkanOpen(false)}
              >
                <XCircle size={18} /> Batalkan Hapus
              </Button>

              <Button
                size="sm"
                variant="danger"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleSudahDibatalkan}
              >
                <UserX size={18} /> Hapus dari Antrian
              </Button>
            </div>
          </div>
        </div>
      </Modal>

    </div>
  );
}