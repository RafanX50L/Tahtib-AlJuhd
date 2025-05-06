import { useAuth } from "@/hooks/Auth.hook";
import { Navigate, Outlet, useLocation } from "react-router-dom";

// Protected Route Component
export const ProtectedRoute: React.FC<{ allowedRoles: string[] }> = ({ allowedRoles }) => {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();
  
    if (!isAuthenticated) {
      return <Navigate to="/auth?path=login" state={{ from: location }} replace />;
    }
  
    if (user && !allowedRoles.includes(user.role)) {
      // Redirect based on user role
      console.log(user.role)
      const redirectPath =
        user.role === 'admin' ? '/admin/dashboard' :
        user.role === 'trainer' ? '/trainer/dashboard' : '/Dashboard';
      return <Navigate to={redirectPath} replace />;
    }
  
    return <Outlet />;
  };