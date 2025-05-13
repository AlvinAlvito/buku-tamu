import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";

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

        <div className="flex items-center gap-3">


        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Nama
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Waktu
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Tujuan
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium  text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Panggil
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.map((product) => (
              <TableRow key={product.id} className="">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                      <img
                        src={product.image}
                        className="h-[50px] w-[50px]"
                        alt={product.name}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {product.name}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {product.kategori}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {product.waktu}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {product.tujuan}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
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
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {product.panggil === true
                    ? <Button onClick={openModal} className="mx-1" size="sm" variant="primary">
                      Panggil
                    </Button>
                    :
                    <Button className="mx-1" size="sm" variant="outline">
                      Panggil
                    </Button>
                  }
                  <Button className="mx-1" size="sm" variant="danger">
                    Hapus
                  </Button>
                  <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                    <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                      <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                          Sedang Memanggil Tamu Anda
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                          Notifikasi Pemanggilan Telah Dikirim Pada Tamu Anda. Harap Tunggu Dalam Waktu..
                        </p>
                      </div>
                      <div className="flex justify-center gap-2 font-large from-neutral-50">
                        <h4 className="mb-2 text-5xl font-semibold text-gray-800 dark:text-white/90">
                          {countdown} Detik
                        </h4>
                      </div>
                    </div>
                  </Modal>



                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>


  );
}
