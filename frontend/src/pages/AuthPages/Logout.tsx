import { useEffect } from "react";
import { useNavigate } from "react-router";
import { disconnectSocket, getSocket } from "../../utils/socket";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      socket.emit("manual-logout");
      disconnectSocket();
    }

    localStorage.removeItem("token");
    localStorage.setItem("logout", Date.now().toString()); 
    window.dispatchEvent(new Event("token-change"));

    sessionStorage.clear();

    document.cookie =
      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/login");
  }, [navigate]);

  return null;
};

export default Logout;
