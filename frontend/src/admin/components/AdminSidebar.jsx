import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <h3>RideConnect</h3>

      <nav>
        <NavLink to="/admin">Dashboard</NavLink>
        <NavLink to="/admin/revenue">Revenue</NavLink>
        <NavLink to="/admin/rides">Rides</NavLink>
        <NavLink to="/admin/drivers">Drivers</NavLink>
      </nav>
    </aside>
  );
}
