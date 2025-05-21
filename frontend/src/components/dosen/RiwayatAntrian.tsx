import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useEffect, useState } from "react";
import Select from "../form/Select";

type RiwayatItem = {
  nama_mahasiswa: string;
  nim_mahasiswa: string;
  foto_mahasiswa: string | null;
  prodi_mahasiswa: string;
  stambuk_mahasiswa: string;

  nama_dosen: string;
  nim_dosen: string;
  foto_dosen: string | null;

  waktu_selesai: string;
  status: string;
  alasan: string;
  waktu_pendaftaran: string;
};


export default function RiwayatAntrian() {
  const [allData, setAllData] = useState<RiwayatItem[]>([]);
  const [filteredData, setFilteredData] = useState<RiwayatItem[]>([]);
  const [filters, setFilters] = useState({ bulan: "", tahun: "" });


  const bulanOptions = [
    { value: "", label: "Semua Bulan" },
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  const tahunOptions = [
    { value: "", label: "Semua Tahun" },
    { value: "2025", label: "2025" },
    { value: "2026", label: "2026" },
    { value: "2027", label: "2027" },
    { value: "2028", label: "2028" },
    { value: "2029", label: "2029" },
    { value: "2030", label: "2030" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) throw new Error("User belum login");
        const user = JSON.parse(storedUser);
        const res = await fetch(`/api/riwayat?id=${user.id}&role=${user.role}`);
        const data = await res.json();
        setAllData(data);
        setFilteredData(data); // default tampil semua
      } catch (error) {
        console.error("Gagal memuat data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const result = allData.filter((item) => {
      const date = new Date(item.waktu_selesai);
      const bulan = (date.getMonth() + 1).toString();
      const tahun = date.getFullYear().toString();
      const cocokBulan = !filters.bulan || filters.bulan === bulan;
      const cocokTahun = !filters.tahun || filters.tahun === tahun;
      return cocokBulan && cocokTahun;
    });

    setFilteredData(result);
  }, [filters, allData]);



  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Riwayat Bimbingan Akademik
        </h3>
        <div className="flex items-center gap-3">
          <Select
            options={bulanOptions}
            value={filters.bulan}
            placeholder="Pilih Bulan"
            onChange={(val) => setFilters(prev => ({ ...prev, bulan: val }))}
          />

          <Select
            options={tahunOptions}
            value={filters.tahun}
            placeholder="Pilih Tahun"
            onChange={(val) => setFilters(prev => ({ ...prev, tahun: val }))}
          />
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Unduh Riwayat
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Nama
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Waktu
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Tujuan
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                      <img
                        src={
                          item.foto_mahasiswa
                            ? item.foto_mahasiswa
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(item.nama_mahasiswa || "Mahasiswa")}`
                        }
                        alt={item.nama_mahasiswa || "Mahasiswa"}
                        className="h-[50px] w-[50px] object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {item.nama_mahasiswa}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {item.nim_mahasiswa} | {item.prodi_mahasiswa} ({item.stambuk_mahasiswa})
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {item.waktu_selesai
                    ? new Date(item.waktu_selesai).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                    : "-"}
                </TableCell>

                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {item.alasan || "-"}
                </TableCell>

                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      item.status === "selesai"
                        ? "success"
                        : item.status === "menunggu"
                          ? "warning"
                          : item.status === "dibatalkan"
                            ? "error"
                            : "primary"
                    }
                  >
                    {item.status}
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
