import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

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
      <div>
        {listingItems.map((itemData) => (
          <ListItem data={itemData} />
        ))}
      </div>
    </>
  );
}

export default App;
