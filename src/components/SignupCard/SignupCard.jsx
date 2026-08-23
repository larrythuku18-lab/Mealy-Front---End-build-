import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputPrimary from "../ui/InputPrimary";
import BtnPrimary from "../ui/BtnPrimary";
import "./SignupCard.css";

function SignupCard() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // TODO: integrate with backend auth API
    console.log("Signup:", form);
    navigate("/login");
  };

  return (
    <div className="auth-card">
      <div className="brand">
        <img src="https://res.cloudinary.com/diwkfbsgv/image/upload/v1787408999/Kibandaski-brand_nft37v.png" />
        <span className="brand-name">Mealy</span>
      </div>

      <div className="auth-header">
        <h1>Create your Mealy Account</h1>
        <p>Start ordering healthy daily catering today.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <InputPrimary
            label="Full Name"
            type="text"
            id="full-name"
            placeholder="e.g. Jane Smith"
            value={form.fullName}
            onChange={handleChange}
          />
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
          <InputPrimary
            label="Confirm Password"
            type="password"
            id="confirm-password"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <BtnPrimary type="submit">Create Account</BtnPrimary>
      </form>

      <div className="auth-footer">
        <span>Already have an account?</span>
        <a href="/login">Log In</a>
      </div>
    </div>
  );
}

export default SignupCard;
