import React, { useState } from "react";

export default function ModalChain({ children, onPrevious, onNext }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const modals = React.Children.toArray(
    children.map((child, index) =>
      React.cloneElement(child, {
        onNext: _onNext,
        onPrevious: _onPrevious,
        z: `z-${index}`,
        className: "top-10 left-0 w-full h-full bg-gray-700 animate-slide-in p-3",
      })
    )
  );

  function _onNext() {
    if (onNext) onNext(currentIndex + 1);
    if (currentIndex < modals.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function _onPrevious() {
    if (onPrevious) onPrevious(currentIndex - 1);
    if (currentIndex > -1) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  return (
    <>
      <div className="absolute flex justify-between p-3 top-0 left-0 w-full animate-slide-in z-200">
        <button onClick={_onPrevious}>{currentIndex === 0 ? "Cancel" : "Previous"}</button>
        {currentIndex < modals.length - 1 && <button onClick={_onNext}>Next</button>}
      </div>

      {currentIndex > 0 && modals[currentIndex - 1]}
      {modals[currentIndex]}
    </>
  );
}
