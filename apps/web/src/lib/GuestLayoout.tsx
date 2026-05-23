import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useCurrentUser } from "../hooks/get-current-user";

export default function GuestLayout(){

  const {
    data:user,
    isLoading
  } = useCurrentUser();

  if(isLoading){
    return <div>Loading...</div>;
  }

  // already logged in
  if(user){
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <Outlet />;
}