import ToolBar from "../components/ToolBar";
import LogoutButton from "../components/LogoutButton";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useListingsData } from "../Contexts/ListingsContext";
import { toast } from "react-toastify";
import ListItem from "../components/ListItem";
import DrawerMenu from "../components/DrawerMenu";

export default function MyListingsPage() {
  const { myListings, deleteMyListing } = useListingsData();

  async function handleDelete(listing) {
    const res = await deleteMyListing(listing);
    const json = await res.json();
    toast.success(json.message);
  }

  return (
    <div>
      <ToolBar>
        <h2>Your Listings</h2>
        <span />

        <button>
          <Link to="/">Back to Feed</Link>
        </button>

        <DrawerMenu />
      </ToolBar>

      <div className="flex flex-row flex-wrap justify-center gap-x-2 gap-y-5 my-5">
        {myListings.length === 0 ? (
          <div className="mt-10">Press the + button to create your first listing.</div>
        ) : (
          myListings?.map((listing, index) => (
            <div
              key={`yourlistings${index}`}
              className="flex flex-col flex-wrap gap-y-1 flex-1 min-w-[320px] max-w-[346px]"
            >
              <ListItem data={listing} />
              <button
                onClick={() => handleDelete(listing)}
                className="p-2 bg-red-300 rounded border-x-2 hover:bg-red-400"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
