import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import FourIsToThree from "../../components/ui/videos/FourIsToThree";
import OneIsToOne from "../../components/ui/videos/OneIsToOne";
import SixteenIsToNine from "../../components/ui/videos/SixteenIsToNine";

export default function Tutorial() {
  return (
    <>
      <PageBreadcrumb pageTitle="Tutorial" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">

        <ComponentCard title="Panduan Penggunaan Aplikasi SI-BIMA UINSU dengan Akun role Mahasiswa">
          <OneIsToOne />
        </ComponentCard>
        <ComponentCard title="Panduan Penggunaan Aplikasi SI-BIMA UINSU dengan Akun role Dosen">
          <SixteenIsToNine />
        </ComponentCard>
        <ComponentCard title="Panduan Penggunaan Aplikasi SI-BIMA UINSU dengan Akun role Admin">
          <FourIsToThree />
        </ComponentCard>
      </div>

    </>
  );
}
