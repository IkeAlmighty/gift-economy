import { useEffect } from "react";
import { useLocation } from "react-router";
import { useNewListingData } from "../Contexts/NewListingContext.jsx";
import CreateListingForm from "../components/forms/CreateListingForm.jsx";

export default function CreateGift() {
  const { updateNewListingData } = useNewListingData();
  const location = useLocation();
  const intent = location.pathname.split("-")[1].toUpperCase();

  useEffect(() => {
    // on load in, change the intent on newListingData to match the path
    const fd = new FormData();
    fd.append("intent", intent);

    updateNewListingData(fd);
  }, []);

  return (
    <div className="px-2">
      <CreateListingForm intent={intent} />
    </div>
  );
}
