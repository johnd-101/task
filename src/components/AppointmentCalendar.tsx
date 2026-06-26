import { useState } from "react";
import { Appointment, Patient } from "../types";
import { v4 as uuid } from "uuid";

interface Props {
  patients: Patient[];
  onAdd: (appt: Appointment) => void;
}

export default function AppointmentCalendar({ patients, onAdd }: Props) {
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientId || !date) return;

    onAdd({
      id: uuid(),
      patientId,
      date,
      reason
    });

    setPatientId("");
    setDate("");
    setReason("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={patientId} onChange={e => setPatientId(e.target.value)}>
        <option value="">Select Patient</option>
        {patients.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      <input type="datetime-local"
        value={date}
        onChange={e => setDate(e.target.value)}
      />

      <input placeholder="Reason"
        value={reason}
        onChange={e => setReason(e.target.value)}
      />

      <button>Book Appointment</button>
    </form>
  );
}