import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import UserProvider from "./Contexts/UserProvider";
import Router from "./Router";
import { ListingsProvider } from "./Contexts/ListingsContext";
import { NewListingProvider } from "./Contexts/NewListingContext";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <ListingsProvider>
        <NewListingProvider>
          <Router />
          <ToastContainer position="bottom-right" />
        </NewListingProvider>
      </ListingsProvider>
    </UserProvider>
  </StrictMode>
);
