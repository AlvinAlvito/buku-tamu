import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "../ui/table";
  import Badge from "../ui/badge/Badge";
import { Link } from "react-router";
  
  // Define the TypeScript interface for the table rows
  interface Product {
    id: number; // Unique identifier for each product
    name: string; // Product name
    kategori: string; // Number of kategori (e.g., "1 Variant", "2 kategori")
    nip: string; // nip of the product
    lokasi: string; // lokasi of the product (as a string with currency symbol)
    image: string; // URL or path to the product image
    status: "Tersedia" |  "Tidak Tersedia"; // Status of the product
  }

  // Define the table data using the interface
  const tableData: Product[] = [
    {
      id: 1,
      name: "Armansyah M.Kom",
      kategori: "Dosen",
      nip: "1090292003",
      lokasi: "Kampus 4 Tuntungan, ruangan prodi ilmu komputer",
      status: "Tersedia",
      image: "/images/user/user-01.jpg",
    },
    {
      id: 2,
      name: "Abdul Hasibuan M.Kom",
      kategori: "Dosen",
      nip: "2090292003",
      lokasi: "Kampus 4 Tuntungan, ruangan prodi ilmu komputer",
      status: "Tersedia",
      image: "/images/user/user-02.jpg",
    },
    {
      id: 3,
      name: "Ucok Syahban M.Ag",
      kategori: "Dosen",
      nip: "2090292003",
      lokasi: "Kampus 2 Sutomo, ruangan aula gedung hanif",
      status: "Tersedia",
      image: "/images/user/user-02.jpg",
    },
    {
      id: 3,
      name: "Ucok Syahban M.Ag",
      kategori: "Dosen",
      nip: "2030292003",
      lokasi: "Kampus 2 Sutomo, ruangan aula gedung hanif",
      status: "Tersedia",
      image: "/images/user/user-03.jpg",
    },
    {
      id: 4,
      name: "Udin Petot M.M",
      kategori: "Dosen",
      nip: "2190292003",
      lokasi: "Kampus 2 Sutomo, ruangan rapat 1",
      status: "Tersedia",
      image: "/images/user/user-04.jpg",
    },
    {
      id: 5,
      name: "Sentot Prabuwijaya S.T M.Ag",
      kategori: "Dosen",
      nip: "2990292003",
      lokasi: "Kampus 1 Pancing, Gedung Biro",
      status: "Tersedia",
      image: "/images/user/user-05.jpg",
    },
    {
      id: 6,
      name: "Habib Zidan M.Pd",
      kategori: "Dosen",
      nip: "2990292003",
      lokasi: "-",
      status: "Tidak Tersedia",
      image: "/images/user/user-06.jpg",
    },
    {
      id: 7,
      name: "Siti Nurbayah M.Pd",
      kategori: "Dosen",
      nip: "1990292003",
      lokasi: "-",
      status: "Tidak Tersedia",
      image: "/images/user/user-07.jpg",
    },
    {
      id: 8,
      name: "Habib Riziq M.Pd",
      kategori: "Dosen",
      nip: "2440292003",
      lokasi: "-",
      status: "Tidak Tersedia",
      image: "/images/user/user-08.jpg",
    },
    {
      id: 9,
      name: "Nurhasanah M.Ag",
      kategori: "Dosen",
      nip: "1110292003",
      lokasi: "-",
      status: "Tidak Tersedia",
      image: "/images/user/user-09.jpg",
    },

  
  ];
  
  export default function DaftarDosen() {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Daftar Dosen & Pegawai 
            </h3>
          </div>
  
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
              <svg
                className="stroke-current fill-white dark:fill-gray-800"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.29004 5.90393H17.7067"
                  stroke=""
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.7075 14.0961H2.29085"
                  stroke=""
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                  fill=""
                  stroke=""
                  strokeWidth="1.5"
                />
                <path
                  d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                  fill=""
                  stroke=""
                  strokeWidth="1.5"
                />
              </svg>
              Filter
            </button>
            <div className="hidden lg:block">
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
                  placeholder="Cari Sesuatu..."
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                />

              </div>
            </form>
          </div>
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
                  Lokasi
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  NIP
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
                    <Link to="/mahasiswa/daftar-dosen/antrian" className="block hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2 transition ">
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
                    </Link>
                  </TableCell>

                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {product.lokasi}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {product.nip}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        product.status === "Tersedia"
                          ? "success"
                          : "error"
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
  