import "../styles/admin.css";

export default function AdminHeader() {
  return (
    <header className="admin-header">
      <h1>Admin Dashboard</h1>

      <div className="admin-user">
        <span>shridhar@gmail.com</span>
        <button className="logout-btn">Logout</button>
      </div>
    </header>
  );
}
