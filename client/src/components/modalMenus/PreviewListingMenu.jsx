import { useEffect, useState } from "react";
import ListItem from "../ListItem.jsx";
import { convertFormDataCategories } from "../../utils/forms.js";

export default function PreviewListingMenu({ onAction, formData }) {
  const [data, setData] = useState(undefined);

  useEffect(() => {
    if (!formData) return;
    const imageUrl = formData.imageUrl;
    const title = formData.title;
    const intent = formData.intent; // Gift | Request | Project

    const categories = convertFormDataCategories(formData);

    const description = formData.description;

    setData({ title, imageUrl, intent, categories, description });
  }, []);

  return (
    <div>
      {data ? <ListItem data={data} disabled={true} /> : "Loading Preview..."}
      <div className="text-center">
        <button
          className="border-1 text-3xl rounded p-2 m-2"
          onClick={() => onAction({ nextMenu: "SUBMIT", formData })}
        >
          Submit {formData.intent}
        </button>
      </div>
    </div>
  );
}
