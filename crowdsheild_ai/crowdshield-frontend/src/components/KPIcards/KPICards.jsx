
import cameras from "../../data/cameras";
import styles from "./KPICards.module.css";

function KPICards({ compact = false }) {
  const totalCrowd = cameras.reduce(
    (total, camera) => total + Number(camera.people || 0),
    0
  );

  const averageCrowd =
    cameras.length > 0
      ? Math.round(totalCrowd / cameras.length)
      : 0;

  const activeCameras = cameras.length;

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
    <div
      className={`${styles.container} ${
        compact ? styles.compactContainer : ""
      }`}
    >
      {cards.map((card) => (
        <div
          key={card.title}
          className={`${styles.card} ${styles[card.type]} ${
            compact ? styles.compactCard : ""
          }`}
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
