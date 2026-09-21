import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import CameraDetails from "./pages/CameraDetails/CameraDetails";
import GISMap from "./pages/GISMap/GISMap";
import Dashboard from "./pages/Dashboard/Dashboard";
import Analytics from "./pages/Analytics/Analytics";
import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

       <Route
          path="/settings"
          element={<Settings />}
       />

        <Route
          path="/map"
          element={<GISMap />}
        />

        <Route
          path="/cameras"
          element={<CameraDetails />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Main Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/analytics"
          element={<Analytics />}
        />

        <Route
          path="/reports"
          element={<Reports />}
        />

        {/* Default route */}
        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />

          }
        />

        {/* Unknown routes */}
        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;