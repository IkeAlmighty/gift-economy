import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getListingById, handleSuggestionAction } from "../endpoints/listings";
import ToolBar from "../components/ToolBar";
import ChatClient from "../components/ChatClient";
import { getSafeConnectionDataById } from "../endpoints/user";
import ListingsList from "../components/ListingsList";

export function SingleListingPage() {
  const { _id } = useParams();
  const [listingData, setListingData] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState("Loading...");

  const [creator, setCreator] = useState(undefined);

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

  useEffect(() => {
    if (!listingData) return;
    async function fetchAndSetCreatorData() {
      const res = await getSafeConnectionDataById(listingData.creator);
      if (res.ok) {
        const data = await res.json();
        setCreator(data);
      } else {
        const { error } = await res.json();
        setErrorMessage(error);
      }
    }
    fetchAndSetCreatorData();
  }, [listingData]);

  async function _handleSuggestionAction(suggestionId, action) {
    const res = await handleSuggestionAction(listingData._id, suggestionId, action);

    if (res.ok) {
      const updatedListing = await getListingById({ _id: listingData._id });
      setListingData(await updatedListing.json());
    }
  }

  if (errorMessage) return <>{errorMessage}</>;
  return (
    <div>
      <ToolBar />

      <div className="px-3 max-w-[900px] mx-auto">
        <div className="mt-5">
          <span className="text-4xl">{listingData.title}</span> |{" "}
          <span className="text-sm">{listingData.intent}</span>
        </div>
        <span>created by {creator?.username}</span>

        <div className="flex flex-wrap flex-row mx-auto justify-between my-5 gap-y-10 border-t-2 pt-5 border-gray-200">
          <div className="flex-grow">
            <h3>Description</h3>
            <div className="w-[300px]">{listingData.description}</div>
          </div>
          <div className="relative text-center border-2 rounded min-h-[400px] min-w-[300px] flex-grow">
            <div className="absolute -top-5 -right-1 bg-secondary p-1 rounded opacity-90 hover:opacity-100">
              <Link to={`/chat/${listingData._id}`} target="_blank">
                Open in new Tab ↗
              </Link>
            </div>

            <ChatClient listingId={listingData._id} />
          </div>
        </div>

        {listingData?.listingsSuggestions?.length > 0 && (
          <>
            <h2 className="mt-10 text-center underline">Suggested to this Project</h2>
            <div className="flex flex-row flex-wrap gap-x-2 gap-y-5 pt-5 justify-center text-center">
              <ListingsList
                listings={listingData?.listingsSuggestions}
                onActionSet={[
                  {
                    actionText: "Accept",
                    onAction: (listing) => _handleSuggestionAction(listing._id, "accept"),
                  },
                  {
                    actionText: "Deny",
                    onAction: (listing) => _handleSuggestionAction(listing._id, "deny"),
                  },
                ]}
              />
            </div>
          </>
        )}

        {listingData?.listings.length > 0 && (
          <>
            <h2 className="mt-10 text-center underline">Confirmed Project Components</h2>

            <div className="flex flex-row gap-x-1 justify-center text-center">
              <ListingsList
                listings={listingData?.listings}
                onActionSet={[
                  { actionText: "Remove", onAction: (listing) => console.log("Remove", listing) },
                ]}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
