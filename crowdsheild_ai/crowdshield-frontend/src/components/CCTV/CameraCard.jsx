import styles from "./CCTV.module.css";

function CameraCard({ camera, onClick }) {
  const riskLabel =
    camera.status === "critical"
      ? "HIGH"
      : camera.status === "warning"
      ? "MEDIUM"
      : "LOW";

  return (
    <div
      className={`${styles.cameraCard} ${styles[camera.status]}`}
      onClick={onClick}
    >
      <div className={styles.videoArea}>
        <div className={styles.liveBadge}>
          <span></span>
          LIVE
        </div>

        <div className={styles.cameraNumber}>
          {camera.name}
        </div>

        <div className={styles.videoPlaceholder}>
          <div className={styles.cameraIcon}>▣</div>
          <span>CAMERA FEED</span>
          <small>LIVE SIGNAL</small>
        </div>

        <div className={styles.expandIcon}>⛶</div>
      </div>

      <div className={styles.cameraInfo}>
        <div>
          <strong>{camera.location}</strong>
          <span>{camera.name}</span>
        </div>

        <div className={styles.cameraStatus}>
          <span className={styles.statusDot}></span>

          <div>
            <strong>{riskLabel}</strong>

            <span>
              {camera.people.toLocaleString()} people
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CameraCard;