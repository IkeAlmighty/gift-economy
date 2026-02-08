import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import PlusCloseButton from "./PlusCloseButton.jsx";

export default function ToolBar() {
  const location = useLocation();

  const [locationHistory, setLocationHistory] = useState([]);
  const [plusCloseValue, setPlusCloseValue] = useState(false);

  useEffect(() => {
    setLocationHistory([...locationHistory.slice(-50), location.pathname]);
  }, [location.pathname]);

  const handlePlusCloseClick = () => {
    setPlusCloseValue(!plusCloseValue);
  };

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

      <div className="fixed bottom-0 py-3 left-0 right-0 flex justify-center items-center bg-primary">
        <PlusCloseButton value={plusCloseValue} onClick={handlePlusCloseClick} />
      </div>
    </div>
  );
}
