import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import {
  MainLayout,
  ProtectedRoute,
} from "./components/layout";

import { Login, ForgotPassword } from "./pages/auth";
import { Dashboard } from "./pages/dashboard";
import { Rooms } from "./pages/rooms";
import { Guests } from "./pages/guests";
import { Reservations } from "./pages/reservations";
import { Staff } from "./pages/staff";
import { Settings } from "./pages/settings";

import "./App.css";

const NotFound = () => (
  <main className="not-found-page">
    <span className="not-found-code">404</span>
    <h1>Page not found</h1>
    <p>The page you requested does not exist or may have moved.</p>
    <a href="/dashboard">Return to Dashboard</a>
  </main>
);

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
              />

              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

              <Route
                path="/rooms"
                element={<Rooms />}
              />

              <Route
                path="/guests"
                element={<Guests />}
              />

              <Route
                path="/reservations"
                element={<Reservations />}
              />

              <Route
                path="/staff"
                element={
                  <ProtectedRoute allowedRoles={["admin"]} />
                }
              >
                <Route index element={<Staff />} />
              </Route>

              <Route
                path="/settings"
                element={<Settings />}
              />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;