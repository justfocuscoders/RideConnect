import { Link } from "react-router-dom";
import { useEffect } from "react";
import "../assets/styles/Home.css";
import { initScrollReveal } from "../utils/scrollReveal";

import car from "../assets/images/car.svg";
import bike from "../assets/images/bike.svg";
import Navbar from "../components/Navbar";

export default function Home() {
  useEffect(() => {
    initScrollReveal();
  }, []);

  return (
    <>
      <Navbar />

      <div className="home-container">
        {/* ================= HERO ================= */}
        <section className="hero reveal">
          <img src={car} alt="Car" className="vehicle car" />
          <img src={bike} alt="Bike" className="vehicle bike" />

          <h1>
            Smart Ride Booking <br /> Built for Simplicity & Control
          </h1>

          <p className="tagline">
            Book rides or drive with confidence using a clean, focused experience.
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
              <p>Request rides quickly with a simple and intuitive flow.</p>
            </div>

            <div className="feature-card">
              <h3>Passenger Dashboard</h3>
              <p>View ride status, history, and payments in one place.</p>
            </div>

            <div className="feature-card">
              <h3>Drive with RideConnect</h3>
              <p>Join as a driver and start accepting ride requests.</p>
            </div>

            <div className="feature-card">
              <h3>Secure Platform</h3>
              <p>Your account and activity are protected with industry standards.</p>
            </div>

            <div className="feature-card">
              <h3>Transparent Payments</h3>
              <p>Clear visibility into ride charges and driver payouts.</p>
            </div>

            <div className="feature-card">
              <h3>Role-Based Experience</h3>
              <p>A focused interface depending on how you use RideConnect.</p>
            </div>
          </div>
        </section>

        {/* ================= FOR RIDERS ================= */}
        <section className="split-section reveal">
          <div className="split-text">
            <h2>For Riders</h2>
            <p>
              Book rides easily, track active trips, and review past rides through a
              clean and intuitive dashboard.
            </p>

            <Link to="/login" className="btn primary">
              Book Your Ride
            </Link>
          </div>

          <div className="split-image">
            <div className="image-placeholder">Passenger Dashboard Preview</div>
          </div>
        </section>

        {/* ================= FOR DRIVERS ================= */}
        <section className="split-section reverse reveal">
          <div className="split-image">
            <div className="image-placeholder">Driver Dashboard Preview</div>
          </div>

          <div className="split-text">
            <h2>For Drivers</h2>
            <p>
              Register as a driver, complete verification, and manage rides through
              a dedicated driver dashboard.
            </p>

            <Link to="/register" className="btn primary">
              Start Driving
            </Link>
          </div>
        </section>

        {/* ================= TRUST ================= */}
        <section className="trust-section reveal">
          <h2 className="section-title">Why RideConnect?</h2>

          <div className="trust-grid">
            <div className="trust-card">
              <h3>🔐 Secure Accounts</h3>
              <p>Built with a focus on account safety and reliability.</p>
            </div>

            <div className="trust-card">
              <h3>📱 Clean Dashboards</h3>
              <p>Simple dashboards designed for clarity and ease of use.</p>
            </div>

            <div className="trust-card">
              <h3>💳 Clear Payments</h3>
              <p>Understand ride charges and earnings without confusion.</p>
            </div>

            <div className="trust-card">
              <h3>🚗 Built for Scale</h3>
              <p>A platform designed to grow with riders and drivers.</p>
            </div>
          </div>

          <div className="metrics">
            <div className="metric">
              <h4>10K+</h4>
              <span>Rides Completed</span>
            </div>
            <div className="metric">
              <h4>5K+</h4>
              <span>Active Riders</span>
            </div>
            <div className="metric">
              <h4>2K+</h4>
              <span>Drivers Registered</span>
            </div>
          </div>
        </section>

        {/* ================= FINAL CTA ================= */}
        <section className="final-cta reveal">
          <h2>Ready to Get Started?</h2>
          <p>Join RideConnect today and experience a smarter way to move.</p>

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
              <p>Smart ride booking platform for riders and drivers.</p>
            </div>

            <div>
              <h4>Product</h4>
              <Link to="/">Home</Link>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          </div>

          <div className="footer-bottom">
            © {new Date().getFullYear()} RideConnect. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
}
