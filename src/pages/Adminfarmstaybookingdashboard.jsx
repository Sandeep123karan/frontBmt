import { useState, useEffect } from "react";

const API_BASE = "https://bmtadmin.onrender.com/api/farm-bookings"; // apna URL lagana

const statusColors = {
  pending: { bg: "#FFF7ED", text: "#C2410C", dot: "#F97316" },
  confirmed: { bg: "#F0FDF4", text: "#15803D", dot: "#22C55E" },
  cancelled: { bg: "#FEF2F2", text: "#B91C1C", dot: "#EF4444" },
};

const paymentColors = {
  pending: { bg: "#FFFBEB", text: "#92400E" },
  paid: { bg: "#ECFDF5", text: "#065F46" },
  failed: { bg: "#FFF1F2", text: "#9F1239" },
};

function Badge({ label, map }) {
  const style = map[label] || { bg: "#F3F4F6", text: "#374151" };
  return (
    <span
      style={{
        background: style.bg,
        color: style.text,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: 0.3,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
      }}
    >
      {map === statusColors && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: style.dot,
            display: "inline-block",
          }}
        />
      )}
      {label}
    </span>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #F1F5F9",
        borderRadius: 16,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          background: color + "18",
          borderRadius: 12,
          width: 48,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 13, color: "#94A3B8", fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function Modal({ booking, onClose, onCancel, cancelling }) {
  if (!booking) return null;
  const b = booking;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 20, width: "100%", maxWidth: 560,
          maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "22px 28px 18px", borderBottom: "1px solid #F1F5F9",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        }}>
          <div>
            <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
              Booking ID
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 13, color: "#475569", marginTop: 2 }}>
              {b._id}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none", background: "#F8FAFC", borderRadius: 8,
              width: 32, height: 32, cursor: "pointer", fontSize: 16, color: "#64748B",
            }}
          >✕</button>
        </div>

        <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Farm + Status */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A" }}>
                {b.farmStayId?.farmName || "FarmStay"}
              </div>
              <div style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>
                {b.userId?.name} · {b.userId?.email}
              </div>
            </div>
            <Badge label={b.bookingStatus} map={statusColors} />
          </div>

          {/* Dates */}
          <div style={{
            background: "#F8FAFC", borderRadius: 12, padding: "14px 18px",
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12,
          }}>
            {[
              { label: "Check-in", value: new Date(b.checkInDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
              { label: "Check-out", value: new Date(b.checkOutDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
              { label: "Nights", value: b.totalNights },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#1E293B", marginTop: 3 }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Guests */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "Total Guests", value: b.totalGuests || "-" },
              { label: "Total Rooms", value: b.totalRooms || "-" },
            ].map((item) => (
              <div key={item.label} style={{
                background: "#F8FAFC", borderRadius: 10, padding: "12px 16px",
              }}>
                <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase" }}>{item.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", marginTop: 2 }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Contact */}
          {b.contactDetails?.name && (
            <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Contact Details</div>
              <div style={{ fontSize: 14, color: "#1E293B" }}>📛 {b.contactDetails.name}</div>
              <div style={{ fontSize: 14, color: "#1E293B" }}>📞 {b.contactDetails.phone}</div>
              <div style={{ fontSize: 14, color: "#1E293B" }}>✉️ {b.contactDetails.email}</div>
            </div>
          )}

          {/* Price Breakup */}
          <div style={{ background: "#0F172A", borderRadius: 12, padding: "16px 20px" }}>
            <div style={{ fontSize: 12, color: "#64748B", fontWeight: 600, textTransform: "uppercase", marginBottom: 12 }}>
              Price Breakup
            </div>
            {[
              { label: "Base Price", value: b.priceBreakup?.basePrice },
              { label: "Discount", value: `-${b.priceBreakup?.discount || 0}`, red: true },
              { label: "Taxes", value: b.priceBreakup?.taxes },
            ].map((row) => (
              <div key={row.label} style={{
                display: "flex", justifyContent: "space-between",
                padding: "5px 0", borderBottom: "1px solid #1E293B",
              }}>
                <span style={{ color: "#94A3B8", fontSize: 13 }}>{row.label}</span>
                <span style={{ color: row.red ? "#F87171" : "#CBD5E1", fontSize: 13, fontWeight: 500 }}>
                  ₹{row.value?.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Total</span>
              <span style={{ color: "#4ADE80", fontWeight: 800, fontSize: 18 }}>
                ₹{b.priceBreakup?.totalAmount?.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Payment + Action */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <Badge label={b.paymentStatus} map={paymentColors} />
              <span style={{
                background: "#F1F5F9", color: "#475569", padding: "3px 10px",
                borderRadius: 20, fontSize: 12, fontWeight: 600,
              }}>
                {b.paymentMethod?.replace("_", " ")}
              </span>
            </div>

            {b.bookingStatus !== "cancelled" && (
              <button
                onClick={() => onCancel(b._id)}
                disabled={cancelling}
                style={{
                  background: cancelling ? "#FCA5A5" : "#EF4444",
                  color: "#fff", border: "none", borderRadius: 10,
                  padding: "9px 20px", fontWeight: 700, fontSize: 13,
                  cursor: cancelling ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                }}
              >
                {cancelling ? "Cancelling..." : "Cancel Booking"}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default function AdminBookingDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const token = localStorage.getItem("token"); // ya apna auth method

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBookings(data.data || []);
    } catch {
      setError("Bookings load nahi hui. Server check karo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm("Booking cancel karna chahte ho?")) return;
    setCancelling(true);
    try {
      await fetch(`${API_BASE}/cancel/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchBookings();
      setSelected((prev) => prev ? { ...prev, bookingStatus: "cancelled" } : null);
    } catch {
      alert("Cancel nahi hua. Try again.");
    } finally {
      setCancelling(false);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchStatus = filter === "all" || b.bookingStatus === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      b.farmStayId?.farmName?.toLowerCase().includes(q) ||
      b.userId?.name?.toLowerCase().includes(q) ||
      b.userId?.email?.toLowerCase().includes(q) ||
      b._id?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.bookingStatus === "confirmed").length,
    pending: bookings.filter((b) => b.bookingStatus === "pending").length,
    cancelled: bookings.filter((b) => b.bookingStatus === "cancelled").length,
    revenue: bookings
      .filter((b) => b.bookingStatus !== "cancelled")
      .reduce((sum, b) => sum + (b.priceBreakup?.totalAmount || 0), 0),
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F8FAFC",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "#0F172A",
    }}>
      {/* Top Bar */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #E2E8F0",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            background: "#16A34A",
            borderRadius: 10,
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}>🌾</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: -0.3 }}>FarmStay Admin</div>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>Booking Management</div>
          </div>
        </div>
        <button
          onClick={fetchBookings}
          style={{
            background: "#F1F5F9", border: "none", borderRadius: 8,
            padding: "8px 16px", cursor: "pointer", fontWeight: 600,
            fontSize: 13, color: "#475569", display: "flex", alignItems: "center", gap: 6,
          }}
        >
          🔄 Refresh
        </button>
      </div>

      <div style={{ padding: "28px 32px", maxWidth: 1200, margin: "0 auto" }}>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 28,
        }}>
          <StatCard icon="📋" label="Total Bookings" value={stats.total} color="#6366F1" />
          <StatCard icon="✅" label="Confirmed" value={stats.confirmed} color="#16A34A" />
          <StatCard icon="⏳" label="Pending" value={stats.pending} color="#F97316" />
          <StatCard icon="❌" label="Cancelled" value={stats.cancelled} color="#EF4444" />
          <StatCard
            icon="💰"
            label="Total Revenue"
            value={`₹${stats.revenue.toLocaleString("en-IN")}`}
            color="#0EA5E9"
          />
        </div>

        {/* Filters + Search */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #F1F5F9",
          padding: "16px 20px",
          marginBottom: 20,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}>
          <div style={{ display: "flex", gap: 8 }}>
            {["all", "pending", "confirmed", "cancelled"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{
                  padding: "7px 16px",
                  borderRadius: 8,
                  border: "none",
                  background: filter === s ? "#0F172A" : "#F1F5F9",
                  color: filter === s ? "#fff" : "#475569",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  textTransform: "capitalize",
                  transition: "all 0.15s",
                }}
              >
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="🔍  Farm, guest name, email ya ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: "1px solid #E2E8F0",
              borderRadius: 8,
              padding: "8px 14px",
              fontSize: 13,
              width: 280,
              outline: "none",
              color: "#1E293B",
              background: "#F8FAFC",
            }}
          />
        </div>

        {/* Table */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #F1F5F9",
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 60, color: "#94A3B8", fontSize: 15 }}>
              ⏳ Loading bookings...
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: 60, color: "#EF4444", fontSize: 15 }}>{error}</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#94A3B8", fontSize: 15 }}>
              🌾 Koi booking nahi mili
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #F1F5F9" }}>
                  {["Farm", "Guest", "Dates", "Rooms", "Amount", "Payment", "Status", "Action"].map((h) => (
                    <th key={h} style={{
                      padding: "12px 16px", textAlign: "left",
                      fontSize: 11, color: "#94A3B8", fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: 0.5,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => (
                  <tr
                    key={b._id}
                    style={{
                      borderBottom: "1px solid #F8FAFC",
                      background: i % 2 === 0 ? "#fff" : "#FAFAFA",
                      transition: "background 0.15s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F0FDF4")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#FAFAFA")}
                    onClick={() => setSelected(b)}
                  >
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>
                        {b.farmStayId?.farmName || "—"}
                      </div>
                      <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: "monospace" }}>
                        ...{b._id?.slice(-6)}
                      </div>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{b.userId?.name || "—"}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8" }}>{b.userId?.email}</div>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ fontSize: 12, color: "#1E293B" }}>
                        {new Date(b.checkInDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        {" → "}
                        {new Date(b.checkOutDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </div>
                      <div style={{ fontSize: 11, color: "#94A3B8" }}>{b.totalNights} nights</div>
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: 14, color: "#475569", textAlign: "center" }}>
                      {b.totalRooms || "—"}
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#0F172A" }}>
                        ₹{b.priceBreakup?.totalAmount?.toLocaleString("en-IN") || "—"}
                      </div>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <Badge label={b.paymentStatus} map={paymentColors} />
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <Badge label={b.bookingStatus} map={statusColors} />
                    </td>
                    <td style={{ padding: "13px 16px" }} onClick={(e) => e.stopPropagation()}>
                      {b.bookingStatus !== "cancelled" ? (
                        <button
                          onClick={() => handleCancel(b._id)}
                          style={{
                            background: "#FEF2F2", color: "#EF4444",
                            border: "1px solid #FECACA", borderRadius: 7,
                            padding: "6px 12px", fontWeight: 600,
                            fontSize: 12, cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      ) : (
                        <span style={{ fontSize: 12, color: "#CBD5E1" }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ marginTop: 12, fontSize: 12, color: "#94A3B8", textAlign: "right" }}>
          {filtered.length} booking{filtered.length !== 1 ? "s" : ""} dikha rahi hain
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        booking={selected}
        onClose={() => setSelected(null)}
        onCancel={handleCancel}
        cancelling={cancelling}
      />
    </div>
  );
}