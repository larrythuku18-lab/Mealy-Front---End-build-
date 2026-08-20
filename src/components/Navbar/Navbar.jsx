import "./Navbar.css";

function Navbar() {
  return (
    <nav className="nav">
      <div className="brand">
        <div className="brand-mark">M</div>
        <span className="brand-name">Mealy</span>
      </div>

      <div className="nav-links">
        <a href="/" className="nav-link selected">
          Daily Menu
        </a>
        <a href="/admin" className="nav-link">
          Admin Panel
        </a>
      </div>

      <div className="user-profile">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
        <span>Mike</span>
      </div>
    </nav>
  );
}

export default Navbar;
