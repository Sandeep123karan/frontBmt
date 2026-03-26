import { useState, useEffect } from "react";

const API_BASE = "https://bmtadmin.onrender.com/api/hostel-bookings";

const STATUS_COLORS = {
  pending: { bg: "#FFF3CD", color: "#856404", border: "#FFEAA7" },
  confirmed: { bg: "#D1ECF1", color: "#0C5460", border: "#BEE5EB" },
  "checked-in": { bg: "#D4EDDA", color: "#155724", border: "#C3E6CB" },
  "checked-out": { bg: "#E2E3E5", color: "#383D41", border: "#D6D8DB" },
  cancelled: { bg: "#F8D7DA", color: "#721C24", border: "#F5C6CB" },
};

const PAYMENT_COLORS = {
  pending: "#F39C12",
  paid: "#27AE60",
  failed: "#E74C3C",
};

/* ─── TOAST ─── */
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 9999,
      background: type === "error" ? "#E74C3C" : "#1A1A2E",
      color: "#fff", padding: "14px 22px", borderRadius: 10,
      fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      borderLeft: `4px solid ${type === "error" ? "#FF6B6B" : "#4ECDC4"}`,
      animation: "slideIn .3s ease"
    }}>
      {msg}
    </div>
  );
}

/* ─── BADGE ─── */
function Badge({ label, colorMap }) {
  const s = colorMap[label] || { bg: "#eee", color: "#333", border: "#ccc" };
  return (
    <span style={{
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
      letterSpacing: .4
    }}>
      {label}
    </span>
  );
}

/* ─── MODAL ─── */
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(10,10,20,.7)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20
    }} onClick={onClose}>
      <div style={{
        background: "#13131F", border: "1px solid #2A2A40", borderRadius: 16,
        padding: 32, width: "100%", maxWidth: 520, maxHeight: "90vh",
        overflowY: "auto", boxShadow: "0 24px 60px rgba(0,0,0,.5)"
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, color: "#F0F0FF", fontFamily: "'Playfair Display', serif", fontSize: 20 }}>{title}</h2>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: "#888", fontSize: 22,
            cursor: "pointer", lineHeight: 1
          }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─── INPUT ─── */
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", color: "#AAA", fontSize: 12, fontWeight: 600,
        letterSpacing: .6, marginBottom: 6, fontFamily: "'DM Sans', sans-serif",
        textTransform: "uppercase" }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", background: "#0D0D1A", border: "1px solid #2A2A40",
  borderRadius: 8, padding: "10px 14px", color: "#F0F0FF",
  fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: "none",
  boxSizing: "border-box", transition: "border .2s"
};

