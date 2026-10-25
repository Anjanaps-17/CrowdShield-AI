
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import EvacuationPlan from "../../components/EvacuationPlan/EvacuationPlan";
import styles from "./Evacuation.module.css";

function Evacuation() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  let currentUser = null;

  try {
    currentUser = JSON.parse(
      localStorage.getItem("crowdshieldUser")
    );
  } catch {
    currentUser = null;
  }

  const isController = currentUser?.role === "Controller";

  return (
    <div className={styles.page}>
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
          <div className={styles.backRow}>
            <button
              type="button"
              className={styles.backButton}
              onClick={() => navigate("/dashboard")}
            >
              ← Back to Dashboard
            </button>
          </div>

          <EvacuationPlan
            isController={isController}
          />
        </main>
      </div>
    </div>
  );
}

export default Evacuation;
