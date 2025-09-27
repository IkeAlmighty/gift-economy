import { useEffect, useState } from "react";
import ListItem from "../ListItem.jsx";

export default function PreviewListingMenu({ onAction, formData }) {
  const [data, setData] = useState(undefined);

  useEffect(() => {
    if (!formData) return;
    const imageUrl = formData.imageUrl;
    const title = formData.title;
    const superType = formData.superType; // Gift | Request | Project

    const listingTypes = convertFormDataListingTypes(formData);

    const description = formData.description;

    setData({ title, imageUrl, superType, listingTypes, description });
  }, []);

  return (
    <div>
      {data ? <ListItem data={data} disabled={true} /> : "Loading Preview..."}
      <div className="text-center">
        <button
          className="border-1 text-3xl rounded p-2 m-2"
          onClick={() => onAction({ nextMenu: "SUBMIT", formData })}
        >
          Submit {formData.superType}
        </button>
      </div>
    </div>
  );
}

function convertFormDataListingTypes(formData) {
  const listingTypes = [];
  for (let key in formData) {
    const value = formData[key];
    if (key.match(/Type-/) && value === "on") {
      listingTypes.push(key.slice(5).toLowerCase());
    }
  }

  return listingTypes;
}
