import { useState } from "react";
import { Settings as SettingsIcon, UserRound, Monitor, Check } from "lucide-react";

import { useAuthContext } from "../../context/AuthContext";

import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Alert from "../../components/common/Alert";
import Avatar from "../../components/common/Avatar";
import PageHeader from "../../components/common/PageHeader";

import "./Settings.css";

const Settings = () => {
  const { user } = useAuthContext();

  const [compactMode, setCompactMode] = useState(
    localStorage.getItem("hotel_compact_mode") === "true"
  );

  const [notice, setNotice] = useState("");

  const handleSavePreferences = () => {
    localStorage.setItem("hotel_compact_mode", String(compactMode));
    document.documentElement.dataset.compact = String(compactMode);
    setNotice("Your display preferences have been saved in this browser.");
  };

  return (
    <div className="settings-page">
      <PageHeader
        title="Settings"
        description="View your account information and customize your interface."
      />

      {notice && (
        <Alert
          type="success"
          message={notice}
          onClose={() => setNotice("")}
        />
      )}

      <Card
        title="Account Information"
        description="Information associated with your current login."
        className="settings-card"
      >
        <div className="settings-profile">
          <Avatar
            name={user?.full_name || user?.username || "User"}
            size="large"
          />

          <div className="settings-profile-details">
            <h3>{user?.full_name || user?.username || "User"}</h3>
            <p>{user?.email || "Email not available"}</p>

            <span className="settings-role">
              <UserRound size={14} />
              {user?.role || "User"}
            </span>
          </div>
        </div>

        <div className="settings-info-grid">
          <div>
            <span>Username</span>
            <strong>{user?.username || "Not available"}</strong>
          </div>

          <div>
            <span>Email</span>
            <strong>{user?.email || "Not available"}</strong>
          </div>

          <div>
            <span>Account Role</span>
            <strong className="settings-capitalize">
              {user?.role || "Not available"}
            </strong>
          </div>

          <div>
            <span>Account Status</span>
            <strong>{user?.is_active === false ? "Inactive" : "Active"}</strong>
          </div>
        </div>
      </Card>

      <Card
        title="Display Preferences"
        description="Customize how the application appears in this browser."
        className="settings-card"
      >
        <div className="settings-preference">
          <span className="settings-preference-icon">
            <Monitor size={20} />
          </span>

          <div className="settings-preference-content">
            <strong>Compact interface</strong>
            <p>Reduce spacing in supported areas of the application.</p>
          </div>

          <label className="settings-toggle">
            <input
              type="checkbox"
              checked={compactMode}
              onChange={(event) => setCompactMode(event.target.checked)}
            />
            <span className="settings-toggle-slider" />
            <span className="settings-sr-only">
              Enable compact interface
            </span>
          </label>
        </div>

        <div className="settings-save">
          <Button onClick={handleSavePreferences}>
            <Check size={16} />
            Save Preferences
          </Button>
        </div>
      </Card>

      <Card
        title="Application Information"
        description="Basic information about this hotel management interface."
        className="settings-card"
      >
        <div className="settings-app-info">
          <span className="settings-app-icon">
            <SettingsIcon size={22} />
          </span>

          <div>
            <strong>GrandStay Hotel Management</strong>
            <p>React and TypeScript frontend</p>
            <small>
              Backend connection: configured through VITE_API_BASE_URL
            </small>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;