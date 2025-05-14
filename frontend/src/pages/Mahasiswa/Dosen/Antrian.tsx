import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import BuatJanji from "../../../components/mahasiswa/BuatJanji";
import AntrianDosen from "../../../components/mahasiswa/AntrianDosen";
import Panggilan from "../../../components/mahasiswa/Panggilan";
import InformasiUmum from "../../../components/mahasiswa/profile-dosen/InformasiUmum";
import InformasiKetersediaan from "../../../components/mahasiswa/profile-dosen/InformasiKetersediaan";
export default function Antrian() {
  return (
    <>

      <PageBreadcrumb pageTitle="Antrian" />
      <div className="space-y-6">
        <BuatJanji />
        <InformasiUmum />
        <InformasiKetersediaan />
        <Panggilan />
        <AntrianDosen />
      </div>
    </>
  );
}
