import { Outlet, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import ToolBar from "./ToolBar";
import PlusCloseButton from "./PlusCloseButton";
import LogoutButton from "./LogoutButton";
import { Protected } from "./Protected";

export default function ToolBarMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [lastMenu, setLastMenu] = useState("/create-listing");

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

  return (
    <>
      <ToolBar>
        <PlusCloseButton value={menuOpen} onClick={handleMenuButton} />
        <div className="text-lg underline">The Gift Economy</div>

        <LogoutButton />
      </ToolBar>

      <Protected>
        <Outlet />
      </Protected>
    </>
  );
}
