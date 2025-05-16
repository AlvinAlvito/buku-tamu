import { useEffect } from "react";
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

