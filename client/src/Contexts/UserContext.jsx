import { createContext, useContext, useState } from "react";
import { login as apiLogin, logout as apiLogout } from "../API/user";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const userData = await apiLogin(credentials);
    setUser(userData);
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
