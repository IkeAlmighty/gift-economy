import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getListingById } from "../endpoints/listings";
import ToolBar from "../components/ToolBar";
import LogoutButton from "../components/LogoutButton";
import ChatClient from "../components/ChatClient";
import ListItem from "../components/ListItem";
import { getSafeConnectionDataById } from "../endpoints/user";

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

  useEffect(() => {
    if (!listingData) return;
    fetchAndSetCreatorData();
  }, [listingData]);

  if (errorMessage) return <>{errorMessage}</>;
  return (
    <div>
      <ToolBar>
        <span></span>

        <Link to="/">Back to Feed</Link>

        <LogoutButton />
      </ToolBar>

      <div className="p-1">
        <div className="mt-5">
          <span className="text-4xl">{listingData.title}</span> |{" "}
          <span className="text-sm">{listingData.intent}</span>
        </div>
        <span>created by {creator?.username}</span>

        <div className="flex flex-wrap flex-row max-auto justify-between [&>*]:min-w-1/2 my-5 gap-y-10 border-t-2 pt-5 border-gray-200">
          <div className="flex-1 flex-grow">
            <h3>Description</h3>
            {listingData.description}
          </div>
          <div className="relative text-center border-2 rounded min-h-[400px] flex-grow">
            <div className="absolute -top-5 -right-1 bg-secondary p-1 rounded opacity-90 hover:opacity-100">
              <Link to={`/chat?listing=${listingData._id}`} target="_blank">
                Open in new Tab ↗
              </Link>
            </div>
            <ChatClient listingId={listingData._id} />
          </div>
        </div>

        {listingData?.listingsSuggestions && (
          <h2 className="mt-10 text-center underline">Suggested to this Project</h2>
        )}

        <div className="flex flex-row flex-wrap gap-x-2 gap-y-5 pt-5">
          {listingData?.listingsSuggestions?.map((suggestion) => {
            return (
              <div className="mx-auto">
                <ListItem data={suggestion} />
                <div className="[&>button]:p-1 [&>button]:rounded flex flex-row justify-around">
                  {/* TODO: create handlers for buttons */}
                  <button className="bg-green-300 w-[100px]">Accept</button>
                  <button className="bg-red-300 w-[100px]">Deny</button>
                </div>
              </div>
            );
          })}
        </div>

        {listingData?.listings.length > 0 && (
          <h2 className="mt-10 text-center underline">Confirmed Project Components</h2>
        )}

        <div className="flex flex-row gap-x-1">
          {listingData?.listings?.map((suggestion) => {
            return (
              <div className="mx-auto">
                <ListItem data={suggestion} />
                <div className="text-center">
                  {/* TODO: create handler for button */}
                  <button className="p-1 rounded border-2">Remove from Project</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
