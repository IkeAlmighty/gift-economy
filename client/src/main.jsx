import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import UserProvider from "./Contexts/UserProvider";
import Router from "./Router";
import { ListingsProvider } from "./Contexts/ListingsContext";
import { NewListingProvider } from "./Contexts/NewListingContext";
import { ToastContainer } from "react-toastify";
import { NotificationsProvider } from "./Contexts/NotificationsContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <ListingsProvider>
        <NewListingProvider>
          <NotificationsProvider>
            <Router />
            <ToastContainer position="bottom-right" />
          </NotificationsProvider>
        </NewListingProvider>
      </ListingsProvider>
    </UserProvider>
  </StrictMode>
);
