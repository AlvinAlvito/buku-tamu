
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
  const userStr = localStorage.getItem("user");
  if (!userStr) {
    navigate("/login");
    return;
  }
  const user = JSON.parse(userStr);

  if (user.role === "mahasiswa") {
    navigate("/mahasiswa");
  } else if (user.role === "dosen") {
    navigate("/dosen");
  } else if (user.role === "admin") {
    navigate("/admin");
  }
}, [navigate]);

  return null;
}
