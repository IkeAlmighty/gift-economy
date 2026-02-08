import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import PlusCloseButton from "./PlusCloseButton.jsx";

export default function ToolBar() {
  const location = useLocation();

  const [locationHistory, setLocationHistory] = useState([]);

  useEffect(() => {
    setLocationHistory([...locationHistory.slice(-50), location.pathname]);
  }, [location.pathname]);

  function BackLink({ children }) {
    if (location.pathname === "/") {
      return null;
    }
    if (locationHistory.length < 2) {
      return <Link to="/">Feed</Link>;
    }

    return <Link to={locationHistory[locationHistory.length - 2]}>{children}</Link>;
  }

  return (
    <div className="h-12 w-full">
      <BackLink>Back</BackLink>
    </div>
  );
}
