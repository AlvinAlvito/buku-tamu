import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import LogUser from "../../components/mahasiswa/LogUser";

export default function LogUsers() {
  return (
    <>
      <PageBreadcrumb pageTitle="LogUser " />
      <div className="space-y-6">
          <LogUser />
      </div>
    </>
  );
}
