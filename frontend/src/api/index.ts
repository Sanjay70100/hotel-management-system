// Export the Axios API client
export { default as api } from "./axios";

// Export authentication functions
export {
  loginUser,
  getCurrentUser,
  logoutUser,
} from "./auth";

// Export room management functions
export {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} from "./rooms";

// Export guest management functions
export {
  getGuests,
  getGuestById,
  createGuest,
  updateGuest,
  deleteGuest,
} from "./guests";

// Export reservation management functions
export {
  getReservations,
  getReservationById,
  createReservation,
  updateReservation,
  cancelReservation,
  deleteReservation,
} from "./reservations";

// Export dashboard functions
export { getDashboardStats } from "./dashboard";