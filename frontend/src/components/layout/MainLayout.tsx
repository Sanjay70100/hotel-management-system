import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";
import "./MainLayout.css";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleToggleCollapse = () => {
    setSidebarCollapsed((previous) => !previous);
  };

  return (
    <div
      className={`main-layout ${
        sidebarCollapsed ? "main-layout-collapsed" : ""
      }`}
    >
      <Sidebar
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      <div className="main-layout-content">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="main-layout-main">
          <div className="main-layout-page">
            <Outlet />
          </div>
        </main>

        <footer className="main-layout-footer">
          <span>
            © {new Date().getFullYear()} GrandStay Hotel Management
          </span>

          <span>Management Portal</span>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;