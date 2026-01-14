import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import api from "../services/api";
import {
  getActiveMode,
  setActiveMode,
  forcePassengerMode,
  MODES,
} from "../utils/mode";

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

  // 🔹 Active Mode State
  const [activeMode, setActiveModeState] = useState(MODES.PASSENGER);

  const logoutTimerRef = useRef(null);

  const logout = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    forcePassengerMode();

    setToken(null);
    setUser(null);
    setActiveModeState(MODES.PASSENGER);
    setLoading(false);
  };

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });

    localStorage.setItem("token", res.data.access_token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    setToken(res.data.access_token);
    setUser(res.data.user);
    setLoading(false);

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
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Token lifecycle
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

  // 🔹 Restore & Validate Mode after user loads
  useEffect(() => {
    if (!user) return;

    const storedMode = getActiveMode();

    // Admin untouched
    if (user.role === "admin") {
      forcePassengerMode();
      setActiveModeState(MODES.PASSENGER);
      return;
    }

    // Non-driver
    if (user.role !== "driver") {
      forcePassengerMode();
      setActiveModeState(MODES.PASSENGER);
      return;
    }

    // Pending / unverified driver
    if (user.driver_status !== "verified") {
      forcePassengerMode();
      setActiveModeState(MODES.PASSENGER);
      return;
    }

    // Verified driver
    setActiveModeState(storedMode);
  }, [user]);

  // 🔹 Manual mode switch (controlled)
  const switchMode = (mode) => {
    if (mode === MODES.DRIVER) {
      if (
        user?.role !== "driver" ||
        user?.driver_status !== "verified"
      ) {
        return;
      }
    }

    setActiveMode(mode);
    setActiveModeState(mode);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: !!token,
        activeMode,
        switchMode,
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
