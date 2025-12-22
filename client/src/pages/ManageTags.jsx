import { useState } from "react";
import { useTags } from "../Contexts/TagsContext.jsx";
import ToolBar from "../components/ToolBar.jsx";
import { toast } from "react-toastify";

export default function ManageTags() {
  const { tags, addTag, loading } = useTags();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!name.trim() || !emoji.trim()) {
      setMessage("Please provide both a tag name and an emoji.");
      return;
    }

    const { error } = await addTag({ name, emoji });
    if (error) {
      setMessage(error);
    } else {
      toast.success(`Tag ${emoji.trim()} saved successfully!`);
      setMessage("");
      setName("");
      setEmoji("");
    }
  };

  return (
    <>
      <ToolBar />
      <div className="max-w-[520px] mx-auto mt-10 px-2 flex flex-col gap-6 pb-10">
        <div>
          <h2 className="text-2xl font-semibold">Manage Tag Emojis</h2>
          <div className="text-sm italic text-gray-500">(everyone can use these once added)</div>
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Tag name</span>
            <input
              className="border rounded p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. repair"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Emoji</span>
            <input
              className="border rounded p-2"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="e.g. 🔧"
            />
          </label>

          <button
            type="submit"
            disabled={emoji.trim() === "" || name.trim() === ""}
            className={`bg-secondary  rounded px-4 py-2 hover:opacity-90 active:opacity-80`}
          >
            Save Tag
          </button>
          {message && <div className="text-sm text-red-500">{message}</div>}
        </form>

        <div>
          <h3 className="font-semibold mb-2">Current tags</h3>
          {loading ? (
            <div>Loading tags...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {tags.map((t) => (
                <div
                  key={t._id}
                  className="border rounded p-2 flex items-center justify-between text-sm"
                >
                  <span>{t.name}</span>
                  <span className="text-lg">{t.emoji}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
