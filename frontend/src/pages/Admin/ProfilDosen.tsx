import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import RiwayatDosen from "../../components/Admin/ProfileDosen/RiwayatAntrian";
import InformasiKetersediaan from "../../components/Admin/ProfileDosen/InformasiKetersediaan";
import InformasiPersonal from "../../components/Admin/ProfileDosen/InformasiPersonal";
import InformasiUmum from "../../components/Admin/ProfileDosen/InformasiUmum";

export default function ProfilDosenAntrian() {
  return (
    <>
      <PageBreadcrumb pageTitle="Profile" />
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
