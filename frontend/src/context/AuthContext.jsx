import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );
  const [user, setUser] = useState(null);

  // Decode token whenever it changes
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          email: decoded.sub,
          exp: decoded.exp,
        });
        localStorage.setItem("token", token);
      } catch (err) {
        console.error("Invalid token");
        logout();
      }
    } else {
      setUser(null);
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

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
