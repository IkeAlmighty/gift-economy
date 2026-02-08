import { Outlet } from "react-router";
import { useState } from "react";
import ToolBar from "./components/ToolBar.jsx";
import Floating from "./components/Floating.jsx";
import BugButton from "./components/BugButton.jsx";
import PageSlider from "./PageSlider.jsx";
import PlusCloseButton from "./components/PlusCloseButton.jsx";
import ModalChain from "./components/ModalChain.jsx";
import Modal from "./components/Modal.jsx";

export default function Layout() {
  const containerStyle = `
    mx-auto
    max-w-3xl
    pt-4
    pb-20
  `;

  const [plusCloseValue, setPlusCloseValue] = useState("+");

  const handlePlusCloseClick = () => {
    setPlusCloseValue(plusCloseValue === "+" ? "x" : "+");
    if (plusCloseValue === "+") {
      // open modal chain for creating new post:
    } else {
      // close modal chain for creating new post:
    }
  };

  return (
    <div className="px-2 py-1">
      <ToolBar />

      <ModalChain>
        <Modal>hello</Modal>
        <Modal>goodbye</Modal>
      </ModalChain>

      <div className={containerStyle}>
        <PageSlider>
          <Outlet />
        </PageSlider>
      </div>

      <div className="fixed z-100 bottom-0 py-3 left-0 right-0 flex justify-center items-center bg-primary">
        <PlusCloseButton value={plusCloseValue} onClick={handlePlusCloseClick} />
      </div>

      <Floating className="bottom-4 right-4">
        <BugButton />
      </Floating>
    </div>
  );
}
