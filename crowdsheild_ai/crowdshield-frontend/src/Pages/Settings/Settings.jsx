import { useState } from "react";
import styles from "./Settings.module.css";

function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <span>SYSTEM CONFIGURATION</span>
          <h1>Settings</h1>
          <p>
            Manage your CrowdShield AI monitoring
            preferences and system configuration.
          </p>
        </div>
      </div>

      <div className={styles.layout}>
        {/* PROFILE */}
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <span>ACCOUNT</span>
            <h2>Administrator Profile</h2>
          </div>

          <div className={styles.profile}>
            <div className={styles.avatar}>A</div>

            <div>
              <h3>Administrator</h3>
              <p>System Administrator</p>
              <small>admin@crowdshield.ai</small>
            </div>
          </div>

          <button className={styles.outlineButton}>
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
            onChange={() =>
              setNotifications(!notifications)
            }
          />

          <SettingRow
            title="Sound Alerts"
            description="Play an alert sound for high-priority incidents."
            enabled={soundAlerts}
            onChange={() =>
              setSoundAlerts(!soundAlerts)
            }
          />

          <SettingRow
            title="Automatic Data Refresh"
            description="Automatically update monitoring information."
            enabled={autoRefresh}
            onChange={() =>
              setAutoRefresh(!autoRefresh)
            }
          />
        </section>

        {/* SYSTEM */}
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

        {/* SECURITY */}
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <span>SECURITY</span>
            <h2>Security</h2>
          </div>

          <div className={styles.securityRow}>
            <div>
              <strong>Account Password</strong>
              <p>
                Last changed 30 days ago
              </p>
            </div>

            <button className={styles.outlineButton}>
              CHANGE PASSWORD
            </button>
          </div>

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
        className={`${styles.toggle} ${
          enabled ? styles.toggleActive : ""
        }`}
        onClick={onChange}
        aria-label={`Toggle ${title}`}
      >
        <span></span>
      </button>
    </div>
  );
}

export default Settings;