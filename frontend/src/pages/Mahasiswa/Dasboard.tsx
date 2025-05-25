
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
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <UserAktif />
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
          <Dosen />
        </div>

      </div>

    </>
  );
}
