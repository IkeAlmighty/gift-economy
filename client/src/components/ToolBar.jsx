import PlusCloseButton from "./PlusCloseButton";
import DrawerMenu from "./DrawerMenu";
import { useLocation } from "react-router";
import titles from "../utils/titles";
import NotificationBell from "./NotificationBell";

export default function ToolBar({ menuOpen, onAddButton, children }) {
  const location = useLocation();

  return (
    <div className="flex items-center justify-between bg-secondary px-5 backdrop-opacity-100 h-[110px] top-0 left-0 w-full sticky border-b-2 border-t-2 z-10">
      {!children ? (
        <>
          {onAddButton ? (
            <PlusCloseButton value={menuOpen} onClick={onAddButton} />
          ) : (
            <div>{titles[location.pathname]}</div>
          )}

          <span />

          <div className="flex items-center justify-end space-x-10">
            <NotificationBell />
            <DrawerMenu />
          </div>
        </>
      ) : (
        <>
          <div>{children.length ? children[0] : children}</div>
          <div className="flex items-center justify-end space-x-10">
            {children.length && children.map((child, index) => index > 0 && child)}
          </div>
        </>
      )}
    </div>
  );
}
