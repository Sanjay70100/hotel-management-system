import api from "./axios";
import type { Guest } from "../types";

// Fetch all guests
export const getGuests = async (): Promise<Guest[]> => {
  const response = await api.get<Guest[]>("/guests/");
  return response.data;
};

// Fetch a guest by ID
export const getGuestById = async (id: number): Promise<Guest> => {
  const response = await api.get<Guest>(`/guests/${id}`);
  return response.data;
};

// Register a new guest
export const createGuest = async (
  guestData: Omit<Guest, "id">
): Promise<Guest> => {
  const response = await api.post<Guest>("/guests/", guestData);
  return response.data;
};

// Update guest information
export const updateGuest = async (
  id: number,
  guestData: Partial<Omit<Guest, "id">>
): Promise<Guest> => {
  const response = await api.put<Guest>(
    `/guests/${id}`,
    guestData
  );

  return response.data;
};

// Delete a guest
export const deleteGuest = async (id: number): Promise<void> => {
  await api.delete(`/guests/${id}`);
};