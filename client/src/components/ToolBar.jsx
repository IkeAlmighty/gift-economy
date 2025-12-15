import PlusCloseButton from "./PlusCloseButton";
import { Link } from "react-router";
import DrawerMenu from "./DrawerMenu";

export default function ToolBar({ menuOpen, onAddButton, children }) {
  return (
    <div className="flex items-center justify-between bg-secondary px-5 backdrop-opacity-100 h-[110px] top-0 left-0 w-full sticky border-b-2 border-t-2 z-10">
      {!children ? (
        <>
          <PlusCloseButton value={menuOpen} onClick={onAddButton} />

          <div></div>

          <div className="text-2xl animate-bounce">
            <Link to="/notifications">🔔</Link>
          </div>

          <DrawerMenu />
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
