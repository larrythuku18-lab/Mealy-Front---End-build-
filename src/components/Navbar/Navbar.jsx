import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__logo">M</span>
        Mealy
      </div>

      <nav className="navbar__links">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Daily Menu
        </NavLink>
        {user?.role === "admin" && (
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Admin Panel
          </NavLink>
        )}
      </nav>

      <div className="navbar__user">
        <span className="navbar__user-icon">●</span>
        {user?.name ?? "Guest"}
        {isAuthenticated && (
          <button className="navbar__logout" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;
