import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router";
import LogoutButton from "./LogoutButton";
import { useUser } from "../Contexts/UserContext";

export default function DrawerMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useUser();

  const drawerCSS = `
    absolute 
    h-[calc(100vh-103px)]
    top-15 
    -right-5
    w-[200px] 
    bg-secondary 
    opacity-95 
    p-3 
    rounded 
    border-l-2 
    flex 
    flex-col 
    gap-y-2 
    [&>*]:text-center 
    [&>*]:p-1 
    [&>*]:bg-white 
    [&>*]:rounded
    z-50

    transform transition-transform duration-300 ease-out
    ${isOpen ? "translate-x-0" : "translate-x-full"}
    ${isOpen ? "pointer-events-auto" : "pointer-events-none"}
  `;

  const location = useLocation();
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      {/* click-outside backdrop */}
      {isOpen && (
        <button
          className="fixed inset-0 z-40 cursor-default h-[100vh] w-[100vw]"
          onClick={(e) => setIsOpen(false)}
          aria-label="Close menu overlay"
        />
      )}
      <div className="relative">
        <button className="flex-1 w-[50px] text-right" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "Close" : "Menu"}
        </button>

        <div className={drawerCSS}>
          {children ? (
            children
          ) : (
            <>
              <Link to="/profile" className="text-lg text-green-500 underline">
                {user?.username.slice(0, 10)}
                {user?.username.length > 10 ? "…" : ""}👤
              </Link>

              <Link to="/saved-listings">💾 Saved Listings</Link>
              <Link to="/my-listings">Your Listings</Link>
              <Link to="/connections">Connections</Link>
              <Link to="/manage-tags">Manage Tags</Link>
              <LogoutButton />
            </>
          )}
          {user && (
            <div className="text-xs absolute bottom-0 right-0 !bg-secondary my-2 mx-3 z-20">
              Logged in as {user?.screenName}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
