import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { baseUrl } from "../../../lib/api";

export default function InformasiPersonal() {

  interface Dosen {
    id: number;
    user_id: number;
    name: string;
    nim: string;
    email: string;
    role: "mahasiswa" | "dosen";
    prodi: string;
    fakultas: string;
    facebook: string | null;
    twitter: string | null;
    linkedin: string | null;
    instagram: string | null;
    whatsapp: string | null;
    bio: string | null;
    foto_profil: string | null;
    lokasi_kampus: string;
    gedung_ruangan: string;
    link_maps: string;
    jadwal_libur: string;
    status_ketersediaan: "Tersedia" | "Tidak Tersedia";
    created_at: string;
    updated_at: string;
  }

  const { id } = useParams<{ id: string }>();
  const [dosen, setDosen] = useState<Dosen | null>(null);

useEffect(() => {
  const fetchDosen = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/admin/prodi/profil/dosen?id=${id}`);
      const result = await res.json();
      setDosen(result.profil);
    } catch (error) {
      console.error("Gagal memuat profil dosen:", error);
    }
  };

  if (id) {
    fetchDosen();
  }
}, [id]);
  function toTitleCase(str: string | undefined): string {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  if (!dosen) return <p>Memuat data dosen...</p>;

  return (
    <div className="p-5 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]  lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Infromasi Personal
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Nama
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {dosen.name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Role
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {toTitleCase(dosen.role)}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {dosen.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Prodi
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {toTitleCase(dosen.prodi)}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Fakultas
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {dosen.fakultas}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                No Whatsapp
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {dosen.whatsapp}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Bio
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {dosen.bio}
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
