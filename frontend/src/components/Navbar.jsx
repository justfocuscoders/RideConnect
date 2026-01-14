import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../assets/styles/Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-inner">
        <Link to="/" className="logo">
          RideConnect
        </Link>

        <nav className="nav-links">
          <Link to="/login">Book Ride</Link>
          <Link to="/register">Become Driver</Link>
          <Link to="/login" className="nav-btn">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
