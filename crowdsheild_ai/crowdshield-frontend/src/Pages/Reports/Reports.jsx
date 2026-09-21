import styles from "./Reports.module.css";

function Reports() {
  const reports = [
    {
      id: "RPT-001",
      title: "Daily Crowd Monitoring Report",
      date: "Today",
      status: "Ready",
      type: "Daily",
    },
    {
      id: "RPT-002",
      title: "Crowd Density Analysis",
      date: "Yesterday",
      status: "Ready",
      type: "Analytics",
    },
    {
      id: "RPT-003",
      title: "Incident & Alert Report",
      date: "Aug 08, 2026",
      status: "Ready",
      type: "Incident",
    },
    {
      id: "RPT-004",
      title: "Weekly Surveillance Summary",
      date: "Aug 04, 2026",
      status: "Processing",
      type: "Weekly",
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <span>SECURITY INTELLIGENCE</span>
          <h1>Reports</h1>
          <p>
            Generate and review crowd monitoring and
            surveillance reports.
          </p>
        </div>

        <button className={styles.generateButton}>
          + GENERATE REPORT
        </button>
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryCard}>
          <span>TOTAL REPORTS</span>
          <strong>24</strong>
        </div>

        <div className={styles.summaryCard}>
          <span>GENERATED THIS WEEK</span>
          <strong>8</strong>
        </div>

        <div className={styles.summaryCard}>
          <span>INCIDENT REPORTS</span>
          <strong>5</strong>
        </div>

        <div className={styles.summaryCard}>
          <span>PENDING</span>
          <strong>2</strong>
        </div>
      </div>

      <div className={styles.reportPanel}>
        <div className={styles.panelHeader}>
          <div>
            <span>REPORT ARCHIVE</span>
            <h2>Recent Reports</h2>
          </div>

          <button className={styles.filterButton}>
            FILTER ▾
          </button>
        </div>

        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span>REPORT</span>
            <span>TYPE</span>
            <span>DATE</span>
            <span>STATUS</span>
            <span>ACTION</span>
          </div>

          {reports.map((report) => (
            <div
              className={styles.row}
              key={report.id}
            >
              <div className={styles.reportName}>
                <strong>{report.title}</strong>
                <small>{report.id}</small>
              </div>

              <span className={styles.type}>
                {report.type}
              </span>

              <span className={styles.date}>
                {report.date}
              </span>

              <span
                className={
                  report.status === "Ready"
                    ? styles.ready
                    : styles.processing
                }
              >
                {report.status}
              </span>

              <button className={styles.viewButton}>
                VIEW
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reports;