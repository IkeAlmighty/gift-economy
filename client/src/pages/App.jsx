import ListingsList from "../components/ListingsList";
import { useListingsData } from "../Contexts/ListingsContext";

function App() {
  const { inNetworkListings } = useListingsData();

  return (
    <>
      <ListingsList listings={inNetworkListings} onAction={() => {}} actionText="" />
    </>
  );
}

export default App;
