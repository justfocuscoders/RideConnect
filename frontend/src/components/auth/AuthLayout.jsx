import "./auth.css";

export default function AuthLayout({ title, children, footer }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-logo">RideConnect</h1>
        <h2 className="auth-title">{title}</h2>

        {children}

        {footer && <div className="auth-footer">{footer}</div>}
      </div>
    </div>
  );
}
