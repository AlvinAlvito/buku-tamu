import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Riwayat from "../../components/mahasiswa/RiwayatAntrian";

export default function RiwayatAntrian() {
  return (
    <>
      <PageBreadcrumb pageTitle="Riwayat Antrian" />
      <div className="space-y-6">
          <Riwayat />
      </div>
    </>
  );
}
