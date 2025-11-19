import ListItem from "../components/ListItem";
import { useListingsData } from "../Contexts/ListingsContext";
import { toast } from "react-toastify";

function App() {
  const { inNetworkListings, saveListing } = useListingsData();

  async function handleSaveListing(listing) {
    const res = await saveListing(listing);

    if (res.error) {
      toast(res.error);
    } else toast(res.message);
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-center">
        {inNetworkListings.map((itemData) => (
          <ListItem key={itemData.id} data={itemData} onSave={handleSaveListing} />
        ))}
      </div>
    </>
  );
}

export default App;
