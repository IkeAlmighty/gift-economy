import { Outlet, useLocation, useNavigate, Link } from "react-router";
import { useEffect, useState } from "react";
import ToolBar from "./ToolBar";
import PlusCloseButton from "./PlusCloseButton";
import LogoutButton from "./LogoutButton";
import { Protected } from "./Protected";
import { useNewListingData } from "../Contexts/NewListingContext";
import { useUser } from "../Contexts/UserContext";

export default function ToolBarMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { newListingData } = useNewListingData();
  const { user } = useUser();

  const [menuOpen, setMenuOpen] = useState(false);
  const [lastMenu, setLastMenu] = useState("/create-listing-options");
  const [lastPage, setLastPage] = useState(location.pathname);

  useEffect(() => {
    if (location.pathname === "/") {
      setLastMenu("create-listing-options");
      setMenuOpen(false);
    }
  }, [location.pathname]);

  function handleMenuButton() {
    if (menuOpen) {
      setLastMenu(location.pathname);
      setMenuOpen(false);
      navigate(lastPage);
    } else {
      setLastPage(location.pathname);
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
        navigate(lastPage);
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

        <button>
          <Link to="/connections">Connections</Link>
        </button>

        <button>
          <Link to="/saved-projects">Saved Listings</Link>
        </button>

        <LogoutButton />
      </ToolBar>

      {user && <div className="fixed bottom-1 right-2">Logged in as {user.username}</div>}

      {menuOpen && (
        <div className="text-right [&>button]:underline mt-5 px-2">
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
