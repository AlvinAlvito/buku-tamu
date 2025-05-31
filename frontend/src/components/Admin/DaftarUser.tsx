
import { useEffect, useState } from "react";
import { RotateCcw, Search } from "lucide-react";
import { baseUrl } from "../../lib/api";
import Button from "../ui/button/Button";
import { Link, useParams } from "react-router";
import Select from "../form/Select";
import Badge from "../ui/badge/Badge";

interface User {
  id: number;
  name: string;
  nim: string;
  foto_profil: string;
  role: string;
  prodi: string;
  fakultas: string;
  stambuk: string;
  jumlah_antrian_berlangsung: number;
  jumlah_antrian_selesai: number;
}


export default function DaftarUser() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ role: "" });
  const itemsPerPage = 6;
  const { namaProdi } = useParams();

  const roleOptions = [
    { value: "", label: "Semua role" },
    { value: "mahasiswa", label: "Mahasiswa" },
    { value: "dosen", label: "Dosen" },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/admin/prodi/${encodeURIComponent(namaProdi || "")}/users`);
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("Gagal fetch data user:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filters.role === "" || item.role === filters.role;
    return matchesSearch && matchesRole;
  });

  useEffect(() => {
    fetchData();
  }, [namaProdi]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    fetchData();
  };
  function toTitleCase(str: string | undefined): string {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  if (loading) return <p>Memuat data pengguna...</p>;

  return (

    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">


      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Prodi {toTitleCase(namaProdi)}
        </h3>


        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            <RotateCcw className="w-4 h-4" /> Refresh
          </button>

          <Select
            options={roleOptions}
            value={filters.role}
            placeholder="Pilih Role"
            onChange={(val) => setFilters((prev) => ({ ...prev, role: val }))}
          />

          <div className="lg:block">
            <form>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari nama..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:placeholder:text-white/30"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Kartu user */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 flex flex-col justify-between"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={
                  item.foto_profil
                    ? item.foto_profil.startsWith("http")
                      ? item.foto_profil // untuk dosen: sudah full URL
                      : `https://pmb.uinsu.ac.id/file/photo/${item.foto_profil}` // untuk mahasiswa
                    : "/images/user/user-01.jpg" // default jika tidak ada foto
                }
                alt={item.name}
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div>
                <p className="font-medium text-gray-800 dark:text-white/90">
                  {item.name}
                </p>
                <p className="text-gray-500 text-sm dark:text-gray-400">
                  {item.nim} | {item.role} {item.stambuk}
                </p>
              </div>
            </div>

            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">

              <p>
                <span className="font-medium  ">Total Antrian Sedang Berlangsung <br /> <span className="text-xl">
                  <Badge
                    variant="light"
                    color="warning"
                    size="lg">
                    {item.jumlah_antrian_berlangsung}
                  </Badge> </span></span>
              </p>
              <p>
                <span className="font-medium ">Total Antrian Selesai <br /> <span className="text-xl">
                  <Badge
                    variant="light"
                    color="success"
                    size="lg">
                    {item.jumlah_antrian_selesai}
                  </Badge> </span></span>
              </p>
            </div>
            <Button variant="primary" size="sm" className="w-full my-2">
              <Link
                to={
                  item.role === "dosen"
                    ? `/admin/daftar-prodi/profil/dosen/${item.id}`
                    : `/admin/daftar-prodi/profil/mahasiswa/${item.id}`
                }
                className="block w-full text-center"
              >
                Lihat Profil
              </Link>
            </Button>

          </div>
        ))}
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
                ? "bg-green-600 text-white border-green-600"
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