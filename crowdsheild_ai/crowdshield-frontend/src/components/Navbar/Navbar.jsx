
import { useEffect, useRef, useState } from "react";
import cameras from "../../data/cameras";
import styles from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";

function Navbar({
  onMenuClick,
  sidebarOpen,
  onEvacuationClick,
}) {
  const navigate = useNavigate();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const notificationRef = useRef(null);
  const adminMenuRef = useRef(null);

  
const alerts = cameras
  .filter(
    (camera) =>
      camera.status === "critical" ||
      camera.status === "warning"
  )
  .sort((a, b) => {
    if (a.status === "critical" && b.status !== "critical") {
      return -1;
    }

    if (b.status === "critical" && a.status !== "critical") {
      return 1;
    }

    return (b.people || 0) - (a.people || 0);
  });

const alertCount = alerts.length;


  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }

      if (
        adminMenuRef.current &&
        !adminMenuRef.current.contains(event.target)
      ) {
        setAdminMenuOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
        setAdminMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleSignOut() {
    localStorage.removeItem("crowdshieldLoggedIn");
    localStorage.removeItem("crowdshieldUser");
    localStorage.removeItem("crowdshieldRemember");

    navigate("/login");
  }

  
  return (
    <header className={styles.navbar}>
      <div className={styles.leftSection}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
          aria-expanded={sidebarOpen}
        >
          ☰
        </button>

        <div className={styles.brand}>
          <h1 className={styles.title}>CrowdShield AI</h1>
          <p className={styles.subtitle}>
            Crowd Safety &amp; Surveillance System
          </p>
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.liveStatus}>
          <span className={styles.liveDot} />
          <span>LIVE MONITORING</span>
        </div>

        <button
          type="button"
          className={styles.evacuationButton}
          onClick={onEvacuationClick}
        >
          <span className={styles.evacuationIcon}>↗</span>
          Evacuation Plan
        </button>

        <div
          className={styles.notificationWrapper}
          ref={notificationRef}
        >
          <button
            type="button"
            className={styles.notificationButton}
            onClick={() =>
              setNotificationsOpen((previous) => !previous)
            }
            aria-label={`Notifications: ${alertCount} active alerts`}
            aria-expanded={notificationsOpen}
          >
            <span>🔔</span>

            {alertCount > 0 && (
              <span className={styles.notificationBadge}>
                {alertCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div
              className={styles.notificationDropdown}
              role="dialog"
              aria-label="Active risk alerts"
            >
              <div className={styles.notificationHeader}>
                <strong>Active Alerts</strong>

                <button
                  type="button"
                  className={styles.notificationClose}
                  onClick={() => setNotificationsOpen(false)}
                  aria-label="Close notifications"
                >
                  ×
                </button>
              </div>

              {alerts.length === 0 ? (
                <p className={styles.noNotifications}>
                  No active risk alerts.
                </p>
              ) : (
                <div className={styles.notificationList}>
                  {alerts.map((camera) => (
                    <div
                      key={camera.id}
                      className={styles.notificationItem}
                    >
                      <span
                        className={`${styles.notificationIndicator} ${
                          camera.risk === "critical"
                            ? styles.notificationCritical
                            : styles.notificationWarning
                        }`}
                      />

                      <div className={styles.notificationText}>
                        <div className={styles.notificationItemTop}>
                          <strong>
                            {camera.name || `Camera ${camera.id}`}
                          </strong>

                          <span
                            className={styles.notificationLocation}
                          >
                            {camera.risk === "critical"
                              ? "Critical"
                              : "Warning"}
                          </span>
                        </div>

                        <p className={styles.notificationDescription}>
                          {camera.risk === "critical"
                            ? "Critical crowd risk detected"
                            : "Crowd risk warning"}
                          {camera.people != null
                            ? ` · ${camera.people} people`
                            : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.notificationFooter}>
                {alertCount} active alert
                {alertCount === 1 ? "" : "s"}
              </div>
            </div>
          )}
        </div>

        <div
          className={styles.adminMenuWrapper}
          ref={adminMenuRef}
        >
          <button
            type="button"
            className={`${styles.profile} ${styles.profileTrigger}`}
            onClick={() =>
              setAdminMenuOpen((previous) => !previous)
            }
            aria-expanded={adminMenuOpen}
            aria-haspopup="menu"
          >
            <div className={styles.avatar}>A</div>

            <div className={styles.profileInfo}>
              <strong>Administrator</strong>
              <span>System Admin</span>
            </div>

            <span className={styles.arrow}>⌄</span>
          </button>

          {adminMenuOpen && (
            <div className={styles.adminDropdown} role="menu">
              <div className={styles.adminDropdownHeader}>
                <strong>Administrator</strong>
                <span>System Admin</span>
              </div>

              <div className={styles.adminDivider} />

              <button
                type="button"
                className={styles.adminMenuItem}
                role="menuitem"
                onClick={() => {
                  setAdminMenuOpen(false);
                  navigate("/settings");
                }}
              >
                Settings
              </button>

              <button
                type="button"
                className={`${styles.adminMenuItem} ${styles.logoutItem}`}
                role="menuitem"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );

}

export default Navbar;
