import { useListingsData } from "../Contexts/ListingsContext";
import { toast } from "react-toastify";
import ListingsList from "../components/ListingsList";
import { useModal } from "../Contexts/ModalContext";
import { ConfirmClearModal } from "../components/ConfirmClearModal";

export default function MyListingsPage() {
  const { myListings, deleteMyListing } = useListingsData();

  const { show } = useModal();

  async function handleDelete(listing) {
    const result = await show(ConfirmClearModal, {
      title: "Delete Listing",
      message: "Are you sure you want to delete this listing?",
    });

    if (result) {
      const res = await deleteMyListing(listing);
      const json = await res.json();
      toast.success(json.message);
    }
  }
  return (
    <div>
      {myListings.length === 0 ? (
        <div className="mt-10 text-center">Press the + button to create your first listing.</div>
      ) : (
        <ListingsList
          listings={myListings}
          onActionSet={[{ actionText: "Delete", onAction: handleDelete }]}
        />
      )}
    </div>
  );
}
