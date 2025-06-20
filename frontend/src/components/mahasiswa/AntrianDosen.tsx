import { useParams } from "react-router";
import Badge from "../ui/badge/Badge";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { RotateCcw, Trash2, UserX, XCircle } from "lucide-react";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import Alert from "../ui/alert/Alert";
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
  const [antrianData, setAntrianData] = useState<Antrian[]>([]);
  const [isBatalkanOpen, setIsBatalkanOpen] = useState(false);
  const [selectedAntrian, setSelectedAntrian] = useState<Antrian | null>(null);
  const [dosenId, setDosenId] = useState<number | null>(null);
  const { id } = useParams();
  const [mahasiswaId, setMahasiswaId] = useState<number | null>(null);
  const [isCooldown, setIsCooldown] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user && user.id) {
      setMahasiswaId(user.id);
    }
  }, []);


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
    if (dosenId !== null) {
      fetch(`${baseUrl}/api/antrian-dosen/${dosenId}`)
        .then((res) => res.json())
        .then((data) => setAntrianData(data))
        .catch((err) => console.error("Fetch error:", err));
    }
  }, [dosenId]);
  const handleRefresh = async (manual = false) => {
    if (dosenId === null) return;

    // Cegah klik manual saat cooldown
    if (manual && isCooldown) {
      setShowAlert(true);
      let counter = 5;
      setCountdown(counter);

      const countdownInterval = setInterval(() => {
        counter -= 1;
        setCountdown(counter);
        if (counter === 0) {
          clearInterval(countdownInterval);
          setShowAlert(false);
        }
      }, 1000);
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/api/antrian-dosen/${dosenId}`);
      if (!res.ok) throw new Error("Gagal fetch antrian dosen");
      const data = await res.json();
      setAntrianData(data);
    } catch (err) {
      console.error("Error saat refresh:", err);
    }

    // Aktifkan cooldown hanya untuk klik manual
    if (manual) {
      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 5000);
    }
  };

  useEffect(() => {
    handleRefresh();

    const interval = setInterval(() => {
      handleRefresh();
    }, 10000);

    return () => clearInterval(interval);
  }, [dosenId]);

  useEffect(() => {
    if (dosenId !== null) {
      handleRefresh();
    }
  }, [dosenId]);

  const handleBatalkan = (antrian: Antrian) => {
    setSelectedAntrian(antrian);
    setIsBatalkanOpen(true);
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
        handleRefresh();
      }
      else {
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

  function toTitleCase(str: string | undefined): string {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }


  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      {showAlert && (
        <Alert
          variant="warning"
          title="Peringatan"
          message={`Tunggu hingga ${countdown} detik lagi sebelum merefresh`}
        />
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Antrian Mahasiswa Dosen
        </h3>

        <button
          onClick={() => handleRefresh(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        >
          <RotateCcw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {antrianData.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 col-span-full text-center">
            Tidak ada antrian saat ini.
          </p>
        )}

        {antrianData
          .filter(item => item.status === "menunggu" || item.status === "proses")
          .sort((a, b) => new Date(a.waktu_pendaftaran).getTime() - new Date(b.waktu_pendaftaran).getTime())
          .map((item, index) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 flex flex-col "
            >

              <div className="flex items-center justify-between gap-4 mb-4">
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
                  {item.tujuan}, {item.alasan}
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
              {item.mahasiswa_id === mahasiswaId && (
                <div className="mt-4 grid  gap-2 w-full">
                  <Button
                    size="sm"
                    onClick={() => handleBatalkan(item)}
                    variant="danger"
                    className="w-full flex items-center gap-2 justify-center"
                  >
                    <Trash2 size={16} />
                    Batalkan Antrian
                  </Button>
                </div>
              )}

            </div>
          ))}
      </div>

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
              Apakah anda yakin ingin membatalkan antrian ?
            </p>

            <div className="w-full grid grid-cols-2 gap-4 pt-6">

              <Button
                size="sm"
                variant="warning"
                className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700"
                onClick={() => setIsBatalkanOpen(false)}
              >
                <XCircle size={18} /> Batalkan
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
