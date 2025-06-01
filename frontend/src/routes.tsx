// routes.tsx

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ScrollToTop } from "./components/common/ScrollToTop";

import AppLayout from "./layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/AuthPages/Login";
import Logout from "./pages/AuthPages/Logout";
import NotFound from "./pages/OtherPage/NotFound";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/UiElements/LineChart";
import BarChart from "./pages/UiElements/BarChart";
import FormElements from "./pages/UiElements/FormElements";
import Blank from "./pages/OtherPage/Blank";

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
import LogUser from "./components/mahasiswa/LogUser";

import DaftarProdi from "./pages/Admin/DaftarProdi";
import DaftarUser from "./pages/Admin/DaftarUser";
import ProfilDosen from "./pages/Admin/ProfilDosen";
import ProfilMahasiswa from "./pages/Admin/ProfilMahasiswa";
import AdminDashboard from "./pages/Admin/Dasboard";
import AppContent from "./components/auth/Session";


export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppContent /> {/* Pengecekan session */}
        <ScrollToTop />
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      // Admin
      { path: "admin/daftar-prodi", element: <DaftarProdi /> },
      { path: "admin/daftar-prodi/:namaProdi", element: <DaftarUser /> },
      { path: "admin/daftar-prodi/profil/dosen/:id", element: <ProfilDosen /> },
      { path: "admin/daftar-prodi/profil/mahasiswa/:id", element: <ProfilMahasiswa /> },
      { path: "admin", element: <AdminDashboard /> },
      
      // Dosen
      { path: "dosen", element: <DosenDashboard /> },
      { path: "dosen/profile", element: <DosenProfile /> },
      { path: "dosen/antrian", element: <DosenAntrian /> },
      { path: "dosen/daftar-dosen", element: <DaftarDosen /> },
      { path: "dosen/riwayat-antrian", element: <RiwayatAntrianDosen /> },
      { path: "dosen/kalender", element: <KalenderDosen /> },
      { path: "dosen/tutorial", element: <TutorialDosen /> },

      // Mahasiswa
      { path: "mahasiswa", element: <MahasiswaDashboard /> },
      { path: "mahasiswa/profile", element: <MahasiswaProfile /> },
      { path: "mahasiswa/daftar-dosen", element: <MahasiswaDaftarDosen /> },
      { path: "mahasiswa/daftar-dosen/antrian/:id", element: <MahasiswaDaftarDosenAntrian /> },
      { path: "mahasiswa/riwayat-antrian", element: <RiwayatAntrianMahasiswa /> },
      { path: "mahasiswa/kalender", element: <KalenderMahasiswa /> },
      { path: "mahasiswa/tutorial", element: <TutorialMahasiswa /> },
      { path: "mahasiswa/Iog-user", element: <LogUser /> },

      // UI pages
      { path: "blank", element: <Blank /> },
      { path: "form-elements", element: <FormElements /> },
      { path: "alerts", element: <Alerts /> },
      { path: "avatars", element: <Avatars /> },
      { path: "badge", element: <Badges /> },
      { path: "buttons", element: <Buttons /> },
      { path: "images", element: <Images /> },
      { path: "videos", element: <Videos /> },
      { path: "line-chart", element: <LineChart /> },
      { path: "bar-chart", element: <BarChart /> },
    ],
  },

  // Auth
  { path: "/login", element: <Login /> },
  { path: "/logout", element: <Logout /> },

  // Not found
  { path: "*", element: <NotFound /> },
]);
export default function AppRoutes() {
  return <RouterProvider router={router} />;
}