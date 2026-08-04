import { useUser } from "@/context/UserContext";
import { Navigate, Outlet } from "react-router-dom";

export default function RoleGuard({ allowedRoles }: { allowedRoles: string[] }) {
  const { user } = useUser();

  if (user) return allowedRoles.includes(user.role) ? <Outlet /> : <Navigate to="/" />;
  else return <Outlet />;
}
