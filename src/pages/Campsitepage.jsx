import { useState, useEffect, useRef } from "react";

const API = "http://localhost:9000/api/campsites";

const AMENITIES_LIST = ["WiFi", "Bonfire", "Toilet", "Shower", "Parking", "Kitchen", "Swimming Pool", "Electricity"];
const ACTIVITIES_LIST = ["Trekking", "Camping", "Rock Climbing", "River Rafting", "Cycling", "Bird Watching"];

const initialForm = {
  campsiteName: "", description: "", shortDescription: "", category: "Camping",
  campType: "", totalTents: "", availableTents: "", maxGuests: "",
  checkInTime: "", checkOutTime: "",
  "address.street": "", "address.area": "", "address.city": "", "address.state": "", "address.pincode": "", "address.landmark": "",
  "location.latitude": "", "location.longitude": "", "location.googleMapLink": "",
  "price.perNight": "", "price.weekendPrice": "", "price.childPrice": "", "price.extraPersonPrice": "",
  discount: "", taxPercent: "",
  contactNumber: "", alternateNumber: "", email: "", website: "",
  foodAvailable: false, foodType: "Both",
  metaTitle: "", metaDescription: "",
  amenities: [], activities: [], rules: [], tags: [],
};

export default function CampsitePage() {
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});
  const [campsites, setCampsites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [viewModal, setViewModal] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const formRef = useRef(null);

//   const token = localStorage.getItem("token");
//   const headers = { Authorization: `Bearer ${token}` };


  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const res = await fetch(`${API}/all`, { headers });
      const data = await res.json();
      if (data.success) setCampsites(data.data);
    } catch {}
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleMultiToggle = (field, val) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(val)
        ? prev[field].filter(v => v !== val)
        : [...prev[field], val]
    }));
  };

  const handleTagInput = (field, e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      setForm(prev => ({ ...prev, [field]: [...prev[field], e.target.value.trim()] }));
      e.target.value = "";
    }
  };

  const removeTag = (field, val) => {
    setForm(prev => ({ ...prev, [field]: prev[field].filter(v => v !== val) }));
  };

  const handleFile = (e) => {
    const { name, files: f } = e.target;
    const fileArr = Array.from(f);
    setFiles(prev => ({ ...prev, [name]: fileArr }));
    const urls = fileArr.map(file => URL.createObjectURL(file));
    setPreviews(prev => ({ ...prev, [name]: urls }));
  };

  const buildFormData = () => {
    const fd = new FormData();
    // flatten nested keys
    Object.entries(form).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.forEach(item => fd.append(k, item));
      } else {
        // address/location/price keys
        if (k.includes(".")) {
          const [parent, child] = k.split(".");
          fd.append(`${parent}[${child}]`, v);
        } else {
          fd.append(k, v);
        }
      }
    });
    Object.entries(files).forEach(([field, fileArr]) => {
      fileArr.forEach(f => fd.append(field, f));
    });
    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = buildFormData();
    try {
      const url = editId ? `${API}/update/${editId}` : `${API}/add`;
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers, body: fd });
      const data = await res.json();
      if (data.success) {
        showToast(editId ? "Campsite updated!" : "Campsite added!");
        resetForm();
        fetchAll();
      } else {
        showToast(data.message || "Error", "error");
      }
    } catch {
      showToast("Server error", "error");
    }
    setLoading(false);
  };

  const resetForm = () => {
    setForm(initialForm);
    setFiles({});
    setPreviews({});
    setEditId(null);
    setActiveTab("basic");
  };

  const handleEdit = (c) => {
    setEditId(c._id);
    setActiveTab("basic");
    setForm({
      campsiteName: c.campsiteName || "", description: c.description || "",
      shortDescription: c.shortDescription || "", category: c.category || "Camping",
      campType: c.campType || "", totalTents: c.totalTents || "", availableTents: c.availableTents || "",
      maxGuests: c.maxGuests || "", checkInTime: c.checkInTime || "", checkOutTime: c.checkOutTime || "",
      "address.street": c.address?.street || "", "address.area": c.address?.area || "",
      "address.city": c.address?.city || "", "address.state": c.address?.state || "",
      "address.pincode": c.address?.pincode || "", "address.landmark": c.address?.landmark || "",
      "location.latitude": c.location?.latitude || "", "location.longitude": c.location?.longitude || "",
      "location.googleMapLink": c.location?.googleMapLink || "",
      "price.perNight": c.price?.perNight || "", "price.weekendPrice": c.price?.weekendPrice || "",
      "price.childPrice": c.price?.childPrice || "", "price.extraPersonPrice": c.price?.extraPersonPrice || "",
      discount: c.discount || "", taxPercent: c.taxPercent || "",
      contactNumber: c.contactNumber || "", alternateNumber: c.alternateNumber || "",
      email: c.email || "", website: c.website || "",
      foodAvailable: c.foodAvailable || false, foodType: c.foodType || "Both",
      metaTitle: c.metaTitle || "", metaDescription: c.metaDescription || "",
      amenities: c.amenities || [], activities: c.activities || [],
      rules: c.rules || [], tags: c.tags || [],
    });
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/delete/${id}`, { method: "DELETE", headers });
      const data = await res.json();
      if (data.success) { showToast("Deleted!"); fetchAll(); }
    } catch { showToast("Error", "error"); }
    setDeleteConfirm(null);
  };

  const handleApprove = async (id) => {
    const res = await fetch(`${API}/approve/${id}`, { method: "PUT", headers });
    const data = await res.json();
    if (data.success) { showToast("Approved!"); fetchAll(); }
  };

  const handleReject = async (id) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    const res = await fetch(`${API}/reject/${id}`, {
      method: "PUT", headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ reason })
    });
    const data = await res.json();
    if (data.success) { showToast("Rejected", "error"); fetchAll(); }
  };

  const filtered = campsites.filter(c =>
    c.campsiteName?.toLowerCase().includes(search.toLowerCase()) ||
    c.address?.city?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (s) => {
    if (s === "active") return "#16a34a";
    if (s === "pending") return "#d97706";
    return "#dc2626";
  };

  const tabs = [
    { id: "basic", label: "🏕️ Basic" },
    { id: "location", label: "📍 Location" },
    { id: "pricing", label: "💰 Pricing" },
    { id: "amenities", label: "⭐ Amenities" },
    { id: "images", label: "🖼️ Images" },
    { id: "documents", label: "📄 Documents" },
    { id: "contact", label: "📞 Contact" },
    { id: "seo", label: "🔍 SEO" },
  ];

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: "#0f1117", minHeight: "100vh", color: "#e2e8f0" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 9999,
          background: toast.type === "error" ? "#dc2626" : "#16a34a",
          color: "#fff", padding: "12px 24px", borderRadius: 10,
          fontWeight: 600, boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          animation: "slideIn 0.3s ease"
        }}>
          {toast.msg}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
          zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{ background: "#1e2130", borderRadius: 16, padding: 32, width: 360, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ margin: "0 0 8px", color: "#f1f5f9" }}>Delete Campsite?</h3>
            <p style={{ color: "#94a3b8", marginBottom: 24 }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setDeleteConfirm(null)} style={btnStyle("#334155")}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} style={btnStyle("#dc2626")}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)",
          zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center",
          padding: 24, overflowY: "auto"
        }}>
          <div style={{
            background: "#1e2130", borderRadius: 20, width: "100%", maxWidth: 720,
            maxHeight: "90vh", overflowY: "auto", padding: 32
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h2 style={{ margin: 0, color: "#f1f5f9", fontSize: 22 }}>{viewModal.campsiteName}</h2>
                <span style={{ background: statusColor(viewModal.status), color: "#fff", padding: "2px 10px", borderRadius: 20, fontSize: 12, marginTop: 6, display: "inline-block" }}>
                  {viewModal.status?.toUpperCase()}
                </span>
              </div>
              <button onClick={() => setViewModal(null)} style={{ background: "#334155", border: "none", color: "#94a3b8", padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 18 }}>✕</button>
            </div>

            {/* Images */}
            {viewModal.thumbnailImage && (
              <img src={viewModal.thumbnailImage} alt="thumbnail"
                style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 12, marginBottom: 16 }} />
            )}
            {viewModal.images?.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
                {viewModal.images.map((img, i) => (
                  <img key={i} src={img} alt="" style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 8 }} />
                ))}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                ["Property ID", viewModal.propertyId],
                ["Category", viewModal.category],
                ["Camp Type", viewModal.campType],
                ["Price/Night", `₹${viewModal.price?.perNight || "-"}`],
                ["City", viewModal.address?.city],
                ["State", viewModal.address?.state],
                ["Contact", viewModal.contactNumber],
                ["Rating", `⭐ ${viewModal.rating}`],
                ["Total Tents", viewModal.totalTents],
                ["Max Guests", viewModal.maxGuests],
                ["Food", viewModal.foodAvailable ? "Yes" : "No"],
                ["Added By", viewModal.addedBy],
              ].map(([label, val]) => (
                <div key={label} style={{ background: "#0f1117", borderRadius: 8, padding: "10px 14px" }}>
                  <div style={{ fontSize: 11, color: "#64748b", marginBottom: 2 }}>{label}</div>
                  <div style={{ fontWeight: 600, color: "#e2e8f0" }}>{val || "-"}</div>
                </div>
              ))}
            </div>

            {viewModal.amenities?.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>AMENITIES</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {viewModal.amenities.map(a => (
                    <span key={a} style={{ background: "#1d4ed8", color: "#bfdbfe", padding: "4px 10px", borderRadius: 20, fontSize: 12 }}>{a}</span>
                  ))}
                </div>
              </div>
            )}

            <p style={{ color: "#94a3b8", marginTop: 16, lineHeight: 1.6 }}>{viewModal.description}</p>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.5px" }}>
            🏕️ Campsite Management
          </h1>
          <p style={{ margin: "6px 0 0", color: "#64748b" }}>Add and manage all campsites from one place</p>
        </div>

        {/* ===== FORM ===== */}
        <div ref={formRef} style={{
          background: "#1e2130", borderRadius: 20, padding: 32,
          marginBottom: 40, border: "1px solid #2d3748"
        }}>
          <h2 style={{ margin: "0 0 24px", fontSize: 20, color: "#f1f5f9" }}>
            {editId ? "✏️ Update Campsite" : "➕ Add New Campsite"}
          </h2>

          {/* Tabs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                fontFamily: "inherit", fontSize: 13, fontWeight: 500, transition: "all 0.2s",
                background: activeTab === t.id ? "#3b82f6" : "#2d3748",
                color: activeTab === t.id ? "#fff" : "#94a3b8"
              }}>{t.label}</button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>

            {/* BASIC */}
            {activeTab === "basic" && (
              <div style={gridStyle(2)}>
                <div style={{ gridColumn: "span 2" }}>
                  <Input label="Campsite Name *" name="campsiteName" value={form.campsiteName} onChange={handleChange} required />
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <Input label="Description *" name="description" value={form.description} onChange={handleChange} textarea required />
                </div>
                <Input label="Short Description" name="shortDescription" value={form.shortDescription} onChange={handleChange} />
                <Select label="Category" name="category" value={form.category} onChange={handleChange}
                  options={["Camping", "Adventure", "Jungle", "Desert", "Mountain", "Beach"]} />
                <Input label="Camp Type" name="campType" value={form.campType} onChange={handleChange} placeholder="Tent / Luxury Tent / Dome" />
                <Input label="Total Tents" name="totalTents" value={form.totalTents} onChange={handleChange} type="number" />
                <Input label="Available Tents" name="availableTents" value={form.availableTents} onChange={handleChange} type="number" />
                <Input label="Max Guests" name="maxGuests" value={form.maxGuests} onChange={handleChange} type="number" />
                <Input label="Check-in Time" name="checkInTime" value={form.checkInTime} onChange={handleChange} placeholder="e.g. 12:00 PM" />
                <Input label="Check-out Time" name="checkOutTime" value={form.checkOutTime} onChange={handleChange} placeholder="e.g. 11:00 AM" />
                <div>
                  <label style={labelStyle}>Food Available</label>
                  <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#94a3b8", cursor: "pointer" }}>
                      <input type="checkbox" name="foodAvailable" checked={form.foodAvailable} onChange={handleChange} />
                      Yes
                    </label>
                  </div>
                </div>
                {form.foodAvailable && (
                  <Select label="Food Type" name="foodType" value={form.foodType} onChange={handleChange}
                    options={["Both", "Veg", "Non-Veg"]} />
                )}
                <div style={{ gridColumn: "span 2" }}>
                  <label style={labelStyle}>Tags <span style={{ color: "#64748b" }}>(Press Enter to add)</span></label>
                  <input onKeyDown={(e) => handleTagInput("tags", e)} placeholder="e.g. riverside, adventure" style={inputStyle} />
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                    {form.tags.map(t => <Tag key={t} label={t} onRemove={() => removeTag("tags", t)} />)}
                  </div>
                </div>
              </div>
            )}

            {/* LOCATION */}
            {activeTab === "location" && (
              <div style={gridStyle(2)}>
                <Input label="Street" name="address.street" value={form["address.street"]} onChange={handleChange} />
                <Input label="Area" name="address.area" value={form["address.area"]} onChange={handleChange} />
                <Input label="City" name="address.city" value={form["address.city"]} onChange={handleChange} />
                <Input label="State" name="address.state" value={form["address.state"]} onChange={handleChange} />
                <Input label="Pincode" name="address.pincode" value={form["address.pincode"]} onChange={handleChange} />
                <Input label="Landmark" name="address.landmark" value={form["address.landmark"]} onChange={handleChange} />
                <Input label="Latitude" name="location.latitude" value={form["location.latitude"]} onChange={handleChange} />
                <Input label="Longitude" name="location.longitude" value={form["location.longitude"]} onChange={handleChange} />
                <div style={{ gridColumn: "span 2" }}>
                  <Input label="Google Map Link" name="location.googleMapLink" value={form["location.googleMapLink"]} onChange={handleChange} />
                </div>
              </div>
            )}

            {/* PRICING */}
            {activeTab === "pricing" && (
              <div style={gridStyle(2)}>
                <Input label="Price Per Night (₹)" name="price.perNight" value={form["price.perNight"]} onChange={handleChange} type="number" />
                <Input label="Weekend Price (₹)" name="price.weekendPrice" value={form["price.weekendPrice"]} onChange={handleChange} type="number" />
                <Input label="Child Price (₹)" name="price.childPrice" value={form["price.childPrice"]} onChange={handleChange} type="number" />
                <Input label="Extra Person Price (₹)" name="price.extraPersonPrice" value={form["price.extraPersonPrice"]} onChange={handleChange} type="number" />
                <Input label="Discount (%)" name="discount" value={form.discount} onChange={handleChange} type="number" />
                <Input label="Tax (%)" name="taxPercent" value={form.taxPercent} onChange={handleChange} type="number" />
              </div>
            )}

            {/* AMENITIES */}
            {activeTab === "amenities" && (
              <div>
                <Section label="Amenities">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {AMENITIES_LIST.map(a => (
                      <ToggleChip key={a} label={a} active={form.amenities.includes(a)}
                        onClick={() => handleMultiToggle("amenities", a)} />
                    ))}
                  </div>
                </Section>
                <Section label="Activities" style={{ marginTop: 20 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {ACTIVITIES_LIST.map(a => (
                      <ToggleChip key={a} label={a} active={form.activities.includes(a)}
                        onClick={() => handleMultiToggle("activities", a)} />
                    ))}
                  </div>
                </Section>
                <Section label="Rules" style={{ marginTop: 20 }}>
                  <input onKeyDown={(e) => handleTagInput("rules", e)} placeholder="Press Enter to add rule" style={inputStyle} />
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                    {form.rules.map(r => <Tag key={r} label={r} onRemove={() => removeTag("rules", r)} />)}
                  </div>
                </Section>
              </div>
            )}

            {/* IMAGES */}
            {activeTab === "images" && (
              <div style={gridStyle(2)}>
                {[
                  { name: "thumbnailImage", label: "Thumbnail Image", multiple: false },
                  { name: "bannerImage", label: "Banner Image", multiple: false },
                  { name: "images", label: "Main Images (max 20)", multiple: true },
                  { name: "galleryImages", label: "Gallery Images (max 20)", multiple: true },
                ].map(({ name, label, multiple }) => (
                  <div key={name}>
                    <label style={labelStyle}>{label}</label>
                    <input type="file" name={name} accept="image/*" multiple={multiple}
                      onChange={handleFile}
                      style={{ display: "block", marginTop: 6, color: "#94a3b8", fontSize: 13 }} />
                    {previews[name]?.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                        {previews[name].map((url, i) => (
                          <img key={i} src={url} alt=""
                            style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, border: "2px solid #3b82f6" }} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* DOCUMENTS */}
            {activeTab === "documents" && (
              <div style={gridStyle(2)}>
                {[
                  { name: "idProof", label: "ID Proof (Aadhar/PAN)" },
                  { name: "campsiteLicense", label: "Campsite License" },
                  { name: "pollutionCertificate", label: "Pollution Certificate" },
                  { name: "fireSafetyCertificate", label: "Fire Safety Certificate" },
                  { name: "otherDocuments", label: "Other Documents" },
                ].map(({ name, label }) => (
                  <div key={name}>
                    <label style={labelStyle}>{label}</label>
                    <input type="file" name={name} multiple onChange={handleFile}
                      style={{ display: "block", marginTop: 6, color: "#94a3b8", fontSize: 13 }} />
                  </div>
                ))}
              </div>
            )}

            {/* CONTACT */}
            {activeTab === "contact" && (
              <div style={gridStyle(2)}>
                <Input label="Contact Number" name="contactNumber" value={form.contactNumber} onChange={handleChange} />
                <Input label="Alternate Number" name="alternateNumber" value={form.alternateNumber} onChange={handleChange} />
                <Input label="Email" name="email" value={form.email} onChange={handleChange} type="email" />
                <Input label="Website" name="website" value={form.website} onChange={handleChange} />
              </div>
            )}

            {/* SEO */}
            {activeTab === "seo" && (
              <div style={gridStyle(2)}>
                <div style={{ gridColumn: "span 2" }}>
                  <Input label="Meta Title" name="metaTitle" value={form.metaTitle} onChange={handleChange} />
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <Input label="Meta Description" name="metaDescription" value={form.metaDescription} onChange={handleChange} textarea />
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div style={{ display: "flex", gap: 12, marginTop: 28, justifyContent: "flex-end" }}>
              {editId && (
                <button type="button" onClick={resetForm} style={btnStyle("#334155")}>
                  Cancel
                </button>
              )}
              <button type="submit" disabled={loading} style={btnStyle("#3b82f6", true)}>
                {loading ? "Saving..." : editId ? "Update Campsite" : "Add Campsite"}
              </button>
            </div>
          </form>
        </div>

        {/* ===== TABLE ===== */}
        <div style={{ background: "#1e2130", borderRadius: 20, border: "1px solid #2d3748", overflow: "hidden" }}>
          {/* Table Header */}
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #2d3748", display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
            <h2 style={{ margin: 0, fontSize: 18, color: "#f1f5f9" }}>
              All Campsites <span style={{ color: "#64748b", fontWeight: 400, fontSize: 14 }}>({filtered.length})</span>
            </h2>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Search by name or city..."
              style={{ ...inputStyle, width: 260, margin: 0 }}
            />
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#0f1117" }}>
                  {["Image", "Campsite", "Location", "Price/Night", "Status", "Doc Status", "Added By", "Actions"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#64748b", fontWeight: 600, fontSize: 11, letterSpacing: "0.5px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: 48, textAlign: "center", color: "#64748b" }}>
                      <div style={{ fontSize: 48 }}>🏕️</div>
                      <div style={{ marginTop: 12 }}>No campsites found</div>
                    </td>
                  </tr>
                ) : filtered.map((c, idx) => (
                  <tr key={c._id} style={{
                    borderTop: "1px solid #2d3748",
                    background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                    transition: "background 0.2s"
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(59,130,246,0.05)"}
                    onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)"}
                  >
                    <td style={{ padding: "12px 16px" }}>
                      {c.thumbnailImage ? (
                        <img src={c.thumbnailImage} alt=""
                          style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 8, cursor: "pointer", border: "2px solid #2d3748" }}
                          onClick={() => setViewModal(c)}
                        />
                      ) : (
                        <div style={{ width: 52, height: 52, borderRadius: 8, background: "#2d3748", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🏕️</div>
                      )}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontWeight: 600, color: "#e2e8f0" }}>{c.campsiteName}</div>
                      <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>{c.propertyId} · {c.category}</div>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#94a3b8" }}>
                      {c.address?.city}{c.address?.state ? `, ${c.address.state}` : ""}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#34d399", fontWeight: 600 }}>
                      {c.price?.perNight ? `₹${c.price.perNight}` : "-"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        background: `${statusColor(c.status)}22`,
                        color: statusColor(c.status),
                        padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600
                      }}>
                        {c.status?.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        background: c.documentStatus === "approved" ? "#16a34a22" : c.documentStatus === "rejected" ? "#dc262622" : "#d9770622",
                        color: c.documentStatus === "approved" ? "#16a34a" : c.documentStatus === "rejected" ? "#dc2626" : "#d97706",
                        padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600
                      }}>
                        {c.documentStatus?.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#94a3b8" }}>{c.addedBy}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <ActionBtn label="👁️" title="View" onClick={() => setViewModal(c)} color="#334155" />
                        <ActionBtn label="✏️" title="Edit" onClick={() => handleEdit(c)} color="#1d4ed8" />
                        {c.status === "pending" && (
                          <>
                            <ActionBtn label="✅" title="Approve" onClick={() => handleApprove(c._id)} color="#16a34a" />
                            <ActionBtn label="❌" title="Reject" onClick={() => handleReject(c._id)} color="#dc2626" />
                          </>
                        )}
                        <ActionBtn label="🗑️" title="Delete" onClick={() => setDeleteConfirm(c._id)} color="#991b1b" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        input[type="file"] { cursor: pointer; }
        input[type="checkbox"] { width: 16px; height: 16px; cursor: pointer; accent-color: #3b82f6; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0f1117; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
      `}</style>
    </div>
  );
}

