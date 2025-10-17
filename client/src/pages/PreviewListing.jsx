import { useEffect, useState } from "react";
import { Link } from "react-router";
import ListItem from "../components/ListItem.jsx";
import { useNewListingData } from "../Contexts/NewListingContext.jsx";
import { convertFormDataCategories } from "../utils/forms.js";

export default function PreviewListing() {
  const { newListingData, submitNewListing } = useNewListingData();
  const [data, setData] = useState(undefined);

  useEffect(() => {
    console.log("formdata from preview listing: ", newListingData);
    if (!newListingData) return;

    const imageUrl = newListingData.imageUrl;
    const title = newListingData.title;
    const intent = newListingData.intent; // Gift | Request | Project

    const categories = convertFormDataCategories(newListingData);

    const description = newListingData.description;

    setData({ title, imageUrl, intent, categories, description });
  }, [newListingData]);
  if (!data) return <>Loading...</>;
  return (
    <div>
      <div className="text-right underline mt-5">
        <Link to="/create-gift">Back</Link>
      </div>
      {data ? <ListItem data={data} disabled={true} /> : "Loading Preview..."}
      <div className="text-center">
        <button className="border-1 text-3xl rounded p-2 m-2">Submit {data.intent}</button>
      </div>
    </div>
  );
}
