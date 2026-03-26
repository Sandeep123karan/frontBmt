import { useState, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────────────────────
   CONFIG — apna URL aur token key yahan change karo
───────────────────────────────────────────────────────── */
const API = "https://bmtadmin.onrender.com/api/holidayparks";
const getToken = () => localStorage.getItem("adminToken") || "";

/* ─────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────── */
const C = {
  bg: "#060d18", surface: "#0d1826", surface2: "#0a1420",
  border: "#152035", accent: "#16a34a", accentB: "#15803d",
  blue: "#3b82f6", orange: "#f59e0b", red: "#ef4444",
  teal: "#0d9488", purple: "#8b5cf6",
  text: "#e2eaf4", textSub: "#7a8ea8", textMuted: "#3d5266",
};

const inp = {
  background: "#050c16", border: `1px solid ${C.border}`, borderRadius: 8,
  padding: "10px 13px", color: C.text, fontSize: 13, fontFamily: "inherit",
  outline: "none", width: "100%", boxSizing: "border-box",
};

const BLANK_ROOM = { name: "", price: "", capacity: "" };

const INITIAL = {
  parkName: "", description: "", shortDescription: "", propertyType: "Holiday Park", starCategory: "0",
  street: "", area: "", landmark: "", city: "", state: "", country: "India", pincode: "", latitude: "", longitude: "",
  basePrice: "", weekendPrice: "", peakPrice: "", pricePerNight: "", discount: "0", taxIncluded: false,
  totalRooms: "", totalCottages: "", maxGuests: "",
  amenities: "", facilities: "", activities: "",
  breakfast: false, lunch: false, dinner: false, restaurantAvailable: false,
  checkInTime: "12:00 PM", checkOutTime: "11:00 AM",
  petsAllowed: false, smokingAllowed: false, alcoholAllowed: false, coupleFriendly: false, idProofRequired: true,
  cancellationPolicy: "", slug: "", metaTitle: "", metaDescription: "",
};

const SECTIONS = ["Basic Info", "Location", "Pricing", "Rooms & Capacity", "Amenities", "Food & Rules", "Images", "SEO"];

const Stars = ({ n = 0 }) => <span>{Array.from({ length: 5 }, (_, i) => <span key={i} style={{ color: i < n ? "#f59e0b" : "#1e3050", fontSize: 13 }}>★</span>)}</span>;


  const StatusBadge = ({ status }) => {
    const map = {
      approved: { color: "#10b981", bg: "rgba(16,185,129,.1)", border: "rgba(16,185,129,.25)", label: "✅ Approved" },
      pending: { color: "#f59e0b", bg: "rgba(245,158,11,.1)", border: "rgba(245,158,11,.25)", label: "⏳ Pending" },
      rejected: { color: "#ef4444", bg: "rgba(239,68,68,.1)", border: "rgba(239,68,68,.25)", label: "❌ Rejected" },
    };
    const s = map[status] || map.pending;
    return <span style={{ display: "inline-block", borderRadius: 6, padding: "3px 9px", fontSize: 10, fontWeight: 700, color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>{s.label}</span>;
  };

  const Toggle = ({ on, onChange, label }) => (
    <label style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 14px", cursor: "pointer", background: on ? "rgba(22,163,74,.08)" : C.surface2, border: `1px solid ${on ? "#16a34a" : C.border}`, borderRadius: 8, userSelect: "none" }}>
      <input type="checkbox" checked={on} onChange={e => onChange(e.target.checked)} style={{ display: "none" }} />
      <div style={{ width: 34, height: 18, borderRadius: 999, background: on ? "#16a34a" : "#152035", position: "relative", flexShrink: 0, transition: "background .18s" }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: on ? 19 : 3, transition: "left .18s" }}></div>
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: on ? C.text : C.textSub }}>{label}</span>
    </label>
  );

  const Lbl = ({ children }) => <label style={{ fontSize: 10, fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>{children}</label>;
  const Fld = ({ label, children, span }) => <div style={{ display: "flex", flexDirection: "column", gridColumn: span ? `span ${span}` : undefined }}><Lbl>{label}</Lbl>{children}</div>;
  const G2 = ({ children, cols }) => <div style={{ display: "grid", gridTemplateColumns: cols || "repeat(auto-fill,minmax(230px,1fr))", gap: 14 }}>{children}</div>;
  const G3 = ({ children }) => <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 14 }}>{children}</div>;
  const SH = ({ icon, title, desc }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 14, borderBottom: `1px solid ${C.border}` }}>
      <span style={{ fontSize: 24 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{title}</div>
        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{desc}</div>
      </div>
    </div>
  );
/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function HolidayParkPanel() {
  const [form, setForm] = useState(INITIAL);
  const [roomTypes, setRoomTypes] = useState([]);
  const [files, setFiles] = useState({ thumbnailImage: null, bannerImages: [], galleryImages: [], roomImages: [] });
  const [parks, setParks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [sec, setSec] = useState(0);
  const [viewPark, setViewPark] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const authHead = () => {
  const token = localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

  /* ── FETCH ── */
  const fetchParks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/all`, { headers: authHead() });
      const data = await res.json();
      setParks(data.data || []);
    } catch { showToast("Parks fetch error", "error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchParks(); }, [fetchParks]);

  /* ── FORM HELPERS ── */
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const addRoom = () => setRoomTypes(r => [...r, { ...BLANK_ROOM }]);
  const updRoom = (i, k, v) => setRoomTypes(r => r.map((rm, idx) => idx === i ? { ...rm, [k]: v } : rm));
  const delRoom = (i) => setRoomTypes(r => r.filter((_, idx) => idx !== i));

  /* ── BUILD FORMDATA ── */
  const buildFD = () => {
    const fd = new FormData();
    // flat fields
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    // roomTypes as JSON
    fd.append("roomTypes", JSON.stringify(roomTypes));
    // array fields as JSON strings
    ["amenities", "facilities", "activities"].forEach(k => {
      fd.set(k, JSON.stringify(
        form[k].split(",").map(x => x.trim()).filter(Boolean)
      ));
    });
    // files
    if (files.thumbnailImage) fd.append("thumbnailImage", files.thumbnailImage);
    files.bannerImages.forEach(f => fd.append("bannerImages", f));
    files.galleryImages.forEach(f => fd.append("galleryImages", f));
    files.roomImages.forEach(f => fd.append("roomImages", f));
    return fd;
  };

  /* ── SUBMIT ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editId ? `${API}/update/${editId}` : `${API}/add`;
      const res = await fetch(url, {
        method: editId ? "PUT" : "POST",
        headers: authHead(),
        body: buildFD(),
      });
      const data = await res.json();
      if (data.success) {
        showToast(editId ? "Park update ho gaya!" : "Park add ho gaya! Approval pending.");
        resetForm(); fetchParks();
      } else showToast(data.message || "Error aaya", "error");
    } catch { showToast("Server error", "error"); }
    finally { setSubmitting(false); }
  };

  const resetForm = () => {
    setForm(INITIAL); setRoomTypes([]); setSec(0); setEditId(null);
    setFiles({ thumbnailImage: null, bannerImages: [], galleryImages: [], roomImages: [] });
  };

  /* ── EDIT ── */
  const handleEdit = (park) => {
    setEditId(park._id);
    setForm({
      parkName: park.parkName || "", description: park.description || "",
      shortDescription: park.shortDescription || "", propertyType: park.propertyType || "Holiday Park",
      starCategory: String(park.starCategory || 0),
      street: park.address?.street || "", area: park.address?.area || "",
      landmark: park.address?.landmark || "", city: park.address?.city || "",
      state: park.address?.state || "", country: park.address?.country || "India",
      pincode: park.address?.pincode || "", latitude: park.address?.latitude || "",
      longitude: park.address?.longitude || "",
      basePrice: park.priceRange?.basePrice || "", weekendPrice: park.priceRange?.weekendPrice || "",
      peakPrice: park.priceRange?.peakPrice || "", pricePerNight: park.pricePerNight || "",
      discount: String(park.discount || 0), taxIncluded: park.taxIncluded || false,
      totalRooms: park.totalRooms || "", totalCottages: park.totalCottages || "",
      maxGuests: park.maxGuests || "",
      amenities: (park.amenities || []).join(", "),
      facilities: (park.facilities || []).join(", "),
      activities: (park.activities || []).join(", "),
      breakfast: park.foodOptions?.breakfast || false, lunch: park.foodOptions?.lunch || false,
      dinner: park.foodOptions?.dinner || false, restaurantAvailable: park.foodOptions?.restaurantAvailable || false,
      checkInTime: park.checkInTime || "12:00 PM", checkOutTime: park.checkOutTime || "11:00 AM",
      petsAllowed: park.rules?.petsAllowed || false, smokingAllowed: park.rules?.smokingAllowed || false,
      alcoholAllowed: park.rules?.alcoholAllowed || false, coupleFriendly: park.rules?.coupleFriendly || false,
      idProofRequired: park.rules?.idProofRequired ?? true,
      cancellationPolicy: park.cancellationPolicy || "", slug: park.slug || "",
      metaTitle: park.metaTitle || "", metaDescription: park.metaDescription || "",
    });
    setRoomTypes(park.roomTypes || []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── DELETE ── */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete karna chahte ho?")) return;
    try {
      const res = await fetch(`${API}/delete/${id}`, { method: "DELETE", headers: authHead() });
      const data = await res.json();
      if (data.success) { showToast("Park deleted!"); fetchParks(); }
    } catch { showToast("Delete error", "error"); }
  };

  /* ── APPROVE ── */
  const handleApprove = async (id) => {
    try {
      const res = await fetch(`${API}/approve/${id}`, { method: "PUT", headers: authHead() });
      const data = await res.json();
      if (data.success) { showToast("Park approved! ✅"); fetchParks(); }
    } catch { showToast("Error", "error"); }
  };

  /* ── REJECT ── */
  const handleReject = async () => {
    try {
      const res = await fetch(`${API}/reject/${rejectModal}`, {
        method: "PUT",
        headers: { ...authHead(), "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason }),
      });
      const data = await res.json();
      if (data.success) { showToast("Park rejected", "warn"); setRejectModal(null); setRejectReason(""); fetchParks(); }
    } catch { showToast("Error", "error"); }
  };

  /* ── FILTER ── */
  const filtered = parks.filter(p => {
    const q = search.toLowerCase();
    const m = p.parkName?.toLowerCase().includes(q) || p.address?.city?.toLowerCase().includes(q) || p.propertyId?.toLowerCase().includes(q);
    if (tab === "approved") return m && p.approvalStatus === "approved";
    if (tab === "pending") return m && p.approvalStatus === "pending";
    if (tab === "rejected") return m && p.approvalStatus === "rejected";
    if (tab === "featured") return m && p.isFeatured;
    return m;
  });

  /* ── UI HELPERS ── */
//   const Stars = ({ n = 0 }) => <span>{Array.from({ length: 5 }, (_, i) => <span key={i} style={{ color: i < n ? "#f59e0b" : "#1e3050", fontSize: 13 }}>★</span>)}</span>;

//   const StatusBadge = ({ status }) => {
//     const map = {
//       approved: { color: "#10b981", bg: "rgba(16,185,129,.1)", border: "rgba(16,185,129,.25)", label: "✅ Approved" },
//       pending: { color: "#f59e0b", bg: "rgba(245,158,11,.1)", border: "rgba(245,158,11,.25)", label: "⏳ Pending" },
//       rejected: { color: "#ef4444", bg: "rgba(239,68,68,.1)", border: "rgba(239,68,68,.25)", label: "❌ Rejected" },
//     };
//     const s = map[status] || map.pending;
//     return <span style={{ display: "inline-block", borderRadius: 6, padding: "3px 9px", fontSize: 10, fontWeight: 700, color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>{s.label}</span>;
//   };

//   const Toggle = ({ on, onChange, label }) => (
//     <label style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 14px", cursor: "pointer", background: on ? "rgba(22,163,74,.08)" : C.surface2, border: `1px solid ${on ? "#16a34a" : C.border}`, borderRadius: 8, userSelect: "none" }}>
//       <input type="checkbox" checked={on} onChange={e => onChange(e.target.checked)} style={{ display: "none" }} />
//       <div style={{ width: 34, height: 18, borderRadius: 999, background: on ? "#16a34a" : "#152035", position: "relative", flexShrink: 0, transition: "background .18s" }}>
//         <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: on ? 19 : 3, transition: "left .18s" }}></div>
//       </div>
//       <span style={{ fontSize: 12, fontWeight: 600, color: on ? C.text : C.textSub }}>{label}</span>
//     </label>
//   );

//   const Lbl = ({ children }) => <label style={{ fontSize: 10, fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>{children}</label>;
//   const Fld = ({ label, children, span }) => <div style={{ display: "flex", flexDirection: "column", gridColumn: span ? `span ${span}` : undefined }}><Lbl>{label}</Lbl>{children}</div>;
//   const G2 = ({ children, cols }) => <div style={{ display: "grid", gridTemplateColumns: cols || "repeat(auto-fill,minmax(230px,1fr))", gap: 14 }}>{children}</div>;
//   const G3 = ({ children }) => <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 14 }}>{children}</div>;
//   const SH = ({ icon, title, desc }) => (
//     <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 14, borderBottom: `1px solid ${C.border}` }}>
//       <span style={{ fontSize: 24 }}>{icon}</span>
//       <div>
//         <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{title}</div>
//         <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{desc}</div>
//       </div>
//     </div>
//   );

  /* ═══════════════════ RENDER ═══════════════════ */
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", background: C.bg, minHeight: "100vh", color: C.text, boxSizing: "border-box" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Serif+Display&display=swap');
        @keyframes hp_sl{from{transform:translateY(-12px);opacity:0}to{transform:none;opacity:1}}
        @keyframes hp_sp{to{transform:rotate(360deg)}}
        .hp_i:focus{border-color:#16a34a !important}
        .hp_row:hover>td{background:rgba(255,255,255,.012)!important}
        .hp_ab:hover{filter:brightness(1.25);transform:translateY(-1px)}
        .hp_sn:hover{color:#a7f3d0 !important;background:rgba(22,163,74,.05)!important}
        .hp_tb:hover{color:#a7f3d0 !important}
        .hp_rm:hover{border-color:#16a34a !important;color:#4ade80 !important}
        .hp_fl input[type=file]::file-selector-button{background:#152035;color:#7a8ea8;border:none;padding:4px 10px;border-radius:6px;cursor:pointer;font-size:11px;margin-right:8px}
        *{box-sizing:border-box}
      `}</style>

      {/* ── TOAST ── */}
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 99999, display: "flex", alignItems: "center", gap: 10, padding: "13px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600, boxShadow: "0 8px 32px rgba(0,0,0,.7)", maxWidth: 380, animation: "hp_sl .3s ease", ...(toast.type === "error" ? { background: "#2a0808", border: "1px solid #7f1d1d", color: "#fca5a5" } : toast.type === "warn" ? { background: "#2a1800", border: "1px solid #78350f", color: "#fcd34d" } : { background: "#011f14", border: "1px solid #065f46", color: "#6ee7b7" }) }}>
          <span style={{ width: 22, height: 22, borderRadius: "50%", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0, background: toast.type === "error" ? C.red : toast.type === "warn" ? C.orange : C.accent }}>
            {toast.type === "error" ? "✕" : toast.type === "warn" ? "!" : "✓"}
          </span>
          {toast.msg}
        </div>
      )}

      {/* ── REJECT MODAL ── */}
      {rejectModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setRejectModal(null)}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, width: "100%", maxWidth: 420, padding: 28 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 6 }}>❌ Reject Karo</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 18 }}>Rejection reason do (optional)</div>
            <textarea className="hp_i" style={{ ...inp, minHeight: 100, resize: "vertical", marginBottom: 16 }} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Reason likho..." />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setRejectModal(null)} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.textSub, borderRadius: 8, padding: "9px 18px", cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>Cancel</button>
              <button onClick={handleReject} style={{ background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.4)", color: "#f87171", borderRadius: 8, padding: "9px 18px", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700 }}>❌ Reject Karo</button>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW MODAL ── */}
      {viewPark && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setViewPark(null)}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, width: "100%", maxWidth: 560, maxHeight: "88vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "18px 22px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 18, color: C.text }}>{viewPark.parkName}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 3 }}>#{viewPark.propertyId} · {viewPark.propertyType}</div>
              </div>
              <button onClick={() => setViewPark(null)} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.textSub, width: 30, height: 30, borderRadius: 7, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
            <div style={{ padding: "6px 22px 20px" }}>
              {[
                ["Park Name", viewPark.parkName], ["Short Desc", viewPark.shortDescription],
                ["City", `${viewPark.address?.city || "—"}, ${viewPark.address?.state || ""}`],
                ["Price/Night", viewPark.pricePerNight ? `₹${viewPark.pricePerNight}` : "—"],
                ["Base Price", viewPark.priceRange?.basePrice ? `₹${viewPark.priceRange.basePrice}` : "—"],
                ["Total Rooms", viewPark.totalRooms], ["Cottages", viewPark.totalCottages],
                ["Max Guests", viewPark.maxGuests], ["Star Category", viewPark.starCategory],
                ["Check-in", viewPark.checkInTime], ["Check-out", viewPark.checkOutTime],
                ["Rating", viewPark.rating], ["Reviews", viewPark.totalReviews],
                ["Couple Friendly", viewPark.rules?.coupleFriendly ? "✅ Yes" : "❌ No"],
                ["Pets", viewPark.rules?.petsAllowed ? "✅ Yes" : "❌ No"],
                ["Status", viewPark.approvalStatus], ["Active", viewPark.isActive ? "✅ Yes" : "❌ No"],
                ["Featured", viewPark.isFeatured ? "⭐ Yes" : "No"],
                ["Amenities", (viewPark.amenities || []).join(", ") || "—"],
                ["Activities", (viewPark.activities || []).join(", ") || "—"],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", gap: 14, padding: "9px 0", borderBottom: `1px solid #0c1d2e` }}>
                  <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, minWidth: 110, flexShrink: 0 }}>{l}</div>
                  <div style={{ fontSize: 13, color: C.text }}>{v || "—"}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════ HEADER ══════════════════════ */}
      <div style={{ background: "#070f1c", borderBottom: `1px solid ${C.border}`, padding: "0 32px" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 32 }}>🏕️</span>
            <div>
              <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 21, color: C.text }}>Holiday<span style={{ color: C.accent }}>Park</span> Pro</div>
              <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", letterSpacing: ".1em", marginTop: 1 }}>Property Management System</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 36 }}>
            {[
              { l: "Total", v: parks.length, c: "#60a5fa" },
              { l: "Approved", v: parks.filter(p => p.approvalStatus === "approved").length, c: C.accent },
              { l: "Pending", v: parks.filter(p => p.approvalStatus === "pending").length, c: C.orange },
              { l: "Rejected", v: parks.filter(p => p.approvalStatus === "rejected").length, c: C.red },
            ].map(s => (
              <div key={s.l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.c, lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: 9, color: C.textMuted, textTransform: "uppercase", letterSpacing: ".08em", marginTop: 3 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════ PAGE ══════════════════════ */}
      <div style={{ maxWidth: 1480, margin: "0 auto", padding: "28px 32px", display: "flex", flexDirection: "column", gap: 28 }}>

        {/* ════════════ FORM CARD ════════════ */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Card Header */}
          <div style={{ padding: "20px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, background: "linear-gradient(90deg,rgba(22,163,74,.07),transparent)", borderLeft: `3px solid ${C.accent}`, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 26 }}>{editId ? "✏️" : "🏕️"}</span>
              <div>
                <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 19, color: C.text }}>{editId ? "Holiday Park Update Karo" : "Add Holiday Park"}</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>{editId ? "Details modify karke save karo" : "Saari details fill karo aur submit karo"}</div>
              </div>
            </div>
            {editId && (
              <button onClick={resetForm} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.textSub, borderRadius: 8, padding: "8px 15px", cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 600 }}>✕ Cancel</button>
            )}
          </div>

          {/* Section Nav */}
          <div style={{ display: "flex", overflowX: "auto", borderBottom: `1px solid ${C.border}`, background: C.surface2, flexShrink: 0, scrollbarWidth: "none" }}>
            {SECTIONS.map((s, i) => (
              <button key={i} type="button" className="hp_sn"
                onClick={() => setSec(i)}
                style={{ background: sec === i ? "rgba(22,163,74,.07)" : "transparent", border: "none", borderBottom: `3px solid ${sec === i ? C.accent : "transparent"}`, color: sec === i ? "#4ade80" : C.textSub, padding: "14px 18px", cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 700, display: "flex", alignItems: "center", gap: 7, whiteSpace: "nowrap", transition: "all .15s", flexShrink: 0 }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: sec === i ? C.accent : "#152035", color: sec === i ? "#fff" : C.textSub, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
                {s}
              </button>
            ))}
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} style={{ padding: 28, display: "flex", flexDirection: "column", gap: 24 }}>

            {/* ── 0: BASIC INFO ── */}
            {sec === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <SH icon="🏕️" title="Basic Information" desc="Park ki primary details" />
                <G2>
                  <Fld label="Park Name *"><input required className="hp_i" style={inp} value={form.parkName} onChange={e => set("parkName", e.target.value)} placeholder="e.g. Green Valley Holiday Park" /></Fld>
                  <Fld label="Property Type">
                    <select className="hp_i" style={inp} value={form.propertyType} onChange={e => set("propertyType", e.target.value)}>
                      {["Holiday Park", "Eco Resort", "Camping Site", "Nature Camp", "Adventure Park", "Glamping", "Farm Stay", "Hill Station"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </Fld>
                </G2>
                <Fld label="Full Description *"><textarea required className="hp_i" style={{ ...inp, minHeight: 100, resize: "vertical" }} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Park ki detailed description..." /></Fld>
                <Fld label="Short Description"><textarea className="hp_i" style={{ ...inp, minHeight: 70, resize: "vertical" }} value={form.shortDescription} onChange={e => set("shortDescription", e.target.value)} placeholder="Listing card ke liye short description..." /></Fld>
                <G3>
                  <Fld label="Star Category">
                    <select className="hp_i" style={inp} value={form.starCategory} onChange={e => set("starCategory", e.target.value)}>
                      {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n === 0 ? "Unrated" : "★".repeat(n) + ` ${n} Star`}</option>)}
                    </select>
                  </Fld>
                  <Fld label="Slug (URL)"><input className="hp_i" style={inp} value={form.slug} onChange={e => set("slug", e.target.value)} placeholder="green-valley-holiday-park" /></Fld>
                  <Fld label="Cancellation Policy"><input className="hp_i" style={inp} value={form.cancellationPolicy} onChange={e => set("cancellationPolicy", e.target.value)} placeholder="Free before 48hrs" /></Fld>
                </G3>
              </div>
            )}

            {/* ── 1: LOCATION ── */}
            {sec === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <SH icon="📍" title="Location Details" desc="Park ka address aur coordinates" />
                <G3>
                  {[["street", "Street Address", "123 Forest Road"], ["area", "Area / Locality", "Munnar Hills"], ["landmark", "Landmark", "Near Lake"], ["city", "City *", "Munnar"], ["state", "State *", "Kerala"], ["country", "Country", "India"], ["pincode", "Pincode", "685612"]].map(([k, l, ph]) => (
                    <Fld key={k} label={l}><input className="hp_i" style={inp} value={form[k]} onChange={e => set(k, e.target.value)} placeholder={ph} /></Fld>
                  ))}
                </G3>
                <div style={{ display: "flex", alignItems: "center", gap: 12, color: C.textMuted, fontSize: 12, fontWeight: 600 }}>
                  <div style={{ flex: 1, height: 1, background: C.border }}></div><span>📡 Geo Coordinates</span><div style={{ flex: 1, height: 1, background: C.border }}></div>
                </div>
                <G2>
                  <Fld label="Latitude"><input type="number" className="hp_i" style={inp} value={form.latitude} onChange={e => set("latitude", e.target.value)} placeholder="10.0889" /></Fld>
                  <Fld label="Longitude"><input type="number" className="hp_i" style={inp} value={form.longitude} onChange={e => set("longitude", e.target.value)} placeholder="77.0595" /></Fld>
                </G2>
              </div>
            )}

            {/* ── 2: PRICING ── */}
            {sec === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <SH icon="💰" title="Pricing Details" desc="Park ki pricing structure" />
                <div style={{ background: "rgba(22,163,74,.05)", border: "1px solid rgba(22,163,74,.15)", borderRadius: 8, padding: "11px 15px", fontSize: 12, color: "#4ade80" }}>
                  💡 Price Range filters ke liye hai. Price Per Night main booking price hai.
                </div>
                <G3>
                  <Fld label="Price Per Night (₹)"><input type="number" className="hp_i" style={inp} value={form.pricePerNight} onChange={e => set("pricePerNight", e.target.value)} placeholder="2500" /></Fld>
                  <Fld label="Base Price (₹)"><input type="number" className="hp_i" style={inp} value={form.basePrice} onChange={e => set("basePrice", e.target.value)} placeholder="2000" /></Fld>
                  <Fld label="Weekend Price (₹)"><input type="number" className="hp_i" style={inp} value={form.weekendPrice} onChange={e => set("weekendPrice", e.target.value)} placeholder="3000" /></Fld>
                  <Fld label="Peak Price (₹)"><input type="number" className="hp_i" style={inp} value={form.peakPrice} onChange={e => set("peakPrice", e.target.value)} placeholder="4000" /></Fld>
                  <Fld label="Discount (%)"><input type="number" className="hp_i" style={inp} value={form.discount} onChange={e => set("discount", e.target.value)} placeholder="0" /></Fld>
                </G3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
                  <Toggle on={form.taxIncluded} onChange={v => set("taxIncluded", v)} label="💸 Tax Included in Price" />
                </div>
              </div>
            )}

            {/* ── 3: ROOMS & CAPACITY ── */}
            {sec === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <SH icon="🏡" title="Rooms & Capacity" desc="Park ki capacity aur room types" />
                <G3>
                  <Fld label="Total Rooms"><input type="number" className="hp_i" style={inp} value={form.totalRooms} onChange={e => set("totalRooms", e.target.value)} placeholder="20" /></Fld>
                  <Fld label="Total Cottages"><input type="number" className="hp_i" style={inp} value={form.totalCottages} onChange={e => set("totalCottages", e.target.value)} placeholder="10" /></Fld>
                  <Fld label="Max Guests"><input type="number" className="hp_i" style={inp} value={form.maxGuests} onChange={e => set("maxGuests", e.target.value)} placeholder="100" /></Fld>
                </G3>

                {/* Room Types */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, color: C.textMuted, fontSize: 12, fontWeight: 600 }}>
                  <div style={{ flex: 1, height: 1, background: C.border }}></div><span>🛏️ Room Types</span><div style={{ flex: 1, height: 1, background: C.border }}></div>
                </div>
                {roomTypes.length === 0 && (
                  <div style={{ textAlign: "center", padding: 32, border: `2px dashed ${C.border}`, borderRadius: 10 }}>
                    <div style={{ fontSize: 36 }}>🏡</div>
                    <div style={{ color: C.textSub, marginTop: 8, fontWeight: 600, fontSize: 13 }}>Koi room type nahi</div>
                    <div style={{ color: C.textMuted, fontSize: 11, marginTop: 3 }}>Neeche button se add karo</div>
                  </div>
                )}
                {roomTypes.map((rm, i) => (
                  <div key={i} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <span style={{ background: "rgba(22,163,74,.15)", color: "#4ade80", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>Type {i + 1}</span>
                      <span style={{ flex: 1, fontWeight: 600, color: C.text, fontSize: 13 }}>{rm.name || "Unnamed"}</span>
                      <button type="button" onClick={() => delRoom(i)} style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.25)", color: "#f87171", borderRadius: 7, padding: "4px 12px", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>Remove</button>
                    </div>
                    <G3>
                      <Fld label="Room Type Name"><input className="hp_i" style={inp} value={rm.name} onChange={e => updRoom(i, "name", e.target.value)} placeholder="Deluxe Cottage" /></Fld>
                      <Fld label="Price (₹)"><input type="number" className="hp_i" style={inp} value={rm.price} onChange={e => updRoom(i, "price", e.target.value)} placeholder="3500" /></Fld>
                      <Fld label="Capacity (persons)"><input type="number" className="hp_i" style={inp} value={rm.capacity} onChange={e => updRoom(i, "capacity", e.target.value)} placeholder="4" /></Fld>
                    </G3>
                  </div>
                ))}
                <button type="button" onClick={addRoom} className="hp_rm" style={{ background: "transparent", border: `2px dashed ${C.border}`, color: C.textMuted, borderRadius: 10, padding: 12, cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 700, transition: "all .15s" }}>
                  + Naya Room Type Add Karo
                </button>
              </div>
            )}

            {/* ── 4: AMENITIES ── */}
            {sec === 4 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <SH icon="🎯" title="Amenities & Activities" desc="Park ki suvidhaen aur activities" />
                {[
                  ["amenities", "🛎️ Amenities", "Swimming Pool, WiFi, Parking, CCTV, 24hr Reception..."],
                  ["facilities", "🏗️ Facilities", "Bonfire Area, Trekking Trails, Cycling Track, Spa..."],
                  ["activities", "🎪 Activities", "Zip-lining, Rock Climbing, Nature Walk, Kayaking..."],
                ].map(([k, l, ph]) => (
                  <div key={k}>
                    <Lbl>{l} (comma separated)</Lbl>
                    <textarea className="hp_i" style={{ ...inp, minHeight: 80, resize: "vertical" }} value={form[k]} onChange={e => set(k, e.target.value)} placeholder={ph} />
                    {form[k] && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                        {form[k].split(",").map(a => a.trim()).filter(Boolean).map((a, i) => (
                          <span key={i} style={{ background: "rgba(22,163,74,.1)", border: "1px solid rgba(22,163,74,.25)", color: "#4ade80", borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>{a}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── 5: FOOD & RULES ── */}
            {sec === 5 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <SH icon="🍽️" title="Food Options & Rules" desc="Khana aur park ke rules" />

                {/* CHECK IN/OUT */}
                <G2>
                  <Fld label="Check-In Time"><input className="hp_i" style={inp} value={form.checkInTime} onChange={e => set("checkInTime", e.target.value)} placeholder="12:00 PM" /></Fld>
                  <Fld label="Check-Out Time"><input className="hp_i" style={inp} value={form.checkOutTime} onChange={e => set("checkOutTime", e.target.value)} placeholder="11:00 AM" /></Fld>
                </G2>

                <div style={{ color: C.textSub, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>🍽️ Food Options</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
                  <Toggle on={form.breakfast} onChange={v => set("breakfast", v)} label="🌅 Breakfast Available" />
                  <Toggle on={form.lunch} onChange={v => set("lunch", v)} label="🥗 Lunch Available" />
                  <Toggle on={form.dinner} onChange={v => set("dinner", v)} label="🍛 Dinner Available" />
                  <Toggle on={form.restaurantAvailable} onChange={v => set("restaurantAvailable", v)} label="🏪 Restaurant On-Site" />
                </div>

                <div style={{ color: C.textSub, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>📜 Park Rules</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
                  <Toggle on={form.petsAllowed} onChange={v => set("petsAllowed", v)} label="🐾 Pets Allowed" />
                  <Toggle on={form.smokingAllowed} onChange={v => set("smokingAllowed", v)} label="🚬 Smoking Allowed" />
                  <Toggle on={form.alcoholAllowed} onChange={v => set("alcoholAllowed", v)} label="🍺 Alcohol Allowed" />
                  <Toggle on={form.coupleFriendly} onChange={v => set("coupleFriendly", v)} label="💑 Couple Friendly" />
                  <Toggle on={form.idProofRequired} onChange={v => set("idProofRequired", v)} label="🪪 ID Proof Required" />
                </div>
              </div>
            )}

            {/* ── 6: IMAGES ── */}
            {sec === 6 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <SH icon="🖼️" title="Property Images" desc="Park ki photos upload karo" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14 }}>
                  {[
                    ["thumbnailImage", "🖼️", "Thumbnail", "Main listing image (1:1)", false],
                    ["bannerImages", "🏔️", "Banner Images", "Park banner photos (max 10)", true],
                    ["galleryImages", "📸", "Gallery", "All park photos (max 15)", true],
                    ["roomImages", "🏡", "Room Images", "Room/cottage photos (max 15)", true],
                  ].map(([k, ico, title, desc, multi]) => (
                    <div key={k} className="hp_fl" style={{ background: C.surface2, border: `2px dashed ${C.border}`, borderRadius: 12, padding: "22px 16px", textAlign: "center" }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>{ico}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{title}</div>
                      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4, marginBottom: 12 }}>{desc}</div>
                      <input type="file" accept="image/*" multiple={multi}
                        onChange={e => setFiles(p => ({ ...p, [k]: multi ? Array.from(e.target.files) : e.target.files[0] }))} />
                      {multi
                        ? files[k]?.length > 0 && <div style={{ marginTop: 10, fontSize: 11, color: C.accent, fontWeight: 600 }}>✓ {files[k].length} photos</div>
                        : files[k] && <div style={{ marginTop: 10, fontSize: 11, color: C.accent, fontWeight: 600 }}>✓ {files[k].name}</div>
                      }
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── 7: SEO ── */}
            {sec === 7 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <SH icon="🔍" title="SEO Settings" desc="Search engine optimization" />
                <G2>
                  <Fld label="Meta Title"><input className="hp_i" style={inp} value={form.metaTitle} onChange={e => set("metaTitle", e.target.value)} placeholder="Best Holiday Park in Munnar | Green Valley" /></Fld>
                  <Fld label="Slug (URL Friendly)"><input className="hp_i" style={inp} value={form.slug} onChange={e => set("slug", e.target.value)} placeholder="green-valley-holiday-park-munnar" /></Fld>
                </G2>
                <Fld label="Meta Description (max 160 chars)">
                  <textarea className="hp_i" style={{ ...inp, minHeight: 80, resize: "vertical" }} value={form.metaDescription} onChange={e => set("metaDescription", e.target.value)} placeholder="Holiday Park mein peaceful stay ka description..." />
                </Fld>
                <div style={{ fontSize: 11, color: form.metaDescription.length > 160 ? C.red : C.textMuted, textAlign: "right" }}>{form.metaDescription.length}/160 chars</div>
              </div>
            )}

            {/* Footer Nav */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 18, borderTop: `1px solid ${C.border}`, flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", gap: 8 }}>
                {sec > 0 && <button type="button" onClick={() => setSec(s => s - 1)} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.textSub, borderRadius: 8, padding: "10px 18px", cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 600 }}>← Prev</button>}
                {sec < 7 && <button type="button" onClick={() => setSec(s => s + 1)} style={{ background: "rgba(22,163,74,.1)", border: "1px solid rgba(22,163,74,.25)", color: "#4ade80", borderRadius: 8, padding: "10px 18px", cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 600 }}>Next →</button>}
              </div>
              <button type="submit" disabled={submitting} style={{ background: "linear-gradient(135deg,#15803d,#166534)", border: "none", color: "#fff", borderRadius: 10, padding: "12px 28px", cursor: "pointer", fontSize: 14, fontFamily: "inherit", fontWeight: 700, boxShadow: "0 4px 18px rgba(22,163,74,.35)", display: "flex", alignItems: "center", gap: 8, opacity: submitting ? .6 : 1 }}>
                {submitting ? <><span style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "hp_sp .7s linear infinite", display: "inline-block" }}></span>Saving...</> : editId ? "💾 Park Update Karo" : "🚀 Park Submit"}
              </button>
            </div>
          </form>
        </div>

        {/* ════════════ TABLE CARD ════════════ */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Table Header */}
          <div style={{ padding: "20px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, background: "linear-gradient(90deg,rgba(59,130,246,.06),transparent)", borderLeft: `3px solid ${C.blue}`, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 26 }}>📋</span>
              <div>
                <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 19, color: C.text }}>Holiday Parks Directory</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>Saare parks manage karo</div>
              </div>
            </div>
            <button onClick={fetchParks} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.textSub, borderRadius: 8, padding: "8px 15px", cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 600 }}>↻ Refresh</button>
          </div>

          {/* Controls */}
          <div style={{ padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, borderBottom: `1px solid ${C.border}`, flexWrap: "wrap", flexShrink: 0 }}>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {[
                { k: "all", l: "All", c: parks.length },
                { k: "approved", l: "Approved", c: parks.filter(p => p.approvalStatus === "approved").length },
                { k: "pending", l: "Pending", c: parks.filter(p => p.approvalStatus === "pending").length },
                { k: "rejected", l: "Rejected", c: parks.filter(p => p.approvalStatus === "rejected").length },
                { k: "featured", l: "Featured", c: parks.filter(p => p.isFeatured).length },
              ].map(t => (
                <button key={t.k} className="hp_tb" onClick={() => setTab(t.k)} style={{ background: tab === t.k ? "rgba(59,130,246,.1)" : "transparent", border: `1px solid ${tab === t.k ? "rgba(59,130,246,.35)" : "transparent"}`, color: tab === t.k ? "#93c5fd" : C.textMuted, borderRadius: 8, padding: "7px 13px", cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                  {t.l}<span style={{ background: tab === t.k ? "rgba(59,130,246,.2)" : "#152035", borderRadius: 999, padding: "1px 7px", fontSize: 10, color: tab === t.k ? "#93c5fd" : C.textMuted }}>{t.c}</span>
                </button>
              ))}
            </div>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <span style={{ position: "absolute", left: 10, fontSize: 13 }}>🔍</span>
              <input className="hp_i" style={{ ...inp, width: 260, paddingLeft: 32 }} placeholder="Name, city, ID..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div style={{ padding: 80, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <div style={{ width: 44, height: 44, border: `3px solid ${C.border}`, borderTopColor: C.accent, borderRadius: "50%", animation: "hp_sp .8s linear infinite" }}></div>
              <div style={{ color: C.textMuted, fontSize: 13 }}>Parks load ho rahe hain...</div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 80, textAlign: "center" }}>
              <div style={{ fontSize: 52 }}>🏕️</div>
              <div style={{ color: C.textSub, marginTop: 12, fontSize: 15, fontWeight: 600 }}>Koi park nahi mila</div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["#", "Park", "Location", "Stars", "Pricing", "Capacity", "Status", "Flags", "Actions"].map(h => (
                      <th key={h} style={{ padding: "11px 15px", fontSize: 10, textTransform: "uppercase", letterSpacing: ".08em", color: C.textMuted, fontWeight: 700, textAlign: "left", whiteSpace: "nowrap", borderBottom: `1px solid ${C.border}`, background: C.surface2 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((park, idx) => (
                    <tr key={park._id} className="hp_row">
                      <td style={{ padding: "13px 15px", verticalAlign: "middle", borderBottom: `1px solid #0b1a2a` }}>
                        <span style={{ background: "#152035", color: C.textSub, borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 700 }}>{idx + 1}</span>
                      </td>
                      <td style={{ padding: "13px 15px", verticalAlign: "middle", borderBottom: `1px solid #0b1a2a` }}>
                        <div style={{ fontWeight: 700, color: C.text, fontSize: 13 }}>{park.parkName}</div>
                        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 1 }}>{park.propertyType}</div>
                        <div style={{ fontSize: 10, color: "#152035", marginTop: 1, fontFamily: "monospace" }}>#{park.propertyId}</div>
                      </td>
                      <td style={{ padding: "13px 15px", verticalAlign: "middle", borderBottom: `1px solid #0b1a2a` }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{park.address?.city || "—"}</div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>{park.address?.state}</div>
                      </td>
                      <td style={{ padding: "13px 15px", verticalAlign: "middle", borderBottom: `1px solid #0b1a2a` }}>
                        <Stars n={park.starCategory} />
                        <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>⭐ {park.rating || 0} ({park.totalReviews || 0})</div>
                      </td>
                      <td style={{ padding: "13px 15px", verticalAlign: "middle", borderBottom: `1px solid #0b1a2a` }}>
                        {park.pricePerNight
                          ? <div style={{ fontSize: 13, fontWeight: 700, color: C.accent }}>₹{park.pricePerNight}<span style={{ fontSize: 10, color: C.textMuted, fontWeight: 400 }}>/night</span></div>
                          : <span style={{ color: C.border }}>—</span>}
                        {park.discount > 0 && <div style={{ fontSize: 10, color: C.orange }}>{park.discount}% off</div>}
                      </td>
                      <td style={{ padding: "13px 15px", verticalAlign: "middle", borderBottom: `1px solid #0b1a2a` }}>
                        <div style={{ fontSize: 12, color: C.text }}>{park.totalRooms || 0} rooms</div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>{park.totalCottages || 0} cottages</div>
                        <div style={{ fontSize: 10, color: C.textMuted }}>max {park.maxGuests || 0} guests</div>
                      </td>
                      <td style={{ padding: "13px 15px", verticalAlign: "middle", borderBottom: `1px solid #0b1a2a` }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          <StatusBadge status={park.approvalStatus} />
                          {!park.isActive && <span style={{ display: "inline-block", borderRadius: 6, padding: "3px 9px", fontSize: 10, fontWeight: 700, color: C.red, background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.25)" }}>🚫 Inactive</span>}
                        </div>
                      </td>
                      <td style={{ padding: "13px 15px", verticalAlign: "middle", borderBottom: `1px solid #0b1a2a` }}>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {park.isFeatured && <span title="Featured">⭐</span>}
                          {park.rules?.coupleFriendly && <span title="Couple Friendly">💑</span>}
                          {park.rules?.petsAllowed && <span title="Pets OK">🐾</span>}
                          {park.foodOptions?.breakfast && <span title="Breakfast">🌅</span>}
                          {park.foodOptions?.restaurantAvailable && <span title="Restaurant">🍽️</span>}
                        </div>
                      </td>
                      <td style={{ padding: "13px 15px", verticalAlign: "middle", borderBottom: `1px solid #0b1a2a` }}>
                        <div style={{ display: "flex", gap: 5 }}>
                          <button className="hp_ab" title="View" onClick={() => setViewPark(park)} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 7, padding: "6px 9px", cursor: "pointer", fontSize: 13, transition: "all .15s" }}>👁</button>
                          <button className="hp_ab" title="Edit" onClick={() => handleEdit(park)} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 7, padding: "6px 9px", cursor: "pointer", fontSize: 13, transition: "all .15s" }}>✏️</button>
                          {park.approvalStatus !== "approved" && (
                            <button className="hp_ab" title="Approve" onClick={() => handleApprove(park._id)} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 7, padding: "6px 9px", cursor: "pointer", fontSize: 13, transition: "all .15s" }}>✅</button>
                          )}
                          {park.approvalStatus !== "rejected" && (
                            <button className="hp_ab" title="Reject" onClick={() => { setRejectModal(park._id); setRejectReason(""); }} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 7, padding: "6px 9px", cursor: "pointer", fontSize: 13, transition: "all .15s" }}>❌</button>
                          )}
                          <button className="hp_ab" title="Delete" onClick={() => handleDelete(park._id)} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 7, padding: "6px 9px", cursor: "pointer", fontSize: 13, transition: "all .15s" }}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ padding: "12px 24px", display: "flex", justifyContent: "space-between", fontSize: 11, color: C.textMuted, borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
            <span>{filtered.length} of {parks.length} parks</span>
            <span>Updated: {new Date().toLocaleTimeString("en-IN")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}