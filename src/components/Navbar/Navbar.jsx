import { Link, useLocation } from "react-router-dom";
import { Heart, ShoppingBag, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="nav">
      <Link to="/" className="brand">
        <img src="https://res.cloudinary.com/diwkfbsgv/image/upload/v1787408999/Kibandaski-brand_nft37v.png" alt="Mealy brand" />
        <span className="brand-name">Mealy</span>
      </Link>

      <div className="nav-links">
        <Link to="/" className={`nav-link ${isActive("/") ? "selected" : ""}`}>
          Menu
        </Link>
        {user?.role === "admin" && (
          <Link to="/admin" className={`nav-link ${isActive("/admin") ? "selected" : ""}`}>
            Admin Panel
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

        {isAuthenticated && (
          <button className="nav-link nav-logout" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
