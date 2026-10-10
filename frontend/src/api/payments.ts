import api from "./axios";
import type { Payment } from "../types";

export interface PaymentPayload {
  bookingId: number;
  amount: number;
  paymentMethod: "CASH" | "CARD" | "UPI" | "NET_BANKING";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
}

export const getPayments = async (): Promise<Payment[]> => {
  const response = await api.get<Payment[]>("/api/payments");
  return response.data;
};

export const getPaymentById = async (id: number): Promise<Payment> => {
  const response = await api.get<Payment>(`/api/payments/${id}`);
  return response.data;
};

export const getPaymentsByBooking = async (bookingId: number): Promise<Payment[]> => {
  const response = await api.get<Payment[]>(`/api/payments/booking/${bookingId}`);
  return response.data;
};

export const createPayment = async (data: PaymentPayload): Promise<Payment> => {
  const response = await api.post<Payment>("/api/payments", data);
  return response.data;
};

export const updatePayment = async (id: number, data: PaymentPayload): Promise<Payment> => {
  const response = await api.put<Payment>(`/api/payments/${id}`, data);
  return response.data;
};

export const deletePayment = async (id: number): Promise<void> => {
  await api.delete(`/api/payments/${id}`);
};
