
import { useEffect, useState } from "react";
import { RotateCcw, Search } from "lucide-react";
import { baseUrl } from "../../lib/api";
import Button from "../ui/button/Button";
import { Link } from "react-router";
import Badge from "../ui/badge/Badge";

interface Prodi {
  fakultas: string;
  prodi: string;
  jumlah_mahasiswa: string;
  jumlah_dosen: string;
  jumlah_antrian_berlangsung:number;
}

export default function DaftarProdi() {
  const [data, setData] = useState<Prodi[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 6;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/admin/prodi`);
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("Gagal fetch data prodi:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((item) =>
    (item.prodi ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, data]);

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

  if (loading) return <p>Memuat data prodi...</p>;

  return (
    <div className="overflow-hidden  rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Daftar Prodi
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleRefresh} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <RotateCcw className="w-4 h-4" /> Refresh
          </button>
          <div className=" lg:block">
            <form>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari prodi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                />

              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 flex flex-col justify-between"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src="/images/user/user-01.jpg"
                alt=""
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div>
                <p className="font-medium text-gray-800 dark:text-white/90">
                  {item.prodi}
                </p>
                <p className="text-gray-500 text-sm dark:text-gray-400">
                   {item.fakultas}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-md text-gray-700 dark:text-white mb-1">
                    Jumlah Mahasiswa
                  </span>
                  <span className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                    <Badge
                      variant="light"
                      color="primary"
                      size="lg">
                      {item.jumlah_mahasiswa}
                    </Badge>
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-md text-gray-700 dark:text-white mb-1">
                    Jumlah Dosen
                  </span>
                  <span className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                    <Badge
                    variant="light"
                    color="success"
                    size="lg">
                      {item.jumlah_dosen}
                    </Badge>
                  </span>
                </div>
              </div>

              <Button variant="primary" size="sm" className="w-full">
                <Link to={`/admin/daftar-prodi/${encodeURIComponent(item.prodi)}`} className="block w-full text-center">

                  Lihat
                </Link>
              </Button>
            </div>

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
