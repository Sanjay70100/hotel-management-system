import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Search, ShieldCheck } from "lucide-react";

import api from "../../api/axios";
import type { User } from "../../types";

import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";

import "./Staff.css";

const Staff = () => {
  const [staff, setStaff] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadStaff = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get<User[]>("/staff/");
      setStaff(response.data);
    } catch {
      setError(
        "Unable to load staff. Confirm that your backend provides GET /staff/ and that your account has permission."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStaff();
  }, [loadStaff]);

  const filteredStaff = staff.filter((person) => {
    const query = search.toLowerCase().trim();

    return (
      (person.username ?? "").toLowerCase().includes(query) ||
      (person.full_name ?? "").toLowerCase().includes(query) ||
      (person.email ?? "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="staff-page">
      <PageHeader
        title="Staff Management"
        description="View staff accounts and their assigned roles."
      />

      <section className="staff-content">
        <div className="staff-toolbar">
          <div className="staff-search">
            <Search size={17} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search staff..."
              aria-label="Search staff"
            />
          </div>

          <Button
            variant="outline"
            onClick={() => void loadStaff()}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </Button>
        </div>

        {error && (
          <ErrorMessage message={error} onRetry={() => void loadStaff()} />
        )}

        {loading ? (
          <LoadingSpinner message="Loading staff accounts..." />
        ) : filteredStaff.length === 0 ? (
          <EmptyState
            title="No staff accounts found"
            message={
              search
                ? "Try a different search term."
                : "Staff accounts will appear here when the backend returns them."
            }
          />
        ) : (
          <div className="staff-table-wrapper">
            <table className="staff-table">
              <thead>
                <tr>
                  <th>Staff Member</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Account Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredStaff.map((person) => (
                  <tr key={person.id}>
                    <td>
                      <div className="staff-person">
                        <span className="staff-avatar">
                          {(person.full_name || person.username || "S")
                            .charAt(0)
                            .toUpperCase()}
                        </span>

                        <span>
                          <strong>
                            {person.full_name || person.username}
                          </strong>
                          <small>User ID: {person.id}</small>
                        </span>
                      </div>
                    </td>

                    <td>{person.email || "—"}</td>
                    <td>{person.username}</td>

                    <td>
                      <span className="staff-role">
                        <ShieldCheck size={14} />
                        {person.role}
                      </span>
                    </td>

                    <td>
                      <StatusBadge
                        status={person.is_active === false ? "inactive" : "active"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Staff;