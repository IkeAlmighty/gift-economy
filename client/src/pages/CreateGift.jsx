import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useNewListingData } from "../Contexts/NewListingContext";

export default function CreateGift() {
  const { newListingData, updateNewListingData } = useNewListingData();
  const navigate = useNavigate();

  const [description, setDescription] = useState(newListingData.description || "");
  const MAX_DESCR_CHAR = 200;

  function handleFormSubmit(e) {
    e.preventDefault();

    const newFormData = new FormData(e.target);
    newFormData.set("intent", "Gift");

    if (newListingData.imageUrl && !newFormData.image)
      newFormData.append("imageUrl", newListingData.imageUrl);

    updateNewListingData(newFormData);
    navigate("/preview-listing");
  }

  return (
    <div>
      <div className="text-right underline mt-5">
        <Link to="/create-listing">Back</Link>
      </div>
      <h2 className="mb-5">Post a Gift 🎁</h2>
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
