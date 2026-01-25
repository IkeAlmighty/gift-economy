import ListingsList from "../components/ListingsList";
import { useListingsData } from "../Contexts/ListingsContext";
import { Link } from "react-router";

function App() {
  const { inNetworkListings } = useListingsData();

  return (
    <>
      {inNetworkListings?.length === 0 && (
        <div className="mt-10 text-center">
          <div>No listings in your network yet.</div>
          <div>
            You can add people to your network on the <Link to="/connections">Connections</Link>{" "}
            page.
          </div>
        </div>
      )}

      <ListingsList listings={inNetworkListings} />
    </>
  );
}

export default App;
