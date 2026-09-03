import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Input from "../ui/Input";
import Btn from "../ui/Btn";
import "../../Auth.css";
import "./LoginCard.css";

function LoginCard() {
  const navigate = useNavigate();
  const { login, logout, isAuthenticated, user, error } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(form);
      if (data.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch {
      // Error is already set in AuthContext
    }
  };

  return (
    <div className="auth-card">
      <div className="brand">
        <img src="https://res.cloudinary.com/diwkfbsgv/image/upload/v1787408999/Kibandaski-brand_nft37v.png" />
        <span className="brand-name">Mealy</span>
      </div>

      <div className="auth-header">
        <h1>Welcome back</h1>
        <p>Log in to manage or order your meals.</p>
      </div>

      {isAuthenticated && (
        <div className="auth-session">
          <p>
            Signed in as <strong>{user?.name || user?.email}</strong>
          </p>
          <Btn variant="secondary" title="Log out of Mealy" onClick={handleLogout}>
            Log Out
          </Btn>
        </div>
      )}

      {error && <p className="auth-error">{error}</p>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <Input
            label="Email Address"
            title="Enter login email"
            type="email"
            id="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            label="Password"
            title="Enter login password"
            type="password"
            id="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <Btn type="submit">Log In</Btn>
      </form>

      <div className="auth-footer">
        <span>Don't have an account?</span>
        <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}

export default LoginCard;
