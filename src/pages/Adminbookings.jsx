import { useState, useEffect, useCallback } from "react";

const BASE_URL = "https://bmtadmin.onrender.com/api/apartment-bookings";
const PAGE_SIZE = 10;

/* ── helpers ── */
const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const esc = (s) => String(s ?? "—");

/* ── styles as JS object (inline) ── */
const css = {
  root: {
    fontFamily: "'Syne', sans-serif",
    background: "#0a0a0f",
    color: "#f0f0f5",
    minHeight: "100vh",
    padding: "32px 40px",
  },
};

/* ── Badge ── */
const statusColors = {
  pending:     { bg: "rgba(255,209,102,0.12)", color: "#ffd166" },
  confirmed:   { bg: "rgba(79,156,249,0.12)",  color: "#4f9cf9" },
  "checked-in":  { bg: "rgba(0,214,143,0.15)",   color: "#00d68f" },
  "checked-out": { bg: "rgba(111,111,128,0.15)", color: "#6b6b80" },
  cancelled:   { bg: "rgba(255,77,109,0.12)",  color: "#ff4d6d" },
  paid:        { bg: "rgba(0,214,143,0.15)",   color: "#00d68f" },
  failed:      { bg: "rgba(255,77,109,0.12)",  color: "#ff4d6d" },
};

function Badge({ value }) {
  const s = statusColors[value] || statusColors.pending;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "4px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 600, letterSpacing: 0.3,
      whiteSpace: "nowrap",
      background: s.bg, color: s.color,
    }}>
      <span style={{ fontSize: 7 }}>●</span>{value}
    </span>
  );
}

/* ── Toast ── */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);
  return { toasts, show };
}

function ToastStack({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10 }}>
      {toasts.map((t) => (
        <div key={t.id} style={{
          background: "#1a1a24", border: `1px solid ${t.type === "success" ? "#00d68f" : "#ff4d6d"}`,
          borderRadius: 12, padding: "14px 18px", fontSize: 13, fontWeight: 600,
          display: "flex", alignItems: "center", gap: 10, minWidth: 260, maxWidth: 340,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          animation: "toastIn 0.3s ease",
        }}>
          <span>{t.type === "success" ? "✅" : "⚠️"}</span> {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ── Modal ── */
function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(6px)", zIndex: 500,
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: open ? 1 : 0, pointerEvents: open ? "all" : "none",
        transition: "opacity 0.2s",
      }}
    >
      <div style={{
        background: "#111118", border: "1px solid #2a2a3a", borderRadius: 20,
        width: 560, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto",
        transform: open ? "translateY(0)" : "translateY(20px)",
        transition: "transform 0.3s",
      }}>
        <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid #2a2a3a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800 }}>{title}</h2>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8, background: "#1a1a24",
            border: "1px solid #2a2a3a", color: "#6b6b80", cursor: "pointer",
            fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>
        <div style={{ padding: "24px 28px" }}>{children}</div>
        {footer && <div style={{ padding: "20px 28px", borderTop: "1px solid #2a2a3a", display: "flex", gap: 10, justifyContent: "flex-end" }}>{footer}</div>}
      </div>
    </div>
  );
}

