import "./SignupCard.css";

function SignupCard() {
  return (
    <div class="auth-card">
      <div class="brand">
        <div class="brand-mark">M</div>
        <span class="brand-name">Mealy</span>
      </div>

      <div class="auth-header">
        <h1>Create your Mealy Account</h1>
        <p>Start ordering healthy daily catering today.</p>
      </div>

      <form class="auth-form">
        <div class="input-container">
          <div class="input-primary">
            <label for="full-name">Full Name</label>
            <input
              type="text"
              id="full-name"
              name="full-name"
              placeholder="John Doe"
            />
          </div>

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

          <div class="input-primary">
            <label for="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button type="submit" class="btn-primary">
          Create Account
        </button>
      </form>

      <div class="auth-footer">
        <span>Already have an account?</span>
        <a href="/login">Log In</a>
      </div>
    </div>
  );
}

export default SignupCard;
