import UserAktif from "../../components/dashboard/UserAktif";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import PageMeta from "../../components/common/PageMeta";
import Antrian from "../../components/antrian/Antrian";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      if (parsedUser.role === "mahasiswa") {
        navigate("/mahasiswa");
      } else if (parsedUser.role === "dosen") {
        navigate("/dosen");
      }
    }
  }, [navigate]);
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
          <Antrian />
        </div>
        <div className="col-span-12 xl:col-span-12">
          <MonthlySalesChart />
        </div>
      </div>
    </>
  );
}
