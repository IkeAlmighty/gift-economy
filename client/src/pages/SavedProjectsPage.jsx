import ToolBar from "../components/ToolBar";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useListingsData } from "../Contexts/ListingsContext";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import ListingsList from "../components/ListingsList";
import DrawerMenu from "../components/DrawerMenu";

export function SavedProjectsPage() {
  const { savedListings, removeSavedListing, suggestToListing, myListings } = useListingsData();
  const [searchParams, _] = useSearchParams();
  const navigate = useNavigate();

  const action = searchParams.get("action") || "Remove";
  const target = searchParams.get("target");
  const callback = searchParams.get("callback") || "/";

  const [filteredResults, setFilteredResults] = useState(savedListings);
  const [viewMode, setViewMode] = useState("saved"); // 'saved' | 'mine'

  useEffect(() => {
    if (action === "Suggest") {
      setFilteredResults(savedListings.filter((l) => l.intent !== "GIFT"));
    } else {
      setFilteredResults(savedListings);
    }
  }, [action, savedListings]);

  async function handleAction(listing) {
    // when there is no action id, default to removing the listing:
    if (action === "Remove") return handleRemove(listing);
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
      {action === "Suggest" ? (
        <ToolBar>
          <div>{action === "Suggest" ? "Suggest to Project" : "Saved Listings"}</div>

          <Link to={callback || "/"}>Cancel</Link>
        </ToolBar>
      ) : (
        <ToolBar />
      )}

      {action === "Suggest" ? (
        <>
          <div className="text-center">
            <div className="m-1 mx-auto inline-flex items-center rounded overflow-hidden border">
              <button
                className={`px-3 py-1 ${viewMode === "saved" ? "bg-cyan-800 text-white" : "bg-white"}`}
                onClick={() => setViewMode("saved")}
              >
                Saved
              </button>
              <button
                className={`px-3 py-1 ${viewMode === "mine" ? "bg-cyan-800 text-white" : "bg-white"}`}
                onClick={() => setViewMode("mine")}
              >
                My Items
              </button>
            </div>
          </div>

          <h3 className="text-center my-10">
            {viewMode === "saved" ? "Your Saved Listings" : "Your Projects"}
          </h3>
          <div>
            {(viewMode === "saved"
              ? filteredResults
              : myListings.filter((l) => l.intent !== "GIFT")
            ).length === 0 ? (
              <div className="mt-10 text-center px-2">
                {viewMode === "saved"
                  ? "Uh oh! Looks like you don't have any project listings saved. Click the 💾 symbol on a listing to save it."
                  : "Press the + button to create your first listing."}
              </div>
            ) : (
              <ListingsList
                listings={
                  viewMode === "saved"
                    ? filteredResults
                    : myListings.filter((l) => l.intent !== "GIFT")
                }
                actionText={action}
                onAction={handleAction}
              />
            )}
          </div>
        </>
      ) : (
        <>
          <h3 className="text-center my-10">Your Saved Listings</h3>
          <div>
            {filteredResults.length === 0 ? (
              <div className="mt-10 text-center px-2">
                Uh oh! Looks like you don't have any listings saved. Click the 💾 symbol on a
                listing to save it.
              </div>
            ) : (
              <ListingsList
                listings={filteredResults}
                actionText={action}
                onAction={handleAction}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
