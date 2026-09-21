import cameras from "../../data/cameras";
import styles from "./AlertPanel.module.css";

function AlertPanel() {
  // Show warning and critical cameras
  const alerts = cameras
    .filter(
      (camera) =>
        camera.status === "critical" ||
        camera.status === "warning"
    )
    .sort((a, b) => {
      const priority = {
        critical: 2,
        warning: 1,
      };

      return priority[b.status] - priority[a.status];
    });

  return (
    <div className={styles.alertPanel}>
      <div className={styles.alertHeader}>
        <div>
          <h3>Risk Alerts</h3>
          <p>Current crowd-risk conditions</p>
        </div>

        <span className={styles.alertCount}>
          {alerts.length} ACTIVE
        </span>
      </div>

      <div className={styles.alertList}>
        {alerts.length === 0 ? (
          <div className={styles.noAlerts}>
            <span>✓</span>
            <strong>No active alerts</strong>
            <p>All monitored areas are currently safe.</p>
          </div>
        ) : (
          alerts.map((camera) => {
            const isCritical =
              camera.status === "critical";

            return (
              <div
                key={camera.id}
                className={`${styles.alertItem} ${
                  isCritical
                    ? styles.highAlert
                    : styles.mediumAlert
                }`}
              >
                <div className={styles.alertIcon}>
                  !
                </div>

                <div className={styles.alertContent}>
                  <div className={styles.alertTitleRow}>
                    <strong>
                      {isCritical
                        ? "CRITICAL"
                        : "WARNING"}
                    </strong>

                    <span>{camera.name}</span>
                  </div>

                  <h4>{camera.location}</h4>

                  <p>
                    Crowd level requires{" "}
                    <strong>
                      {isCritical
                        ? "immediate attention"
                        : "monitoring"}
                    </strong>
                  </p>

                  <div className={styles.alertDetails}>
                    <span>
                      Crowd:{" "}
                      {camera.people.toLocaleString()}
                    </span>

                    <span>
                      Risk:{" "}
                      {isCritical
                        ? "HIGH"
                        : "MEDIUM"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default AlertPanel;