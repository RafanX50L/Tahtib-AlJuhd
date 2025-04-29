import { useEffect, useState } from 'react';
import LoginPage from '../../components/auth/Login';
import { RegisterPage } from '@/components/auth/register/Register';
import { useSearchParams } from 'react-router-dom';

const Auth = () => {
  const [login, setLogin] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const path = searchParams.get('path');
    setLogin(path === 'login' ? true : path === 'register' ? false : true);
    console.log('Path:', path, '| Login state:', path === 'login');
  }, [searchParams]);

  return (
    <>
      {login === true && <LoginPage />}
      {login === false && <RegisterPage />}
    </>
  );
};

export default Auth;