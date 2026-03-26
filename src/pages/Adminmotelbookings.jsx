import { useState, useEffect } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────
const fmt = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

const fmtCurrency = (n) =>
  "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 0 });

const STATUS_STYLES = {
  confirmed: { bg: "#d1fae5", color: "#065f46", dot: "#10b981" },
  pending:   { bg: "#fef9c3", color: "#854d0e", dot: "#eab308" },
  cancelled: { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
};

const PAY_STYLES = {
  paid:    { bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6" },
  pending: { bg: "#fef9c3", color: "#854d0e", dot: "#eab308" },
  failed:  { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
};

// ─── Sub-components ───────────────────────────────────────────────────
function Badge({ label, styles }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 99,
      background: styles.bg, color: styles.color,
      fontSize: 12, fontWeight: 600, letterSpacing: "0.03em",
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: "50%",
        background: styles.dot, flexShrink: 0,
      }} />
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </span>
  );
}

function StatCard({ icon, label, value, accent }) {
  return (
    <div style={{
      background: "#fff",
      border: "1.5px solid #e5e7eb",
      borderRadius: 16,
      padding: "20px 24px",
      display: "flex", alignItems: "center", gap: 16,
      boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: accent + "18",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>{value}</div>
      </div>
    </div>
  );
}

function DetailModal({ booking, onClose }) {
  if (!booking) return null;
  const bStyle = STATUS_STYLES[booking.bookingStatus] || STATUS_STYLES.pending;
  const pStyle = PAY_STYLES[booking.paymentStatus] || PAY_STYLES.pending;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16,
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: 20, width: "100%", maxWidth: 520,
        boxShadow: "0 25px 60px rgba(0,0,0,0.18)",
        overflow: "hidden", animation: "slideUp 0.22s ease",
      }} onClick={e => e.stopPropagation()}>

        <div style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
          padding: "24px 28px", color: "#fff",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        }}>
          <div>
            <div style={{ fontSize: 11, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
              Booking ID
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 13, color: "#e2e8f0" }}>
              #{booking._id.slice(-10).toUpperCase()}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>
              {booking.motelId?.motelName}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.1)", border: "none",
            color: "#fff", borderRadius: 8, width: 32, height: 32,
            cursor: "pointer", fontSize: 18, display: "flex",
            alignItems: "center", justifyContent: "center",
          }}>×</button>
        </div>

        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 18 }}>

          <Section label="Guest Details">
            <Row k="Name" v={booking.userId?.name} />
            <Row k="Email" v={booking.userId?.email} />
            <Row k="Phone" v={booking.contactDetails?.phone || "—"} />
          </Section>

          <Section label="Stay Details">
            <Row k="Room Type" v={booking.roomType} />
            <Row k="Check-in" v={fmt(booking.checkInDate)} />
            <Row k="Check-out" v={fmt(booking.checkOutDate)} />
            <Row k="Nights" v={booking.totalNights} />
            <Row k="Guests" v={booking.totalGuests} />
            <Row k="Rooms" v={booking.totalRooms} />
          </Section>

          <Section label="Price Breakup">
            <Row k="Base Price" v={fmtCurrency(booking.priceBreakup.basePrice)} />
            <Row k="Discount" v={"- " + fmtCurrency(booking.priceBreakup.discount)} accent="#ef4444" />
            <Row k="Taxes" v={"+ " + fmtCurrency(booking.priceBreakup.taxes)} />
            <div style={{ borderTop: "1.5px dashed #e5e7eb", marginTop: 4, paddingTop: 8 }}>
              <Row k="Total Amount" v={fmtCurrency(booking.priceBreakup.totalAmount)} bold />
            </div>
          </Section>

          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1, background: "#f9fafb", borderRadius: 10, padding: "10px 14px" }}>
              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>BOOKING STATUS</div>
              <Badge label={booking.bookingStatus} styles={bStyle} />
            </div>
            <div style={{ flex: 1, background: "#f9fafb", borderRadius: 10, padding: "10px 14px" }}>
              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>PAYMENT STATUS</div>
              <Badge label={booking.paymentStatus} styles={pStyle} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <div style={{ background: "#f9fafb", borderRadius: 10, padding: "10px 14px", display: "flex", flexDirection: "column", gap: 5 }}>
        {children}
      </div>
    </div>
  );
}

