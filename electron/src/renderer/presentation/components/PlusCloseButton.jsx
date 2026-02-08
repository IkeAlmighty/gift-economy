export default function PlusCloseButton({ value, onClick }) {
  return (
    <div className="text-4xl">
      <button
        className={`align-middle justify-center ${value === "-" ? "animate-rotate-clockwise-45" : "animate-rotate-counterclockwise-45"}`}
        onClick={onClick}
      >
        &#10010;
      </button>
    </div>
  );
}
