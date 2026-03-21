import { useState, useEffect, useRef } from "react";

const API_BASE = "http://localhost:9000/api/farmstay"; // apna URL yahan daalo

/* ─── tiny toast ─── */
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", top: 24, right: 24, zIndex: 9999,
      background: type === "error" ? "#ef4444" : "#22c55e",
      color: "#fff", padding: "12px 20px", borderRadius: 10,
      fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
      boxShadow: "0 8px 30px rgba(0,0,0,0.18)", animation: "slideIn .3s ease"
    }}>
      {msg}
    </div>
  );
}

/* ─── image preview ─── */
function ImgPreview({ src, alt }) {
  const [open, setOpen] = useState(false);
  if (!src) return <span style={{ color: "#94a3b8", fontSize: 12 }}>No image</span>;
  return (
    <>
      <img
        src={src} alt={alt}
        onClick={() => setOpen(true)}
        style={{ width: 54, height: 40, objectFit: "cover", borderRadius: 6, cursor: "pointer", border: "2px solid #e2e8f0" }}
      />
      {open && (
        <div onClick={() => setOpen(false)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 10000,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <img src={src} alt={alt} style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,.5)" }} />
        </div>
      )}
    </>
  );
}

/* ─── view modal ─── */
function ViewModal({ farm, onClose }) {
  if (!farm) return null;
  const imgs = [farm.thumbnailImage, farm.bannerImage, ...(farm.images || []), ...(farm.galleryImages || [])].filter(Boolean);
  const Row = ({ label, val }) => val ? (
    <div style={{ display: "flex", gap: 12, marginBottom: 8, fontSize: 14 }}>
      <span style={{ fontWeight: 700, color: "#64748b", minWidth: 160 }}>{label}</span>
      <span style={{ color: "#1e293b" }}>{val}</span>
    </div>
  ) : null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 18, width: "100%", maxWidth: 780, maxHeight: "90vh", overflowY: "auto",
        fontFamily: "'DM Sans', sans-serif", boxShadow: "0 25px 80px rgba(0,0,0,.25)"
      }}>
        {/* header */}
        <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{farm.farmName}</h2>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>#{farm.propertyId}</span>
          </div>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, width: 36, height: 36, cursor: "pointer", fontSize: 18, color: "#64748b" }}>✕</button>
        </div>

        {/* images scroll */}
        {imgs.length > 0 && (
          <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "16px 28px", scrollbarWidth: "none" }}>
            {imgs.map((img, i) => (
              <img key={i} src={img} alt="" style={{ height: 140, minWidth: 200, objectFit: "cover", borderRadius: 10, border: "2px solid #e2e8f0", flexShrink: 0 }} />
            ))}
          </div>
        )}

        {/* details */}
        <div style={{ padding: "8px 28px 28px" }}>
          <Row label="Status" val={<span style={{
            padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700,
            background: farm.status === "active" ? "#dcfce7" : farm.status === "pending" ? "#fef9c3" : "#fee2e2",
            color: farm.status === "active" ? "#16a34a" : farm.status === "pending" ? "#ca8a04" : "#dc2626"
          }}>{farm.status?.toUpperCase()}</span>} />
          <Row label="Description" val={farm.description} />
          <Row label="Short Description" val={farm.shortDescription} />
          <Row label="Stay Type" val={farm.stayType} />
          <Row label="City / State" val={`${farm.address?.city || ""}, ${farm.address?.state || ""}`} />
          <Row label="Price/Night" val={farm.price?.perNight ? `₹${farm.price.perNight}` : null} />
          <Row label="Weekend Price" val={farm.price?.weekendPrice ? `₹${farm.price.weekendPrice}` : null} />
          <Row label="Max Guests" val={farm.maxGuests} />
          <Row label="Total Rooms" val={farm.totalRooms} />
          <Row label="Check-in / Check-out" val={`${farm.checkInTime || ""} / ${farm.checkOutTime || ""}`} />
          <Row label="Food Available" val={farm.foodAvailable ? `Yes (${farm.foodType})` : "No"} />
          <Row label="Amenities" val={farm.amenities?.join(", ")} />
          <Row label="Activities" val={farm.activities?.join(", ")} />
          <Row label="Rules" val={farm.rules?.join(", ")} />
          <Row label="Contact" val={farm.contactNumber} />
          <Row label="Email" val={farm.email} />
          <Row label="Vendor" val={farm.vendorId?.name ? `${farm.vendorId.name} (${farm.vendorId.email})` : null} />
          <Row label="Rating" val={farm.rating} />
          <Row label="Added By" val={farm.addedBy} />
          <Row label="Document Status" val={farm.documentStatus} />
          {farm.rejectionReason && <Row label="Rejection Reason" val={farm.rejectionReason} />}

          {/* docs */}
          {farm.documents && Object.entries(farm.documents).some(([, v]) => v?.length) && (
            <>
              <div style={{ fontWeight: 700, color: "#0f172a", marginTop: 16, marginBottom: 8 }}>Documents</div>
              {Object.entries(farm.documents).map(([key, urls]) =>
                urls?.length ? (
                  <div key={key} style={{ marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: "#64748b", textTransform: "capitalize" }}>{key}: </span>
                    {urls.map((u, i) => <a key={i} href={u} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#3b82f6", marginRight: 8 }}>View {i + 1}</a>)}
                  </div>
                ) : null
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── reject reason modal ─── */
function RejectModal({ onConfirm, onClose }) {
  const [reason, setReason] = useState("");
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, padding: 32, width: 420, fontFamily: "'DM Sans', sans-serif" }}>
        <h3 style={{ margin: "0 0 16px", color: "#0f172a" }}>Rejection Reason</h3>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Enter reason for rejection..."
          rows={4}
          style={{ width: "100%", borderRadius: 10, border: "1.5px solid #e2e8f0", padding: 12, fontSize: 14, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }}
        />
        <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "9px 20px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Cancel</button>
          <button onClick={() => onConfirm(reason)} style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "#ef4444", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>Reject</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function FarmStayAdmin() {
  const token = localStorage.getItem("adminToken") || "";
  const headers = { Authorization: `Bearer ${token}` };

  /* form state */
  const emptyForm = {
    farmName: "", description: "", shortDescription: "", stayType: "",
    "address.city": "", "address.state": "", "address.pincode": "", "address.street": "",
    "price.perNight": "", "price.weekendPrice": "", "price.childPrice": "", "price.extraPersonPrice": "",
    maxGuests: "", totalRooms: "", checkInTime: "", checkOutTime: "",
    foodAvailable: false, foodType: "Both",
    amenities: "", activities: "", rules: "", tags: "",
    contactNumber: "", email: "", taxPercent: "", discount: 0,
    "location.latitude": "", "location.longitude": "", "location.googleMapLink": "",
    metaTitle: "", metaDescription: "",
  };
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState({});
  const [editId, setEditId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  /* table state */
  const [farms, setFarms] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [tableLoading, setTableLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  /* modals */
  const [viewFarm, setViewFarm] = useState(null);
  const [rejectId, setRejectId] = useState(null);

  /* toast */
  const [toast, setToast] = useState({ msg: "", type: "success" });
  const showToast = (msg, type = "success") => setToast({ msg, type });

  const formRef = useRef(null);

  /* ─ fetch table ─ */
  const fetchFarms = async () => {
    setTableLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 8 });
      if (search) params.append("search", search);
      if (statusFilter) params.append("status", statusFilter);
      if (cityFilter) params.append("city", cityFilter);
      const r = await fetch(`${API_BASE}/all?${params}`, { headers });
      const d = await r.json();
      if (d.success) { setFarms(d.data); setTotal(d.total); setPages(d.pages); }
    } catch { showToast("Failed to fetch", "error"); }
    setTableLoading(false);
  };

  useEffect(() => { fetchFarms(); }, [page, statusFilter, cityFilter]);

  /* ─ form change ─ */
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFile = e => {
    const { name, files: f } = e.target;
    setFiles(prev => ({ ...prev, [name]: f }));
  };

  /* ─ submit ─ */
  const handleSubmit = async e => {
    e.preventDefault();
    setFormLoading(true);
    const fd = new FormData();

    // flatten nested keys -> body
    Object.entries(form).forEach(([k, v]) => {
      if (v !== "" && v !== undefined) fd.append(k, v);
    });

    // split comma-separated arrays
    ["amenities", "activities", "rules", "tags", "metaKeywords"].forEach(field => {
      if (form[field]) form[field].split(",").map(s => s.trim()).forEach(val => fd.append(field, val));
    });

    // files
    Object.entries(files).forEach(([name, fileList]) => {
      Array.from(fileList).forEach(file => fd.append(name, file));
    });

    try {
      const url = editId ? `${API_BASE}/update/${editId}` : `${API_BASE}/add`;
      const method = editId ? "PUT" : "POST";
      const r = await fetch(url, { method, headers: { Authorization: `Bearer ${admintoken}` }, body: fd });
      const d = await r.json();
      if (d.success) {
        showToast(editId ? "Updated!" : "Added!");
        setForm(emptyForm);
        setFiles({});
        setEditId(null);
        fetchFarms();
      } else showToast(d.message || "Error", "error");
    } catch { showToast("Network error", "error"); }
    setFormLoading(false);
  };

  /* ─ edit prefill ─ */
  const handleEdit = farm => {
    setEditId(farm._id);
    setForm({
      farmName: farm.farmName || "", description: farm.description || "",
      shortDescription: farm.shortDescription || "", stayType: farm.stayType || "",
      "address.city": farm.address?.city || "", "address.state": farm.address?.state || "",
      "address.pincode": farm.address?.pincode || "", "address.street": farm.address?.street || "",
      "price.perNight": farm.price?.perNight || "", "price.weekendPrice": farm.price?.weekendPrice || "",
      "price.childPrice": farm.price?.childPrice || "", "price.extraPersonPrice": farm.price?.extraPersonPrice || "",
      maxGuests: farm.maxGuests || "", totalRooms: farm.totalRooms || "",
      checkInTime: farm.checkInTime || "", checkOutTime: farm.checkOutTime || "",
      foodAvailable: farm.foodAvailable || false, foodType: farm.foodType || "Both",
      amenities: farm.amenities?.join(", ") || "", activities: farm.activities?.join(", ") || "",
      rules: farm.rules?.join(", ") || "", tags: farm.tags?.join(", ") || "",
      contactNumber: farm.contactNumber || "", email: farm.email || "",
      taxPercent: farm.taxPercent || "", discount: farm.discount || 0,
      "location.latitude": farm.location?.latitude || "", "location.longitude": farm.location?.longitude || "",
      "location.googleMapLink": farm.location?.googleMapLink || "",
      metaTitle: farm.metaTitle || "", metaDescription: farm.metaDescription || "",
    });
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* ─ approve/reject/delete ─ */
  const approve = async id => {
    await fetch(`${API_BASE}/approve/${id}`, { method: "PUT", headers });
    showToast("Approved!"); fetchFarms();
  };
  const reject = async (id, reason) => {
    await fetch(`${API_BASE}/reject/${id}`, {
      method: "PUT", headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ reason })
    });
    setRejectId(null); showToast("Rejected", "error"); fetchFarms();
  };
  const del = async id => {
    if (!confirm("Delete this farm stay?")) return;
    await fetch(`${API_BASE}/delete/${id}`, { method: "DELETE", headers });
    showToast("Deleted"); fetchFarms();
  };

  /* ─── STYLES ─── */
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', sans-serif; background: #f0f4f8; }
    @keyframes slideIn { from { transform: translateX(60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes fadeUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    input, textarea, select {
      width: 100%; padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px;
      font-family: 'DM Sans', sans-serif; font-size: 14px; color: #1e293b; background: #fff;
      transition: border .2s;
    }
    input:focus, textarea:focus, select:focus { outline: none; border-color: #3b82f6; }
    label { font-size: 13px; font-weight: 600; color: #475569; display: block; margin-bottom: 5px; }
    .field { margin-bottom: 14px; }
    .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
    .section-title {
      font-family: 'Playfair Display', serif; font-size: 17px; color: #0f172a;
      border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin: 20px 0 14px;
    }
    .btn-primary {
      background: linear-gradient(135deg, #3b82f6, #6366f1); color: #fff; border: none;
      padding: 12px 28px; border-radius: 12px; font-weight: 700; font-size: 15px;
      cursor: pointer; font-family: 'DM Sans', sans-serif; transition: opacity .2s;
    }
    .btn-primary:hover { opacity: .88; }
    .btn-primary:disabled { opacity: .55; cursor: not-allowed; }
    .btn-sm {
      padding: 5px 12px; border-radius: 7px; border: none; font-size: 12px;
      font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif;
    }
    .chip {
      display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700;
    }
    table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
    th { background: #f8fafc; padding: 12px 14px; text-align: left; font-weight: 700; color: #475569; font-size: 12px; text-transform: uppercase; letter-spacing: .5px; border-bottom: 1.5px solid #e2e8f0; }
    td { padding: 11px 14px; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: middle; }
    tr:hover td { background: #f8fafc; }
    .actions { display: flex; gap: 6px; flex-wrap: wrap; }
    ::-webkit-scrollbar { height: 5px; width: 5px; } 
    ::-webkit-scrollbar-track { background: #f1f5f9; } 
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
  `;

  const statusChip = s => {
    const map = { active: ["#dcfce7", "#16a34a"], pending: ["#fef9c3", "#ca8a04"], inactive: ["#fee2e2", "#dc2626"] };
    const [bg, color] = map[s] || ["#f1f5f9", "#64748b"];
    return <span className="chip" style={{ background: bg, color }}>{s?.toUpperCase()}</span>;
  };

  const Input = ({ label, name, type = "text", placeholder, ...rest }) => (
    <div className="field">
      <label>{label}</label>
      <input name={name} type={type} placeholder={placeholder} value={form[name] || ""} onChange={handleChange} {...rest} />
    </div>
  );

  const Select = ({ label, name, children }) => (
    <div className="field">
      <label>{label}</label>
      <select name={name} value={form[name] || ""} onChange={handleChange}>{children}</select>
    </div>
  );

  const FileInput = ({ label, name, multiple }) => (
    <div className="field">
      <label>{label}</label>
      <input type="file" name={name} multiple={multiple} accept="image/*,.pdf" onChange={handleFile} style={{ padding: "7px 10px", background: "#f8fafc" }} />
    </div>
  );

  return (
    <>
      <style>{css}</style>
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: "" })} />
      {viewFarm && <ViewModal farm={viewFarm} onClose={() => setViewFarm(null)} />}
      {rejectId && <RejectModal onConfirm={reason => reject(rejectId, reason)} onClose={() => setRejectId(null)} />}

      <div style={{ minHeight: "100vh", background: "#f0f4f8", padding: "32px 24px", fontFamily: "'DM Sans', sans-serif" }}>

        {/* PAGE HEADER */}
        <div style={{ marginBottom: 28, animation: "fadeUp .5s ease" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, color: "#0f172a", fontWeight: 700 }}>🌿 Farm Stay Management</h1>
          <p style={{ color: "#64748b", marginTop: 4 }}>Add, update and manage all farm stay listings</p>
        </div>

        {/* ═══ FORM CARD ═══ */}
        <div ref={formRef} style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", marginBottom: 32, boxShadow: "0 4px 24px rgba(0,0,0,.07)", animation: "fadeUp .6s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#0f172a" }}>
              {editId ? "✏️ Update Farm Stay" : "➕ Add New Farm Stay"}
            </h2>
            {editId && (
              <button onClick={() => { setEditId(null); setForm(emptyForm); setFiles({}); }}
                style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontWeight: 600, fontSize: 13, color: "#475569" }}>
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="section-title">Basic Info</div>
            <div className="grid3">
              <Input label="Farm Name *" name="farmName" placeholder="Green Valley Farm" />
              <Input label="Stay Type" name="stayType" placeholder="cottage / hut / villa" />
              <Select label="Food Available" name="foodAvailable">
                <option value={false}>No</option>
                <option value={true}>Yes</option>
              </Select>
            </div>
            <div className="field">
              <label>Description *</label>
              <textarea name="description" rows={3} placeholder="Full description..." value={form.description} onChange={handleChange} />
            </div>
            <div className="grid2">
              <div className="field"><label>Short Description</label><textarea name="shortDescription" rows={2} placeholder="Brief summary..." value={form.shortDescription} onChange={handleChange} /></div>
              <Select label="Food Type" name="foodType">
                <option>Both</option><option>Veg</option><option>Non-Veg</option>
              </Select>
            </div>
            <div className="grid3">
              <Input label="Tags (comma-separated)" name="tags" placeholder="organic, village, luxury" />
              <Input label="Amenities (comma-separated)" name="amenities" placeholder="wifi, pool, parking" />
              <Input label="Activities (comma-separated)" name="activities" placeholder="farming, bonfire" />
            </div>
            <div className="field">
              <label>Rules (comma-separated)</label>
              <input name="rules" placeholder="No smoking, No pets" value={form.rules} onChange={handleChange} />
            </div>

            <div className="section-title">Location</div>
            <div className="grid3">
              <Input label="Street" name="address.street" />
              <Input label="City" name="address.city" />
              <Input label="State" name="address.state" />
              <Input label="Pincode" name="address.pincode" />
              <Input label="Latitude" name="location.latitude" />
              <Input label="Longitude" name="location.longitude" />
            </div>
            <Input label="Google Map Link" name="location.googleMapLink" placeholder="https://maps.google.com/..." />

            <div className="section-title">Pricing</div>
            <div className="grid3">
              <Input label="Price / Night (₹)" name="price.perNight" type="number" />
              <Input label="Weekend Price (₹)" name="price.weekendPrice" type="number" />
              <Input label="Child Price (₹)" name="price.childPrice" type="number" />
              <Input label="Extra Person (₹)" name="price.extraPersonPrice" type="number" />
              <Input label="Discount (%)" name="discount" type="number" />
              <Input label="Tax (%)" name="taxPercent" type="number" />
            </div>

            <div className="section-title">Capacity & Timing</div>
            <div className="grid3">
              <Input label="Max Guests" name="maxGuests" type="number" />
              <Input label="Total Rooms" name="totalRooms" type="number" />
              <Input label="Check-in Time" name="checkInTime" placeholder="11:00 AM" />
              <Input label="Check-out Time" name="checkOutTime" placeholder="10:00 AM" />
            </div>

            <div className="section-title">Contact</div>
            <div className="grid3">
              <Input label="Phone" name="contactNumber" />
              <Input label="Email" name="email" type="email" />
              <Input label="Website" name="website" />
            </div>

            <div className="section-title">Images</div>
            <div className="grid2">
              <FileInput label="Thumbnail Image" name="thumbnailImage" />
              <FileInput label="Banner Image" name="bannerImage" />
              <FileInput label="Property Images (multi)" name="images" multiple />
              <FileInput label="Gallery Images (multi)" name="galleryImages" multiple />
            </div>

            <div className="section-title">Documents</div>
            <div className="grid2">
              <FileInput label="ID Proof" name="idProof" multiple />
              <FileInput label="Property License" name="propertyLicense" multiple />
              <FileInput label="Pollution Certificate" name="pollutionCertificate" multiple />
              <FileInput label="Fire Safety Certificate" name="fireSafetyCertificate" multiple />
              <FileInput label="Other Documents" name="otherDocuments" multiple />
            </div>

            <div className="section-title">SEO</div>
            <div className="grid2">
              <Input label="Meta Title" name="metaTitle" />
              <Input label="Meta Keywords (comma-separated)" name="metaKeywords" />
            </div>
            <div className="field">
              <label>Meta Description</label>
              <textarea name="metaDescription" rows={2} value={form.metaDescription} onChange={handleChange} />
            </div>

            <div style={{ marginTop: 20, display: "flex", gap: 12, alignItems: "center" }}>
              <button type="submit" className="btn-primary" disabled={formLoading}>
                {formLoading ? "Saving..." : editId ? "Update Farm Stay" : "Add Farm Stay"}
              </button>
              {editId && (
                <button type="button" onClick={() => { setEditId(null); setForm(emptyForm); setFiles({}); }}
                  style={{ padding: "11px 24px", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 600 }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ═══ TABLE CARD ═══ */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "24px 28px", boxShadow: "0 4px 24px rgba(0,0,0,.07)", animation: "fadeUp .7s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#0f172a" }}>All Listings ({total})</h2>
            {/* Filters */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input
                placeholder="Search farms..." value={search} onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === "Enter" && fetchFarms()}
                style={{ width: 200, padding: "9px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 13 }}
              />
              <button onClick={fetchFarms} className="btn-primary" style={{ padding: "9px 18px", fontSize: 13 }}>Search</button>
              <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                style={{ padding: "9px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 13, width: "auto" }}>
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
              <input placeholder="Filter by city" value={cityFilter} onChange={e => setCityFilter(e.target.value)}
                onKeyDown={e => e.key === "Enter" && fetchFarms()}
                style={{ width: 140, padding: "9px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 13 }} />
            </div>
          </div>

          {tableLoading ? (
            <div style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}>Loading...</div>
          ) : farms.length === 0 ? (
            <div style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}>No farm stays found</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Farm</th>
                    <th>Location</th>
                    <th>Price/Night</th>
                    <th>Status</th>
                    <th>Doc Status</th>
                    <th>Vendor</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {farms.map(farm => (
                    <tr key={farm._id}>
                      <td><ImgPreview src={farm.thumbnailImage} alt={farm.farmName} /></td>
                      <td>
                        <div style={{ fontWeight: 700, color: "#0f172a" }}>{farm.farmName}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>#{farm.propertyId}</div>
                      </td>
                      <td>{farm.address?.city}, {farm.address?.state}</td>
                      <td style={{ fontWeight: 700, color: "#3b82f6" }}>
                        {farm.price?.perNight ? `₹${farm.price.perNight}` : "-"}
                      </td>
                      <td>{statusChip(farm.status)}</td>
                      <td>
                        <span className="chip" style={{
                          background: farm.documentStatus === "approved" ? "#dcfce7" : farm.documentStatus === "rejected" ? "#fee2e2" : "#fef9c3",
                          color: farm.documentStatus === "approved" ? "#16a34a" : farm.documentStatus === "rejected" ? "#dc2626" : "#ca8a04"
                        }}>{farm.documentStatus?.toUpperCase()}</span>
                      </td>
                      <td style={{ fontSize: 12 }}>
                        {farm.vendorId?.name || <span style={{ color: "#94a3b8" }}>Admin</span>}
                      </td>
                      <td>
                        <div className="actions">
                          <button className="btn-sm" onClick={() => setViewFarm(farm)} style={{ background: "#eff6ff", color: "#3b82f6" }}>View</button>
                          <button className="btn-sm" onClick={() => handleEdit(farm)} style={{ background: "#f0fdf4", color: "#16a34a" }}>Edit</button>
                          {farm.status === "pending" && (
                            <>
                              <button className="btn-sm" onClick={() => approve(farm._id)} style={{ background: "#dcfce7", color: "#15803d" }}>✓ Approve</button>
                              <button className="btn-sm" onClick={() => setRejectId(farm._id)} style={{ background: "#fee2e2", color: "#dc2626" }}>✕ Reject</button>
                            </>
                          )}
                          <button className="btn-sm" onClick={() => del(farm._id)} style={{ background: "#fef2f2", color: "#ef4444" }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "center", alignItems: "center" }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="btn-sm" style={{ background: "#f1f5f9", color: "#475569", padding: "7px 16px" }}>
                ← Prev
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className="btn-sm"
                  style={{ padding: "7px 14px", background: p === page ? "linear-gradient(135deg,#3b82f6,#6366f1)" : "#f1f5f9", color: p === page ? "#fff" : "#475569" }}>
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                className="btn-sm" style={{ background: "#f1f5f9", color: "#475569", padding: "7px 16px" }}>
                Next →
              </button>
            </div>
          )}
        </div>

      </div>
    </>
  );
}