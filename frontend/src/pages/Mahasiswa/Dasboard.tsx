
import UserAktif from "../../components/dashboard/UserAktif";
import GrafikAntrian from "../../components/mahasiswa/GrafikAntrian";
import PageMeta from "../../components/common/PageMeta";
import Dosen from "../../components/mahasiswa/DaftarDosen";

export default function Dashboard() {


  return (
    <>
      <PageMeta
        title="Buku Tamu UINSU"
        description="Adalah sebuah website & aplikasi buku tamu milik UINSU "
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <UserAktif />
        </div>
        <div className="col-span-12 xl:col-span-12">
          <Dosen />
        </div>
        <div className="col-span-12 xl:col-span-12">
          <GrafikAntrian />
        </div>
      </div>
    </>
  );
}
