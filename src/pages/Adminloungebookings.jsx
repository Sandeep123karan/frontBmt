import { useState, useEffect } from "react";

const API_BASE = "http:localhost:9000/api/lounge-bookings";

const STATUS_COLORS = {
  pending:   { bg: "#FFF3CD", text: "#856404", border: "#FFEAA7" },
  confirmed: { bg: "#D1FAE5", text: "#065F46", border: "#6EE7B7" },
  cancelled: { bg: "#FEE2E2", text: "#991B1B", border: "#FCA5A5" },
};

const PAYMENT_COLORS = {
  pending: { bg: "#EFF6FF", text: "#1E40AF", border: "#BFDBFE" },
  paid:    { bg: "#D1FAE5", text: "#065F46", border: "#6EE7B7" },
  failed:  { bg: "#FEE2E2", text: "#991B1B", border: "#FCA5A5" },
};

function Badge({ label, colors }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: "999px",
      fontSize: "11px",
      fontWeight: 700,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      background: colors.bg,
      color: colors.text,
      border: `1px solid ${colors.border}`,
    }}>
      {label}
    </span>
  );
}

function StatCard({ icon, label, value, accent }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: "16px",
      padding: "24px 28px",
      display: "flex",
      alignItems: "center",
      gap: "18px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
      border: "1px solid #F1F5F9",
      flex: "1 1 180px",
      minWidth: "160px",
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: "12px",
        background: accent + "18",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "22px",
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: "26px", fontWeight: 800, color: "#0F172A", lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: "12px", color: "#64748B", marginTop: "3px", fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}

