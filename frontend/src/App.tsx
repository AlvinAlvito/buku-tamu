import { BrowserRouter as Router } from "react-router-dom";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { OnlineProvider } from "./utils/OnlineContext";
import AppContent from "./components/auth/Session";
import AppRoutes from "./routes"; 

export default function App() {
  return (
    <Router>
      <OnlineProvider key={localStorage.getItem("token")}>
        <ScrollToTop />
        <AppContent />
        <AppRoutes />
      </OnlineProvider>
    </Router>
  );
}
