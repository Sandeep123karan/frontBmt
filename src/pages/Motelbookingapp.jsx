import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000/api"; // apna base URL yahan set karo

const theme = {
  bg: "#0a0a0f",
  card: "#12121a",
  cardBorder: "#1e1e2e",
  accent: "#f5a623",
  accentDark: "#c47d10",
  text: "#e8e8f0",
  muted: "#6b6b8a",
  success: "#2dce89",
  danger: "#f5365c",
  input: "#1a1a28",
};

const styles = {
  app: {
    minHeight: "100vh",
    background: theme.bg,
    color: theme.text,
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    padding: "0",
  },
  header: {
    background: "linear-gradient(135deg, #12121a 0%, #1a1a2e 100%)",
    borderBottom: `1px solid ${theme.cardBorder}`,
    padding: "18px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
    backdropFilter: "blur(12px)",
  },
  logo: {
    fontSize: "22px",
    fontWeight: "800",
    color: theme.accent,
    letterSpacing: "-0.5px",
  },
  logoSub: {
    fontSize: "11px",
    color: theme.muted,
    letterSpacing: "3px",
    textTransform: "uppercase",
    marginTop: "2px",
  },
  nav: { display: "flex", gap: "8px" },
  navBtn: (active) => ({
    padding: "8px 18px",
    borderRadius: "8px",
    border: active ? `1px solid ${theme.accent}` : `1px solid ${theme.cardBorder}`,
    background: active ? `${theme.accent}18` : "transparent",
    color: active ? theme.accent : theme.muted,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "all 0.2s",
  }),
  main: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "32px 24px",
  },
  section: {
    marginBottom: "40px",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "800",
    marginBottom: "8px",
    color: theme.text,
  },
  sectionSub: {
    fontSize: "13px",
    color: theme.muted,
    marginBottom: "28px",
  },
  card: {
    background: theme.card,
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: "16px",
    padding: "28px",
    marginBottom: "16px",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "16px",
  },
  label: {
    display: "block",
    fontSize: "11px",
    fontWeight: "700",
    color: theme.muted,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    background: theme.input,
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: "10px",
    color: theme.text,
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "12px 16px",
    background: theme.input,
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: "10px",
    color: theme.text,
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    cursor: "pointer",
  },
  btnPrimary: {
    width: "100%",
    padding: "14px",
    background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentDark})`,
    border: "none",
    borderRadius: "12px",
    color: "#0a0a0f",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
    letterSpacing: "0.3px",
    transition: "opacity 0.2s, transform 0.1s",
    marginTop: "8px",
  },
  btnDanger: {
    padding: "8px 16px",
    background: `${theme.danger}18`,
    border: `1px solid ${theme.danger}40`,
    borderRadius: "8px",
    color: theme.danger,
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  badge: (status) => {
    const colors = {
      pending: { bg: "#f5a62318", color: "#f5a623", border: "#f5a62340" },
      confirmed: { bg: "#2dce8918", color: "#2dce89", border: "#2dce8940" },
      cancelled: { bg: "#f5365c18", color: "#f5365c", border: "#f5365c40" },
      paid: { bg: "#2dce8918", color: "#2dce89", border: "#2dce8940" },
      failed: { bg: "#f5365c18", color: "#f5365c", border: "#f5365c40" },
    };
    const c = colors[status] || colors.pending;
    return {
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: "6px",
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
      fontSize: "11px",
      fontWeight: "700",
      letterSpacing: "1px",
      textTransform: "uppercase",
    };
  },
  toast: (type) => ({
    position: "fixed",
    bottom: "24px",
    right: "24px",
    padding: "14px 20px",
    background: type === "success" ? theme.success : theme.danger,
    color: "#fff",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
    zIndex: 999,
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    animation: "slideIn 0.3s ease",
  }),
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    fontSize: "14px",
    borderBottom: `1px solid ${theme.cardBorder}`,
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0 0",
    fontSize: "16px",
    fontWeight: "800",
    color: theme.accent,
  },
  bookingCard: {
    background: theme.card,
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "16px",
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: "16px",
    alignItems: "start",
  },
  bookingMeta: {
    fontSize: "13px",
    color: theme.muted,
    marginTop: "4px",
  },
  divider: {
    border: "none",
    borderTop: `1px solid ${theme.cardBorder}`,
    margin: "20px 0",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    color: theme.muted,
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  formRow: {
    marginBottom: "16px",
  },
  adminTable: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "12px 16px",
    fontSize: "11px",
    fontWeight: "700",
    color: theme.muted,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    borderBottom: `1px solid ${theme.cardBorder}`,
  },
  td: {
    padding: "14px 16px",
    fontSize: "13px",
    borderBottom: `1px solid ${theme.cardBorder}10`,
    verticalAlign: "middle",
  },
  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    color: theme.muted,
    fontSize: "14px",
  },
};

// ─── Toast ───────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  if (!msg) return null;
  return (
    <div style={styles.toast(type)}>
      {type === "success" ? "✓ " : "✕ "}
      {msg}
    </div>
  );
}

// ─── Price Preview ────────────────────────────────────────
function PricePreview({ price }) {
  if (!price) return null;
  return (
    <div style={{ ...styles.card, marginTop: "20px" }}>
      <div style={{ fontSize: "13px", fontWeight: "700", marginBottom: "12px", color: theme.muted, letterSpacing: "1px", textTransform: "uppercase" }}>
        Price Breakup
      </div>
      <div style={styles.priceRow}>
        <span>Base Price</span>
        <span>₹{price.basePrice?.toFixed(2)}</span>
      </div>
      <div style={styles.priceRow}>
        <span style={{ color: theme.success }}>Discount</span>
        <span style={{ color: theme.success }}>− ₹{price.discount?.toFixed(2)}</span>
      </div>
      <div style={styles.priceRow}>
        <span>Taxes & Fees</span>
        <span>₹{price.taxes?.toFixed(2)}</span>
      </div>
      <div style={styles.totalRow}>
        <span>Total Amount</span>
        <span>₹{price.totalAmount?.toFixed(2)}</span>
      </div>
    </div>
  );
}

// ─── Create Booking Form ──────────────────────────────────
function CreateBookingTab({ token, onToast }) {
  const [form, setForm] = useState({
    motelId: "",
    roomType: "",
    checkInDate: "",
    checkOutDate: "",
    totalGuests: 1,
    totalRooms: 1,
    contactDetails: { name: "", phone: "", email: "" },
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setContact = (k, v) =>
    setForm((f) => ({ ...f, contactDetails: { ...f.contactDetails, [k]: v } }));

  // Live price preview
  useEffect(() => {
    if (form.checkInDate && form.checkOutDate && form.totalRooms) {
      const nights = Math.ceil(
        (new Date(form.checkOutDate) - new Date(form.checkInDate)) /
          (1000 * 60 * 60 * 24)
      );
      if (nights > 0) {
        // Mock preview — actual price comes from server
        setPreview({ _nights: nights });
      } else {
        setPreview(null);
      }
    }
  }, [form.checkInDate, form.checkOutDate, form.totalRooms]);

  const handleSubmit = async () => {
    if (!form.motelId || !form.checkInDate || !form.checkOutDate) {
      onToast("Motel ID, Check-in & Check-out required", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/motel-bookings/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        onToast("Booking created successfully!", "success");
        setPreview(data.data?.priceBreakup || null);
        setForm({
          motelId: "", roomType: "", checkInDate: "", checkOutDate: "",
          totalGuests: 1, totalRooms: 1,
          contactDetails: { name: "", phone: "", email: "" },
        });
      } else {
        onToast(data.message || "Booking failed", "error");
      }
    } catch {
      onToast("Network error", "error");
    }
    setLoading(false);
  };

  return (
    <div style={styles.section}>
      <div style={styles.sectionTitle}>New Booking</div>
      <div style={styles.sectionSub}>Fill in the details to book a motel room</div>

      <div style={styles.card}>
        {/* Row 1 */}
        <div style={{ ...styles.grid2, marginBottom: "16px" }}>
          <div>
            <label style={styles.label}>Motel ID</label>
            <input style={styles.input} placeholder="e.g. 6643abc..." value={form.motelId}
              onChange={(e) => set("motelId", e.target.value)} />
          </div>
          <div>
            <label style={styles.label}>Room Type</label>
            <input style={styles.input} placeholder="e.g. Deluxe, Suite..." value={form.roomType}
              onChange={(e) => set("roomType", e.target.value)} />
          </div>
        </div>

        {/* Row 2 */}
        <div style={{ ...styles.grid3, marginBottom: "16px" }}>
          <div>
            <label style={styles.label}>Check-In</label>
            <input type="date" style={styles.input} value={form.checkInDate}
              onChange={(e) => set("checkInDate", e.target.value)} />
          </div>
          <div>
            <label style={styles.label}>Check-Out</label>
            <input type="date" style={styles.input} value={form.checkOutDate}
              onChange={(e) => set("checkOutDate", e.target.value)} />
          </div>
          <div>
            <label style={styles.label}>Total Rooms</label>
            <input type="number" min="1" style={styles.input} value={form.totalRooms}
              onChange={(e) => set("totalRooms", Number(e.target.value))} />
          </div>
        </div>

        {/* Row 3 */}
        <div style={{ ...styles.grid2, marginBottom: "16px" }}>
          <div>
            <label style={styles.label}>Total Guests</label>
            <input type="number" min="1" style={styles.input} value={form.totalGuests}
              onChange={(e) => set("totalGuests", Number(e.target.value))} />
          </div>
        </div>

        <hr style={styles.divider} />

        <div style={{ fontSize: "13px", fontWeight: "700", color: theme.muted, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }}>
          Contact Details
        </div>
        <div style={{ ...styles.grid3, marginBottom: "20px" }}>
          <div>
            <label style={styles.label}>Name</label>
            <input style={styles.input} placeholder="Full name" value={form.contactDetails.name}
              onChange={(e) => setContact("name", e.target.value)} />
          </div>
          <div>
            <label style={styles.label}>Phone</label>
            <input style={styles.input} placeholder="+91..." value={form.contactDetails.phone}
              onChange={(e) => setContact("phone", e.target.value)} />
          </div>
          <div>
            <label style={styles.label}>Email</label>
            <input style={styles.input} placeholder="email@..." value={form.contactDetails.email}
              onChange={(e) => setContact("email", e.target.value)} />
          </div>
        </div>

        {preview?._nights && (
          <div style={{ fontSize: "13px", color: theme.muted, marginBottom: "12px" }}>
            🌙 {preview._nights} night{preview._nights !== 1 ? "s" : ""}
          </div>
        )}

        <button style={{ ...styles.btnPrimary, opacity: loading ? 0.7 : 1 }}
          onClick={handleSubmit} disabled={loading}>
          {loading ? "Creating Booking..." : "Confirm Booking →"}
        </button>
      </div>
    </div>
  );
}

// ─── My Bookings ──────────────────────────────────────────
function MyBookingsTab({ token, onToast }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/motel-bookings/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setBookings(data.data);
    } catch {
      onToast("Failed to load bookings", "error");
    }
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    setCancelling(id);
    try {
      const res = await fetch(`${API_BASE}/motel-bookings/cancel/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        onToast("Booking cancelled", "success");
        fetchBookings();
      } else {
        onToast(data.message, "error");
      }
    } catch {
      onToast("Network error", "error");
    }
    setCancelling(null);
  };

  const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  if (loading) return <div style={styles.loader}>Loading your bookings...</div>;

  return (
    <div style={styles.section}>
      <div style={styles.sectionTitle}>My Bookings</div>
      <div style={styles.sectionSub}>{bookings.length} booking{bookings.length !== 1 ? "s" : ""} found</div>

      {bookings.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🛏️</div>
          <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>No bookings yet</div>
          <div style={{ fontSize: "13px" }}>Create your first booking above</div>
        </div>
      ) : (
        bookings.map((b) => (
          <div key={b._id} style={styles.bookingCard}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <span style={{ fontSize: "16px", fontWeight: "700" }}>
                  {b.motelId?.motelName || "Motel"}
                </span>
                <span style={styles.badge(b.bookingStatus)}>{b.bookingStatus}</span>
                <span style={styles.badge(b.paymentStatus)}>{b.paymentStatus}</span>
              </div>
              <div style={styles.bookingMeta}>
                🛏 {b.roomType || "—"} &nbsp;·&nbsp; 👥 {b.totalGuests} guest{b.totalGuests !== 1 ? "s" : ""} &nbsp;·&nbsp; 🚪 {b.totalRooms} room{b.totalRooms !== 1 ? "s" : ""}
              </div>
              <div style={{ ...styles.bookingMeta, marginTop: "6px" }}>
                📅 {fmt(b.checkInDate)} → {fmt(b.checkOutDate)} ({b.totalNights} night{b.totalNights !== 1 ? "s" : ""})
              </div>
              {b.priceBreakup && (
                <div style={{ ...styles.bookingMeta, marginTop: "8px" }}>
                  💰 Base: ₹{b.priceBreakup.basePrice?.toFixed(0)} &nbsp;·&nbsp;
                  Discount: ₹{b.priceBreakup.discount?.toFixed(0)} &nbsp;·&nbsp;
                  Tax: ₹{b.priceBreakup.taxes?.toFixed(0)} &nbsp;·&nbsp;
                  <strong style={{ color: theme.accent }}>Total: ₹{b.priceBreakup.totalAmount?.toFixed(0)}</strong>
                </div>
              )}
              {b.contactDetails?.name && (
                <div style={{ ...styles.bookingMeta, marginTop: "6px" }}>
                  👤 {b.contactDetails.name} &nbsp;·&nbsp; 📞 {b.contactDetails.phone}
                </div>
              )}
              <div style={{ ...styles.bookingMeta, marginTop: "6px", fontSize: "11px" }}>
                ID: {b._id}
              </div>
            </div>
            <div>
              {b.bookingStatus !== "cancelled" && (
                <button
                  style={{ ...styles.btnDanger, opacity: cancelling === b._id ? 0.6 : 1 }}
                  onClick={() => handleCancel(b._id)}
                  disabled={cancelling === b._id}
                >
                  {cancelling === b._id ? "..." : "Cancel"}
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── Admin All Bookings ───────────────────────────────────
function AdminTab({ token, onToast }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/motel-bookings/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setBookings(data.data);
        else onToast(data.message, "error");
      } catch {
        onToast("Network error", "error");
      }
      setLoading(false);
    })();
  }, []);

  const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  if (loading) return <div style={styles.loader}>Loading all bookings...</div>;

  return (
    <div style={styles.section}>
      <div style={styles.sectionTitle}>Admin — All Bookings</div>
      <div style={styles.sectionSub}>{bookings.length} total bookings</div>

      <div style={{ ...styles.card, padding: "0", overflow: "hidden" }}>
        <table style={styles.adminTable}>
          <thead>
            <tr>
              {["Motel", "User", "Room", "Check-In", "Check-Out", "Nights", "Total", "Status", "Payment"].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan={9} style={{ ...styles.td, textAlign: "center", color: theme.muted, padding: "40px" }}>No bookings found</td></tr>
            ) : bookings.map((b) => (
              <tr key={b._id} style={{ transition: "background 0.2s" }}>
                <td style={styles.td}>{b.motelId?.motelName || "—"}</td>
                <td style={styles.td}>
                  <div style={{ fontWeight: "600" }}>{b.userId?.name || "—"}</div>
                  <div style={{ fontSize: "11px", color: theme.muted }}>{b.userId?.email}</div>
                </td>
                <td style={styles.td}>{b.roomType || "—"}</td>
                <td style={styles.td}>{fmt(b.checkInDate)}</td>
                <td style={styles.td}>{fmt(b.checkOutDate)}</td>
                <td style={styles.td}>{b.totalNights}</td>
                <td style={{ ...styles.td, color: theme.accent, fontWeight: "700" }}>
                  ₹{b.priceBreakup?.totalAmount?.toFixed(0) || "—"}
                </td>
                <td style={styles.td}><span style={styles.badge(b.bookingStatus)}>{b.bookingStatus}</span></td>
                <td style={styles.td}><span style={styles.badge(b.paymentStatus)}>{b.paymentStatus}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────
export default function MotelBookingApp() {
  const [tab, setTab] = useState("create");
  const [toast, setToast] = useState({ msg: "", type: "success" });

  // Token — set karo apna actual JWT yahan ya localStorage se lo
  const token = localStorage.getItem("token") || "YOUR_JWT_TOKEN_HERE";

  const onToast = (msg, type = "success") => setToast({ msg, type });
  const clearToast = () => setToast({ msg: "", type: "success" });

  return (
    <div style={styles.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        input:focus, select:focus { border-color: #f5a623 !important; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.6); cursor: pointer; }
        button:hover { opacity: 0.88; }
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        tr:hover td { background: rgba(255,255,255,0.02); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #12121a; }
        ::-webkit-scrollbar-thumb { background: #2a2a3e; border-radius: 4px; }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.logo}>🏨 MotelBook</div>
          <div style={styles.logoSub}>Booking Management System</div>
        </div>
        <div style={styles.nav}>
          {[
            { key: "create", label: "➕ New Booking" },
            { key: "my", label: "📋 My Bookings" },
            { key: "admin", label: "🛠 Admin" },
          ].map((n) => (
            <button key={n.key} style={styles.navBtn(tab === n.key)} onClick={() => setTab(n.key)}>
              {n.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={styles.main}>
        {tab === "create" && <CreateBookingTab token={token} onToast={onToast} />}
        {tab === "my" && <MyBookingsTab token={token} onToast={onToast} />}
        {tab === "admin" && <AdminTab token={token} onToast={onToast} />}
      </div>

      {/* Toast */}
      {toast.msg && <Toast msg={toast.msg} type={toast.type} onClose={clearToast} />}
    </div>
  );
}