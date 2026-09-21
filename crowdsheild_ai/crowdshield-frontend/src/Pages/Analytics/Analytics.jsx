import cameras from "../../data/cameras";
import styles from "./Analytics.module.css";

function Analytics() {
  const totalPeople = cameras.reduce(
    (total, camera) => total + Number(camera.people || 0),
    0
  );

  const activeCameras = cameras.length;

  const alertsToday = cameras.filter(
    (camera) =>
      camera.status === "critical" ||
      camera.status === "warning"
  ).length;

  const peakCamera = cameras.reduce(
    (peak, camera) =>
      Number(camera.people || 0) >
      Number(peak.people || 0)
        ? camera
        : peak,
    cameras[0]
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <span>DATA INTELLIGENCE</span>
          <h1>Analytics</h1>
          <p>
            Crowd activity, density trends and
            monitoring statistics.
          </p>
        </div>
      </div>

      <div className={styles.cards}>
        <div className={styles.card}>
          <span>TOTAL PEOPLE MONITORED</span>
          <strong>{totalPeople.toLocaleString()}</strong>
        </div>

        <div className={styles.card}>
          <span>PEAK CROWD</span>
          <strong>
            {peakCamera?.people.toLocaleString() || 0}
          </strong>
        </div>

        <div className={styles.card}>
          <span>ACTIVE CAMERAS</span>
          <strong>{activeCameras}</strong>
        </div>

        <div className={styles.card}>
          <span>ACTIVE ALERTS</span>
          <strong>{alertsToday}</strong>
        </div>
      </div>

      <div className={styles.chartArea}>
        <span>CROWD LEVEL BY CAMERA</span>

        <div className={styles.chart}>
          {cameras.map((camera) => (
            <div
              key={camera.id}
              style={{
                height: `${Math.min(
                  (camera.people / peakCamera.people) * 100,
                  100
                )}%`,
              }}
              title={`${camera.name}: ${camera.people.toLocaleString()} people`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Analytics;