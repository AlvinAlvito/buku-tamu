import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import InformasiKetersediaan from "../../components/dosen/profile/InformasiKetersediaan";
import InformasiPersonal from "../../components/dosen/profile/InformasiPersonal";
import InformasiUmum from "../../components/dosen/profile/InformasiUmum";



export default function UserProfiles() {
  return (
    <>
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <InformasiUmum />
          <InformasiKetersediaan />
          <InformasiPersonal />
        </div>
      </div>
    </>
  );
}
