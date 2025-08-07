// src/routes/ProtectedRoute.tsx
import { RootState } from '@/store/store';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { setLastLocation } from '@/store/slices/authSlice';

export const ProtectedRoute: React.FC<{ allowedRoles: string }> = ({ allowedRoles }) => {
  const { user, isAuthenticated, lastLocation } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // Store current location whenever it changes
    dispatch(setLastLocation(location.pathname + location.search));
  }, [location, dispatch]);

  if (!isAuthenticated) {
    console.log(`Unauthenticated, redirecting to /auth?path=login&from=${encodeURIComponent(location.pathname + location.search)}`);
    return <Navigate to={`/auth?path=login&from=${encodeURIComponent(location.pathname + location.search)}`} state={{ from: location }} replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    const redirectPath =
      user.role === 'admin'
        ? '/admin/dashboard'
        : user.role === 'trainer'
        ? '/trainer/dashboard'
        : lastLocation || '/dashboard'; // Fixed to lowercase
    console.log(`Role mismatch, redirecting to ${redirectPath}`);
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Client personalization
  if (
    user?.role === 'client' &&
    user.personalizationId === null &&
    location.pathname !== '/personalization'
  ) {
    console.log('Client needs personalization, redirecting to /personalization');
    return <Navigate to="/personalization" state={{ from: location }} replace />;
  }

  if (
    user?.role === 'client' &&
    user.personalizationId !== null &&
    location.pathname === '/personalization'
  ) {
    let redirectPath = lastLocation || '/dashboard';
    if(lastLocation === '/personalization'){
      redirectPath = '/dashboard'
    }
    console.log(`Personalization complete, redirecting to ${redirectPath}`);
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  const isRoomPath = location.pathname.startsWith('/room/');

  // Trainer job application flow
  if (
    user?.role === 'trainer' &&
    user.personalizationId === null &&
    location.pathname !== '/trainer/job-application' &&
    !isRoomPath
  ) {
    console.log('Trainer needs job application, redirecting to /trainer/job-application');
    return <Navigate to="/trainer/job-application" state={{ from: location }} replace />;
  }

  if (
    user?.role === 'trainer' &&
    user.personalizationId !== null &&
    location.pathname === '/trainer/job-application' &&
    user.status === 'approved'
  ) {
    const redirectPath = lastLocation || '/trainer/dashboard';
    console.log(`Trainer job application complete, redirecting to ${redirectPath}`);
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Prevent looping to pendingCase if already there or if still on job-application or /room/*
  if (
    user?.role === 'trainer' &&
    user.status !== 'approved' &&
    !['/trainer/pendingCase', '/trainer/job-application'].includes(location.pathname) &&
    !isRoomPath
  ) {
    console.log('Trainer not approved, redirecting to /trainer/pendingCase');
    return <Navigate to="/trainer/pendingCase" state={{ from: location }} replace />;
  }

  return <Outlet />;
};