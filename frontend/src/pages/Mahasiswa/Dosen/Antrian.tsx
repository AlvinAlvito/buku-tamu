import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import AntrianDosen from "../../../components/mahasiswa/AntrianDosen";

export default function Antrian() {
  return (
    <>

      <PageBreadcrumb pageTitle="Antrian" />
      <div className="space-y-6">
          <AntrianDosen />
      </div>
    </>
  );
}
