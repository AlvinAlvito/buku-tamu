import { useParams } from "react-router";
import Badge from "../ui/badge/Badge";
import { useEffect, useState } from "react";
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
  const [antrianData, setAntrianData] = useState<Antrian[]>([]);
  const [dosenId, setDosenId] = useState<number | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchDosenId = async () => {
      try {
        const res = await fetch("/api/ketersediaan/");
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
      fetch(`/api/antrian-dosen/${dosenId}`)
        .then((res) => res.json())
        .then((data) => setAntrianData(data))
        .catch((err) => console.error("Fetch error:", err));
    }
  }, [dosenId]);
  const handleRefresh = async () => {
    if (dosenId === null) return;

    try {
      const res = await fetch(`/api/antrian-dosen/${dosenId}`);
      if (!res.ok) throw new Error("Gagal fetch antrian dosen");
      const data = await res.json();
      setAntrianData(data);
    } catch (err) {
      console.error("Error saat refresh:", err);
    }
  };
  useEffect(() => {
    if (dosenId !== null) {
      handleRefresh(); // Memuat data pertama kali
    }
  }, [dosenId]);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Antrian Tamu Dosen
        </h3>

        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {antrianData.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 col-span-full text-center">
            Tidak ada antrian saat ini.
          </p>
        )}

        {antrianData.map((item) => (
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

          </div>
        ))}
      </div>


    </div>
  );
}
