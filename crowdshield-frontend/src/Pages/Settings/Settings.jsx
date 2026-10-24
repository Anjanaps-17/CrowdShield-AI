
import { useState } from "react";
import styles from "./Settings.module.css";
import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const storedUser = localStorage.getItem("crowdshieldUser");

  const currentUser = storedUser
    ? JSON.parse(storedUser)
    : {
        name: "Guest",
        username: "guest",
        email: "",
        role: "User",
      };

  const isController = currentUser.role === "Controller";

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button
  type="button"
  className={styles.outlineButton}
  onClick={() => navigate("/dashboard")}
>
  ← Back to Dashboard
</button>
        <div>
          <span>ACCOUNT & SYSTEM CONFIGURATION</span>
          <h1>Settings</h1>
          <p>
            Manage your CrowdShield AI account and monitoring
            preferences.
          </p>
        </div>
      </div>

      <div className={styles.layout}>
        {/* PROFILE */}
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <span>ACCOUNT</span>
            <h2>My Profile</h2>
          </div>

          <div className={styles.profile}>
            <div className={styles.avatar}>
              {(currentUser.name || "U")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <h3>{currentUser.name || "CrowdShield User"}</h3>
              <p>{currentUser.role || "User"}</p>
              <small>{currentUser.email || "Email not available"}</small>
            </div>
          </div>

          <div className={styles.infoRow}>
            <span>Username</span>
            <strong>{currentUser.username || "Not available"}</strong>
          </div>

          <div className={styles.infoRow}>
            <span>Account Role</span>
            <strong>{currentUser.role || "User"}</strong>
          </div>

          <button
            type="button"
            className={styles.outlineButton}
            onClick={() =>
              alert("Profile editing will be implemented later.")
            }
          >
            EDIT PROFILE
          </button>
        </section>

        {/* MONITORING */}
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <span>MONITORING</span>
            <h2>Monitoring Preferences</h2>
          </div>

          <SettingRow
            title="Real-time Notifications"
            description="Receive alerts when critical crowd events are detected."
            enabled={notifications}
            onChange={() => setNotifications(!notifications)}
          />

          <SettingRow
            title="Sound Alerts"
            description="Play an alert sound for high-priority incidents."
            enabled={soundAlerts}
            onChange={() => setSoundAlerts(!soundAlerts)}
          />

          <SettingRow
            title="Automatic Data Refresh"
            description="Automatically update monitoring information."
            enabled={autoRefresh}
            onChange={() => setAutoRefresh(!autoRefresh)}
          />
        </section>

        {/* SYSTEM - CONTROLLER ONLY */}
        {isController && (
          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <span>SYSTEM</span>
              <h2>System Information</h2>
            </div>

            <div className={styles.infoRow}>
              <span>Platform</span>
              <strong>CrowdShield AI</strong>
            </div>

            <div className={styles.infoRow}>
              <span>Version</span>
              <strong>1.0.0</strong>
            </div>

            <div className={styles.infoRow}>
              <span>Monitoring Status</span>
              <strong className={styles.online}>
                ● Online
              </strong>
            </div>

            <div className={styles.infoRow}>
              <span>Connected Cameras</span>
              <strong>24 / 24</strong>
            </div>
          </section>
        )}

        {/* SECURITY */}
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <span>SECURITY</span>
            <h2>Security</h2>
          </div>

          <div className={styles.securityRow}>
            <div>
              <strong>Account Password</strong>
              <p>Manage your account password.</p>
            </div>

            <button
              type="button"
              className={styles.outlineButton}
              onClick={() =>
                alert("Password changing will be implemented later.")
              }
            >
              CHANGE PASSWORD
            </button>
          </div>

          {isController && (
            <div className={styles.securityRow}>
              <div>
                <strong>Two-Factor Authentication</strong>
                <p>
                  Add an additional layer of account security.
                </p>
              </div>

              <span className={styles.disabled}>
                NOT CONFIGURED
              </span>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function SettingRow({
  title,
  description,
  enabled,
  onChange,
}) {
  return (
    <div className={styles.settingRow}>
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>

      <button
        type="button"
        className={`${styles.toggle} ${
          enabled ? styles.toggleActive : ""
        }`}
        onClick={onChange}
        aria-label={`Toggle ${title}`}
        aria-pressed={enabled}
      >
        <span></span>
      </button>
    </div>
  );
}

export default Settings;
