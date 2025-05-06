import { AuthContext } from "@/globalContext/AuthContext";
import { useContext } from "react";

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };