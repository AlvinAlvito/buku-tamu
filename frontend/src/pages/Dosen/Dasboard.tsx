import UserAktif from "../../components/dashboard/UserAktif";
import GrafikAntrian from "../../components/dosen/GrafikAntrian";
import PageMeta from "../../components/common/PageMeta";
import InformasiKetersediaan from "../../components/dosen/profile/InformasiKetersediaan";
import Slider from "../../components/dosen/Slider";
import AntrianDosen from "../../components/dosen/AntrianDosen";

export default function Dashboard() {
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
        <div className="col-span-12 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-6">
            <div className="h-full">
              <Slider />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <div className="h-full">
              <GrafikAntrian />
            </div>
          </div>
        </div>
        <div className="col-span-12 xl:col-span-12">
          <AntrianDosen />
        </div>


      </div>
    </>
  );
}
