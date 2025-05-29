import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useEffect, useState } from "react";
import Select from "../form/Select";
import { baseUrl } from "../../lib/api";


type LogUser = {
  name: string;
  nim: string;
  foto_profil: string | null;
  role: string;
  prodi: string | null;
  stambuk: string | null;
  created_at: string;

};

export default function LogUser() {
  const [allData, setAllData] = useState<LogUser[]>([]);
  const [filteredData, setFilteredData] = useState<LogUser[]>([]);
  const [filters, setFilters] = useState<{ prodi: string; role: string }>({ prodi: "", role: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

   const prodiOptions = [
    { value: "", label: "Semua Prodi" },
    ...Array.from(new Set(allData.map(item => item.prodi).filter(Boolean))).map(p => ({
      value: p!,
      label: p!,
    }))
  ];

  const roleOptions = [
    { value: "", label: "Semua Role" },
    { value: "mahasiswa", label: "Mahasiswa" },
    { value: "dosen", label: "Dosen" },
  ];


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/profil/log-user`);
        const data = await res.json();
        setAllData(data);
        setFilteredData(data);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      }
    };
    fetchData();
  }, []);

 useEffect(() => {
    let filtered = allData;

    if (filters.prodi) {
      filtered = filtered.filter(item => item.prodi === filters.prodi);
    }

    if (filters.role) {
      filtered = filtered.filter(item => item.role === filters.role);
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [filters, allData]);
  // Pagination calculation
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
          Log User | Total User: {filteredData.length} <br /> Mahasiswa : {filteredData.filter(item => item.role === "mahasiswa").length}, Dosen : {filteredData.filter(item => item.role === "dosen").length}
        </h3>
        <div className="flex items-center gap-3">
          <Select
            options={prodiOptions}
            value={filters.prodi}
            placeholder="Pilih Prodi"
            onChange={(val) => setFilters(prev => ({ ...prev, prodi: val }))}
          />
          <Select
            options={roleOptions}
            value={filters.role}
            placeholder="Pilih Role"
            onChange={(val) => setFilters(prev => ({ ...prev, role: val }))}
          />
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
                Prodi
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Stambuk
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Role
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Tanggal Registrasi
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
                          item.foto_profil
                            ? `https://pmb.uinsu.ac.id/file/photo/${item.foto_profil}`
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}`
                        }
                        alt={item.name}
                        className="h-[50px] w-[50px] object-cover"
                      />

                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {item.name}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {item.nim || "-"}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {item.prodi || "-"}
                </TableCell>

                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {item.stambuk || "-"}
                </TableCell>

                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge size="sm" color={item.role === "dosen" ? "primary" : "success"}>
                    {item.role}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {new Date(item.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
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
