
import { useState } from "react";
import cameras from "../../data/cameras";
import styles from "./EvacuationPlan.module.css";
function EvacuationPlan({ isController = false, onClose }) {
  const [routes, setRoutes] = useState([
    { id: 1, name: "Route A", exit: "North Exit" },
    { id: 2, name: "Route B", exit: "East Exit" },
  ]);

  const [editingRouteId, setEditingRouteId] = useState(null);
  const [routeName, setRouteName] = useState("");
  const [exitName, setExitName] = useState("");

  const riskPriority = {
    critical: 3,
    warning: 2,
    normal: 1,
  };
  
  const startEditing = (route) => {
    setEditingRouteId(route.id);
    setRouteName(route.name);
    setExitName(route.exit);
  };

  const cancelEditing = () => {
    setEditingRouteId(null);
    setRouteName("");
    setExitName("");
  };

  const saveRoute = (id) => {
    if (!routeName.trim() || !exitName.trim()) {
      window.alert("Please enter both a route name and an exit location.");
      return;
    }

    setRoutes((currentRoutes) =>
      currentRoutes.map((route) =>
        route.id === id
          ? {
              ...route,
              name: routeName.trim(),
              exit: exitName.trim(),
            }
          : route
      )
    );

    cancelEditing();
  };

  const addRoute = () => {
    const nextId =
      Math.max(0, ...routes.map((route) => route.id)) + 1;

    setRoutes((currentRoutes) => [
      ...currentRoutes,
      {
        id: nextId,
        name: `Route ${String.fromCharCode(64 + nextId)}`,
        exit: "New Exit",
      },
    ]);
  };

  const deleteRoute = (id) => {
    setRoutes((currentRoutes) =>
      currentRoutes.filter((route) => route.id !== id)
    );

    if (editingRouteId === id) {
      cancelEditing();
    }
  };


  const priorityCamera = [...cameras].sort((a, b) => {
    const riskDifference =
      riskPriority[b.status] - riskPriority[a.status];

    if (riskDifference !== 0) return riskDifference;

    return Number(b.people || 0) - Number(a.people || 0);
  })[0];

  const riskLabel = (status) => {
    if (status === "critical") return "HIGH";
    if (status === "warning") return "MEDIUM";
    return "LOW";
  };

  const alertZones = cameras.filter(
    (camera) =>
      camera.status === "critical" ||
      camera.status === "warning"
  );

  return (
    <section className={styles.panel}>
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>
            EMERGENCY RESPONSE
          </span>
          <h2>Evacuation Plan</h2>
          <p>
            Crowd-risk zones, designated exits and suggested
            evacuation routes.
          </p>
        </div>
<span className={styles.demoBadge}>
  DEMO ROUTES
</span>
      </header>

      <div className={styles.content}>
        <div className={styles.mapPanel}>
          <div className={styles.mapHeader}>
            <span>EVACUATION ROUTE OVERVIEW</span>
            <span>SCHEMATIC MAP</span>
          </div>

          <div className={styles.mapCanvas}>
            <svg
              className={styles.map}
              viewBox="0 0 700 330"
              role="img"
              aria-label="Illustrative evacuation routes and crowd zones"
            >
              <defs>
                <pattern
                  id="evacuationGrid"
                  width="28"
                  height="28"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 28 0 L 0 0 0 28"
                    fill="none"
                    stroke="#193047"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>

              <rect
                width="700"
                height="330"
                fill="#06111e"
              />

              <rect
                width="700"
                height="330"
                fill="url(#evacuationGrid)"
              />

              {/* Schematic venue boundaries */}
              <path
                d="M55 35 H645 V295 H55 Z"
                fill="none"
                stroke="#34516a"
                strokeWidth="2"
                strokeDasharray="7 5"
              />

              
{/* Dynamic suggested evacuation routes */}
{routes.map((route, index) => {
  const routePaths = [
    "M500 165 C435 165 405 115 340 105 S200 60 90 60",
    "M500 165 C560 165 595 120 645 60",
    "M340 190 C300 150 250 120 170 90",
    "M340 190 C400 220 480 250 590 265",
    "M150 220 C200 200 260 180 340 190",
  ];

  const routeColors = [
    "#35dba6",
    "#47b8ff",
    "#f5bd4f",
    "#ff8bd1",
    "#a78bfa",
  ];

  return (
    <path
      key={route.id}
      d={routePaths[index % routePaths.length]}
      fill="none"
      stroke={routeColors[index % routeColors.length]}
      strokeWidth="5"
      strokeLinecap="round"
      strokeDasharray="10 7"
    />
  );
})}


              {/* Designated exits: illustrative positions */}
              <g>
                <rect
                  x="57"
                  y="42"
                  width="68"
                  height="34"
                  rx="6"
                  fill="#143e32"
                  stroke="#35dba6"
                />
                <text
                  x="91"
                  y="63"
                  fill="#8cf2ce"
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                >
                  {routes[0]?.exit || "EXIT A"}
                </text>
              </g>

              <g>
                <rect
                  x="610"
                  y="42"
                  width="68"
                  height="34"
                  rx="6"
                  fill="#153750"
                  stroke="#47b8ff"
                />
                <text
                  x="644"
                  y="63"
                  fill="#a8e1ff"
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                >
                 {routes[1]?.exit || "EXIT B"}
                </text>
              </g>

              {/* Camera and crowd zones */}
              <g>
                <circle cx="150" cy="220" r="21" fill="#1b9b77" opacity="0.85" />
                <circle cx="150" cy="220" r="5" fill="#9bffdc" />
                <text x="150" y="251" fill="#d5e8f7" textAnchor="middle" fontSize="10">
                  CAM-01
                </text>
              </g>

              <g>
                <circle cx="340" cy="190" r="25" fill="#bd8a29" opacity="0.9" />
                <circle cx="340" cy="190" r="5" fill="#ffe3a0" />
                <text x="340" y="226" fill="#d5e8f7" textAnchor="middle" fontSize="10">
                  CAM-02
                </text>
              </g>

              <g>
                <circle cx="340" cy="105" r="19" fill="#1b9b77" opacity="0.85" />
                <circle cx="340" cy="105" r="5" fill="#9bffdc" />
                <text x="340" y="135" fill="#d5e8f7" textAnchor="middle" fontSize="10">
                  CAM-03
                </text>
              </g>

              <g>
                <circle cx="500" cy="165" r="29" fill="#c7354c" opacity="0.85" />
                <circle cx="500" cy="165" r="38" fill="none" stroke="#ff7082" strokeWidth="2" strokeDasharray="5 5" />
                <circle cx="500" cy="165" r="6" fill="#ffd8de" />
                <text x="500" y="208" fill="#ff9eab" textAnchor="middle" fontSize="10" fontWeight="700">
                  CAM-04 HIGH
                </text>
              </g>

              <g>
                <circle cx="170" cy="280" r="17" fill="#1b9b77" opacity="0.85" />
                <circle cx="170" cy="280" r="5" fill="#9bffdc" />
                <text x="200" y="284" fill="#d5e8f7" fontSize="10">
                  CAM-05
                </text>
              </g>

              <g>
                <circle cx="590" cy="265" r="21" fill="#bd8a29" opacity="0.9" />
                <circle cx="590" cy="265" r="5" fill="#ffe3a0" />
                <text x="590" y="298" fill="#d5e8f7" textAnchor="middle" fontSize="10">
                  CAM-06
                </text>
              </g>
            </svg>
          </div>

          <div className={styles.legend}>
            <span><i className={styles.highDot}></i> High risk</span>
            <span><i className={styles.mediumDot}></i> Medium risk</span>
            <span><i className={styles.lowDot}></i> Low risk</span>
            <span><i className={styles.routeDot}></i> Suggested route</span>
          </div>
        </div>

        <aside className={styles.routePanel}>
          <div className={styles.summary}>
            <span className={styles.summaryLabel}>
              PRIORITY ZONE
            </span>

            <h3>
              {priorityCamera
                ? priorityCamera.location
                : "No camera data"}
            </h3>

            {priorityCamera && (
              <>
                <span
                  className={`${styles.riskBadge} ${
                    styles[priorityCamera.status]
                  }`}
                >
                  {riskLabel(priorityCamera.status)} RISK
                </span>

                <p>
                  {priorityCamera.name} ·{" "}
                  {Number(priorityCamera.people || 0).toLocaleString()}{" "}
                  people
                </p>
              </>
            )}
          </div>

          <div className={styles.zoneSummary}>
            <div>
              <span>Priority zones</span>
              <strong>{alertZones.length}</strong>
            </div>

            <div>
              <span>Designated exits</span>
              <strong>2</strong>
            </div>
          </div>

         
<div className={styles.routeSuggestions}>
  <h3>Suggested routes</h3>

  {routes.map((route, index) => (
    <div className={styles.routeItem} key={route.id}>
      <span
        className={
          index % 2 === 0 ? styles.routeA : styles.routeB
        }
      >
        {String.fromCharCode(65 + index)}
      </span>

      {isController && editingRouteId === route.id ? (
        <div className={styles.routeForm}>
          <label>
            Route name
            <input
              type="text"
              value={routeName}
              onChange={(event) =>
                setRouteName(event.target.value)
              }
            />
          </label>

          <label>
            Exit location
            <input
              type="text"
              value={exitName}
              onChange={(event) =>
                setExitName(event.target.value)
              }
            />
          </label>

          <div className={styles.routeActions}>
            <button
              type="button"
              className={styles.saveButton}
              onClick={() => saveRoute(route.id)}
            >
              Save
            </button>

            <button
              type="button"
              className={styles.cancelButton}
              onClick={cancelEditing}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <strong>{route.name}</strong>
          <p>{route.exit}</p>
          <p>Illustrative alternate route</p>
        </div>
      )}

      {isController && editingRouteId !== route.id && (
        <div className={styles.routeActions}>
          <button
            type="button"
            className={styles.editButton}
            onClick={() => startEditing(route)}
          >
            Edit
          </button>

          <button
            type="button"
            className={styles.deleteButton}
            onClick={() => deleteRoute(route.id)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  ))}

  {isController && (
    <button
      type="button"
      className={styles.addButton}
      onClick={addRoute}
    >
      + Add Route
    </button>
  )}
</div>

        </aside>
      </div>

      <footer className={styles.disclaimer}>
        Demo visualization only. Exit locations and routes are
        illustrative, not calculated or verified for safe
        real-world evacuation.
      </footer>
    </section>
  );
}

export default EvacuationPlan;
