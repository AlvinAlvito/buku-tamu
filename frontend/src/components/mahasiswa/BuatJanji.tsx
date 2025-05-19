import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { ChevronLeftIcon } from "../../icons";
import Alert from "../ui/alert/Alert";

export default function BuatJanji() {
  const { isOpen, openModal, closeModal } = useModal();
  const { id } = useParams();
  const [tanggal, setTanggal] = useState("");
  const [keperluan, setKeperluan] = useState("Meminta Ttd Sempro");
  const [showAlert, setShowAlert] = useState(false);



  const fetchDosenId = async (ketersediaanId: string): Promise<number> => {
    const res = await fetch("/api/ketersediaan");
    if (!res.ok) throw new Error("Gagal ambil data ketersediaan");
    const data = await res.json(); // data array ketersediaan

    // cari object dengan id === ketersediaanId
    const item = data.find((k: any) => String(k.id) === ketersediaanId);
    if (!item) throw new Error("Data ketersediaan tidak ditemukan");

    return item.user_id; // ini id dosen
  };



  const handleSave = async () => {
    try {
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const mahasiswaId = user?.id;
      if (!mahasiswaId) {
        console.error("Mahasiswa belum login!");
        return;
      }

      const dosenId = await fetchDosenId(id!);

      const ketersediaanRes = await fetch(`/api/ketersediaan/${dosenId}`);
      if (!ketersediaanRes.ok) throw new Error("Gagal mengambil data ketersediaan");

      const data = {
        mahasiswa_id: mahasiswaId,
        dosen_id: dosenId,
        alasan: keperluan,
        status: "menunggu",
        waktu_pendaftaran: tanggal,
      };

      const response = await fetch("/api/tambah-antrian", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Gagal menyimpan: ${text}`);
      }

      const result = await response.json();
      console.log("Berhasil:", result);

      setShowAlert(true);

      closeModal();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Terjadi kesalahan:", error.message);
      } else {
        console.error("Terjadi kesalahan yang tidak diketahui:", error);
      }
    }
  };


  useEffect(() => {
    const now = new Date();
    const isoString = now.toISOString();
    const localDateTime = isoString.slice(0, 16); // contoh: "2025-05-18T13:45"
    setTanggal(localDateTime);
  }, []);
  return (
    <>
      <div className="p-5 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <Link to="/mahasiswa" className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition">
            <ChevronLeftIcon className="size-5" />
            Kembali
          </Link>
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Buat Janji Temu
          </button>
        </div>

        <div className="flex flex-col gap-4 my-3">
          {showAlert && (
            <Alert
              variant="warning"
              title="Peringatan"
              message="Anda sudah ditambahkan ke dalam antrian dosen. Tetaplah berada di area sekitar dosen sambil menunggu dosen memanggil anda. Tetaplah siaga sampai notifikasi panggilan berbunyi."
            />
          )}

        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Buat Janji Temu Dengan Dosen Anda
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Jelaskan Keperluan Anda Agar Dosen Bisa Mengetahuinya
            </p>
          </div>

          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Waktu Pendaftaran</Label>
                  <Input
                    type="datetime-local"
                    value={tanggal}
                    readOnly
                    className="cursor-not-allowed bg-gray-100"
                  />
                </div>
                <div>
                  <Label>Keperluan</Label>
                  <Input type="text" value={keperluan} onChange={(e) => setKeperluan(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Tutup
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
              >
                Simpan
              </Button>


            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
