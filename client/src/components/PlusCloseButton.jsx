import { useState } from "react";

export default function PlusCloseButton({ onClick }) {
  const [isPlus, setIsPlus] = useState(true);

  function handleClick() {
    setIsPlus(!isPlus);
    onClick(isPlus);
  }

  return (
    <div className="w-[70px] h-0 pb-[70px] relative my-5">
      <button
        className={`absolut text-5xl top-0 left-0 right-0 bottom-0 text-center${isPlus ? "ease-in rotate-45" : ""}`}
        onClick={handleClick}
      >
        &#10010;
      </button>
    </div>
  );
}
