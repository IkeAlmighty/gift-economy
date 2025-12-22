import { useEffect, useRef, useState } from "react";
import ListItem from "./ListItem.jsx";

export default function ListingsList({ listings, onAction, actionText }) {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const [centeredIndex, setCenteredIndex] = useState(null);
  const [itemsDisabled, setItemsDisabled] = useState(actionText === "Suggest");

  const actionColorMap = {
    Suggest: "bg-green-200 hover:bg-green-300",
    Delete: "bg-red-300 hover:bg-red-400",
    Remove: "bg-red-300 hover:bg-red-400",
  };

  useEffect(() => {
    setItemsDisabled(actionText === "Suggest");
  }, [actionText]);

  useEffect(() => {
    const updateCenteredItem = () => {
      const viewportCenter = window.innerHeight / 2;
      let closestIndex = null;
      let closestDistance = Infinity;

      itemRefs.current.forEach((item, index) => {
        if (!item) return;
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const distance = Math.abs(viewportCenter - itemCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setCenteredIndex(closestIndex);
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
  }, []);

  return (
    <div ref={containerRef} className="flex flex-wrap justify-center gap-x-2 gap-y-5 mt-5 mb-50">
      {listings?.map((listing, index) => (
        <div
          key={`yourlistings${index}`}
          ref={(el) => (itemRefs.current[index] = el)}
          className="flex flex-col flex-wrap gap-y-1"
        >
          <ListItem data={listing} isCentered={index === centeredIndex} disabled={itemsDisabled} />
          {onAction && actionText && (
            <button
              className={`p-2 rounded border-x-2 ${actionColorMap[actionText]}`}
              onClick={() => onAction(listing)}
            >
              {actionText}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
