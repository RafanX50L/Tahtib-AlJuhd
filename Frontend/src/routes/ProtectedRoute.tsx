import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const ProtectedRoute: React.FC<{ allowedRoles: string }> = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth?path=login" state={{ from: location }} replace />;
  }

  // Check if user's role is not allowed for this route
  if (user && !allowedRoles.includes(user.role)) {
    let redirectPath =
      user.role === 'admin' ? '/admin/dashboard' :
      user.role === 'trainer' ? '/trainer/dashboard' : '/Dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // If client hasn't completed personalization, force redirect to /Personalization
  if (
    user?.role === 'client' &&
    user.personalization === null &&
    location.pathname !== '/personalization'
  ) {
    return <Navigate to="/personalization" replace />;
  }

  // If trying to access /Personalization after it's already completed, block it
  if (
    user?.role === 'client' &&
    user.personalization !== null &&
    location.pathname === '/personalization'
  ) {
    return <Navigate to="/Dashboard" replace />;
  }

  return <Outlet />;
};
