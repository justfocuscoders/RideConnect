import { createContext, useContext, useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

// Helper: calculate remaining time before token expiry
const calculateRemainingTime = (exp) => {
  const currentTime = Date.now();        // ms
  const expiryTime = exp * 1000;         // convert seconds → ms
  return expiryTime - currentTime;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  // store logout timer reference
  const logoutTimerRef = useRef(null);

  const logout = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }

    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  // Decode token & handle expiry whenever token changes
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const remainingTime = calculateRemainingTime(decoded.exp);

      // Token already expired
      if (remainingTime <= 0) {
        logout();
        return;
      }

      setUser({
        email: decoded.sub,
        exp: decoded.exp,
      });

      // Auto logout when token expires
      logoutTimerRef.current = setTimeout(logout, remainingTime);
    } catch (error) {
      console.error("Invalid token");
      logout();
    }

    // cleanup on token change/unmount
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
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
