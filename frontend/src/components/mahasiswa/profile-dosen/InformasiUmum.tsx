import { PhoneCall, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { baseUrl } from "../../../lib/api";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import { useModal } from "../../../hooks/useModal";

export default function InformasiUmum() {



  interface Dosen {
    id: number;
    user_id: number;
    name: string;
    nim: string;
    email: string;
    role: "mahasiswa" | "dosen";
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

  const { isOpen, openModal, closeModal } = useModal();

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
                href={`https://wa.me/62${dosen.whatsapp ?? ""}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              >
                <PhoneCall size={24} />
              </a>

              <button
                onClick={openModal}
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow hover:bg-gray-50 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              >
                <User size={24} />
              </button>

              <Modal isOpen={isOpen} onClose={closeModal} className="max-w-3xl m-4">
                <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900 overflow-y-auto max-h-[90vh]">
                  {/* Header */}
                  <div className="mb-6">
                    <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                      Profil Dosen
                    </h4>
                  </div>

                  {/* Content */}
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div>
                      <p className="text-md text-gray-500 dark:text-gray-400 mb-1">Nama</p>
                      <p className="text-lg font-medium text-gray-800 dark:text-white/90">{dosen.name}</p>
                    </div>

                    <div>
                      <p className="text-md text-gray-500 dark:text-gray-400 mb-1">Role</p>
                      <p className="text-lg font-medium text-gray-800 dark:text-white/90">{dosen.role}</p>
                    </div>

                    <div>
                      <p className="text-md text-gray-500 dark:text-gray-400 mb-1">Email</p>
                      <p className="text-lg font-medium text-gray-800 dark:text-white/90">{dosen.email}</p>
                    </div>

                    <div>
                      <p className="text-md text-gray-500 dark:text-gray-400 mb-1">No Whatsapp</p>
                      <p className="text-lg font-medium text-gray-800 dark:text-white/90">{dosen.whatsapp}</p>
                    </div>

                    <div className="lg:col-span-2">
                      <p className="text-md text-gray-500 dark:text-gray-400 mb-1">Bio</p>
                      <p className="text-lg font-medium text-gray-800 dark:text-white/90">{dosen.bio}</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-8 flex justify-end">
                    <Button size="sm" variant="outline" onClick={closeModal}>
                      Tutup
                    </Button>
                  </div>
                </div>
              </Modal>

            </div>
          </div>

        </div>
      </div>

    </>
  );
}
