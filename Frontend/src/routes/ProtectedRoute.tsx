import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const ProtectedRoute: React.FC<{ allowedRoles: string }> = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth?path=login" state={{ from: location }} replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    const redirectPath =
      user.role === "admin"
        ? "/admin/dashboard"
        : user.role === "trainer"
        ? "/trainer/dashboard"
        : "/Dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  // Client personalization
  if (
    user?.role === "client" &&
    user.personalization === null &&
    location.pathname !== "/personalization"
  ) {
    return <Navigate to="/personalization" replace />;
  }

  if (
    user?.role === "client" &&
    user.personalization !== null &&
    location.pathname === "/personalization"
  ) {
    return <Navigate to="/Dashboard" replace />;
  }

  // // Trainer job application flow
  // if (
  //   user?.role === "trainer" &&
  //   user.personalization === null &&
  //   location.pathname !== "/trainer/job-application"
  // ) {
  //   return <Navigate to="/trainer/job-application" replace />;
  // }

  // if (
  //   user?.role === "trainer" &&
  //   user.personalization !== null &&
  //   location.pathname === "/trainer/job-application" &&
  //   user.status === "approved"
  // ) {
  //   return <Navigate to="/trainer/dashboard" replace />;
  // }

  // // Prevent looping to pendingCase if already there or if still on job-application
  // if (
  //   user?.role === "trainer" &&
  //   user.status !== "approved" &&
  //   location.pathname !== "/trainer/pendingCase" &&
  //   location.pathname !== "/trainer/job-application"
  // ) {
  //   return <Navigate to="/trainer/pendingCase" replace />;
  // }
  const isRoomPath = location.pathname.startsWith("/room/");

// Trainer job application flow
if (
  user?.role === "trainer" &&
  user.personalization === null &&
  location.pathname !== "/trainer/job-application" &&
  !isRoomPath
) {
  return <Navigate to="/trainer/job-application" replace />;
}

if (
  user?.role === "trainer" &&
  user.personalization !== null &&
  location.pathname === "/trainer/job-application" &&
  user.status === "approved"
) {
  return <Navigate to="/trainer/dashboard" replace />;
}

// Prevent looping to pendingCase if already there or if still on job-application or /room/*
if (
  user?.role === "trainer" &&
  user.status !== "approved" &&
  !["/trainer/pendingCase", "/trainer/job-application"].includes(location.pathname) &&
  !isRoomPath
) {
  return <Navigate to="/trainer/pendingCase" replace />;
}

  return <Outlet />;
};
