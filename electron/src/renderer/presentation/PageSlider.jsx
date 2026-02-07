import { useEffect, useState } from "react";
import { useLocation } from "react-router";

export default function PageSlider({ children }) {
  const location = useLocation();

  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    setIsSliding(true);
    const timer = setTimeout(() => {
      setIsSliding(false);
    }, 150); // Duration of the slide animation

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return <div className={isSliding ? "animate-slide-in" : ""}>{children}</div>;
}
