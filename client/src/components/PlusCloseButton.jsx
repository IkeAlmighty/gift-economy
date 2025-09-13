import { useState } from "react";

export default function PlusCloseButton({ value, onClick }) {
  return (
    <div className="w-[70px] h-0 pb-[70px] relative my-5">
      <button
        className={`absolute text-5xl top-0 left-0 right-0 bottom-0 text-center${value ? "ease-in rotate-45" : ""}`}
        onClick={onClick}
      >
        &#10010;
      </button>
    </div>
  );
}
