import React, { useState } from "react";

export default function ModalChain({ children }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const modals = React.Children.toArray(
    children.map((child) => React.cloneElement(child), { onNext, onPrevious })
  );

  function onNext() {
    if (currentIndex < modals.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    console.log("Next clicked");
  }

  function onPrevious() {
    if (currentIndex > -1) {
      setCurrentIndex(currentIndex - 1);
    }
    console.log("Previous clicked");
  }

  return modals[currentIndex];
}