function Modal({ booking, onClose, onStatusChange }) {
  const [status, setStatus] = useState(booking.status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onStatusChange(booking._id, status);
    setSaving(false);
    onClose();
  };

  const lounge = booking.loungeId;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: "20px",
        width: "100%", maxWidth: "520px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        overflow: "hidden",
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
          padding: "24px 28px",
          color: "#fff",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "11px", color: "#94A3B8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>Booking Detail</div>
              <div style={{ fontSize: "20px", fontWeight: 800 }}>{lounge?.name || "Lounge"}</div>
              <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "4px" }}>ID: {booking._id?.slice(-8).toUpperCase()}</div>
            </div>
            <button onClick={onClose} style={{
              background: "rgba(255,255,255,0.1)", border: "none", color: "#fff",
              width: 32, height: 32, borderRadius: "8px", cursor: "pointer",
              fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
          </div>
        </div>

        <div style={{ padding: "24px 28px" }}>
          {/* Grid info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
            {[
              ["👤 Guest", booking.contactDetails?.name || "N/A"],
              ["📱 Phone", booking.contactDetails?.phone || "N/A"],
              ["✉️ Email", booking.contactDetails?.email || "N/A"],
              ["👥 Guests", booking.totalGuests],
              ["📅 Visit Date", new Date(booking.visitDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })],
              ["💰 Amount", `₹${booking.totalAmount?.toLocaleString("en-IN") || "—"}`],
            ].map(([label, val]) => (
              <div key={label} style={{
                background: "#F8FAFC", borderRadius: "10px", padding: "12px 14px",
              }}>
                <div style={{ fontSize: "11px", color: "#94A3B8", marginBottom: "4px" }}>{label}</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#1E293B" }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Payment status */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "20px" }}>
            <span style={{ fontSize: "13px", color: "#64748B", fontWeight: 500 }}>Payment:</span>
            <Badge label={booking.paymentStatus} colors={PAYMENT_COLORS[booking.paymentStatus] || PAYMENT_COLORS.pending} />
          </div>

          {/* Status update */}
          <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "20px" }}>
            <label style={{ fontSize: "12px", color: "#64748B", fontWeight: 600, display: "block", marginBottom: "8px" }}>
              UPDATE BOOKING STATUS
            </label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
              {["pending", "confirmed", "cancelled"].map(s => (
                <button key={s} onClick={() => setStatus(s)} style={{
                  padding: "8px 18px", borderRadius: "8px", cursor: "pointer",
                  fontWeight: 600, fontSize: "13px", textTransform: "capitalize",
                  border: status === s ? "2px solid #1E293B" : "2px solid #E2E8F0",
                  background: status === s ? "#1E293B" : "#fff",
                  color: status === s ? "#fff" : "#475569",
                  transition: "all 0.15s",
                }}>{s}</button>
              ))}
            </div>
            <button onClick={handleSave} disabled={saving} style={{
              width: "100%", padding: "12px", borderRadius: "10px",
              background: saving ? "#94A3B8" : "#1E293B",
              color: "#fff", border: "none", fontWeight: 700,
              fontSize: "14px", cursor: saving ? "not-allowed" : "pointer",
              letterSpacing: "0.02em",
            }}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoungeBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.success) setBookings(data.data);
      else setError(data.message);
    } catch {
      setError("Failed to fetch bookings. Check your server connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.map(b => b._id === id ? data.data : b));
      }
    } catch { /* handle */ }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`${API_BASE}/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.success) setBookings(prev => prev.filter(b => b._id !== id));
    } catch { /* handle */ } finally {
      setDeleting(null);
    }
  };

  const filtered = bookings.filter(b => {
    const matchStatus = filter === "all" || b.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q
      || b.contactDetails?.name?.toLowerCase().includes(q)
      || b.contactDetails?.email?.toLowerCase().includes(q)
      || b.loungeId?.name?.toLowerCase().includes(q)
      || b._id?.includes(q);
    return matchStatus && matchSearch;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    pending: bookings.filter(b => b.status === "pending").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
    revenue: bookings.filter(b => b.paymentStatus === "paid").reduce((s, b) => s + (b.totalAmount || 0), 0),
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F8FAFC",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      padding: "32px 24px",
    }}>
      {/* Header */}
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "32px" }}>
          <div style={{ fontSize: "11px", color: "#94A3B8", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>
            Admin Panel
          </div>
          <h1 style={{
            fontSize: "32px", fontWeight: 900, color: "#0F172A",
            margin: 0, letterSpacing: "-0.02em",
          }}>
            Lounge Bookings
          </h1>
          <p style={{ color: "#64748B", marginTop: "6px", fontSize: "14px" }}>
            Manage all lounge reservations from one place
          </p>
        </div>

        {/* Stats Row */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "28px" }}>
          <StatCard icon="🗂️" label="Total Bookings"  value={stats.total}     accent="#6366F1" />
          <StatCard icon="✅" label="Confirmed"        value={stats.confirmed} accent="#10B981" />
          <StatCard icon="⏳" label="Pending"          value={stats.pending}   accent="#F59E0B" />
          <StatCard icon="❌" label="Cancelled"        value={stats.cancelled} accent="#EF4444" />
          <StatCard icon="💰" label="Paid Revenue"     value={`₹${stats.revenue.toLocaleString("en-IN")}`} accent="#8B5CF6" />
        </div>

        {/* Filters & Search */}
        <div style={{
          background: "#fff", borderRadius: "16px", padding: "16px 20px",
          display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center",
          marginBottom: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid #F1F5F9",
        }}>
          <input
            type="text"
            placeholder="🔍  Search by name, email, lounge..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: "1 1 220px", padding: "9px 14px", borderRadius: "8px",
              border: "1.5px solid #E2E8F0", fontSize: "13px", color: "#1E293B",
              outline: "none", background: "#F8FAFC",
            }}
          />
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {["all", "pending", "confirmed", "cancelled"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "8px 16px", borderRadius: "8px", fontSize: "12px",
                fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
                border: filter === f ? "none" : "1.5px solid #E2E8F0",
                background: filter === f ? "#1E293B" : "#fff",
                color: filter === f ? "#fff" : "#475569",
              }}>{f}</button>
            ))}
          </div>
          <button onClick={fetchBookings} style={{
            padding: "9px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: 700,
            background: "#F1F5F9", border: "none", cursor: "pointer", color: "#475569",
          }}>↺ Refresh</button>
        </div>

        {/* Table */}
        <div style={{
          background: "#fff", borderRadius: "16px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid #F1F5F9", overflow: "hidden",
        }}>
          {loading ? (
            <div style={{ padding: "60px", textAlign: "center", color: "#94A3B8" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
              <div style={{ fontWeight: 600 }}>Loading bookings...</div>
            </div>
          ) : error ? (
            <div style={{ padding: "60px", textAlign: "center", color: "#EF4444" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>⚠️</div>
              <div style={{ fontWeight: 600 }}>{error}</div>
              <button onClick={fetchBookings} style={{
                marginTop: "14px", padding: "8px 20px", background: "#1E293B",
                color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600,
              }}>Retry</button>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center", color: "#94A3B8" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>📭</div>
              <div style={{ fontWeight: 600 }}>No bookings found</div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #F1F5F9" }}>
                    {["#", "Lounge", "Guest", "Visit Date", "Guests", "Amount", "Status", "Payment", "Actions"].map(h => (
                      <th key={h} style={{
                        padding: "12px 16px", textAlign: "left",
                        fontSize: "11px", color: "#94A3B8",
                        fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b, i) => (
                    <tr key={b._id} style={{
                      borderBottom: "1px solid #F8FAFC",
                      transition: "background 0.1s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "14px 16px", fontSize: "12px", color: "#94A3B8", fontWeight: 600 }}>
                        {String(i + 1).padStart(2, "0")}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#1E293B" }}>
                          {b.loungeId?.name || "—"}
                        </div>
                        <div style={{ fontSize: "11px", color: "#94A3B8" }}>
                          {b._id?.slice(-6).toUpperCase()}
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>
                          {b.contactDetails?.name || "—"}
                        </div>
                        <div style={{ fontSize: "11px", color: "#94A3B8" }}>
                          {b.contactDetails?.phone || ""}
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "13px", color: "#334155", whiteSpace: "nowrap" }}>
                        {new Date(b.visitDate).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "13px", color: "#334155", textAlign: "center" }}>
                        {b.totalGuests}
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 700, color: "#1E293B", whiteSpace: "nowrap" }}>
                        ₹{b.totalAmount?.toLocaleString("en-IN") || "—"}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <Badge label={b.status} colors={STATUS_COLORS[b.status] || STATUS_COLORS.pending} />
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <Badge label={b.paymentStatus} colors={PAYMENT_COLORS[b.paymentStatus] || PAYMENT_COLORS.pending} />
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button onClick={() => setSelected(b)} style={{
                            padding: "6px 12px", borderRadius: "6px", fontSize: "12px",
                            background: "#EFF6FF", color: "#1D4ED8", border: "none",
                            cursor: "pointer", fontWeight: 600,
                          }}>View</button>
                          <button
                            onClick={() => handleDelete(b._id)}
                            disabled={deleting === b._id}
                            style={{
                              padding: "6px 12px", borderRadius: "6px", fontSize: "12px",
                              background: deleting === b._id ? "#F1F5F9" : "#FEF2F2",
                              color: deleting === b._id ? "#94A3B8" : "#DC2626",
                              border: "none", cursor: deleting === b._id ? "not-allowed" : "pointer",
                              fontWeight: 600,
                            }}>
                            {deleting === b._id ? "..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {!loading && !error && (
            <div style={{
              padding: "12px 20px", borderTop: "1px solid #F1F5F9",
              fontSize: "12px", color: "#94A3B8",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span>Showing <b style={{ color: "#1E293B" }}>{filtered.length}</b> of <b style={{ color: "#1E293B" }}>{bookings.length}</b> bookings</span>
              <span>Last updated: {new Date().toLocaleTimeString("en-IN")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <Modal
          booking={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}