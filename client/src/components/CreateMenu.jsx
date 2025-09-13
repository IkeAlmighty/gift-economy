export default function CreateMenu({ onAction }) {
  return (
    <div className="flex flex-col space-y-10 my-20 bg-white text-2xl">
      <div className="text-center underline">Choose One:</div>
      <button onClick={(e) => onAction("Post Gift")}>Post Gift 🎁</button>
      <button onClick={(e) => onAction("Post Request")}>Post Request 🪫</button>
      <button onClick={(e) => onAction("Post Project")}>
        Create Project 🏗️
      </button>
    </div>
  );
}
