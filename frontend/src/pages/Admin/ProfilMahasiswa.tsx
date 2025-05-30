import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import RiwayatMahasiswa from "../../components/Admin/ProfileMahasiswa/RiwayatAntrian";
import InformasiPersonal from "../../components/Admin/ProfileMahasiswa/InformasiPersonal";
import InformasiUmum from "../../components/Admin/ProfileMahasiswa/InformasiUmum";

export default function ProfilMahasiswaAntrian() {
  return (
    <>
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile Mahasiswa
        </h3>
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
