import { useState } from "react";
import { Patient } from "../types";
import { v4 as uuid } from "uuid";

interface Props {
  onAdd: (patient: Patient) => void;
}

export default function PatientForm({ onAdd }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPatient: Patient = {
      id: uuid(),
      ...form
    };

    onAdd(newPatient);

    setForm({ name: "", email: "", phone: "", notes: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })} />

      <input placeholder="Email" value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })} />

      <input placeholder="Phone" value={form.phone}
        onChange={e => setForm({ ...form, phone: e.target.value })} />

      <textarea placeholder="Notes"
        value={form.notes}
        onChange={e => setForm({ ...form, notes: e.target.value })}
      />

      <button>Add Patient</button>
    </form>
  );
}