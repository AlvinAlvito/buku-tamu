import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import DaftarUser from "../../components/Admin/DaftarUser";

export default function Prodi() {
  return (
    <>

      <PageBreadcrumb pageTitle="Daftar Mahasiswa & Dosen" />
      <div className="space-y-6">
          <DaftarUser />
      </div>
    </>
  );
}
