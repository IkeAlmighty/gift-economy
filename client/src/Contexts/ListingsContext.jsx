import { useState, useEffect, createContext, useContext } from "react";
import {
  getListingsInNetwork,
  getMyListings,
  getSavedListings,
  saveListing,
  removeSavedListing,
  suggestToListing,
} from "../endpoints/listings";
import { useUser } from "./UserContext";

export const ListingsContext = createContext(null);

export function ListingsProvider({ children }) {
  const [inNetworkListings, setInNetworkListings] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [savedListings, setSavedListings] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    hydrateListings();
  }, [user]);

  async function hydrateListings() {
    const _inNetworkListings = await getListingsInNetwork();
    const _myListings = await getMyListings();
    const _savedListings = await getSavedListings();

    setInNetworkListings(_inNetworkListings);
    setMyListings(_myListings);
    setSavedListings(_savedListings);
  }

  async function _saveListing(listing) {
    const res = await saveListing(listing);
    if (res.ok) {
      setSavedListings([listing, ...savedListings]);
    }
    return await res.json();
  }

  async function _removeSavedListing(listing) {
    const res = await removeSavedListing(listing);
    if (res.ok) {
      setSavedListings(savedListings.filter((l) => l._id !== listing._id));
    }

    return await res;
  }

  async function _suggestToListing(listing, suggestion) {
    console.log("suggesting", suggestion, "to", listing);
    const res = await suggestToListing(listing, suggestion);
    if (res.ok) {
      await hydrateListings();
    }

    return await res;
  }

  return (
    <ListingsContext.Provider
      value={{
        inNetworkListings,
        myListings,
        savedListings,
        saveListing: _saveListing,
        hydrateListings,
        removeSavedListing: _removeSavedListing,
        suggestToListing: _suggestToListing,
      }}
    >
      {children}
    </ListingsContext.Provider>
  );
}

export function useListingsData() {
  return useContext(ListingsContext);
}
