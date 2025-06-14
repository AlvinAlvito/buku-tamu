import { useEffect, useState } from "react";
import { useParams, Link, unstable_usePrompt } from "react-router-dom";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { ChevronLeftIcon } from "../../icons";
import Alert from "../ui/alert/Alert";
import { baseUrl } from "../../lib/api";
import Select from "../form/Select";

export default function BuatJanji() {
  const { isOpen, openModal, closeModal } = useModal();
  const { id } = useParams();
  const [tanggal, setTanggal] = useState("");
  const [tujuan, setTujuan] = useState("");
  const [tujuanError, setTujuanError] = useState("");
  const [keperluan, setKeperluan] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [, setAntrianData] = useState<any[]>([]);
  const [mahasiswaId, setMahasiswaId] = useState<number | null>(null);
  const [dosenId, setDosenId] = useState<number | null>(null);

  const tujuanOptions = [
    { value: "Bimbingan Skripsi / Tugas Akhir", label: "Bimbingan Skripsi / Tugas Akhir" },
    { value: "Konsultasi Akademik", label: "Konsultasi Akademik" },
    { value: "Konsultasi Nilai Mata Kuliah", label: "Konsultasi Nilai Mata Kuliah" },
    { value: "Revisi Tugas / Ujian", label: "Revisi Tugas / Ujian" },
    { value: "Pengajuan Judul Skripsi", label: "Pengajuan Judul Skripsi" },
    { value: "Persetujuan KRS / KHS", label: "Persetujuan KRS / KHS" },
    { value: "Tanda Tangan Dokumen Akademik", label: "Tanda Tangan Dokumen Akademik" },
    { value: "Pendampingan PKL / Magang", label: "Pendampingan PKL / Magang" },
    { value: "Diskusi Kegiatan Kampus / Organisasi", label: "Diskusi Kegiatan Kampus / Organisasi" },
    { value: "Pengurusan Administrasi Akademik", label: "Pengurusan Administrasi Akademik" },
    { value: "Pembimbingan Lomba / Kompetisi", label: "Pembimbingan Lomba / Kompetisi" },
    { value: "Lainnya", label: "Lainnya" },
  ];


  const fetchDosenId = async (ketersediaanId: string): Promise<number> => {
    const res = await fetch(`${baseUrl}/api/ketersediaan`);
    if (!res.ok) throw new Error("Gagal ambil data ketersediaan");
    const data = await res.json();

    const item = data.find((k: any) => String(k.id) === ketersediaanId);
    if (!item) throw new Error("Data ketersediaan tidak ditemukan");

    return item.user_id;
  };

  const handleSave = async () => {
    try {
      // Validasi: tujuan tidak boleh kosong
      if (!tujuan) {
        setTujuanError("Tujuan janji temu wajib diisi");
        return;
      } else {
        setTujuanError(""); // reset error kalau sudah diisi
      }

      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const mahasiswaId = user?.id;
      if (!mahasiswaId) {
        console.error("Mahasiswa belum login!");
        return;
      }

      const dosenId = await fetchDosenId(id!);

      const ketersediaanRes = await fetch(`${baseUrl}/api/ketersediaan/${dosenId}`);
      if (!ketersediaanRes.ok) throw new Error("Gagal mengambil data ketersediaan");

      const data = {
        mahasiswa_id: mahasiswaId,
        dosen_id: dosenId,
        tujuan: tujuan,
        alasan: keperluan,
        status: "menunggu",
        waktu_pendaftaran: tanggal,
      };

      const response = await fetch(`${baseUrl}/api/tambah-antrian`, {
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

      setTimeout(() => {
        window.location.reload();
      }, 1000);
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

    // Konversi manual ke waktu Asia/Jakarta (GMT+7)
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const jakartaTime = new Date(utc + 7 * 60 * 60000);

    // Format ke yyyy-MM-ddTHH:mm:ss
    const yyyy = jakartaTime.getFullYear();
    const MM = String(jakartaTime.getMonth() + 1).padStart(2, '0');
    const dd = String(jakartaTime.getDate()).padStart(2, '0');
    const hh = String(jakartaTime.getHours()).padStart(2, '0');
    const mm = String(jakartaTime.getMinutes()).padStart(2, '0');
    const ss = String(jakartaTime.getSeconds()).padStart(2, '0');

    const localDateTime = `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}`;
    setTanggal(localDateTime);
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user && user.id) {
      setMahasiswaId(user.id);
    }
  }, []);

  useEffect(() => {
    const fetchDosenId = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/ketersediaan/`);
        const data = await res.json();

        const ketersediaan = data.find((item: any) => item.id === parseInt(id!));
        if (ketersediaan) {
          setDosenId(ketersediaan.user_id);
        } else {
          console.error("Data ketersediaan tidak ditemukan");
        }
      } catch (err) {
        console.error("Gagal fetch ketersediaan:", err);
      }
    };

    if (id) {
      fetchDosenId();
    }
  }, [id]);

  useEffect(() => {
    if (dosenId === null || mahasiswaId === null) return;

    const fetchData = () => {
      fetch(`${baseUrl}/api/antrian-dosen/${dosenId}`)
        .then((res) => res.json())
        .then((data) => {
          setAntrianData(data);

          const antrianSaya = data.find(
            (item: any) =>
              item.mahasiswa_id === mahasiswaId && item.status === "menunggu"
          );

          if (antrianSaya) {
            setShowAlert(true);
          } else {
            setShowAlert(false);
          }
        })
        .catch((err) => console.error("Fetch error:", err));
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 20000);

    return () => clearInterval(interval);
  }, [dosenId, mahasiswaId]);


  unstable_usePrompt({
    message: "JANGAN KELUAR DARI HALAMAN INI! NANTI DOSEN GA BISA MEMANGGIL KAMU! DISINI AJA YA SAMPAI DIPANGGIL :) ",
    when: showAlert
  });

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
              title="Peringatan! Jangan Keluar Dari Halaman Ini & Pastikan Perangkat Anda Selalu Terkoneksi! "
              message="Anda sudah ditambahkan kedalam antrian. Tetaplah berada di area sekitar dosen sambil menunggu dosen memanggil anda notifikasi panggilan berbunyi."
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
                    step={1}
                    className="cursor-not-allowed bg-gray-100"
                  />
                </div>

                <div>
                  <Label>Tujuan Janji Temu</Label>
                  <Select
                    options={tujuanOptions}
                    placeholder="Pilih tujuan"
                    value={tujuan}
                    onChange={(value: string) => {
                      setTujuan(value);
                      setTujuanError(""); // reset error saat dipilih
                    }}
                  />
                  {tujuanError && (
                    <p className="mt-1 text-sm text-red-600">{tujuanError}</p>
                  )}
                </div>


                <div>
                  <Label>Detail</Label>
                  <Input
                    placeholder="Contoh: Meminta tanda tangan formulir PKL"
                    type="text"
                    value={keperluan}
                    onChange={(e) => setKeperluan(e.target.value)}
                  />
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
