import { useState, useEffect, useCallback } from "react";

const API_BASE = "https://bmtadmin.onrender.com/api/homestay-bookings";

const STATUS_COLORS = {
  pending:    { bg: "#FFF3CD", color: "#856404", border: "#FFEAA7" },
  confirmed:  { bg: "#D1ECF1", color: "#0C5460", border: "#BEE5EB" },
  "checked-in":  { bg: "#D4EDDA", color: "#155724", border: "#C3E6CB" },
  "checked-out": { bg: "#E2E3E5", color: "#383D41", border: "#D6D8DB" },
  cancelled:  { bg: "#F8D7DA", color: "#721C24", border: "#F5C6CB" },
};

const PAYMENT_COLORS = {
  pending: { bg: "#FFF3CD", color: "#856404" },
  paid:    { bg: "#D4EDDA", color: "#155724" },
  failed:  { bg: "#F8D7DA", color: "#721C24" },
};

const STATUS_OPTIONS = ["pending", "confirmed", "checked-in", "checked-out", "cancelled"];

function Badge({ label, type = "status" }) {
  const map = type === "payment" ? PAYMENT_COLORS : STATUS_COLORS;
  const style = map[label] || { bg: "#eee", color: "#333", border: "#ccc" };
  return (
    <span style={{
      padding: "3px 10px",
      borderRadius: "20px",
      fontSize: "11px",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      background: style.bg,
      color: style.color,
      border: `1px solid ${style.border || style.bg}`,
    }}>
      {label}
    </span>
  );
}

