import { useState } from "react";

export default function CreateProjectMenu({ onAction, formData = {} }) {
  const [description, setDescription] = useState(formData.description || "");
  const MAX_DESCR_CHAR = 200;

  function handleFormSubmit(e) {
    e.preventDefault();

    const newFormData = new FormData(e.target);
    newFormData.append("superType", "Gift");

    if (formData.imageUrl && !newFormData.image) newFormData.append("imageUrl", formData.imageUrl);

    onAction({ nextMenu: "PreviewListingMenu", formData: newFormData });
  }

  return (
    <div>
      <h2 className="mb-5">Create Project 🏗️</h2>

      <form className="flex flex-col space-y-5" onSubmit={handleFormSubmit}>
        <label>
          <div>Title: </div>
          <input type="text" name="title" defaultValue={formData.title} />
        </label>

        <label>
          <div>Listing Type(s):</div>
          {["Food", "Shelter", "Labor", "Transportation", "Other"].map((t) => (
            <label key={t}>
              <input
                className="mr-1"
                type="checkbox"
                name={`Type-${t}`}
                defaultChecked={formData[`Type-${t}`]}
              />
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
            defaultChecked={formData.allowGiftSuggestions}
          />{" "}
          yes
          <input
            required={true}
            className="ml-5"
            type="radio"
            value={false}
            name="allowGiftSuggestions"
            defaultChecked={formData.allowGiftSuggestions === "false"}
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
            defaultChecked={formData.allowRequestSuggestions}
          />{" "}
          yes
          <input
            required={true}
            className="ml-5"
            type="radio"
            value={false}
            name="allowRequestSuggestions"
            defaultChecked={formData.allowRequestSuggestions === "false"}
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
          <div>{formData.imageUrl ? "Change image:" : "Select an image:"}</div>
          <input name="image" type="file" accept="image/png, image/jpg, image/jpeg" />
        </div>

        <div>After you post the project, you can select listings from your feed to add to it.</div>

        <div>
          <input type="submit" value="Post" />
        </div>
      </form>
    </div>
  );
}
