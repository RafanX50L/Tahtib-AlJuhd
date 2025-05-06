import { useAuth } from "../hooks/Auth.hook";
import { Navigate, Outlet, useLocation } from "react-router-dom";

// Auth Route Protection
export const AuthRoute: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
  
    if (isAuthenticated) {
      // Redirect logged-in users to their respective dashboards
      console.log('her cam here of authRoute auhenticate',isAuthenticated)
      const { user } = useAuth();
      const redirectPath =
        user?.role === 'admin' ? '/admin/dashboard' :
        user?.role === 'trainer' ? '/trainer/dashboard' : '/dashboard';
        console.log('data we taking from here',user);
        console.log('redirectPath',redirectPath)
      return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }
  
    return <Outlet />;
  };