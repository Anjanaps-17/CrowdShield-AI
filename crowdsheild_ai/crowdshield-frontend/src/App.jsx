
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./Pages/Register/Register";
import CameraDetails from "./pages/CameraDetails/CameraDetails";
import GISMap from "./pages/GISMap/GISMap";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Analytics from "./pages/Analytics/Analytics";
import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";
import Evacuation from "./pages/Evacuation/Evacuation";

// Get the currently logged-in user
function getCurrentUser() {
  try {
    const loggedIn =
      localStorage.getItem("crowdshieldLoggedIn") === "true";

    const storedUser = localStorage.getItem("crowdshieldUser");

    if (!loggedIn || !storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch {
    return null;
  }
}

// Protect pages that require login
function ProtectedRoute({ children }) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Protect pages that require the Controller role
function ControllerRoute({ children }) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "Controller") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Monitoring and analysis */}
        <Route
          path="/cameras"
          element={
            <ProtectedRoute>
              <CameraDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <GISMap />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* Settings: both roles can access */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Evacuation: Both roles can view the page */}
<Route
  path="/evacuation"
  element={
    <ProtectedRoute>
      <Evacuation />
    </ProtectedRoute>
  }
/>

        {/* Default route */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
