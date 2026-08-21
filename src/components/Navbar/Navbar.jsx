import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__logo">M</span>
        Mealy
      </div>

      <nav className="navbar__links">
        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
          Daily Menu
        </NavLink>
        {user?.role === "admin" && (
          <NavLink to="/admin" className={({ isActive }) => (isActive ? "active" : "")}>
            Admin Panel
          </NavLink>
        )}
      </nav>

      <div className="navbar__user">
        <span className="navbar__user-icon">&#9679;</span>
        {user?.name ?? "Guest"}
      </div>
    </header>
  );
}

export default Navbar;
