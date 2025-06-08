import { PhoneCall } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { baseUrl } from "../../../lib/api";

export default function InformasiUmum() {

  interface Dosen {
    id: number;
    user_id: number;
    name: string;
    nim: string;
    role: "mahasiswa" | "dosen";
    facebook: string | null;
    twitter: string | null;
    linkedin: string | null;
    instagram: string | null;
    whatsapp: string | null;
    bio: string | null;
    foto_profil: string | null;
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


  if (!dosen) return <p>Memuat data dosen...</p>;
  return (
    <>
      <div className="p-5 rounded-2xl border border-gray-200 bg-white  dark:border-gray-800 dark:bg-white/[0.03]  lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
             <img
                src={dosen.foto_profil ? dosen.foto_profil : "/images/user/user-01.jpg"}
                alt={dosen.name}
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {dosen.name} 
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {dosen.role}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  NIP {dosen.nim}
                </p>
              </div>
            </div>
            <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
              <a
                href={`https://wa.me/+62${dosen.whatsapp ?? ""}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              >
                <PhoneCall size={24}  />
              </a>

            </div>
          </div>

        </div>
      </div>

    </>
  );
}
