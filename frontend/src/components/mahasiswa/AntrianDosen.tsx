import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";


// Define the TypeScript interface for the table rows
interface Product {
  id: number; // Unique identifier for each product
  name: string; // Product name
  kategori: string; // Number of kategori (e.g., "1 Variant", "2 kategori")
  tujuan: string; // tujuan of the product
  waktu: string; // waktu of the product (as a string with currency symbol)
  // status: string; // Status of the product
  image: string; // URL or path to the product image
  status: "Proses" | "Menunggu" | "Dibatalkan" | "Selesai"; // Status of the product
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
  },
  {
    id: 2,
    name: "Zikri Pinem",
    kategori: "Mahasiswa",
    tujuan: "Bimbingan Terakhir kali",
    waktu: "10 Menit yang lalu",
    status: "Menunggu",
    image: "/images/user/user-02.jpg", // Replace with actual image URL
  },
  {
    id: 3,
    name: "Dimas Yudistira",
    kategori: "Mahasiswa",
    tujuan: "Meminta Ttd Sempro",
    waktu: "15 Menit yang lalu",
    status: "Menunggu",
    image: "/images/user/user-03.jpg", // Replace with actual image URL
  },
  {
    id: 4,
    name: "Alex Yudistira",
    kategori: "Mahasiswa",
    tujuan: "Daftar Ulang",
    waktu: "18 Menit yang lalu",
    status: "Menunggu",
    image: "/images/user/user-04.jpg", // Replace with actual image URL
  },
  {
    id: 5,
    name: "Alvin Alvito",
    kategori: "Mahasiswa",
    tujuan: "Bimbingan dan Kumpul Tugas",
    waktu: "19 Menit yang lalu",
    status: "Dibatalkan",
    image: "/images/user/user-05.jpg", // Replace with actual image URL
  },

];

export default function AntrianDosen() {
  return (

    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Antrian Tamu Dosen Saat ini
          </h3>
        </div>

        <div className="flex items-center gap-3">


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
                className="w-14 h-14 rounded-3xl object-cover"
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
              <p><span className="font-medium text-gray-700 dark:text-white">Waktu  <br /></span> {product.waktu}</p>
              <p><span className="font-medium text-gray-700 dark:text-white">Tujuan <br /></span> {product.tujuan}</p>
              <p>
                <span className="font-medium text-gray-700 dark:text-white">Status </span>{" "}
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

          </div>
        ))}
      </div>
    </div>

  );
}
