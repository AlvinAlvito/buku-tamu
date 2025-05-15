import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import UserAktif from "../../components/dashboard/UserAktif";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import PageMeta from "../../components/common/PageMeta";
import Dosen from "../../components/mahasiswa/DaftarDosen";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hasReloaded = new URLSearchParams(location.search).get("reloaded");

    if (!hasReloaded) {
      // Tambahkan parameter ?reloaded=true dan reload
      navigate(`${location.pathname}?reloaded=true`, { replace: true });
      window.location.reload();
    }
  }, [location, navigate]);

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
          <MonthlySalesChart />
        </div>
      </div>
    </>
  );
}
