import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getListingById } from "../endpoints/listings";
import ListItem from "../components/ListItem";

export function SingleListingPage() {
  const { _id } = useParams();
  const [listingData, setListingData] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState("Loading...");

  useEffect(() => {
    async function fetchAndSetListingData() {
      const res = await getListingById({ _id });
      if (res.ok) {
        setListingData(await res.json());
        setErrorMessage(undefined);
      } else if (res.status === 401) {
        const { error } = await res.json();
        setErrorMessage(error);
      } else {
        setErrorMessage("Server side error");
      }
    }

    if (_id) fetchAndSetListingData();
  }, [_id]);

  if (errorMessage) return <>{errorMessage}</>;
  return <ListItem data={listingData} />;
}
