import api from "./axios";
import type { Room } from "../types";

export interface RoomPayload {
  roomNumber: string;
  roomType: string;
  price: number;
  status: string;
}

// Fetch all rooms
export const getRooms = async (): Promise<Room[]> => {
  const response = await api.get<Room[]>("/api/rooms");
  return response.data;
};

// Fetch available rooms only
export const getAvailableRooms = async (): Promise<Room[]> => {
  const response = await api.get<Room[]>("/api/rooms/available");
  return response.data;
};

// Fetch a room by its ID
export const getRoomById = async (id: number): Promise<Room> => {
  const response = await api.get<Room>(`/api/rooms/${id}`);
  return response.data;
};

// Create a new room
export const createRoom = async (
  roomData: RoomPayload
): Promise<Room> => {
  const response = await api.post<Room>("/api/rooms", roomData);
  return response.data;
};

// Update an existing room
export const updateRoom = async (
  id: number,
  roomData: RoomPayload
): Promise<Room> => {
  const response = await api.put<Room>(`/api/rooms/${id}`, roomData);
  return response.data;
};

// Update room status
export const updateRoomStatus = async (
  id: number,
  status: string
): Promise<Room> => {
  const response = await api.put<Room>(`/api/rooms/${id}/status?status=${encodeURIComponent(status)}`);
  return response.data;
};

// Delete a room
export const deleteRoom = async (id: number): Promise<void> => {
  await api.delete(`/api/rooms/${id}`);
};