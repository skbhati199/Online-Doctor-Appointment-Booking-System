import { api } from './api.js'; // Using .js extension helps TypeScript in some bundlers
import { toast } from 'react-toastify';

// Types
export interface AppointmentFormData {
  doctorId: string;
  date: Date;
  startTime: string;
  reason: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  doctor?: {
    id: string;
    name: string;
    specialization: string;
  };
  patient?: {
    id: string;
    name: string;
  };
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  reason: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Get all appointments for the logged-in user
export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    const response = await api.get('/appointments');
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw new Error('Failed to fetch appointments');
  }
};

// Get a specific appointment by ID
export const getAppointmentById = async (id: string): Promise<Appointment> => {
  try {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching appointment ${id}:`, error);
    throw new Error('Failed to fetch appointment details');
  }
};

// Book a new appointment
export const bookAppointment = async (appointmentData: AppointmentFormData): Promise<Appointment> => {
  try {
    const response = await api.post('/appointments', appointmentData);
    toast.success('Appointment booked successfully!');
    return response.data;
  } catch (error) {
    console.error('Error booking appointment:', error);
    throw new Error('Failed to book appointment');
  }
};

// Update an existing appointment
export const updateAppointment = async (id: string, appointmentData: Partial<AppointmentFormData>): Promise<Appointment> => {
  try {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    toast.success('Appointment updated successfully!');
    return response.data;
  } catch (error) {
    console.error(`Error updating appointment ${id}:`, error);
    throw new Error('Failed to update appointment');
  }
};

// Cancel an appointment
export const cancelAppointment = async (id: string): Promise<void> => {
  try {
    await api.patch(`/appointments/${id}/cancel`);
    toast.success('Appointment cancelled successfully!');
  } catch (error) {
    console.error(`Error cancelling appointment ${id}:`, error);
    throw new Error('Failed to cancel appointment');
  }
};

// Reschedule an appointment
export const rescheduleAppointment = async (id: string, newDate: Date, newTime: string): Promise<Appointment> => {
  try {
    const response = await api.patch(`/appointments/${id}/reschedule`, {
      date: newDate,
      startTime: newTime
    });
    toast.success('Appointment rescheduled successfully!');
    return response.data;
  } catch (error) {
    console.error(`Error rescheduling appointment ${id}:`, error);
    throw new Error('Failed to reschedule appointment');
  }
};

// Get available time slots for a doctor on a specific date
export const getAvailableSlots = async (doctorId: string, date: string): Promise<string[]> => {
  try {
    const response = await api.get(`/doctors/${doctorId}/available-slots`, {
      params: { date }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching available slots:', error);
    throw new Error('Failed to fetch available time slots');
  }
};

// Get all appointments (admin only)
export const getAllAppointments = async (): Promise<Appointment[]> => {
  try {
    const response = await api.get('/admin/appointments');
    return response.data;
  } catch (error) {
    console.error('Error fetching all appointments:', error);
    throw new Error('Failed to fetch all appointments');
  }
};
