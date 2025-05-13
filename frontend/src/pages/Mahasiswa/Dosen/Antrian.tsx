import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import BuatJanji from "../../../components/dosen/BuatJanji";
import AntrianDosen from "../../../components/mahasiswa/AntrianDosen";
import Panggilan from "../../../components/mahasiswa/Panggilan";
export default function Antrian() {
  return (
    <>

      <PageBreadcrumb pageTitle="Antrian" />
      <div className="space-y-6">
          <BuatJanji/>
          <Panggilan/>
          <AntrianDosen />
      </div>
    </>
  );
}
