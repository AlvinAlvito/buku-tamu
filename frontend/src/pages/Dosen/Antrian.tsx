import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import AntrianDosen from "../../components/dosen/AntrianDosen";

export default function BasicTables() {
  return (
    <>

      <PageBreadcrumb pageTitle="Antrian" />
      <div className="space-y-6">
          <AntrianDosen />
      </div>
    </>
  );
}