/* ─── STAT CARD ─── */
function StatCard({ icon, label, value, accent }) {
  return (
    <div style={{
      background: "#13131F", border: `1px solid ${accent}33`,
      borderRadius: 14, padding: "20px 24px",
      borderTop: `3px solid ${accent}`,
      minWidth: 140
    }}>
      <div style={{ fontSize: 26, marginBottom: 6 }}>{icon}</div>
      <div style={{ color: accent, fontSize: 26, fontWeight: 700,
        fontFamily: "'Playfair Display', serif" }}>{value}</div>
      <div style={{ color: "#777", fontSize: 12, fontWeight: 500,
        fontFamily: "'DM Sans', sans-serif", letterSpacing: .5, marginTop: 2 }}>{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════ */
export default function HostelBookingApp() {
  const [tab, setTab] = useState("dashboard");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "success" });
  const [selected, setSelected] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [statusModal, setStatusModal] = useState({ open: false, bookingId: null });
  const [newStatus, setNewStatus] = useState("confirmed");

  /* ── CREATE FORM STATE ── */
  const [form, setForm] = useState({
    hostelId: "", roomTypeId: "", checkInDate: "", checkOutDate: "",
    totalGuests: 1, totalBeds: 1, bookingType: "daily",
    contactDetails: { name: "", phone: "", email: "" },
    userId: "6650000000000000000"
  });

  const notify = (msg, type = "success") => setToast({ msg, type });

  /* ── FETCH BOOKINGS ── */
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/all`);
      const data = await res.json();
      if (data.success) setBookings(data.bookings);
      else notify(data.message, "error");
    } catch {
      notify("Failed to load bookings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  /* ── STATS ── */
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.bookingStatus === "confirmed").length,
    checkedIn: bookings.filter(b => b.bookingStatus === "checked-in").length,
    cancelled: bookings.filter(b => b.bookingStatus === "cancelled").length,
    revenue: bookings.filter(b => b.paymentStatus === "paid")
      .reduce((s, b) => s + (b.totalAmount || 0), 0),
  };

  /* ── CREATE BOOKING ── */
  const handleCreate = async () => {
    try {
      const res = await fetch(`${API_BASE}/create`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        notify("Booking created successfully! 🎉");
        setCreateOpen(false);
        fetchBookings();
        setForm({
          hostelId: "", roomTypeId: "", checkInDate: "", checkOutDate: "",
          totalGuests: 1, totalBeds: 1, bookingType: "daily",
          contactDetails: { name: "", phone: "", email: "" },
          userId: "6650000000000000000"
        });
      } else {
        notify(data.message, "error");
      }
    } catch {
      notify("Network error", "error");
    }
  };

  /* ── CANCEL BOOKING ── */
  const handleCancel = async (id) => {
    if (!confirm("Cancel this booking?")) return;
    try {
      const res = await fetch(`${API_BASE}/cancel/${id}`, { method: "PUT" });
      const data = await res.json();
      if (data.success) { notify("Booking cancelled"); fetchBookings(); setDetailOpen(false); }
      else notify(data.message, "error");
    } catch { notify("Network error", "error"); }
  };

  /* ── UPDATE STATUS ── */
  const handleStatusUpdate = async () => {
    try {
      const res = await fetch(`${API_BASE}/status/${statusModal.bookingId}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        notify("Status updated");
        setStatusModal({ open: false, bookingId: null });
        fetchBookings();
        setDetailOpen(false);
      } else notify(data.message, "error");
    } catch { notify("Network error", "error"); }
  };

  const openDetail = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`);
      const data = await res.json();
      if (data.success) { setSelected(data.booking); setDetailOpen(true); }
      else notify(data.message, "error");
    } catch { notify("Network error", "error"); }
  };

  const f = (amount) => `₹${(amount || 0).toLocaleString("en-IN")}`;
  const fd = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  /* ── FILTERED BOOKINGS ── */
  const filtered = tab === "dashboard" ? bookings
    : bookings.filter(b =>
        tab === "active" ? ["pending","confirmed","checked-in"].includes(b.bookingStatus)
        : tab === "cancelled" ? b.bookingStatus === "cancelled"
        : true
      );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #0A0A14; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0A0A14; }
        ::-webkit-scrollbar-thumb { background: #2A2A40; border-radius: 3px; }
        input:focus, select:focus { border-color: #4ECDC4 !important; }
        @keyframes slideIn { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        .row-hover:hover { background: #1A1A2E !important; cursor: pointer; }
        .btn-primary { background: linear-gradient(135deg, #4ECDC4, #44B8B0); color: #0A0A14;
          border: none; padding: 10px 22px; border-radius: 8px; font-weight: 600;
          font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer;
          transition: opacity .2s; }
        .btn-primary:hover { opacity: .85; }
        .btn-danger { background: transparent; color: #E74C3C; border: 1px solid #E74C3C;
          padding: 8px 18px; border-radius: 8px; font-weight: 600;
          font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; transition: all .2s; }
        .btn-danger:hover { background: #E74C3C; color: #fff; }
        .btn-ghost { background: transparent; color: #AAA; border: 1px solid #2A2A40;
          padding: 8px 18px; border-radius: 8px; font-weight: 500;
          font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; transition: all .2s; }
        .btn-ghost:hover { border-color: #4ECDC4; color: #4ECDC4; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0A0A14", color: "#F0F0FF",
        fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── HEADER ── */}
        <header style={{
          background: "#13131F", borderBottom: "1px solid #1E1E30",
          padding: "0 32px", display: "flex", alignItems: "center",
          justifyContent: "space-between", height: 64, position: "sticky", top: 0, zIndex: 100
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, background: "linear-gradient(135deg,#4ECDC4,#44B8B0)",
              borderRadius: 9, display: "grid", placeItems: "center", fontSize: 18
            }}>🏨</div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700,
              color: "#F0F0FF", letterSpacing: .5 }}>StayDesk</span>
          </div>

          <nav style={{ display: "flex", gap: 4 }}>
            {[
              { id: "dashboard", label: "Dashboard" },
              { id: "active", label: "Active" },
              { id: "cancelled", label: "Cancelled" },
              { id: "all", label: "All Bookings" },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                background: tab === t.id ? "#1E1E30" : "none",
                border: "none", color: tab === t.id ? "#4ECDC4" : "#888",
                padding: "8px 16px", borderRadius: 8, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
                transition: "all .2s", borderBottom: tab === t.id ? "2px solid #4ECDC4" : "2px solid transparent"
              }}>{t.label}</button>
            ))}
          </nav>

          <button className="btn-primary" onClick={() => setCreateOpen(true)}>
            + New Booking
          </button>
        </header>

        <main style={{ padding: "32px", maxWidth: 1200, margin: "0 auto", animation: "fadeUp .4s ease" }}>

          {/* ── STATS ── */}
          {tab === "dashboard" && (
            <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
              <StatCard icon="📋" label="Total Bookings" value={stats.total} accent="#4ECDC4" />
              <StatCard icon="✅" label="Confirmed" value={stats.confirmed} accent="#2ECC71" />
              <StatCard icon="🔑" label="Checked In" value={stats.checkedIn} accent="#3498DB" />
              <StatCard icon="❌" label="Cancelled" value={stats.cancelled} accent="#E74C3C" />
              <StatCard icon="💰" label="Revenue (Paid)" value={f(stats.revenue)} accent="#F39C12" />
            </div>
          )}

          {/* ── TABLE ── */}
          <div style={{ background: "#13131F", border: "1px solid #1E1E30",
            borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #1E1E30",
              display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontFamily: "'Playfair Display', serif",
                fontSize: 18, color: "#F0F0FF" }}>
                {tab === "dashboard" ? "Recent Bookings" : tab === "active" ? "Active Bookings"
                  : tab === "cancelled" ? "Cancelled Bookings" : "All Bookings"}
              </h3>
              <button onClick={fetchBookings} className="btn-ghost">
                {loading ? "⟳ Loading..." : "⟳ Refresh"}
              </button>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#0D0D1A" }}>
                    {["Booking ID","Guest","Hostel","Type","Check-in","Amount","Payment","Status","Actions"]
                      .map(h => (
                        <th key={h} style={{
                          padding: "12px 16px", textAlign: "left",
                          color: "#666", fontSize: 11, fontWeight: 600,
                          letterSpacing: .8, textTransform: "uppercase",
                          borderBottom: "1px solid #1E1E30"
                        }}>{h}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={9} style={{ padding: 40, textAlign: "center", color: "#555" }}>
                      Loading bookings...
                    </td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={9} style={{ padding: 40, textAlign: "center", color: "#555" }}>
                      No bookings found
                    </td></tr>
                  ) : filtered.map((b, i) => (
                    <tr key={b._id} className="row-hover"
                      style={{ borderBottom: "1px solid #1A1A2A",
                        background: i % 2 === 0 ? "#13131F" : "#111119" }}>
                      <td style={{ padding: "14px 16px", fontSize: 12, color: "#4ECDC4",
                        fontWeight: 600, fontFamily: "monospace" }}>
                        #{b._id?.slice(-6).toUpperCase()}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontWeight: 500, fontSize: 14 }}>
                          {b.contactDetails?.name || b.userId?.name || "—"}
                        </div>
                        <div style={{ color: "#666", fontSize: 12 }}>
                          {b.contactDetails?.phone || ""}
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#CCC" }}>
                        {b.hostelId?.name || b.hostelId?.toString()?.slice(-6) || "—"}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{
                          background: b.bookingType === "daily" ? "#1A2744" : "#1A2A1A",
                          color: b.bookingType === "daily" ? "#5B9BD5" : "#5BC85B",
                          padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600
                        }}>{b.bookingType}</span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#CCC" }}>
                        {fd(b.checkInDate)}
                      </td>
                      <td style={{ padding: "14px 16px", fontWeight: 600,
                        color: "#F0F0FF", fontSize: 14 }}>
                        {f(b.totalAmount)}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{
                          color: PAYMENT_COLORS[b.paymentStatus] || "#888",
                          fontWeight: 600, fontSize: 13
                        }}>● {b.paymentStatus}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <Badge label={b.bookingStatus} colorMap={STATUS_COLORS} />
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => openDetail(b._id)}
                            style={{ background: "none", border: "1px solid #2A2A40",
                              color: "#4ECDC4", padding: "5px 12px", borderRadius: 6,
                              cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                            View
                          </button>
                          {b.bookingStatus !== "cancelled" && b.bookingStatus !== "checked-out" && (
                            <button onClick={() => handleCancel(b._id)}
                              style={{ background: "none", border: "1px solid #E74C3C22",
                                color: "#E74C3C", padding: "5px 10px", borderRadius: 6,
                                cursor: "pointer", fontSize: 12 }}>
                              ✕
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* ══════════ CREATE BOOKING MODAL ══════════ */}
        <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Booking">
          <Field label="Hostel ID">
            <input style={inputStyle} placeholder="MongoDB ObjectId"
              value={form.hostelId} onChange={e => setForm({...form, hostelId: e.target.value})} />
          </Field>
          <Field label="Room Type ID">
            <input style={inputStyle} placeholder="Room type ObjectId"
              value={form.roomTypeId} onChange={e => setForm({...form, roomTypeId: e.target.value})} />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Booking Type">
              <select style={inputStyle} value={form.bookingType}
                onChange={e => setForm({...form, bookingType: e.target.value})}>
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
              </select>
            </Field>
            <Field label="Total Guests">
              <input style={inputStyle} type="number" min={1} value={form.totalGuests}
                onChange={e => setForm({...form, totalGuests: +e.target.value})} />
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Check-in Date">
              <input style={inputStyle} type="date" value={form.checkInDate}
                onChange={e => setForm({...form, checkInDate: e.target.value})} />
            </Field>
            {form.bookingType === "daily" && (
              <Field label="Check-out Date">
                <input style={inputStyle} type="date" value={form.checkOutDate}
                  onChange={e => setForm({...form, checkOutDate: e.target.value})} />
              </Field>
            )}
          </div>

          <div style={{ borderTop: "1px solid #1E1E30", marginTop: 12, paddingTop: 16,
            marginBottom: 12 }}>
            <p style={{ color: "#666", fontSize: 12, fontWeight: 600,
              letterSpacing: .6, textTransform: "uppercase", marginBottom: 10 }}>
              Contact Details
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Name">
                <input style={inputStyle} placeholder="Guest name"
                  value={form.contactDetails.name}
                  onChange={e => setForm({...form, contactDetails: {...form.contactDetails, name: e.target.value}})} />
              </Field>
              <Field label="Phone">
                <input style={inputStyle} placeholder="+91 XXXXX"
                  value={form.contactDetails.phone}
                  onChange={e => setForm({...form, contactDetails: {...form.contactDetails, phone: e.target.value}})} />
              </Field>
            </div>
            <Field label="Email">
              <input style={inputStyle} type="email" placeholder="guest@email.com"
                value={form.contactDetails.email}
                onChange={e => setForm({...form, contactDetails: {...form.contactDetails, email: e.target.value}})} />
            </Field>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button className="btn-ghost" onClick={() => setCreateOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleCreate}>Create Booking</button>
          </div>
        </Modal>

        {/* ══════════ DETAIL MODAL ══════════ */}
        <Modal open={detailOpen} onClose={() => setDetailOpen(false)}
          title={`Booking #${selected?._id?.slice(-6).toUpperCase()}`}>
          {selected && (
            <div style={{ animation: "fadeUp .3s ease" }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <Badge label={selected.bookingStatus} colorMap={STATUS_COLORS} />
                <span style={{
                  background: "#1A1A2E", color: PAYMENT_COLORS[selected.paymentStatus],
                  padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                  border: `1px solid ${PAYMENT_COLORS[selected.paymentStatus]}44`
                }}>💳 {selected.paymentStatus}</span>
              </div>

              {[
                ["Guest", selected.contactDetails?.name || "—"],
                ["Phone", selected.contactDetails?.phone || "—"],
                ["Email", selected.contactDetails?.email || "—"],
                ["Booking Type", selected.bookingType],
                ["Check-in", fd(selected.checkInDate)],
                ["Check-out", fd(selected.checkOutDate)],
                ["Total Guests", selected.totalGuests],
                ["Total Beds", selected.totalBeds],
                ["Price/Day", f(selected.pricePerDay)],
                ["Price/Month", f(selected.pricePerMonth)],
                ["Total Amount", f(selected.totalAmount)],
              ].map(([k, v]) => (
                <div key={k} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "9px 0", borderBottom: "1px solid #1A1A28"
                }}>
                  <span style={{ color: "#666", fontSize: 13 }}>{k}</span>
                  <span style={{ color: "#F0F0FF", fontWeight: 500, fontSize: 13 }}>{v}</span>
                </div>
              ))}

              {selected.specialRequest && (
                <div style={{ background: "#0D0D1A", border: "1px solid #2A2A40",
                  borderRadius: 8, padding: 12, marginTop: 12 }}>
                  <p style={{ color: "#666", fontSize: 11, fontWeight: 600,
                    letterSpacing: .6, textTransform: "uppercase", margin: "0 0 6px" }}>
                    Special Request</p>
                  <p style={{ color: "#CCC", fontSize: 13, margin: 0 }}>{selected.specialRequest}</p>
                </div>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 8 }}>
                  {selected.bookingStatus !== "cancelled" && selected.bookingStatus !== "checked-out" && (
                    <button className="btn-danger" onClick={() => handleCancel(selected._id)}>
                      Cancel Booking
                    </button>
                  )}
                  <button className="btn-ghost" onClick={() => {
                    setStatusModal({ open: true, bookingId: selected._id });
                    setNewStatus(selected.bookingStatus);
                  }}>Update Status</button>
                </div>
                <button className="btn-ghost" onClick={() => setDetailOpen(false)}>Close</button>
              </div>
            </div>
          )}
        </Modal>

        {/* ══════════ STATUS UPDATE MODAL ══════════ */}
        <Modal open={statusModal.open}
          onClose={() => setStatusModal({ open: false, bookingId: null })}
          title="Update Booking Status">
          <Field label="New Status">
            <select style={inputStyle} value={newStatus}
              onChange={e => setNewStatus(e.target.value)}>
              {["pending","confirmed","checked-in","checked-out","cancelled"].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
            <button className="btn-ghost"
              onClick={() => setStatusModal({ open: false, bookingId: null })}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleStatusUpdate}>
              Update Status
            </button>
          </div>
        </Modal>

        <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: "", type: "success" })} />
      </div>
    </>
  );
}