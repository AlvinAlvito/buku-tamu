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
import Button from "../ui/button/Button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { baseUrl } from "../../lib/api";


type RiwayatItem = {
  nama_mahasiswa: string;
  nim_mahasiswa: string;
  foto_mahasiswa: string | null;
  prodi_mahasiswa: string;
  fakultas_mahasiswa: string;
  stambuk_mahasiswa: string;

  nama_dosen: string;
  nim_dosen: string;
  foto_dosen: string | null;

  waktu_selesai: string;
  status: string;
  tujuan: string;
  alasan: string;
  waktu_pendaftaran: string;
};


export default function RiwayatAntrian() {
  const [allData, setAllData] = useState<RiwayatItem[]>([]);
  const [filteredData, setFilteredData] = useState<RiwayatItem[]>([]);
  const [filters, setFilters] = useState({ bulan: "", tahun: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


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
        const res = await fetch(`${baseUrl}/api/riwayat?id=${user.id}&role=${user.role}`);
        const data = await res.json();
        setAllData(data);
        setCurrentPage(1);
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


  const downloadPdf = (data: RiwayatItem[], filters: { bulan: string; tahun: string }) => {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = (text: string) => (pageWidth - doc.getTextWidth(text)) / 2;

    // 🔰 Logo dari /public/logo-uinsu.png
    const logoImg = new Image();
    logoImg.src = "/logo-uinsu.png";

    logoImg.onload = () => {
      doc.addImage(logoImg, "PNG", 14, 10, 20, 20);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("KEMENTERIAN AGAMA", centerX("KEMENTERIAN AGAMA"), 14);

      doc.setFontSize(15);
      doc.text("UNIVERSITAS ISLAM NEGERI SUMATERA UTARA", centerX("UNIVERSITAS ISLAM NEGERI SUMATERA UTARA"), 20);

      const rawFakultas = data[0]?.fakultas_mahasiswa || "";
      const fakultasUpper = `FAKULTAS ${rawFakultas}`.toUpperCase();

      doc.setFontSize(12);
      doc.text(fakultasUpper, centerX(fakultasUpper), 26); // GANTI dari 24 → 26

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      const alamat = "Jalan Williem Iskandar Pasar V Medan Estate 20371, Telp. (061) 6615683, 6622925";
      doc.text(alamat, centerX(alamat), 32);


      // 🔰 Garis pembatas
      doc.setLineWidth(0.5);
      doc.line(14, 36, pageWidth - 14, 36);

      // 🔰 Judul
      let title = "RIWAYAT BIMBINGAN AKADEMIK KESELURUHAN";
      if (filters.tahun && filters.bulan) {
        const bulanLabel = bulanOptions.find(b => b.value === filters.bulan)?.label || filters.bulan;
        title = `RIWAYAT BIMBINGAN AKADEMIK TAHUN ${filters.tahun} BULAN ${bulanLabel}`;
      } else if (filters.tahun) {
        title = `RIWAYAT BIMBINGAN AKADEMIK TAHUN ${filters.tahun}`;
      }

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(title, centerX(title), 44);

      // 🔰 Info Dosen dan Tanggal
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      if (data.length > 0) {
        const { nama_dosen, nim_dosen } = data[0];
        doc.text(`Nama Dosen: ${nama_dosen}`, 14, 52);
        doc.text(`NIP: ${nim_dosen}`, 14, 58);
      }

      const tanggalDownload = new Date().toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric",
      });
      doc.text(`Tanggal Unduh: ${tanggalDownload}`, 14, 64);

      // 🔰 Tabel
      const tableColumn = ["No", "Nama Mahasiswa", "NIM", "Prodi", "Tanggal Bimbingan", "Waktu Bimbingan", "Tujuan", "Status"];
      const tableRows = data.map((item, index) => [
        index + 1,
        item.nama_mahasiswa,
        item.nim_mahasiswa,
        item.prodi_mahasiswa,
        new Date(item.waktu_selesai).toLocaleDateString("id-ID"),
        new Date(item.waktu_selesai).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }) + " WIB",
        item.tujuan + ". " + item.alasan,
        item.status,
      ]);


      autoTable(doc, {
        startY: 70,
        head: [tableColumn],
        body: tableRows,
        styles: {
          font: 'helvetica',
          fontSize: 9,
          textColor: '#000000',
          fillColor: [255, 255, 255], // putih / transparan
          cellPadding: 3,
          halign: 'left',
          valign: 'middle',
          lineWidth: 0.5,
          lineColor: '#000000',
        },
        headStyles: {
          fontStyle: 'bold',
          halign: 'center',
          fillColor: [255, 255, 255], // header putih juga
          textColor: '#000000',
          lineWidth: 0.5,
          lineColor: '#000000',
        },
        bodyStyles: {
          fontStyle: 'normal',
          halign: 'left', // rata kiri
        },
        columnStyles: {
          0: { halign: 'center' }, // NO
          1: { halign: 'left' }, // NAMA
          2: { halign: 'center' }, // NIM
          3: { halign: 'left' }, // PRODI
          4: { halign: 'left' }, // TANGGAL
          5: { halign: 'center' }, // WAKTU
          6: { halign: 'left' }, // TUJUAN
          7: { halign: 'left' }, // STATUS

        },
        tableLineWidth: 0.1,
        tableLineColor: '#000000',
        theme: 'grid', // grid = semua border aktif
      });


      doc.save("Riwayat_Bimbingan_UINSU.pdf");
    };
  };




  function toTitleCase(str: string | undefined): string {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Pagination handler
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

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
          <Button
            size="sm"
            variant="outline"
            className="w-full flex items-center gap-2 justify-center"
            onClick={() => downloadPdf(filteredData, filters)}
          >
            <Download size={16} />
            Unduh
          </Button>

        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Nama Mahasiswa
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Tanggal Bimbingan
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Waktu Bimbingan
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Tujuan Bimbingan
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                      <img
                        src={
                          item.foto_mahasiswa
                            ? `https://pmb.uinsu.ac.id/file/photo/${item.foto_mahasiswa}`
                            : "/images/user/owner.jpg"
                        }
                        alt={item.nama_mahasiswa || "Mahasiswa"}
                        className="h-[50px] w-[50px] object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {toTitleCase(item.nama_mahasiswa)}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {item.nim_mahasiswa} | {toTitleCase(item.prodi_mahasiswa)} ({item.stambuk_mahasiswa})
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
                  {item.waktu_selesai
                    ? new Date(item.waktu_selesai).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                    : "-"} WIB
                </TableCell>


                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {item.tujuan}, {item.alasan}
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

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border border-gray-300 dark:border-gray-700 disabled:opacity-50 dark:text-gray-200"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, idx) => {
          const pageNum = idx + 1;
          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-3 py-1 rounded border ${pageNum === currentPage
                ? "bg-green-600 text-white border-green-600 dark:text-gray-200"
                : "border-gray-300 dark:border-gray-700"
                }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border border-gray-300 dark:border-gray-700 disabled:opacity-50 dark:text-gray-200"
        >
          Next
        </button>
      </div>
    </div>
  );
}
