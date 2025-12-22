import { createRoot } from "react-dom/client";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import UserProvider from "./Contexts/UserProvider";
import Router from "./Router";
import { ListingsProvider } from "./Contexts/ListingsContext";
import { NewListingProvider } from "./Contexts/NewListingContext";
import { ToastContainer } from "react-toastify";
import { NotificationsProvider } from "./Contexts/NotificationsContext";
import { TagsProvider } from "./Contexts/TagsContext.jsx";

createRoot(document.getElementById("root")).render(
  <TagsProvider>
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
  </TagsProvider>
);
