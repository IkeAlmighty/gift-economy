export default function PlusCloseButton({ value, onClick }) {
  return (
    <div className="text-4xl">
      <button className="w-10 h-10 flex align-middle justify-center" onClick={onClick}>
        &#10010;
      </button>
    </div>
  );
}
