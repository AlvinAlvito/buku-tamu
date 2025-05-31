import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import AntrianDosen from "../../components/dosen/AntrianDosen";
import UserAddressCard from "../../components/UserProfile/UserAddressCard";
export default function BasicTables() {
  return (
    <>

      <PageBreadcrumb pageTitle="Dosen" />
      <div className="space-y-6">
          <UserAddressCard/>
          <AntrianDosen />
      </div>
    </>
  );
}
