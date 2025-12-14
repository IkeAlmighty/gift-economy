import { useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import LogoutButton from "./LogoutButton";
export default function DrawerMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const right = useRef(5);

  useEffect(() => {
    if (isOpen) {
      while (right.current < 500) right.current += 1;
    }
  }, [isOpen]);

  const drawerCSS = `
    absolute 
    h-screen 
    overflow-y-hidden
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

  return (
    <div className="relative">
      <button className="flex-1 w-[50px] text-right" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Close" : "Menu"}
      </button>

      {/* Optional: click-outside backdrop */}
      {isOpen && (
        <button
          className="fixed inset-0 z-40 cursor-default"
          onClick={(e) => setIsOpen(false)}
          aria-label="Close menu overlay"
        />
      )}

      <div className={drawerCSS}>
        {children ? (
          children
        ) : (
          <>
            <Link to="/connections">Connections</Link>
            <Link to="/my-listings">Your Listings</Link>
            <Link to="/saved-listings">Saved Listings</Link>

            <div>
              <LogoutButton />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
