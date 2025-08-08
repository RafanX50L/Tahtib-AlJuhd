// src/routes/AuthRoute.tsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { RootState } from '@/store/store';

export const AuthRoute: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // Extract 'from' parameter from URL query
  const params = new URLSearchParams(location.search);
  const from = params.get('from') || (user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'trainer' ? '/trainer/dashboard' : '/dashboard');

  if (isAuthenticated) {
    console.log(`Authenticated user, redirecting to ${from}`);
    return <Navigate to={from} state={{ from: location }} replace />;
  }

  return <Outlet />;
};