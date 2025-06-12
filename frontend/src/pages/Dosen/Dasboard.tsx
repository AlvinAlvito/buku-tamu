import UserAktif from "../../components/dashboard/UserAktif";
import GrafikAntrian from "../../components/dosen/GrafikAntrian";
import PageMeta from "../../components/common/PageMeta";
import InformasiKetersediaan from "../../components/dosen/profile/InformasiKetersediaan";
import Slider from "../../components/dosen/Slider";
import AntrianDosen from "../../components/dosen/AntrianDosen";
import { useEffect, useState } from "react";
import Alert from "../../components/ui/alert/Alert";

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
        {/* Bagian atas tetap */}
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <UserAktif />
          <InformasiKetersediaan />
        </div>

        {/* Bagian tengah dengan urutan mobile vs desktop */}
        <div className="col-span-12 grid grid-cols-12 gap-6">
          {/* Alert di mobile paling atas */}
          <div className="col-span-12 order-1 lg:order-3">
            {showAlert && (
              <Alert
                variant="success"
                title="Pemberitahuan!"
                message="Jika ada Mahasiswa yang ingin bertemu dengan anda, Antrian Mahasiswa anda akan muncul disini."
              />
            )}
          </div>

          {/* AntrianDosen juga lebih atas di mobile */}
          <div className="col-span-12 order-2 lg:order-4">
            <AntrianDosen />
          </div>

          {/* Slider tetap di kiri di desktop */}
          <div className="col-span-12 lg:col-span-6 order-3 lg:order-1">
            <div className="h-full">
              <Slider />
            </div>
          </div>

          {/* Grafik turun ke bawah di mobile */}
          <div className="col-span-12 lg:col-span-6 order-4 lg:order-2">
            <div className="h-full">
              <GrafikAntrian />
            </div>
          </div>
        </div>
      </div>
    </>
  );

}
