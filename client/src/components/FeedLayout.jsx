import { Outlet, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import ToolBar from "./ToolBar";
import PlusCloseButton from "./PlusCloseButton";
import LogoutButton from "./LogoutButton";
import { Protected } from "./Protected";
import { useNewListingData } from "../Contexts/NewListingContext";

export default function ToolBarMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { newListingData } = useNewListingData();

  const [menuOpen, setMenuOpen] = useState(false);
  const [lastMenu, setLastMenu] = useState("/create-listing-options");

  function handleMenuButton() {
    if (menuOpen) {
      setLastMenu(location.pathname);
      setMenuOpen(false);
      navigate("/");
    } else {
      setMenuOpen(true);
      navigate(lastMenu);
    }
  }

  function handleBackClick() {
    const previewBackOptions = {
      GIFT: "/create-gift",
      PROJECT: "/create-project",
      REQUEST: "/create-request",
    };

    switch (location.pathname) {
      case "/create-listing-options":
        navigate("/");
        setMenuOpen(false);
        break;
      case "/create-gift":
      case "/create-request":
      case "/create-project":
        navigate("/create-listing-options");
        break;
      case "/preview-listing":
        setLastMenu(previewBackOptions[newListingData.intent]);
        navigate(previewBackOptions[newListingData.intent]);
        break;
    }
  }

  return (
    <>
      <ToolBar>
        <PlusCloseButton value={menuOpen} onClick={handleMenuButton} />
        <div className="text-lg underline">The Gift Economy</div>

        <LogoutButton />
      </ToolBar>

      {menuOpen && (
        <div className="text-right [&>button]:underline mt-5">
          <button onClick={handleBackClick}>
            {location.pathname === "/create-listing-options" ? "Cancel" : "Back"}
          </button>
        </div>
      )}

      <Protected>
        <Outlet />
      </Protected>
    </>
  );
}
