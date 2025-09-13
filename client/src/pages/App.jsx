import { useState } from "react";
import LogoutButton from "../components/LogoutButton";
import PlusCloseButton from "../components/PlusCloseButton";
import ToolBar from "../components/ToolBar";
import CreateMenu from "../components/CreateMenu";
import CreateGiftMenu from "../components/CreateGiftMenu";
import CreateProjectMenu from "../components/CreateProjectMenu";
import CreateRequestMenu from "../components/CreateRequestMenu";

function App() {
  const [showModalMenu, setShowModalMenu] = useState(false);
  const [ModalMenu, setModalMenu] = useState(
    <CreateMenu onAction={handleModalAction} />
  );

  function handleModalAction(action) {
    switch (action) {
      case "Cancel":
        setModalMenu(<CreateMenu onAction={handleModalAction} />);
        setShowModalMenu(false);
        break;
      case "Post Gift":
        setModalMenu(<CreateGiftMenu onAction={handleModalAction} />);
        break;
      case "Post Request":
        setModalMenu(<CreateRequestMenu onAction={handleModalAction} />);
        break;
      case "Post Project":
        setModalMenu(<CreateProjectMenu onAction={handleModalAction} />);
        break;
    }
  }

  return (
    <>
      <ToolBar>
        <PlusCloseButton
          value={showModalMenu}
          onClick={() => setShowModalMenu(!showModalMenu)}
        />
        <div className="text-5xl">G.E.</div>

        <LogoutButton />
      </ToolBar>

      <div className="fixed w-screen h-screen left-0 top-27">
        {showModalMenu && (
          <div className="max-w-[700px] mx-auto pt-5 px-2">
            <button
              className="float-right"
              onClick={() => handleModalAction("Cancel")}
            >
              Cancel
            </button>
            {ModalMenu}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
