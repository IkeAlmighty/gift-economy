import { BrowserRouter, Routes, Route } from "react-router";
import FeedLayout from "./components/FeedLayout.jsx";
import App from "./pages/App.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import CreateListing from "./pages/CreateListing.jsx";
import CreateGift from "./pages/CreateGift.jsx";
import PreviewListing from "./pages/PreviewListing.jsx";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Outlet in FeedLayout is user protected */}
        <Route path="/" element={<FeedLayout />}>
          <Route path="/" element={<App />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/create-gift" element={<CreateGift />} />
          <Route path="/preview-listing" element={<PreviewListing />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}
