import api from "./axios";
import type { Guest } from "../types";

export interface GuestPayload {
  name: string;
  email: string;
  phone: string;
  address: string;
}

// Fetch all guests
export const getGuests = async (): Promise<Guest[]> => {
  const response = await api.get<Guest[]>("/api/guests");
  return response.data;
};

// Fetch a guest by ID
export const getGuestById = async (id: number): Promise<Guest> => {
  const response = await api.get<Guest>(`/api/guests/${id}`);
  return response.data;
};

// Register a new guest
export const createGuest = async (
  guestData: GuestPayload
): Promise<Guest> => {
  const response = await api.post<Guest>("/api/guests", guestData);
  return response.data;
};

// Update guest information
export const updateGuest = async (
  id: number,
  guestData: GuestPayload
): Promise<Guest> => {
  const response = await api.put<Guest>(
    `/api/guests/${id}`,
    guestData
  );
  return response.data;
};

// Delete a guest
export const deleteGuest = async (id: number): Promise<void> => {
  await api.delete(`/api/guests/${id}`);
};