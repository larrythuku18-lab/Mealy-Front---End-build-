import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar({ user }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="nav">
      <Link to="/" className="brand">
        <div className="brand-mark">M</div>
        <span className="brand-name">Mealy</span>
      </Link>

      <div className="nav-links">
        <Link to="/" className={`nav-link ${isActive("/") ? "selected" : ""}`}>
          Daily Menu
        </Link>
        <Link
          to="/orders"
          className={`nav-link ${isActive("/orders") ? "selected" : ""}`}
        >
          My Orders
        </Link>
        {user?.role === "admin" && (
          <Link
            to="/admin"
            className={`nav-link ${isActive("/admin") ? "selected" : ""}`}
          >
            Admin
          </Link>
        )}
      </div>

      <Link
        to="/profile"
        className={`user-profile ${isActive("/profile") ? "selected" : ""}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
          width="22"
          height="22"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
        <span>{user?.name || "Guest"}</span>
      </Link>
    </nav>
  );
}

export default Navbar;
