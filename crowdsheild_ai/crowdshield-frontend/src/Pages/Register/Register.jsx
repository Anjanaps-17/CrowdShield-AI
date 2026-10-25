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
  const [showTerms, setShowTerms] = useState(false);
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
    const emailPattern = /^[^\s@]+@[^\s@]+\.com$/i;

if (!emailPattern.test(formData.email.trim())) {
  setError("Please enter a valid email address ending with @ and .com.");
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

            
        {/* TERMS AND CONDITIONS */}
            <div className={styles.termsContainer}>
              <label className={styles.termsCheckbox}>
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) =>
                    setAcceptedTerms(e.target.checked)
                  }
                />

                <span>I agree to the CrowdShield AI</span>
              </label>

              <button
                type="button"
                className={styles.termsLink}
                onClick={() => setShowTerms(true)}
              >
                Terms and Conditions
              </button>

              <span className={styles.termsEnding}>
                and security policy.
              </span>
            </div>

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

            {/* TERMS AND CONDITIONS POP-UP */}
{showTerms && (
  <div
    className={styles.termsModalOverlay}
    onClick={() => setShowTerms(false)}
  >
    <div
      className={styles.termsModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="termsTitle"
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.termsModalHeader}>
        <div>
          <p className={styles.eyebrow}>
            PLATFORM GUIDELINES
          </p>

          <h2 id="termsTitle">
            Terms and Conditions
          </h2>
        </div>

        <button
          type="button"
          className={styles.termsClose}
          onClick={() => setShowTerms(false)}
          aria-label="Close terms and conditions"
        >
          ×
        </button>
      </div>

      <div className={styles.termsModalContent}>
        <p>
          Please read these terms before creating your
          CrowdShield AI account.
        </p>

        <h3>1. Purpose of the Platform</h3>
        <p>
          CrowdShield AI is a crowd-monitoring and safety
          project designed to assist in identifying crowd
          density, potential risks and emergency situations.
        </p>

        <h3>2. Video Uploads</h3>
        <p>
          Users may upload video files for demonstration
          and analysis. Only upload videos you are authorised
          to use. Avoid uploading confidential or sensitive
          footage without appropriate permission.
        </p>

        <h3>3. AI Analysis and Risk Alerts</h3>
        <p>
          AI-generated crowd counts, risk classifications
          and alerts may be inaccurate. They should not be
          treated as a guaranteed assessment of a real-world
          emergency or as a replacement for human judgement.
        </p>

        <h3>4. Account Security</h3>
        <p>
          Users are responsible for keeping their login
          credentials confidential and for activity carried
          out through their accounts.
        </p>

        <h3>5. Privacy and Data</h3>
        <p>
          Uploaded videos and account information should be
          handled in accordance with the platform's actual
          data-storage and privacy practices. Do not upload
          personal or sensitive information unless you have
          the necessary authorisation.
        </p>

        <h3>6. Appropriate Use</h3>
        <p>
          The platform must be used responsibly for
          crowd-monitoring demonstrations, testing and
          authorised safety-related purposes.
        </p>

        <h3>7. Acknowledgement</h3>
        <p>
          By accepting these terms, you confirm that you have
          read these guidelines and agree to use CrowdShield
          AI responsibly.
        </p>

        <p className={styles.termsNotice}>
          These are project-level usage guidelines. Adapt
          them to your actual privacy, storage and deployment
          arrangements before using the platform operationally.
        </p>
      </div>

      <div className={styles.termsModalFooter}>
        <button
          type="button"
          className={styles.termsAgreeButton}
          onClick={() => {
            setAcceptedTerms(true);
            setShowTerms(false);
          }}
        >
          I Agree
        </button>

        <button
          type="button"
          className={styles.termsCancelButton}
          onClick={() => setShowTerms(false)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

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