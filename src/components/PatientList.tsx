import { Patient } from "../types";

interface Props {
  patients: Patient[];
}

export default function PatientList({ patients }: Props) {
  return (
    <div>
      <h2>Patients</h2>
      {patients.map(p => (
        <div key={p.id}>
          <strong>{p.name}</strong>
          <p>{p.email}</p>
          <p>{p.phone}</p>
          <small>{p.notes}</small>
        </div>
      ))}
    </div>
  );
}