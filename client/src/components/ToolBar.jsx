import PlusCloseButton from "./PlusCloseButton";
import DrawerMenu from "./DrawerMenu";
import { useLocation, Link } from "react-router";
import NotificationBell from "./NotificationBell";

export default function ToolBar({ menuOpen, onAddButton, children }) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const toolbarCSS = `
  flex 
  items-center 
  bg-secondary 
  px-5 
  backdrop-opacity-100 
  h-[110px] 
  top-0 
  left-0 
  w-full 
  fixed
  border-b-2 
  border-t-2 
  z-10
  `;

  return (
    <div className="h-[110px]">
      <div className={toolbarCSS}>
        {!children ? (
          <>
            <div className="flex-1">
              {isHomePage ? (
                <span className="text-lg">Your Feed</span>
              ) : (
                <Link to="/" className="text-lg underline">
                  ← Back to Feed
                </Link>
              )}
            </div>

            <div className="flex-1 flex justify-center">
              {onAddButton && <PlusCloseButton value={menuOpen} onClick={onAddButton} />}
            </div>

            <div className="flex-1 flex items-center justify-end space-x-10">
              <NotificationBell />
              <DrawerMenu />
            </div>
          </>
        ) : (
          <>
            <div className="flex-1">{children.length ? children[0] : children}</div>
            <div className="flex items-center justify-end space-x-10">
              {children.length &&
                children.map((child, index) => index > 0 && <span key={index}>{child}</span>)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
