
import Badge from "../ui/badge/Badge";
import { Link } from "react-router";
import Button from "../ui/button/Button";
import { useEffect, useState } from "react";
import { RotateCcw, ExternalLink, SearchCheck } from "lucide-react";
import Alert from "../ui/alert/Alert";
import { baseUrl } from "../../lib/api";
import Select from "../form/Select";

interface Dosen {
  id: number;
  user_id: number;
  name: string;
  nim: string;
  fakultas: string;
  prodi: string;
  foto_profil: string | null;
  lokasi_kampus: string;
  gedung_ruangan: string;
  link_maps: string;
  jadwal_libur: string;
  status_ketersediaan: "Tersedia" | "Tidak Tersedia";
}

export default function DaftarDosen() {
  const [data, setData] = useState<Dosen[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 6;
  const [isCooldown, setIsCooldown] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showAlert, setShowAlert] = useState(false);
  const [filters, setFilters] = useState({ fakultas: "" });
  const [fakultasList, setFakultasList] = useState<{ value: string; label: string }[]>([
    { value: "", label: "Semua Fakultas" },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/daftar-dosen`);
      const result: Dosen[] = await res.json();
      setData(result);

      // Normalisasi: trim dan kapitalisasi agar konsisten
      const normalizedFakultas = result
        .map((d) => d.fakultas?.trim())
        .filter(Boolean)
        .map((f) =>
          f
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase()) // to Title Case
        );

      const uniqueFakultas = Array.from(new Set(normalizedFakultas));

      const options = [
        { value: "", label: "Semua Fakultas" },
        ...uniqueFakultas.map((f) => ({ value: f, label: f })),
      ];

      setFakultasList(options);
    } catch (err) {
      console.error("Gagal fetch data dosen:", err);
    } finally {
      setLoading(false);
    }
  };


  const sortedData = [...data].sort((a, b) => {
    if (a.status_ketersediaan === "Tersedia" && b.status_ketersediaan !== "Tersedia") return -1;
    if (a.status_ketersediaan !== "Tersedia" && b.status_ketersediaan === "Tersedia") return 1;
    return 0;
  });

  const filteredData = sortedData.filter((dosen) => {
    const matchNama = (dosen.name ?? "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchFakultas =
      filters.fakultas === "" ||
      (dosen.fakultas?.toLowerCase().trim() === filters.fakultas.toLowerCase().trim());

    return matchNama && matchFakultas;
  });

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
    if (isCooldown) {
      setShowAlert(true);
      let counter = 5;
      setCountdown(counter);

      const countdownInterval = setInterval(() => {
        counter -= 1;
        setCountdown(counter);
        if (counter === 0) {
          clearInterval(countdownInterval);
          setShowAlert(false);
        }
      }, 1000);

      return;
    }

    // Jalankan fungsi fetch
    fetchData();

    // Mulai cooldown
    setIsCooldown(true);
    setTimeout(() => {
      setIsCooldown(false);
    }, 5000);
  };


  useEffect(() => {
    fetchData();

    const retryTimeout = setTimeout(() => {
      if (data.length === 0) {
        console.log("Data kosong, mencoba ulang fetch...");
        fetchData();
      }
    }, 1);

    return () => clearTimeout(retryTimeout);
  }, []);

  if (loading) return <p>Memuat data dosen...</p>;

  return (
    <div className="overflow-hidden  rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      {showAlert && (
        <Alert
          variant="warning"
          title="Peringatan"
          message={`Tunggu hingga ${countdown} detik lagi sebelum merefresh`}
        />
      )}
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Daftar Dosen
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-center lg:gap-3">
          {/* Refresh Button - 50% on mobile */}
          <div className="sm:col-span-1 w-full lg:w-auto">
            <button
              onClick={handleRefresh}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            >
              <RotateCcw className="w-4 h-4" /> Refresh
            </button>
          </div>

          {/* Select Fakultas - 50% on mobile */}
          <div className="sm:col-span-1 w-full lg:w-auto">
            <Select
              options={fakultasList}
              value={filters.fakultas}
              placeholder="Pilih Fakultas"
              onChange={(val) => setFilters((prev) => ({ ...prev, fakultas: val }))}
              className="w-full"
            />
          </div>

          {/* Search Input - full width in mobile */}
          <div className="col-span-full sm:col-span-2 w-full lg:flex-1">
            <form>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <SearchCheck className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </span>
                <input
                  type="text"
                  placeholder="Cari nama dosen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-dark-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </form>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 col-span-full text-center">
            Tidak ada dosen yang tersedia.
          </p>
        )}
        {currentItems.map((dosen) => (
          <div
            key={dosen.id}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 flex flex-col justify-between"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={dosen.foto_profil ? dosen.foto_profil : "/images/user/user-01.jpg"}
                alt={dosen.name}
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div>
                <p className="font-medium text-gray-800 dark:text-white/90">
                  {dosen.name}
                </p>
                <p className="text-gray-500 text-sm dark:text-gray-400">
                  NIP: {dosen.nim} | {dosen.fakultas}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <span className="font-medium text-gray-700 dark:text-white">
                  Lokasi Kampus: <br />
                </span>
                {dosen.lokasi_kampus}
              </p>
              <p>
                <span className="font-medium text-gray-700 dark:text-white">
                  Ruangan: <br />
                </span>
                {dosen.gedung_ruangan}
              </p>
              <p>
                <span className="font-medium text-gray-700 dark:text-white">
                  Status{" "}
                </span>
                <Badge
                  size="sm"
                  color={
                    dosen.status_ketersediaan === "Tersedia"
                      ? "success"
                      : "error"
                  }
                >
                  {dosen.status_ketersediaan}
                </Badge>
              </p>
            </div>

            <div className="mt-4 gap-2 w-full">
              <Link to={`/mahasiswa/daftar-dosen/antrian/${dosen.id}`}>
                <Button size="sm" variant="success" className="w-full">
                  <ExternalLink className="w-4 h-4" /> Buat Antrian
                </Button>
              </Link>
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
