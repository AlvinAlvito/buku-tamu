
import Badge from "../ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import { TimerIcon } from "lucide-react";

interface Product {
  id: number;
  name: string;
  kategori: string;
  tujuan: string;
  waktu: string;
  image: string;
  status: "Proses" | "Menunggu" | "Dibatalkan" | "Selesai";
  panggil: boolean;
}

// Define the table data using the interface
const tableData: Product[] = [
  {
    id: 1,
    name: "Riski Maulana",
    kategori: "Mahasiswa",
    tujuan: "Ingin Meminta TTD Sempro",
    waktu: "5 Menit yang lalu",
    status: "Proses",
    image: "/images/user/user-01.jpg", // Replace with actual image URL
    panggil: false,
  },
  {
    id: 2,
    name: "Zikri Pinem",
    kategori: "Mahasiswa",
    tujuan: "Bimbingan Terakhir kali",
    waktu: "10 Menit yang lalu",
    status: "Menunggu",
    image: "/images/user/user-02.jpg", // Replace with actual image URL
    panggil: true,
  },
  {
    id: 3,
    name: "Dimas Yudistira",
    kategori: "Mahasiswa",
    tujuan: "Meminta Ttd Sempro",
    waktu: "15 Menit yang lalu",
    status: "Menunggu",
    image: "/images/user/user-03.jpg", // Replace with actual image URL
    panggil: true,
  },
  {
    id: 4,
    name: "Alex Yudistira",
    kategori: "Mahasiswa",
    tujuan: "Daftar Ulang",
    waktu: "18 Menit yang lalu",
    status: "Menunggu",
    image: "/images/user/user-04.jpg", // Replace with actual image URL
    panggil: true,
  },
  {
    id: 5,
    name: "Alvin Alvito",
    kategori: "Mahasiswa",
    tujuan: "Bimbingan dan Kumpul Tugas",
    waktu: "19 Menit yang lalu",
    status: "Dibatalkan",
    image: "/images/user/user-05.jpg", // Replace with actual image URL
    panggil: false,
  },

];



export default function RecentOrders() {
  const { isOpen, openModal, closeModal } = useModal();
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    if (isOpen) {
      setCountdown(60); // Reset countdown setiap modal dibuka
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            closeModal(); // Tutup modal jika countdown 0
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isOpen, closeModal]);
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
        {tableData.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 flex flex-col justify-between"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div>
                <p className="font-medium text-gray-800 dark:text-white/90">
                  {product.name}
                </p>
                <p className="text-gray-500 text-sm dark:text-gray-400">
                  {product.kategori}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p><span className="font-medium text-gray-700 dark:text-white">Waktu:</span> {product.waktu}</p>
              <p><span className="font-medium text-gray-700 dark:text-white">Tujuan:</span> {product.tujuan}</p>
              <p>
                <span className="font-medium text-gray-700 dark:text-white">Status:</span>{" "}
                <Badge
                  size="sm"
                  color={
                    product.status === "Proses"
                      ? "success"
                      : product.status === "Menunggu"
                        ? "warning"
                        : product.status === "Dibatalkan"
                          ? "error"
                          : "primary"
                  }
                >
                  {product.status}
                </Badge>
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 w-full">
              {product.panggil === true ? (
                <Button onClick={openModal} size="sm" variant="primary" className="w-full">
                  Panggil
                </Button>
              ) : (
                <Button size="sm" variant="outline" className="w-full">
                  Panggil
                </Button>
              )}
              <Button size="sm" variant="success" className="w-full">
                Selesai
              </Button>
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
                    Notifikasi pemanggilan telah dikirim. Harap tunggu dalam waktu berikut...
                  </p>

                  <div className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 px-6 py-4 rounded-xl mb-6">
                    <span className="text-5xl font-bold text-gray-800 dark:text-white">
                      {countdown}
                    </span>
                    <span className="text-lg font-medium text-gray-600 dark:text-gray-300">detik</span>
                  </div>

                  <div className="w-full flex mt-3 justify-end">
                    <Button size="sm" variant="success" className="w-full md:w-auto">
                      Mahasiswa Sudah Hadir
                    </Button>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        ))}
      </div>

    </div>


  );
}
