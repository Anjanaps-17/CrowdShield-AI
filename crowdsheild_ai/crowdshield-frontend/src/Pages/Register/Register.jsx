import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Register.module.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const getPasswordStrength = () => {
    const password = formData.password;

    if (!password) {
      return {
        label: "",
        width: "0%",
        level: "",
      };
    }

    if (password.length < 6) {
      return {
        label: "WEAK",
        width: "30%",
        level: "weak",
      };
    }

    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    ) {
      return {
        label: "STRONG",
        width: "100%",
        level: "strong",
      };
    }

    return {
      label: "MEDIUM",
      width: "65%",
      level: "medium",
    };
  };

  const passwordStrength = getPasswordStrength();

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.fullName ||
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!acceptedTerms) {
      setError(
        "Please accept the terms and conditions to continue."
      );
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 1800);
    }, 900);
  };

  return (
    <div className={styles.page}>
      <div className={styles.gridOverlay}></div>
      <div className={styles.glowOne}></div>
      <div className={styles.glowTwo}></div>

      <div className={styles.container}>
        {/* BRAND SECTION */}
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
              CONTROL CENTER ACCESS
            </div>

            <h2>
              Join the
              <br />
              <span>Safety Network</span>
            </h2>

            <p>
              Create an operator account to monitor crowd
              activity, analyze risk zones and coordinate
              emergency response operations.
            </p>

            <div className={styles.featureList}>
              <div>
                <span>01</span>
                Real-time crowd monitoring
              </div>

              <div>
                <span>02</span>
                AI-powered risk detection
              </div>

              <div>
                <span>03</span>
                Centralized emergency response
              </div>
            </div>
          </div>

          <div className={styles.systemStatus}>
            <span className={styles.statusDot}></span>
            PLATFORM STATUS: OPERATIONAL
          </div>
        </section>

        {/* REGISTER SECTION */}
        <section className={styles.registerSection}>
          <div className={styles.registerCard}>
            <div className={styles.cardHeader}>
              <p className={styles.eyebrow}>
                OPERATOR REGISTRATION
              </p>

              <h2>Create account</h2>

              <p>
                Register your credentials for secure platform
                access.
              </p>
            </div>

            {error && (
              <div className={styles.errorMessage}>
                <span>!</span>
                {error}
              </div>
            )}

            {success && (
              <div className={styles.successMessage}>
                <span>✓</span>
                Account created successfully. Redirecting to
                login...
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className={styles.twoColumns}>
                {/* FULL NAME */}
                <div className={styles.inputGroup}>
                  <label htmlFor="fullName">
                    FULL NAME
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>

                {/* USERNAME */}
                <div className={styles.inputGroup}>
                  <label htmlFor="username">
                    USERNAME
                  </label>

                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="operator01"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className={styles.inputGroup}>
                <label htmlFor="email">
                  EMAIL ADDRESS
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="operator@crowdshield.ai"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>

              <div className={styles.twoColumns}>
                {/* PASSWORD */}
                <div className={styles.inputGroup}>
                  <label htmlFor="password">
                    PASSWORD
                  </label>

                  <div className={styles.passwordWrapper}>
                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword ? "text" : "password"
                      }
                      placeholder="Create password"
                      value={formData.password}
                      onChange={handleChange}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword ? "HIDE" : "SHOW"}
                    </button>
                  </div>

                  <div className={styles.strength}>
                    <div className={styles.strengthBar}>
                      <div
                        className={`${styles.strengthFill} ${
                          styles[passwordStrength.level]
                        }`}
                        style={{
                          width: passwordStrength.width,
                        }}
                      ></div>
                    </div>

                    {passwordStrength.label && (
                      <span
                        className={
                          styles[passwordStrength.level]
                        }
                      >
                        {passwordStrength.label}
                      </span>
                    )}
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div className={styles.inputGroup}>
                  <label htmlFor="confirmPassword">
                    CONFIRM PASSWORD
                  </label>

                  <div className={styles.passwordWrapper}>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Repeat password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                    >
                      {showConfirmPassword
                        ? "HIDE"
                        : "SHOW"}
                    </button>
                  </div>
                </div>
              </div>

              {/* TERMS */}
              <label className={styles.terms}>
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) =>
                    setAcceptedTerms(e.target.checked)
                  }
                />

                <span>
                  I agree to the CrowdShield AI terms of
                  service and security policy.
                </span>
              </label>

              {/* REGISTER BUTTON */}
              <button
                type="submit"
                className={styles.registerButton}
                disabled={loading || success}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner}></span>
                    CREATING ACCOUNT...
                  </>
                ) : (
                  <>
                    CREATE ACCOUNT
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

            <div className={styles.loginLink}>
              <span>Already have an account?</span>

              <Link to="/login">
                Sign in
              </Link>
            </div>

            <div className={styles.security}>
              <span>◉</span>
              YOUR INFORMATION IS SECURE
            </div>
          </div>
        </section>
      </div>

      <footer className={styles.footer}>
        CROWDSHIELD AI &nbsp; • &nbsp; EMERGENCY OPERATIONS
        PLATFORM &nbsp; • &nbsp; v1.0.0
      </footer>
    </div>
  );
}

export default Register;