function Row({ k, v, accent, bold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5 }}>
      <span style={{ color: "#6b7280" }}>{k}</span>
      <span style={{ fontWeight: bold ? 700 : 500, color: accent || "#111827" }}>{v}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────
export default function AdminMotelBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [selected, setSelected] = useState(null);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
      const res = await fetch("https://bmtadmin.onrender.com/api/motel-bookings/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Failed to fetch bookings");
        setBookings(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filtered = bookings
    .filter(b => {
      const q = search.toLowerCase();
      return (
        b.userId?.name?.toLowerCase().includes(q) ||
        b.motelId?.motelName?.toLowerCase().includes(q) ||
        b.roomType?.toLowerCase().includes(q) ||
        b._id.includes(q)
      );
    })
    .filter(b => filterStatus === "all" || b.bookingStatus === filterStatus)
    .filter(b => filterPayment === "all" || b.paymentStatus === filterPayment)
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "amount_high") return b.priceBreakup.totalAmount - a.priceBreakup.totalAmount;
      if (sortBy === "amount_low") return a.priceBreakup.totalAmount - b.priceBreakup.totalAmount;
      return 0;
    });

  const totalRevenue = bookings
    .filter(b => b.bookingStatus !== "cancelled")
    .reduce((sum, b) => sum + b.priceBreakup.totalAmount, 0);

  const confirmed = bookings.filter(b => b.bookingStatus === "confirmed").length;
  const pending = bookings.filter(b => b.bookingStatus === "pending").length;
  const cancelled = bookings.filter(b => b.bookingStatus === "cancelled").length;

  return (
    <div style={{
      fontFamily: "'Sora', 'Segoe UI', sans-serif",
      minHeight: "100vh",
      background: "#f1f5f9",
      padding: "28px 24px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
        .booking-row { transition: background 0.15s; cursor: pointer; }
        .booking-row:hover { background: #f8fafc !important; }
        .btn-filter { transition: all 0.15s; }
        .btn-filter:hover { opacity: 0.8; }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Admin Panel
            </div>
            <h1 style={{ margin: "4px 0 0", fontSize: 30, fontWeight: 800, color: "#0f172a" }}>
              Motel Bookings
            </h1>
          </div>
          <div style={{
            background: "#0f172a", color: "#f8fafc",
            padding: "10px 18px", borderRadius: 10,
            fontSize: 13, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            🏨 {bookings.length} Total Bookings
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 14, marginBottom: 24,
        }}>
          <StatCard icon="💰" label="Total Revenue" value={fmtCurrency(totalRevenue)} accent="#10b981" />
          <StatCard icon="✅" label="Confirmed" value={confirmed} accent="#10b981" />
          <StatCard icon="⏳" label="Pending" value={pending} accent="#eab308" />
          <StatCard icon="❌" label="Cancelled" value={cancelled} accent="#ef4444" />
        </div>

        {/* Filters */}
        <div style={{
          background: "#fff", borderRadius: 14, border: "1.5px solid #e5e7eb",
          padding: "16px 20px", marginBottom: 18,
          display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center",
        }}>
          <div style={{ flex: "1 1 220px", position: "relative" }}>
            <span style={{
              position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
              fontSize: 15, color: "#9ca3af",
            }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by guest, motel, room…"
              style={{
                width: "100%", padding: "9px 12px 9px 36px",
                border: "1.5px solid #e5e7eb", borderRadius: 9,
                fontSize: 13.5, outline: "none", background: "#f9fafb",
                color: "#111827",
              }}
            />
          </div>

          <FilterGroup
            label="Status:"
            value={filterStatus}
            onChange={setFilterStatus}
            options={["all", "confirmed", "pending", "cancelled"]}
          />

          <FilterGroup
            label="Payment:"
            value={filterPayment}
            onChange={setFilterPayment}
            options={["all", "paid", "pending", "failed"]}
          />

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 9,
              fontSize: 13, background: "#f9fafb", color: "#374151", cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount_high">Amount: High → Low</option>
            <option value="amount_low">Amount: Low → High</option>
          </select>
        </div>

        {/* Table */}
        <div style={{
          background: "#fff", borderRadius: 16, border: "1.5px solid #e5e7eb",
          overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 60, color: "#94a3b8", fontSize: 15 }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>⏳</div>
              Loading bookings…
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: 60, color: "#ef4444" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>⚠️</div>
              <div style={{ fontWeight: 600 }}>{error}</div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
              <div style={{ fontWeight: 600 }}>No bookings found</div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #e5e7eb" }}>
                    {["Booking ID", "Guest", "Motel", "Room", "Dates", "Amount", "Booking", "Payment", ""].map(h => (
                      <th key={h} style={{
                        padding: "13px 16px", textAlign: "left",
                        fontSize: 11, fontWeight: 700, color: "#6b7280",
                        letterSpacing: "0.06em", textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b, i) => (
                    <tr
                      key={b._id}
                      className="booking-row"
                      onClick={() => setSelected(b)}
                      style={{
                        borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none",
                        background: "#fff",
                      }}
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontFamily: "monospace", fontSize: 12, color: "#64748b", background: "#f1f5f9", padding: "2px 7px", borderRadius: 5 }}>
                          #{b._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontWeight: 600, fontSize: 13.5, color: "#111827" }}>{b.userId?.name}</div>
                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>{b.userId?.email}</div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 13.5, color: "#374151", fontWeight: 500, maxWidth: 160, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {b.motelId?.motelName}
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#4b5563" }}>
                        <div>{b.roomType}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{b.totalNights}N · {b.totalGuests}G · {b.totalRooms}R</div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 12.5, color: "#4b5563", whiteSpace: "nowrap" }}>
                        <div>{fmt(b.checkInDate)}</div>
                        <div style={{ color: "#94a3b8" }}>→ {fmt(b.checkOutDate)}</div>
                      </td>
                      <td style={{ padding: "14px 16px", fontWeight: 700, fontSize: 14, color: "#0f172a", whiteSpace: "nowrap" }}>
                        {fmtCurrency(b.priceBreakup.totalAmount)}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <Badge label={b.bookingStatus} styles={STATUS_STYLES[b.bookingStatus] || STATUS_STYLES.pending} />
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <Badge label={b.paymentStatus} styles={PAY_STYLES[b.paymentStatus] || PAY_STYLES.pending} />
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <button
                          onClick={e => { e.stopPropagation(); setSelected(b); }}
                          style={{
                            background: "#0f172a", color: "#fff",
                            border: "none", borderRadius: 7,
                            padding: "6px 13px", fontSize: 12, fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && (
            <div style={{
              padding: "12px 20px", borderTop: "1.5px solid #f1f5f9",
              fontSize: 12.5, color: "#94a3b8", display: "flex", justifyContent: "space-between",
            }}>
              <span>Showing {filtered.length} of {bookings.length} bookings</span>
              <span>Click a row to view details</span>
            </div>
          )}
        </div>
      </div>

      <DetailModal booking={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function FilterGroup({ label, value, onChange, options }) {
  const colors = {
    all: "#64748b", confirmed: "#065f46", pending: "#854d0e",
    cancelled: "#991b1b", paid: "#1e40af", failed: "#991b1b",
  };
  const bgs = {
    all: "#f1f5f9", confirmed: "#d1fae5", pending: "#fef9c3",
    cancelled: "#fee2e2", paid: "#dbeafe", failed: "#fee2e2",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>{label}</span>
      <div style={{ display: "flex", gap: 4 }}>
        {options.map(opt => (
          <button
            key={opt}
            className="btn-filter"
            onClick={() => onChange(opt)}
            style={{
              padding: "5px 11px",
              borderRadius: 7,
              border: value === opt ? "1.5px solid " + colors[opt] : "1.5px solid #e5e7eb",
              background: value === opt ? bgs[opt] : "#f9fafb",
              color: value === opt ? colors[opt] : "#6b7280",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}