import { useCallback, useEffect, useState } from "react";

import {
  getGuests,
  createGuest,
  updateGuest,
  deleteGuest,
} from "../api/guests";

import type { Guest } from "../types";

export const useGuests = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all guests
  const fetchGuests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getGuests();
      setGuests(data);
    } catch {
      setError("Failed to load guests. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch guests when the hook initializes
  useEffect(() => {
    void fetchGuests();
  }, [fetchGuests]);

  // Add a new guest
  const addGuest = async (guestData: Omit<Guest, "id">) => {
    setError(null);

    try {
      const newGuest = await createGuest(guestData);

      setGuests((previousGuests) => [
        ...previousGuests,
        newGuest,
      ]);

      return newGuest;
    } catch (err) {
      setError("Failed to register guest.");
      throw err;
    }
  };

  // Update an existing guest
  const editGuest = async (
    id: number,
    guestData: Partial<Omit<Guest, "id">>
  ) => {
    setError(null);

    try {
      const updatedGuest = await updateGuest(id, guestData);

      setGuests((previousGuests) =>
        previousGuests.map((guest) =>
          guest.id === id ? updatedGuest : guest
        )
      );

      return updatedGuest;
    } catch (err) {
      setError("Failed to update guest information.");
      throw err;
    }
  };

  // Delete a guest
  const removeGuest = async (id: number) => {
    setError(null);

    try {
      await deleteGuest(id);

      setGuests((previousGuests) =>
        previousGuests.filter((guest) => guest.id !== id)
      );
    } catch (err) {
      setError("Failed to delete guest.");
      throw err;
    }
  };

  return {
    guests,
    loading,
    error,
    fetchGuests,
    addGuest,
    editGuest,
    removeGuest,
  };
};