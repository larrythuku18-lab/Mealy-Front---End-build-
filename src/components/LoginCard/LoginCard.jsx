import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputPrimary from "../ui/InputPrimary";
import BtnPrimary from "../ui/BtnPrimary";
import "../../Auth.css";
import "./LoginCard.css";

function LoginCard() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: integrate with backend auth API
    console.log("Login:", form);
    navigate("/");
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

        <BtnPrimary type="submit">Log In</BtnPrimary>
      </form>

      <div className="auth-footer">
        <span>Don't have an account?</span>
        <a href="/signup">Sign Up</a>
      </div>
    </div>
  );
}

export default LoginCard;
