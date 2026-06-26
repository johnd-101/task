export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  date: string; // ISO format
  reason: string;
}