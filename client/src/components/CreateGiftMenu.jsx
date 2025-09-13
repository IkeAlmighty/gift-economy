import { useState } from "react";

export default function CreateGiftMenu({ onAction }) {
  const [description, setDescription] = useState("");
  const MAX_DESCR_CHAR = 200;

  function handleFormSubmit(e) {
    e.preventDefault();

    console.log(new FormData(e.target));
  }

  return (
    <div>
      <h2 className="mb-5">Post a Gift 🎁</h2>
      <form className="flex flex-col space-y-2" onSubmit={handleFormSubmit}>
        <label>
          <div>Title: </div>
          <input type="text" name="title" />
        </label>

        <label>
          <div>Listing Type(s):</div>
          {["Food", "Shelter", "Labor", "Transportation", "Other"].map((t) => (
            <label>
              <input className="mr-1" type="checkbox" name={`Type-${t}`} />
              <span className="mr-5">{t}</span>
            </label>
          ))}
        </label>

        <div>Description:</div>
        <textarea
          className="min-h-[200px] border-2 rounded p-2"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={MAX_DESCR_CHAR}
        />
        <div>
          {description.length} / {MAX_DESCR_CHAR}
        </div>

        <div>
          <div>Select an image:</div>
          <input
            name="image"
            type="file"
            accept="image/png, image/jpg, image/jpeg"
          />
        </div>

        <div>
          <input type="submit" value="Post" />
        </div>
      </form>
    </div>
  );
}
