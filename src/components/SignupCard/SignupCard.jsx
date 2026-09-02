import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Input from "../ui/Input";
import Btn from "../ui/Btn";
import "../../Auth.css";
import "./SignupCard.css";

function SignupCard() {
  const navigate = useNavigate();
  const { signup, error } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await signup({
        name: form.fullName,
        email: form.email,
        password: form.password,
      });
      navigate("/");
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
        <h1>Create your Mealy Account</h1>
        <p>Start ordering healthy daily catering today.</p>
      </div>

      {error && <p className="auth-error">{error}</p>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <Input
            label="Full Name"
            title="Enter full name"
            type="text"
            placeholder="e.g. Jane Smith"
            value={form.fullName}
            onChange={handleChange}
          />
          <Input
            label="Email Address"
            title="Enter signup email"
            type="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            label="Password"
            title="Enter signup password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
          />
          <Input
            label="Confirm Password"
            title="Confirm signup password"
            type="password"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <Btn type="submit">Create Account</Btn>
      </form>

      <div className="auth-footer">
        <span>Already have an account?</span>
        <a href="/login">Log In</a>
      </div>
    </div>
  );
}

export default SignupCard;
