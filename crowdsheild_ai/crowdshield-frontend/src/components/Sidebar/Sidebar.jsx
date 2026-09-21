import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

function Sidebar() {
  const navigationItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "⌂",
    },
    {
      name: "Live Cameras",
      path: "/cameras",
      icon: "▣",
    },
    {
      name: "GIS Map",
      path: "/map",
      icon: "⌖",
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: "▥",
    },
    {
      name: "Reports",
      path: "/reports",
      icon: "▤",
    },
  ];

  return (
    <aside className={styles.sidebar}>
      {/* BRAND */}
      <div className={styles.brand}>
        <div className={styles.logo}>
          CS
        </div>

        <div className={styles.brandText}>
          <h2>CrowdShield</h2>
          <span>AI SAFETY PLATFORM</span>
        </div>
      </div>

      {/* SYSTEM STATUS */}
      <div className={styles.systemStatus}>
        <span className={styles.statusDot}></span>

        <div>
          <strong>System Online</strong>
          <span>All services operational</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className={styles.navigation}>
        <p className={styles.navigationTitle}>
          MAIN MENU
        </p>

        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `${styles.navItem} ${
                isActive ? styles.active : ""
              }`
            }
          >
            <span className={styles.navIcon}>
              {item.icon}
            </span>

            <span className={styles.navText}>
              {item.name}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* BOTTOM SECTION */}
      <div className={styles.bottomSection}>
        <p className={styles.navigationTitle}>
          SYSTEM
        </p>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${styles.navItem} ${
              isActive ? styles.active : ""
            }`
          }
        >
          <span className={styles.navIcon}>⚙</span>
          <span className={styles.navText}>Settings</span>
        </NavLink>

        <div className={styles.adminProfile}>
          <div className={styles.avatar}>A</div>

          <div className={styles.adminInfo}>
            <strong>Administrator</strong>
            <span>System Admin</span>
          </div>

          <button
            className={styles.logoutButton}
            title="Logout"
          >
            ↪
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;