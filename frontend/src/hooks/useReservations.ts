import { useCallback, useEffect, useState } from "react";

import {
  getReservations,
  createReservation,
  updateReservation,
  cancelReservation,
  deleteReservation,
} from "../api/reservations";

import type { Reservation } from "../types";

export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all reservations
  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getReservations();
      setReservations(data);
    } catch {
      setError("Failed to load reservations. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch reservations when the hook initializes
  useEffect(() => {
    void fetchReservations();
  }, [fetchReservations]);

  // Create a new reservation
  const addReservation = async (
    reservationData: Omit<Reservation, "id" | "guest" | "room">
  ) => {
    setError(null);

    try {
      const newReservation = await createReservation(reservationData);

      setReservations((previousReservations) => [
        ...previousReservations,
        newReservation,
      ]);

      return newReservation;
    } catch (err) {
      setError("Failed to create reservation.");
      throw err;
    }
  };

  // Update an existing reservation
  const editReservation = async (
    id: number,
    reservationData: Partial<
      Omit<Reservation, "id" | "guest" | "room">
    >
  ) => {
    setError(null);

    try {
      const updatedReservation = await updateReservation(
        id,
        reservationData
      );

      setReservations((previousReservations) =>
        previousReservations.map((reservation) =>
          reservation.id === id ? updatedReservation : reservation
        )
      );

      return updatedReservation;
    } catch (err) {
      setError("Failed to update reservation.");
      throw err;
    }
  };

  // Cancel a reservation
  const cancelBooking = async (id: number) => {
    setError(null);

    try {
      const cancelledReservation = await cancelReservation(id);

      setReservations((previousReservations) =>
        previousReservations.map((reservation) =>
          reservation.id === id
            ? cancelledReservation
            : reservation
        )
      );

      return cancelledReservation;
    } catch (err) {
      setError("Failed to cancel reservation.");
      throw err;
    }
  };

  // Delete a reservation
  const removeReservation = async (id: number) => {
    setError(null);

    try {
      await deleteReservation(id);

      setReservations((previousReservations) =>
        previousReservations.filter(
          (reservation) => reservation.id !== id
        )
      );
    } catch (err) {
      setError("Failed to delete reservation.");
      throw err;
    }
  };

  return {
    reservations,
    loading,
    error,
    fetchReservations,
    addReservation,
    editReservation,
    cancelBooking,
    removeReservation,
  };
};