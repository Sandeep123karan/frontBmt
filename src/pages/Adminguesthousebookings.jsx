import { useState, useEffect, useRef } from "react";

const BASE_URL = "https://bmtadmin.onrender.com/api/guesthouse-bookings";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');`;

const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #0a0c10; --surface: #111318; --surface2: #181c24;
  --border: #22283a; --accent: #e8c46a; --accent2: #5f8bff;
  --danger: #ff5c5c; --success: #3fcf8e; --warn: #f59e0b;
  --text: #e8eaf0; --muted: #5a6480;
}
body { background: var(--bg); color: var(--text); font-family: 'Syne', sans-serif; }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

@keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes slideUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
@keyframes slideInRight { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
@keyframes spin { to { transform:rotate(360deg); } }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
`;

function injectStyles() {
  if (document.getElementById("guesthouse-styles")) return;
  const style = document.createElement("style");
  style.id = "guesthouse-styles";
  style.textContent = FONTS + css;
  document.head.appendChild(style);
}

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

function Toast({ toasts, removeToast }) {
  return (
    <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 999, display: "flex", flexDirection: "column", gap: 10 }}>
      {toasts.map((t) => (
        <div key={t.id} style={{
          background: "var(--surface2)", border: "1px solid var(--border)",
          borderLeft: `3px solid ${t.type === "success" ? "var(--success)" : t.type === "error" ? "var(--danger)" : "var(--accent2)"}`,
          borderRadius: 12, padding: "13px 18px 13px 14px", display: "flex",
          alignItems: "center", gap: 10, minWidth: 260, maxWidth: 340,
          animation: "slideInRight 0.3s ease", boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          fontFamily: "'Syne', sans-serif", fontSize: "0.88rem"
        }}>
          <span style={{ fontSize: "1rem" }}>{t.icon}</span>
          <span style={{ flex: 1 }}>{t.msg}</span>
          <button onClick={() => removeToast(t.id)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "1rem", lineHeight: 1, padding: 0 }}>✕</button>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    pending: { bg: "rgba(245,158,11,0.12)", color: "var(--warn)", dot: "var(--warn)" },
    confirmed: { bg: "rgba(63,207,142,0.12)", color: "var(--success)", dot: "var(--success)" },
    cancelled: { bg: "rgba(255,92,92,0.12)", color: "var(--danger)", dot: "var(--danger)" },
  };
  const c = colors[status] || colors.pending;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.04em",
      padding: "4px 10px", borderRadius: 20, fontWeight: 500,
      background: c.bg, color: c.color
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, display: "inline-block" }} />
      {status}
    </span>
  );
}

function StatCard({ label, value, color, delay, accent }) {
  const colorMap = {
    blue: "var(--accent2)", gold: "var(--accent)", green: "var(--success)", red: "var(--danger)"
  };
  const c = colorMap[color];
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 14, padding: "20px 22px", position: "relative", overflow: "hidden",
      animation: `fadeUp 0.5s ease ${delay}s both`
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: c }} />
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.04em", color: c }}>{value ?? "—"}</div>
    </div>
  );
}

function Modal({ open, onClose, children, maxWidth = 580 }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(6px)", zIndex: 200, display: "flex",
        alignItems: "center", justifyContent: "center", padding: 20,
        animation: "fadeIn 0.2s ease"
      }}>
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 18, width: "100%", maxWidth, padding: 32, position: "relative",
        animation: "slideUp 0.25s ease"
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 20, right: 20, background: "var(--surface2)",
          border: "1px solid var(--border)", color: "var(--muted)", borderRadius: 8,
          padding: "6px 10px", cursor: "pointer", fontSize: "1rem", lineHeight: 1
        }}>✕</button>
        {children}
      </div>
    </div>
  );
}

function FormInput({ label, id, type = "text", placeholder, value, onChange, full }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: full ? "1 / -1" : undefined }}>
      <label style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>
      <input
        type={type} placeholder={placeholder} value={value} onChange={onChange}
        style={{
          background: "var(--surface2)", border: "1px solid var(--border)",
          borderRadius: 9, padding: "10px 13px", color: "var(--text)",
          fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", outline: "none",
          transition: "border 0.2s", width: "100%"
        }}
        onFocus={e => e.target.style.borderColor = "var(--accent2)"}
        onBlur={e => e.target.style.borderColor = "var(--border)"}
      />
    </div>
  );
}

function CreateModal({ open, onClose, onSuccess, showToast }) {
  const [form, setForm] = useState({
    guestHouseId: "", roomTypeId: "", checkInDate: "", checkOutDate: "",
    totalGuests: "", totalRooms: "", name: "", phone: "", email: "", userId: ""
  });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.guestHouseId || !form.roomTypeId || !form.checkInDate || !form.checkOutDate) {
      showToast("error", "⚠️", "Please fill all required fields"); return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/create`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestHouseId: form.guestHouseId, roomTypeId: form.roomTypeId,
          checkInDate: form.checkInDate, checkOutDate: form.checkOutDate,
          totalGuests: parseInt(form.totalGuests) || 1,
          totalRooms: parseInt(form.totalRooms) || 1,
          userId: form.userId || undefined,
          contactDetails: { name: form.name, phone: form.phone, email: form.email }
        })
      });
      const json = await res.json();
      if (json.success) {
        showToast("success", "✓", "Booking created successfully!");
        onSuccess(); onClose();
        setForm({ guestHouseId: "", roomTypeId: "", checkInDate: "", checkOutDate: "", totalGuests: "", totalRooms: "", name: "", phone: "", email: "", userId: "" });
      } else showToast("error", "✕", json.message || "Booking failed");
    } catch { showToast("error", "✕", "Network error — check backend"); }
    setLoading(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>New Booking</div>
      <div style={{ color: "var(--muted)", fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", marginBottom: 26 }}>// create a new guesthouse reservation</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <FormInput label="GuestHouse ID" placeholder="ObjectId of guesthouse" value={form.guestHouseId} onChange={set("guestHouseId")} full />
        <FormInput label="Room Type ID" placeholder="ObjectId of room type" value={form.roomTypeId} onChange={set("roomTypeId")} full />
        <FormInput label="Check-In Date" type="date" value={form.checkInDate} onChange={set("checkInDate")} />
        <FormInput label="Check-Out Date" type="date" value={form.checkOutDate} onChange={set("checkOutDate")} />
        <FormInput label="Total Guests" type="number" placeholder="2" value={form.totalGuests} onChange={set("totalGuests")} />
        <FormInput label="Total Rooms" type="number" placeholder="1" value={form.totalRooms} onChange={set("totalRooms")} />
        <FormInput label="Guest Name" placeholder="Full name" value={form.name} onChange={set("name")} full />
        <FormInput label="Phone" placeholder="+91 ..." value={form.phone} onChange={set("phone")} />
        <FormInput label="Email" type="email" placeholder="guest@email.com" value={form.email} onChange={set("email")} />
        <FormInput label="User ID (optional)" placeholder="ObjectId of user" value={form.userId} onChange={set("userId")} full />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
        <button onClick={onClose} style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: 10, padding: "9px 20px", fontFamily: "'Syne', sans-serif", fontSize: "0.88rem", cursor: "pointer" }}>Cancel</button>
        <button onClick={submit} disabled={loading} style={{ background: "var(--accent)", color: "#0a0c10", border: "none", borderRadius: 10, padding: "9px 20px", fontFamily: "'Syne', sans-serif", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer" }}>
          {loading ? "Creating..." : "Create Booking"}
        </button>
      </div>
    </Modal>
  );
}

function DetailModal({ open, onClose, booking }) {
  if (!booking) return null;
  const b = booking;
  const guestName = b.contactDetails?.name || b.userId?.name || "—";
  const ghName = b.guestHouseId?.name || b.guestHouseId || "—";

  const DetailItem = ({ label, value, mono, big }) => (
    <div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: big ? "1.1rem" : "0.92rem", fontWeight: 600, fontFamily: mono ? "'DM Mono', monospace" : undefined, color: big ? "var(--accent)" : undefined }}>{value}</div>
    </div>
  );
  const Divider = () => <div style={{ gridColumn: "1/-1", height: 1, background: "var(--border)", margin: "4px 0" }} />;

  return (
    <Modal open={open} onClose={onClose} maxWidth={620}>
      <div style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>Booking Details</div>
      <div style={{ color: "var(--muted)", fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", marginBottom: 26 }}>// {b._id}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <DetailItem label="Guest Name" value={guestName} />
        <DetailItem label="Phone" value={b.contactDetails?.phone || "—"} mono />
        <DetailItem label="Email" value={b.contactDetails?.email || "—"} mono />
        <DetailItem label="Status" value={<StatusBadge status={b.bookingStatus} />} />
        <Divider />
        <DetailItem label="GuestHouse" value={ghName} />
        <DetailItem label="Room Type ID" value={(b.roomTypeId || "").toString().slice(-12)} mono />
        <DetailItem label="Check-In" value={fmtDate(b.checkInDate)} mono />
        <DetailItem label="Check-Out" value={fmtDate(b.checkOutDate)} mono />
        <DetailItem label="Total Nights" value={`${b.totalNights || "—"} nights`} />
        <DetailItem label="Guests / Rooms" value={`${b.totalGuests || 1} guests, ${b.totalRooms || 1} rooms`} />
        <Divider />
        <DetailItem label="Price / Room" value={`₹${(b.pricePerRoom || 0).toLocaleString("en-IN")}`} mono />
        <DetailItem label="Base Price" value={`₹${(b.basePrice || 0).toLocaleString("en-IN")}`} mono />
        <DetailItem label="Tax" value={`₹${(b.tax || 0).toLocaleString("en-IN")}`} mono />
        <DetailItem label="Total Amount" value={`₹${(b.totalAmount || 0).toLocaleString("en-IN")}`} big />
        <Divider />
        <DetailItem label="Booked On" value={fmtDate(b.createdAt)} mono />
        <DetailItem label="User ID" value={b.userId?._id || b.userId || "Guest"} mono />
      </div>
    </Modal>
  );
}

function ConfirmCancelModal({ open, onClose, onConfirm }) {
  return (
    <Modal open={open} onClose={onClose} maxWidth={400}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🗑️</div>
        <div style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 6 }}>Cancel Booking?</div>
        <div style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: 24 }}>
          This booking will be marked as <strong style={{ color: "var(--danger)" }}>cancelled</strong>. This action cannot be undone.
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={onClose} style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: 10, padding: "9px 20px", fontFamily: "'Syne', sans-serif", fontSize: "0.88rem", cursor: "pointer" }}>Keep It</button>
          <button onClick={onConfirm} style={{ background: "var(--danger)", color: "#fff", border: "none", borderRadius: 10, padding: "9px 22px", fontFamily: "'Syne', sans-serif", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer" }}>Yes, Cancel</button>
        </div>
      </div>
    </Modal>
  );
}

