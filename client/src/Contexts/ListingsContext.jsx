import { useState, useEffect, createContext } from "react";
import { getContributionsInNetwork } from "../controls/contributions";
import { getProjectsInNetwork } from "../controls/projects";
export const ListingsContext = createContext(null);

export function ListingsProvider({ children }) {
  const [inNetworkContributions, setInNetworkContributions] = useState([]);
  const [inNetworkProjects, setInNetworkProjects] = useState([]);

  useEffect(() => {
    // hydrate listings from backend
    (async () => {
      const _inNetworkContributions = await getContributionsInNetwork();
      const _inNetworkProjects = await getProjectsInNetwork();

      setInNetworkContributions(_inNetworkContributions);
      setInNetworkProjects(_inNetworkProjects);
    })();
  }, []);

  return (
    <ListingsContext.Provider value={{ inNetworkContributions, inNetworkProjects }}>
      {children}
    </ListingsContext.Provider>
  );
}

export function useListingsData() {
  return useContext(ListingsContext);
}
