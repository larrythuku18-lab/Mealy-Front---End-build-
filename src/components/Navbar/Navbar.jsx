import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar({ user }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <div className="brand-mark">M</div>
          <span className="brand-name">Mealy</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className={`navbar-link ${isActive("/") ? "active" : ""}`}>
            Menu
          </Link>
          <Link to="/orders" className={`navbar-link ${isActive("/orders") ? "active" : ""}`}>
            My Orders
          </Link>
          <Link to="/profile" className={`navbar-link ${isActive("/profile") ? "active" : ""}`}>
            Profile
          </Link>
          {user?.role === "admin" && (
            <Link to="/admin" className={`navbar-link ${isActive("/admin") ? "active" : ""}`}>
              Admin
            </Link>
          )}
        </div>

        <div className="navbar-user">
          <span className="navbar-user-name">{user?.name || "Guest"}</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
