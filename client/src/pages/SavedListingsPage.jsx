import { useState, useEffect } from "react";
import ToolBar from "../components/ToolBar";
import LogoutButton from "../components/LogoutButton";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useListingsData } from "../Contexts/ListingsContext";
import { deleteListing } from "../controls/listings";
import { toast } from "react-toastify";

export function SavedListingsPage() {
  const { myListings, hydrateListings, savedListings, removeSavedListing } = useListingsData();
  const [searchParams, _] = useSearchParams();
  const navigate = useNavigate();

  const [action, setAction] = useState(searchParams.get("action"));

  async function handleAction(listing) {
    // when there is no action id, default to deleting the listing:
    if (!action) return;
    else if (action === "Suggest") {
      const res = await suggestToListing({ _id: actionId }, listing);
    }
  }

  async function handleDelete(listing) {
    const res = await deleteListing(listing);
    await hydrateListings();
  }

  async function handleRemove(listing) {
    const res = await removeSavedListing(listing);
    if (res.ok) {
      toast.success("Removed from saved listings");
    }
    await hydrateListings();
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
        <h2>Your Listings</h2>

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
              {action && (
                <button className="mx-2 px-2 border-r-2" onClick={() => handleAction(listing)}>
                  {action}
                </button>
              )}
              <button onClick={() => handleDelete(listing)}>Delete</button>
            </div>
          </div>
        ))}

        <h2>Your Saved Listings</h2>
        {savedListings?.map((listing, index) => (
          <div
            key={`savedlistings${index}`}
            className="border-b-2 flex [&>*]:mx-2 py-2 justify-between"
          >
            <div>
              <Link to={`/listing/${listing._id}`}>{listing.title}</Link>
            </div>
            <div>{listing.intent}</div>

            <div>
              {action && (
                <button className="mx-2 px-2 border-r-2" onClick={() => handleAction(listing)}>
                  {action}
                </button>
              )}
              <button onClick={() => handleRemove(listing)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
