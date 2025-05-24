import UserAktif from "../../components/dashboard/UserAktif";
import GrafikAntrian from "../../components/dosen/GrafikAntrian";
import PageMeta from "../../components/common/PageMeta";
import AntrianDosen from "../../components/dosen/AntrianDosen";
import InformasiKetersediaan from "../../components/dosen/profile/InformasiKetersediaan";
import Alert from "../../components/ui/alert/Alert";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [showAlert, setShowAlert] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 2 * 60 * 1000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <PageMeta
        title="Bimbingan Akademik UINSU"
        description="Adalah sebuah website & aplikasi Bimbingan Akademik milik UINSU "
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <UserAktif />
          <InformasiKetersediaan />
        </div>
        <div className="col-span-12 xl:col-span-12">
          {showAlert && (
            <Alert
              variant="success"
              title="Tips Untuk Dosen! "
              message="Jika Mahasiswa belum datang juga saat dipanggil, Lewatkan saja dulu & Panggil Mahasiswa yang lain. Mungkin dia sedang ketoilet.. Hapus Antrian Mahasiswa jika diperlukan saja"
            />
          )}
          <AntrianDosen />
        </div>
        <div className="col-span-12 xl:col-span-12">
          <GrafikAntrian />
        </div>
      </div>
    </>
  );
}
