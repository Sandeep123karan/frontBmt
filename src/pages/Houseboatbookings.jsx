import { useState, useEffect } from "react";

const API_BASE = "https://bmtadmin.onrender.com/api/houseboat-bookings";

const STATUS_CONFIG = {
  pending:    { color: "#F59E0B", bg: "#FEF3C7", label: "Pending" },
  confirmed:  { color: "#3B82F6", bg: "#DBEAFE", label: "Confirmed" },
  "checked-in":  { color: "#8B5CF6", bg: "#EDE9FE", label: "Checked In" },
  "checked-out": { color: "#10B981", bg: "#D1FAE5", label: "Checked Out" },
  cancelled:  { color: "#EF4444", bg: "#FEE2E2", label: "Cancelled" },
};

const PAYMENT_CONFIG = {
  pending: { color: "#F59E0B", label: "Pending" },
  paid:    { color: "#10B981", label: "Paid" },
  failed:  { color: "#EF4444", label: "Failed" },
};

export default function HouseboatBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/all`);
      const json = await res.json();
      if (json.success) {
        setBookings(json.data);
      } else {
        setError("Failed to fetch bookings.");
      }
    } catch (e) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    setCancellingId(id);
    try {
      const res = await fetch(`${API_BASE}/cancel/${id}`, { method: "PUT" });
      const json = await res.json();
      if (json.success) {
        setBookings((prev) =>
          prev.map((b) =>
            b._id === id ? { ...b, bookingStatus: "cancelled" } : b
          )
        );
        showToast("Booking cancelled successfully", "success");
        if (selectedBooking?._id === id) {
          setSelectedBooking((prev) => ({ ...prev, bookingStatus: "cancelled" }));
        }
      } else {
        showToast(json.message || "Cancel failed", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setCancellingId(null);
    }
  };

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const fmt = (date) =>
    date ? new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const fmtMoney = (n) =>
    n != null ? `₹${Number(n).toLocaleString("en-IN")}` : "—";

  const filtered = bookings
    .filter((b) => {
      const q = search.toLowerCase();
      const name = b.contactDetails?.name?.toLowerCase() || "";
      const email = b.contactDetails?.email?.toLowerCase() || "";
      const boat = b.houseboatId?.name?.toLowerCase() || "";
      const id = b._id?.toLowerCase() || "";
      return name.includes(q) || email.includes(q) || boat.includes(q) || id.includes(q);
    })
    .filter((b) => statusFilter === "all" || b.bookingStatus === statusFilter)
    .sort((a, b) => {
      let av = a[sortField], bv = b[sortField];
      if (sortField === "totalAmount") { av = Number(av); bv = Number(bv); }
      else if (sortField === "checkInDate") { av = new Date(av); bv = new Date(bv); }
      else { av = new Date(a.createdAt); bv = new Date(b.createdAt); }
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.bookingStatus === "confirmed").length,
    pending: bookings.filter((b) => b.bookingStatus === "pending").length,
    cancelled: bookings.filter((b) => b.bookingStatus === "cancelled").length,
    revenue: bookings
      .filter((b) => b.bookingStatus !== "cancelled")
      .reduce((s, b) => s + (b.totalAmount || 0), 0),
  };

  const SortIcon = ({ field }) => (
    <span style={{ marginLeft: 4, opacity: sortField === field ? 1 : 0.3, fontSize: 11 }}>
      {sortField === field ? (sortDir === "asc" ? "▲" : "▼") : "⇅"}
    </span>
  );

  return (
    <div style={styles.page}>
      {/* ── TOAST ── */}
      {toast && (
        <div style={{ ...styles.toast, background: toast.type === "success" ? "#10B981" : "#EF4444" }}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      {/* ── HEADER ── */}
      <div style={styles.header}>
        <div>
          <div style={styles.headerMeta}>Admin Panel</div>
          <h1 style={styles.headerTitle}>🚤 Houseboat Bookings</h1>
        </div>
        <button style={styles.refreshBtn} onClick={fetchBookings} disabled={loading}>
          {loading ? "⟳ Loading…" : "⟳ Refresh"}
        </button>
      </div>

      {/* ── STATS ── */}
      <div style={styles.statsGrid}>
        {[
          { label: "Total Bookings", value: stats.total, icon: "📋", color: "#3B82F6" },
          { label: "Confirmed", value: stats.confirmed, icon: "✅", color: "#10B981" },
          { label: "Pending", value: stats.pending, icon: "⏳", color: "#F59E0B" },
          { label: "Cancelled", value: stats.cancelled, icon: "❌", color: "#EF4444" },
          { label: "Total Revenue", value: fmtMoney(stats.revenue), icon: "💰", color: "#8B5CF6", wide: true },
        ].map((s) => (
          <div key={s.label} style={{ ...styles.statCard, borderTop: `3px solid ${s.color}`, gridColumn: s.wide ? "span 2" : undefined }}>
            <span style={{ fontSize: 24 }}>{s.icon}</span>
            <div>
              <div style={{ ...styles.statValue, color: s.color }}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── FILTERS ── */}
      <div style={styles.filtersRow}>
        <input
          style={styles.searchInput}
          placeholder="🔍  Search by guest, email, boat name or booking ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div style={styles.filterTabs}>
          {["all", "pending", "confirmed", "checked-in", "checked-out", "cancelled"].map((s) => (
            <button
              key={s}
              style={{
                ...styles.filterTab,
                ...(statusFilter === s ? styles.filterTabActive : {}),
              }}
              onClick={() => setStatusFilter(s)}
            >
              {s === "all" ? "All" : STATUS_CONFIG[s]?.label || s}
            </button>
          ))}
        </div>
      </div>

      {/* ── ERROR ── */}
      {error && (
        <div style={styles.errorBox}>⚠ {error}</div>
      )}

      {/* ── TABLE ── */}
      {loading ? (
        <div style={styles.loadingBox}>
          <div style={styles.spinner} />
          <span>Loading bookings…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div style={styles.emptyBox}>
          <div style={{ fontSize: 48 }}>🚤</div>
          <div>No bookings found</div>
        </div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.theadRow}>
                {[
                  { label: "Booking ID", field: null },
                  { label: "Guest", field: null },
                  { label: "Houseboat", field: null },
                  { label: "Check In", field: "checkInDate" },
                  { label: "Check Out", field: "checkInDate" },
                  { label: "Nights", field: null },
                  { label: "Rooms", field: null },
                  { label: "Amount", field: "totalAmount" },
                  { label: "Payment", field: null },
                  { label: "Status", field: null },
                  { label: "Booked On", field: "createdAt" },
                  { label: "Actions", field: null },
                ].map(({ label, field }) => (
                  <th
                    key={label}
                    style={{ ...styles.th, cursor: field ? "pointer" : "default" }}
                    onClick={() => field && handleSort(field)}
                  >
                    {label}
                    {field && <SortIcon field={field} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => {
                const sc = STATUS_CONFIG[b.bookingStatus] || {};
                const pc = PAYMENT_CONFIG[b.paymentStatus] || {};
                return (
                  <tr
                    key={b._id}
                    style={{ ...styles.tr, background: i % 2 === 0 ? "#fff" : "#F9FAFB" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#EFF6FF")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#F9FAFB")}
                  >
                    <td style={styles.td}>
                      <span style={styles.bookingId}>#{b._id?.slice(-8).toUpperCase()}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.guestName}>{b.contactDetails?.name || b.userId?.name || "—"}</div>
                      <div style={styles.guestEmail}>{b.contactDetails?.email || b.userId?.email || ""}</div>
                      <div style={styles.guestPhone}>{b.contactDetails?.phone || ""}</div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.boatName}>{b.houseboatId?.name || "—"}</div>
                    </td>
                    <td style={styles.td}>{fmt(b.checkInDate)}</td>
                    <td style={styles.td}>{fmt(b.checkOutDate)}</td>
                    <td style={{ ...styles.td, textAlign: "center" }}>{b.totalNights || "—"}</td>
                    <td style={{ ...styles.td, textAlign: "center" }}>{b.totalRooms || 1}</td>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{fmtMoney(b.totalAmount)}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, color: pc.color, background: pc.color + "22" }}>
                        {pc.label || b.paymentStatus}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, color: sc.color, background: sc.bg }}>
                        {sc.label || b.bookingStatus}
                      </span>
                    </td>
                    <td style={{ ...styles.td, fontSize: 12, color: "#6B7280" }}>{fmt(b.createdAt)}</td>
                    <td style={styles.td}>
                      <div style={styles.actionBtns}>
                        <button
                          style={styles.viewBtn}
                          onClick={() => setSelectedBooking(b)}
                        >
                          View
                        </button>
                        {b.bookingStatus !== "cancelled" && (
                          <button
                            style={{ ...styles.cancelBtn, opacity: cancellingId === b._id ? 0.6 : 1 }}
                            onClick={() => handleCancel(b._id)}
                            disabled={cancellingId === b._id}
                          >
                            {cancellingId === b._id ? "…" : "Cancel"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={styles.tableFooter}>
        Showing {filtered.length} of {bookings.length} bookings
      </div>

      {/* ── DETAIL MODAL ── */}
      {selectedBooking && (
        <div style={styles.modalOverlay} onClick={() => setSelectedBooking(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <div style={styles.modalMeta}>Booking Detail</div>
                <div style={styles.modalId}>#{selectedBooking._id?.slice(-8).toUpperCase()}</div>
              </div>
              <button style={styles.closeBtn} onClick={() => setSelectedBooking(null)}>✕</button>
            </div>

            <div style={styles.modalBody}>
              {/* Status & Payment Row */}
              <div style={styles.modalRow}>
                <DetailBadge
                  label="Booking Status"
                  value={STATUS_CONFIG[selectedBooking.bookingStatus]?.label || selectedBooking.bookingStatus}
                  color={STATUS_CONFIG[selectedBooking.bookingStatus]?.color}
                  bg={STATUS_CONFIG[selectedBooking.bookingStatus]?.bg}
                />
                <DetailBadge
                  label="Payment Status"
                  value={PAYMENT_CONFIG[selectedBooking.paymentStatus]?.label || selectedBooking.paymentStatus}
                  color={PAYMENT_CONFIG[selectedBooking.paymentStatus]?.color}
                  bg={PAYMENT_CONFIG[selectedBooking.paymentStatus]?.color + "22"}
                />
                {selectedBooking.paymentMethod && (
                  <DetailItem label="Payment Method" value={selectedBooking.paymentMethod.toUpperCase()} />
                )}
              </div>

              <Divider />

              {/* Guest Details */}
              <SectionTitle>👤 Guest Details</SectionTitle>
              <div style={styles.modalRow}>
                <DetailItem label="Name" value={selectedBooking.contactDetails?.name || selectedBooking.userId?.name || "—"} />
                <DetailItem label="Email" value={selectedBooking.contactDetails?.email || selectedBooking.userId?.email || "—"} />
                <DetailItem label="Phone" value={selectedBooking.contactDetails?.phone || "—"} />
                <DetailItem label="Total Guests" value={selectedBooking.totalGuests || "—"} />
              </div>

              <Divider />

              {/* Booking Details */}
              <SectionTitle>🚤 Booking Details</SectionTitle>
              <div style={styles.modalRow}>
                <DetailItem label="Houseboat" value={selectedBooking.houseboatId?.name || "—"} />
                <DetailItem label="Check In" value={fmt(selectedBooking.checkInDate)} />
                <DetailItem label="Check Out" value={fmt(selectedBooking.checkOutDate)} />
                <DetailItem label="Total Nights" value={selectedBooking.totalNights || "—"} />
                <DetailItem label="Total Rooms" value={selectedBooking.totalRooms || 1} />
              </div>

              <Divider />

              {/* Price Breakdown */}
              <SectionTitle>💰 Price Breakdown</SectionTitle>
              <div style={styles.priceTable}>
                {[
                  { label: "Price per Room / Night", value: fmtMoney(selectedBooking.pricePerRoom) },
                  { label: "Base Price", value: fmtMoney(selectedBooking.basePrice) },
                  { label: "Tax", value: fmtMoney(selectedBooking.tax) },
                  { label: "Discount", value: selectedBooking.discount ? `-${fmtMoney(selectedBooking.discount)}` : "—" },
                ].map(({ label, value }) => (
                  <div key={label} style={styles.priceRow}>
                    <span style={styles.priceLabel}>{label}</span>
                    <span style={styles.priceVal}>{value}</span>
                  </div>
                ))}
                <div style={{ ...styles.priceRow, ...styles.priceTotalRow }}>
                  <span>Total Amount</span>
                  <span style={styles.priceTotalVal}>{fmtMoney(selectedBooking.totalAmount)}</span>
                </div>
              </div>

              {selectedBooking.transactionId && (
                <DetailItem label="Transaction ID" value={selectedBooking.transactionId} />
              )}

              <Divider />
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <DetailItem label="Booking Created" value={fmt(selectedBooking.createdAt)} />
                <DetailItem label="Last Updated" value={fmt(selectedBooking.updatedAt)} />
              </div>
            </div>

            <div style={styles.modalFooter}>
              {selectedBooking.bookingStatus !== "cancelled" && (
                <button
                  style={{ ...styles.cancelBtn, padding: "10px 24px", fontSize: 14 }}
                  onClick={() => {
                    handleCancel(selectedBooking._id);
                    setSelectedBooking(null);
                  }}
                >
                  Cancel This Booking
                </button>
              )}
              <button style={styles.closeModalBtn} onClick={() => setSelectedBooking(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── SMALL HELPERS ── */
const DetailItem = ({ label, value }) => (
  <div style={{ marginBottom: 12, minWidth: 140 }}>
    <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>{label}</div>
    <div style={{ fontSize: 14, color: "#111827", fontWeight: 500 }}>{value}</div>
  </div>
);

const DetailBadge = ({ label, value, color, bg }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{label}</div>
    <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600, color, background: bg }}>{value}</span>
  </div>
);

const SectionTitle = ({ children }) => (
  <div style={{ fontWeight: 700, fontSize: 14, color: "#374151", marginBottom: 12 }}>{children}</div>
);

const Divider = () => (
  <hr style={{ border: "none", borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
);

/* ── STYLES ── */
const styles = {
  page: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: "#F1F5F9",
    minHeight: "100vh",
    padding: "28px 32px",
    position: "relative",
  },
  toast: {
    position: "fixed",
    top: 20,
    right: 20,
    zIndex: 9999,
    color: "#fff",
    padding: "12px 20px",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 14,
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    animation: "fadeIn 0.2s ease",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerMeta: { fontSize: 12, color: "#6B7280", fontWeight: 500, marginBottom: 2, textTransform: "uppercase", letterSpacing: 1 },
  headerTitle: { fontSize: 26, fontWeight: 800, color: "#0F172A", margin: 0 },
  refreshBtn: {
    background: "#1D4ED8",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    background: "#fff",
    borderRadius: 12,
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    gap: 14,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  statValue: { fontSize: 22, fontWeight: 800, lineHeight: 1 },
  statLabel: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  filtersRow: {
    display: "flex",
    gap: 16,
    marginBottom: 20,
    flexWrap: "wrap",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    minWidth: 260,
    padding: "10px 16px",
    borderRadius: 10,
    border: "1.5px solid #E2E8F0",
    fontSize: 14,
    outline: "none",
    background: "#fff",
  },
  filterTabs: { display: "flex", gap: 8, flexWrap: "wrap" },
  filterTab: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "1.5px solid #E2E8F0",
    background: "#fff",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    color: "#6B7280",
    transition: "all 0.15s",
  },
  filterTabActive: {
    background: "#1D4ED8",
    color: "#fff",
    borderColor: "#1D4ED8",
  },
  errorBox: {
    background: "#FEE2E2",
    color: "#DC2626",
    borderRadius: 10,
    padding: "12px 20px",
    marginBottom: 20,
    fontWeight: 500,
  },
  loadingBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    padding: 60,
    background: "#fff",
    borderRadius: 14,
    color: "#6B7280",
  },
  spinner: {
    width: 28,
    height: 28,
    border: "3px solid #E2E8F0",
    borderTop: "3px solid #1D4ED8",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  emptyBox: {
    textAlign: "center",
    padding: 60,
    background: "#fff",
    borderRadius: 14,
    color: "#9CA3AF",
    fontSize: 16,
    fontWeight: 500,
  },
  tableWrapper: {
    background: "#fff",
    borderRadius: 14,
    overflow: "auto",
    boxShadow: "0 1px 8px rgba(0,0,0,0.07)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13,
    minWidth: 1100,
  },
  theadRow: {
    background: "#F8FAFC",
    borderBottom: "2px solid #E2E8F0",
  },
  th: {
    padding: "13px 14px",
    textAlign: "left",
    fontWeight: 700,
    color: "#374151",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    whiteSpace: "nowrap",
    userSelect: "none",
  },
  tr: { borderBottom: "1px solid #F1F5F9", transition: "background 0.1s" },
  td: { padding: "12px 14px", verticalAlign: "middle" },
  bookingId: { fontFamily: "monospace", fontSize: 12, color: "#6B7280", background: "#F3F4F6", padding: "2px 6px", borderRadius: 4 },
  guestName: { fontWeight: 600, color: "#111827" },
  guestEmail: { fontSize: 11, color: "#9CA3AF", marginTop: 1 },
  guestPhone: { fontSize: 11, color: "#9CA3AF" },
  boatName: { fontWeight: 600, color: "#1D4ED8" },
  badge: {
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  actionBtns: { display: "flex", gap: 6 },
  viewBtn: {
    padding: "5px 12px",
    borderRadius: 7,
    border: "1.5px solid #3B82F6",
    background: "transparent",
    color: "#3B82F6",
    fontWeight: 600,
    fontSize: 12,
    cursor: "pointer",
  },
  cancelBtn: {
    padding: "5px 12px",
    borderRadius: 7,
    border: "none",
    background: "#FEE2E2",
    color: "#DC2626",
    fontWeight: 600,
    fontSize: 12,
    cursor: "pointer",
  },
  tableFooter: {
    textAlign: "right",
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 10,
  },
  /* Modal */
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 20,
  },
  modal: {
    background: "#fff",
    borderRadius: 18,
    width: "100%",
    maxWidth: 680,
    maxHeight: "90vh",
    overflow: "auto",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "20px 24px 16px",
    borderBottom: "1px solid #F1F5F9",
    position: "sticky",
    top: 0,
    background: "#fff",
    zIndex: 10,
  },
  modalMeta: { fontSize: 11, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 },
  modalId: { fontSize: 20, fontWeight: 800, color: "#0F172A", fontFamily: "monospace", marginTop: 2 },
  closeBtn: {
    background: "#F3F4F6",
    border: "none",
    borderRadius: 8,
    width: 32,
    height: 32,
    fontSize: 14,
    cursor: "pointer",
    color: "#6B7280",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: { padding: "20px 24px" },
  modalRow: { display: "flex", flexWrap: "wrap", gap: "0 32px" },
  priceTable: {
    background: "#F8FAFC",
    borderRadius: 10,
    padding: "14px 18px",
    marginBottom: 12,
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    padding: "6px 0",
    borderBottom: "1px solid #E2E8F0",
  },
  priceLabel: { color: "#6B7280" },
  priceVal: { fontWeight: 500, color: "#111827" },
  priceTotalRow: {
    borderBottom: "none",
    fontWeight: 700,
    fontSize: 15,
    marginTop: 4,
    paddingTop: 10,
    color: "#0F172A",
  },
  priceTotalVal: { color: "#1D4ED8", fontSize: 18, fontWeight: 800 },
  modalFooter: {
    padding: "16px 24px",
    borderTop: "1px solid #F1F5F9",
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    position: "sticky",
    bottom: 0,
    background: "#fff",
  },
  closeModalBtn: {
    padding: "10px 24px",
    borderRadius: 10,
    border: "1.5px solid #E2E8F0",
    background: "#fff",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    color: "#374151",
  },
};