import { useCallback, useEffect, useState } from "react";
import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../api/rooms";

import type { Room } from "../types";

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all rooms
  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getRooms();
      setRooms(data);
    } catch {
      setError("Failed to load rooms. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch rooms when the hook initializes
  useEffect(() => {
    void fetchRooms();
  }, [fetchRooms]);

  // Add a new room
  const addRoom = async (roomData: Omit<Room, "id">) => {
    setError(null);

    try {
      const newRoom = await createRoom(roomData);

      setRooms((previousRooms) => [...previousRooms, newRoom]);

      return newRoom;
    } catch (err) {
      setError("Failed to create room.");
      throw err;
    }
  };

  // Update an existing room
  const editRoom = async (
    id: number,
    roomData: Partial<Omit<Room, "id">>
  ) => {
    setError(null);

    try {
      const updatedRoom = await updateRoom(id, roomData);

      setRooms((previousRooms) =>
        previousRooms.map((room) =>
          room.id === id ? updatedRoom : room
        )
      );

      return updatedRoom;
    } catch (err) {
      setError("Failed to update room.");
      throw err;
    }
  };

  // Delete a room
  const removeRoom = async (id: number) => {
    setError(null);

    try {
      await deleteRoom(id);

      setRooms((previousRooms) =>
        previousRooms.filter((room) => room.id !== id)
      );
    } catch (err) {
      setError("Failed to delete room.");
      throw err;
    }
  };

  return {
    rooms,
    loading,
    error,
    fetchRooms,
    addRoom,
    editRoom,
    removeRoom,
  };
};