import { useState, useEffect } from "react";

/* ─── CONFIG ─── */
const API = "http://localhost:9000/api"; // change to your base URL
// const token = () => localStorage.getItem("token") || "";

const token = () => localStorage.getItem("adminToken") || "";
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token()}`,
});

/* ─── HELPERS ─── */
const fmt = (n) =>
  n?.toLocaleString("en-IN", { style: "currency", currency: "INR" });

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const statusColor = (s) =>
  ({ confirmed: "#22c55e", pending: "#f59e0b", cancelled: "#ef4444" }[s] || "#94a3b8");

/* ═══════════════════════════════════════════════════
   APP
═══════════════════════════════════════════════════ */
export default function App() {
  const [view, setView] = useState("bookings"); // bookings | create | admin
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div style={styles.root}>
      {/* ── BACKGROUND TEXTURE ── */}
      <div style={styles.bgOverlay} />

      {/* ── HEADER ── */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>⛺</span>
            <span style={styles.logoText}>WildStay</span>
          </div>
          <nav style={styles.nav}>
            {[
              { id: "bookings", label: "My Bookings" },
              { id: "create", label: "Book Now" },
              { id: "admin", label: "Admin" },
            ].map((n) => (
              <button
                key={n.id}
                style={{ ...styles.navBtn, ...(view === n.id ? styles.navBtnActive : {}) }}
                onClick={() => setView(n.id)}
              >
                {n.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main style={styles.main}>
        {view === "bookings" && <MyBookings showToast={showToast} />}
        {view === "create" && <CreateBooking showToast={showToast} onDone={() => setView("bookings")} />}
        {view === "admin" && <AdminBookings showToast={showToast} />}
      </main>

      {/* ── TOAST ── */}
      {toast && (
        <div style={{ ...styles.toast, background: toast.type === "error" ? "#ef4444" : "#22c55e" }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CREATE BOOKING
═══════════════════════════════════════════════════ */
function CreateBooking({ showToast, onDone }) {
  const [form, setForm] = useState({
    parkId: "",
    checkInDate: "",
    checkOutDate: "",
    totalGuests: 1,
    totalRooms: 1,
    contactDetails: { name: "", phone: "", email: "" },
    guests: [{ name: "", age: "", gender: "male" }],
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));
  const setContact = (field, val) =>
    setForm((f) => ({ ...f, contactDetails: { ...f.contactDetails, [field]: val } }));

  const addGuest = () =>
    setForm((f) => ({ ...f, guests: [...f.guests, { name: "", age: "", gender: "male" }] }));

  const updateGuest = (i, field, val) =>
    setForm((f) => {
      const g = [...f.guests];
      g[i] = { ...g[i], [field]: val };
      return { ...f, guests: g };
    });

  const removeGuest = (i) =>
    setForm((f) => ({ ...f, guests: f.guests.filter((_, idx) => idx !== i) }));

  const calcPreview = () => {
    if (!form.checkInDate || !form.checkOutDate) return;
    const nights = Math.ceil(
      (new Date(form.checkOutDate) - new Date(form.checkInDate)) / (1000 * 60 * 60 * 24)
    );
    if (nights <= 0) return showToast("Invalid dates", "error");
    const base = 3500 * form.totalRooms * nights; // placeholder price
    const disc = (base * 10) / 100;
    const taxed = base - disc;
    const taxes = (taxed * 12) / 100;
    setPreview({ nights, base, disc, taxes, total: taxed + taxes });
  };

  const submit = async () => {
    if (!form.parkId) return showToast("Enter Park ID", "error");
    setLoading(true);
    try {
      const r = await fetch(`${API}/holidaypark-bookings/create`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message);
      showToast("Booking created successfully! 🎉");
      onDone();
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrap}>
      <SectionTitle icon="🏕️" title="Book a Holiday Park" sub="Fill in the details below to reserve your stay" />

      <div style={styles.card}>
        {/* Park & Dates */}
        <FieldGroup label="Property & Dates">
          <Input label="Park ID" value={form.parkId} onChange={(v) => set("parkId", v)} placeholder="Enter park ObjectId" />
          <div style={styles.row2}>
            <Input label="Check-In Date" type="date" value={form.checkInDate} onChange={(v) => set("checkInDate", v)} />
            <Input label="Check-Out Date" type="date" value={form.checkOutDate} onChange={(v) => set("checkOutDate", v)} />
          </div>
          <div style={styles.row2}>
            <Input label="Total Guests" type="number" value={form.totalGuests} onChange={(v) => set("totalGuests", +v)} min={1} />
            <Input label="Total Rooms" type="number" value={form.totalRooms} onChange={(v) => set("totalRooms", +v)} min={1} />
          </div>
          <button style={styles.outlineBtn} onClick={calcPreview}>
            📊 Preview Price
          </button>
        </FieldGroup>

        {/* Price Preview */}
        {preview && (
          <div style={styles.priceCard}>
            <div style={styles.priceTitle}>Price Breakdown</div>
            <PriceRow label={`Base Price (${preview.nights} nights)`} val={fmt(preview.base)} />
            <PriceRow label="Discount (10%)" val={`- ${fmt(preview.disc)}`} accent="#22c55e" />
            <PriceRow label="GST (12%)" val={fmt(preview.taxes)} accent="#f59e0b" />
            <div style={styles.priceDivider} />
            <PriceRow label="Total Amount" val={fmt(preview.total)} bold />
          </div>
        )}

        {/* Contact Details */}
        <FieldGroup label="Contact Details">
          <div style={styles.row2}>
            <Input label="Full Name" value={form.contactDetails.name} onChange={(v) => setContact("name", v)} />
            <Input label="Phone" value={form.contactDetails.phone} onChange={(v) => setContact("phone", v)} />
          </div>
          <Input label="Email" type="email" value={form.contactDetails.email} onChange={(v) => setContact("email", v)} />
        </FieldGroup>

        {/* Guests */}
        <FieldGroup label="Guest Details">
          {form.guests.map((g, i) => (
            <div key={i} style={styles.guestRow}>
              <span style={styles.guestNum}>#{i + 1}</span>
              <Input label="Name" value={g.name} onChange={(v) => updateGuest(i, "name", v)} />
              <Input label="Age" type="number" value={g.age} onChange={(v) => updateGuest(i, "age", v)} style={{ maxWidth: 80 }} />
              <Select
                label="Gender"
                value={g.gender}
                onChange={(v) => updateGuest(i, "gender", v)}
                options={["male", "female", "other"]}
              />
              {i > 0 && (
                <button style={styles.removeBtn} onClick={() => removeGuest(i)}>✕</button>
              )}
            </div>
          ))}
          <button style={styles.outlineBtn} onClick={addGuest}>+ Add Guest</button>
        </FieldGroup>

        <button style={{ ...styles.primaryBtn, opacity: loading ? 0.7 : 1 }} onClick={submit} disabled={loading}>
          {loading ? "Creating..." : "🎯 Confirm Booking"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MY BOOKINGS
═══════════════════════════════════════════════════ */
function MyBookings({ showToast }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/holidaypark-bookings/my`, { headers: authHeaders() });
      const d = await r.json();
      setBookings(d.data || []);
    } catch {
      showToast("Failed to load bookings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!confirm("Cancel this booking?")) return;
    setCancelling(id);
    try {
      const r = await fetch(`${API}/holiday-park-bookings/cancel/${id}`, {
        method: "PUT",
        headers: authHeaders(),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message);
      showToast("Booking cancelled");
      load();
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div style={styles.pageWrap}>
      <SectionTitle icon="📋" title="My Bookings" sub="All your holiday park reservations" />

      {loading ? (
        <LoadingGrid />
      ) : bookings.length === 0 ? (
        <EmptyState icon="🏕️" msg="No bookings yet. Start exploring!" />
      ) : (
        <div style={styles.grid}>
          {bookings.map((b) => (
            <BookingCard key={b._id} booking={b} onCancel={() => cancel(b._id)} cancelling={cancelling === b._id} isAdmin={false} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ADMIN BOOKINGS
═══════════════════════════════════════════════════ */
function AdminBookings({ showToast }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/holiday-park-bookings/all`, { headers: authHeaders() });
      const d = await r.json();
      setBookings(d.data || []);
    } catch {
      showToast("Failed to load. Are you admin?", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = bookings.filter((b) => {
    const matchStatus = filter === "all" || b.bookingStatus === filter;
    const matchSearch =
      !search ||
      b.propertyName?.toLowerCase().includes(search.toLowerCase()) ||
      b.contactDetails?.name?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.bookingStatus === "confirmed").length,
    pending: bookings.filter((b) => b.bookingStatus === "pending").length,
    cancelled: bookings.filter((b) => b.bookingStatus === "cancelled").length,
    revenue: bookings
      .filter((b) => b.bookingStatus !== "cancelled")
      .reduce((s, b) => s + (b.priceBreakup?.totalAmount || 0), 0),
  };

  return (
    <div style={styles.pageWrap}>
      <SectionTitle icon="🛠️" title="Admin Dashboard" sub="Manage all holiday park bookings" />

      {/* Stats */}
      <div style={styles.statsGrid}>
        <StatCard label="Total Bookings" val={stats.total} icon="📦" color="#6366f1" />
        <StatCard label="Confirmed" val={stats.confirmed} icon="✅" color="#22c55e" />
        <StatCard label="Pending" val={stats.pending} icon="⏳" color="#f59e0b" />
        <StatCard label="Cancelled" val={stats.cancelled} icon="❌" color="#ef4444" />
        <StatCard label="Revenue" val={fmt(stats.revenue)} icon="💰" color="#10b981" wide />
      </div>

      {/* Filters */}
      <div style={styles.filterBar}>
        <input
          style={styles.searchInput}
          placeholder="🔍  Search by park or guest name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div style={styles.filterBtns}>
          {["all", "confirmed", "pending", "cancelled"].map((s) => (
            <button
              key={s}
              style={{ ...styles.filterBtn, ...(filter === s ? styles.filterBtnActive : {}) }}
              onClick={() => setFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingGrid />
      ) : filtered.length === 0 ? (
        <EmptyState icon="🔍" msg="No bookings match your filter" />
      ) : (
        <div style={styles.grid}>
          {filtered.map((b) => (
            <BookingCard key={b._id} booking={b} isAdmin />
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   BOOKING CARD
═══════════════════════════════════════════════════ */
function BookingCard({ booking: b, onCancel, cancelling, isAdmin }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={styles.bookingCard}>
      {/* Header */}
      <div style={styles.bookingCardHeader}>
        <div>
          <div style={styles.parkName}>{b.propertyName || "Holiday Park"}</div>
          <div style={styles.bookingId}>ID: {b._id?.slice(-8).toUpperCase()}</div>
        </div>
        <span style={{ ...styles.statusBadge, background: statusColor(b.bookingStatus) + "22", color: statusColor(b.bookingStatus), borderColor: statusColor(b.bookingStatus) + "44" }}>
          {b.bookingStatus}
        </span>
      </div>

      {/* Dates */}
      <div style={styles.datesRow}>
        <div style={styles.dateBox}>
          <div style={styles.dateLabel}>CHECK-IN</div>
          <div style={styles.dateVal}>{fmtDate(b.checkInDate)}</div>
        </div>
        <div style={styles.nightsBadge}>{b.totalNights}N</div>
        <div style={styles.dateBox}>
          <div style={styles.dateLabel}>CHECK-OUT</div>
          <div style={styles.dateVal}>{fmtDate(b.checkOutDate)}</div>
        </div>
      </div>

      {/* Quick Info */}
      <div style={styles.quickInfo}>
        <Chip icon="👥" val={`${b.totalGuests} Guests`} />
        <Chip icon="🛏️" val={`${b.totalRooms} Rooms`} />
        <Chip icon="💳" val={b.paymentStatus} />
      </div>

      {/* Price */}
      <div style={styles.totalRow}>
        <span style={styles.totalLabel}>Total Amount</span>
        <span style={styles.totalVal}>{fmt(b.priceBreakup?.totalAmount)}</span>
      </div>

      {/* Expand */}
      <button style={styles.expandBtn} onClick={() => setExpanded((e) => !e)}>
        {expanded ? "▲ Hide Details" : "▼ Show Details"}
      </button>

      {expanded && (
        <div style={styles.expandedSection}>
          {/* Price Breakup */}
          <div style={styles.expandGroup}>
            <div style={styles.expandGroupTitle}>Price Breakup</div>
            <PriceRow label="Base Price" val={fmt(b.priceBreakup?.basePrice)} />
            <PriceRow label="Discount" val={`- ${fmt(b.priceBreakup?.discount)}`} accent="#22c55e" />
            <PriceRow label="GST (12%)" val={fmt(b.priceBreakup?.taxes)} accent="#f59e0b" />
          </div>

          {/* Contact */}
          {b.contactDetails && (
            <div style={styles.expandGroup}>
              <div style={styles.expandGroupTitle}>Contact</div>
              <div style={styles.expandRow}><span>👤</span> {b.contactDetails.name}</div>
              <div style={styles.expandRow}><span>📞</span> {b.contactDetails.phone}</div>
              <div style={styles.expandRow}><span>✉️</span> {b.contactDetails.email}</div>
            </div>
          )}

          {/* Guests */}
          {b.guests?.length > 0 && (
            <div style={styles.expandGroup}>
              <div style={styles.expandGroupTitle}>Guests</div>
              {b.guests.map((g, i) => (
                <div key={i} style={styles.guestTag}>
                  {g.name} · {g.age}yr · {g.gender}
                </div>
              ))}
            </div>
          )}

          {/* Admin extra */}
          {isAdmin && b.userId && (
            <div style={styles.expandGroup}>
              <div style={styles.expandGroupTitle}>User</div>
              <div style={styles.expandRow}>{b.userId?.name || b.userId?.email || b.userId?._id}</div>
            </div>
          )}
        </div>
      )}

      {/* Cancel Button */}
      {!isAdmin && b.bookingStatus === "pending" && (
        <button
          style={{ ...styles.cancelBtn, opacity: cancelling ? 0.6 : 1 }}
          onClick={onCancel}
          disabled={cancelling}
        >
          {cancelling ? "Cancelling..." : "✕ Cancel Booking"}
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SMALL COMPONENTS
═══════════════════════════════════════════════════ */
function SectionTitle({ icon, title, sub }) {
  return (
    <div style={styles.sectionTitle}>
      <div style={styles.sectionIcon}>{icon}</div>
      <div>
        <h2 style={styles.sectionH2}>{title}</h2>
        <p style={styles.sectionSub}>{sub}</p>
      </div>
    </div>
  );
}

function FieldGroup({ label, children }) {
  return (
    <div style={styles.fieldGroup}>
      <div style={styles.fieldGroupLabel}>{label}</div>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder, min, style: extraStyle }) {
  return (
    <div style={{ ...styles.inputWrap, ...extraStyle }}>
      {label && <label style={styles.label}>{label}</label>}
      <input
        type={type}
        value={value}
        min={min}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={styles.input}
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div style={styles.inputWrap}>
      {label && <label style={styles.label}>{label}</label>}
      <select value={value} onChange={(e) => onChange(e.target.value)} style={styles.input}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function PriceRow({ label, val, bold, accent }) {
  return (
    <div style={styles.priceRow}>
      <span style={{ color: "#94a3b8", fontSize: 13 }}>{label}</span>
      <span style={{ fontWeight: bold ? 700 : 500, color: accent || (bold ? "#f1f5f9" : "#cbd5e1"), fontSize: bold ? 16 : 14 }}>{val}</span>
    </div>
  );
}

function StatCard({ label, val, icon, color, wide }) {
  return (
    <div style={{ ...styles.statCard, ...(wide ? { gridColumn: "span 2" } : {}), borderTop: `3px solid ${color}` }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div style={{ ...styles.statVal, color }}>{val}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}

function Chip({ icon, val }) {
  return <span style={styles.chip}>{icon} {val}</span>;
}

function EmptyState({ icon, msg }) {
  return (
    <div style={styles.empty}>
      <div style={styles.emptyIcon}>{icon}</div>
      <div style={styles.emptyMsg}>{msg}</div>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div style={styles.grid}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={styles.skeleton} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════ */
const styles = {
  root: {
    minHeight: "100vh",
    background: "#0a0f1e",
    fontFamily: "'Sora', 'Segoe UI', sans-serif",
    color: "#e2e8f0",
    position: "relative",
  },
  bgOverlay: {
    position: "fixed", inset: 0, zIndex: 0,
    background: "radial-gradient(ellipse 80% 50% at 50% -20%, #1e3a5f44, transparent), radial-gradient(ellipse 60% 40% at 80% 80%, #16423344, transparent)",
    pointerEvents: "none",
  },
  header: {
    position: "sticky", top: 0, zIndex: 100,
    background: "rgba(10,15,30,0.85)",
    backdropFilter: "blur(16px)",
    borderBottom: "1px solid #1e293b",
  },
  headerInner: {
    maxWidth: 1200, margin: "0 auto", padding: "0 24px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    height: 64,
  },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoIcon: { fontSize: 28 },
  logoText: { fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", color: "#38bdf8" },
  nav: { display: "flex", gap: 6 },
  navBtn: {
    background: "transparent", border: "1px solid transparent",
    color: "#64748b", padding: "8px 18px", borderRadius: 8,
    cursor: "pointer", fontSize: 14, fontWeight: 500, transition: "all 0.2s",
  },
  navBtnActive: {
    background: "#0ea5e922", borderColor: "#0ea5e944",
    color: "#38bdf8",
  },
  main: { maxWidth: 1200, margin: "0 auto", padding: "32px 24px", position: "relative", zIndex: 1 },
  pageWrap: { display: "flex", flexDirection: "column", gap: 28 },

  /* Section Title */
  sectionTitle: { display: "flex", alignItems: "center", gap: 16 },
  sectionIcon: { fontSize: 40, lineHeight: 1 },
  sectionH2: { margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px", color: "#f1f5f9" },
  sectionSub: { margin: "4px 0 0", fontSize: 14, color: "#64748b" },

  /* Card */
  card: {
    background: "#0f172a", border: "1px solid #1e293b",
    borderRadius: 16, padding: 28, display: "flex", flexDirection: "column", gap: 24,
  },

  /* Field Group */
  fieldGroup: { display: "flex", flexDirection: "column", gap: 14 },
  fieldGroupLabel: {
    fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#475569",
    textTransform: "uppercase", paddingBottom: 4, borderBottom: "1px solid #1e293b",
  },

  /* Input */
  inputWrap: { display: "flex", flexDirection: "column", gap: 6, flex: 1 },
  label: { fontSize: 12, fontWeight: 600, color: "#64748b", letterSpacing: 0.3 },
  input: {
    background: "#1e293b", border: "1px solid #334155",
    borderRadius: 8, padding: "10px 14px", color: "#f1f5f9",
    fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  },
  row2: { display: "flex", gap: 14 },

  /* Buttons */
  primaryBtn: {
    background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
    border: "none", borderRadius: 10, padding: "14px 28px",
    color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
    letterSpacing: 0.3, transition: "all 0.2s",
  },
  outlineBtn: {
    background: "transparent", border: "1px solid #334155",
    borderRadius: 8, padding: "10px 18px", color: "#94a3b8",
    fontSize: 13, fontWeight: 600, cursor: "pointer",
    alignSelf: "flex-start",
  },
  cancelBtn: {
    background: "#ef444415", border: "1px solid #ef444433",
    borderRadius: 8, padding: "10px 18px", color: "#ef4444",
    fontSize: 13, fontWeight: 600, cursor: "pointer", width: "100%",
    marginTop: 8,
  },
  expandBtn: {
    background: "transparent", border: "none",
    color: "#38bdf8", fontSize: 12, fontWeight: 600,
    cursor: "pointer", padding: "8px 0 0", textAlign: "left",
  },
  removeBtn: {
    background: "#ef444415", border: "none", borderRadius: 6,
    color: "#ef4444", width: 32, height: 32, cursor: "pointer",
    fontSize: 12, flexShrink: 0, alignSelf: "flex-end",
  },

  /* Price Card */
  priceCard: {
    background: "#1e293b", borderRadius: 12, padding: "18px 20px",
    border: "1px solid #334155", display: "flex", flexDirection: "column", gap: 8,
  },
  priceTitle: { fontSize: 12, fontWeight: 700, letterSpacing: 1.2, color: "#475569", textTransform: "uppercase", marginBottom: 4 },
  priceRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  priceDivider: { height: 1, background: "#334155", margin: "4px 0" },

  /* Grid */
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 },

  /* Booking Card */
  bookingCard: {
    background: "#0f172a", border: "1px solid #1e293b",
    borderRadius: 16, padding: 22, display: "flex", flexDirection: "column", gap: 14,
    transition: "border-color 0.2s",
  },
  bookingCardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  parkName: { fontSize: 17, fontWeight: 700, color: "#f1f5f9" },
  bookingId: { fontSize: 11, color: "#475569", fontFamily: "monospace", marginTop: 2 },
  statusBadge: {
    fontSize: 11, fontWeight: 700, letterSpacing: 0.8,
    padding: "4px 10px", borderRadius: 6, border: "1px solid",
    textTransform: "uppercase",
  },

  /* Dates */
  datesRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    background: "#1e293b", borderRadius: 10, padding: "12px 16px",
  },
  dateBox: { display: "flex", flexDirection: "column", gap: 2 },
  dateLabel: { fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: "#475569", textTransform: "uppercase" },
  dateVal: { fontSize: 14, fontWeight: 600, color: "#e2e8f0" },
  nightsBadge: {
    background: "#0ea5e922", color: "#38bdf8", border: "1px solid #0ea5e933",
    borderRadius: 6, padding: "4px 10px", fontSize: 12, fontWeight: 700,
  },

  /* Quick info */
  quickInfo: { display: "flex", gap: 8, flexWrap: "wrap" },
  chip: {
    background: "#1e293b", border: "1px solid #334155",
    borderRadius: 6, padding: "4px 10px", fontSize: 12, color: "#94a3b8",
  },

  /* Total */
  totalRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    background: "#0ea5e911", borderRadius: 8, padding: "10px 14px",
    border: "1px solid #0ea5e922",
  },
  totalLabel: { fontSize: 12, fontWeight: 600, color: "#64748b" },
  totalVal: { fontSize: 18, fontWeight: 800, color: "#38bdf8" },

  /* Expanded */
  expandedSection: {
    background: "#1e293b22", borderRadius: 10, padding: "14px 16px",
    display: "flex", flexDirection: "column", gap: 14,
    border: "1px solid #1e293b",
  },
  expandGroup: { display: "flex", flexDirection: "column", gap: 6 },
  expandGroupTitle: { fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: "#475569", textTransform: "uppercase", marginBottom: 4 },
  expandRow: { fontSize: 13, color: "#94a3b8", display: "flex", gap: 8, alignItems: "center" },
  guestTag: {
    background: "#1e293b", border: "1px solid #334155",
    borderRadius: 6, padding: "4px 10px", fontSize: 12, color: "#94a3b8",
    display: "inline-block", marginRight: 6, marginBottom: 4,
  },

  /* Guest Row */
  guestRow: { display: "flex", gap: 10, alignItems: "flex-end" },
  guestNum: { fontSize: 12, color: "#475569", fontWeight: 700, paddingBottom: 10, flexShrink: 0 },

  /* Stats */
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 14 },
  statCard: {
    background: "#0f172a", border: "1px solid #1e293b",
    borderRadius: 12, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 6,
  },
  statVal: { fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" },
  statLabel: { fontSize: 12, color: "#64748b" },

  /* Filter Bar */
  filterBar: { display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" },
  searchInput: {
    background: "#0f172a", border: "1px solid #1e293b",
    borderRadius: 10, padding: "10px 16px", color: "#f1f5f9",
    fontSize: 14, outline: "none", flex: 1, minWidth: 220, fontFamily: "inherit",
  },
  filterBtns: { display: "flex", gap: 6 },
  filterBtn: {
    background: "transparent", border: "1px solid #1e293b",
    borderRadius: 7, padding: "8px 14px", color: "#64748b",
    fontSize: 13, fontWeight: 500, cursor: "pointer",
  },
  filterBtnActive: { background: "#0ea5e922", borderColor: "#0ea5e944", color: "#38bdf8" },

  /* Toast */
  toast: {
    position: "fixed", bottom: 28, right: 28, zIndex: 9999,
    padding: "12px 22px", borderRadius: 10, color: "#fff",
    fontSize: 14, fontWeight: 600, boxShadow: "0 8px 32px #0008",
    animation: "slideUp 0.3s ease",
  },

  /* Empty / Loading */
  empty: { textAlign: "center", padding: "60px 20px" },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyMsg: { color: "#475569", fontSize: 15 },
  skeleton: {
    background: "linear-gradient(90deg, #1e293b 25%, #283548 50%, #1e293b 75%)",
    borderRadius: 16, height: 280,
    animation: "pulse 1.5s infinite",
  },
};