// Dashboard.tsx
import { useCurrentUser } from "@/hooks/get-current-user";

export default function Dashboard() {
  const { data: user } = useCurrentUser();

  return (
    <>
        <h1>Hello {user?.name}</h1>
        <h1>Hello {user?.email}</h1>
    </>
)}