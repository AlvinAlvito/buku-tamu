import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import RiwayatMahasiswa from "../../components/Admin/ProfileMahasiswa/RiwayatAntrian";
import InformasiPersonal from "../../components/Admin/ProfileMahasiswa/InformasiPersonal";
import InformasiUmum from "../../components/Admin/ProfileMahasiswa/InformasiUmum";
import { useNavigate } from "react-router";
import { ChevronLeftIcon } from "lucide-react";

export default function ProfilMahasiswaAntrian() {
  const navigate = useNavigate();
  return (
    <>
      <PageBreadcrumb pageTitle="Profile" />


      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex mb-3 items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
        >
          <ChevronLeftIcon className="size-5" />
          Kembali
        </button>
        <div className="space-y-6">
          <InformasiUmum />
          <InformasiPersonal />
        </div>
        <div className="space-y-6 my-5" >
          <RiwayatMahasiswa />
        </div>
      </div>
    </>
  );
}
