import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav>
      <Link to="/">Home</Link> |{" "}

      {!isAuthenticated && (
        <>
          <Link to="/login">Login</Link> |{" "}
          <Link to="/register">Register</Link> |{" "}
        </>
      )}

      <Link to="/about">About</Link>

      {isAuthenticated && (
        <>
          {" "} | <span>{user?.email}</span>{" "}
          <button onClick={logout}>Logout</button>
        </>
      )}
    </nav>
  );
}

export default Header;
