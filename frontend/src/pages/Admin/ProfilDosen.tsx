import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import RiwayatDosen from "../../components/Admin/ProfileDosen/RiwayatAntrian";
import InformasiKetersediaan from "../../components/Admin/ProfileDosen/InformasiKetersediaan";
import InformasiPersonal from "../../components/Admin/ProfileDosen/InformasiPersonal";
import InformasiUmum from "../../components/Admin/ProfileDosen/InformasiUmum";
import {  useNavigate } from "react-router";
import { ChevronLeftIcon } from "lucide-react";

export default function ProfilDosenAntrian() {
  const navigate = useNavigate();
  return (
    <>
      <PageBreadcrumb pageTitle="Profile" />
      <button
          onClick={() => navigate(-1)}
          className="inline-flex mb-3 items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
        >
          <ChevronLeftIcon className="size-5" />
          Kembali
        </button>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile Dosen
        </h3>
        <div className="space-y-6">
          <InformasiUmum />
          <InformasiKetersediaan />
          <InformasiPersonal />
        </div>
        <div className="space-y-6 my-5" >
          <RiwayatDosen />
        </div>
      </div>
    </>
  );
}
