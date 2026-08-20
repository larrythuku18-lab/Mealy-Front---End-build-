import "./LoginCard.css";

function LoginCard() {
  return (
    <div class="auth-card">
      <div class="brand">
        <div class="brand-mark">M</div>
        <span class="brand-name">Mealy</span>
      </div>

      <div class="auth-header">
        <h1>Welcome back</h1>
        <p>Log in to manage or order your meals.</p>
      </div>

      <form class="auth-form">
        <div class="input-container">
          <div class="input-primary">
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="john@example.com"
            />
          </div>

          <div class="input-primary">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button type="submit" class="btn-primary">
          Log In
        </button>
      </form>

      <div class="auth-footer">
        <span>Don't have an account?</span>
        <a href="/signup">Sign Up</a>
      </div>
    </div>
  );
}

export default LoginCard;
