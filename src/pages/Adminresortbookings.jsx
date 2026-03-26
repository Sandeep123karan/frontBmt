import { useState, useEffect } from "react";

const API_BASE = "https://bmtadmin.onrender.com/api/resort-bookings";

const statusColors = {
  confirmed: { bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
  pending: { bg: "#fef9c3", text: "#854d0e", dot: "#eab308" },
  cancelled: { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444" },
  completed: { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6" },
};

const paymentColors = {
  paid: { bg: "#d1fae5", text: "#065f46" },
  pending: { bg: "#fef9c3", text: "#854d0e" },
  failed: { bg: "#fee2e2", text: "#991b1b" },
};

export default function AdminResortBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelModal, setCancelModal] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      showToast("Failed to fetch bookings", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      const res = await fetch(`${API_BASE}/${cancelModal._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: cancelReason }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Booking cancelled successfully", "success");
        setBookings((prev) =>
          prev.map((b) => (b._id === cancelModal._id ? data.booking : b))
        );
        if (selectedBooking?._id === cancelModal._id)
          setSelectedBooking(data.booking);
      }
    } catch {
      showToast("Failed to cancel booking", "error");
    } finally {
      setCancelModal(null);
      setCancelReason("");
    }
  };

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch =
      b.bookingId?.toLowerCase().includes(q) ||
      b.contactDetails?.name?.toLowerCase().includes(q) ||
      b.contactDetails?.phone?.includes(q) ||
      b.roomName?.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || b.bookingStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.bookingStatus === "confirmed").length,
    cancelled: bookings.filter((b) => b.bookingStatus === "cancelled").length,
    revenue: bookings
      .filter((b) => b.bookingStatus !== "cancelled")
      .reduce((s, b) => s + (b.finalAmount || 0), 0),
  };

  const fmt = (n) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', 'Segoe UI', sans-serif; }
        .btn { cursor: pointer; border: none; border-radius: 8px; font-family: inherit; font-weight: 500; transition: all 0.18s; }
        .btn:hover { filter: brightness(0.93); transform: translateY(-1px); }
        .btn:active { transform: translateY(0); }
        .row-hover:hover { background: #f1f5f9 !important; cursor: pointer; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.55); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 16px; backdrop-filter: blur(3px); }
        input:focus, select:focus, textarea:focus { outline: 2px solid #6366f1; outline-offset: 1px; }
        .tag { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; letter-spacing: 0.02em; }
        .toast { position: fixed; bottom: 24px; right: 24px; z-index: 999; padding: 12px 20px; border-radius: 10px; font-weight: 500; font-size: 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); animation: slideUp 0.3s ease; }
        @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .scroll-y { overflow-y: auto; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
      `}</style>

      {/* HEADER */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 32px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏖️</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>Resort Admin</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: -1 }}>Booking Management</div>
            </div>
          </div>
          <button className="btn" onClick={fetchBookings} style={{ padding: "8px 16px", background: "#f1f5f9", color: "#475569", fontSize: 13 }}>
            ↻ Refresh
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "28px 32px" }}>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Total Bookings", value: stats.total, icon: "📋", color: "#6366f1" },
            { label: "Confirmed", value: stats.confirmed, icon: "✅", color: "#10b981" },
            { label: "Cancelled", value: stats.cancelled, icon: "❌", color: "#ef4444" },
            { label: "Total Revenue", value: fmt(stats.revenue), icon: "💰", color: "#f59e0b" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500, marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", fontFamily: "'DM Mono', monospace" }}>{s.value}</div>
                </div>
                <div style={{ fontSize: 26 }}>{s.icon}</div>
              </div>
              <div style={{ height: 3, background: "#f1f5f9", borderRadius: 999, marginTop: 14 }}>
                <div style={{ height: "100%", width: "60%", background: s.color, borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>

        {/* FILTERS */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <input
            placeholder="🔍  Search by Booking ID, Name, Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 240, padding: "10px 16px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 14, background: "#fff", color: "#0f172a" }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 14, background: "#fff", color: "#0f172a", cursor: "pointer" }}
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
          <div style={{ display: "flex", alignItems: "center", padding: "0 14px", background: "#f1f5f9", borderRadius: 10, fontSize: 13, color: "#64748b", fontWeight: 500 }}>
            {filtered.length} results
          </div>
        </div>

        {/* TABLE */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  {["Booking ID", "Guest", "Resort / Room", "Check-in → Out", "Nights", "Guests", "Amount", "Payment", "Status", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#64748b", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={10} style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>Loading bookings...
                  </td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={10} style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>No bookings found
                  </td></tr>
                ) : filtered.map((b) => {
                  const sc = statusColors[b.bookingStatus] || statusColors.pending;
                  const pc = paymentColors[b.paymentStatus] || paymentColors.pending;
                  return (
                    <tr key={b._id} className="row-hover" style={{ borderBottom: "1px solid #f1f5f9" }} onClick={() => setSelectedBooking(b)}>
                      <td style={{ padding: "13px 16px" }}>
                        <span style={{ fontFamily: "'DM Mono',monospace", fontWeight: 600, color: "#6366f1", fontSize: 12 }}>{b.bookingId}</span>
                      </td>
                      <td style={{ padding: "13px 16px" }}>
                        <div style={{ fontWeight: 600, color: "#0f172a" }}>{b.contactDetails?.name || "—"}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{b.contactDetails?.phone}</div>
                      </td>
                      <td style={{ padding: "13px 16px" }}>
                        <div style={{ fontWeight: 500, color: "#334155" }}>{b.resortId?.name || "Resort"}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{b.roomName} · {b.roomType}</div>
                      </td>
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <div style={{ color: "#334155", fontWeight: 500 }}>{fmtDate(b.checkInDate)}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>→ {fmtDate(b.checkOutDate)}</div>
                      </td>
                      <td style={{ padding: "13px 16px", textAlign: "center", fontWeight: 600, color: "#334155" }}>{b.totalNights}</td>
                      <td style={{ padding: "13px 16px", textAlign: "center", color: "#334155" }}>{b.totalGuests}</td>
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <div style={{ fontWeight: 700, color: "#0f172a", fontFamily: "'DM Mono',monospace" }}>{fmt(b.finalAmount)}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>Tax: {fmt(b.taxAmount)}</div>
                      </td>
                      <td style={{ padding: "13px 16px" }}>
                        <span className="tag" style={{ background: pc.bg, color: pc.text }}>{b.paymentStatus}</span>
                      </td>
                      <td style={{ padding: "13px 16px" }}>
                        <span className="tag" style={{ background: sc.bg, color: sc.text }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot, display: "inline-block" }} />
                          {b.bookingStatus}
                        </span>
                      </td>
                      <td style={{ padding: "13px 16px" }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="btn" onClick={() => setSelectedBooking(b)} style={{ padding: "5px 10px", background: "#ede9fe", color: "#6d28d9", fontSize: 12 }}>View</button>
                          {b.bookingStatus !== "cancelled" && b.bookingStatus !== "completed" && (
                            <button className="btn" onClick={() => setCancelModal(b)} style={{ padding: "5px 10px", background: "#fee2e2", color: "#b91c1c", fontSize: 12 }}>Cancel</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div onClick={(e) => e.stopPropagation()} className="scroll-y" style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 600, maxHeight: "90vh", overflow: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}>
            <div style={{ padding: "24px 28px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#fff", zIndex: 2 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18, color: "#0f172a" }}>Booking Details</div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: "#6366f1", fontWeight: 600 }}>{selectedBooking.bookingId}</div>
              </div>
              <button className="btn" onClick={() => setSelectedBooking(null)} style={{ width: 32, height: 32, background: "#f1f5f9", color: "#64748b", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>×</button>
            </div>
            <div style={{ padding: "24px 28px" }}>

              {/* Status badges */}
              <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                {(() => { const sc = statusColors[selectedBooking.bookingStatus] || statusColors.pending; return <span className="tag" style={{ background: sc.bg, color: sc.text, fontSize: 13, padding: "5px 14px" }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: sc.dot, display: "inline-block" }} />{selectedBooking.bookingStatus}</span>; })()}
                {(() => { const pc = paymentColors[selectedBooking.paymentStatus] || paymentColors.pending; return <span className="tag" style={{ background: pc.bg, color: pc.text, fontSize: 13, padding: "5px 14px" }}>{selectedBooking.paymentStatus}</span>; })()}
              </div>

              {[
                { title: "🏖️ Resort & Room", rows: [
                  ["Resort", selectedBooking.resortId?.name || "—"],
                  ["Room", `${selectedBooking.roomName} (${selectedBooking.roomType})`],
                  ["Rooms Booked", selectedBooking.totalRooms],
                ]},
                { title: "📅 Stay Details", rows: [
                  ["Check-in", fmtDate(selectedBooking.checkInDate)],
                  ["Check-out", fmtDate(selectedBooking.checkOutDate)],
                  ["Total Nights", selectedBooking.totalNights],
                  ["Total Guests", selectedBooking.totalGuests],
                ]},
                { title: "👤 Contact", rows: [
                  ["Name", selectedBooking.contactDetails?.name],
                  ["Phone", selectedBooking.contactDetails?.phone],
                  ["Email", selectedBooking.contactDetails?.email],
                ]},
                { title: "💰 Pricing", rows: [
                  ["Price/Night", fmt(selectedBooking.pricePerNight)],
                  ["Base Amount", fmt(selectedBooking.totalAmount)],
                  ["Tax", fmt(selectedBooking.taxAmount)],
                  ["Final Amount", fmt(selectedBooking.finalAmount)],
                ]},
              ].map((sec) => (
                <div key={sec.title} style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10 }}>{sec.title}</div>
                  <div style={{ background: "#f8fafc", borderRadius: 12, overflow: "hidden", border: "1px solid #e2e8f0" }}>
                    {sec.rows.map(([k, v], i) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderBottom: i < sec.rows.length - 1 ? "1px solid #e2e8f0" : "none" }}>
                        <span style={{ color: "#64748b", fontSize: 13 }}>{k}</span>
                        <span style={{ fontWeight: 600, color: "#0f172a", fontSize: 13 }}>{v || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {selectedBooking.cancelReason && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "12px 14px", marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#b91c1c", marginBottom: 4 }}>CANCEL REASON</div>
                  <div style={{ fontSize: 13, color: "#7f1d1d" }}>{selectedBooking.cancelReason}</div>
                  {selectedBooking.cancelledAt && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>Cancelled on {fmtDate(selectedBooking.cancelledAt)}</div>}
                </div>
              )}

              {selectedBooking.bookingStatus !== "cancelled" && selectedBooking.bookingStatus !== "completed" && (
                <button className="btn" onClick={() => { setCancelModal(selectedBooking); setSelectedBooking(null); }} style={{ width: "100%", padding: "12px", background: "#fee2e2", color: "#b91c1c", fontSize: 14, fontWeight: 600, borderRadius: 12 }}>
                  Cancel This Booking
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CANCEL MODAL */}
      {cancelModal && (
        <div className="modal-overlay" onClick={() => setCancelModal(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 420, padding: 28, boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}>
            <div style={{ fontSize: 32, marginBottom: 12, textAlign: "center" }}>⚠️</div>
            <div style={{ fontWeight: 700, fontSize: 18, color: "#0f172a", textAlign: "center", marginBottom: 6 }}>Cancel Booking?</div>
            <div style={{ fontSize: 13, color: "#64748b", textAlign: "center", marginBottom: 20 }}>
              Booking <span style={{ fontFamily: "'DM Mono',monospace", fontWeight: 700, color: "#6366f1" }}>{cancelModal.bookingId}</span> — {cancelModal.contactDetails?.name}
            </div>
            <textarea
              placeholder="Reason for cancellation (optional)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
              style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 13, fontFamily: "inherit", resize: "vertical", marginBottom: 16 }}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn" onClick={() => setCancelModal(null)} style={{ flex: 1, padding: 12, background: "#f1f5f9", color: "#475569", fontSize: 14, fontWeight: 600 }}>
                Keep Booking
              </button>
              <button className="btn" onClick={handleCancel} style={{ flex: 1, padding: 12, background: "#ef4444", color: "#fff", fontSize: 14, fontWeight: 600 }}>
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="toast" style={{ background: toast.type === "success" ? "#10b981" : "#ef4444", color: "#fff" }}>
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}
    </div>
  );
}