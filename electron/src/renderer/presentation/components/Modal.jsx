export default function Modal({ children, onNext, onPrevious }) {
  return (
    <div className="fixed inset-0 h-[88vh] bg-white">
      <div>
        <button onClick={onPrevious} className="absolute top-2 left-2">
          Previous
        </button>
        <button onClick={onNext} className="absolute top-2 right-2">
          Next
        </button>
      </div>
      <div className="bg-white p-4 rounded my-10">{children}</div>
    </div>
  );
}
