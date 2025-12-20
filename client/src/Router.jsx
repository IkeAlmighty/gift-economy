import { BrowserRouter, Routes, Route } from "react-router";
import FeedLayout from "./components/FeedLayout.jsx";
import App from "./pages/App.jsx";
import ConnectionsPage from "./pages/ConnectionsPage.jsx";
import Login from "./pages/Login.jsx";
import CreateListingOptions from "./pages/CreateListingOptions.jsx";
import CreateListing from "./pages/CreateListing.jsx";
import PreviewListing from "./pages/PreviewListing.jsx";
import { SavedProjectsPage } from "./pages/SavedProjectsPage.jsx";
import { Protected } from "./components/Protected.jsx";
import { SingleListingPage } from "./pages/SingleListingPage.jsx";
import YourListingPage from "./pages/MyListingsPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Outlet in FeedLayout is user protected */}
        <Route path="/" element={<FeedLayout />}>
          <Route path="/" element={<App />} />
          <Route path="/create-listing-options" element={<CreateListingOptions />} />
          <Route path="/create-gift" element={<CreateListing />} />
          <Route path="/create-request" element={<CreateListing />} />
          <Route path="/create-project" element={<CreateListing />} />
          <Route path="/preview-listing" element={<PreviewListing />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>

        <Route
          path="/saved-listings"
          element={
            <Protected>
              <SavedProjectsPage />
            </Protected>
          }
        />
        <Route
          path="/connections"
          element={
            <Protected>
              <ConnectionsPage />
            </Protected>
          }
        />
        <Route
          path="/my-listings"
          element={
            <Protected>
              <YourListingPage />
            </Protected>
          }
        />

        <Route path="/listing/:_id" element={<SingleListingPage />} />
        <Route path="/login" element={<Login mode="login" />} />
        <Route path="/signup" element={<Login mode="signup" />} />
      </Routes>
    </BrowserRouter>
  );
}
