import { useState, useEffect, createContext } from "react";
import { getListingsInNetwork } from "../controls/listings";
export const ListingsContext = createContext(null);

export function ListingsProvider({ children }) {
  const [inNetworkListings, setInNetworkListings] = useState([]);

  useEffect(() => {
    // hydrate listings from backend
    (async () => {
      const _inNetworkListings = await getListingsInNetwork();

      setInNetworkListings(_inNetworkListings);
    })();
  }, []);

  return (
    <ListingsContext.Provider value={{ inNetworkListings }}>{children}</ListingsContext.Provider>
  );
}

export function useListingsData() {
  return useContext(ListingsContext);
}
