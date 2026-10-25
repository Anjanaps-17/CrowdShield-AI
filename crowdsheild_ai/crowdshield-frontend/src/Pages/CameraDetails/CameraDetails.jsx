
import { useNavigate } from "react-router-dom";
import cameras from "../../data/cameras";
import CameraGrid from "../../components/CCTV/CameraGrid";
import styles from "./CameraDetails.module.css";

function CameraDetails() {
  const navigate = useNavigate();

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
        <div className={styles.backRow}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>

        <CameraGrid />
      </div>
    </div>
  );
}

export default CameraDetails;
