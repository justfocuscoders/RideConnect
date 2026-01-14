import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="landing-navbar">
      <div className="navbar-brand">
        <span className="brand-dot">●</span>
        Ride<span>Connect</span>
      </div>

      <div className="navbar-links">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
