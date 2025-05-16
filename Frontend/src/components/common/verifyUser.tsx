import React, { useEffect, useState, ReactNode } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { VerifyUsers } from "@/store/slices/authSlice";

interface VerifyUserProps {
  children?: ReactNode;
}

const VerifyUser: React.FC<VerifyUserProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, status } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !isAuthenticated) {
      setLoading(true);
      const data = dispatch(VerifyUsers() as any)
        .unwrap()
        .finally(() => setLoading(false));
        if(status === "failed"){
            setLoading(false)
        }

    }
  }, [user, isAuthenticated, dispatch]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth/login");
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white">Loading....</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default VerifyUser;
