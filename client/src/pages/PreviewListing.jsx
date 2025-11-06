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
  const navigate = useNavigate();

  useEffect(() => {
    if (!newListingData) return;

    const imageUrl = newListingData.imageUrl;
    const title = newListingData.title;
    const intent = newListingData.intent; // Gift | Request | Project

    const tags = convertFormDataTags(newListingData);

    const description = newListingData.description;

    setData({ title, imageUrl, intent, tags, description });
  }, [newListingData]);

  async function handleSubmit() {
    const res = await submitNewListing();

    if (res.ok) {
      toast("Created new listing!");
      navigate("/");
    } else {
      console.log("error: ", res);
    }
  }

  if (!data) return <>Loading...</>;
  return (
    <div className="px-2">
      {data ? <ListItem data={data} disabled={true} /> : "Loading Preview..."}
      <div className="text-center">
        <button className="border-1 text-3xl rounded p-2 m-2" onClick={handleSubmit}>
          Submit {toTitleCase(data.intent)}
        </button>
      </div>
    </div>
  );
}
