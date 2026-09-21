import { useState } from "react";
import cameras from "../../data/cameras";
import styles from "./HeatMap.module.css";

function HeatMap() {
  const [selectedZone, setSelectedZone] = useState(null);

  // Temporary frontend values.
  // These will later come from the AI/backend team.
  const densityValues = {
    1: 32,
    2: 57,
    3: 45,
    4: 91,
    5: 28,
    6: 68,
  };

  const getRisk = (status) => {
    if (status === "critical") return "High";
    if (status === "warning") return "Medium";
    return "Low";
  };

  const zones = cameras.map((camera) => ({
    ...camera,
    density: densityValues[camera.id] || 0,
    risk: getRisk(camera.status),
  }));

  return (
    <div className={styles.heatMapContainer}>
      <div className={styles.mapHeader}>
        <div>
          <h3>Crowd Density Heat Map</h3>
          <p>
            Crowd concentration across monitored camera zones
          </p>
        </div>

        <div className={styles.legend}>
          <span>🟢 Low</span>
          <span>🟡 Medium</span>
          <span>🔴 High</span>
        </div>
      </div>

      <div className={styles.mapArea}>

        {zones.map((camera, index) => (
          <div
            key={camera.id}
            className={`${styles.zone} ${styles[`zone${index + 1}`]}`}
          >
            <button
              onClick={() => setSelectedZone(camera)}
            >
              📹
              <strong>{camera.name}</strong>
              <span>{camera.density}%</span>
            </button>
          </div>
        ))}

        {selectedZone && (
          <div className={styles.zoneDetails}>
            <button
              className={styles.closeButton}
              onClick={() => setSelectedZone(null)}
            >
              ×
            </button>

            <h4>{selectedZone.location}</h4>

            <p>
              Camera:{" "}
              <strong>{selectedZone.name}</strong>
            </p>

            <p>
              Crowd Count:{" "}
              <strong>
                {selectedZone.people.toLocaleString()}
              </strong>
            </p>

            <p>
              Density:{" "}
              <strong>{selectedZone.density}%</strong>
            </p>

            <p>
              Risk:{" "}
              <strong>{selectedZone.risk}</strong>
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default HeatMap;