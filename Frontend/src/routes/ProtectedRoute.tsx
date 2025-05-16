import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

// Protected Route Component
export const ProtectedRoute: React.FC<{ allowedRoles: string }> = ({ allowedRoles }) => {
    const {user,isAuthenticated} = useSelector((state: RootState)=>state.auth);
    const location = useLocation();

    console.log('entere -nfkadsjf')
  
    if (!isAuthenticated) {
      return <Navigate to="/auth?path=login" state={{ from: location }} replace />;
    }
  
    console.log(user?.role,allowedRoles)

    if (user && !allowedRoles.includes(user.role)) {
      console.log('enterd to not allowed role')
      // Redirect based on user role
      console.log(user.role)
      const redirectPath =
        user.role === 'admin' ? '/admin/dashboard' :
        user.role === 'trainer' ? '/trainer/dashboard' : '/Dashboard';
      return <Navigate to={redirectPath} replace />;
    }
  
    return <Outlet />;
  };