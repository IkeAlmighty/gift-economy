import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import ListItem from "../components/ListItem";

function App() {
  const [listingItems, setListingItems] = useState([]);

  useEffect(() => {
    // concat the listings and sort by update timestamps:
    // const listings = [...inNetworkProjects, ...inNetworkContributions].sort(
    //   (a, b) => a.updatedAt - b.updatedAt
    // );
    // setListingItems(listings);
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
