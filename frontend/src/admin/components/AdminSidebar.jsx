import { NavLink } from "react-router-dom";
import "../styles/admin.css";

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <h2 className="admin-logo">RideConnect</h2>

      <nav className="admin-nav">
        <NavLink to="/admin" end>Dashboard</NavLink>
        <NavLink to="/admin/users">Users</NavLink>
        <NavLink to="/admin/drivers">Drivers</NavLink>
        <NavLink to="/admin/rides">Rides</NavLink>
        <NavLink to="/admin/payments">Payments</NavLink>
        <NavLink to="/admin/analytics">Analytics</NavLink>
      </nav>
    </aside>
  );
}
