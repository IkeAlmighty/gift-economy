import { useState, useEffect } from "react";
import ListItem from "../components/ListItem";
import { getListingsInNetwork } from "../controls/listings";

function App() {
  const [listingItems, setListingItems] = useState([]);

  useEffect(() => {
    (async () => {
      const listings = await getListingsInNetwork();
      setListingItems(listings);
    })();
  }, []);

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-center">
        {listingItems.map((itemData) => (
          <ListItem key={itemData.id} data={itemData} />
        ))}
      </div>
    </>
  );
}

export default App;
