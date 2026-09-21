import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import KPICards from "../../components/KPICards/KPICards";
import CameraGrid from "../../components/CCTV/CameraGrid";
import HeatMap from "../../components/HeatMap/HeatMap";
import AlertPanel from "../../components/Alerts/AlertPanel";
import Timeline from "../../components/Timeline/Timeline";
import cameras from "../../data/cameras";
import styles from "./Dashboard.module.css";

function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <Sidebar />

      <div className={styles.mainArea}>
        <Navbar />

        <main className={styles.content}>
          {/* PAGE HEADER */}
          <div className={styles.pageHeader}>
            <div>
              <span className={styles.eyebrow}>
                CROWD MONITORING & SAFETY
              </span>

              <h1>Command Dashboard</h1>

              <p>
                Real-time crowd intelligence and
                surveillance monitoring
              </p>
            </div>

            <div className={styles.systemTime}>
              <span>MONITORING STATUS</span>

              <strong>
                <i></i>
                LIVE
              </strong>
            </div>
          </div>

          {/* KPI CARDS */}
          <section className={styles.kpiSection}>
            <KPICards />
          </section>

          {/* MAIN MONITORING AREA */}
          <section className={styles.monitoringGrid}>
            
            {/* CCTV */}
            <div className={styles.cameraSection}>
              <div className={styles.sectionHeader}>
                <div>
                  <span className={styles.sectionEyebrow}>
                    SURVEILLANCE
                  </span>

                  <h2>Live Camera Feeds</h2>
                </div>

                <div className={styles.cameraCount}>
                  <span></span>
                  {cameras.length} CAMERAS ONLINE
                </div>
              </div>

              <CameraGrid />
            </div>

            {/* HEAT MAP */}
            <div className={styles.heatMapSection}>
              <div className={styles.sectionHeader}>
                <div>
                  <span className={styles.sectionEyebrow}>
                    SPATIAL INTELLIGENCE
                  </span>

                  <h2>Crowd Density Heat Map</h2>
                </div>
              </div>

              <HeatMap />
            </div>
          </section>

          {/* ALERT + TIMELINE */}
          <section className={styles.bottomGrid}>
            <AlertPanel />

            <Timeline />
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;