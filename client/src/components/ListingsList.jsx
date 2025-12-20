import ListItem from "./ListItem";

export default function ListingsList({ listings, onAction, actionText }) {
  const color = {
    Suggest: "blue",
    Delete: "red",
    Remove: "red",
  };

  return (
    <div className="flex flex-wrap justify-center gap-x-2 gap-y-5 mt-5">
      {listings?.map((listing, index) => (
        <div key={`yourlistings${index}`} className="flex flex-col flex-wrap gap-y-1">
          <ListItem data={listing} />
          <button
            className={`p-2 bg-${color[actionText]}-300 rounded border-x-2 hover:bg-${color[actionText]}-400`}
            onClick={() => onAction(listing)}
          >
            {actionText}
          </button>
        </div>
      ))}
    </div>
  );
}
