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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>

  );
}
