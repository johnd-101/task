
import { useState, useCallback } from "react";

const MEDICAL_AIDS = [
  "Discovery Health", "Bonitas", "Momentum Health", "Fedhealth",
  "Medihelp", "Bestmed", "Sizwe Hosmed", "KeyCare", "Gems",
  "Polmed", "Profmed", "Selfmed", "CompCare"
];

const TARIFF_CODES = [
  { code: "1050", description: "Consultation: New patient - comprehensive examination" },
  { code: "1052", description: "Consultation: Follow-up examination" },
  { code: "1058", description: "Consultation: Emergency visit" },
  { code: "2200", description: "Refraction - Spectacle prescription" },
  { code: "2201", description: "Refraction - Contact lens prescription" },
  { code: "2230", description: "Visual field testing - automated (one eye)" },
  { code: "2231", description: "Visual field testing - automated (both eyes)" },
  { code: "2232", description: "Fundus photography (one eye)" },
  { code: "2233", description: "Fundus photography (both eyes)" },
  { code: "2234", description: "Corneal topography" },
  { code: "2240", description: "Tonometry - intraocular pressure measurement" },
  { code: "2250", description: "Dilated fundus examination" },
  { code: "2260", description: "Slit lamp biomicroscopy" },
  { code: "2270", description: "Contact lens fitting - hard/rigid" },
  { code: "2271", description: "Contact lens fitting - soft" },
  { code: "2280", description: "Low vision assessment" },
  { code: "2290", description: "Binocular vision assessment and therapy" },
  { code: "0190", description: "Administration - medical aid claim processing" },
];

const ICD10_CODES = [
  { code: "H52.1", description: "Myopia (short-sightedness)" },
  { code: "H52.0", description: "Hypermetropia (long-sightedness)" },
  { code: "H52.2", description: "Astigmatism" },
  { code: "H52.4", description: "Presbyopia" },
  { code: "H52.5", description: "Disorders of accommodation" },
  { code: "H10.1", description: "Acute atopic conjunctivitis" },
  { code: "H10.3", description: "Acute conjunctivitis, unspecified" },
  { code: "H16.0", description: "Corneal ulcer" },
  { code: "H26.9", description: "Cataract, unspecified" },
  { code: "H40.1", description: "Open-angle glaucoma" },
  { code: "H40.2", description: "Primary angle-closure glaucoma" },
  { code: "H35.3", description: "Degeneration of macula and posterior pole" },
  { code: "H50.0", description: "Convergent concomitant strabismus (esotropia)" },
  { code: "H50.1", description: "Divergent concomitant strabismus (exotropia)" },
  { code: "H53.0", description: "Amblyopia ex anopsia (lazy eye)" },
  { code: "H57.1", description: "Ocular pain" },
  { code: "H04.1", description: "Chronic dacryocystitis (dry eye)" },
  { code: "Z01.0", description: "Examination of eyes and vision (routine)" },
  { code: "Z13.5", description: "Screening examination for eye disorders" },
];

const STOCK_ITEMS = [
  { code: "SPH-SV-CR39", description: "Single Vision Lens - CR39 Plastic", price: 380 },
  { code: "SPH-SV-POLYC", description: "Single Vision Lens - Polycarbonate", price: 520 },
  { code: "SPH-SV-HIND", description: "Single Vision Lens - Hi-Index 1.67", price: 780 },
  { code: "SPH-BI-CR39", description: "Bifocal Lens - CR39", price: 650 },
  { code: "SPH-PAL-STD", description: "Progressive Lens - Standard", price: 1200 },
  { code: "SPH-PAL-PREM", description: "Progressive Lens - Premium", price: 1950 },
  { code: "COAT-AR", description: "Anti-Reflective Coating", price: 280 },
  { code: "COAT-PHCHROM", description: "Photochromic Treatment", price: 450 },
  { code: "COAT-HARD", description: "Hardening Coating", price: 120 },
  { code: "COAT-BLUE", description: "Blue Light Filter Coating", price: 320 },
  { code: "CL-DAILY-SPH", description: "Daily Contact Lenses - Spherical (30pk)", price: 390 },
  { code: "CL-MNTH-SPH", description: "Monthly Contact Lenses - Spherical (6pk)", price: 480 },
  { code: "CL-TORIC-MNT", description: "Monthly Toric Contact Lenses (6pk)", price: 720 },
  { code: "CL-MULTI-MNT", description: "Monthly Multifocal Contact Lenses (6pk)", price: 890 },
  { code: "CL-SOL-360ML", description: "Contact Lens Solution 360ml", price: 95 },
  { code: "FRAME-BASIC", description: "Frame - Standard Range", price: 450 },
  { code: "FRAME-MID", description: "Frame - Mid Range", price: 850 },
  { code: "FRAME-PREM", description: "Frame - Premium / Designer", price: 1800 },
  { code: "FRAME-KIDS", description: "Frame - Childrens Flexible", price: 380 },
  { code: "EYE-DROP-LUB", description: "Lubricating Eye Drops 10ml", price: 85 },
  { code: "EYE-DROP-ABX", description: "Antibiotic Eye Drops (generic)", price: 140 },
  { code: "SUNGLASS-CLIP", description: "Clip-on Sunglass Adaptor", price: 180 },
  { code: "CASE-HARD", description: "Hard Spectacle Case", price: 65 },
  { code: "CLEAN-KIT", description: "Lens Cleaning Kit (spray + cloth)", price: 45 },
];

function generateId() {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
}

