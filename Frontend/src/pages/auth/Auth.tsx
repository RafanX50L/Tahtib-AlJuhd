import { useEffect, useState } from 'react';
import LoginPage from '../../components/auth/Login';
import { RegisterPage } from '@/components/auth/register/Register';
import { BrowserRouter, Route, Routes, useSearchParams } from 'react-router-dom';
import { OTPVerificationPage } from '@/components/auth/Input-otp-from';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [path, setPath] = useState(searchParams.get('path'));
  useEffect(() => {
    setPath(searchParams.get('path'));
  }, [searchParams]);

  return (
    <>
      {path === 'login' && <LoginPage />}
      {path === 'register' && <RegisterPage />}
    </>
  );
};

export default Auth;