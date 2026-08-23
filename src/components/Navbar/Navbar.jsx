import { Link, useLocation } from "react-router-dom";
import { Heart, ShoppingBag, User } from "lucide-react";
import "./Navbar.css";

function Navbar({ user }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="nav">
      <Link to="/" className="brand">
        <img src="https://res.cloudinary.com/diwkfbsgv/image/upload/v1787408999/Kibandaski-brand_nft37v.png" />
        <span className="brand-name">Mealy</span>
      </Link>

      <div className="nav-links">
        <Link to="/" className={`nav-link ${isActive("/") ? "selected" : ""}`}>
          Menu
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

      <div className="nav-opts">
        <Link
          to="/favorites"
          title="Favorites"
          aria-label="Favorites"
          className={`nav-link ${isActive("/favorites") ? "selected" : ""}`}
        >
          <Heart />
        </Link>
        <Link
          to="/orders"
          title="Orders"
          aria-label="Orders"
          className={`nav-link ${isActive("/orders") ? "selected" : ""}`}
        >
          <ShoppingBag />
        </Link>

        <Link
          to="/profile"
          title="Profile"
          aria-label="Profile"
          className={`nav-link ${isActive("/profile") ? "selected" : ""}`}
        >
          <User />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