function formatCurrency(amount) {
  return `R ${Number(amount).toFixed(2)}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });
}

const today = new Date().toISOString().split("T")[0];

const PRACTICE = {
  name: "ClearVision Optometry Practice",
  practiceNo: "PR0012345",
  hpcsa: "OPT123456",
  address: "123 Main Road, Cape Town, Western Cape, 8001",
  phone: "021 555 0100",
  email: "info@clearvision.co.za",
  vatNo: "4800123456",
};

// ── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ current, onChange, counts }) {
  const nav = [
    { id: "dashboard", label: "Dashboard", icon: "⊞" },
    { id: "patients", label: "Patients", icon: "♟", count: counts.patients },
    { id: "invoices", label: "Invoices", icon: "◫", count: counts.invoices },
    { id: "new-invoice", label: "New Invoice", icon: "＋" },
    { id: "medical-aid", label: "Medical Aid", icon: "✦" },
  ];
  return (
    <aside style={{
      width: 220, minHeight: "100vh", background: "#0d1b2a",
      display: "flex", flexDirection: "column", flexShrink: 0,
    }}>
      <div style={{ padding: "28px 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, background: "#1da9a0",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 18, letterSpacing: -1,
          }}>CV</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 13, lineHeight: 1.2 }}>ClearVision</div>
            <div style={{ color: "#6b8fa8", fontSize: 11 }}>Optometry</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "8px 12px" }}>
        {nav.map(item => (
          <button key={item.id} onClick={() => onChange(item.id)} style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer",
            background: current === item.id ? "#1da9a0" : "transparent",
            color: current === item.id ? "#fff" : "#6b8fa8",
            fontSize: 13, fontWeight: current === item.id ? 600 : 400,
            marginBottom: 2, transition: "all 0.15s",
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              {item.label}
            </span>
            {item.count !== undefined && (
              <span style={{
                background: current === item.id ? "rgba(255,255,255,0.25)" : "#1a3147",
                color: current === item.id ? "#fff" : "#6b8fa8",
                fontSize: 11, padding: "2px 7px", borderRadius: 99,
              }}>{item.count}</span>
            )}
          </button>
        ))}
      </nav>
      <div style={{ padding: "12px 20px 20px", borderTop: "1px solid #1a3147" }}>
        <div style={{ color: "#2a5470", fontSize: 11 }}>HPCSA: {PRACTICE.hpcsa}</div>
        <div style={{ color: "#2a5470", fontSize: 11 }}>Pr.No: {PRACTICE.practiceNo}</div>
      </div>
    </aside>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ patients, invoices, onNav }) {
  const totalRevenue = invoices.reduce((s, inv) => s + inv.total, 0);
  const pending = invoices.filter(i => i.status === "pending").length;
  const submitted = invoices.filter(i => i.status === "submitted").length;
  const paid = invoices.filter(i => i.status === "paid").length;
  const recent = [...invoices].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  const statCards = [
    { label: "Total Patients", value: patients.length, color: "#1da9a0" },
    { label: "Total Invoices", value: invoices.length, color: "#3a86ff" },
    { label: "Pending", value: pending, color: "#f59e0b" },
    { label: "Total Revenue", value: formatCurrency(totalRevenue), color: "#10b981" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0d1b2a", margin: 0 }}>Good day, Dr. Smith</h1>
        <p style={{ color: "#6b8fa8", margin: "4px 0 0", fontSize: 14 }}>{formatDate(today)}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
        {statCards.map(s => (
          <div key={s.label} style={{
            background: "#fff", border: "1px solid #e8f0f7", borderRadius: 12,
            padding: "20px 20px 16px", borderTop: `4px solid ${s.color}`,
          }}>
            <div style={{ fontSize: 12, color: "#6b8fa8", marginBottom: 8, fontWeight: 500 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#0d1b2a" }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8f0f7", padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#0d1b2a" }}>Recent Invoices</h3>
            <button onClick={() => onNav("invoices")} style={{ fontSize: 12, color: "#1da9a0", border: "none", background: "none", cursor: "pointer" }}>View all →</button>
          </div>
          {recent.length === 0 ? <p style={{ color: "#6b8fa8", fontSize: 13 }}>No invoices yet.</p> : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e8f0f7" }}>
                  {["Invoice #", "Patient", "Date", "Amount", "Status"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "6px 8px", color: "#6b8fa8", fontWeight: 500, fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map(inv => (
                  <tr key={inv.id} style={{ borderBottom: "1px solid #f0f7fc" }}>
                    <td style={{ padding: "10px 8px", fontWeight: 600, color: "#1da9a0" }}>{inv.invoiceNo}</td>
                    <td style={{ padding: "10px 8px", color: "#0d1b2a" }}>{inv.patientName}</td>
                    <td style={{ padding: "10px 8px", color: "#6b8fa8" }}>{formatDate(inv.date)}</td>
                    <td style={{ padding: "10px 8px", fontWeight: 600 }}>{formatCurrency(inv.total)}</td>
                    <td style={{ padding: "10px 8px" }}><StatusBadge status={inv.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8f0f7", padding: 20 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: "#0d1b2a" }}>Claim Status</h3>
          {[
            { label: "Pending", count: pending, color: "#f59e0b", bg: "#fef3c7" },
            { label: "Submitted", count: submitted, color: "#3b82f6", bg: "#eff6ff" },
            { label: "Paid", count: paid, color: "#10b981", bg: "#ecfdf5" },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f0f7fc" }}>
              <span style={{ fontSize: 13, color: "#0d1b2a" }}>{s.label}</span>
              <span style={{ background: s.bg, color: s.color, padding: "2px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600 }}>{s.count}</span>
            </div>
          ))}
          <button onClick={() => onNav("new-invoice")} style={{
            width: "100%", marginTop: 20, padding: "12px",
            background: "#1da9a0", color: "#fff", border: "none",
            borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}>+ New Invoice</button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: { bg: "#fef3c7", color: "#d97706", label: "Pending" },
    submitted: { bg: "#eff6ff", color: "#2563eb", label: "Submitted" },
    paid: { bg: "#ecfdf5", color: "#059669", label: "Paid" },
    rejected: { bg: "#fef2f2", color: "#dc2626", label: "Rejected" },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{ background: s.bg, color: s.color, padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600 }}>{s.label}</span>
  );
}

// ── Patients ──────────────────────────────────────────────────────────────────
function Patients({ patients, onAdd, onSelect }) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    firstName: "", lastName: "", dob: "", idNumber: "",
    phone: "", email: "", address: "",
    medicalAid: "", medicalAidNo: "", dependantCode: "",
    gender: "Female",
  });

  const filtered = patients.filter(p =>
    `${p.firstName} ${p.lastName} ${p.idNumber} ${p.medicalAid}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = () => {
    if (!form.firstName || !form.lastName) return;
    const patient = { ...form, id: generateId(), createdAt: today };
    onAdd(patient);
    setForm({ firstName: "", lastName: "", dob: "", idNumber: "", phone: "", email: "", address: "", medicalAid: "", medicalAidNo: "", dependantCode: "", gender: "Female" });
    setShowForm(false);
  };

  const Field = ({ label, children }) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6b8fa8", marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );

  const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: 7, border: "1px solid #dce8f0", fontSize: 13, color: "#0d1b2a", boxSizing: "border-box", background: "#fafcfe" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0d1b2a" }}>Patients</h2>
        <button onClick={() => setShowForm(!showForm)} style={{
          background: "#1da9a0", color: "#fff", border: "none", borderRadius: 8,
          padding: "10px 18px", fontWeight: 600, fontSize: 13, cursor: "pointer",
        }}>{showForm ? "Cancel" : "+ Add Patient"}</button>
      </div>

      {showForm && (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8f0f7", padding: 24, marginBottom: 24 }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 600, color: "#0d1b2a" }}>New Patient</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
            <Field label="First Name *">
              <input style={inputStyle} value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} placeholder="e.g. Thandi" />
            </Field>
            <Field label="Last Name *">
              <input style={inputStyle} value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} placeholder="e.g. Nkosi" />
            </Field>
            <Field label="Date of Birth">
              <input type="date" style={inputStyle} value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
            </Field>
            <Field label="Gender">
              <select style={inputStyle} value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                <option>Female</option><option>Male</option><option>Other</option>
              </select>
            </Field>
            <Field label="SA ID Number">
              <input style={inputStyle} value={form.idNumber} onChange={e => setForm({ ...form, idNumber: e.target.value })} placeholder="13-digit ID number" maxLength={13} />
            </Field>
            <Field label="Phone">
              <input style={inputStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="e.g. 082 555 0123" />
            </Field>
            <Field label="Email">
              <input style={inputStyle} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="patient@email.com" />
            </Field>
            <Field label="Medical Aid">
              <select style={inputStyle} value={form.medicalAid} onChange={e => setForm({ ...form, medicalAid: e.target.value })}>
                <option value="">-- Select Medical Aid --</option>
                {MEDICAL_AIDS.map(m => <option key={m}>{m}</option>)}
              </select>
            </Field>
            <Field label="Medical Aid No.">
              <input style={inputStyle} value={form.medicalAidNo} onChange={e => setForm({ ...form, medicalAidNo: e.target.value })} placeholder="Membership number" />
            </Field>
            <Field label="Dependant Code">
              <input style={inputStyle} value={form.dependantCode} onChange={e => setForm({ ...form, dependantCode: e.target.value })} placeholder="00 = main member" />
            </Field>
          </div>
          <Field label="Address">
            <input style={inputStyle} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Street, Suburb, City, Code" />
          </Field>
          <button onClick={handleSubmit} style={{
            marginTop: 6, background: "#1da9a0", color: "#fff", border: "none", borderRadius: 8,
            padding: "11px 24px", fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}>Save Patient</button>
        </div>
      )}

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8f0f7", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #e8f0f7" }}>
          <input style={{ ...{ padding: "9px 14px", borderRadius: 7, border: "1px solid #dce8f0", fontSize: 13, width: 280, background: "#fafcfe" } }}
            placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#6b8fa8", fontSize: 14 }}>No patients found.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f8fbfd" }}>
                {["Patient", "ID Number", "Medical Aid", "Membership No.", "Phone"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 16px", color: "#6b8fa8", fontWeight: 500, fontSize: 11 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} onClick={() => onSelect(p)} style={{ borderBottom: "1px solid #f0f7fc", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fbfd"}
                  onMouseLeave={e => e.currentTarget.style.background = ""}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#e0f5f4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "#1da9a0" }}>
                        {p.firstName[0]}{p.lastName[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#0d1b2a" }}>{p.firstName} {p.lastName}</div>
                        <div style={{ fontSize: 11, color: "#6b8fa8" }}>{p.dob ? formatDate(p.dob) : "—"}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#6b8fa8" }}>{p.idNumber || "—"}</td>
                  <td style={{ padding: "12px 16px" }}>{p.medicalAid || <span style={{ color: "#6b8fa8" }}>Private</span>}</td>
                  <td style={{ padding: "12px 16px", color: "#6b8fa8" }}>{p.medicalAidNo || "—"}</td>
                  <td style={{ padding: "12px 16px", color: "#6b8fa8" }}>{p.phone || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── Invoice Form ──────────────────────────────────────────────────────────────
function NewInvoice({ patients, onSave }) {
  const [step, setStep] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientSearch, setPatientSearch] = useState("");
  const [lines, setLines] = useState([]);
  const [meta, setMeta] = useState({ date: today, notes: "", diagnosisNotes: "" });
  const [saved, setSaved] = useState(null);

  const [lineForm, setLineForm] = useState({
    tariffCode: "", icd10Code: "", stockCode: "", description: "", qty: 1, unitPrice: 0,
  });

  const filteredPts = patients.filter(p =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const subtotal = lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);
  const vat = subtotal * 0.15;
  const total = subtotal + vat;

  const addLine = () => {
    if (!lineForm.description) return;
    setLines([...lines, { ...lineForm, id: generateId() }]);
    setLineForm({ tariffCode: "", icd10Code: "", stockCode: "", description: "", qty: 1, unitPrice: 0 });
  };

  const removeLine = (id) => setLines(lines.filter(l => l.id !== id));

  const handleStockSelect = (e) => {
    const item = STOCK_ITEMS.find(s => s.code === e.target.value);
    if (item) setLineForm(f => ({ ...f, stockCode: item.code, description: item.description, unitPrice: item.price }));
    else setLineForm(f => ({ ...f, stockCode: "", description: "", unitPrice: 0 }));
  };

  const handleTariffSelect = (e) => {
    const t = TARIFF_CODES.find(tc => tc.code === e.target.value);
    if (t) setLineForm(f => ({ ...f, tariffCode: t.code, description: t.description }));
    else setLineForm(f => ({ ...f, tariffCode: "" }));
  };

  const handleICD10Select = (e) => {
    const ic = ICD10_CODES.find(i => i.code === e.target.value);
    if (ic) setLineForm(f => ({ ...f, icd10Code: ic.code }));
    else setLineForm(f => ({ ...f, icd10Code: "" }));
  };

  const handleSave = () => {
    const inv = {
      id: generateId(),
      invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
      patientId: selectedPatient.id,
      patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
      medicalAid: selectedPatient.medicalAid,
      medicalAidNo: selectedPatient.medicalAidNo,
      dependantCode: selectedPatient.dependantCode,
      date: meta.date,
      lines,
      notes: meta.notes,
      diagnosisNotes: meta.diagnosisNotes,
      subtotal, vat, total,
      status: "pending",
    };
    onSave(inv);
    setSaved(inv);
  };

  if (saved) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
        <h2 style={{ color: "#1da9a0", margin: "0 0 8px" }}>Invoice Saved!</h2>
        <p style={{ color: "#6b8fa8" }}>{saved.invoiceNo} — {formatCurrency(saved.total)}</p>
        <button onClick={() => { setSaved(null); setStep(1); setSelectedPatient(null); setLines([]); }}
          style={{ marginTop: 16, background: "#1da9a0", color: "#fff", border: "none", borderRadius: 8, padding: "11px 28px", fontWeight: 600, cursor: "pointer" }}>
          New Invoice
        </button>
      </div>
    );
  }

  const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: 7, border: "1px solid #dce8f0", fontSize: 13, color: "#0d1b2a", boxSizing: "border-box", background: "#fafcfe" };
  const selectStyle = { ...inputStyle };

  const steps = ["Select Patient", "Line Items", "Review & Save"];

  return (
    <div>
      <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 700, color: "#0d1b2a" }}>New Invoice</h2>

      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 28, gap: 0 }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700,
                background: step > i + 1 ? "#1da9a0" : step === i + 1 ? "#0d1b2a" : "#e8f0f7",
                color: step >= i + 1 ? "#fff" : "#6b8fa8",
              }}>{step > i + 1 ? "✓" : i + 1}</div>
              <span style={{ fontSize: 13, fontWeight: step === i + 1 ? 600 : 400, color: step === i + 1 ? "#0d1b2a" : "#6b8fa8" }}>{s}</span>
            </div>
            {i < steps.length - 1 && <div style={{ width: 40, height: 1, background: "#dce8f0", margin: "0 12px" }} />}
          </div>
        ))}
      </div>

      {/* Step 1: Select Patient */}
      {step === 1 && (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8f0f7", padding: 24 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: "#0d1b2a" }}>Select Patient</h3>
          <input style={{ ...inputStyle, width: 320, marginBottom: 16 }} placeholder="Search patient name..."
            value={patientSearch} onChange={e => setPatientSearch(e.target.value)} />
          {patients.length === 0 && <p style={{ color: "#6b8fa8", fontSize: 13 }}>No patients found. Add a patient first.</p>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxHeight: 400, overflowY: "auto" }}>
            {filteredPts.map(p => (
              <div key={p.id} onClick={() => { setSelectedPatient(p); setStep(2); }}
                style={{
                  padding: "14px 16px", borderRadius: 10, border: `2px solid ${selectedPatient?.id === p.id ? "#1da9a0" : "#e8f0f7"}`,
                  cursor: "pointer", background: selectedPatient?.id === p.id ? "#f0faf9" : "#fafcfe",
                }}>
                <div style={{ fontWeight: 600, color: "#0d1b2a", fontSize: 14 }}>{p.firstName} {p.lastName}</div>
                <div style={{ fontSize: 12, color: "#6b8fa8", marginTop: 2 }}>{p.medicalAid || "Private Pay"}</div>
                {p.medicalAidNo && <div style={{ fontSize: 11, color: "#a0b4c0", marginTop: 1 }}>No: {p.medicalAidNo}</div>}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20, gap: 10 }}>
            <div style={{ fontSize: 13, color: "#6b8fa8", alignSelf: "center" }}>
              {selectedPatient ? `Selected: ${selectedPatient.firstName} ${selectedPatient.lastName}` : "Click a patient to select"}
            </div>
            {selectedPatient && (
              <button onClick={() => setStep(2)} style={{ background: "#1da9a0", color: "#fff", border: "none", borderRadius: 8, padding: "10px 22px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                Next →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Line Items */}
      {step === 2 && (
        <div>
          <div style={{ background: "#f0faf9", borderRadius: 10, border: "1px solid #b8e8e4", padding: "12px 16px", marginBottom: 20, fontSize: 13 }}>
            <strong style={{ color: "#0d1b2a" }}>Patient:</strong> <span style={{ color: "#0d7c74" }}>{selectedPatient.firstName} {selectedPatient.lastName}</span>
            {selectedPatient.medicalAid && <> &nbsp;|&nbsp; <strong style={{ color: "#0d1b2a" }}>Medical Aid:</strong> <span style={{ color: "#0d7c74" }}>{selectedPatient.medicalAid} — {selectedPatient.medicalAidNo}</span></>}
          </div>

          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8f0f7", padding: 24, marginBottom: 16 }}>
            <h3 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 600, color: "#0d1b2a" }}>Add Line Item</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6b8fa8", marginBottom: 5 }}>Tariff Code</label>
                <select style={selectStyle} value={lineForm.tariffCode} onChange={handleTariffSelect}>
                  <option value="">— Select Tariff Code —</option>
                  {TARIFF_CODES.map(t => <option key={t.code} value={t.code}>{t.code} — {t.description}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6b8fa8", marginBottom: 5 }}>ICD-10 Diagnosis Code</label>
                <select style={selectStyle} value={lineForm.icd10Code} onChange={handleICD10Select}>
                  <option value="">— Select ICD-10 Code —</option>
                  {ICD10_CODES.map(i => <option key={i.code} value={i.code}>{i.code} — {i.description}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6b8fa8", marginBottom: 5 }}>Stock Code / Product</label>
                <select style={selectStyle} value={lineForm.stockCode} onChange={handleStockSelect}>
                  <option value="">— Select Stock Item —</option>
                  {STOCK_ITEMS.map(s => <option key={s.code} value={s.code}>{s.code} — {s.description}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6b8fa8", marginBottom: 5 }}>Description</label>
                <input style={inputStyle} value={lineForm.description} onChange={e => setLineForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6b8fa8", marginBottom: 5 }}>Quantity</label>
                <input type="number" min={1} style={inputStyle} value={lineForm.qty}
                  onChange={e => setLineForm(f => ({ ...f, qty: parseInt(e.target.value) || 1 }))} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6b8fa8", marginBottom: 5 }}>Unit Price (excl. VAT)</label>
                <input type="number" min={0} step={0.01} style={inputStyle} value={lineForm.unitPrice}
                  onChange={e => setLineForm(f => ({ ...f, unitPrice: parseFloat(e.target.value) || 0 }))} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
              <span style={{ fontSize: 13, color: "#6b8fa8" }}>
                Line total: <strong style={{ color: "#0d1b2a" }}>{formatCurrency(lineForm.qty * lineForm.unitPrice)}</strong>
              </span>
              <button onClick={addLine} style={{ background: "#0d1b2a", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                + Add Line
              </button>
            </div>
          </div>

          {lines.length > 0 && (
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8f0f7", overflow: "hidden", marginBottom: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#f8fbfd" }}>
                    {["Tariff", "ICD-10", "Stock Code", "Description", "Qty", "Unit Price", "Total", ""].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: "#6b8fa8", fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lines.map(l => (
                    <tr key={l.id} style={{ borderBottom: "1px solid #f0f7fc" }}>
                      <td style={{ padding: "10px 12px" }}><span style={{ background: "#e0f5f4", color: "#1da9a0", padding: "2px 7px", borderRadius: 4, fontWeight: 600 }}>{l.tariffCode || "—"}</span></td>
                      <td style={{ padding: "10px 12px" }}><span style={{ background: "#eff6ff", color: "#3b82f6", padding: "2px 7px", borderRadius: 4, fontWeight: 600 }}>{l.icd10Code || "—"}</span></td>
                      <td style={{ padding: "10px 12px", color: "#6b8fa8" }}>{l.stockCode || "—"}</td>
                      <td style={{ padding: "10px 12px", color: "#0d1b2a", maxWidth: 200 }}>{l.description}</td>
                      <td style={{ padding: "10px 12px", color: "#6b8fa8" }}>{l.qty}</td>
                      <td style={{ padding: "10px 12px" }}>{formatCurrency(l.unitPrice)}</td>
                      <td style={{ padding: "10px 12px", fontWeight: 600 }}>{formatCurrency(l.qty * l.unitPrice)}</td>
                      <td style={{ padding: "10px 12px" }}>
                        <button onClick={() => removeLine(l.id)} style={{ background: "#fef2f2", color: "#dc2626", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 11 }}>✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: "14px 20px", background: "#f8fbfd", display: "flex", justifyContent: "flex-end", gap: 32 }}>
                <span style={{ fontSize: 13, color: "#6b8fa8" }}>Subtotal: <strong style={{ color: "#0d1b2a" }}>{formatCurrency(subtotal)}</strong></span>
                <span style={{ fontSize: 13, color: "#6b8fa8" }}>VAT (15%): <strong style={{ color: "#0d1b2a" }}>{formatCurrency(vat)}</strong></span>
                <span style={{ fontSize: 14, color: "#6b8fa8" }}>Total: <strong style={{ color: "#1da9a0", fontSize: 16 }}>{formatCurrency(total)}</strong></span>
              </div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6b8fa8", marginBottom: 5 }}>Invoice Date</label>
              <input type="date" style={inputStyle} value={meta.date} onChange={e => setMeta(m => ({ ...m, date: e.target.value }))} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6b8fa8", marginBottom: 5 }}>Diagnosis / Clinical Notes</label>
              <input style={inputStyle} value={meta.diagnosisNotes} onChange={e => setMeta(m => ({ ...m, diagnosisNotes: e.target.value }))} placeholder="Clinical notes for claim..." />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setStep(1)} style={{ background: "transparent", color: "#6b8fa8", border: "1px solid #dce8f0", borderRadius: 8, padding: "10px 20px", fontWeight: 500, fontSize: 13, cursor: "pointer" }}>
              ← Back
            </button>
            <button onClick={() => { if (lines.length > 0) setStep(3); }} style={{
              background: lines.length > 0 ? "#1da9a0" : "#b8d8d7", color: "#fff",
              border: "none", borderRadius: 8, padding: "10px 22px", fontWeight: 600, fontSize: 13,
              cursor: lines.length > 0 ? "pointer" : "default",
            }}>Review →</button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8f0f7", padding: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0d1b2a" }}>{PRACTICE.name}</h1>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6b8fa8" }}>HPCSA: {PRACTICE.hpcsa} &nbsp;|&nbsp; Practice No: {PRACTICE.practiceNo}</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b8fa8" }}>{PRACTICE.address}</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b8fa8" }}>{PRACTICE.phone} &nbsp;|&nbsp; VAT: {PRACTICE.vatNo}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "#6b8fa8", fontWeight: 500 }}>DRAFT INVOICE</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#0d1b2a", marginTop: 2 }}>INV-PREVIEW</div>
              <div style={{ fontSize: 12, color: "#6b8fa8", marginTop: 2 }}>{formatDate(meta.date)}</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24, background: "#f8fbfd", borderRadius: 10, padding: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: "#6b8fa8", fontWeight: 500, marginBottom: 6 }}>BILLED TO</div>
              <div style={{ fontWeight: 600, color: "#0d1b2a" }}>{selectedPatient.firstName} {selectedPatient.lastName}</div>
              {selectedPatient.idNumber && <div style={{ fontSize: 12, color: "#6b8fa8" }}>ID: {selectedPatient.idNumber}</div>}
              {selectedPatient.address && <div style={{ fontSize: 12, color: "#6b8fa8" }}>{selectedPatient.address}</div>}
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#6b8fa8", fontWeight: 500, marginBottom: 6 }}>MEDICAL AID</div>
              <div style={{ fontWeight: 600, color: "#0d1b2a" }}>{selectedPatient.medicalAid || "Private / Self-pay"}</div>
              {selectedPatient.medicalAidNo && <div style={{ fontSize: 12, color: "#6b8fa8" }}>Membership: {selectedPatient.medicalAidNo}</div>}
              {selectedPatient.dependantCode && <div style={{ fontSize: 12, color: "#6b8fa8" }}>Dep. Code: {selectedPatient.dependantCode}</div>}
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 20 }}>
            <thead>
              <tr style={{ background: "#0d1b2a" }}>
                {["Tariff Code", "ICD-10", "Stock Code", "Description", "Qty", "Unit Price", "Total"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: "#fff", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <tr key={l.id} style={{ background: i % 2 === 0 ? "#fafcfe" : "#fff", borderBottom: "1px solid #e8f0f7" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 600, color: "#1da9a0" }}>{l.tariffCode || "—"}</td>
                  <td style={{ padding: "10px 12px", fontWeight: 600, color: "#3b82f6" }}>{l.icd10Code || "—"}</td>
                  <td style={{ padding: "10px 12px", color: "#6b8fa8" }}>{l.stockCode || "—"}</td>
                  <td style={{ padding: "10px 12px", color: "#0d1b2a" }}>{l.description}</td>
                  <td style={{ padding: "10px 12px", color: "#6b8fa8" }}>{l.qty}</td>
                  <td style={{ padding: "10px 12px" }}>{formatCurrency(l.unitPrice)}</td>
                  <td style={{ padding: "10px 12px", fontWeight: 600 }}>{formatCurrency(l.qty * l.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: 280 }}>
              {[
                { label: "Subtotal (excl. VAT)", val: subtotal },
                { label: "VAT @ 15%", val: vat },
              ].map(r => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #e8f0f7", fontSize: 13 }}>
                  <span style={{ color: "#6b8fa8" }}>{r.label}</span>
                  <span style={{ color: "#0d1b2a" }}>{formatCurrency(r.val)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", fontSize: 16, fontWeight: 700 }}>
                <span style={{ color: "#0d1b2a" }}>Total Due</span>
                <span style={{ color: "#1da9a0" }}>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {meta.diagnosisNotes && (
            <div style={{ marginTop: 16, padding: 14, background: "#f8fbfd", borderRadius: 8, border: "1px solid #e8f0f7" }}>
              <div style={{ fontSize: 11, color: "#6b8fa8", fontWeight: 500, marginBottom: 4 }}>CLINICAL NOTES</div>
              <div style={{ fontSize: 13, color: "#0d1b2a" }}>{meta.diagnosisNotes}</div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
            <button onClick={() => setStep(2)} style={{ background: "transparent", color: "#6b8fa8", border: "1px solid #dce8f0", borderRadius: 8, padding: "10px 20px", fontWeight: 500, fontSize: 13, cursor: "pointer" }}>
              ← Edit
            </button>
            <button onClick={handleSave} style={{ background: "#1da9a0", color: "#fff", border: "none", borderRadius: 8, padding: "11px 28px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Save Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Invoice List ──────────────────────────────────────────────────────────────
function InvoiceList({ invoices, onUpdateStatus }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? invoices : invoices.filter(i => i.status === filter);

  if (selected) {
    const inv = selected;
    return (
      <div>
        <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#1da9a0", cursor: "pointer", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
          ← Back to Invoices
        </button>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8f0f7", padding: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0d1b2a" }}>{PRACTICE.name}</h1>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6b8fa8" }}>HPCSA: {PRACTICE.hpcsa} &nbsp;|&nbsp; Practice No: {PRACTICE.practiceNo}</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b8fa8" }}>{PRACTICE.address} &nbsp;|&nbsp; {PRACTICE.phone}</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b8fa8" }}>VAT No: {PRACTICE.vatNo}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "#6b8fa8", fontWeight: 500 }}>TAX INVOICE</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#0d1b2a", marginTop: 2 }}>{inv.invoiceNo}</div>
              <div style={{ fontSize: 12, color: "#6b8fa8", marginTop: 2 }}>Date: {formatDate(inv.date)}</div>
              <div style={{ marginTop: 6 }}><StatusBadge status={inv.status} /></div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24, background: "#f8fbfd", borderRadius: 10, padding: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: "#6b8fa8", fontWeight: 500, marginBottom: 6 }}>BILLED TO</div>
              <div style={{ fontWeight: 600, color: "#0d1b2a" }}>{inv.patientName}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#6b8fa8", fontWeight: 500, marginBottom: 6 }}>MEDICAL AID DETAILS</div>
              <div style={{ fontWeight: 600, color: "#0d1b2a" }}>{inv.medicalAid || "Private / Self-pay"}</div>
              {inv.medicalAidNo && <div style={{ fontSize: 12, color: "#6b8fa8" }}>Membership: {inv.medicalAidNo}</div>}
              {inv.dependantCode && <div style={{ fontSize: 12, color: "#6b8fa8" }}>Dep. Code: {inv.dependantCode}</div>}
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 20 }}>
            <thead>
              <tr style={{ background: "#0d1b2a" }}>
                {["Tariff Code", "ICD-10", "Stock Code", "Description", "Qty", "Unit Price", "Line Total"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: "#fff", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inv.lines.map((l, i) => (
                <tr key={l.id} style={{ background: i % 2 === 0 ? "#fafcfe" : "#fff", borderBottom: "1px solid #e8f0f7" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 600, color: "#1da9a0" }}>{l.tariffCode || "—"}</td>
                  <td style={{ padding: "10px 12px", fontWeight: 600, color: "#3b82f6" }}>{l.icd10Code || "—"}</td>
                  <td style={{ padding: "10px 12px", color: "#6b8fa8" }}>{l.stockCode || "—"}</td>
                  <td style={{ padding: "10px 12px", color: "#0d1b2a" }}>{l.description}</td>
                  <td style={{ padding: "10px 12px", color: "#6b8fa8" }}>{l.qty}</td>
                  <td style={{ padding: "10px 12px" }}>{formatCurrency(l.unitPrice)}</td>
                  <td style={{ padding: "10px 12px", fontWeight: 600 }}>{formatCurrency(l.qty * l.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
            <div style={{ width: 280 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #e8f0f7", fontSize: 13 }}>
                <span style={{ color: "#6b8fa8" }}>Subtotal (excl. VAT)</span>
                <span>{formatCurrency(inv.subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #e8f0f7", fontSize: 13 }}>
                <span style={{ color: "#6b8fa8" }}>VAT @ 15%</span>
                <span>{formatCurrency(inv.vat)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", fontSize: 16, fontWeight: 700 }}>
                <span style={{ color: "#0d1b2a" }}>Total Due</span>
                <span style={{ color: "#1da9a0" }}>{formatCurrency(inv.total)}</span>
              </div>
            </div>
          </div>
          {inv.diagnosisNotes && (
            <div style={{ padding: 14, background: "#f8fbfd", borderRadius: 8, border: "1px solid #e8f0f7", marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#6b8fa8", fontWeight: 500, marginBottom: 4 }}>CLINICAL NOTES</div>
              <div style={{ fontSize: 13, color: "#0d1b2a" }}>{inv.diagnosisNotes}</div>
            </div>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            {inv.status === "pending" && (
              <button onClick={() => { onUpdateStatus(inv.id, "submitted"); setSelected({ ...inv, status: "submitted" }); }}
                style={{ background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                Submit to Medical Aid
              </button>
            )}
            {inv.status === "submitted" && (
              <button onClick={() => { onUpdateStatus(inv.id, "paid"); setSelected({ ...inv, status: "paid" }); }}
                style={{ background: "#10b981", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                Mark as Paid
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0d1b2a" }}>Invoices</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "pending", "submitted", "paid"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? "#0d1b2a" : "#fff", color: filter === f ? "#fff" : "#6b8fa8",
              border: "1px solid #dce8f0", borderRadius: 7, padding: "7px 14px",
              fontSize: 12, fontWeight: filter === f ? 600 : 400, cursor: "pointer",
              textTransform: "capitalize",
            }}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8f0f7", overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#6b8fa8", fontSize: 14 }}>No invoices found.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f8fbfd" }}>
                {["Invoice #", "Patient", "Medical Aid", "Date", "Lines", "Total", "Status", ""].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 16px", color: "#6b8fa8", fontWeight: 500, fontSize: 11 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv.id} style={{ borderBottom: "1px solid #f0f7fc" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 700, color: "#1da9a0" }}>{inv.invoiceNo}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 500, color: "#0d1b2a" }}>{inv.patientName}</td>
                  <td style={{ padding: "12px 16px", color: "#6b8fa8" }}>{inv.medicalAid || "Private"}</td>
                  <td style={{ padding: "12px 16px", color: "#6b8fa8" }}>{formatDate(inv.date)}</td>
                  <td style={{ padding: "12px 16px", color: "#6b8fa8" }}>{inv.lines.length}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 600 }}>{formatCurrency(inv.total)}</td>
                  <td style={{ padding: "12px 16px" }}><StatusBadge status={inv.status} /></td>
                  <td style={{ padding: "12px 16px" }}>
                    <button onClick={() => setSelected(inv)} style={{ background: "#f0faf9", color: "#1da9a0", border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── Medical Aid Submission ─────────────────────────────────────────────────────
function MedicalAid({ invoices, onUpdateStatus }) {
  const pending = invoices.filter(i => i.status === "pending");
  const submitted = invoices.filter(i => i.status === "submitted");
  const paid = invoices.filter(i => i.status === "paid");
  const [selected, setSelected] = useState([]);

  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const totalSelected = pending.filter(i => selected.includes(i.id)).reduce((s, i) => s + i.total, 0);

  const submitSelected = () => {
    selected.forEach(id => onUpdateStatus(id, "submitted"));
    setSelected([]);
  };

  return (
    <div>
      <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: "#0d1b2a" }}>Medical Aid Submissions</h2>
      <p style={{ margin: "0 0 24px", color: "#6b8fa8", fontSize: 13 }}>Select pending invoices to batch-submit to medical aids.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Pending Submission", value: pending.length, color: "#f59e0b", bg: "#fef3c7" },
          { label: "Awaiting Payment", value: submitted.length, color: "#3b82f6", bg: "#eff6ff" },
          { label: "Claims Paid", value: paid.length, color: "#10b981", bg: "#ecfdf5" },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "20px 20px", border: `1px solid ${s.color}22` }}>
            <div style={{ fontSize: 11, color: s.color, fontWeight: 600, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {pending.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8f0f7", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #e8f0f7" }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#0d1b2a" }}>Pending Invoices</h3>
            {selected.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 13, color: "#6b8fa8" }}>{selected.length} selected · {formatCurrency(totalSelected)}</span>
                <button onClick={submitSelected} style={{ background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                  Submit to Medical Aid
                </button>
              </div>
            )}
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f8fbfd" }}>
                <th style={{ padding: "10px 16px", width: 36 }}></th>
                {["Invoice #", "Patient", "Medical Aid", "Date", "Total"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 16px", color: "#6b8fa8", fontWeight: 500, fontSize: 11 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pending.map(inv => (
                <tr key={inv.id} style={{ borderBottom: "1px solid #f0f7fc", background: selected.includes(inv.id) ? "#f0faf9" : "" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <input type="checkbox" checked={selected.includes(inv.id)} onChange={() => toggle(inv.id)}
                      style={{ width: 16, height: 16, accentColor: "#1da9a0", cursor: "pointer" }} />
                  </td>
                  <td style={{ padding: "12px 16px", fontWeight: 700, color: "#1da9a0" }}>{inv.invoiceNo}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 500 }}>{inv.patientName}</td>
                  <td style={{ padding: "12px 16px", color: "#6b8fa8" }}>{inv.medicalAid || "Private"}</td>
                  <td style={{ padding: "12px 16px", color: "#6b8fa8" }}>{formatDate(inv.date)}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 600 }}>{formatCurrency(inv.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {submitted.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8f0f7" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #e8f0f7" }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#0d1b2a" }}>Submitted — Awaiting Payment</h3>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f8fbfd" }}>
                {["Invoice #", "Patient", "Medical Aid", "Date", "Total", ""].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 16px", color: "#6b8fa8", fontWeight: 500, fontSize: 11 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {submitted.map(inv => (
                <tr key={inv.id} style={{ borderBottom: "1px solid #f0f7fc" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 700, color: "#3b82f6" }}>{inv.invoiceNo}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 500 }}>{inv.patientName}</td>
                  <td style={{ padding: "12px 16px", color: "#6b8fa8" }}>{inv.medicalAid || "Private"}</td>
                  <td style={{ padding: "12px 16px", color: "#6b8fa8" }}>{formatDate(inv.date)}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 600 }}>{formatCurrency(inv.total)}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <button onClick={() => onUpdateStatus(inv.id, "paid")} style={{ background: "#ecfdf5", color: "#10b981", border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>
                      Mark Paid
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pending.length === 0 && submitted.length === 0 && (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8f0f7", padding: 60, textAlign: "center", color: "#6b8fa8" }}>
          <p style={{ fontSize: 32, margin: "0 0 8px" }}>✦</p>
          <p style={{ fontSize: 14, margin: 0 }}>All claims are up to date.</p>
        </div>
      )}
    </div>
  );
}

// ── App Root ──────────────────────────────────────────────────────────────────
const DEMO_PATIENTS = [
  { id: "P001", firstName: "Thandi", lastName: "Nkosi", dob: "1988-03-14", gender: "Female", idNumber: "8803145678082", phone: "082 345 6789", email: "thandi@mail.co.za", address: "45 Oak Ave, Rondebosch, Cape Town, 7700", medicalAid: "Discovery Health", medicalAidNo: "DH123456789", dependantCode: "00", createdAt: "2025-01-10" },
  { id: "P002", firstName: "Sipho", lastName: "Dlamini", dob: "1975-07-22", gender: "Male", idNumber: "7507225432087", phone: "083 111 2233", email: "sipho.d@work.co.za", address: "12 Main Rd, Bellville, 7530", medicalAid: "Bonitas", medicalAidNo: "BON987654", dependantCode: "01", createdAt: "2025-01-15" },
  { id: "P003", firstName: "Liezel", lastName: "van der Merwe", dob: "1995-11-08", gender: "Female", idNumber: "9511085678085", phone: "073 555 0099", email: "", address: "8 Berg St, Stellenbosch, 7600", medicalAid: "", medicalAidNo: "", dependantCode: "", createdAt: "2025-02-01" },
];

const DEMO_INVOICES = [
  {
    id: "I001", invoiceNo: "INV-100001", patientId: "P001", patientName: "Thandi Nkosi",
    medicalAid: "Discovery Health", medicalAidNo: "DH123456789", dependantCode: "00",
    date: "2025-04-01",
    lines: [
      { id: "L1", tariffCode: "1050", icd10Code: "Z01.0", stockCode: "", description: "Consultation: New patient - comprehensive examination", qty: 1, unitPrice: 520 },
      { id: "L2", tariffCode: "2200", icd10Code: "H52.1", stockCode: "", description: "Refraction - Spectacle prescription", qty: 1, unitPrice: 280 },
      { id: "L3", tariffCode: "", icd10Code: "", stockCode: "SPH-PAL-PREM", description: "Progressive Lens - Premium", qty: 2, unitPrice: 1950 },
      { id: "L4", tariffCode: "", icd10Code: "", stockCode: "COAT-AR", description: "Anti-Reflective Coating", qty: 2, unitPrice: 280 },
      { id: "L5", tariffCode: "", icd10Code: "", stockCode: "FRAME-MID", description: "Frame - Mid Range", qty: 1, unitPrice: 850 },
    ],
    notes: "", diagnosisNotes: "Patient presents with myopia OD -3.50/-0.50x180, OS -3.25 sph. Recommend premium progressive lenses.",
    subtotal: 5110, vat: 766.50, total: 5876.50, status: "submitted",
  },
  {
    id: "I002", invoiceNo: "INV-100002", patientId: "P002", patientName: "Sipho Dlamini",
    medicalAid: "Bonitas", medicalAidNo: "BON987654", dependantCode: "01",
    date: "2025-04-05",
    lines: [
      { id: "L6", tariffCode: "1052", icd10Code: "H40.1", stockCode: "", description: "Consultation: Follow-up examination", qty: 1, unitPrice: 350 },
      { id: "L7", tariffCode: "2240", icd10Code: "H40.1", stockCode: "", description: "Tonometry - intraocular pressure measurement", qty: 1, unitPrice: 180 },
      { id: "L8", tariffCode: "2250", icd10Code: "H40.1", stockCode: "", description: "Dilated fundus examination", qty: 1, unitPrice: 320 },
    ],
    notes: "", diagnosisNotes: "Follow up glaucoma monitoring. IOP stable at 16mmHg OU. Continue current management.",
    subtotal: 850, vat: 127.50, total: 977.50, status: "pending",
  },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [patients, setPatients] = useState(DEMO_PATIENTS);
  const [invoices, setInvoices] = useState(DEMO_INVOICES);

  const addPatient = useCallback((p) => setPatients(ps => [...ps, p]), []);
  const addInvoice = useCallback((inv) => setInvoices(is => [inv, ...is]), []);
  const updateStatus = useCallback((id, status) =>
    setInvoices(is => is.map(i => i.id === id ? { ...i, status } : i)), []);

  const counts = { patients: patients.length, invoices: invoices.length };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', -apple-system, sans-serif", background: "#f4f8fb" }}>
      <Sidebar current={page} onChange={setPage} counts={counts} />
      <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>
        {page === "dashboard" && <Dashboard patients={patients} invoices={invoices} onNav={setPage} />}
        {page === "patients" && <Patients patients={patients} onAdd={addPatient} onSelect={() => {}} />}
        {page === "invoices" && <InvoiceList invoices={invoices} onUpdateStatus={updateStatus} />}
        {page === "new-invoice" && <NewInvoice patients={patients} onSave={(inv) => { addInvoice(inv); setPage("invoices"); }} />}
        {page === "medical-aid" && <MedicalAid invoices={invoices} onUpdateStatus={updateStatus} />}
      </main>
    </div>
  );
}
