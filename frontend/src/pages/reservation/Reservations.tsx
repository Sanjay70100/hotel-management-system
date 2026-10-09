import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  Plus,
  Search,
  CalendarDays,
  RefreshCw,
  XCircle,
} from "lucide-react";

import {
  getReservations,
  createReservation,
  cancelReservation,
} from "../../api/reservations";

import { getGuests } from "../../api/guests";
import { getRooms } from "../../api/rooms";

import type { Reservation, Guest, Room } from "../../types";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import PageHeader from "../../components/common/PageHeader";

import type { SelectOption } from "../../components/common/Select";

import "./Reservations.css";

type ReservationForm = {
  guest_id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  number_of_guests: number;
};

const today = new Date().toISOString().slice(0, 10);

const emptyForm: ReservationForm = {
  guest_id: "",
  room_id: "",
  check_in: today,
  check_out: "",
  number_of_guests: 1,
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<ReservationForm>(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [cancellingReservation, setCancellingReservation] =
    useState<Reservation | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [reservationData, guestData, roomData] = await Promise.all([
        getReservations(),
        getGuests(),
        getRooms(),
      ]);

      setReservations(reservationData);
      setGuests(guestData);
      setRooms(roomData);
    } catch {
      setError(
        "Could not load reservation data. Check your backend connection and API endpoints."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const guestOptions: SelectOption[] = guests.map((guest) => ({
    label: `${guest.full_name || guest.name || "Guest"} — ${guest.phone || ""}`,
    value: String(guest.id),
  }));

  const roomOptions: SelectOption[] = rooms
    .filter((room) => String(room.status).toLowerCase() === "available")
    .map((room) => ({
      label: `Room ${room.room_number ?? room.roomNumber ?? ""} — ${room.room_type ?? room.roomType ?? ""} — ${formatCurrency(room.price_per_night ?? room.price ?? 0)}/night`,
      value: String(room.id),
    }));

  const statusOptions: SelectOption[] = [
    { label: "All statuses", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Checked in", value: "checked_in" },
    { label: "Checked out", value: "checked_out" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const filteredReservations = reservations.filter((reservation) => {
    const guest = guests.find((item) => item.id === reservation.guest_id);
    const room = rooms.find((item) => item.id === reservation.room_id);

    const query = search.trim().toLowerCase();

    const matchesSearch =
      String(reservation.id).includes(query) ||
      (guest?.full_name ?? guest?.name ?? "").toLowerCase().includes(query) ||
      (room?.room_number ?? room?.roomNumber ?? "").toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "all" ||
      String(reservation.status).toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const openCreateModal = () => {
    setForm({
      ...emptyForm,
      check_in: today,
      check_out: "",
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (!form.guest_id || !form.room_id) {
      setFormError("Select a guest and an available room.");
      return;
    }

    if (!form.check_in || !form.check_out) {
      setFormError("Both check-in and check-out dates are required.");
      return;
    }

    if (form.check_out <= form.check_in) {
      setFormError("Check-out must be after check-in.");
      return;
    }

    if (form.number_of_guests < 1) {
      setFormError("At least one guest is required.");
      return;
    }

    const selectedRoom = rooms.find(
      (room) => room.id === Number(form.room_id)
    );

    if (
      selectedRoom &&
      form.number_of_guests > selectedRoom.capacity
    ) {
      setFormError(
        `This room has a maximum capacity of ${selectedRoom.capacity}.`
      );
      return;
    }

    if (!selectedRoom) {
      setFormError("The selected room could not be found.");
      return;
    }

    const nights = Math.ceil(
      (new Date(`${form.check_out}T00:00:00`).getTime() -
        new Date(`${form.check_in}T00:00:00`).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const totalAmount = nights * selectedRoom.price_per_night;

    setSaving(true);

    try {
      await createReservation({
        guest_id: Number(form.guest_id),
        room_id: Number(form.room_id),
        check_in: form.check_in,
        check_out: form.check_out,
        number_of_guests: form.number_of_guests,
        total_price: totalAmount,
        total_amount: totalAmount,
        status: "pending",
      });

      setModalOpen(false);
      await loadData();
    } catch {
      setFormError(
        "Unable to create the reservation. The room may no longer be available, or the backend may require different fields."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancelReservation = async () => {
    if (!cancellingReservation) return;

    try {
      await cancelReservation(cancellingReservation.id);
      setCancellingReservation(null);
      await loadData();
    } catch {
      setError(
        "Unable to cancel this reservation. Confirm that the cancellation endpoint exists in your backend."
      );
      setCancellingReservation(null);
    }
  };

  return (
    <div className="reservations-page">
      <PageHeader
        title="Reservations"
        description="Create bookings and manage guest reservation records."
        actionLabel="New Reservation"
        onAction={openCreateModal}
      />

      <div className="reservation-summary-grid">
        <div className="reservation-summary-card">
          <span>Total</span>
          <strong>{reservations.length}</strong>
        </div>

        <div className="reservation-summary-card">
          <span>Pending</span>
          <strong>
            {reservations.filter((r) => r.status === "pending").length}
          </strong>
        </div>

        <div className="reservation-summary-card">
          <span>Confirmed</span>
          <strong>
            {reservations.filter((r) => r.status === "confirmed").length}
          </strong>
        </div>

        <div className="reservation-summary-card">
          <span>Checked In</span>
          <strong>
            {reservations.filter((r) => r.status === "checked_in").length}
          </strong>
        </div>
      </div>

      <section className="reservations-content">
        <div className="reservations-toolbar">
          <div className="reservations-search">
            <Search size={17} aria-hidden="true" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search reservation, guest, or room..."
              aria-label="Search reservations"
            />
          </div>

          <div className="reservations-filter">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              aria-label="Filter reservations by status"
            />
          </div>

          <Button
            variant="outline"
            onClick={() => void loadData()}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </Button>
        </div>

        {error && (
          <ErrorMessage message={error} onRetry={() => void loadData()} />
        )}

        {loading ? (
          <LoadingSpinner message="Loading reservations..." />
        ) : filteredReservations.length === 0 ? (
          <EmptyState
            title="No reservations found"
            message={
              search || statusFilter !== "all"
                ? "Try changing the search term or status filter."
                : "Create a reservation to get started."
            }
            actionLabel="New Reservation"
            onAction={openCreateModal}
          />
        ) : (
          <div className="reservations-table-wrapper">
            <table className="reservations-table">
              <thead>
                <tr>
                  <th>Booking</th>
                  <th>Guest</th>
                  <th>Room</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Guests</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredReservations.map((reservation) => {
                  const guest = guests.find(
                    (item) => item.id === reservation.guest_id
                  );

                  const room = rooms.find(
                    (item) => item.id === reservation.room_id
                  );

                  const canCancel = [
                    "pending",
                    "confirmed",
                  ].includes(reservation.status);

                  return (
                    <tr key={reservation.id}>
                      <td>
                        <span className="reservation-id">
                          #{reservation.id}
                        </span>
                      </td>

                      <td>
                        <strong className="reservation-guest-name">
                          {guest?.full_name ??
                            reservation.guest?.full_name ??
                            `Guest #${reservation.guest_id}`}
                        </strong>
                      </td>

                      <td>
                        {room
                          ? `Room ${room.room_number}`
                          : reservation.room?.room_number ??
                            `Room #${reservation.room_id}`}
                      </td>

                      <td>{formatDate(reservation.check_in)}</td>
                      <td>{formatDate(reservation.check_out)}</td>
                      <td>{reservation.number_of_guests}</td>

                      <td className="reservation-table-amount">
                        {formatCurrency(reservation.total_amount)}
                      </td>

                      <td>
                        <StatusBadge status={reservation.status} />
                      </td>

                      <td>
                        {canCancel ? (
                          <button
                            type="button"
                            className="reservation-cancel-button"
                            onClick={() =>
                              setCancellingReservation(reservation)
                            }
                            aria-label={`Cancel reservation ${reservation.id}`}
                          >
                            <XCircle size={15} />
                            Cancel
                          </button>
                        ) : (
                          <span className="reservation-no-action">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Modal
        isOpen={modalOpen}
        title="Create Reservation"
        onClose={() => setModalOpen(false)}
        size="medium"
      >
        <form className="reservation-form" onSubmit={handleCreate}>
          {formError && (
            <div className="reservation-form-error" role="alert">
              {formError}
            </div>
          )}

          <Select
            label="Guest"
            options={guestOptions}
            value={form.guest_id}
            onChange={(value) => setForm({ ...form, guest_id: value })}
            placeholder="Select a guest"
          />

          <Select
            label="Available Room"
            options={roomOptions}
            value={form.room_id}
            onChange={(value) => setForm({ ...form, room_id: value })}
            placeholder="Select a room"
          />

          {guests.length === 0 && (
            <p className="reservation-form-hint">
              No guests are registered. Add a guest before creating a booking.
            </p>
          )}

          {roomOptions.length === 0 && (
            <p className="reservation-form-hint">
              There are no rooms marked as available.
            </p>
          )}

          <div className="reservation-date-grid">
            <Input
              label="Check-in Date"
              name="check_in"
              type="date"
              min={today}
              value={form.check_in}
              onChange={(event) =>
                setForm({ ...form, check_in: event.target.value })
              }
              required
            />

            <Input
              label="Check-out Date"
              name="check_out"
              type="date"
              min={form.check_in || today}
              value={form.check_out}
              onChange={(event) =>
                setForm({ ...form, check_out: event.target.value })
              }
              required
            />
          </div>

          <Input
            label="Number of Guests"
            name="number_of_guests"
            type="number"
            min="1"
            value={String(form.number_of_guests)}
            onChange={(event) =>
              setForm({
                ...form,
                number_of_guests: Number(event.target.value),
              })
            }
            required
          />

          {form.room_id && form.check_in && form.check_out &&
            form.check_out > form.check_in && (
              <div className="reservation-price-preview">
                <CalendarDays size={18} />
                <span>Estimated total</span>
                <strong>
                  {formatCurrency(
                    (Math.ceil(
                      (new Date(`${form.check_out}T00:00:00`).getTime() -
                        new Date(`${form.check_in}T00:00:00`).getTime()) /
                        86400000
                    ) || 0) *
                      (rooms.find((r) => r.id === Number(form.room_id))
                        ?.price_per_night ?? 0)
                  )}
                </strong>
              </div>
            )}

          <div className="reservation-form-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={saving}
              disabled={guests.length === 0 || roomOptions.length === 0}
            >
              Create Booking
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(cancellingReservation)}
        title="Cancel Reservation"
        message={`Cancel reservation #${cancellingReservation?.id ?? ""}?`}
        confirmText="Cancel Reservation"
        isDangerous
        onConfirm={() => void handleCancelReservation()}
        onCancel={() => setCancellingReservation(null)}
      />
    </div>
  );
};

export default Reservations;