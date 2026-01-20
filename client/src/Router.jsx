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
import ManageTags from "./pages/ManageTags.jsx";
import ChatClient from "./components/ChatClient.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import FeedbackPage from "./pages/FeedbackPage.jsx";
import ListingChatClientPage from "./pages/ListingChatClientPage.jsx";

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
          <Route path="/my-listings" element={<YourListingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
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
          path="/manage-tags"
          element={
            <Protected>
              <ManageTags />
            </Protected>
          }
        />

        <Route
          path="chat/:listingId"
          element={
            <Protected>
              <ListingChatClientPage />
            </Protected>
          }
        />

        <Route path="/listing/:_id" element={<SingleListingPage />} />
        <Route path="/login" element={<Login mode="login" />} />
        <Route path="/signup" element={<Login mode="signup" />} />

        <Route path="/feedback" element={<FeedbackPage />} />
      </Routes>
    </BrowserRouter>
  );
}
