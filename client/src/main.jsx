import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { UserProvider } from "./Contexts/UserContext";
import Router from "./Router";
import { ListingsProvider } from "./Contexts/ListingsContext";
import { NewListingProvider } from "./Contexts/NewListingContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <NewListingProvider>
        <ListingsProvider>
          <Router />
        </ListingsProvider>
      </NewListingProvider>
    </UserProvider>
  </StrictMode>
);
