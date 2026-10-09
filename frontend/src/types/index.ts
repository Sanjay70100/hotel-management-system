// ==========================================
// Authentication
// ==========================================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  accessToken?: string;
  access_token?: string;
  tokenType?: string;
  username?: string;
  role?: string;
  message?: string;
}

// ==========================================
// Common API Response
// ==========================================

export interface ApiError {
  message: string;
  status?: number;
  timestamp?: string;
}

export interface ApiMessage {
  message: string;
  success?: boolean;
}

// ==========================================
// Guest
// ==========================================

export interface Guest {
  id: number;
  full_name: string;
  name?: string;
  email: string;
  phone: string;
  address?: string;
  id_proof?: string;
  created_at?: string;
}

// ==========================================
// Room
// ==========================================

export type RoomStatus =
  | "available"
  | "occupied"
  | "maintenance"
  | "reserved"
  | "AVAILABLE"
  | "OCCUPIED"
  | "MAINTENANCE"
  | "RESERVED";

export interface Room {
  id: number;
  room_number: string;
  roomNumber?: string;
  room_type: string;
  roomType?: string;
  price_per_night: number;
  price?: number;
  capacity: number;
  status: RoomStatus;
  description?: string;
  image_url?: string;
}

// ==========================================
// Staff
// ==========================================

export interface Staff {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  salary?: number;
}

// ==========================================
// Booking
// ==========================================

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED";

export interface Booking {
  id: number;
  guestId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  status: BookingStatus;
  totalAmount: number;
}

// ==========================================
// Payment
// ==========================================

export type PaymentStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED";

export interface Payment {
  id: number;
  bookingId: number;
  amount: number;
  paymentMethod: string;
  paymentDate?: string;
  status: PaymentStatus;
}

// ==========================================
// User
// ==========================================

export interface User {
  id: number;
  username: string;
  email?: string;
  role: string;
  full_name?: string;
  enabled?: boolean;
  is_active?: boolean;
}

// ==========================================
// Dashboard
// ==========================================

export interface DashboardStats {
  totalRooms?: number;
  availableRooms?: number;
  occupiedRooms?: number;
  totalGuests?: number;
  totalBookings?: number;
  totalRevenue?: number;
  total_rooms?: number;
  available_rooms?: number;
  occupied_rooms?: number;
  total_guests?: number;
  total_reservations?: number;
  total_revenue?: number;
}

// ==========================================
// Pagination
// ==========================================

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
// ==========================================
// Reservation
// ==========================================

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled";

export interface Reservation {
  id: number;
  guest_id: number;
  room_id: number;
  check_in: string;
  check_out: string;
  number_of_guests: number;
  total_price: number;
  total_amount?: number;
  status: ReservationStatus;
  created_at?: string;
  guest?: Guest;
  room?: Room;
}
