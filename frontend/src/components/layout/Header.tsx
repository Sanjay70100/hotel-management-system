import { useLocation } from "react-router-dom";
import { Menu, Bell, Search } from "lucide-react";

import { useAuthContext } from "../../context/AuthContext";
import "./Header.css";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const location = useLocation();
  const { user } = useAuthContext();

  const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/rooms": "Room Management",
    "/guests": "Guest Management",
    "/reservations": "Reservations",
    "/staff": "Staff Management",
    "/settings": "Settings",
  };

  const pageTitle = pageTitles[location.pathname] ?? "Hotel Management";

  const displayName =
    user?.full_name || user?.username || "User";

  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="header-menu-button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className="header-page-info">
          <h1>{pageTitle}</h1>
          <p>Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      <div className="header-right">
        <div className="header-date">
          {currentDate}
        </div>

        <button
          type="button"
          className="header-icon-button"
          aria-label="Search"
          title="Search"
          onClick={() => {
            window.dispatchEvent(new Event("hotel:open-search"));
          }}
        >
          <Search size={20} />
        </button>

        <button
          type="button"
          className="header-icon-button header-notification-button"
          aria-label="Notifications"
          title="Notifications"
          onClick={() => {
            window.dispatchEvent(
              new Event("hotel:open-notifications")
            );
          }}
        >
          <Bell size={20} />
        </button>

        <div className="header-user">
          <div className="header-user-avatar">
            {displayName.charAt(0).toUpperCase()}
          </div>

          <div className="header-user-info">
            <span className="header-user-name">
              {displayName}
            </span>

            <span className="header-user-role">
              {user?.role ?? "Staff"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;