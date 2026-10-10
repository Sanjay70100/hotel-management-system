import api from "./axios";
import type { Staff } from "../types";

export interface StaffPayload {
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
}

export const getAllStaff = async (): Promise<Staff[]> => {
  const response = await api.get<Staff[]>("/api/staff");
  return response.data;
};

export const getStaffById = async (id: number): Promise<Staff> => {
  const response = await api.get<Staff>(`/api/staff/${id}`);
  return response.data;
};

export const getStaffByDepartment = async (department: string): Promise<Staff[]> => {
  const response = await api.get<Staff[]>(`/api/staff/department/${encodeURIComponent(department)}`);
  return response.data;
};

export const createStaff = async (data: StaffPayload): Promise<Staff> => {
  const response = await api.post<Staff>("/api/staff", data);
  return response.data;
};

export const updateStaff = async (id: number, data: StaffPayload): Promise<Staff> => {
  const response = await api.put<Staff>(`/api/staff/${id}`, data);
  return response.data;
};

export const deleteStaff = async (id: number): Promise<void> => {
  await api.delete(`/api/staff/${id}`);
};
