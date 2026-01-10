import { Link } from "react-router-dom";
import "../assets/styles/Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <nav className="navbar">
        <h2 className="logo">RideConnect</h2>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/about">About</Link>
        </div>
      </nav>

      <section className="hero">
  <h1>
    Smart Ride Booking <br /> Built for Control & Clarity
  </h1>

  <p className="tagline">
    Book rides, manage drivers, and track payments with powerful dashboards.
  </p>

  <div className="hero-actions">
    <a href="/login" className="btn primary">
      Book a Ride
    </a>
    <a href="/register" className="btn secondary">
      Become a Driver
    </a>
  </div>
</section>

    </div>
  );
}
