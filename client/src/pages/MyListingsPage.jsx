import { useListingsData } from "../Contexts/ListingsContext";
import { toast } from "react-toastify";
import ListingsList from "../components/ListingsList";

export default function MyListingsPage() {
  const { myListings, deleteMyListing } = useListingsData();

  async function handleDelete(listing) {
    const res = await deleteMyListing(listing);
    const json = await res.json();
    toast.success(json.message);
  }

  return (
    <div>
      {myListings.length === 0 ? (
        <div className="mt-10 text-center">Press the + button to create your first listing.</div>
      ) : (
        <ListingsList listings={myListings} onAction={handleDelete} actionText="Delete" />
      )}
    </div>
  );
}
