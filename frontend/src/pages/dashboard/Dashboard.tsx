import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BedDouble,
  Users,
  CalendarCheck,
  IndianRupee,
  Plus,
  ArrowRight,
  RefreshCw,
  CalendarDays,
} from "lucide-react";

import { getReservations } from "../../api/reservations";
import { useDashboard } from "../../hooks/useDashboard";

import type { Reservation } from "../../types";

import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

import "./Dashboard.css";

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const Dashboard = () => {
  const { stats, loading, error, fetchStats } = useDashboard();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reservationsLoading, setReservationsLoading] = useState(true);
  const [reservationsError, setReservationsError] = useState("");

  const loadReservations = async () => {
    setReservationsLoading(true);
    setReservationsError("");

    try {
      const data = await getReservations();

      const sortedReservations = [...data].sort(
        (a, b) =>
          new Date(b.check_in).getTime() -
          new Date(a.check_in).getTime()
      );

      setReservations(sortedReservations.slice(0, 5));
    } catch {
      setReservationsError("Unable to load recent reservations.");
    } finally {
      setReservationsLoading(false);
    }
  };

  useEffect(() => {
    void loadReservations();
  }, []);

  const handleRefresh = () => {
    void fetchStats();
    void loadReservations();
  };

  if (loading && !stats) {
    return (
      <div className="dashboard-loading">
        <LoadingSpinner message="Loading hotel dashboard..." />
      </div>
    );
  }

  const availableRooms = stats?.available_rooms ?? stats?.availableRooms ?? 0;
  const totalRooms = stats?.total_rooms ?? stats?.totalRooms ?? 0;
  const totalGuests = stats?.total_guests ?? stats?.totalGuests ?? 0;
  const totalReservations = stats?.total_reservations ?? stats?.totalBookings ?? 0;
  const totalRevenue = stats?.total_revenue ?? stats?.totalRevenue ?? 0;

  const occupancyRate =
    totalRooms > 0
      ? Math.round(
          ((totalRooms - availableRooms) / totalRooms) * 100
        )
      : 0;

  return (
    <div className="dashboard-page">
      <header className="dashboard-welcome">
        <div>
          <span className="dashboard-eyebrow">
            HOTEL MANAGEMENT
          </span>

          <h1>Dashboard</h1>

          <p>
            Welcome back! Here is an overview of your hotel's
            current performance.
          </p>
        </div>

        <div className="dashboard-header-actions">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading || reservationsLoading}
          >
            <RefreshCw size={16} />
            Refresh
          </Button>

          <Link
            to="/reservations"
            className="dashboard-primary-link"
          >
            <Plus size={17} />
            New Reservation
          </Link>
        </div>
      </header>

      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => void fetchStats()}
        />
      )}

      {stats && (
        <>
          <section
            className="dashboard-stats-grid"
            aria-label="Hotel statistics"
          >
            <StatCard
              title="Total Rooms"
              value={totalRooms}
              description="Rooms registered"
              icon={<BedDouble size={22} />}
              color="blue"
            />

            <StatCard
              title="Available Rooms"
              value={availableRooms}
              description="Ready for guests"
              icon={<BedDouble size={22} />}
              color="green"
            />

            <StatCard
              title="Total Guests"
              value={totalGuests}
              description="Registered guests"
              icon={<Users size={22} />}
              color="purple"
            />

            <StatCard
              title="Reservations"
              value={totalReservations}
              description="All reservations"
              icon={<CalendarCheck size={22} />}
              color="orange"
            />

            <StatCard
              title="Total Revenue"
              value={formatCurrency(totalRevenue)}
              description="Reported revenue"
              icon={<IndianRupee size={22} />}
              color="green"
            />
          </section>

          <section className="dashboard-overview-grid">
            <article className="dashboard-panel occupancy-panel">
              <div className="dashboard-panel-heading">
                <div>
                  <h2>Room Occupancy</h2>
                  <p>Current room availability overview</p>
                </div>

                <span className="dashboard-panel-icon">
                  <BedDouble size={20} />
                </span>
              </div>

              <div className="occupancy-content">
                <div
                  className="occupancy-circle"
                  role="img"
                  aria-label={`${occupancyRate}% occupancy`}
                >
                  <div className="occupancy-circle-inner">
                    <strong>{occupancyRate}%</strong>
                    <span>Occupancy</span>
                  </div>
                </div>

                <div className="occupancy-details">
                  <div className="occupancy-detail-row">
                    <span className="occupancy-dot occupied-dot" />
                    <span>Occupied or unavailable</span>
                    <strong>
                      {Math.max(totalRooms - availableRooms, 0)}
                    </strong>
                  </div>

                  <div className="occupancy-detail-row">
                    <span className="occupancy-dot available-dot" />
                    <span>Available rooms</span>
                    <strong>{availableRooms}</strong>
                  </div>

                  <div className="occupancy-detail-row occupancy-total">
                    <span>Total rooms</span>
                    <strong>{totalRooms}</strong>
                  </div>
                </div>
              </div>

              <Link to="/rooms" className="dashboard-text-link">
                View all rooms <ArrowRight size={16} />
              </Link>
            </article>

            <article className="dashboard-panel quick-actions-panel">
              <div className="dashboard-panel-heading">
                <div>
                  <h2>Quick Actions</h2>
                  <p>Common hotel management tasks</p>
                </div>
              </div>

              <div className="dashboard-quick-actions">
                <Link
                  to="/reservations"
                  className="dashboard-action-item"
                >
                  <span className="dashboard-action-icon action-blue">
                    <CalendarDays size={21} />
                  </span>

                  <span>
                    <strong>Manage Reservations</strong>
                    <small>View and update bookings</small>
                  </span>

                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/guests"
                  className="dashboard-action-item"
                >
                  <span className="dashboard-action-icon action-purple">
                    <Users size={21} />
                  </span>

                  <span>
                    <strong>Manage Guests</strong>
                    <small>View guest information</small>
                  </span>

                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/rooms"
                  className="dashboard-action-item"
                >
                  <span className="dashboard-action-icon action-green">
                    <BedDouble size={21} />
                  </span>

                  <span>
                    <strong>Manage Rooms</strong>
                    <small>Update room details</small>
                  </span>

                  <ArrowRight size={17} />
                </Link>
              </div>
            </article>
          </section>

          <section className="dashboard-panel recent-reservations-panel">
            <div className="dashboard-panel-heading">
              <div>
                <h2>Recent Reservations</h2>
                <p>Latest bookings recorded in the system</p>
              </div>

              <Link
                to="/reservations"
                className="dashboard-text-link"
              >
                View all <ArrowRight size={16} />
              </Link>
            </div>

            {reservationsLoading ? (
              <LoadingSpinner message="Loading reservations..." />
            ) : reservationsError ? (
              <ErrorMessage
                message={reservationsError}
                onRetry={() => void loadReservations()}
              />
            ) : reservations.length === 0 ? (
              <EmptyState
                title="No reservations yet"
                message="Reservations will appear here when bookings are created."
                actionLabel="View reservations"
                onAction={() => {
                  window.location.href = "/reservations";
                }}
              />
            ) : (
              <div className="dashboard-table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Reservation</th>
                      <th>Guest</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {reservations.map((reservation) => (
                      <tr key={reservation.id}>
                        <td>
                          <span className="reservation-reference">
                            #{reservation.id}
                          </span>
                        </td>

                        <td>
                          <div className="reservation-guest">
                            <span className="reservation-guest-avatar">
                              {(
                                reservation.guest?.full_name || "G"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </span>

                            <span>
                              {reservation.guest?.full_name ||
                                `Guest #${reservation.guest_id}`}
                            </span>
                          </div>
                        </td>

                        <td>{formatDate(reservation.check_in)}</td>

                        <td>{formatDate(reservation.check_out)}</td>

                        <td className="reservation-amount">
                          {formatCurrency(reservation.total_amount)}
                        </td>

                        <td>
                          <StatusBadge
                            status={reservation.status}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;