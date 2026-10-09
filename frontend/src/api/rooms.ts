import api from "./axios";
import type { Room } from "../types";

// Fetch all rooms
export const getRooms = async (): Promise<Room[]> => {
  const response = await api.get<Room[]>("/rooms/");
  return response.data;
};

// Fetch a room by its ID
export const getRoomById = async (id: number): Promise<Room> => {
  const response = await api.get<Room>(`/rooms/${id}`);
  return response.data;
};

// Create a new room
export const createRoom = async (
  roomData: Omit<Room, "id">
): Promise<Room> => {
  const response = await api.post<Room>("/rooms/", roomData);
  return response.data;
};

// Update an existing room
export const updateRoom = async (
  id: number,
  roomData: Partial<Omit<Room, "id">>
): Promise<Room> => {
  const response = await api.put<Room>(`/rooms/${id}`, roomData);
  return response.data;
};

// Delete a room
export const deleteRoom = async (id: number): Promise<void> => {
  await api.delete(`/rooms/${id}`);
};