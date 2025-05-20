import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { RootState } from "@/store/store";
import { AUTH_ROUTES } from "@/utils/constant";
import api from "@/services/implementation/api";
import { AuthService } from "@/services/implementation/authService";
import { setCredentials } from "@/store/slices/authSlice";

// Auth Route Protection
export const AuthRoute: React.FC = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const location = useLocation();
  console.log(isAuthenticated);
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();

  if (!isAuthenticated && accessToken) {
    console.log("user is not authenctivated");

    AuthService.refreshToken().then((response) => {
      if(response.accessToken){
        dispatch(setCredentials({user:response.user, accessToken:response.accessToken}));
      }
    });
  }

  if (isAuthenticated && accessToken) {
    // Redirect logged-in users to their respective dashboards
    console.log(
      "her cam here of authRoute auhenticate",
      isAuthenticated,
      accessToken
    );
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
