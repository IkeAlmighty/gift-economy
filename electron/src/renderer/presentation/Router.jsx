import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./Layout.jsx";
import FeedPage from "./pages/FeedPage.jsx";
import BugReportPage from "./pages/BugReportPage.jsx";
import Four04Page from "./pages/Four04Page.jsx";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<FeedPage />} />
          <Route path="/reportbug" element={<BugReportPage />} />

          <Route path="*" element={<Four04Page />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
