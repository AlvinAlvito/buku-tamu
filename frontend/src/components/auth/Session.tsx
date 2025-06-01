// components/auth/Session.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const isSessionExpired = (maxAgeInMs = 3600000): boolean => {
  const loginTime = localStorage.getItem("loginTime");
  if (!loginTime) return true;

  const now = new Date().getTime();
  const diff = now - parseInt(loginTime, 10);
  return diff > maxAgeInMs;
};

export default function AppContent() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const expired = isSessionExpired();

    if (expired) {
      localStorage.removeItem("user");
      localStorage.removeItem("loginTime");
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      setChecked(true); // hanya render isi setelah pengecekan selesai
    }
  }, [navigate]);

  if (!checked) return null;

  return null; // atau return <Outlet /> jika ingin render anak-anak
}
