import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "simplebar-react/dist/simplebar.min.css";

import { ThemeProvider } from "./context/ThemeContext";
import { OnlineProvider } from "./utils/OnlineContext";
import { AppWrapper } from "./components/common/PageMeta";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <OnlineProvider key={localStorage.getItem("token")}>
        <AppWrapper>
          <RouterProvider router={router} />
        </AppWrapper>
      </OnlineProvider>
    </ThemeProvider>
  </StrictMode>
);
