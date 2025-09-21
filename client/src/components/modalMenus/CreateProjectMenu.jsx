import { useState } from "react";

export default function CreateProjectMenu({ onAction, prefill = {} }) {
  const [description, setDescription] = useState("");
  const MAX_DESCR_CHAR = 200;

  function handleFormSubmit(e) {
    e.preventDefault();

    const data = new FormData(e.target);
    onAction({ nextMenu: "PreviewListingMenu", data });
  }

  return (
    <div>
      <h2 className="mb-5">Create Project 🏗️</h2>

      <form className="flex flex-col space-y-5" onSubmit={handleFormSubmit}>
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

        <fieldset>
          <legend>
            Are you open to <b>Gift</b> suggestions for this project?
          </legend>
          <input
            required={true}
            className=""
            type="radio"
            value={true}
            name="allowGiftSuggestions"
          />{" "}
          yes
          <input
            required={true}
            className="ml-5"
            type="radio"
            value={false}
            name="allowGiftSuggestions"
          />{" "}
          no
        </fieldset>

        <fieldset>
          <legend>
            Are you open to <b>Request</b> suggestions for this project?
          </legend>
          <input
            required={true}
            className=""
            type="radio"
            value={true}
            name="allowRequestSuggestions"
          />{" "}
          yes
          <input
            required={true}
            className="ml-5"
            type="radio"
            value={false}
            name="allowRequestSuggestions"
          />{" "}
          no
        </fieldset>

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
          After you post the project, you can select listings from your feed to
          add to it.
        </div>

        <div>
          <input type="submit" value="Post" />
        </div>
      </form>
    </div>
  );
}
