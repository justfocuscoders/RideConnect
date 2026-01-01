import { createContext, useContext, useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

const AuthContext = createContext(null);

// Helper: calculate remaining time before token expiry
const calculateRemainingTime = (exp) => {
  const currentTime = Date.now(); // ms
  const expiryTime = exp * 1000; // sec → ms
  return expiryTime - currentTime;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logoutTimerRef = useRef(null);

  const logout = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }

    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  // Fetch full user profile from backend
  const fetchUser = async () => {
    try {
      const res = await api.get("/users/me");
      setUser(res.data);
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Handle token decoding + expiry + user fetch
  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const remainingTime = calculateRemainingTime(decoded.exp);

      if (remainingTime <= 0) {
        logout();
        return;
      }

      // Auto logout on expiry
      logoutTimerRef.current = setTimeout(logout, remainingTime);

      // Fetch full user data ONCE
      fetchUser();
    } catch (error) {
      console.error("Invalid token");
      logout();
    }

    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        setUser,          // IMPORTANT: for instant profile updates
        loading,
        isAuthenticated: !!token,
        login,
        logout,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
