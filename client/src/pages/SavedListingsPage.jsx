import { useState, useEffect } from "react";
import ToolBar from "../components/ToolBar";
import LogoutButton from "../components/LogoutButton";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useListingsData } from "../Contexts/ListingsContext";
import { deleteListing } from "../controls/listings";
import { toast } from "react-toastify";

export function SavedListingsPage() {
  const { myListings, setSelectedListing, hydrateListings } = useListingsData();
  const [searchParams, _] = useSearchParams();
  const navigate = useNavigate();

  const [actionText, setActionText] = useState(searchParams.get("actionText") || "Delete");
  const [actionId, setActionId] = useState(searchParams.get("actionId"));

  async function handleAction(listing) {
    // when there is no action id, default to deleting the listing:
    if (!actionId) {
      const res = await deleteListing(listing);
      await hydrateListings();

      if (res.ok) toast(`Deleted Listing! (${listing.title})`);
    } else {
      const res = await suggestToListing({ _id: actionId }, listing);
    }
  }

  return (
    <div>
      <ToolBar>
        <span />
        <button>
          <Link to="/connections">Connections</Link>
        </button>

        <button>
          <Link to="/">Back to Feed</Link>
        </button>

        <LogoutButton />
      </ToolBar>
      <div className="px-2">
        <h1>Your Listings</h1>

        {myListings?.map((listing, index) => (
          <div
            key={`mylistings${index}`}
            className="border-b-2 flex [&>*]:mx-2 py-2 justify-between"
          >
            <div>
              <Link to={`/listing/${listing._id}`}>{listing.title}</Link>
            </div>
            <div>{listing.intent}</div>

            <div>
              <button onClick={() => handleAction(listing)}>{actionText}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
