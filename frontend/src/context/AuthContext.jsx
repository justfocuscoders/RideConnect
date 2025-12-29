import { createContext, useContext, useEffect, useState } from "react";

/**
 * AuthContext
 * Holds authentication state for the entire app
 */
const AuthContext = createContext(null);

/**
 * AuthProvider
 * Wraps the app and provides auth state
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Load token from localStorage on app start
   */
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      // user will be decoded later in STEP 1.3.3
    }

    setLoading(false);
  }, []);

  /**
   * Login handler
   * Called after successful API login
   */
  const login = (jwtToken) => {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
  };

  /**
   * Logout handler
   * Clears auth state completely
   */
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        setUser,
        login,
        logout,
        loading,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook for consuming AuthContext
 */
export function useAuth() {
  return useContext(AuthContext);
}
