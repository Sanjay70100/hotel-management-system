import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Users,
  Mail,
  Phone,
  RefreshCw,
} from "lucide-react";

import {
  getGuests,
  createGuest,
  updateGuest,
  deleteGuest,
} from "../../api/guests";

import type { Guest } from "../../types";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import PageHeader from "../../components/common/PageHeader";

import "./Guests.css";

type GuestForm = Omit<Guest, "id">;

const emptyGuest: GuestForm = {
  full_name: "",
  email: "",
  phone: "",
  address: "",
  id_proof: "",
};

const Guests = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [form, setForm] = useState<GuestForm>(emptyGuest);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingGuest, setDeletingGuest] = useState<Guest | null>(null);

  const loadGuests = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      setGuests(await getGuests());
    } catch {
      setError("Could not load guests. Check your backend connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadGuests();
  }, [loadGuests]);

  const filteredGuests = guests.filter((guest) => {
    const query = search.trim().toLowerCase();

    return (
      guest.full_name.toLowerCase().includes(query) ||
      guest.email.toLowerCase().includes(query) ||
      guest.phone.toLowerCase().includes(query)
    );
  });

  const openAddModal = () => {
    setEditingGuest(null);
    setForm(emptyGuest);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (guest: Guest) => {
    setEditingGuest(guest);

    setForm({
      full_name: guest.full_name,
      email: guest.email,
      phone: guest.phone,
      address: guest.address ?? "",
      id_proof: guest.id_proof ?? "",
    });

    setFormError("");
    setModalOpen(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (!form.full_name.trim()) {
      setFormError("Guest name is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setFormError("Enter a valid email address.");
      return;
    }

    if (!form.phone.trim()) {
      setFormError("Phone number is required.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address?.trim() || "",
        id_proof: form.id_proof?.trim() || "",
      };

      if (editingGuest) {
        await updateGuest(editingGuest.id, payload);
      } else {
        await createGuest(payload);
      }

      setModalOpen(false);
      await loadGuests();
    } catch {
      setFormError(
        "Unable to save this guest. Check the API endpoint and required backend fields."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingGuest) return;

    try {
      await deleteGuest(deletingGuest.id);
      setDeletingGuest(null);
      await loadGuests();
    } catch {
      setError(
        "Unable to delete this guest. The guest may be linked to existing reservations."
      );
      setDeletingGuest(null);
    }
  };

  return (
    <div className="guests-page">
      <PageHeader
        title="Guests"
        description="Manage guest profiles and contact information."
        actionLabel="Add Guest"
        onAction={openAddModal}
      />

      <section className="guests-content">
        <div className="guests-toolbar">
          <div className="guests-search">
            <Search size={17} aria-hidden="true" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email, or phone..."
              aria-label="Search guests"
            />
          </div>

          <span className="guests-count">
            <Users size={16} />
            {filteredGuests.length} guest
            {filteredGuests.length === 1 ? "" : "s"}
          </span>

          <Button
            variant="outline"
            onClick={() => void loadGuests()}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </Button>
        </div>

        {error && (
          <ErrorMessage message={error} onRetry={() => void loadGuests()} />
        )}

        {loading ? (
          <LoadingSpinner message="Loading guests..." />
        ) : filteredGuests.length === 0 ? (
          <EmptyState
            title={search ? "No matching guests" : "No guests registered"}
            message={
              search
                ? "Try another search term."
                : "Add your first guest to begin managing guest records."
            }
            actionLabel="Add Guest"
            onAction={openAddModal}
          />
        ) : (
          <div className="guests-table-wrapper">
            <table className="guests-table">
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Contact Information</th>
                  <th>Address</th>
                  <th>ID Proof</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredGuests.map((guest) => (
                  <tr key={guest.id}>
                    <td>
                      <div className="guest-name-cell">
                        <span className="guest-avatar">
                          {guest.full_name.charAt(0).toUpperCase()}
                        </span>

                        <span>
                          <strong>{guest.full_name}</strong>
                          <small>Guest #{guest.id}</small>
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="guest-contact-cell">
                        <span>
                          <Mail size={14} />
                          {guest.email}
                        </span>

                        <span>
                          <Phone size={14} />
                          {guest.phone}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="guest-address">
                        {guest.address || "Not provided"}
                      </span>
                    </td>

                    <td>{guest.id_proof || "Not provided"}</td>

                    <td>
                      <div className="guest-row-actions">
                        <button
                          type="button"
                          className="guest-icon-button"
                          onClick={() => openEditModal(guest)}
                          aria-label={`Edit ${guest.full_name}`}
                          title="Edit guest"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          className="guest-icon-button guest-delete-button"
                          onClick={() => setDeletingGuest(guest)}
                          aria-label={`Delete ${guest.full_name}`}
                          title="Delete guest"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Modal
        isOpen={modalOpen}
        title={editingGuest ? "Edit Guest" : "Add Guest"}
        onClose={() => setModalOpen(false)}
        size="medium"
      >
        <form className="guest-form" onSubmit={handleSubmit}>
          {formError && (
            <div className="guest-form-error" role="alert">
              {formError}
            </div>
          )}

          <Input
            label="Full Name"
            name="full_name"
            value={form.full_name}
            onChange={(event) =>
              setForm({ ...form, full_name: event.target.value })
            }
            placeholder="Enter full name"
            required
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
            placeholder="guest@example.com"
            required
          />

          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={(event) =>
              setForm({ ...form, phone: event.target.value })
            }
            placeholder="Enter phone number"
            required
          />

          <Textarea
            label="Address"
            name="address"
            value={form.address ?? ""}
            onChange={(event) =>
              setForm({ ...form, address: event.target.value })
            }
            placeholder="Enter guest address"
          />

          <Input
            label="ID Proof (optional)"
            name="id_proof"
            value={form.id_proof ?? ""}
            onChange={(event) =>
              setForm({ ...form, id_proof: event.target.value })
            }
            placeholder="e.g. Passport or ID reference"
          />

          <div className="guest-form-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" loading={saving}>
              {editingGuest ? "Save Changes" : "Create Guest"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingGuest)}
        title="Delete Guest"
        message={`Are you sure you want to delete ${deletingGuest?.full_name ?? "this guest"}?`}
        confirmText="Delete Guest"
        isDangerous
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeletingGuest(null)}
      />
    </div>
  );
};

export default Guests;