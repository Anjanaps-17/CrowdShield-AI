
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import KPICards from "../../components/KPICards/KPICards";
import CameraGrid from "../../components/CCTV/CameraGrid";
import HeatMap from "../../components/HeatMap/HeatMap";
import cameras from "../../data/cameras";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={styles.dashboard}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className={styles.mainArea}>
        <Navbar
          sidebarOpen={sidebarOpen}
          onMenuClick={() =>
            setSidebarOpen((open) => !open)
          }
          onEvacuationClick={() => navigate("/evacuation")}
        />

        <main className={styles.content}>
          {/* COMPACT HEADER WITH KPI CARDS */}
          <section className={styles.compactDashboardHeader}>
            <div className={styles.dashboardTitleBlock}>
              <div className={styles.dashboardTitleCopy}>
                <span className={styles.eyebrow}>
                  CROWD SAFETY
                </span>

                <h1 className={styles.dashboardTitle}>
                  Safety Overview
                </h1>
              </div>

              <div className={styles.systemTime}>
                <span>MONITORING</span>

                <strong>
                  <i></i>
                  LIVE
                </strong>
              </div>
            </div>

            <div className={styles.headerKpis}>
              <KPICards compact />
            </div>
          </section>

          {/* CAMERAS AND HEAT MAP */}
          <section className={styles.monitoringGrid}>
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
                  4 OF {cameras.length} CAMERAS SHOWN
                </div>
              </div>

              <CameraGrid limit={4} />
            </div>

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

          
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
