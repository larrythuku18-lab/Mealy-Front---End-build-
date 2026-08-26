import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import InputPrimary from "../ui/InputPrimary";
import BtnPrimary from "../ui/BtnPrimary";
import "./LoginCard.css";

function LoginCard() {
  const navigate = useNavigate();
  const { login, status, error } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(form);
      // Redirect admin to /admin, customers to /
      if (data.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      // Error is already set in AuthContext
    }
  };

  return (
    <div className="auth-card">
      <div className="brand">
        <div className="brand-mark">M</div>
        <span className="brand-name">Mealy</span>
      </div>

      <div className="auth-header">
        <h1>Welcome back</h1>
        <p>Log in to manage or order your meals.</p>
      </div>

      {error && <p className="auth-error">{error}</p>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <InputPrimary
            label="Email Address"
            type="email"
            id="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={handleChange}
          />
          <InputPrimary
            label="Password"
            type="password"
            id="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <BtnPrimary type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Logging in..." : "Log In"}
        </BtnPrimary>
      </form>

      <div className="auth-footer">
        <span>Don't have an account?</span>
        <a href="/signup">Sign Up</a>
      </div>
    </div>
  );
}

export default LoginCard;
