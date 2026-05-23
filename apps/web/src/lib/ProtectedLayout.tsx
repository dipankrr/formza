// ProtectedLayout.tsx

import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "../hooks/get-current-user";

export function ProtectedLayout() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet context={user}/>;
}