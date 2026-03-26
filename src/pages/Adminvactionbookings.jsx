import { useState, useEffect, useMemo } from "react";

const API = "https://bmtadmin.onrender.com/api/vacation-bookings";
const token = () => localStorage.getItem("token");
const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token()}`,
});
const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const STATUS_COLORS = {
  confirmed: { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" },
  pending:   { bg: "#fef9c3", color: "#854d0e", border: "#fde047" },
  cancelled: { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" },
};
const PAY_COLORS = {
  paid:    { bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" },
  pending: { bg: "#f3f4f6", color: "#4b5563", border: "#d1d5db" },
  failed:  { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" },
};

/* ════════════════════════════════════════════
   ADMIN PANEL ROOT
════════════════════════════════════════════ */
export default function AdminPanel() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [payFilter, setPayFilter]       = useState("all");
  const [sortBy, setSortBy]             = useState("newest");
  const [selected, setSelected]         = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const r = await fetch(`${API}/all`, { headers: headers() });
        const d = await r.json();
        setBookings(d.data || []);
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── DERIVED ── */
  const filtered = useMemo(() => {
    let list = [...bookings];
    if (statusFilter !== "all") list = list.filter((b) => b.bookingStatus === statusFilter);
    if (payFilter !== "all")    list = list.filter((b) => b.paymentStatus === payFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.vacationHouseId?.propertyName?.toLowerCase().includes(q) ||
          b.userId?.name?.toLowerCase().includes(q) ||
          b.userId?.email?.toLowerCase().includes(q) ||
          b._id.includes(q)
      );
    }
    if (sortBy === "newest")  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === "oldest")  list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sortBy === "highest") list.sort((a, b) => (b.priceBreakup?.totalAmount || 0) - (a.priceBreakup?.totalAmount || 0));
    return list;
  }, [bookings, statusFilter, payFilter, search, sortBy]);

  /* ── STATS ── */
  const stats = useMemo(() => ({
    total:     bookings.length,
    confirmed: bookings.filter((b) => b.bookingStatus === "confirmed").length,
    cancelled: bookings.filter((b) => b.bookingStatus === "cancelled").length,
    revenue:   bookings
      .filter((b) => b.paymentStatus === "paid")
      .reduce((s, b) => s + (b.priceBreakup?.totalAmount || 0), 0),
  }), [bookings]);

  return (
    <div style={s.root}>
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* ── TOPBAR ── */}
      <div style={s.topbar}>
        <div style={s.topbarLeft}>
          <span style={s.logoIcon}>⌂</span>
          <h1 style={s.pageTitle}>Bookings Management</h1>
        </div>
        <div style={s.topbarRight}>
          <div style={s.searchWrap}>
            <span style={s.searchIcon}>⌕</span>
            <input
              style={s.searchInput}
              placeholder="Search by guest, property, ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={s.content}>

        {/* STAT CARDS */}
        <div style={s.statsRow}>
          <StatCard label="Total Bookings" val={stats.total} icon="📦" color="#6366f1" />
          <StatCard label="Confirmed"      val={stats.confirmed} icon="✅" color="#22c55e" />
          <StatCard label="Cancelled"      val={stats.cancelled} icon="❌" color="#ef4444" />
          <StatCard
            label="Revenue (Paid)"
            val={`₹${Math.round(stats.revenue).toLocaleString()}`}
            icon="💰"
            color="#f59e0b"
          />
        </div>

        {/* FILTERS */}
        <div style={s.filterBar}>
          <FilterGroup
            label="Status"
            opts={["all", "confirmed", "pending", "cancelled"]}
            val={statusFilter}
            onChange={setStatusFilter}
          />
          <FilterGroup
            label="Payment"
            opts={["all", "paid", "pending", "failed"]}
            val={payFilter}
            onChange={setPayFilter}
          />
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={s.filterLabel}>Sort</span>
            <select
              style={s.select}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        {loading ? (
          <div style={s.loadingBox}>Loading bookings…</div>
        ) : filtered.length === 0 ? (
          <div style={s.emptyBox}>No bookings found</div>
        ) : (
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr style={s.thead}>
                  {["Booking ID", "Property", "Guest", "Dates", "Nights", "Amount", "Status", "Payment", "Actions"].map((h) => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => (
                  <tr key={b._id} style={{ ...s.tr, background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={s.td}>
                      <span style={s.idChip}>#{b._id.slice(-6).toUpperCase()}</span>
                    </td>
                    <td style={s.td}>
                      <span style={s.propName}>{b.vacationHouseId?.propertyName || "—"}</span>
                    </td>
                    <td style={s.td}>
                      <div style={s.guestName}>{b.userId?.name || "—"}</div>
                      <div style={s.guestEmail}>{b.userId?.email || "—"}</div>
                    </td>
                    <td style={s.td}>
                      <div style={s.dateCell}>{fmt(b.checkInDate)}</div>
                      <div style={s.dateSub}>→ {fmt(b.checkOutDate)}</div>
                    </td>
                    <td style={{ ...s.td, textAlign: "center", fontWeight: 700 }}>{b.totalNights}</td>
                    <td style={s.td}>
                      <div style={s.amountCell}>₹{Math.round(b.priceBreakup?.totalAmount || 0).toLocaleString()}</div>
                    </td>
                    <td style={s.td}>
                      <StatusBadge val={b.bookingStatus} map={STATUS_COLORS} />
                    </td>
                    <td style={s.td}>
                      <StatusBadge val={b.paymentStatus} map={PAY_COLORS} />
                    </td>
                    <td style={s.td}>
                      <button style={s.viewBtn} onClick={() => setSelected(b)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={s.tableFooter}>
          Showing {filtered.length} of {bookings.length} bookings
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selected && <DetailModal booking={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

/* ── DETAIL MODAL ── */
function DetailModal({ booking: b, onClose }) {
  return (
    <div style={s.modalOverlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <div style={s.modalHeader}>
          <div>
            <div style={s.modalTitle}>{b.vacationHouseId?.propertyName || "Booking"}</div>
            <div style={s.modalId}>ID: {b._id}</div>
          </div>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={s.modalGrid}>
          <InfoSection title="Dates & Stay">
            <InfoRow label="Check-In"  val={fmt(b.checkInDate)} />
            <InfoRow label="Check-Out" val={fmt(b.checkOutDate)} />
            <InfoRow label="Nights"    val={b.totalNights} />
            <InfoRow label="Guests"    val={b.totalGuests} />
            <InfoRow label="Rooms"     val={b.totalRooms} />
          </InfoSection>

          <InfoSection title="Contact">
            <InfoRow label="Name"  val={b.contactDetails?.name} />
            <InfoRow label="Phone" val={b.contactDetails?.phone} />
            <InfoRow label="Email" val={b.contactDetails?.email} />
          </InfoSection>

          <InfoSection title="Price Breakup">
            <InfoRow label="Base Price" val={`₹${b.priceBreakup?.basePrice?.toLocaleString()}`} />
            <InfoRow label="Discount"   val={`−₹${b.priceBreakup?.discount?.toLocaleString()}`} color="#22c55e" />
            <InfoRow label="Taxes"      val={`+₹${b.priceBreakup?.taxes?.toLocaleString()}`} />
            <InfoRow label="Total"      val={`₹${Math.round(b.priceBreakup?.totalAmount || 0).toLocaleString()}`} bold />
          </InfoSection>

          <InfoSection title="Status">
            <InfoRow label="Booking" val={b.bookingStatus} />
            <InfoRow label="Payment" val={b.paymentStatus} />
            <InfoRow label="Created" val={fmt(b.createdAt)} />
          </InfoSection>
        </div>

        {b.guests?.length > 0 && (
          <div style={s.guestsSection}>
            <div style={s.infoSectionTitle}>Guests</div>
            <div style={s.guestsGrid}>
              {b.guests.map((g, i) => (
                <div key={i} style={s.guestChip}>
                  <strong>{g.name || "Guest"}</strong>
                  <span> · {g.age}y · {g.gender}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── small components ── */
const StatCard = ({ label, val, icon, color }) => (
  <div style={{ ...s.statCard, borderTop: `3px solid ${color}` }}>
    <div style={s.statIcon}>{icon}</div>
    <div style={{ ...s.statVal, color }}>{val}</div>
    <div style={s.statLabel}>{label}</div>
  </div>
);

const FilterGroup = ({ label, opts, val, onChange }) => (
  <div style={s.filterGroup}>
    <span style={s.filterLabel}>{label}</span>
    {opts.map((o) => (
      <button
        key={o}
        style={{ ...s.filterBtn, ...(val === o ? s.filterBtnActive : {}) }}
        onClick={() => onChange(o)}
      >
        {o.charAt(0).toUpperCase() + o.slice(1)}
      </button>
    ))}
  </div>
);

const StatusBadge = ({ val, map }) => {
  const c = map[val] || { bg: "#f3f4f6", color: "#4b5563", border: "#d1d5db" };
  return (
    <span style={{
      ...s.badge,
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
    }}>
      {val}
    </span>
  );
};

const InfoSection = ({ title, children }) => (
  <div style={s.infoSection}>
    <div style={s.infoSectionTitle}>{title}</div>
    {children}
  </div>
);

const InfoRow = ({ label, val, color, bold }) => (
  <div style={s.infoRow}>
    <span style={s.infoLabel}>{label}</span>
    <span style={{ ...s.infoVal, color: color || "#111827", fontWeight: bold ? 700 : 500 }}>{val || "—"}</span>
  </div>
);

/* ════════════════════════════════════════════
   STYLES
════════════════════════════════════════════ */
const s = {
  root: {
    minHeight: "100vh",
    background: "#f8f9fc",
    fontFamily: "'DM Sans', sans-serif",
    color: "#111827",
  },

  /* topbar */
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    height: 64,
    background: "#0f172a",
    gap: 16,
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  topbarLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  logoIcon: { fontSize: 22, color: "#f59e0b" },
  pageTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 20,
    fontWeight: 800,
    color: "#f1f5f9",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  topbarRight: { display: "flex", gap: 12, alignItems: "center" },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: 10,
    padding: "0 14px",
    gap: 8,
    width: 300,
  },
  searchIcon: { fontSize: 16, color: "#64748b" },
  searchInput: {
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 14,
    color: "#f1f5f9",
    padding: "10px 0",
    width: "100%",
    fontFamily: "'DM Sans', sans-serif",
  },

  /* main content */
  content: { padding: "0 32px 32px" },

  /* stats */
  statsRow: { display: "flex", gap: 16, padding: "24px 0 0" },
  statCard: {
    flex: 1,
    background: "#fff",
    borderRadius: 14,
    padding: "20px 20px 16px",
    boxShadow: "0 1px 4px #0000000a",
  },
  statIcon: { fontSize: 20, marginBottom: 10 },
  statVal: { fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 4 },
  statLabel: { fontSize: 12, color: "#6b7280", fontWeight: 500 },

  /* filters */
  filterBar: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "16px 20px",
    background: "#fff",
    margin: "20px 0 0",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    flexWrap: "wrap",
  },
  filterGroup: { display: "flex", alignItems: "center", gap: 6 },
  filterLabel: { fontSize: 12, color: "#6b7280", fontWeight: 600, marginRight: 4, textTransform: "uppercase", letterSpacing: "0.5px" },
  filterBtn: {
    padding: "5px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    background: "transparent",
    color: "#4b5563",
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    transition: "all 0.15s",
  },
  filterBtnActive: { background: "#0f172a", color: "#f1f5f9", border: "1px solid #0f172a" },
  select: {
    padding: "6px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    background: "#fff",
    fontSize: 13,
    color: "#0f172a",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    outline: "none",
  },

  /* table */
  tableWrap: {
    margin: "16px 0 0",
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f8f9fc" },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: 11,
    fontWeight: 700,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap",
  },
  tr: { borderBottom: "1px solid #f1f5f9", transition: "background 0.1s" },
  td: { padding: "13px 16px", fontSize: 13, verticalAlign: "middle" },
  idChip: {
    background: "#f1f5f9",
    color: "#475569",
    padding: "3px 8px",
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 700,
    fontFamily: "monospace",
  },
  propName: { fontWeight: 600, color: "#0f172a" },
  guestName: { fontWeight: 600, color: "#0f172a", marginBottom: 2 },
  guestEmail: { fontSize: 11, color: "#94a3b8" },
  dateCell: { fontWeight: 500, color: "#0f172a" },
  dateSub: { fontSize: 11, color: "#94a3b8", marginTop: 2 },
  amountCell: { fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#0f172a", fontSize: 14 },
  badge: {
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    textTransform: "capitalize",
  },
  viewBtn: {
    padding: "5px 14px",
    background: "#0f172a",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
  },
  tableFooter: {
    padding: "14px 0 0",
    fontSize: 12,
    color: "#94a3b8",
  },
  loadingBox: { padding: 60, textAlign: "center", color: "#94a3b8" },
  emptyBox: { padding: 60, textAlign: "center", color: "#94a3b8" },

  /* modal */
  modalOverlay: {
    position: "fixed", inset: 0, background: "#00000066",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000, padding: 20,
  },
  modal: {
    background: "#fff", borderRadius: 16, padding: 0,
    maxWidth: 640, width: "100%", maxHeight: "90vh", overflow: "auto",
    boxShadow: "0 25px 60px #00000030",
  },
  modalHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    padding: "24px 28px", borderBottom: "1px solid #f1f5f9",
  },
  modalTitle: { fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: "#0f172a" },
  modalId: { fontSize: 11, color: "#94a3b8", marginTop: 4, fontFamily: "monospace" },
  closeBtn: {
    background: "#f1f5f9", border: "none", borderRadius: 8, width: 32, height: 32,
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", fontSize: 14, color: "#475569",
  },
  modalGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 },
  infoSection: { padding: "20px 28px", borderBottom: "1px solid #f1f5f9" },
  infoSectionTitle: {
    fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 700,
    color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 12,
  },
  infoRow: { display: "flex", justifyContent: "space-between", marginBottom: 8, gap: 12 },
  infoLabel: { fontSize: 13, color: "#6b7280" },
  infoVal: { fontSize: 13 },
  guestsSection: { padding: "20px 28px" },
  guestsGrid: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 },
  guestChip: {
    background: "#f8f9fc", border: "1px solid #e2e8f0",
    borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "#374151",
  },
};