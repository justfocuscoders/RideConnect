import { Link } from "react-router-dom";
import { useEffect } from "react";
import "../assets/styles/Home.css";
import { initScrollReveal } from "../utils/scrollReveal";

export default function Home() {
  useEffect(() => {
    initScrollReveal();
  }, []);

  return (
    <div className="home-container">
      {/* ================= HERO ================= */}
      <section className="hero reveal">
        <h1>
          Smart Ride Booking <br /> Built for Control & Clarity
        </h1>

        <p className="tagline">
          Book rides, manage drivers, and track payments with powerful dashboards.
        </p>

        <div className="hero-actions">
          <Link to="/login" className="btn primary">
            Book a Ride
          </Link>
          <Link to="/register" className="btn secondary">
            Become a Driver
          </Link>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="features reveal">
        <h2 className="section-title">What RideConnect Offers</h2>

        <div className="features-grid">
          <div className="feature-card">
            <h3>Instant Ride Booking</h3>
            <p>Book rides quickly with a smooth and reliable booking flow.</p>
          </div>

          <div className="feature-card">
            <h3>User Dashboard</h3>
            <p>Track your rides, payments, and history in one place.</p>
          </div>

          <div className="feature-card">
            <h3>Driver Earnings</h3>
            <p>Drivers can view earnings, completed rides, and performance.</p>
          </div>

          <div className="feature-card">
            <h3>Admin Analytics</h3>
            <p>Admins get full visibility into rides, revenue, and users.</p>
          </div>

          <div className="feature-card">
            <h3>Secure Payments</h3>
            <p>Transparent and secure payment tracking with JWT protection.</p>
          </div>

          <div className="feature-card">
            <h3>Role-Based Access</h3>
            <p>Separate access for users, drivers, and admins.</p>
          </div>
        </div>
      </section>

      {/* ================= FOR RIDERS ================= */}
      <section className="split-section reveal">
        <div className="split-text">
          <h2>For Riders</h2>
          <p>
            Book rides easily, track your journey, and view payment history with a
            clean and intuitive dashboard experience.
          </p>

          <Link to="/login" className="btn primary">
            Book Your Ride
          </Link>
        </div>

        <div className="split-image">
          <div className="image-placeholder">User Dashboard Preview</div>
        </div>
      </section>

      {/* ================= FOR DRIVERS ================= */}
      <section className="split-section reverse reveal">
        <div className="split-image">
          <div className="image-placeholder">Driver Earnings Preview</div>
        </div>

        <div className="split-text">
          <h2>For Drivers</h2>
          <p>
            Accept rides, track your earnings, and monitor performance with a
            transparent and easy-to-use driver dashboard.
          </p>

          <Link to="/register" className="btn primary">
            Start Driving
          </Link>
        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section className="trust-section reveal">
        <h2 className="section-title">Why Trust RideConnect?</h2>

        <div className="trust-grid">
          <div className="trust-card">
            <h3>🔐 Secure Authentication</h3>
            <p>JWT-based authentication with strict role-based access control.</p>
          </div>

          <div className="trust-card">
            <h3>📊 Real-Time Analytics</h3>
            <p>Accurate dashboards for users, drivers, and admins.</p>
          </div>

          <div className="trust-card">
            <h3>💳 Transparent Payments</h3>
            <p>Clear payment history and earnings visibility.</p>
          </div>

          <div className="trust-card">
            <h3>🛠 Admin Oversight</h3>
            <p>Complete control over rides, users, and revenue.</p>
          </div>
        </div>

        <div className="metrics">
          <div className="metric">
            <h4>10K+</h4>
            <span>Rides Completed</span>
          </div>
          <div className="metric">
            <h4>5K+</h4>
            <span>Active Users</span>
          </div>
          <div className="metric">
            <h4>2K+</h4>
            <span>Drivers Onboarded</span>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="final-cta reveal">
        <h2>Ready to Get Started?</h2>
        <p>
          Join RideConnect today and experience smarter ride booking and
          transparent management.
        </p>

        <div className="cta-actions">
          <Link to="/register" className="btn primary">
            Create Account
          </Link>
          <Link to="/login" className="btn secondary">
            Login
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="site-footer">
        <div className="footer-content">
          <div>
            <h3>RideConnect</h3>
            <p>
              Smart ride booking & dashboard-driven management platform.
            </p>
          </div>

          <div>
            <h4>Product</h4>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>

          <div>
            <h4>Dashboards</h4>
            <Link to="/dashboard">User</Link>
            <Link to="/driver/dashboard">Driver</Link>
            <Link to="/admin">Admin</Link>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} RideConnect. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
