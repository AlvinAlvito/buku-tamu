import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Dosen from "../../components/dosen/Dosen";

export default function BasicTables() {
  return (
    <>

      <PageBreadcrumb pageTitle="Dosen" />
      <div className="space-y-6">
          <Dosen />
      </div>
    </>
  );
}
