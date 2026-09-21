import cameras from "../../data/cameras";
import CameraGrid from "../../components/CCTV/CameraGrid";
import styles from "./CameraDetails.module.css";

function CameraDetails() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <span>LIVE SURVEILLANCE</span>
          <h1>Live Cameras</h1>
          <p>
            Monitor all connected surveillance cameras
            in real time.
          </p>
        </div>

        <div className={styles.status}>
          <i></i>
          {cameras.length} CAMERAS ONLINE
        </div>
      </div>

      <div className={styles.content}>
        <CameraGrid />
      </div>
    </div>
  );
}

export default CameraDetails;