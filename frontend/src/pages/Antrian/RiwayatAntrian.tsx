import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Riwayat from "../../components/antrian/RiwayatAntrian";

export default function BasicTables() {
  return (
    <>
      <PageBreadcrumb pageTitle="Riwayat Antrian" />
      <div className="space-y-6">
          <Riwayat />
      </div>
    </>
  );
}
