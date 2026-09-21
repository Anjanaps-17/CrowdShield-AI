import cameras from "../../data/cameras";
import styles from "./KPICards.module.css";

function KPICards() {
  // Total crowd
  const totalCrowd = cameras.reduce(
    (total, camera) => total + Number(camera.people || 0),
    0
  );

  // Average people per camera
  const averageCrowd = Math.round(
    totalCrowd / cameras.length
  );

  // All cameras in our current dataset are active
  const activeCameras = cameras.length;

  // Critical cameras
  const criticalAlerts = cameras.filter(
    (camera) => camera.status === "critical"
  ).length;

  const cards = [
    {
      title: "TOTAL CROWD",
      value: totalCrowd.toLocaleString(),
      change: "CURRENT",
      description: "Across all cameras",
      icon: "👥",
      type: "blue",
    },

    {
      title: "CROWD DENSITY",
      value: averageCrowd.toLocaleString(),
      change: "MONITORING",
      description: "Average people per camera",
      icon: "◉",
      type: "orange",
    },

    {
      title: "ACTIVE CAMERAS",
      value: `${activeCameras}/${cameras.length}`,
      change: "ONLINE",
      description: "Cameras operational",
      icon: "▣",
      type: "green",
    },

    {
      title: "CRITICAL ALERTS",
      value: String(criticalAlerts).padStart(2, "0"),
      change: criticalAlerts > 0 ? "CRITICAL" : "NORMAL",
      description:
        criticalAlerts > 0
          ? "Requires attention"
          : "No critical alerts",
      icon: "!",
      type: "red",
    },
  ];

  return (
    <div className={styles.container}>
      {cards.map((card) => (
        <div
          key={card.title}
          className={`${styles.card} ${styles[card.type]}`}
        >
          <div className={styles.topRow}>
            <span className={styles.title}>
              {card.title}
            </span>

            <div className={styles.icon}>
              {card.icon}
            </div>
          </div>

          <div className={styles.value}>
            {card.value}
          </div>

          <div className={styles.bottomRow}>
            <span className={styles.change}>
              {card.change}
            </span>

            <span className={styles.description}>
              {card.description}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default KPICards;