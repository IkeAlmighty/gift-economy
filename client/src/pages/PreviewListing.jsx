import { useEffect, useState } from "react";
import ListItem from "../components/ListItem.jsx";
import { useNewListingData } from "../Contexts/NewListingContext.jsx";
import { useListingsData } from "../Contexts/ListingsContext.jsx";
import { convertFormDataTags } from "../utils/forms.js";
import { toTitleCase } from "../utils/strings.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function PreviewListing() {
  const { newListingData, submitNewListing, clearNewListing } = useNewListingData();
  const { hydrateListings } = useListingsData();
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
    const normalSubmitText = e.target.innerHTML;
    e.target.innerHTML = "One Moment...";
    const res = await submitNewListing();

    if (res.ok) {
      navigate("/");
      hydrateListings();
      // FIXME: the entire architecture needs to be changed so that
      // there are no side effects to context changes.
      // An error boundary is happening with a simple call to clearNewListing
      // because the context is changing
      // while the navigation is in progress. We need to ensure that
      // the context change only happens after navigation is fully
      // complete. We can do this by wrapping  the clearNewListing in
      // a setInterval that checks the current page before proceeding, but this
      // is hacky.
      const interval = setInterval(() => {
        if (window.location.pathname === "/") {
          clearNewListing();

          // and then clear the interval:
          clearInterval(interval);
        }
      }, 100);

      toast.success("Created new listing!");
    } else {
      console.log("error: ", res);
      toast.error("Failed to create listing");
      e.target.disabled = false;
      e.target.innerHTML = normalSubmitText;
    }
  }

  const publishButtonClass = `
    border-1
    text-3xl
    rounded
    p-2
    m-2
    disabled:opacity-50
    disabled:cursor-not-allowed
    shadow-lg
    transition-all
    hover:scale-105
    hover:shadow-2xl
  `;

  if (!data) return <>Loading...</>;
  return (
    <div className="px-2 max-w-[400px] mx-auto">
      <div>
        <h2 className="my-4 text-center">Preview of Your {toTitleCase(data.intent)}</h2>
      </div>

      <div className="w-[346px] mx-auto mb-4">
        {data ? <ListItem data={data} disabled={true} /> : "Loading Preview..."}
      </div>

      {!isValid && (
        <div className="text-center text-red-600 my-2">
          Please fill in all required fields (title, description, and at least one tag)
        </div>
      )}
      <div className="text-center mx-auto">
        <button className={publishButtonClass} onClick={handleSubmit} disabled={!isValid}>
          Publish {toTitleCase(data.intent)}
        </button>
      </div>
    </div>
  );
}
