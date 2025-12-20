import ToolBar from "../components/ToolBar";
import LogoutButton from "../components/LogoutButton";
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

  useEffect(() => {
    if (action === "Suggest") {
      setFilteredResults(savedListings.filter((l) => l.intent !== "GIFT"));
    } else {
      setFilteredResults(savedListings);
    }
  }, [action, savedListings]);

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
        <h2>{action === "Suggest" ? "Suggest to Project" : "Saved Listings"}</h2>
        <span />

        {action !== "Remove" ? (
          <Link to={callback || "/"}>Cancel</Link>
        ) : (
          <div className="text-2xl animate-bounce">
            <Link to="/notifications">🔔</Link>
          </div>
        )}

        <DrawerMenu />
      </ToolBar>

      <h3 className="text-center my-10">Your Saved Projects</h3>
      <div>
        {filteredResults.length === 0 ? (
          <div className="mt-10">
            Uh oh! Looks like you don't have any {action === "Suggest" ? <b>project</b> : ""}{" "}
            listings saved. Click the 💾 symbol on a listing to save it.
          </div>
        ) : (
          <ListingsList listings={filteredResults} actionText={action} onAction={handleAction} />
        )}
      </div>

      {action && (
        <div className="border-t-2 mt-5">
          <h3 className="text-center my-10">Your Projects</h3>
          {myListings.length === 0 ? (
            <div className="mt-10">Press the + button to create your first listing.</div>
          ) : (
            <ListingsList
              listings={myListings.filter((l) => l.intent === "PROJECT")}
              onAction={handleAction}
              actionText={action}
            />
          )}
        </div>
      )}
    </div>
  );
}
