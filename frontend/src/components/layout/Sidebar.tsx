import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BedDouble,
  Users,
  CalendarCheck,
  Settings,
  LogOut,
  Hotel,
  ChevronLeft,
  ChevronRight,
  UserCog,
} from "lucide-react";

import { useAuthContext } from "../../context/AuthContext";
import "./Sidebar.css";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar = ({
  isOpen,
  onClose,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Rooms",
      path: "/rooms",
      icon: BedDouble,
    },
    {
      label: "Guests",
      path: "/guests",
      icon: Users,
    },
    {
      label: "Reservations",
      path: "/reservations",
      icon: CalendarCheck,
    },
  ];

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/login", { replace: true });
  };

  const displayName =
    user?.full_name || user?.username || "Hotel Staff";

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={onClose}
          aria-label="Close navigation menu"
        />
      )}

      <aside
        className={[
          "sidebar",
          isOpen ? "sidebar-open" : "",
          collapsed ? "sidebar-collapsed" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label="Main navigation"
      >
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <Hotel size={25} />
          </div>

          {!collapsed && (
            <div className="sidebar-brand-text">
              <h2>GrandStay</h2>
              <span>Hotel Management</span>
            </div>
          )}
        </div>

        {onToggleCollapse && (
          <button
            type="button"
            className="sidebar-collapse-button"
            onClick={onToggleCollapse}
            aria-label={
              collapsed ? "Expand sidebar" : "Collapse sidebar"
            }
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        )}

        <div className="sidebar-section-label">
          {!collapsed && "MAIN MENU"}
        </div>

        <nav className="sidebar-navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
                }
              >
                <Icon size={20} className="sidebar-link-icon" />

                {!collapsed && (
                  <span className="sidebar-link-label">
                    {item.label}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-section-label">
          {!collapsed && "ACCOUNT"}
        </div>

        <nav className="sidebar-navigation">
          {user?.role?.toLowerCase() === "admin" && (
            <NavLink
              to="/staff"
              onClick={onClose}
              title={collapsed ? "Staff Management" : undefined}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
              }
            >
              <UserCog size={20} className="sidebar-link-icon" />

              {!collapsed && (
                <span className="sidebar-link-label">
                  Staff Management
                </span>
              )}
            </NavLink>
          )}

          <NavLink
            to="/settings"
            onClick={onClose}
            title={collapsed ? "Settings" : undefined}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
            }
          >
            <Settings size={20} className="sidebar-link-icon" />

            {!collapsed && (
              <span className="sidebar-link-label">
                Settings
              </span>
            )}
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {displayName.charAt(0).toUpperCase()}
            </div>

            {!collapsed && (
              <div className="sidebar-user-details">
                <span className="sidebar-user-name">
                  {displayName}
                </span>

                <span className="sidebar-user-role">
                  {user?.role ?? "staff"}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            className="sidebar-logout-button"
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut size={19} />

            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;