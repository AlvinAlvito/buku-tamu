import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import DaftarProdi from "../../components/Admin/DaftarProdi";

export default function Prodi() {
  return (
    <>

      <PageBreadcrumb pageTitle="DaftarProdi" />
      <div className="space-y-6">
          <DaftarProdi />
      </div>
    </>
  );
}
