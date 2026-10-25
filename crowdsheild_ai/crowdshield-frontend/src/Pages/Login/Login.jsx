
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { demoUser, demoRegularUser } from "../../data/user";
import styles from "./Login.module.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username.trim() || !formData.password) {
      setError("Please enter your username and password.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const matchedUser = [demoUser, demoRegularUser].find(
        (user) =>
          user.username === formData.username.trim() &&
          user.password === formData.password
      );

      if (matchedUser) {
        if (rememberMe) {
          localStorage.setItem("crowdshieldRemember", "true");
        } else {
          localStorage.removeItem("crowdshieldRemember");
        }

        localStorage.setItem("crowdshieldLoggedIn", "true");
        localStorage.setItem(
          "crowdshieldUser",
          JSON.stringify({
            username: matchedUser.username,
            email: matchedUser.email,
            name: matchedUser.name,
            role: matchedUser.role,
          })
        );

        navigate("/dashboard");
      } else {
        setError("Invalid username or password.");
      }

      setLoading(false);
    }, 800);
  };

  return (
    <div className={styles.page}>
      <div className={styles.gridOverlay}></div>
      <div className={styles.glowOne}></div>
      <div className={styles.glowTwo}></div>

      <div className={styles.container}>
        <section className={styles.brandSection}>
          <div className={styles.logoWrapper}>
            <div className={styles.logo}>
              <span>✦</span>
            </div>

            <div>
              <h1>
                CrowdShield <span>AI</span>
              </h1>
              <p>EMERGENCY COMMAND CENTER</p>
            </div>
          </div>

          <div className={styles.brandContent}>
            <div className={styles.statusBadge}>
              <span className={styles.statusDot}></span>
              SYSTEM MONITORING
            </div>

            <h2>
              Intelligent Crowd
              <br />
              <span>Safety & Response</span>
            </h2>

            <p>
              Monitor crowd density, detect high-risk zones,
              analyze live surveillance feeds and coordinate
              emergency response from one centralized platform.
            </p>
          </div>

          <div className={styles.systemInfo}>
            <div>
              <span className={styles.infoDot}></span>
              AI ENGINE
              <strong>READY</strong>
            </div>

            <div>
              <span className={styles.infoDot}></span>
              CCTV NETWORK
              <strong>ONLINE</strong>
            </div>

            <div>
              <span className={styles.infoDot}></span>
              GIS MONITORING
              <strong>ACTIVE</strong>
            </div>
          </div>
        </section>

        <section className={styles.loginSection}>
          <div className={styles.loginCard}>
            <div className={styles.cardHeader}>
              <p className={styles.eyebrow}>SECURE ACCESS</p>

              <h2>Welcome back</h2>

              <p>
                Sign in to access the CrowdShield command
                center.
              </p>
            </div>

            {error && (
              <div className={styles.errorMessage}>
                <span>!</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* USERNAME */}
              <div className={styles.inputGroup}>
                <label htmlFor="username">USERNAME</label>

                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>♙</span>

                  <input
                    id="username"
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className={styles.inputGroup}>
                <label htmlFor="password">PASSWORD</label>

                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>◆</span>

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>

              {/* OPTIONS */}
              <div className={styles.options}>
                <label className={styles.remember}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(e.target.checked)
                    }
                  />

                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  className={styles.forgot}
                  onClick={() =>
                    alert(
                      "Password recovery will be connected later."
                    )
                  }
                >
                  Forgot password?
                </button>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                className={styles.loginButton}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner}></span>
                    AUTHENTICATING...
                  </>
                ) : (
                  <>
                    SIGN IN
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

            <div className={styles.registerLink}>
              <span>Don't have an account?</span>

              <Link to="/register">
                Create an account
              </Link>
            </div>

            <div className={styles.security}>
              <span>◉</span>
              SECURE COMMAND ACCESS
            </div>
          </div>
        </section>
      </div>

      <footer className={styles.footer}>
        <span>CROWDSHIELD AI</span>
        <span>•</span>
        <span>EMERGENCY OPERATIONS PLATFORM</span>
        <span>•</span>
        <span>v1.0.0</span>
      </footer>
    </div>
  );
}

export default Login;