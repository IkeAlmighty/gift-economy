import { useEffect, useState } from "react";
import ListItem from "../components/ListItem.jsx";
import { useNewListingData } from "../Contexts/NewListingContext.jsx";
import { convertFormDataTags } from "../utils/forms.js";
import { toTitleCase } from "../utils/strings.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function PreviewListing() {
  const { newListingData, submitNewListing } = useNewListingData();
  const [data, setData] = useState(undefined);
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!newListingData) return;

    const imageUrl = newListingData.imageUrl;
    const title = newListingData.title;
    const intent = newListingData.intent; // Gift | Request | Project

    const tags = convertFormDataTags(newListingData);

    const description = newListingData.description;

    // Validate required fields
    const valid = !!(title && title.trim() && description && description.trim() && tags.length > 0);
    setIsValid(valid);

    setData({ title, imageUrl, intent, tags, description });
  }, [newListingData]);

  async function handleSubmit(e) {
    e.target.disabled = true;
    e.target.innerHTML = "One Moment...";
    const res = await submitNewListing();

    if (res.ok) {
      navigate("/");
      toast.success("Created new listing!");
    } else {
      console.log("error: ", res);
      toast.error("Failed to create listing");
      e.target.disabled = false;
      e.target.innerHTML = "Submit";
    }
  }

  if (!data) return <>Loading...</>;
  return (
    <div className="px-2 max-w-[400px] mx-auto">
      {data ? <ListItem data={data} disabled={true} /> : "Loading Preview..."}
      {!isValid && (
        <div className="text-center text-red-600 my-2">
          Please fill in all required fields (title, description, and at least one tag)
        </div>
      )}
      <div className="text-center">
        <button
          className="border-1 text-3xl rounded p-2 m-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={!isValid}
        >
          Submit {toTitleCase(data.intent)}
        </button>
      </div>
    </div>
  );
}
