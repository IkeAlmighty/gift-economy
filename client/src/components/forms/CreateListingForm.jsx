import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useNewListingData } from "../../Contexts/NewListingContext";

export default function CreateGift({ intent }) {
  const { newListingData, updateNewListingData } = useNewListingData();
  const navigate = useNavigate();

  // mappings for header string:
  const chooseHeader = {
    GIFT: "Post a Gift 🎁",
    PROJECT: "Create Project 🏗️",
    REQUEST: "Post Request 🪫",
  };
  // select the header string:
  const header = chooseHeader[intent];

  const [description, setDescription] = useState(newListingData.description || "");
  const MAX_DESCR_CHAR = 200;

  function handleFormSubmit(e) {
    e.preventDefault();

    const newFormData = new FormData(e.target);

    if (newListingData.imageUrl && !newFormData.image)
      newFormData.append("imageUrl", newListingData.imageUrl);

    updateNewListingData(newFormData);
    navigate("/preview-listing");
  }

  return (
    <div>
      <h2 className="mb-5">{header}</h2>
      <form className="flex flex-col space-y-5" onSubmit={handleFormSubmit}>
        <label>
          <div>Title: </div>
          <input type="text" name="title" defaultValue={newListingData.title} />
        </label>
        <label>
          <div>Listing Type(s):</div>
          {["Food", "Shelter", "Labor", "Transportation", "Other"].map((t) => (
            <label key={t}>
              <input
                className="mr-1"
                type="checkbox"
                name={`Type-${t}`}
                defaultChecked={newListingData[`Type-${t}`]}
              />
              <span className="mr-5">{t}</span>
            </label>
          ))}
        </label>

        {intent === "PROJECT" && (
          <div>
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
                defaultChecked={newListingData.allowGiftSuggestions}
              />{" "}
              yes
              <input
                required={true}
                className="ml-5"
                type="radio"
                value={false}
                name="allowGiftSuggestions"
                defaultChecked={newListingData.allowGiftSuggestions === "false"}
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
                defaultChecked={newListingData.allowRequestSuggestions}
              />{" "}
              yes
              <input
                required={true}
                className="ml-5"
                type="radio"
                value={false}
                name="allowRequestSuggestions"
                defaultChecked={newListingData.allowRequestSuggestions === "false"}
              />{" "}
              no
            </fieldset>
          </div>
        )}

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
          <div>{newListingData.imageUrl ? "Change image:" : "Select an image:"}</div>
          <input name="image" type="file" accept="image/png, image/jpg, image/jpeg" />
        </div>

        <div>
          <input type="submit" value="Preview" />
        </div>
      </form>
    </div>
  );
}
