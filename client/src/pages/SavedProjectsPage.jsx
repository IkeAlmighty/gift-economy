import ToolBar from "../components/ToolBar";
import LogoutButton from "../components/LogoutButton";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useListingsData } from "../Contexts/ListingsContext";
import { toast } from "react-toastify";

export function SavedProjectsPage() {
  const { savedListings, removeSavedListing, suggestToListing } = useListingsData();
  const [searchParams, _] = useSearchParams();
  const navigate = useNavigate();

  const action = searchParams.get("action");
  const target = searchParams.get("target");
  const callback = searchParams.get("callback") || "/";

  async function handleAction(listing) {
    // when there is no action id, default to removing the listing:
    if (!action) return handleRemove(listing);
    else if (action === "Suggest") {
      const res = await suggestToListing(listing, { _id: target });
      const json = await res.json();

      if (res.ok) {
        toast.success(json.message);
        navigate(`${callback}`);
      } else toast.error(json.error);
    }
  }

  async function handleRemove(listing) {
    const res = await removeSavedListing(listing);
    const json = await res.json();
    toast.success(json.message);
  }

  return (
    <div>
      <ToolBar>
        <h2>Your Saved Listings</h2>
        <span />

        <button>
          <Link to="/">{action ? "Cancel" : "Back to Feed"}</Link>
        </button>

        <LogoutButton />
      </ToolBar>
      <div className="px-2">
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
              <button className="mx-2 px-2 " onClick={() => handleAction(listing)}>
                {action === "Suggest" ? "Suggest" : "Remove"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
