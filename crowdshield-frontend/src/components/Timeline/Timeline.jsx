import styles from "./Timeline.module.css";

function Timeline() {
  const events = [
    {
      time: "14:32:18",
      title: "Critical density detected",
      location: "Zone C · Central Plaza",
      type: "critical",
    },
    {
      time: "14:30:42",
      title: "Crowd density increased",
      location: "Zone D · Main Corridor",
      type: "warning",
    },
    {
      time: "14:28:11",
      title: "Camera feed connected",
      location: "CAM-05 · Parking Area",
      type: "normal",
    },
    {
      time: "14:25:37",
      title: "Crowd movement detected",
      location: "Zone B · North Gate",
      type: "warning",
    },
    {
      time: "14:21:09",
      title: "System health check completed",
      location: "All monitoring systems",
      type: "normal",
    },
  ];

  return (
    <div className={styles.timeline}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>
            EVENT LOG
          </span>

          <h3>Monitoring Timeline</h3>
        </div>

        <span className={styles.live}>
          <span></span>
          LIVE
        </span>
      </div>

      <div className={styles.events}>
        {events.map((event, index) => (
          <div
            key={`${event.time}-${index}`}
            className={styles.event}
          >
            <div className={styles.time}>
              {event.time}
            </div>

            <div
              className={`${styles.marker} ${
                styles[event.type]
              }`}
            ></div>

            <div className={styles.eventContent}>
              <strong>{event.title}</strong>
              <span>{event.location}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Timeline;