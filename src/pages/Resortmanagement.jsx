import { useState, useEffect } from "react";

const API = "http://localhost:9000/api/resorts";

const AMENITIES_LIST = ["WiFi", "Pool", "Spa", "Gym", "Restaurant", "Bar", "Parking", "AC", "Room Service", "Laundry", "Kids Play Area", "Conference Room"];
const FOOD_OPTIONS = ["Breakfast Included", "Half Board", "Full Board", "All Inclusive", "Room Only"];
const PROPERTY_TYPES = ["Resort", "Hotel", "Villa", "Homestay", "Cottage", "Farmhouse"];

const initialForm = {
  resortName: "", propertyType: "Resort", starRating: "", ownerName: "", email: "", phone: "",
  vendorId: "", vendorName: "", country: "", state: "", city: "", address: "", pincode: "",
  latitude: "", longitude: "", landmark: "", googleMapLink: "", shortDescription: "",
  fullDescription: "", amenities: [], propertyHighlights: "", foodOptions: [],
  activities: "", nearbyAttractions: "", startingPrice: "", taxPercent: "",
  adminCommission: "", vendorCommission: "", checkInTime: "14:00", checkOutTime: "11:00",
  cancellationPolicy: "", childPolicy: "", petPolicy: "", coupleFriendly: true,
  featured: false, isTop: false, isTrending: false, status: "active",
  mainImage: null, images: [],
};

