import api from "./axios";
import type { Booking } from "../types";

export interface BookingPayload {
  guestId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  status: string;
}

// Fetch all bookings
export const getBookings = async (): Promise<Booking[]> => {
  const response = await api.get<Booking[]>("/api/bookings");
  return response.data;
};

// Alias for reservations
export const getReservations = getBookings;

// Fetch a booking by ID
export const getBookingById = async (id: number): Promise<Booking> => {
  const response = await api.get<Booking>(`/api/bookings/${id}`);
  return response.data;
};

// Fetch bookings by guest
export const getBookingsByGuest = async (guestId: number): Promise<Booking[]> => {
  const response = await api.get<Booking[]>(`/api/bookings/guest/${guestId}`);
  return response.data;
};

// Fetch bookings by status
export const getBookingsByStatus = async (status: string): Promise<Booking[]> => {
  const response = await api.get<Booking[]>(`/api/bookings/status/${encodeURIComponent(status)}`);
  return response.data;
};

// Create a new booking
export const createBooking = async (
  bookingData: BookingPayload
): Promise<Booking> => {
  const response = await api.post<Booking>(
    "/api/bookings",
    bookingData
  );
  return response.data;
};

export const createReservation = createBooking;

// Update an existing booking
export const updateBooking = async (
  id: number,
  bookingData: BookingPayload
): Promise<Booking> => {
  const response = await api.put<Booking>(
    `/api/bookings/${id}`,
    bookingData
  );
  return response.data;
};

export const updateReservation = updateBooking;

// Cancel a booking
export const cancelBooking = async (id: number): Promise<string> => {
  const response = await api.delete<string>(`/api/bookings/${id}`);
  return response.data;
};

export const cancelReservation = cancelBooking;