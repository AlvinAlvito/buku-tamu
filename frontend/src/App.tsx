import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/AuthPages/Login";
import Logout from "./pages/AuthPages/Logout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import NotFound from "./pages/OtherPage/NotFound";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";

import DosenAntrian from "./pages/Dosen/Antrian";
import DosenProfile from "./pages/Dosen/Profile";
import DosenDashboard from "./pages/Dosen/Dasboard";
import DaftarDosen from "./pages/Dosen/DaftarDosen";
import RiwayatAntrianDosen from "./pages/Dosen/RiwayatAntrian";
import KalenderDosen from "./pages/Dosen/Kalender";
import TutorialDosen from "./pages/Dosen/Tutorial";

import MahasiswaDashboard from "./pages/Mahasiswa/Dasboard";
import MahasiswaProfile from "./pages/Mahasiswa/Profile";
import MahasiswaDaftarDosen from "./pages/Mahasiswa/Dosen/DaftarDosen";
import MahasiswaDaftarDosenAntrian from "./pages/Mahasiswa/Dosen/Antrian";
import RiwayatAntrianMahasiswa from "./pages/Mahasiswa/RiwayatAntrian";
import KalenderMahasiswa from "./pages/Mahasiswa/Kalender";
import TutorialMahasiswa from "./pages/Mahasiswa/Tutorial";
import { useEffect } from "react";
import { isSessionExpired } from "./components/auth/Session";
import { OnlineProvider } from "./utils/OnlineContext";

function AppContent() {
  const navigate = useNavigate();

  useEffect(() => {
    const expired = isSessionExpired();

    if (expired) {
      localStorage.removeItem("user");
      localStorage.removeItem("loginTime");
      navigate("/login");
    }
  }, [navigate]);

  return null;
}

export default function App() {


  return (
    <>

      <Router>
        <OnlineProvider key={localStorage.getItem("token")}>

          <ScrollToTop />
          <AppContent />
          <Routes>
            {/* Dashboard Layout - hanya untuk yang sudah login */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index path="/" element={<Home />} />

              {/* Dosen Page */}
              <Route path="/dosen" element={<DosenDashboard />} />
              <Route path="/dosen/profile" element={<DosenProfile />} />
              <Route path="/dosen/antrian" element={<DosenAntrian />} />
              <Route path="/dosen/daftar-dosen" element={<DaftarDosen />} />
              <Route path="/dosen/riwayat-antrian" element={<RiwayatAntrianDosen />} />
              <Route path="/dosen/kalender" element={<KalenderDosen />} />
              <Route path="/dosen/tutorial" element={<TutorialDosen />} />

              {/* Mahasiswa Page */}
              <Route path="/mahasiswa" element={<MahasiswaDashboard />} />
              <Route path="/mahasiswa/profile" element={<MahasiswaProfile />} />
              <Route path="/mahasiswa/daftar-dosen" element={<MahasiswaDaftarDosen />} />
              <Route path="/mahasiswa/daftar-dosen/antrian" element={<MahasiswaDaftarDosenAntrian />} />
              <Route path="/mahasiswa/riwayat-antrian" element={<RiwayatAntrianMahasiswa />} />
              <Route path="/mahasiswa/kalender" element={<KalenderMahasiswa />} />
              <Route path="/mahasiswa/tutorial" element={<TutorialMahasiswa />} />

              <Route path="/blank" element={<Blank />} />
              <Route path="/form-elements" element={<FormElements />} />
              <Route path="/basic-tables" element={<BasicTables />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
            </Route>

            {/* Auth Layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </OnlineProvider>
      </Router>

    </>
  );
}