export default function ResortManagement() {
  const [resorts, setResorts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [editId, setEditId] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => { fetchResorts(); }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchResorts = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/all`);
      const d = await r.json();
      setResorts(d.resorts || []);
    } catch { showToast("Failed to load resorts", "error"); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleMultiCheck = (field, val) => {
    setForm(p => ({
      ...p,
      [field]: p[field].includes(val) ? p[field].filter(x => x !== val) : [...p[field], val]
    }));
  };

  const handleFiles = (e) => {
    const { name, files } = e.target;
    if (name === "mainImage") setForm(p => ({ ...p, mainImage: files[0] }));
    else setForm(p => ({ ...p, images: Array.from(files) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "mainImage" && v) fd.append("mainImage", v);
        else if (k === "images" && v.length) v.forEach(f => fd.append("images", f));
        else if (Array.isArray(v)) v.forEach(i => fd.append(k, i));
        else if (v !== null && v !== undefined) fd.append(k, v);
      });

      const url = editId ? `${API}/update/${editId}` : `${API}/add`;
      const method = editId ? "PUT" : "POST";
      const r = await fetch(url, { method, body: editId ? JSON.stringify(Object.fromEntries(fd)) : fd });
      const d = await r.json();
      if (d.success) {
        showToast(editId ? "Resort updated!" : "Resort added!");
        setForm(initialForm); setEditId(null); setActiveTab("basic");
        fetchResorts();
      } else showToast(d.message || "Error", "error");
    } catch { showToast("Submission failed", "error"); }
    finally { setSubmitting(false); }
  };

  const handleApprove = async (id) => {
    await fetch(`${API}/approve/${id}`, { method: "PUT" });
    showToast("Resort approved ✓");
    fetchResorts();
  };

  const handleReject = async (id) => {
    const reason = prompt("Rejection reason:");
    if (!reason) return;
    await fetch(`${API}/reject/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reason }) });
    showToast("Resort rejected", "error");
    fetchResorts();
  };

  const handleDelete = async (id) => {
    await fetch(`${API}/delete/${id}`, { method: "DELETE" });
    showToast("Deleted successfully");
    setDeleteModal(null);
    fetchResorts();
  };

  const filtered = resorts.filter(r => {
    const matchSearch = r.resortName?.toLowerCase().includes(search.toLowerCase()) ||
      r.city?.toLowerCase().includes(search.toLowerCase()) ||
      r.resortId?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || r.approvalStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "location", label: "Location" },
    { id: "details", label: "Details" },
    { id: "pricing", label: "Pricing" },
    { id: "policies", label: "Policies" },
    { id: "media", label: "Media" },
  ];

  const statusColor = (s) => ({
    approved: "#00c853", rejected: "#ff1744", pending: "#ff9100"
  }[s] || "#888");

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#0a0a0f", minHeight: "100vh", color: "#e8e8f0" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 9999,
          background: toast.type === "error" ? "#1a0a0a" : "#0a1a0a",
          border: `1px solid ${toast.type === "error" ? "#ff1744" : "#00c853"}`,
          color: toast.type === "error" ? "#ff6b6b" : "#69f0ae",
          padding: "14px 22px", borderRadius: 10, fontSize: 14, fontWeight: 500,
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)", animation: "slideIn 0.3s ease"
        }}>
          {toast.type === "error" ? "✗ " : "✓ "}{toast.msg}
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#13131a", border: "1px solid #2a2a3a", borderRadius: 16, padding: 36, maxWidth: 400, width: "90%", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h3 style={{ margin: "0 0 8px", fontFamily: "'Space Grotesk', sans-serif", color: "#ff6b6b" }}>Delete Resort?</h3>
            <p style={{ color: "#888", margin: "0 0 28px", fontSize: 14 }}>This action cannot be undone. All data will be permanently removed.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setDeleteModal(null)} style={{ padding: "10px 24px", background: "#1e1e2e", border: "1px solid #2a2a3a", borderRadius: 8, color: "#aaa", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>Cancel</button>
              <button onClick={() => handleDelete(deleteModal)} style={{ padding: "10px 24px", background: "#ff1744", border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        input, select, textarea { outline: none; }
        input:focus, select:focus, textarea:focus { border-color: #6c63ff !important; box-shadow: 0 0 0 3px rgba(108,99,255,0.15) !important; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #13131a; }
        ::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 3px; }
        .tr-hover:hover { background: rgba(108,99,255,0.05) !important; }
        .btn-icon:hover { opacity: 0.8; transform: scale(0.96); }
        .tab-btn:hover { background: rgba(108,99,255,0.1) !important; }
      `}</style>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: 36, borderBottom: "1px solid #1e1e2e", paddingBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 6 }}>
            <div style={{ width: 44, height: 44, background: "linear-gradient(135deg, #6c63ff, #a78bfa)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🏨</div>
            <div>
              <h1 style={{ margin: 0, fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, background: "linear-gradient(135deg, #e8e8f0, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Resort Management</h1>
              <p style={{ margin: 0, color: "#555", fontSize: 13 }}>Add, manage and approve resorts</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
            {[
              { label: "Total", val: resorts.length, color: "#6c63ff" },
              { label: "Approved", val: resorts.filter(r => r.approvalStatus === "approved").length, color: "#00c853" },
              { label: "Pending", val: resorts.filter(r => r.approvalStatus === "pending").length, color: "#ff9100" },
              { label: "Rejected", val: resorts.filter(r => r.approvalStatus === "rejected").length, color: "#ff1744" },
            ].map(s => (
              <div key={s.label} style={{ background: "#13131a", border: `1px solid #1e1e2e`, borderRadius: 10, padding: "12px 20px", minWidth: 100 }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>{s.val}</div>
                <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FORM */}
        <div style={{ background: "#13131a", border: "1px solid #1e1e2e", borderRadius: 16, marginBottom: 40, overflow: "hidden" }}>
          <div style={{ padding: "20px 28px", borderBottom: "1px solid #1e1e2e", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ margin: 0, fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600 }}>
              {editId ? "✏️ Edit Resort" : "➕ Add New Resort"}
            </h2>
            {editId && (
              <button onClick={() => { setForm(initialForm); setEditId(null); setActiveTab("basic"); }}
                style={{ background: "#1e1e2e", border: "1px solid #2a2a3a", color: "#aaa", padding: "7px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
                ✕ Cancel Edit
              </button>
            )}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, padding: "16px 28px 0", borderBottom: "1px solid #1e1e2e", overflowX: "auto" }}>
            {tabs.map(t => (
              <button key={t.id} className="tab-btn" onClick={() => setActiveTab(t.id)}
                style={{
                  padding: "9px 18px", background: activeTab === t.id ? "rgba(108,99,255,0.2)" : "transparent",
                  border: activeTab === t.id ? "1px solid rgba(108,99,255,0.5)" : "1px solid transparent",
                  borderBottom: "none", borderRadius: "8px 8px 0 0", color: activeTab === t.id ? "#a78bfa" : "#666",
                  cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
                  whiteSpace: "nowrap", transition: "all 0.2s"
                }}>
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ padding: "28px 28px" }}>

              {/* BASIC INFO */}
              {activeTab === "basic" && (
                <div>
                  <Grid>
                    <Field label="Resort Name *"><Input name="resortName" value={form.resortName} onChange={handleChange} placeholder="e.g. The Grand Palace Resort" required /></Field>
                    <Field label="Property Type">
                      <Select name="propertyType" value={form.propertyType} onChange={handleChange}>
                        {PROPERTY_TYPES.map(p => <option key={p}>{p}</option>)}
                      </Select>
                    </Field>
                    <Field label="Star Rating">
                      <Select name="starRating" value={form.starRating} onChange={handleChange}>
                        <option value="">Select Stars</option>
                        {[1,2,3,4,5].map(s => <option key={s} value={s}>{s} ⭐</option>)}
                      </Select>
                    </Field>
                    <Field label="Owner Name"><Input name="ownerName" value={form.ownerName} onChange={handleChange} placeholder="Owner full name" /></Field>
                    <Field label="Email"><Input type="email" name="email" value={form.email} onChange={handleChange} placeholder="contact@resort.com" /></Field>
                    <Field label="Phone"><Input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" /></Field>
                    <Field label="Vendor ID"><Input name="vendorId" value={form.vendorId} onChange={handleChange} placeholder="VND001" /></Field>
                    <Field label="Vendor Name"><Input name="vendorName" value={form.vendorName} onChange={handleChange} placeholder="Vendor name" /></Field>
                    <Field label="Status">
                      <Select name="status" value={form.status} onChange={handleChange}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </Select>
                    </Field>
                  </Grid>
                  <div style={{ display: "flex", gap: 28, marginTop: 20, flexWrap: "wrap" }}>
                    {[["coupleFriendly", "Couple Friendly"], ["featured", "Featured"], ["isTop", "Top Resort"], ["isTrending", "Trending"]].map(([key, label]) => (
                      <label key={key} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: "#aaa" }}>
                        <div onClick={() => setForm(p => ({ ...p, [key]: !p[key] }))}
                          style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${form[key] ? "#6c63ff" : "#2a2a3a"}`, background: form[key] ? "#6c63ff" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", flexShrink: 0 }}>
                          {form[key] && <span style={{ color: "#fff", fontSize: 12 }}>✓</span>}
                        </div>
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* LOCATION */}
              {activeTab === "location" && (
                <Grid>
                  <Field label="Country"><Input name="country" value={form.country} onChange={handleChange} placeholder="India" /></Field>
                  <Field label="State"><Input name="state" value={form.state} onChange={handleChange} placeholder="Goa" /></Field>
                  <Field label="City"><Input name="city" value={form.city} onChange={handleChange} placeholder="Panaji" /></Field>
                  <Field label="Pincode"><Input name="pincode" value={form.pincode} onChange={handleChange} placeholder="403001" /></Field>
                  <Field label="Latitude"><Input name="latitude" value={form.latitude} onChange={handleChange} placeholder="15.4909" /></Field>
                  <Field label="Longitude"><Input name="longitude" value={form.longitude} onChange={handleChange} placeholder="73.8278" /></Field>
                  <Field label="Landmark"><Input name="landmark" value={form.landmark} onChange={handleChange} placeholder="Near Calangute Beach" /></Field>
                  <Field label="Google Map Link" full><Input name="googleMapLink" value={form.googleMapLink} onChange={handleChange} placeholder="https://maps.google.com/..." /></Field>
                  <Field label="Full Address" full><TextArea name="address" value={form.address} onChange={handleChange} placeholder="Street, Area, City, State, Pincode" rows={2} /></Field>
                </Grid>
              )}

              {/* DETAILS */}
              {activeTab === "details" && (
                <div>
                  <Grid>
                    <Field label="Short Description" full><TextArea name="shortDescription" value={form.shortDescription} onChange={handleChange} placeholder="Brief tagline for the resort..." rows={2} /></Field>
                    <Field label="Full Description" full><TextArea name="fullDescription" value={form.fullDescription} onChange={handleChange} placeholder="Detailed description..." rows={4} /></Field>
                    <Field label="Activities (comma separated)" full><Input name="activities" value={form.activities} onChange={handleChange} placeholder="Trekking, Kayaking, Yoga" /></Field>
                    <Field label="Nearby Attractions (comma separated)" full><Input name="nearbyAttractions" value={form.nearbyAttractions} onChange={handleChange} placeholder="Calangute Beach (2km), Baga Beach (3km)" /></Field>
                    <Field label="Property Highlights (comma separated)" full><Input name="propertyHighlights" value={form.propertyHighlights} onChange={handleChange} placeholder="Beachfront, Private Pool, Mountain View" /></Field>
                  </Grid>
                  <div style={{ marginTop: 20 }}>
                    <SectionLabel>Amenities</SectionLabel>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
                      {AMENITIES_LIST.map(a => (
                        <label key={a} onClick={() => handleMultiCheck("amenities", a)}
                          style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", padding: "6px 14px", borderRadius: 20, border: `1px solid ${form.amenities.includes(a) ? "#6c63ff" : "#2a2a3a"}`, background: form.amenities.includes(a) ? "rgba(108,99,255,0.15)" : "#1e1e2e", fontSize: 13, color: form.amenities.includes(a) ? "#a78bfa" : "#888", transition: "all 0.2s", userSelect: "none" }}>
                          {form.amenities.includes(a) && "✓ "}{a}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <SectionLabel>Food Options</SectionLabel>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
                      {FOOD_OPTIONS.map(f => (
                        <label key={f} onClick={() => handleMultiCheck("foodOptions", f)}
                          style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", padding: "6px 14px", borderRadius: 20, border: `1px solid ${form.foodOptions.includes(f) ? "#00c853" : "#2a2a3a"}`, background: form.foodOptions.includes(f) ? "rgba(0,200,83,0.1)" : "#1e1e2e", fontSize: 13, color: form.foodOptions.includes(f) ? "#69f0ae" : "#888", transition: "all 0.2s", userSelect: "none" }}>
                          {form.foodOptions.includes(f) && "✓ "}{f}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* PRICING */}
              {activeTab === "pricing" && (
                <Grid>
                  <Field label="Starting Price (₹)"><Input type="number" name="startingPrice" value={form.startingPrice} onChange={handleChange} placeholder="2500" /></Field>
                  <Field label="Tax (%)"><Input type="number" name="taxPercent" value={form.taxPercent} onChange={handleChange} placeholder="18" /></Field>
                  <Field label="Admin Commission (%)"><Input type="number" name="adminCommission" value={form.adminCommission} onChange={handleChange} placeholder="10" /></Field>
                  <Field label="Vendor Commission (%)"><Input type="number" name="vendorCommission" value={form.vendorCommission} onChange={handleChange} placeholder="5" /></Field>
                  <Field label="Check-In Time"><Input type="time" name="checkInTime" value={form.checkInTime} onChange={handleChange} /></Field>
                  <Field label="Check-Out Time"><Input type="time" name="checkOutTime" value={form.checkOutTime} onChange={handleChange} /></Field>
                </Grid>
              )}

              {/* POLICIES */}
              {activeTab === "policies" && (
                <Grid>
                  <Field label="Cancellation Policy" full><TextArea name="cancellationPolicy" value={form.cancellationPolicy} onChange={handleChange} placeholder="Free cancellation up to 48 hours before check-in..." rows={3} /></Field>
                  <Field label="Child Policy" full><TextArea name="childPolicy" value={form.childPolicy} onChange={handleChange} placeholder="Children below 5 stay free..." rows={3} /></Field>
                  <Field label="Pet Policy" full><TextArea name="petPolicy" value={form.petPolicy} onChange={handleChange} placeholder="Pets are not allowed on premises..." rows={3} /></Field>
                </Grid>
              )}

              {/* MEDIA */}
              {activeTab === "media" && (
                <Grid>
                  <Field label="Main Image" full>
                    <div style={{ border: "2px dashed #2a2a3a", borderRadius: 10, padding: 20, textAlign: "center", cursor: "pointer", position: "relative", transition: "border-color 0.2s" }}>
                      <input type="file" name="mainImage" onChange={handleFiles} accept="image/*" style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
                      {form.mainImage ? (
                        <div style={{ color: "#69f0ae", fontSize: 14 }}>✓ {form.mainImage.name}</div>
                      ) : (
                        <div>
                          <div style={{ fontSize: 28, marginBottom: 8 }}>🖼️</div>
                          <div style={{ color: "#555", fontSize: 13 }}>Click to upload main image</div>
                        </div>
                      )}
                    </div>
                  </Field>
                  <Field label="Gallery Images (max 20)" full>
                    <div style={{ border: "2px dashed #2a2a3a", borderRadius: 10, padding: 20, textAlign: "center", cursor: "pointer", position: "relative" }}>
                      <input type="file" name="images" onChange={handleFiles} accept="image/*" multiple style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
                      {form.images.length > 0 ? (
                        <div style={{ color: "#69f0ae", fontSize: 14 }}>✓ {form.images.length} image(s) selected</div>
                      ) : (
                        <div>
                          <div style={{ fontSize: 28, marginBottom: 8 }}>📸</div>
                          <div style={{ color: "#555", fontSize: 13 }}>Click to upload gallery images</div>
                        </div>
                      )}
                    </div>
                  </Field>
                </Grid>
              )}
            </div>

            {/* Form Actions */}
            <div style={{ padding: "16px 28px", borderTop: "1px solid #1e1e2e", display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button type="button" onClick={() => { setForm(initialForm); setEditId(null); setActiveTab("basic"); }}
                style={{ padding: "10px 24px", background: "#1e1e2e", border: "1px solid #2a2a3a", borderRadius: 8, color: "#888", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500 }}>
                Reset
              </button>
              <button type="submit" disabled={submitting}
                style={{ padding: "10px 28px", background: "linear-gradient(135deg, #6c63ff, #a78bfa)", border: "none", borderRadius: 8, color: "#fff", cursor: submitting ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, opacity: submitting ? 0.7 : 1, transition: "opacity 0.2s" }}>
                {submitting ? "Saving..." : editId ? "Update Resort" : "Add Resort"}
              </button>
            </div>
          </form>
        </div>

        {/* TABLE */}
        <div style={{ background: "#13131a", border: "1px solid #1e1e2e", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "20px 28px", borderBottom: "1px solid #1e1e2e", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
            <h2 style={{ margin: 0, fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600 }}>
              All Resorts <span style={{ color: "#555", fontSize: 14, fontWeight: 400 }}>({filtered.length})</span>
            </h2>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search resort, city, ID..."
                style={{ padding: "8px 14px", background: "#0a0a0f", border: "1px solid #2a2a3a", borderRadius: 8, color: "#e8e8f0", fontSize: 13, fontFamily: "'DM Sans', sans-serif", width: 220 }} />
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                style={{ padding: "8px 14px", background: "#0a0a0f", border: "1px solid #2a2a3a", borderRadius: 8, color: "#e8e8f0", fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <button onClick={fetchResorts} style={{ padding: "8px 14px", background: "#1e1e2e", border: "1px solid #2a2a3a", borderRadius: 8, color: "#888", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
                ↺ Refresh
              </button>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#0f0f18", borderBottom: "1px solid #1e1e2e" }}>
                  {["ID", "Resort Name", "Type", "City", "Owner", "Price", "Rating", "Status", "Approval", "Actions"].map(h => (
                    <th key={h} style={{ padding: "13px 16px", textAlign: "left", color: "#555", fontWeight: 600, whiteSpace: "nowrap", fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={10} style={{ padding: 60, textAlign: "center", color: "#444" }}>Loading resorts...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={10} style={{ padding: 60, textAlign: "center", color: "#444" }}>
                    <div style={{ fontSize: 36, marginBottom: 12 }}>🏨</div>
                    No resorts found
                  </td></tr>
                ) : filtered.map((resort, i) => (
                  <>
                    <tr key={resort._id} className="tr-hover"
                      style={{ borderBottom: "1px solid #1a1a25", transition: "background 0.15s", cursor: "pointer" }}
                      onClick={() => setExpandedRow(expandedRow === resort._id ? null : resort._id)}>
                      <td style={{ padding: "14px 16px", color: "#6c63ff", fontWeight: 500 }}>{resort.resortId || "—"}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontWeight: 500, color: "#e8e8f0" }}>{resort.resortName}</div>
                        {resort.featured && <span style={{ fontSize: 10, color: "#ff9100", border: "1px solid #ff9100", borderRadius: 3, padding: "1px 5px", marginTop: 3, display: "inline-block" }}>FEATURED</span>}
                        {resort.isTrending && <span style={{ fontSize: 10, color: "#00e5ff", border: "1px solid #00e5ff", borderRadius: 3, padding: "1px 5px", marginTop: 3, marginLeft: 4, display: "inline-block" }}>TRENDING</span>}
                      </td>
                      <td style={{ padding: "14px 16px", color: "#888" }}>{resort.propertyType || "Resort"}</td>
                      <td style={{ padding: "14px 16px", color: "#888" }}>{[resort.city, resort.state].filter(Boolean).join(", ") || "—"}</td>
                      <td style={{ padding: "14px 16px", color: "#888" }}>
                        <div>{resort.ownerName || "—"}</div>
                        {resort.phone && <div style={{ fontSize: 11, color: "#444" }}>{resort.phone}</div>}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        {resort.startingPrice ? <span style={{ color: "#69f0ae", fontWeight: 600 }}>₹{resort.startingPrice.toLocaleString()}</span> : "—"}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        {resort.rating ? <span style={{ color: "#ffd740" }}>★ {resort.rating}</span> : <span style={{ color: "#444" }}>—</span>}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600, border: `1px solid`, borderColor: resort.status === "active" ? "#00c853" : "#555", color: resort.status === "active" ? "#00c853" : "#666", background: resort.status === "active" ? "rgba(0,200,83,0.08)" : "rgba(85,85,85,0.08)" }}>
                          {resort.status?.toUpperCase() || "ACTIVE"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600, border: "1px solid", borderColor: statusColor(resort.approvalStatus), color: statusColor(resort.approvalStatus), background: `${statusColor(resort.approvalStatus)}18` }}>
                          {resort.approvalStatus?.toUpperCase() || "PENDING"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: "flex", gap: 6, flexWrap: "nowrap" }}>
                          {resort.approvalStatus === "pending" && (
                            <>
                              <ActionBtn color="#00c853" onClick={() => handleApprove(resort._id)} title="Approve">✓</ActionBtn>
                              <ActionBtn color="#ff1744" onClick={() => handleReject(resort._id)} title="Reject">✗</ActionBtn>
                            </>
                          )}
                          <ActionBtn color="#6c63ff" onClick={() => { setForm({ ...initialForm, ...resort, mainImage: null, images: [] }); setEditId(resort._id); setActiveTab("basic"); window.scrollTo({ top: 0, behavior: "smooth" }); }} title="Edit">✎</ActionBtn>
                          <ActionBtn color="#ff5252" onClick={() => setDeleteModal(resort._id)} title="Delete">🗑</ActionBtn>
                        </div>
                      </td>
                    </tr>
                    {expandedRow === resort._id && (
                      <tr key={`exp-${resort._id}`} style={{ background: "#0f0f18", borderBottom: "1px solid #1e1e2e" }}>
                        <td colSpan={10} style={{ padding: "20px 28px" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
                            {[
                              ["📍 Address", resort.address],
                              ["🗺️ Landmark", resort.landmark],
                              ["✉️ Email", resort.email],
                              ["⭐ Stars", resort.starRating ? `${resort.starRating} Star` : null],
                              ["🕐 Check-In", resort.checkInTime],
                              ["🕐 Check-Out", resort.checkOutTime],
                              ["💰 Tax", resort.taxPercent ? `${resort.taxPercent}%` : null],
                              ["📝 Total Bookings", resort.totalBookings],
                              ["🛏 Total Rooms", resort.totalRooms],
                              ["👥 Couple Friendly", resort.coupleFriendly ? "Yes" : "No"],
                            ].filter(([, v]) => v !== null && v !== undefined && v !== "").map(([label, val]) => (
                              <div key={label} style={{ background: "#13131a", borderRadius: 8, padding: "10px 14px", border: "1px solid #1e1e2e" }}>
                                <div style={{ fontSize: 11, color: "#555", marginBottom: 4 }}>{label}</div>
                                <div style={{ fontSize: 13, color: "#aaa" }}>{val || "—"}</div>
                              </div>
                            ))}
                          </div>
                          {resort.shortDescription && (
                            <div style={{ marginTop: 12, color: "#666", fontSize: 13, fontStyle: "italic", borderLeft: "2px solid #2a2a3a", paddingLeft: 12 }}>
                              {resort.shortDescription}
                            </div>
                          )}
                          {resort.amenities?.length > 0 && (
                            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
                              {resort.amenities.map(a => (
                                <span key={a} style={{ fontSize: 11, color: "#888", background: "#1e1e2e", border: "1px solid #2a2a3a", borderRadius: 4, padding: "2px 8px" }}>{a}</span>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- HELPERS ---- */
function Grid({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>{children}</div>;
}

function Field({ label, children, full }) {
  return (
    <div style={full ? { gridColumn: "1 / -1" } : {}}>
      <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 7, fontWeight: 500, letterSpacing: "0.03em" }}>{label}</label>
      {children}
    </div>
  );
}

function Input(props) {
  return <input {...props} style={{ width: "100%", padding: "9px 12px", background: "#0a0a0f", border: "1px solid #2a2a3a", borderRadius: 8, color: "#e8e8f0", fontSize: 13, fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s", ...props.style }} />;
}

function Select({ children, ...props }) {
  return <select {...props} style={{ width: "100%", padding: "9px 12px", background: "#0a0a0f", border: "1px solid #2a2a3a", borderRadius: 8, color: "#e8e8f0", fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", boxSizing: "border-box" }}>{children}</select>;
}

function TextArea(props) {
  return <textarea {...props} style={{ width: "100%", padding: "9px 12px", background: "#0a0a0f", border: "1px solid #2a2a3a", borderRadius: 8, color: "#e8e8f0", fontSize: 13, fontFamily: "'DM Sans', sans-serif", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6, transition: "border-color 0.2s, box-shadow 0.2s", ...props.style }} />;
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: 12, color: "#666", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>{children}</div>;
}

function ActionBtn({ color, onClick, children, title }) {
  return (
    <button className="btn-icon" onClick={onClick} title={title}
      style={{ width: 30, height: 30, borderRadius: 7, background: `${color}18`, border: `1px solid ${color}40`, color, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", flexShrink: 0, fontFamily: "'DM Sans', sans-serif" }}>
      {children}
    </button>
  );
}