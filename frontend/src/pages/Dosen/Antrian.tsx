import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import AntrianDosen from "../../components/dosen/AntrianDosen";
import Alert from "../../components/ui/alert/Alert";

export default function BasicTables() {
  const [showAlert, setShowAlert] = useState(true);
  useEffect(() => {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 2 * 60 * 1000);
  
      return () => clearTimeout(timer);
    }, []);
  return (
    <>

      <PageBreadcrumb pageTitle="Antrian" />
      <div className="space-y-6">
        {showAlert && (
          <Alert
            variant="success"
            title="Tips Untuk Dosen! "
            message="Jika Mahasiswa belum datang juga saat dipanggil, Lewatkan saja dulu & Panggil Mahasiswa yang lain. Mungkin dia sedang ketoilet.. Hapus Antrian Mahasiswa jika diperlukan saja"
          />
        )}
        <AntrianDosen />
      </div>
    </>
  );
}
