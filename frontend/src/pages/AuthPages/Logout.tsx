import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const Logout = () => {
  const navigate = useNavigate();

  const logout = () => {
    // Hapus sesi
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Pengecekan status sesi
    const isLoggedIn = localStorage.getItem("user") !== null;
    const isSessionActive = sessionStorage.getItem("user") !== null;
    const isCookieExpired = document.cookie.indexOf("token=") === -1;
    
    if (!isLoggedIn && !isSessionActive && isCookieExpired) {
        console.log("Sesi telah berhasil dihapus.");
    } else {
        console.log("Sesi masih aktif.");
    }
    navigate("/login");

  };

  useEffect(() => {
    logout();
  }, []); // Pastikan hanya satu pemanggilan logout

  return null;
};

export default Logout;
