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
  name: string;
  email: string;
  phone: string;
  address?: string;
}

// ==========================================
// Room
// ==========================================

export type RoomStatus =
  | "AVAILABLE"
  | "OCCUPIED"
  | "MAINTENANCE"
  | "RESERVED";

export interface Room {
  id: number;
  roomNumber: string;
  roomType: string;
  price: number;
  status: RoomStatus;
  description?: string;
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
  enabled?: boolean;
}

// ==========================================
// Dashboard
// ==========================================

export interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  totalGuests: number;
  totalBookings: number;
  totalRevenue: number;
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