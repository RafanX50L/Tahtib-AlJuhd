// src/components/AuthInitializer.tsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { refreshAccessToken,  setLastLocation } from '@/store/slices/authSlice';
import { useLocation } from 'react-router-dom';
import { secureTokenStorage } from '@/services/implementation/api';

interface AuthInitializerProps {
  children: React.ReactNode;
}

export const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(!!localStorage.getItem('accessToken'));

  useEffect(() => {
    // Set initial location
    dispatch(setLastLocation(location.pathname + location.search));

    const initializeAuth = async () => {
      const token  = secureTokenStorage.get();
      if (token && !isAuthenticated) {
        try {
          console.log('Initializing auth with token refresh');
          await dispatch(refreshAccessToken());
        } catch (error) {
          console.error('Failed to refresh token on init:', error);
          secureTokenStorage.remove();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [dispatch, isAuthenticated, location]);

   if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};