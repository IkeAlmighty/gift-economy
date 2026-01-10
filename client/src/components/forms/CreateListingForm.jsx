import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useNewListingData } from "../../Contexts/NewListingContext";
import { useTags } from "../../Contexts/TagsContext.jsx";

export default function CreateListing({ intent }) {
  const { newListingData, updateNewListingData } = useNewListingData();
  const { tagMap } = useTags();
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
  const [customTags, setCustomTags] = useState(newListingData.customTags || "");
  const MAX_DESCR_CHAR = 200;

  function handleFormSubmit(e) {
    e.preventDefault();

    const newFormData = new FormData(e.target);

    // Check if at least one tag is selected (either suggested or custom)
    const hasSuggestedTag = ["Food", "Shelter", "Labor", "Transportation", "Other"].some(
      (t) => newFormData.get(`Type-${t}`) === "on"
    );

    const customTagList = (newFormData.get("customTags") || "")
      .split(/[,\n]/)
      .map((t) => t.trim())
      .filter(Boolean);

    const hasTag = hasSuggestedTag || customTagList.length > 0;

    if (!hasTag) {
      alert("Please select at least one listing type.");
      return;
    }

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
          <input type="text" name="title" defaultValue={newListingData.title} required />
        </label>

        <div className="flex flex-col gap-3">
          <div>Listing Type(s):</div>
          <div className="flex flex-row flex-wrap gap-4">
            {["Food", "Shelter", "Labor", "Transportation"].map((t) => (
              <label key={t} className="flex items-center">
                <input
                  className="mr-1"
                  type="checkbox"
                  name={`Type-${t}`}
                  defaultChecked={newListingData[`Type-${t}`]}
                />
                <span className="-translate-y-0.5">
                  {tagMap[t.toLowerCase()] || "❓"}
                  {t}
                </span>
              </label>
            ))}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold" htmlFor="customTags">
              Add your own tags (comma separated)
            </label>
            <input
              id="customTags"
              name="customTags"
              className="border rounded p-2"
              type="text"
              placeholder="community, repair, childcare"
              value={customTags}
              onChange={(e) => setCustomTags(e.target.value)}
            />
          </div>
        </div>

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
          required
        />
        <div>
          {description.length} / {MAX_DESCR_CHAR}
        </div>

        {/* <div>
          <div>{newListingData.imageUrl ? "Change image:" : "Select an image:"}</div>
          <input name="image" type="file" accept="image/png, image/jpg, image/jpeg" />
        </div> */}

        <div>
          <input type="submit" value="Preview" />
        </div>
      </form>
    </div>
  );
}
