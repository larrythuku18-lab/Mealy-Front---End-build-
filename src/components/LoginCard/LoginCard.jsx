import "./LoginCard.css";

function LoginCard() {
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

      <form className="auth-form">
        <div className="input-container">
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
        </div>

        <button type="submit" className="btn-primary">
          Log In
        </button>
      </form>

      <div className="auth-footer">
        <span>Don't have an account?</span>
        <a href="/signup">Sign Up</a>
      </div>
    </div>
  );
}

export default LoginCard;
