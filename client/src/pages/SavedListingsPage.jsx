import ToolBar from "../components/ToolBar";
import LogoutButton from "../components/LogoutButton";
import { Link } from "react-router";
import { useListingsData } from "../Contexts/ListingsContext";
import { useEffect } from "react";

export function SavedListingsPage() {
  const { myListings } = useListingsData();

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

        {myListings?.map((listing) => (
          <div className="border-b-2 flex [&>*]:mx-2">
            <div>{listing.title}</div>
            <div>{listing.intent}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
