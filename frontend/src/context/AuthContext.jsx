import { createContext, useContext, useEffect, useRef, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

const calculateRemainingTime = (exp) => {
  const currentTime = Date.now();
  const expiryTime = exp * 1000;
  return expiryTime - currentTime;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [loading, setLoading] = useState(true);

  const logoutTimerRef = useRef(null);

  const logout = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  const login = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });

  localStorage.setItem("token", res.data.access_token);
  localStorage.setItem("user", JSON.stringify(res.data.user));

  setToken(res.data.access_token);
  setUser(res.data.user);
  setLoading(false); // ✅ ADD THIS

  return res.data.user;
};


  const refreshUser = async () => {
  try {
    const res = await api.get("/users/me");

    setUser((prev) => ({
      ...prev,
      ...res.data,
      role: res.data.role ?? prev?.role,
    }));
  } catch (err) {
    console.warn("refreshUser failed — keeping session alive", err);
    // ❌ DO NOT logout here
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const remainingTime = calculateRemainingTime(payload.exp);

      if (remainingTime <= 0) {
        logout();
        return;
      }

      logoutTimerRef.current = setTimeout(logout, remainingTime);

      refreshUser();
    } catch {
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
      loading,
      isAuthenticated: !!token,
      login,
      logout,
      refreshUser,
      setUser,
    }}
  >
    {children}
  </AuthContext.Provider>
);

};

export const useAuth = () => useContext(AuthContext);
