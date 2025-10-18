import { useEffect, useState } from "react";
import ListItem from "../components/ListItem.jsx";
import { useNewListingData } from "../Contexts/NewListingContext.jsx";
import { convertFormDataCategories } from "../utils/forms.js";

export default function PreviewListing() {
  const { newListingData, submitNewListing } = useNewListingData();
  const [data, setData] = useState(undefined);

  useEffect(() => {
    if (!newListingData) return;

    const imageUrl = newListingData.imageUrl;
    const title = newListingData.title;
    const intent = newListingData.intent; // Gift | Request | Project

    const categories = convertFormDataCategories(newListingData);

    const description = newListingData.description;

    setData({ title, imageUrl, intent, categories, description });
  }, [newListingData]);

  function toTitleCase(str) {
    if (!str || str.length < 1) return "";
    const firstChar = str[0];
    return firstChar + str.substr(1, str.length).toLowerCase();
  }

  if (!data) return <>Loading...</>;
  return (
    <div>
      {data ? <ListItem data={data} disabled={true} /> : "Loading Preview..."}
      <div className="text-center">
        <button className="border-1 text-3xl rounded p-2 m-2">
          Submit {toTitleCase(data.intent)}
        </button>
      </div>
    </div>
  );
}
