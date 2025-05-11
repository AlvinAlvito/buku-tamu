import { useEffect } from 'react';
import { useNavigate } from 'react-router'; 

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Hapus semua data otentikasi
    localStorage.removeItem("token");  
    localStorage.removeItem("user");    
    sessionStorage.clear();             
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Optional: log untuk debugging
    console.log("User berhasil logout. Semua sesi dihapus.");

    // Redirect ke login
    navigate("/login");
  }, [navigate]);

  return null;
};

export default Logout;
