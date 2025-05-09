import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Antrian from "../../components/antrian/Antrian";

export default function BasicTables() {
  return (
    <>

      <PageBreadcrumb pageTitle="Antrian" />
      <div className="space-y-6">
          <Antrian />
      </div>
    </>
  );
}
