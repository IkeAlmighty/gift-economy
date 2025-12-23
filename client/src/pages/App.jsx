import ListingsList from "../components/ListingsList";
import { useListingsData } from "../Contexts/ListingsContext";

function App() {
  const { inNetworkListings } = useListingsData();

  return (
    <>
      <ListingsList listings={inNetworkListings} />
    </>
  );
}

export default App;
