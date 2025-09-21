import { useState } from "react";
import LogoutButton from "../components/LogoutButton";
import PlusCloseButton from "../components/PlusCloseButton";
import ToolBar from "../components/ToolBar";
import CreateMenu from "../components/modalMenus/CreateMenu";
import CreateGiftMenu from "../components/modalMenus/CreateGiftMenu";
import CreateProjectMenu from "../components/modalMenus/CreateProjectMenu";
import CreateRequestMenu from "../components/modalMenus/CreateRequestMenu";
import PreviewListingMenu from "../components/modalMenus/PreviewListingMenu";
import Modal from "../components/Modal";

function App() {
  const [showModalMenu, setShowModalMenu] = useState(false);
  const [menuData, setMenuData] = useState({});
  const [menuStack, setMenuStack] = useState(["CreateMenu"]);

  const menus = {
    CreateMenu: (props) => <CreateMenu {...props} />,
    CreateProjectMenu: (props) => <CreateProjectMenu {...props} prefill={menuData} />,
    CreateGiftMenu: (props) => <CreateGiftMenu {...props} prefill={menuData} />,
    CreateRequestMenu: (props) => <CreateRequestMenu {...props} prefill={menuData} />,
    PreviewListingMenu: (props) => <PreviewListingMenu {...props} data={menuData} />,
  };

  function handleMenuSubmission(event) {
    setMenuStack([event.nextMenu, ...menuStack]);
    setMenuData(event.data);

    console.log(event.data);
  }

  function handleMenuBack() {
    if (menuStack.length >= 2) {
      setMenuStack(menuStack.slice(1));
    } else {
      setShowModalMenu(false);
    }
  }

  return (
    <>
      <Modal visible={showModalMenu}>
        <button className="float-right" onClick={handleMenuBack}>
          Back
        </button>
        {menus[menuStack[0]]?.({ onAction: handleMenuSubmission })}
      </Modal>

      <ToolBar>
        <PlusCloseButton value={showModalMenu} onClick={() => setShowModalMenu(!showModalMenu)} />
        <div className="text-5xl">G.E.</div>

        <LogoutButton />
      </ToolBar>
    </>
  );
}

export default App;
