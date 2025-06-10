
import { useParams } from "react-router";
import Badge from "../../ui/badge/Badge";
import { useEffect, useState } from "react";
import { baseUrl } from "../../../lib/api";
export default function IndosenasiKetersediaan() {

  const getEmbedUrl = (url: string | undefined): string => {
    const defaultLocation = "3.600840,98.681326";


    if (!url || url.trim() === "") {
      return `https://www.google.com/maps?q=${defaultLocation}&hl=es;z=14&output=embed`;
    }

    try {
      const urlObj = new URL(url);

      if (urlObj.hostname.includes("google.com") && urlObj.pathname.includes("/maps")) {
        const q = urlObj.searchParams.get("q");
        if (q) {
          return `https://www.google.com/maps?q=${encodeURIComponent(q)}&hl=es;z=14&output=embed`;
        } else {
          return `https://www.google.com/maps?q=${encodeURIComponent(url)}&hl=es;z=14&output=embed`;
        }
      }
    } catch {
      // Kalau url bukan URL valid, anggap itu koordinat langsung
      return `https://www.google.com/maps?q=${encodeURIComponent(url)}&hl=es;z=14&output=embed`;
    }

    // fallback
    return `https://www.google.com/maps?q=${defaultLocation}&hl=es;z=14&output=embed`;
  };
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
    waktu_mulai: string;
    waktu_selesai: string;
    created_at: string;
    updated_at: string;
  }

  const { id } = useParams<{ id: string }>();
  const [dosen, setDosen] = useState<Dosen | null>(null);

  useEffect(() => {
    const fetchDosen = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/daftar-dosen/${id}`);
        const result = await res.json();
        setDosen(result);
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


      <div className="p-5 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="grid grid-cols-2 gap-6  lg:items-start lg:justify-between">
         <div>
            <div className="grid grid-cols-1 gap-4 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Lokasi Kampus
                </p>
                <p className="text-xl font-medium text-gray-800 dark:text-white/90">
                  {dosen.lokasi_kampus}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Gedung/Ruangan
                </p>
                <p className="text-xl font-medium text-gray-800 dark:text-white/90">
                  {dosen.gedung_ruangan}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Jadwal Tetap Dosen
                </p>
                <p className="text-xl font-medium text-gray-800 dark:text-white/90">
                  Hari: {dosen.jadwal_libur}
                </p>
                <p className="text-xl font-medium text-gray-800 dark:text-white/90">
                  {dosen.waktu_mulai && dosen.waktu_selesai
                    ? `${dosen.waktu_mulai.slice(0, 5)} - ${dosen.waktu_selesai.slice(0, 5)}`
                    : "-"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Status Dosen Saat ini
                </p>
                <p className="text-xl font-medium text-gray-800 dark:text-white/90">
                  {dosen.status_ketersediaan ? (
                    <Badge variant="light" color="success">
                      Tersedia
                    </Badge>
                  ) : (
                    <Badge variant="light" color="error">
                      Tidak Tersedia
                    </Badge>
                  )}
                </p>
              </div>



            </div>


          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Titik Kordinat
            </p>
            <div className="relative rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700" style={{ height: 200 }}>
              <iframe
                width="100%"
                height="200"
                loading="lazy"
                allowFullScreen
                className="rounded-xl pointer-events-none"
                src={getEmbedUrl(dosen.link_maps)}
              ></iframe>

              <a
                href={dosen.link_maps || "https://www.google.com/maps?q=3.5952,98.6722"}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10"
                style={{ cursor: "pointer" }}
              ></a>
            </div>
          </div>
        </div>

      </div>


    </>
  );
}
