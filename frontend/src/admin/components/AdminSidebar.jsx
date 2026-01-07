import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <h3>RideConnect</h3>

      <nav>
        <NavLink to="/admin">Dashboard</NavLink>
      </nav>
    </aside>
  );
}
