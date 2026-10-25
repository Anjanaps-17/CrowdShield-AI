
import { useNavigate } from "react-router-dom";
import HeatMap from "../../components/HeatMap/HeatMap";
import styles from "./GISMap.module.css";

function GISMap() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.backRow}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>

      <HeatMap />
    </div>
  );
}

export default GISMap;
