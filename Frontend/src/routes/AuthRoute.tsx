import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { RootState } from "@/store/store";

// Auth Route Protection
export const AuthRoute: React.FC = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const location = useLocation();
  console.log(isAuthenticated)

  if (isAuthenticated) {
    // Redirect logged-in users to their respective dashboards
    console.log("her cam here of authRoute auhenticate", isAuthenticated);
    const redirectPath =
      user?.role === "admin"
        ? "/admin/dashboard"
        : user?.role === "trainer"
          ? "/trainer/dashboard"
          : "/dashboard";
    console.log("data we taking from here", user);
    console.log("redirectPath", redirectPath);
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <Outlet />;
};