/* ── FormGroup ── */
function FormGroup({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 500, color: "#6b6b80", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", background: "#1a1a24", border: "1px solid #2a2a3a",
  borderRadius: 10, padding: "11px 14px", color: "#f0f0f5",
  fontFamily: "'Syne', sans-serif", fontSize: 14, outline: "none",
  transition: "border-color 0.2s", boxSizing: "border-box",
};

/* ── Btn ── */
function Btn({ children, onClick, variant = "primary", style: s = {} }) {
  const base = { padding: "10px 20px", borderRadius: 10, fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8 };
  const variants = {
    primary: { background: "#ff6b35", color: "#fff" },
    ghost: { background: "#1a1a24", color: "#f0f0f5", border: "1px solid #2a2a3a" },
    danger: { background: "#ff4d6d", color: "#fff" },
  };
  return <button onClick={onClick} style={{ ...base, ...variants[variant], ...s }}>{children}</button>;
}

/* ── Detail View ── */
function DetailBody({ b }) {
  const guest = b.contactDetails || {};
  const aptName = b.apartmentId?.name || "Apartment";
  const row = (label, value) => (
    <div key={label}>
      <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#6b6b80", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 4 }}>{label}</label>
      <span style={{ fontSize: 14, fontWeight: 600 }}>{value}</span>
    </div>
  );
  return (
    <div>
      <Section title="Booking Info">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {row("Booking ID", <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12 }}>{b._id}</span>)}
          {row("Created", new Date(b.createdAt).toLocaleString("en-IN"))}
          {row("Apartment", esc(aptName))}
          {row("Rooms · Guests", `${b.totalRooms} Rooms · ${b.totalGuests} Guests`)}
          {row("Check-In", fmt(b.checkInDate))}
          {row("Check-Out", fmt(b.checkOutDate))}
          {row("Nights", b.totalNights)}
          {row("Status", <Badge value={b.bookingStatus} />)}
        </div>
      </Section>
      <Section title="Guest Contact">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {row("Name", esc(guest.name))}
          {row("Phone", esc(guest.phone))}
          {row("Email", esc(guest.email))}
          {row("Payment", <Badge value={b.paymentStatus} />)}
        </div>
      </Section>
      <Section title="Price Breakdown">
        <div style={{ background: "#1a1a24", borderRadius: 12, padding: 16, border: "1px solid #2a2a3a" }}>
          {[
            [`₹${b.pricePerNight?.toLocaleString("en-IN")} × ${b.totalNights} nights × ${b.totalRooms} room(s)`, `₹${(b.pricePerNight * b.totalNights * (b.totalRooms || 1)).toLocaleString("en-IN")}`],
            ["Cleaning Fee", `₹${(b.cleaningFee || 0).toLocaleString("en-IN")}`],
            ["Service Fee", `₹${(b.serviceFee || 0).toLocaleString("en-IN")}`],
            ["Tax", `₹${(b.tax || 0).toLocaleString("en-IN")}`],
            ["Discount", <span style={{ color: "#00d68f" }}>- ₹{(b.discount || 0).toLocaleString("en-IN")}</span>],
          ].map(([l, v], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "5px 0", fontFamily: "'DM Mono', monospace", borderBottom: "1px solid #2a2a3a" }}>
              <span style={{ color: "#6b6b80" }}>{l}</span><span>{v}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#00d68f", paddingTop: 10, fontSize: 15, fontFamily: "'DM Mono', monospace" }}>
            <span>Total Amount</span><span>₹{(b.totalAmount || 0).toLocaleString("en-IN")}</span>
          </div>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <h4 style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 500, color: "#6b6b80", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>{title}</h4>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function AdminBookings() {
  const [allBookings, setAllBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [payFilter, setPayFilter] = useState("");
  const [page, setPage] = useState(1);
  const [detailBooking, setDetailBooking] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [cancelId, setCancelId] = useState(null);
  const [headerMeta, setHeaderMeta] = useState("Loading bookings...");
  const { toasts, show: showToast } = useToast();

  /* form state */
  const [form, setForm] = useState({ apartmentId: "", userId: "", checkIn: "", checkOut: "", guests: "", rooms: "", name: "", phone: "", email: "" });

  /* ── load ── */
  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/all`);
      const json = await res.json();
      if (json.success) {
        setAllBookings(json.data || []);
        setHeaderMeta(`${(json.data || []).length} total bookings — last refreshed ${new Date().toLocaleTimeString()}`);
      } else throw new Error(json.message);
    } catch (e) {
      showToast("Failed to load bookings: " + e.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  /* ── filter ── */
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(allBookings.filter((b) => {
      const guestName = b.contactDetails?.name?.toLowerCase() || "";
      const aptName = (b.apartmentId?.name || b.apartmentId?._id || "").toString().toLowerCase();
      const bId = (b._id || "").toLowerCase();
      return (
        (!q || guestName.includes(q) || aptName.includes(q) || bId.includes(q)) &&
        (!statusFilter || b.bookingStatus === statusFilter) &&
        (!payFilter || b.paymentStatus === payFilter)
      );
    }));
    setPage(1);
  }, [search, statusFilter, payFilter, allBookings]);

  /* ── stats ── */
  const stats = {
    total: allBookings.length,
    confirmed: allBookings.filter((b) => ["confirmed", "checked-in"].includes(b.bookingStatus)).length,
    cancelled: allBookings.filter((b) => b.bookingStatus === "cancelled").length,
    revenue: allBookings.filter((b) => b.paymentStatus === "paid").reduce((s, b) => s + (b.totalAmount || 0), 0),
  };

  /* ── pagination ── */
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* ── create ── */
  const createBooking = async () => {
    if (!form.apartmentId || !form.checkIn || !form.checkOut) return showToast("Please fill required fields", "error");
    try {
      const res = await fetch(`${BASE_URL}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apartmentId: form.apartmentId, userId: form.userId,
          checkInDate: form.checkIn, checkOutDate: form.checkOut,
          totalGuests: Number(form.guests), totalRooms: Number(form.rooms) || 1,
          contactDetails: { name: form.name, phone: form.phone, email: form.email },
        }),
      });
      const json = await res.json();
      if (json.success) { showToast("✅ Booking created!", "success"); setShowCreate(false); loadBookings(); }
      else throw new Error(json.message);
    } catch (e) { showToast("Error: " + e.message, "error"); }
  };

  /* ── cancel ── */
  const confirmCancel = async () => {
    if (!cancelId) return;
    try {
      const res = await fetch(`${BASE_URL}/cancel/${cancelId}`, { method: "PUT" });
      const json = await res.json();
      if (json.success) { showToast("🚫 Booking cancelled", "success"); setCancelId(null); loadBookings(); }
      else throw new Error(json.message);
    } catch (e) { showToast("Error: " + e.message, "error"); }
  };

  const fi = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0f; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes toastIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        .row-fade { animation: fadeUp 0.4s ease both; }
        .stat-hover:hover { border-color: #ff6b35 !important; }
        .action-btn:hover { border-color: #ff6b35 !important; color: #ff6b35 !important; background: rgba(255,107,53,0.08) !important; }
        .action-btn.danger:hover { border-color: #ff4d6d !important; color: #ff4d6d !important; background: rgba(255,77,109,0.08) !important; }
        .page-btn:hover { border-color: #ff6b35 !important; color: #ff6b35 !important; }
        input:focus, select:focus { border-color: #ff6b35 !important; }
        tr:hover td { background: #1a1a24; }
      `}</style>

      <div style={css.root}>

        {/* ── HEADER ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 36, animation: "fadeUp 0.5s ease" }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1, lineHeight: 1 }}>
              Apartment <span style={{ color: "#ff6b35" }}>Bookings</span>
            </h1>
            <p style={{ color: "#6b6b80", fontSize: 13, marginTop: 6, fontFamily: "'DM Mono', monospace" }}>{headerMeta}</p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Btn variant="ghost" onClick={loadBookings}>↺ Refresh</Btn>
            <Btn onClick={() => setShowCreate(true)}>＋ New Booking</Btn>
          </div>
        </div>

        {/* ── STATS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Total Bookings", value: stats.total, sub: "all time", color: "#ff6b35", cls: "orange" },
            { label: "Confirmed", value: stats.confirmed, sub: "active", color: "#00d68f", cls: "green" },
            { label: "Total Revenue", value: "₹" + stats.revenue.toLocaleString("en-IN"), sub: "paid bookings", color: "#4f9cf9", cls: "blue" },
            { label: "Cancelled", value: stats.cancelled, sub: "this period", color: "#ffd166", cls: "yellow" },
          ].map((s, i) => (
            <div key={i} className="stat-hover" style={{
              background: "#111118", border: "1px solid #2a2a3a", borderRadius: 16,
              padding: "22px 24px", position: "relative", overflow: "hidden",
              transition: "border-color 0.2s", animation: `fadeUp 0.5s ease ${i * 0.05 + 0.05}s both`,
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: s.color }} />
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#6b6b80", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#6b6b80", marginTop: 4, fontFamily: "'DM Mono', monospace" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── TOOLBAR ── */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#6b6b80", fontSize: 14, pointerEvents: "none" }}>🔍</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search guest, apartment, booking ID..."
              style={{ ...inputStyle, paddingLeft: 40 }} />
          </div>
          {[
            { id: "status", val: statusFilter, set: setStatusFilter, opts: [["", "All Status"], ["pending","Pending"], ["confirmed","Confirmed"], ["checked-in","Checked In"], ["checked-out","Checked Out"], ["cancelled","Cancelled"]] },
            { id: "pay", val: payFilter, set: setPayFilter, opts: [["", "All Payments"], ["pending","Pay Pending"], ["paid","Paid"], ["failed","Failed"]] },
          ].map((sel) => (
            <select key={sel.id} value={sel.val} onChange={(e) => sel.set(e.target.value)}
              style={{ ...inputStyle, width: "auto", fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>
              {sel.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          ))}
        </div>

        {/* ── TABLE ── */}
        <div style={{ background: "#111118", border: "1px solid #2a2a3a", borderRadius: 16, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#1a1a24", borderBottom: "1px solid #2a2a3a" }}>
              <tr>
                {["Booking ID","Guest","Apartment","Dates","Amount","Booking Status","Payment","Actions"].map((h) => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 500, color: "#6b6b80", textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ padding: "60px 20px", textAlign: "center", color: "#6b6b80", fontFamily: "'DM Mono', monospace", fontSize: 13 }}>
                  <span style={{ display: "inline-block", width: 20, height: 20, border: "2px solid #2a2a3a", borderTopColor: "#ff6b35", borderRadius: "50%", animation: "spin 0.7s linear infinite", marginRight: 10, verticalAlign: "middle" }} />
                  Loading bookings...
                </td></tr>
              ) : slice.length === 0 ? (
                <tr><td colSpan={8}>
                  <div style={{ padding: "80px 20px", textAlign: "center", color: "#6b6b80" }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
                    <h3 style={{ fontSize: 18, color: "#f0f0f5", marginBottom: 8 }}>No bookings found</h3>
                    <p style={{ fontSize: 13, fontFamily: "'DM Mono', monospace" }}>Try changing your search or filters</p>
                  </div>
                </td></tr>
              ) : slice.map((b, i) => {
                const id      = b._id || "—";
                const short   = id.slice(-8).toUpperCase();
                const guest   = b.contactDetails?.name || "—";
                const phone   = b.contactDetails?.phone || "";
                const aptName = b.apartmentId?.name || "Apartment";
                const rooms   = b.totalRooms || 1;
                const guests  = b.totalGuests || "—";
                const nights  = b.totalNights || "—";
                const amount  = b.totalAmount ? "₹" + Number(b.totalAmount).toLocaleString("en-IN") : "—";
                const bStatus = b.bookingStatus || "pending";
                const pStatus = b.paymentStatus || "pending";
                return (
                  <tr key={id} className="row-fade" style={{ borderBottom: "1px solid #2a2a3a", animationDelay: `${i * 0.04}s`, transition: "background 0.15s" }}>
                    <td style={{ padding: "16px 20px", verticalAlign: "middle" }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#6b6b80" }}>#{short}</div>
                      <div style={{ fontSize: 10, color: "#6b6b80", fontFamily: "'DM Mono', monospace", marginTop: 2 }}>{new Date(b.createdAt).toLocaleDateString("en-IN")}</div>
                    </td>
                    <td style={{ padding: "16px 20px", verticalAlign: "middle" }}>
                      <strong style={{ display: "block", fontSize: 14, fontWeight: 700 }}>{esc(guest)}</strong>
                      <span style={{ fontSize: 12, color: "#6b6b80", fontFamily: "'DM Mono', monospace" }}>{esc(phone)}</span>
                    </td>
                    <td style={{ padding: "16px 20px", verticalAlign: "middle" }}>
                      <div style={{ fontWeight: 700 }}>{esc(aptName)}</div>
                      <div style={{ fontSize: 11, color: "#6b6b80", fontFamily: "'DM Mono', monospace", marginTop: 2 }}>{rooms} room{rooms > 1 ? "s" : ""} · {guests} guest{guests > 1 ? "s" : ""}</div>
                    </td>
                    <td style={{ padding: "16px 20px", verticalAlign: "middle", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
                      {fmt(b.checkInDate)} → {fmt(b.checkOutDate)}<br />
                      <span style={{ display: "inline-block", background: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 6, padding: "2px 8px", fontSize: 10, marginTop: 4, color: "#6b6b80" }}>{nights} night{nights > 1 ? "s" : ""}</span>
                    </td>
                    <td style={{ padding: "16px 20px", verticalAlign: "middle", fontWeight: 700, fontSize: 15, fontFamily: "'DM Mono', monospace" }}>{amount}</td>
                    <td style={{ padding: "16px 20px", verticalAlign: "middle" }}><Badge value={bStatus} /></td>
                    <td style={{ padding: "16px 20px", verticalAlign: "middle" }}><Badge value={pStatus} /></td>
                    <td style={{ padding: "16px 20px", verticalAlign: "middle" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="action-btn" onClick={() => setDetailBooking(b)} title="View Details" style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #2a2a3a", background: "transparent", color: "#6b6b80", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, transition: "all 0.15s" }}>👁</button>
                        {bStatus !== "cancelled"
                          ? <button className="action-btn danger" onClick={() => setCancelId(id)} title="Cancel" style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #2a2a3a", background: "transparent", color: "#6b6b80", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, transition: "all 0.15s" }}>✕</button>
                          : <span style={{ fontSize: 11, color: "#6b6b80", fontFamily: "'DM Mono', monospace" }}>—</span>
                        }
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* ── PAGINATION ── */}
          {totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderTop: "1px solid #2a2a3a", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#6b6b80" }}>
              <span>Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="page-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}
                  style={{ width: 32, height: 32, borderRadius: 8, background: "#1a1a24", border: "1px solid #2a2a3a", color: "#6b6b80", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.3 : 1, fontWeight: 600, transition: "all 0.15s" }}>‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} className={p !== page ? "page-btn" : ""} onClick={() => setPage(p)}
                    style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #2a2a3a", cursor: "pointer", fontWeight: 600, transition: "all 0.15s", fontFamily: "'Syne', sans-serif", fontSize: 12, background: p === page ? "#ff6b35" : "#1a1a24", color: p === page ? "#fff" : "#6b6b80" }}>{p}</button>
                ))}
                <button className="page-btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}
                  style={{ width: 32, height: 32, borderRadius: 8, background: "#1a1a24", border: "1px solid #2a2a3a", color: "#6b6b80", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.3 : 1, fontWeight: 600, transition: "all 0.15s" }}>›</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── CREATE MODAL ── */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New Booking"
        footer={<><Btn variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Btn><Btn onClick={createBooking}>Create Booking</Btn></>}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <FormGroup label="Apartment ID"><input style={inputStyle} value={form.apartmentId} onChange={fi("apartmentId")} placeholder="ObjectId..." /></FormGroup>
          <FormGroup label="User ID"><input style={inputStyle} value={form.userId} onChange={fi("userId")} placeholder="ObjectId..." /></FormGroup>
          <FormGroup label="Check-In Date"><input type="date" style={inputStyle} value={form.checkIn} onChange={fi("checkIn")} /></FormGroup>
          <FormGroup label="Check-Out Date"><input type="date" style={inputStyle} value={form.checkOut} onChange={fi("checkOut")} /></FormGroup>
          <FormGroup label="Total Guests"><input type="number" style={inputStyle} value={form.guests} onChange={fi("guests")} placeholder="2" min="1" /></FormGroup>
          <FormGroup label="Total Rooms"><input type="number" style={inputStyle} value={form.rooms} onChange={fi("rooms")} placeholder="1" min="1" /></FormGroup>
        </div>
        <div style={{ background: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 12, padding: 16, marginTop: 4 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#6b6b80", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Contact Details</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <FormGroup label="Name"><input style={inputStyle} value={form.name} onChange={fi("name")} placeholder="Guest Name" /></FormGroup>
            <FormGroup label="Phone"><input style={inputStyle} value={form.phone} onChange={fi("phone")} placeholder="+91 98765..." /></FormGroup>
          </div>
          <FormGroup label="Email"><input type="email" style={inputStyle} value={form.email} onChange={fi("email")} placeholder="guest@email.com" /></FormGroup>
        </div>
      </Modal>

      {/* ── DETAIL MODAL ── */}
      <Modal open={!!detailBooking} onClose={() => setDetailBooking(null)} title="Booking Details"
        footer={<Btn variant="ghost" onClick={() => setDetailBooking(null)}>Close</Btn>}>
        {detailBooking && <DetailBody b={detailBooking} />}
      </Modal>

      {/* ── CANCEL CONFIRM ── */}
      <Modal open={!!cancelId} onClose={() => setCancelId(null)} title=""
        footer={<><Btn variant="ghost" onClick={() => setCancelId(null)}>Keep It</Btn><Btn variant="danger" onClick={confirmCancel}>Yes, Cancel</Btn></>}>
        <div style={{ textAlign: "center", paddingTop: 8 }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>⚠️</div>
          <h2 style={{ fontSize: 20, marginBottom: 12 }}>Cancel Booking?</h2>
          <p style={{ color: "#6b6b80", fontSize: 14, lineHeight: 1.6 }}>This action will cancel the booking and mark it as cancelled. This cannot be undone.</p>
        </div>
      </Modal>

      <ToastStack toasts={toasts} />
    </>
  );
}