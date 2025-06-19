
import UserAktif from "../../components/dashboard/UserAktif";
import GrafikAntrian from "../../components/mahasiswa/GrafikAntrian";
import PageMeta from "../../components/common/PageMeta";
import Dosen from "../../components/mahasiswa/DaftarDosen";
import Slider from "../../components/mahasiswa/Slider";

export default function Dashboard() {


  return (
    <>
      <PageMeta
        title="Bimbingan Akademik UINSU"
        description="Adalah sebuah website & aplikasi Bimbingan Akademik milik UINSU "
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* User Aktif */}
        <div className="col-span-12 order-1">
          <UserAktif />
        </div>

        {/* Slider */}
        <div className="col-span-12 lg:col-span-6 order-2">
          <div className="h-full">
            <Slider />
          </div>
        </div>

        {/* Grafik Antrian */}
        <div className="col-span-12 lg:col-span-6 order-4 lg:order-3">
          <div className="h-full">
            <GrafikAntrian />
          </div>
        </div>

        {/* Dosen */}
        <div className="col-span-12 order-3 lg:order-4">
          <Dosen />
        </div>
      </div>


    </>
  );
}
