import "./SignupCard.css";

function SignupCard() {
  return (
    <div className="auth-card">
      <div className="brand">
        <div className="brand-mark">M</div>
        <span className="brand-name">Mealy</span>
      </div>

      <div className="auth-header">
        <h1>Create your Mealy Account</h1>
        <p>Start ordering healthy daily catering today.</p>
      </div>

      <form className="auth-form">
        <div className="input-container">
          <div className="input-primary">
            <label htmlFor="full-name">Full Name</label>
            <input
              type="text"
              id="full-name"
              name="full-name"
              placeholder="John Doe"
            />
          </div>

          <div className="input-primary">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="john@example.com"
            />
          </div>

          <div className="input-primary">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
            />
          </div>

          <div className="input-primary">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button type="submit" className="btn-primary">
          Create Account
        </button>
      </form>

      <div className="auth-footer">
        <span>Already have an account?</span>
        <a href="/login">Log In</a>
      </div>
    </div>
  );
}

export default SignupCard;
