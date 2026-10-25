
import cameras from "../../data/cameras";
import CameraCard from "./CameraCard";
import styles from "./CCTV.module.css";

function CameraGrid({ limit }) {


  const riskPriority = {
    critical: 3,
    warning: 2,
    normal: 1,
  };

  // Sort by risk first, then by crowd count.
  const sortedCameras = [...cameras].sort((a, b) => {
    const riskDifference =
      riskPriority[b.status] - riskPriority[a.status];

    if (riskDifference !== 0) {
      return riskDifference;
    }

    return Number(b.people || 0) - Number(a.people || 0);
  });

  // Show only the requested number when a limit is supplied.
  const visibleCameras =
    Number.isInteger(limit) && limit >= 0
      ? sortedCameras.slice(0, limit)
      : sortedCameras;

  return (
    <div className={styles.cameraGrid}>
      {visibleCameras.map((camera) => (
        <CameraCard
  key={camera.id}
  camera={camera}
/>
      ))}
    </div>
  );
}

export default CameraGrid;
