import { useState, useEffect } from "react";

const API_BASE = "https://bmtadmin.onrender.com/api/love-hotel-bookings"; // apna base URL yahan set karo

const token = localStorage.getItem("adminToken") || "";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

const STATUS_COLORS = {
  confirmed: { bg: "#0d2e1a", text: "#4ade80", border: "#16a34a" },
  cancelled: { bg: "#2e0d0d", text: "#f87171", border: "#dc2626" },
  completed: { bg: "#0d1f2e", text: "#60a5fa", border: "#2563eb" },
  pending: { bg: "#2e2000", text: "#fbbf24", border: "#d97706" },
  paid: { bg: "#0d2e1a", text: "#4ade80", border: "#16a34a" },
  failed: { bg: "#2e0d0d", text: "#f87171", border: "#dc2626" },
};

const Badge = ({ text }) => {
  const s = STATUS_COLORS[text] || { bg: "#1a1a2e", text: "#a0aec0", border: "#4a5568" };
  return (
    <span
      style={{
        background: s.bg,
        color: s.text,
        border: `1px solid ${s.border}`,
        borderRadius: "6px",
        padding: "2px 10px",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {text}
    </span>
  );
};

const StatCard = ({ label, value, icon, accent }) => (
  <div
    style={{
      background: "linear-gradient(135deg, #12121f 60%, #1a1a2e 100%)",
      border: `1px solid ${accent}33`,
      borderRadius: "16px",
      padding: "24px 28px",
      flex: 1,
      minWidth: "180px",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: "-18px",
        right: "-18px",
        width: "72px",
        height: "72px",
        borderRadius: "50%",
        background: `${accent}18`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "28px",
      }}
    >
      {icon}
    </div>
    <div style={{ color: "#6b7280", fontSize: "12px", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>{label}</div>
    <div style={{ color: accent, fontSize: "32px", fontWeight: 800, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>{value}</div>
  </div>
);

const Modal = ({ booking, onClose, onCancel }) => {
  if (!booking) return null;
  const hotel = booking.hotel;
  const user = booking.user;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.75)",
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#13131f",
          border: "1px solid #2d2d4e",
          borderRadius: "20px",
          padding: "36px",
          maxWidth: "540px",
          width: "92%",
          maxHeight: "85vh",
          overflowY: "auto",
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: "0 24px 80px #0008",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <div style={{ color: "#e2b96a", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>Booking Details</div>
            <div style={{ color: "#f1e9d6", fontSize: "20px", fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{booking.bookingId}</div>
          </div>
          <button onClick={onClose} style={{ background: "#2d2d4e", border: "none", color: "#9ca3af", borderRadius: "8px", width: 34, height: 34, cursor: "pointer", fontSize: "18px" }}>✕</button>
        </div>

        <Section title="Guest Info">
          <Row label="Name" value={user?.name || "—"} />
          <Row label="Email" value={user?.email || "—"} />
        </Section>

        <Section title="Hotel & Room">
          <Row label="Hotel" value={hotel?.name || "—"} />
          <Row label="Room ID" value={booking.roomId || "—"} />
          <Row label="Booking Type" value={booking.bookingType?.toUpperCase()} />
        </Section>

        <Section title="Stay">
          <Row label="Check In" value={formatDate(booking.checkIn)} />
          <Row label="Check Out" value={formatDate(booking.checkOut)} />
          <Row label="Hours" value={booking.totalHours || "—"} />
          <Row label="Nights" value={booking.totalNights || "—"} />
          <Row label="Guests" value={booking.guests || "—"} />
        </Section>

        <Section title="Payment">
          <Row label="Base Price" value={`₹${booking.price?.toFixed(2)}`} />
          <Row label="GST (12%)" value={`₹${booking.taxes?.toFixed(2)}`} />
          <Row label="Total" value={`₹${booking.totalAmount?.toFixed(2)}`} accent />
          <Row label="Payment" value={<Badge text={booking.paymentStatus} />} />
        </Section>

        <Section title="Status">
          <Row label="Booking Status" value={<Badge text={booking.bookingStatus} />} />
          {booking.specialRequest && <Row label="Special Request" value={booking.specialRequest} />}
        </Section>

        {booking.bookingStatus !== "cancelled" && (
          <button
            onClick={() => onCancel(booking._id)}
            style={{
              marginTop: "20px",
              width: "100%",
              padding: "12px",
              background: "linear-gradient(90deg, #7f1d1d, #991b1b)",
              border: "1px solid #dc2626",
              borderRadius: "10px",
              color: "#fecaca",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "14px",
              letterSpacing: "0.05em",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            CANCEL BOOKING
          </button>
        )}
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div style={{ marginBottom: "20px" }}>
    <div style={{ color: "#e2b96a", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: "8px", borderBottom: "1px solid #2d2d4e", paddingBottom: "4px" }}>{title}</div>
    {children}
  </div>
);

const Row = ({ label, value, accent }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #1e1e30" }}>
    <span style={{ color: "#6b7280", fontSize: "13px" }}>{label}</span>
    <span style={{ color: accent ? "#e2b96a" : "#f1e9d6", fontWeight: accent ? 700 : 400, fontSize: "13px" }}>{value}</span>
  </div>
);

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

export default function LoveHotelAdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/all`, { headers });
      const data = await res.json();
      if (data.success) setBookings(data.data);
      else setError(data.message);
    } catch (e) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const res = await fetch(`${API_BASE}/cancel/${id}`, { method: "PUT", headers });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.map(b => b._id === id ? { ...b, bookingStatus: "cancelled" } : b));
        setSelected(prev => prev ? { ...prev, bookingStatus: "cancelled" } : null);
      } else alert(data.message);
    } catch {
      alert("Failed to cancel booking");
    }
  };

  const filtered = bookings
    .filter(b => {
      const q = search.toLowerCase();
      const matchSearch =
        b.bookingId?.toLowerCase().includes(q) ||
        b.hotel?.name?.toLowerCase().includes(q) ||
        b.user?.name?.toLowerCase().includes(q) ||
        b.user?.email?.toLowerCase().includes(q) ||
        b.roomId?.toLowerCase().includes(q);
      const matchStatus = filterStatus === "all" || b.bookingStatus === filterStatus;
      const matchPayment = filterPayment === "all" || b.paymentStatus === filterPayment;
      return matchSearch && matchStatus && matchPayment;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "amount_high") return b.totalAmount - a.totalAmount;
      if (sortBy === "amount_low") return a.totalAmount - b.totalAmount;
      return 0;
    });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.bookingStatus === "confirmed").length,
    cancelled: bookings.filter(b => b.bookingStatus === "cancelled").length,
    revenue: bookings.filter(b => b.paymentStatus === "paid").reduce((s, b) => s + (b.totalAmount || 0), 0),
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a14; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #13131f; }
        ::-webkit-scrollbar-thumb { background: #2d2d4e; border-radius: 3px; }
        .booking-row { transition: background 0.15s; cursor: pointer; }
        .booking-row:hover { background: #1a1a2e !important; }
        .filter-btn { transition: all 0.15s; cursor: pointer; border: none; }
        .filter-btn:hover { opacity: 0.85; }
        .search-input:focus { outline: none; border-color: #e2b96a !important; }
        .select-input:focus { outline: none; border-color: #e2b96a !important; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0a0a14", fontFamily: "'DM Sans', sans-serif", color: "#f1e9d6" }}>
        
        {/* Header */}
        <div style={{
          background: "linear-gradient(90deg, #0f0f1e 0%, #12121f 100%)",
          borderBottom: "1px solid #2d2d4e",
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{
              width: 42, height: 42,
              background: "linear-gradient(135deg, #e2b96a, #c9952b)",
              borderRadius: "10px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "22px",
            }}>🏨</div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 800, color: "#f1e9d6", lineHeight: 1 }}>LoveHotel</div>
              <div style={{ color: "#e2b96a", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>Admin Dashboard</div>
            </div>
          </div>
          <button
            onClick={fetchBookings}
            style={{
              background: "linear-gradient(90deg, #e2b96a22, #e2b96a11)",
              border: "1px solid #e2b96a55",
              color: "#e2b96a",
              borderRadius: "8px",
              padding: "8px 18px",
              cursor: "pointer",
              fontFamily: "'DM Mono', monospace",
              fontSize: "12px",
              letterSpacing: "0.08em",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            ↺ REFRESH
          </button>
        </div>

        <div style={{ padding: "28px 32px", maxWidth: "1400px", margin: "0 auto" }}>

          {/* Stats Row */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "28px" }}>
            <StatCard label="Total Bookings" value={stats.total} icon="📋" accent="#a78bfa" />
            <StatCard label="Confirmed" value={stats.confirmed} icon="✅" accent="#4ade80" />
            <StatCard label="Cancelled" value={stats.cancelled} icon="❌" accent="#f87171" />
            <StatCard label="Revenue Collected" value={`₹${stats.revenue.toLocaleString("en-IN")}`} icon="💰" accent="#e2b96a" />
          </div>

          {/* Filters */}
          <div style={{
            background: "#12121f",
            border: "1px solid #2d2d4e",
            borderRadius: "14px",
            padding: "18px 22px",
            marginBottom: "20px",
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            alignItems: "center",
          }}>
            <input
              className="search-input"
              placeholder="Search by ID, hotel, guest..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1,
                minWidth: "220px",
                background: "#0a0a14",
                border: "1px solid #2d2d4e",
                borderRadius: "8px",
                padding: "10px 14px",
                color: "#f1e9d6",
                fontSize: "14px",
                fontFamily: "'DM Sans', sans-serif",
                transition: "border-color 0.2s",
              }}
            />
            <select
              className="select-input"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{
                background: "#0a0a14",
                border: "1px solid #2d2d4e",
                borderRadius: "8px",
                padding: "10px 14px",
                color: "#f1e9d6",
                fontSize: "13px",
                fontFamily: "'DM Mono', monospace",
                cursor: "pointer",
              }}
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
            <select
              className="select-input"
              value={filterPayment}
              onChange={e => setFilterPayment(e.target.value)}
              style={{
                background: "#0a0a14",
                border: "1px solid #2d2d4e",
                borderRadius: "8px",
                padding: "10px 14px",
                color: "#f1e9d6",
                fontSize: "13px",
                fontFamily: "'DM Mono', monospace",
                cursor: "pointer",
              }}
            >
              <option value="all">All Payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
            <select
              className="select-input"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                background: "#0a0a14",
                border: "1px solid #2d2d4e",
                borderRadius: "8px",
                padding: "10px 14px",
                color: "#f1e9d6",
                fontSize: "13px",
                fontFamily: "'DM Mono', monospace",
                cursor: "pointer",
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount_high">Amount: High → Low</option>
              <option value="amount_low">Amount: Low → High</option>
            </select>
            <div style={{ color: "#6b7280", fontSize: "12px", fontFamily: "'DM Mono', monospace", marginLeft: "auto" }}>
              {filtered.length} / {bookings.length} bookings
            </div>
          </div>

          {/* Table */}
          <div style={{
            background: "#12121f",
            border: "1px solid #2d2d4e",
            borderRadius: "16px",
            overflow: "hidden",
          }}>
            {loading ? (
              <div style={{ padding: "60px", textAlign: "center", color: "#4b5563" }}>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>⏳</div>
                <div style={{ fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em" }}>Loading bookings...</div>
              </div>
            ) : error ? (
              <div style={{ padding: "60px", textAlign: "center", color: "#f87171" }}>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>⚠️</div>
                <div>{error}</div>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: "60px", textAlign: "center", color: "#4b5563" }}>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔍</div>
                <div style={{ fontFamily: "'DM Mono', monospace" }}>No bookings found</div>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#0f0f1e", borderBottom: "1px solid #2d2d4e" }}>
                      {["Booking ID", "Guest", "Hotel / Room", "Type", "Check In", "Check Out", "Amount", "Payment", "Status", "Action"].map(h => (
                        <th key={h} style={{
                          padding: "13px 16px",
                          textAlign: "left",
                          color: "#6b7280",
                          fontSize: "10px",
                          fontFamily: "'DM Mono', monospace",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          fontWeight: 500,
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
                          borderBottom: "1px solid #1e1e30",
                          background: i % 2 === 0 ? "#12121f" : "#0f0f1c",
                        }}
                      >
                        <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                          <span style={{ color: "#e2b96a", fontFamily: "'DM Mono', monospace", fontSize: "12px" }}>{b.bookingId}</span>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ color: "#f1e9d6", fontSize: "13px", fontWeight: 500 }}>{b.user?.name || "—"}</div>
                          <div style={{ color: "#6b7280", fontSize: "11px" }}>{b.user?.email || "—"}</div>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ color: "#f1e9d6", fontSize: "13px" }}>{b.hotel?.name || "—"}</div>
                          <div style={{ color: "#6b7280", fontSize: "11px" }}>Room: {b.roomId || "—"}</div>
                        </td>
                        <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                          <span style={{
                            background: b.bookingType === "hourly" ? "#1e1a00" : "#0d1e2e",
                            color: b.bookingType === "hourly" ? "#fbbf24" : "#60a5fa",
                            border: `1px solid ${b.bookingType === "hourly" ? "#d97706" : "#2563eb"}`,
                            borderRadius: "6px",
                            padding: "2px 8px",
                            fontSize: "10px",
                            fontFamily: "'DM Mono', monospace",
                            textTransform: "uppercase",
                            fontWeight: 700,
                          }}>
                            {b.bookingType}
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px", color: "#d1d5db", fontSize: "12px", fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap" }}>
                          {formatDate(b.checkIn)}
                        </td>
                        <td style={{ padding: "14px 16px", color: "#d1d5db", fontSize: "12px", fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap" }}>
                          {formatDate(b.checkOut)}
                        </td>
                        <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                          <div style={{ color: "#e2b96a", fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: "14px" }}>
                            ₹{b.totalAmount?.toLocaleString("en-IN")}
                          </div>
                          <div style={{ color: "#6b7280", fontSize: "10px" }}>+GST ₹{b.taxes?.toFixed(0)}</div>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <Badge text={b.paymentStatus} />
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <Badge text={b.bookingStatus} />
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <button
                            onClick={e => { e.stopPropagation(); setSelected(b); }}
                            style={{
                              background: "#1e1e30",
                              border: "1px solid #3d3d5c",
                              color: "#a78bfa",
                              borderRadius: "7px",
                              padding: "6px 12px",
                              cursor: "pointer",
                              fontSize: "11px",
                              fontFamily: "'DM Mono', monospace",
                              letterSpacing: "0.05em",
                            }}
                          >
                            VIEW
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: "32px", color: "#374151", fontSize: "12px", fontFamily: "'DM Mono', monospace" }}>
            LOVEHOTEL ADMIN © {new Date().getFullYear()}
          </div>
        </div>
      </div>

      <Modal booking={selected} onClose={() => setSelected(null)} onCancel={handleCancel} />
    </>
  );
}