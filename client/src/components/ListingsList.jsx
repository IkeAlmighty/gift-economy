import { useEffect, useRef, useState } from "react";
import ListItem from "./ListItem.jsx";

export default function ListingsList({ listings, onActionSet = [], itemsDisabled = false }) {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const [centeredIndex, setCenteredIndex] = useState(0);

  const actionColorMap = {
    Suggest: "bg-green-200 hover:bg-green-300",
    Delete: "bg-red-300 hover:bg-red-400",
    Remove: "bg-red-300 hover:bg-red-400",
    Accept: "bg-green-300 hover:bg-green-400",
    Deny: "bg-red-300 hover:bg-red-400",
  };

  useEffect(() => {
    const updateCenteredItem = () => {
      //FIXME: work on a index incrementing scroll affect so that
      // the focused item changes predictably as you scroll on larger rows.

      // Use a smooth transition based on scroll position
      // When scrollY is low, bias toward top; when high, use center
      const scrollY = window.scrollY;
      const transitionRange = 200; // pixels over which to transition
      const scrollFactor = Math.min(scrollY / transitionRange, 1); // 0 to 1

      // Interpolate between top position and center position
      const topBias = window.innerHeight * 0.2; // 20% from top when not scrolled
      const centerPosition = window.innerHeight / 2;
      const effectiveCenter = topBias + (centerPosition - topBias) * scrollFactor;

      let closestIndex = null;
      let closestDistance = Infinity;

      itemRefs.current.forEach((item, index) => {
        if (!item) return;
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const distance = Math.abs(effectiveCenter - itemCenter);

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
