import { createContext, useContext, useState, useEffect } from "react";
import { login as controllerLogin, logout as controllerLogout, me } from "../controls/user";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hydrateUser();
  }, []);

  async function hydrateUser() {
    setLoading(true);
    const _user = await me();
    setUser(_user);
    setLoading(false);
  }

  const login = async (credentials) => {
    const { data, error } = await controllerLogin(credentials);

    if (!error) {
      setUser(data);
      setLoading(false);
    }

    return { data, error };
  };

  const logout = () => {
    controllerLogout();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading, hydrateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
