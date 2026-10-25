
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

function Sidebar({ isOpen, onClose }) {
  const storedUser = localStorage.getItem("crowdshieldUser");

  const currentUser = storedUser
    ? JSON.parse(storedUser)
    : {
        name: "Guest",
        role: "User",
      };

  const isController = currentUser.role === "Controller";

  const navigationItems = [
    { name: "Dashboard", path: "/dashboard", icon: "⌂" },
    { name: "Live Cameras", path: "/cameras", icon: "▣" },
    { name: "GIS Map", path: "/map", icon: "⌖" },
    { name: "Analytics", path: "/analytics", icon: "▥" },
    { name: "Reports", path: "/reports", icon: "▤" },
  ];

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className={styles.sidebarOverlay}
          aria-label="Close sidebar"
          onClick={onClose}
        />
      )}

      <aside
        className={`${styles.sidebar} ${
          isOpen ? styles.sidebarOpen : ""
        }`}
        aria-hidden={!isOpen}
      >
        <div className={styles.brand}>
          <div className={styles.logo}>CS</div>

          <div className={styles.brandText}>
            <h2>CrowdShield</h2>
            <span>AI SAFETY PLATFORM</span>
          </div>
        </div>

        <div className={styles.systemStatus}>
          <span className={styles.statusDot}></span>
          <div>
            <strong>System Online</strong>
            <span>All services operational</span>
          </div>
        </div>

        <nav className={styles.navigation}>
          <p className={styles.navigationTitle}>MAIN MENU</p>

          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `${styles.navItem} ${
                  isActive ? styles.active : ""
                }`
              }
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navText}>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.bottomSection}>
          <p className={styles.navigationTitle}>SYSTEM</p>

          {isController && (
            <NavLink
              to="/settings"
              onClick={onClose}
              className={({ isActive }) =>
                `${styles.navItem} ${
                  isActive ? styles.active : ""
                }`
              }
            >
              <span className={styles.navIcon}>⚙</span>
              <span className={styles.navText}>Settings</span>
            </NavLink>
          )}

          <div className={styles.adminProfile}>
            <div className={styles.avatar}>
              {(currentUser.name || "U").charAt(0).toUpperCase()}
            </div>

            <div className={styles.adminInfo}>
              <strong>{currentUser.name || "CrowdShield User"}</strong>
              <span>{currentUser.role || "User"}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
