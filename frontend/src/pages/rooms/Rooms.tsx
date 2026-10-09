import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  BedDouble,
  RefreshCw,
} from "lucide-react";

import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../../api/rooms";

import type { Room } from "../../types";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import Select from "../../components/common/Select";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import PageHeader from "../../components/common/PageHeader";

import type { SelectOption } from "../../components/common/Select";

import "./Rooms.css";

type RoomForm = Omit<Room, "id">;

const emptyRoom: RoomForm = {
  room_number: "",
  room_type: "Standard",
  description: "",
  price_per_night: 0,
  capacity: 2,
  status: "available",
  image_url: "",
};

const roomTypeOptions: SelectOption[] = [
  { label: "Standard", value: "Standard" },
  { label: "Deluxe", value: "Deluxe" },
  { label: "Suite", value: "Suite" },
  { label: "Family", value: "Family" },
];

const roomStatusOptions: SelectOption[] = [
  { label: "Available", value: "available" },
  { label: "Occupied", value: "occupied" },
  { label: "Reserved", value: "reserved" },
  { label: "Maintenance", value: "maintenance" },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [form, setForm] = useState<RoomForm>(emptyRoom);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null);

  const loadRooms = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      setRooms(await getRooms());
    } catch {
      setError("Could not load rooms. Check your backend connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRooms();
  }, [loadRooms]);

  const filteredRooms = rooms.filter((room) => {
    const query = search.trim().toLowerCase();

    const roomNum = (room.room_number ?? room.roomNumber ?? "").toLowerCase();
    const roomType = (room.room_type ?? room.roomType ?? "").toLowerCase();
    const matchesSearch =
      roomNum.includes(query) ||
      roomType.includes(query) ||
      (room.description ?? "").toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "all" ||
      String(room.status).toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const openAddModal = () => {
    setEditingRoom(null);
    setForm(emptyRoom);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (room: Room) => {
    setEditingRoom(room);

    setForm({
      room_number: room.room_number,
      room_type: room.room_type,
      description: room.description ?? "",
      price_per_night: room.price_per_night,
      capacity: room.capacity,
      status: room.status,
      image_url: room.image_url ?? "",
    });

    setFormError("");
    setModalOpen(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (!form.room_number.trim()) {
      setFormError("Room number is required.");
      return;
    }

    if (form.price_per_night < 0 || form.capacity < 1) {
      setFormError("Enter a valid price and room capacity.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        room_number: form.room_number.trim(),
        description: form.description?.trim() || "",
        image_url: form.image_url?.trim() || "",
      };

      if (editingRoom) {
        await updateRoom(editingRoom.id, payload);
      } else {
        await createRoom(payload);
      }

      setModalOpen(false);
      await loadRooms();
    } catch {
      setFormError(
        "Unable to save this room. Verify the API endpoint and required backend fields."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingRoom) return;

    try {
      await deleteRoom(deletingRoom.id);
      setDeletingRoom(null);
      await loadRooms();
    } catch {
      setError("Unable to delete this room. It may be linked to a reservation.");
      setDeletingRoom(null);
    }
  };

  const statusOptions: SelectOption[] = [
    { label: "All statuses", value: "all" },
    ...roomStatusOptions,
  ];

  return (
    <div className="rooms-page">
      <PageHeader
        title="Rooms"
        description="Manage room details, rates, availability, and room status."
        actionLabel="Add Room"
        onAction={openAddModal}
      />

      <div className="rooms-summary">
        <div className="rooms-summary-item">
          <span>Total Rooms</span>
          <strong>{rooms.length}</strong>
        </div>
        <div className="rooms-summary-item">
          <span>Available</span>
          <strong>{rooms.filter((r) => String(r.status).toLowerCase() === "available").length}</strong>
        </div>
        <div className="rooms-summary-item">
          <span>Occupied</span>
          <strong>{rooms.filter((r) => String(r.status).toLowerCase() === "occupied").length}</strong>
        </div>
        <div className="rooms-summary-item">
          <span>Maintenance</span>
          <strong>{rooms.filter((r) => String(r.status).toLowerCase() === "maintenance").length}</strong>
        </div>
      </div>

      <section className="rooms-content">
        <div className="rooms-toolbar">
          <div className="rooms-search">
            <Search size={17} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search room number, type, or description..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search rooms"
            />
          </div>

          <div className="rooms-filter">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              aria-label="Filter rooms by status"
            />
          </div>

          <Button
            variant="outline"
            onClick={() => void loadRooms()}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </Button>
        </div>

        {error && (
          <ErrorMessage message={error} onRetry={() => void loadRooms()} />
        )}

        {loading ? (
          <LoadingSpinner message="Loading rooms..." />
        ) : filteredRooms.length === 0 ? (
          <EmptyState
            title={search || statusFilter !== "all" ? "No matching rooms" : "No rooms found"}
            message={
              search || statusFilter !== "all"
                ? "Try changing your search or filters."
                : "Add your first room to start managing room availability."
            }
            actionLabel="Add Room"
            onAction={openAddModal}
          />
        ) : (
          <div className="rooms-grid">
            {filteredRooms.map((room) => (
              <article className="room-card" key={room.id}>
                <div className="room-card-image">
                  {room.image_url ? (
                    <img src={room.image_url} alt={`Room ${room.room_number}`} />
                  ) : (
                    <div className="room-image-placeholder">
                      <BedDouble size={38} />
                      <span>Room {room.room_number}</span>
                    </div>
                  )}

                  <div className="room-card-status">
                    <StatusBadge status={room.status} />
                  </div>
                </div>

                <div className="room-card-body">
                  <div className="room-card-title">
                    <div>
                      <span className="room-number-label">
                        ROOM {room.room_number}
                      </span>
                      <h2>{room.room_type}</h2>
                    </div>

                    <div className="room-card-price">
                      <strong>{formatCurrency(room.price_per_night)}</strong>
                      <span>per night</span>
                    </div>
                  </div>

                  <p className="room-card-description">
                    {room.description || "No room description provided."}
                  </p>

                  <div className="room-card-meta">
                    <span>
                      Capacity: <strong>{room.capacity}</strong>
                    </span>
                  </div>

                  <div className="room-card-actions">
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => openEditModal(room)}
                    >
                      <Pencil size={14} />
                      Edit
                    </Button>

                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => setDeletingRoom(room)}
                    >
                      <Trash2 size={14} />
                      Delete
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <Modal
        isOpen={modalOpen}
        title={editingRoom ? "Edit Room" : "Add Room"}
        onClose={() => setModalOpen(false)}
        size="medium"
      >
        <form className="room-form" onSubmit={handleSubmit}>
          {formError && (
            <div className="room-form-error" role="alert">
              {formError}
            </div>
          )}

          <Input
            label="Room Number"
            name="room_number"
            value={form.room_number}
            onChange={(event) =>
              setForm({ ...form, room_number: event.target.value })
            }
            placeholder="e.g. 101"
            required
          />

          <Select
            label="Room Type"
            options={roomTypeOptions}
            value={form.room_type}
            onChange={(value) => setForm({ ...form, room_type: value })}
          />

          <Textarea
            label="Description"
            name="description"
            value={form.description ?? ""}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
            placeholder="Describe the room..."
          />

          <div className="room-form-row">
            <Input
              label="Price per Night (₹)"
              name="price_per_night"
              type="number"
              min="0"
              value={String(form.price_per_night)}
              onChange={(event) =>
                setForm({
                  ...form,
                  price_per_night: Number(event.target.value),
                })
              }
              required
            />

            <Input
              label="Capacity"
              name="capacity"
              type="number"
              min="1"
              value={String(form.capacity)}
              onChange={(event) =>
                setForm({
                  ...form,
                  capacity: Number(event.target.value),
                })
              }
              required
            />
          </div>

          <Select
            label="Status"
            options={roomStatusOptions}
            value={form.status}
            onChange={(value) =>
              setForm({
                ...form,
                status: value as Room["status"],
              })
            }
          />

          <Input
            label="Image URL (optional)"
            name="image_url"
            type="url"
            value={form.image_url ?? ""}
            onChange={(event) =>
              setForm({ ...form, image_url: event.target.value })
            }
            placeholder="https://example.com/room.jpg"
          />

          <div className="room-form-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" loading={saving}>
              {editingRoom ? "Save Changes" : "Create Room"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingRoom)}
        title="Delete Room"
        message={`Are you sure you want to delete room ${deletingRoom?.room_number ?? ""}? This action cannot be undone.`}
        confirmText="Delete Room"
        isDangerous
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeletingRoom(null)}
      />
    </div>
  );
};

export default Rooms;