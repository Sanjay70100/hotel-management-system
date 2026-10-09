import api from "./axios";
import type { Reservation } from "../types";

// Fetch all reservations
export const getReservations = async (): Promise<Reservation[]> => {
  const response = await api.get<Reservation[]>("/reservations/");
  return response.data;
};

// Fetch a reservation by ID
export const getReservationById = async (
  id: number
): Promise<Reservation> => {
  const response = await api.get<Reservation>(`/reservations/${id}`);
  return response.data;
};

// Create a new reservation
export const createReservation = async (
  reservationData: Omit<Reservation, "id" | "guest" | "room">
): Promise<Reservation> => {
  const response = await api.post<Reservation>(
    "/reservations/",
    reservationData
  );

  return response.data;
};

// Update an existing reservation
export const updateReservation = async (
  id: number,
  reservationData: Partial<
    Omit<Reservation, "id" | "guest" | "room">
  >
): Promise<Reservation> => {
  const response = await api.put<Reservation>(
    `/reservations/${id}`,
    reservationData
  );

  return response.data;
};

// Cancel a reservation
export const cancelReservation = async (
  id: number
): Promise<Reservation> => {
  const response = await api.patch<Reservation>(
    `/reservations/${id}/cancel`
  );

  return response.data;
};

// Delete a reservation
export const deleteReservation = async (id: number): Promise<void> => {
  await api.delete(`/reservations/${id}`);
};