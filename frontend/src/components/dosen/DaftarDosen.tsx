
import Badge from "../ui/badge/Badge";
import { useEffect, useState } from "react";
import { initSocket, disconnectSocket } from "../../utils/socket";
import { RotateCcw } from "lucide-react";
import { baseUrl } from "../../lib/api";

interface Dosen {
  id: number;
  user_id: number;
  name: string;
  nim: string;
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/daftar-dosen`);
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("Gagal fetch data dosen:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchData();

    const token = localStorage.getItem("token") || "";
    const socket = initSocket(token);
    console.log("Socket initialized:", socket);

    socket.on("updateDaftarDosen", (updatedData: Dosen[]) => {
      console.log("Data dari socket updateDaftarDosen diterima:", updatedData);
      setData(updatedData);
    });

    const onUpdateDaftarDosen = (updatedData: Dosen[]) => {
      console.log("Data dari socket updateDaftarDosen diterima:", updatedData);
      setData(updatedData);
    };

    socket.on("connect", () => {
      console.log("Socket connected dengan id:", socket.id);

      socket.off("updateDaftarDosen");
      socket.on("updateDaftarDosen", onUpdateDaftarDosen);
    });


    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    console.log("Listener updateDaftarDosen attached");

    return () => {
      socket.off("updateDaftarDosen", onUpdateDaftarDosen);
      disconnectSocket();
    };
  }, []);

  const filteredData = data.filter((dosen) =>
    (dosen.name ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );
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

  // useEffect(() => {
  //   fetchData();
  //   const interval = setInterval(() => {
  //     fetchData();
  //   }, 10000);
  //   return () => clearInterval(interval);
  // }, []);

  if (loading) return <p>Memuat data dosen...</p>;

  return (
    <div className="overflow-hidden  rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Daftar Dosen 
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleRefresh} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
             <RotateCcw className="w-4 h-4" /> Refresh
          </button>
          <div className=" lg:block">
            <form>
              <div className="relative">
                <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                  <svg
                    className="fill-gray-500 dark:fill-gray-400"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                      fill=""
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Cari nama dosen..."
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
                  NIP: {dosen.nim}
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
