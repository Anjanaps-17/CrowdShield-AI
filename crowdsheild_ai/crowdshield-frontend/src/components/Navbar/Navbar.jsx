import styles from "./Navbar.module.css";

function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.leftSection}>
        <button className={styles.menuButton} aria-label="Menu">
          ☰
        </button>

        <div>
          <h2 className={styles.title}>CrowdShield AI</h2>
          <p className={styles.subtitle}>
            Crowd Safety & Surveillance System
          </p>
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.liveStatus}>
          <span className={styles.liveDot}></span>
          <span>LIVE MONITORING</span>
        </div>

        <button className={styles.notificationButton}>
          🔔
          <span className={styles.notificationBadge}>3</span>
        </button>

        <div className={styles.profile}>
          <div className={styles.avatar}>A</div>

          <div className={styles.profileInfo}>
            <strong>Administrator</strong>
            <span>System Admin</span>
          </div>

          <span className={styles.arrow}>⌄</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;