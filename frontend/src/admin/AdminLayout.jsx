import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import { Outlet } from "react-router-dom";
import "./styles/admin.css";

export default function AdminLayout() {
  return (
    <div className="admin-container">
      <AdminSidebar />

      <div className="admin-main">
        <AdminHeader />
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