function StatCard({ icon, label, value, accent }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: "14px",
      padding: "22px 24px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      border: "1px solid #F0F0F0",
      flex: "1 1 180px",
      minWidth: 0,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: "12px",
        background: accent + "18",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "22px", flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: "26px", fontWeight: 800, color: "#1A1A2E", fontFamily: "'Syne', sans-serif" }}>{value}</div>
        <div style={{ fontSize: "12px", color: "#888", fontWeight: 500, marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

function Modal({ booking, onClose, onStatusUpdate, onCancel }) {
  const [newStatus, setNewStatus] = useState(booking.bookingStatus);
  const [updating, setUpdating] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [msg, setMsg] = useState("");

  const b = booking;
  const hs = b.homeStayId;
  const user = b.userId;
  const contact = b.contactDetails || {};

  const handleStatusUpdate = async () => {
    if (newStatus === b.bookingStatus) return;
    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE}/status/${b._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) { setMsg("✅ Status updated!"); onStatusUpdate(b._id, newStatus); }
      else setMsg("❌ " + data.message);
    } catch { setMsg("❌ Network error"); }
    setUpdating(false);
  };

  const handleCancel = async () => {
    if (!window.confirm("Cancel this booking?")) return;
    setCancelling(true);
    try {
      const res = await fetch(`${API_BASE}/cancel/${b._id}`, { method: "PUT" });
      const data = await res.json();
      if (data.success) { setMsg("✅ Booking cancelled"); onCancel(b._id); }
      else setMsg("❌ " + data.message);
    } catch { setMsg("❌ Network error"); }
    setCancelling(false);
  };

  const nights = b.totalNights || 1;
  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  const curr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(10,10,20,0.6)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px", backdropFilter: "blur(4px)",
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "#FAFAFA",
        borderRadius: "20px",
        width: "100%", maxWidth: "680px",
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)",
          borderRadius: "20px 20px 0 0",
          padding: "24px 28px",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        }}>
          <div>
            <div style={{ fontSize: "11px", color: "#8899AA", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 6 }}>Booking Details</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "18px", color: "#fff" }}>
              {hs?.name || "HomeStay"}
            </div>
            <div style={{ fontSize: "12px", color: "#8899AA", marginTop: 4 }}>ID: {b._id}</div>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.1)", border: "none", color: "#fff",
            width: 36, height: 36, borderRadius: "50%", fontSize: "18px",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}>×</button>
        </div>

        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Status Badges */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <Badge label={b.bookingStatus} type="status" />
            <Badge label={b.paymentStatus || "pending"} type="payment" />
          </div>

          {/* Dates */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
            gap: "12px",
          }}>
            {[
              { label: "Check-In", value: fmt(b.checkInDate), icon: "📅" },
              { label: "Check-Out", value: fmt(b.checkOutDate), icon: "📅" },
              { label: "Duration", value: `${nights} Night${nights > 1 ? "s" : ""}`, icon: "🌙" },
            ].map((item) => (
              <div key={item.label} style={{
                background: "#fff", borderRadius: "12px", padding: "14px",
                border: "1px solid #EBEBEB", textAlign: "center",
              }}>
                <div style={{ fontSize: "20px" }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: "13px", marginTop: 4, color: "#1A1A2E" }}>{item.value}</div>
                <div style={{ fontSize: "11px", color: "#AAA", marginTop: 2 }}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* Guest & Rooms */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <InfoRow icon="👥" label="Total Guests" value={b.totalGuests} />
            <InfoRow icon="🚪" label="Total Rooms" value={b.totalRooms || 1} />
          </div>

          {/* Contact Details */}
          {(contact.name || contact.email || contact.phone) && (
            <Section title="Contact Details">
              {contact.name && <InfoRow icon="👤" label="Name" value={contact.name} />}
              {contact.phone && <InfoRow icon="📞" label="Phone" value={contact.phone} />}
              {contact.email && <InfoRow icon="📧" label="Email" value={contact.email} />}
            </Section>
          )}

          {/* Price Breakdown */}
          <Section title="Price Breakdown">
            <PriceRow label={`₹${b.pricePerNight}/night × ${nights} nights${b.totalRooms > 1 ? ` × ${b.totalRooms} rooms` : ""}`} value={curr((b.pricePerNight || 0) * nights * (b.totalRooms || 1))} />
            {b.cleaningFee > 0 && <PriceRow label="Cleaning Fee" value={curr(b.cleaningFee)} />}
            {b.serviceFee > 0 && <PriceRow label="Service Fee" value={curr(b.serviceFee)} />}
            {b.tax > 0 && <PriceRow label="Tax" value={curr(b.tax)} />}
            {b.discount > 0 && <PriceRow label="Discount" value={`-${curr(b.discount)}`} isDiscount />}
            <div style={{ borderTop: "2px solid #EBEBEB", marginTop: 8, paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 800, fontSize: "15px", color: "#1A1A2E" }}>Total Amount</span>
              <span style={{ fontWeight: 800, fontSize: "15px", color: "#E63946" }}>{curr(b.totalAmount)}</span>
            </div>
          </Section>

          {/* Special Request */}
          {b.specialRequest && (
            <Section title="Special Request">
              <p style={{ margin: 0, color: "#555", fontSize: "13px", lineHeight: 1.6 }}>{b.specialRequest}</p>
            </Section>
          )}

          {/* Update Status */}
          <Section title="Update Booking Status">
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                style={{
                  padding: "9px 14px", borderRadius: "10px", border: "1.5px solid #DEDEDE",
                  fontSize: "13px", fontWeight: 600, color: "#1A1A2E", background: "#fff",
                  cursor: "pointer", outline: "none", flex: 1, minWidth: 140,
                }}
              >
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={handleStatusUpdate} disabled={updating || newStatus === b.bookingStatus} style={{
                padding: "9px 20px", borderRadius: "10px", border: "none",
                background: newStatus === b.bookingStatus ? "#CCC" : "#1A1A2E",
                color: "#fff", fontWeight: 700, fontSize: "13px", cursor: updating || newStatus === b.bookingStatus ? "not-allowed" : "pointer",
              }}>
                {updating ? "Updating..." : "Update"}
              </button>
              {b.bookingStatus !== "cancelled" && (
                <button onClick={handleCancel} disabled={cancelling} style={{
                  padding: "9px 18px", borderRadius: "10px", border: "1.5px solid #E63946",
                  background: "transparent", color: "#E63946", fontWeight: 700, fontSize: "13px", cursor: "pointer",
                }}>
                  {cancelling ? "..." : "Cancel Booking"}
                </button>
              )}
            </div>
            {msg && <div style={{ marginTop: 8, fontSize: "13px", color: msg.startsWith("✅") ? "#155724" : "#721C24" }}>{msg}</div>}
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #EBEBEB", padding: "16px 18px" }}>
      <div style={{ fontWeight: 700, fontSize: "12px", color: "#AAA", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>{title}</div>
      {children}
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 0" }}>
      <span style={{ fontSize: "14px" }}>{icon}</span>
      <span style={{ fontSize: "12px", color: "#888", minWidth: 80 }}>{label}</span>
      <span style={{ fontWeight: 600, fontSize: "13px", color: "#1A1A2E" }}>{value}</span>
    </div>
  );
}

function PriceRow({ label, value, isDiscount }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
      <span style={{ fontSize: "13px", color: "#666" }}>{label}</span>
      <span style={{ fontSize: "13px", fontWeight: 600, color: isDiscount ? "#28A745" : "#333" }}>{value}</span>
    </div>
  );
}

export default function HomeStayAdminPanel() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/all`);
      const data = await res.json();
      if (data.success) setBookings(data.bookings);
      else setError(data.message || "Failed to load bookings");
    } catch {
      setError("Could not connect to server. Make sure backend is running.");
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleStatusUpdate = (id, newStatus) => {
    setBookings((prev) => prev.map((b) => b._id === id ? { ...b, bookingStatus: newStatus } : b));
    if (selected?._id === id) setSelected((prev) => ({ ...prev, bookingStatus: newStatus }));
  };

  const handleCancel = (id) => {
    setBookings((prev) => prev.map((b) => b._id === id ? { ...b, bookingStatus: "cancelled" } : b));
    if (selected?._id === id) setSelected((prev) => ({ ...prev, bookingStatus: "cancelled" }));
  };

  const filtered = bookings.filter((b) => {
    const hs = b.homeStayId;
    const name = (hs?.name || "").toLowerCase();
    const contact = (b.contactDetails?.name || "").toLowerCase();
    const q = search.toLowerCase();
    const matchSearch = !q || name.includes(q) || contact.includes(q) || b._id.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || b.bookingStatus === filterStatus;
    const matchPayment = filterPayment === "all" || b.paymentStatus === filterPayment;
    return matchSearch && matchStatus && matchPayment;
  });

  // Stats
  const total = bookings.length;
  const confirmed = bookings.filter((b) => b.bookingStatus === "confirmed").length;
  const pending = bookings.filter((b) => b.bookingStatus === "pending").length;
  const cancelled = bookings.filter((b) => b.bookingStatus === "cancelled").length;
  const totalRevenue = bookings
    .filter((b) => b.bookingStatus !== "cancelled")
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  const curr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #F2F4F8; font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CCC; border-radius: 3px; }
        .row-hover:hover { background: #F7F9FF !important; cursor: pointer; }
        .btn-ghost:hover { background: #F0F0F0 !important; }
        select:focus, input:focus { outline: 2px solid #4361EE; outline-offset: 0; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#F2F4F8" }}>
        <div style={{ minHeight: "100vh" }}>
          {/* Main Content */}
          <div style={{ padding: "32px", minWidth: 0 }}>

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h1 style={{ margin: 0, fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "26px", color: "#1A1A2E" }}>Booking Management</h1>
                <p style={{ margin: "4px 0 0", color: "#888", fontSize: "13px" }}>Manage all homestay reservations</p>
              </div>
              <button onClick={fetchBookings} className="btn-ghost" style={{
                padding: "9px 18px", borderRadius: "10px", border: "1.5px solid #DEDEDE",
                background: "#fff", fontWeight: 600, fontSize: "13px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "6px", color: "#333",
              }}>
                🔄 Refresh
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: "16px", marginBottom: 28, flexWrap: "wrap" }}>
              <StatCard icon="📋" label="Total Bookings" value={total} accent="#4361EE" />
              <StatCard icon="✅" label="Confirmed" value={confirmed} accent="#28A745" />
              <StatCard icon="⏳" label="Pending" value={pending} accent="#FFC107" />
              <StatCard icon="❌" label="Cancelled" value={cancelled} accent="#E63946" />
              <StatCard icon="💰" label="Revenue (Active)" value={curr(totalRevenue)} accent="#4CC9F0" />
            </div>

            {/* Filters */}
            <div style={{
              background: "#fff", borderRadius: "14px", padding: "16px 20px",
              display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 20,
              border: "1px solid #F0F0F0",
            }}>
              <input
                type="text"
                placeholder="🔍  Search by name, ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  flex: "1 1 200px", padding: "9px 14px", borderRadius: "10px",
                  border: "1.5px solid #DEDEDE", fontSize: "13px", fontFamily: "'DM Sans', sans-serif",
                }}
              />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{
                padding: "9px 14px", borderRadius: "10px", border: "1.5px solid #DEDEDE",
                fontSize: "13px", fontWeight: 600, color: "#333", background: "#fff", cursor: "pointer",
              }}>
                <option value="all">All Status</option>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)} style={{
                padding: "9px 14px", borderRadius: "10px", border: "1.5px solid #DEDEDE",
                fontSize: "13px", fontWeight: 600, color: "#333", background: "#fff", cursor: "pointer",
              }}>
                <option value="all">All Payment</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
              <div style={{ fontSize: "12px", color: "#888", fontWeight: 500, marginLeft: "auto" }}>
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Table */}
            <div style={{
              background: "#fff", borderRadius: "16px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden",
              border: "1px solid #F0F0F0",
            }}>
              {loading ? (
                <div style={{ padding: "60px", textAlign: "center", color: "#888" }}>
                  <div style={{ fontSize: "32px", marginBottom: 12, animation: "spin 1s linear infinite" }}>⏳</div>
                  <div style={{ fontWeight: 600 }}>Loading bookings...</div>
                </div>
              ) : error ? (
                <div style={{ padding: "60px", textAlign: "center" }}>
                  <div style={{ fontSize: "32px", marginBottom: 12 }}>⚠️</div>
                  <div style={{ fontWeight: 600, color: "#E63946", marginBottom: 8 }}>{error}</div>
                  <button onClick={fetchBookings} style={{
                    padding: "8px 20px", borderRadius: "8px", background: "#1A1A2E",
                    color: "#fff", border: "none", cursor: "pointer", fontWeight: 600,
                  }}>Try Again</button>
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ padding: "60px", textAlign: "center", color: "#888" }}>
                  <div style={{ fontSize: "32px", marginBottom: 12 }}>🏡</div>
                  <div style={{ fontWeight: 600 }}>No bookings found</div>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #F0F0F0" }}>
                        {["#", "HomeStay", "Guest", "Check-In", "Check-Out", "Nights", "Amount", "Booking Status", "Payment", "Action"].map((h) => (
                          <th key={h} style={{
                            padding: "14px 16px", textAlign: "left",
                            fontSize: "11px", fontWeight: 700, color: "#AAA",
                            letterSpacing: "0.8px", textTransform: "uppercase",
                            whiteSpace: "nowrap",
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((b, i) => {
                        const hs = b.homeStayId;
                        const contact = b.contactDetails || {};
                        return (
                          <tr
                            key={b._id}
                            className="row-hover"
                            onClick={() => setSelected(b)}
                            style={{ borderBottom: "1px solid #F7F7F7", transition: "background 0.15s" }}
                          >
                            <td style={{ padding: "14px 16px", fontSize: "12px", color: "#AAA", fontWeight: 600 }}>{i + 1}</td>
                            <td style={{ padding: "14px 16px" }}>
                              <div style={{ fontWeight: 700, fontSize: "13px", color: "#1A1A2E" }}>{hs?.name || "—"}</div>
                              <div style={{ fontSize: "11px", color: "#AAA", marginTop: 2 }}>{hs?.location || hs?.city || ""}</div>
                            </td>
                            <td style={{ padding: "14px 16px" }}>
                              <div style={{ fontWeight: 600, fontSize: "13px", color: "#333" }}>{contact.name || "—"}</div>
                              <div style={{ fontSize: "11px", color: "#AAA" }}>{contact.phone || ""}</div>
                            </td>
                            <td style={{ padding: "14px 16px", fontSize: "13px", color: "#555", whiteSpace: "nowrap" }}>{fmt(b.checkInDate)}</td>
                            <td style={{ padding: "14px 16px", fontSize: "13px", color: "#555", whiteSpace: "nowrap" }}>{fmt(b.checkOutDate)}</td>
                            <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 600, color: "#333", textAlign: "center" }}>{b.totalNights || "—"}</td>
                            <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 700, color: "#E63946", whiteSpace: "nowrap" }}>{curr(b.totalAmount)}</td>
                            <td style={{ padding: "14px 16px" }}><Badge label={b.bookingStatus} /></td>
                            <td style={{ padding: "14px 16px" }}><Badge label={b.paymentStatus || "pending"} type="payment" /></td>
                            <td style={{ padding: "14px 16px" }}>
                              <button
                                onClick={(e) => { e.stopPropagation(); setSelected(b); }}
                                style={{
                                  padding: "6px 14px", borderRadius: "8px",
                                  background: "#F0F4FF", color: "#4361EE",
                                  border: "1px solid #D0D8FF", fontWeight: 700,
                                  fontSize: "12px", cursor: "pointer",
                                }}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {selected && (
        <Modal
          booking={selected}
          onClose={() => setSelected(null)}
          onStatusUpdate={handleStatusUpdate}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}