import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Dosen from "../../components/dosen/DaftarDosen";

export default function DaftarDosen() {
  return (
    <>

      <PageBreadcrumb pageTitle="Dosen" />
      <div className="space-y-6">
          <Dosen />
      </div>
    </>
  );
}
