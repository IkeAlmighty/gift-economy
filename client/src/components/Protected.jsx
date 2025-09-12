import { useEffect } from "react";
import { useUser } from "../Contexts/UserContext";
import { Navigate } from "react-router";

export function Protected({ children }) {
  const { user, loading } = useUser();

  if (loading) return <>...Loading</>;

  if (user) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" />;
  }
}