const PAGE_SIZE = 10;

export default function GuestHouseAdmin() {
  useEffect(() => { injectStyles(); }, []);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [toasts, setToasts] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [detailBooking, setDetailBooking] = useState(null);
  const [cancelId, setCancelId] = useState(null);
  const toastId = useRef(0);

  const showToast = (type, icon, msg) => {
    const id = ++toastId.current;
    setToasts(t => [...t, { id, type, icon, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  };

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/all`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      if (json.success) { setBookings(json.data); }
      else showToast("error", "✕", json.message || "Failed to load");
    } catch (e) {
      showToast("error", "✕", e.message || "Cannot connect to backend");
    }
    setLoading(false);
  };

  useEffect(() => { loadBookings(); }, []);

  const filtered = bookings.filter(b => {
    const statusOk = filter === "all" || b.bookingStatus === filter;
    const q = search.toLowerCase();
    const name = (b.contactDetails?.name || b.userId?.name || "").toLowerCase();
    const id = (b._id || "").toLowerCase();
    const gh = (b.guestHouseId?.name || "").toLowerCase();
    const searchOk = !q || name.includes(q) || id.includes(q) || gh.includes(q);
    return statusOk && searchOk;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.bookingStatus === "pending").length,
    confirmed: bookings.filter(b => b.bookingStatus === "confirmed").length,
    cancelled: bookings.filter(b => b.bookingStatus === "cancelled").length,
  };

  const handleCancel = async () => {
    const id = cancelId;
    setCancelId(null);
    try {
      const res = await fetch(`${BASE_URL}/cancel/${id}`, { method: "PUT" });
      const json = await res.json();
      if (json.success) {
        showToast("success", "✓", "Booking cancelled");
        setBookings(prev => prev.map(b => b._id === id ? { ...b, bookingStatus: "cancelled" } : b));
      } else showToast("error", "✕", json.message || "Cancel failed");
    } catch { showToast("error", "✕", "Network error — could not cancel"); }
  };

  const FilterBtn = ({ label, value }) => (
    <button
      onClick={() => { setFilter(value); setPage(1); }}
      style={{
        background: filter === value ? "rgba(232,196,106,0.08)" : "var(--surface)",
        border: `1px solid ${filter === value ? "var(--accent)" : "var(--border)"}`,
        color: filter === value ? "var(--accent)" : "var(--muted)",
        borderRadius: 10, padding: "8px 16px", fontFamily: "'DM Mono', monospace",
        fontSize: "0.8rem", cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.03em"
      }}
    >{label}</button>
  );

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh", fontFamily: "'Syne', sans-serif" }}>
      {/* HEADER */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 36px", borderBottom: "1px solid var(--border)",
        background: "var(--surface)", position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, background: "var(--accent)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏨</div>
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "-0.02em" }}>GuestHouse Admin</div>
            <div style={{ fontSize: "0.7rem", color: "var(--muted)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>Booking Management</div>
          </div>
        </div>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", background: "rgba(232,196,106,0.12)", color: "var(--accent)", border: "1px solid rgba(232,196,106,0.3)", padding: "4px 12px", borderRadius: 20, letterSpacing: "0.05em" }}>ADMIN PANEL</span>
      </header>

      {/* MAIN */}
      <main style={{ padding: "32px 36px", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 4 }}>Bookings</div>
        <div style={{ color: "var(--muted)", fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", marginBottom: 32 }}>// manage all guesthouse reservations</div>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          <StatCard label="Total Bookings" value={stats.total} color="blue" delay={0.05} />
          <StatCard label="Pending" value={stats.pending} color="gold" delay={0.1} />
          <StatCard label="Confirmed" value={stats.confirmed} color="green" delay={0.15} />
          <StatCard label="Cancelled" value={stats.cancelled} color="red" delay={0.2} />
        </div>

        {/* TOOLBAR */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8, background: "var(--surface)",
              border: "1px solid var(--border)", borderRadius: 10, padding: "8px 14px"
            }}>
              <span style={{ color: "var(--muted)", fontSize: 14 }}>⌕</span>
              <input
                value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search guest, id..."
                style={{ background: "none", border: "none", outline: "none", color: "var(--text)", fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", width: 200 }}
              />
            </div>
            <FilterBtn label="All" value="all" />
            <FilterBtn label="Pending" value="pending" />
            <FilterBtn label="Confirmed" value="confirmed" />
            <FilterBtn label="Cancelled" value="cancelled" />
          </div>
          <button onClick={() => setCreateOpen(true)} style={{
            background: "var(--accent)", color: "#0a0c10", border: "none", borderRadius: 10,
            padding: "9px 20px", fontFamily: "'Syne', sans-serif", fontSize: "0.88rem",
            fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6
          }}>＋ New Booking</button>
        </div>

        {/* TABLE */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--surface2)", borderBottom: "1px solid var(--border)" }}>
                {["Booking ID", "Guest", "GuestHouse / Room", "Dates", "Rooms", "Amount", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "13px 16px", textAlign: "left", fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 500, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: 40 }}>
                  <div style={{ width: 20, height: 20, border: "2px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                </td></tr>
              ) : pageData.length === 0 ? (
                <tr><td colSpan={8}>
                  <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--muted)", fontFamily: "'DM Mono', monospace", fontSize: "0.85rem" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>📭</div>
                    No bookings found
                  </div>
                </td></tr>
              ) : pageData.map((b, i) => {
                const guestName = b.contactDetails?.name || b.userId?.name || "—";
                const guestEmail = b.contactDetails?.email || "—";
                const ghName = b.guestHouseId?.name || b.guestHouseId || "—";
                const nights = b.totalNights || "—";
                const amount = b.totalAmount ? `₹${b.totalAmount.toLocaleString("en-IN")}` : "—";
                const idShort = (b._id || "").slice(-8).toUpperCase();
                return (
                  <tr key={b._id} style={{ borderBottom: "1px solid var(--border)", animation: `fadeIn 0.3s ease ${i * 0.04}s both` }}>
                    <td style={{ padding: "14px 16px" }}><div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "var(--muted)" }}>#{idShort}</div></td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 600 }}>{guestName}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--muted)", fontFamily: "'DM Mono', monospace", marginTop: 2 }}>{guestEmail}</div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{ghName}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontFamily: "'DM Mono', monospace", marginTop: 2 }}>{(b.roomTypeId || "").toString().slice(-6)}</div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem" }}>{fmtDate(b.checkInDate)} → {fmtDate(b.checkOutDate)}</div>
                      <span style={{ display: "inline-block", background: "rgba(95,139,255,0.12)", color: "var(--accent2)", borderRadius: 5, padding: "2px 7px", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", marginTop: 3 }}>{nights} night{nights !== 1 ? "s" : ""}</span>
                    </td>
                    <td style={{ padding: "14px 16px", fontFamily: "'DM Mono', monospace", fontSize: "0.82rem" }}>
                      {b.totalRooms || 1} room{(b.totalRooms || 1) > 1 ? "s" : ""}<br />
                      <span style={{ color: "var(--muted)", fontSize: "0.72rem" }}>{b.totalGuests || 1} guests</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}><div style={{ fontWeight: 700, color: "var(--accent)", fontFamily: "'DM Mono', monospace" }}>{amount}</div></td>
                    <td style={{ padding: "14px 16px" }}><StatusBadge status={b.bookingStatus || "pending"} /></td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => setDetailBooking(b)} style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: 8, padding: "6px 10px", fontSize: "0.75rem", cursor: "pointer", fontFamily: "'DM Mono', monospace", transition: "all 0.2s" }}
                          onMouseEnter={e => { e.target.style.color = "var(--accent2)"; e.target.style.borderColor = "var(--accent2)"; e.target.style.background = "rgba(95,139,255,0.07)"; }}
                          onMouseLeave={e => { e.target.style.color = "var(--muted)"; e.target.style.borderColor = "var(--border)"; e.target.style.background = "var(--surface2)"; }}>
                          View
                        </button>
                        {b.bookingStatus !== "cancelled" && (
                          <button onClick={() => setCancelId(b._id)} style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: 8, padding: "6px 10px", fontSize: "0.75rem", cursor: "pointer", fontFamily: "'DM Mono', monospace", transition: "all 0.2s" }}
                            onMouseEnter={e => { e.target.style.color = "var(--danger)"; e.target.style.borderColor = "var(--danger)"; e.target.style.background = "rgba(255,92,92,0.07)"; }}
                            onMouseLeave={e => { e.target.style.color = "var(--muted)"; e.target.style.borderColor = "var(--border)"; e.target.style.background = "var(--surface2)"; }}>
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderTop: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "var(--muted)" }}>
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} bookings
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: page === 1 ? "rgba(90,100,128,0.4)" : "var(--muted)", borderRadius: 7, padding: "6px 12px", fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", cursor: page === 1 ? "default" : "pointer" }}>← Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} style={{ background: page === p ? "rgba(232,196,106,0.1)" : "var(--surface2)", border: `1px solid ${page === p ? "var(--accent)" : "var(--border)"}`, color: page === p ? "var(--accent)" : "var(--muted)", borderRadius: 7, padding: "6px 12px", fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", cursor: "pointer" }}>{p}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: page === totalPages ? "rgba(90,100,128,0.4)" : "var(--muted)", borderRadius: 7, padding: "6px 12px", fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", cursor: page === totalPages ? "default" : "pointer" }}>Next →</button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODALS */}
      <CreateModal open={createOpen} onClose={() => setCreateOpen(false)} onSuccess={loadBookings} showToast={showToast} />
      <DetailModal open={!!detailBooking} onClose={() => setDetailBooking(null)} booking={detailBooking} />
      <ConfirmCancelModal open={!!cancelId} onClose={() => setCancelId(null)} onConfirm={handleCancel} />
      <Toast toasts={toasts} removeToast={(id) => setToasts(t => t.filter(x => x.id !== id))} />
    </div>
  );
}