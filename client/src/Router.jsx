import { BrowserRouter, Routes, Route } from "react-router";
import FeedLayout from "./components/FeedLayout.jsx";
import App from "./pages/App.jsx";
import ConnectionsPage from "./pages/ConnectionsPage.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import CreateListingOptions from "./pages/CreateListingOptions.jsx";
import CreateListing from "./pages/CreateListing.jsx";
import PreviewListing from "./pages/PreviewListing.jsx";

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
        </Route>

        <Route path="/connections" element={<ConnectionsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}
