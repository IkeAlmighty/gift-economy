import { useState, useEffect, createContext, useContext } from "react";
import { getListingsInNetwork, getMyListings } from "../controls/listings";

export const ListingsContext = createContext(null);

export function ListingsProvider({ children }) {
  const [inNetworkListings, setInNetworkListings] = useState([]);
  const [myListings, setMyListings] = useState([]);

  useEffect(() => {
    hydrateListings();
  }, []);

  async function hydrateListings() {
    const _inNetworkListings = await getListingsInNetwork();
    const _myListings = await getMyListings();

    setInNetworkListings(_inNetworkListings);
    setMyListings(_myListings);
  }

  return (
    <ListingsContext.Provider value={{ inNetworkListings, myListings, hydrateListings }}>
      {children}
    </ListingsContext.Provider>
  );
}

export function useListingsData() {
  return useContext(ListingsContext);
}
