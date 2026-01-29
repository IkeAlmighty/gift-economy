import { useEffect, useRef, useState } from "react";
import ListItem from "./ListItem.jsx";
import { useAppSettings } from "../Contexts/AppSettingsContext.jsx";

export default function ListingsList({ listings, onActionSet = [], itemsDisabled = false }) {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const { settings } = useAppSettings();

  const actionColorMap = {
    Suggest: "bg-green-200 hover:bg-green-300",
    Delete: "bg-red-300 hover:bg-red-400",
    Remove: "bg-red-300 hover:bg-red-400",
    Accept: "bg-green-300 hover:bg-green-400",
    Deny: "bg-red-300 hover:bg-red-400",
  };

  useEffect(() => {
    const updateCenteredItem = () => {
      if (!containerRef.current) return;
      if (window.innerWidth > 700) return setFocusedIndex(null); // disable centering on wider screens

      // ratio index / total items = scrollY / scrollableHeight
      const containerHeight = containerRef.current.scrollHeight;

      // get the current scroll position
      const scrollY = window.scrollY || 0;

      // Calculate the index of the first item viewable in container
      let offset = 0.5;
      let index = (scrollY / containerHeight) * listings.length;
      if (index < 1.2) offset = 0;
      if (index > listings.length - 2.2) offset = 0.8;

      index = Math.round(index + offset);
      setFocusedIndex(index);
    };

    // Listen to scroll on both window and document
    const handleScroll = () => {
      requestAnimationFrame(updateCenteredItem);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", updateCenteredItem);
    document.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", updateCenteredItem);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [listings?.length]);

  return (
    <div ref={containerRef} className="flex flex-wrap justify-center gap-x-2 gap-y-5 mt-5 mb-50">
      {listings?.map((listing, index) => (
        <div
          key={`yourlistings${index}`}
          ref={(el) => (itemRefs.current[index] = el)}
          className="flex flex-col flex-wrap gap-y-1"
        >
          <ListItem
            data={listing}
            isCentered={
              !settings.doScrollAnimation || (focusedIndex !== null ? index === focusedIndex : true)
            }
            disabled={itemsDisabled}
          />
          {onActionSet && (
            <div className="text-center flex flex-row gap-x-1 mt-2">
              {onActionSet.map(({ actionText, onAction }) => (
                <button
                  key={`action-btn-${actionText}-${index}`}
                  className={`p-2 rounded border-x-2 w-full ${actionColorMap[actionText]}`}
                  onClick={() => onAction(listing)}
                >
                  {actionText}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
