import { useState, useEffect } from "react";
import {
  login as controllerLogin,
  logout as controllerLogout,
  signup as controllerSignup,
  me,
} from "../endpoints/user";
import { UserContext } from "./UserContext";

export default function UserProvider({ children }) {
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
      hydrateUser();
    }

    return { data, error };
  };

  const signup = async (credentials) => {
    const { data, error } = await controllerSignup(credentials);

    if (!error) {
      hydrateUser();
    }

    return { data, error };
  };

  const logout = () => {
    controllerLogout();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, signup, loading, hydrateUser }}>
      {children}
    </UserContext.Provider>
  );
}
