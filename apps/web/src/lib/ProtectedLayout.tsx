// ProtectedLayout.tsx

import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "../hooks/get-current-user";
import { Loader2 } from "lucide-react";

export function ProtectedLayout() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return  <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin" />
         </div>
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet context={user}/>;
}