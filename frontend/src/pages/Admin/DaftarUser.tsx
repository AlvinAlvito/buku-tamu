import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import DaftarUser from "../../components/Admin/DaftarUser";
import { Link } from "react-router";
import { ChevronLeftIcon } from "lucide-react";
import GrafikTujuan from "../../components/Admin/Grafik/Tujuan";

export default function Prodi() {
  return (
    <>

      <PageBreadcrumb pageTitle="Daftar Mahasiswa & Dosen" />
      <Link to="/admin" className="inline-flex mb-3 items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition">
        <ChevronLeftIcon className="size-5" />
        Kembali
      </Link>
      <div className="space-y-6 my-5" >
        <GrafikTujuan/>
      </div>
      <div className="space-y-6">
        <DaftarUser />
      </div>
    </>
  );
}
