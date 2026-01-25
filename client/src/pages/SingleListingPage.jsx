import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import {
  getListingById,
  handleSuggestionAction,
  getSuggestionsForListing,
  removeParent,
} from "../endpoints/listings";
import ToolBar from "../components/ToolBar";
import ChatClient from "../components/ChatClient";
import { getSafeConnectionDataById } from "../endpoints/user";
import ListingsList from "../components/ListingsList";
import ListItem from "../components/ListItem.jsx";
import { useUser } from "../Contexts/UserContext";
import { toast } from "react-toastify";

export function SingleListingPage() {
  const { _id } = useParams();
  const { user } = useUser();
  const [listingData, setListingData] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState("Loading...");
  const [suggestions, setSuggestions] = useState({ parentSuggestions: [], childSuggestions: [] });
  const [creator, setCreator] = useState(undefined);

  async function loadListingData() {
    const res = await getListingById({ _id });
    if (res.ok) {
      const data = await res.json();
      setListingData(data);
      setErrorMessage(undefined);

      // If user is the creator, fetch suggestions
      if (user && data.creator._id === user._id) {
        const suggestionData = await getSuggestionsForListing(_id);
        setSuggestions(suggestionData);
      }
    } else if (res.status === 401) {
      const { error } = await res.json();
      setErrorMessage(error);
    } else {
      setErrorMessage("Server side error");
    }
  }

  useEffect(() => {
    if (_id) loadListingData();
  }, [_id, user]);

  useEffect(() => {
    if (!listingData) return;
    async function fetchAndSetCreatorData() {
      const res = await getSafeConnectionDataById(listingData.creator._id);
      if (res.ok) {
        const data = await res.json();
        setCreator(data);
      } else {
        const { error } = await res.json();
        setErrorMessage(error);
      }
    }
    fetchAndSetCreatorData();
  }, [listingData, user]);

  async function handleSuggestion(childId, parentId, action) {
    const res = await handleSuggestionAction(childId, parentId, action);
    if (res.ok) {
      const { message } = await res.json();
      toast(message);
      loadListingData(); // Reload to get updated data
    } else {
      const { error } = await res.json();
      toast(error || "Error processing suggestion");
    }
  }

  async function handleRemoveParent(listing) {
    const res = await removeParent(listing._id);
    if (res.ok) {
      const { message } = await res.json();
      toast(message);
      loadListingData(); // Reload to get updated data
    } else {
      const { error } = await res.json();
      toast(error || "Error removing from project");
    }
  }

  const isCreator = user && listingData && listingData.creator._id === user._id;

  if (errorMessage) return <>{errorMessage}</>;
  return (
    <div className="pb-20">
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

            <ChatClient listingId={listingData._id} className="h-96" />
          </div>
        </div>
        {/* Suggested parent projects this listing could be part of: */}
        {isCreator && suggestions.childSuggestions?.length > 0 && (
          <>
            <h2 className="mt-10 text-center underline">Suggested Projects For This Listing</h2>
            <div className="flex flex-row gap-2 justify-around my-5">
              {suggestions.childSuggestions.map((suggestion) => (
                <div>
                  <ListItem data={suggestion.parentListing} />
                  <div className="text-center text-gray-400 text-sm">
                    Them: {suggestion.parentOwnerStatus} - You: {suggestion.childOwnerStatus}
                  </div>
                  <div className="flex justify-center gap-5 my-2">
                    {["Accept", " Reject"].map((action) => (
                      <button
                        className={`${action.trim() === "Accept" ? "bg-green-200" : "bg-red-200"} px-2 rounded`}
                        onClick={() =>
                          handleSuggestion(
                            listingData._id,
                            suggestion.parentListing._id,
                            `${action.toUpperCase()}ED`
                          )
                        }
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {/* Suggested child projects this listing could incorporated: */}
        {isCreator && suggestions.parentSuggestions?.length > 0 && (
          <>
            <h2 className="mt-10 text-center underline">Suggested Components for this Listing</h2>
            <div className="flex flex-row gap-2 justify-around my-5">
              {suggestions.parentSuggestions.map((suggestion) => (
                <div>
                  <ListItem data={suggestion.childListing} />
                  <div className="text-center text-gray-400 text-sm">
                    Them: {suggestion.childOwnerStatus} - You: {suggestion.parentOwnerStatus}
                  </div>
                  <div className="flex justify-center gap-5 my-2">
                    {["Accept", " Reject"].map((action) => (
                      <button
                        className={`${action.trim() === "Accept" ? "bg-green-200" : "bg-red-200"} px-2 rounded`}
                        onClick={() =>
                          handleSuggestion(
                            suggestion.childListing._id,
                            listingData._id,
                            `${action.toUpperCase()}ED`
                          )
                        }
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {listingData?.listings?.length > 0 && (
          <>
            <h2 className="mt-10 text-center underline">Confirmed Project Components</h2>

            <div className="flex flex-row gap-x-1 justify-center text-center">
              <ListingsList
                listings={listingData?.listings}
                onActionSet={
                  isCreator
                    ? [{ actionText: "Remove", onAction: (listing) => handleRemoveParent(listing) }]
                    : []
                }
              />
            </div>
          </>
        )}

        {listingData?.parent && (
          <>
            <h2 className="mt-10 text-center underline">Part of Project</h2>
            <div className="w-[346px] mx-auto mt-5">
              <ListItem data={listingData.parent} />
              {isCreator && (
                <div className="text-center mt-2">
                  <button
                    className="bg-red-200 p-2 rounded border-x hover:bg-red-300"
                    onClick={() => handleRemoveParent(listingData)}
                  >
                    Remove from Project
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
