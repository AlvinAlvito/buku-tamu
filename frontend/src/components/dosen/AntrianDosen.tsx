import Badge from "../ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import { UserCheck, TimerIcon, Megaphone, CheckCircle, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

type Antrian = {
  id: number;
  mahasiswa_id: number;
  dosen_id: number;
  waktu_pendaftaran: string;
  alasan: string;
  status: "menunggu" | "proses" | "selesai" | "dibatalkan";
  mahasiswa_name: string;
  mahasiswa_foto: string;
  mahasiswa_role: string;
};
export default function AntrianDosen() {
  const { isOpen, openModal, closeModal } = useModal();
  const [countdown, setCountdown] = useState(60);
  const [antrianData, setAntrianData] = useState<Antrian[]>([]);
  const [selectedAntrian, setSelectedAntrian] = useState<Antrian | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const dosenId = user?.id || null;

  const fetchAntrian = () => {
    fetch(`/api/antrian-dosen/${dosenId}`)
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

  const handlePanggil = (antrian: Antrian) => {
    setSelectedAntrian(antrian);
    openModal();
  };

  const handleSudahHadir = async () => {
    if (!selectedAntrian) return;

    try {
      const response = await fetch(`/api/update-status-pemanggilan/${selectedAntrian.id}`, {
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

    const handleSudahSelesai = async () => {
    if (!selectedAntrian) return;

    try {
      const response = await fetch(`/api/update-status-pemanggilan-selesai/${selectedAntrian.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Status mahasiswa diperbarui menjadi 'Selesai'");
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

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Antrian Tamu Anda Saat ini
          </h3>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {antrianData.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 col-span-full text-center">
            Tidak ada antrian saat ini.
          </p>
        )}

        {antrianData
          .filter(item => item.status === "menunggu" || item.status === "proses")
          .map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 flex flex-col justify-between"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={item.mahasiswa_foto || "/images/user/user-01.jpg"}
                  alt={item.mahasiswa_name}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div>
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    {item.mahasiswa_name}
                  </p>
                  <p className="text-gray-500 text-sm dark:text-gray-400">
                    {item.mahasiswa_role}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  <span className="font-medium text-gray-700 dark:text-white">
                    Waktu <br />
                  </span>{" "}
                  {new Date(item.waktu_pendaftaran).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium text-gray-700 dark:text-white">
                    Tujuan <br />
                  </span>{" "}
                  {item.alasan}
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
                  onClick={() => handlePanggil(item)}
                  size="sm"
                  variant={item.status === "menunggu" ? "primary" : "outline"}
                  className="w-full flex items-center gap-2 justify-center"
                  disabled={item.status !== "menunggu"}
                >
                  <Megaphone size={16} />
                  Panggil
                </Button>

                <Button
                  size="sm"
                  onClick={handleSudahSelesai}
                  variant="success"
                  className="w-full flex items-center gap-2 justify-center"
                >
                  <CheckCircle size={16} />
                  Selesai
                </Button>

                <Button
                  size="sm"
                  variant="danger"
                  className="w-full flex items-center gap-2 justify-center"
                >
                  <Trash2 size={16} />
                  Hapus
                </Button>

              </div>
            </div>
          ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-xl min-h-[400px] m-4"
      >
        <div className="relative w-full p-6 lg:p-10 overflow-y-auto rounded-2xl bg-white shadow-xl dark:bg-gray-900 transition-all duration-300">
          <div className="flex flex-col items-center text-center">
            <TimerIcon className="w-12 h-12 text-primary mb-4 font-semibold text-gray-800 dark:text-white animate-pulse" />
            <h4 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
              Sedang Memanggil Mahasiswa
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Notifikasi pemanggilan telah dikirim. Harap tunggu dalam waktu
              berikut...
            </p>

            <div className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 px-6 py-4 rounded-xl mb-6">
              <span className="text-5xl font-bold text-gray-800 dark:text-white">
                {countdown}
              </span>
              <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                detik
              </span>
            </div>

            <div className="w-full flex mt-3 justify-end">
              <Button
                size="sm"
                variant="success"
                className="w-full md:w-auto"
                onClick={handleSudahHadir}
              >
                <UserCheck size={16} /> Mahasiswa Sudah Hadir
              </Button>

            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
