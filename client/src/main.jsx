import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { UserProvider } from "./Contexts/UserContext";
import Router from "./Router";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <Router />
    </UserProvider>
  </StrictMode>
);