// ===== HELPER COMPONENTS =====

function Input({ label, name, value, onChange, type = "text", textarea, required, placeholder }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {textarea ? (
        <textarea name={name} value={value} onChange={onChange} required={required} placeholder={placeholder}
          style={{ ...inputStyle, height: 100, resize: "vertical" }} />
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder}
          style={inputStyle} />
      )}
    </div>
  );
}

function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select name={name} value={value} onChange={onChange} style={{ ...inputStyle, cursor: "pointer" }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function ToggleChip({ label, active, onClick }) {
  return (
    <button type="button" onClick={onClick} style={{
      padding: "6px 14px", borderRadius: 20, border: `1px solid ${active ? "#3b82f6" : "#334155"}`,
      background: active ? "#1d4ed8" : "transparent", color: active ? "#bfdbfe" : "#94a3b8",
      cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 500, transition: "all 0.2s"
    }}>{label}</button>
  );
}

function Tag({ label, onRemove }) {
  return (
    <span style={{ background: "#1d4ed8", color: "#bfdbfe", padding: "4px 10px", borderRadius: 20, fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
      {label}
      <span onClick={onRemove} style={{ cursor: "pointer", opacity: 0.7 }}>✕</span>
    </span>
  );
}

function Section({ label, children }) {
  return (
    <div>
      <label style={{ ...labelStyle, marginBottom: 12 }}>{label}</label>
      {children}
    </div>
  );
}

function ActionBtn({ label, title, onClick, color }) {
  return (
    <button type="button" title={title} onClick={onClick} style={{
      padding: "6px 10px", background: `${color}22`, border: `1px solid ${color}44`,
      borderRadius: 7, cursor: "pointer", fontSize: 14, transition: "all 0.2s"
    }}>{label}</button>
  );
}

const labelStyle = {
  display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8",
  marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px"
};

const inputStyle = {
  width: "100%", background: "#0f1117", border: "1px solid #334155",
  borderRadius: 8, padding: "10px 14px", color: "#e2e8f0",
  fontFamily: "'Outfit', sans-serif", fontSize: 14, outline: "none",
  boxSizing: "border-box", transition: "border 0.2s"
};

const gridStyle = (cols) => ({
  display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16
});

const btnStyle = (bg, primary = false) => ({
  padding: "10px 24px", background: bg, border: "none", borderRadius: 10,
  color: "#fff", cursor: "pointer", fontFamily: "'Outfit', sans-serif",
  fontSize: 14, fontWeight: 600, transition: "opacity 0.2s",
  opacity: 1
});