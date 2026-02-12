import * as api from "../../api.js";

export default function ChooseIntent() {
  function handleCreateGift() {
    api.createListing({ intent: "gift", title: "A Gift", description: "This is a gift." });
  }
  return (
    <div className="mt-5">
      {["Create Gift", "Create Request", "Create Project"].map((choice) => (
        <button key={choice} onClick={handleCreateGift} className="text-2xl my-5 block">
          {choice}
        </button>
      ))}
    </div>
  );
}
