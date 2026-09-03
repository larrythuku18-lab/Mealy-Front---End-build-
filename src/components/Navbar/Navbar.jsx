import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Heart, ShoppingBag, User } from "lucide-react";
import "./Navbar.css";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => pathname === path;
  const isAdmin = user?.role === "admin";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="nav">
      <Link to={isAdmin ? "/admin" : "/"} className="brand">
        <img src="https://res.cloudinary.com/diwkfbsgv/image/upload/v1787408999/Kibandaski-brand_nft37v.png" />
        <span className="brand-name">Mealy</span>
      </Link>

      <div className="nav-links">
        <Link
          to="/"
          state={isAdmin ? { browseStorefront: true } : undefined}
          className={`nav-link ${isActive("/") ? "selected" : ""}`}
        >
          Menu
        </Link>
        {isAdmin && (
          <Link to="/admin" className={`nav-link ${isActive("/admin") ? "selected" : ""}`}>
            Admin Panel
          </Link>
        )}
        {!isAuthenticated && (
          <Link to="/signup" className={`nav-link ${isActive("/signup") ? "selected" : ""}`}>
            Sign Up
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

      {isAuthenticated ? (
        <button className="nav-link nav-logout" onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <Link to="/login" className="nav-link nav-login" title="Log In" aria-label="Log In">
          Log In
        </Link>
      )}
    </nav>
  );
}

export default Navbar;
