import { Outlet } from "react-router";
import ToolBar from "./components/ToolBar.jsx";
import Floating from "./components/Floating.jsx";
import BugButton from "./components/BugButton.jsx";
import PageSlider from "./PageSlider.jsx";

export default function Layout() {
  const containerStyle = `
    mx-auto
    max-w-3xl
    pt-4
    pb-20
  `;
  return (
    <div className="px-2 py-1">
      <ToolBar />
      <div className={containerStyle}>
        <PageSlider>
          <Outlet />
        </PageSlider>
      </div>
      <Floating className="bottom-4 right-4">
        <BugButton />
      </Floating>
    </div>
  );
}
