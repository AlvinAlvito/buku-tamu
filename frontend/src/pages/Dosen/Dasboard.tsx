import UserAktif from "../../components/dashboard/UserAktif";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import PageMeta from "../../components/common/PageMeta";
import AntrianDosen from "../../components/dosen/AntrianDosen";
import InformasiKetersediaan from "../../components/dosen/profile/InformasiKetersediaan";

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
          <InformasiKetersediaan />
        </div>
        <div className="col-span-12 xl:col-span-12">
          <AntrianDosen />
        </div>
        <div className="col-span-12 xl:col-span-12">
          <MonthlySalesChart />
        </div>
      </div>
    </>
  );
}
