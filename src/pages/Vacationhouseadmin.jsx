import { useState, useEffect, useRef } from "react";

const API = "https://bmtadmin.onrender.com/api/vacationhouses"; // apna URL change karo

const AMENITIES_LIST = [
  "WiFi", "AC", "Swimming Pool", "Parking", "Kitchen", "TV",
  "Washing Machine", "Geyser", "Generator", "Security", "Garden", "BBQ"
];

const initialForm = {
  propertyName: "", description: "", shortDescription: "", starRating: "",
  checkInTime: "12:00 PM", checkOutTime: "11:00 AM",
  address: { street: "", area: "", landmark: "", city: "", state: "", country: "India", pincode: "" },
  geoLocation: { latitude: "", longitude: "" },
  contactDetails: { ownerName: "", phone: "", alternatePhone: "", email: "" },
  price: { basePrice: "", weekendPrice: "", monthlyPrice: "", cleaningFee: "", securityDeposit: "" },
  discount: { percentage: "", validTill: "" },
  policies: { guestAllowed: true, unmarriedCouplesAllowed: true, petsAllowed: false, smokingAllowed: false, cancellationPolicy: "", houseRules: "" },
  amenities: [],
};

export default function VacationHouseAdmin() {
  const [houses, setHouses] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [tab, setTab] = useState("basic");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState(null);
  const token = localStorage.getItem("token") || "";

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = async () => {
    try {
      const r = await fetch(API, { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json();
      setHouses(d.data || []);
    } catch { showToast("Failed to fetch data", "error"); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleInput = (path, value) => {
    setForm(prev => {
      const keys = path.split(".");
      if (keys.length === 1) return { ...prev, [path]: value };
      return { ...prev, [keys[0]]: { ...prev[keys[0]], [keys[1]]: value } };
    });
  };

  const toggleAmenity = (a) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter(x => x !== a)
        : [...prev.amenities, a]
    }));
  };

  const handleFile = (field, e) => {
    setFiles(prev => ({ ...prev, [field]: e.target.files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("propertyName", form.propertyName);
      fd.append("description", form.description);
      fd.append("shortDescription", form.shortDescription);
      fd.append("starRating", form.starRating);
      fd.append("checkInTime", form.checkInTime);
      fd.append("checkOutTime", form.checkOutTime);
      fd.append("address", JSON.stringify(form.address));
      fd.append("geoLocation", JSON.stringify(form.geoLocation));
      fd.append("contactDetails", JSON.stringify(form.contactDetails));
      fd.append("price", JSON.stringify(form.price));
      fd.append("discount", JSON.stringify(form.discount));
      fd.append("policies", JSON.stringify(form.policies));
      form.amenities.forEach(a => fd.append("amenities[]", a));

      const fileFields = ["thumbnail","frontView","livingRoom","bedRoom","kitchen","washroom","balcony","amenitiesImages","surroundings","otherImages","propertyDocument","ownerIdProof","addressProof","govtLicense","otherDocuments"];
      fileFields.forEach(field => {
        if (files[field]) {
          Array.from(files[field]).forEach(f => fd.append(field, f));
        }
      });

      const url = editId ? `${API}/update/${editId}` : `${API}/add`;
      const method = editId ? "PUT" : "POST";
      const r = await fetch(url, { method, headers: { Authorization: `Bearer ${token}` }, body: fd });
      const d = await r.json();
      if (d.success) {
        showToast(editId ? "Updated!" : "Property Added!");
        setForm(initialForm); setFiles({}); setEditId(null); fetchAll();
      } else {
        showToast(d.message || "Error", "error");
      }
    } catch (err) {
      showToast("Submit failed", "error");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this property?")) return;
    await fetch(`${API}/delete/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    showToast("Deleted"); fetchAll();
  };

  const handleToggle = async (endpoint, id) => {
    await fetch(`${API}/${endpoint}/${id}`, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
    fetchAll();
  };

  const handleEdit = (h) => {
    setEditId(h._id);
    setForm({
      propertyName: h.propertyName || "",
      description: h.description || "",
      shortDescription: h.shortDescription || "",
      starRating: h.starRating || "",
      checkInTime: h.checkInTime || "12:00 PM",
      checkOutTime: h.checkOutTime || "11:00 AM",
      address: h.address || initialForm.address,
      geoLocation: h.geoLocation || initialForm.geoLocation,
      contactDetails: h.contactDetails || initialForm.contactDetails,
      price: h.price || initialForm.price,
      discount: h.discount || initialForm.discount,
      policies: h.policies || initialForm.policies,
      amenities: h.amenities || [],
    });
    setTab("basic");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filtered = houses.filter(h =>
    h.propertyName?.toLowerCase().includes(search.toLowerCase()) ||
    h.propertyId?.toLowerCase().includes(search.toLowerCase())
  );

  const tabs = ["basic","location","contact","pricing","policies","images","documents"];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#0f1117", minHeight: "100vh", color: "#e2e8f0" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      {/* TOAST */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999,
          background: toast.type === "error" ? "#ef4444" : "#10b981",
          color: "#fff", padding: "12px 24px", borderRadius: 10,
          fontWeight: 600, boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          animation: "slideIn 0.3s ease"
        }}>
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { transform: translateX(60px); opacity:0 } to { transform: translateX(0); opacity:1 } }
        @keyframes fadeUp { from { transform: translateY(20px); opacity:0 } to { transform: translateY(0); opacity:1 } }
        input, textarea, select { outline: none; }
        input:focus, textarea:focus, select:focus { border-color: #f59e0b !important; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #1a1d27; } ::-webkit-scrollbar-thumb { background: #f59e0b; border-radius: 3px; }
        .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .row3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
        @media(max-width:768px) { .row, .row3 { grid-template-columns: 1fr; } }
        .tab-btn { padding: 8px 20px; border-radius: 8px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.5px; }
        .tab-btn.active { background: #f59e0b; color: #0f1117; }
        .tab-btn:not(.active) { background: #1e2130; color: #94a3b8; }
        .tab-btn:not(.active):hover { background: #272c3d; color: #e2e8f0; }
        .action-btn { padding: 6px 14px; border-radius: 6px; border: none; cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.2s; }
        .badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
      `}</style>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg, #1a1d27 0%, #13161f 100%)", borderBottom: "1px solid #2a2d3a", padding: "20px 32px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 42, height: 42, background: "#f59e0b", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🏡</div>
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#fff" }}>Vacation House Manager</div>
          <div style={{ fontSize: 12, color: "#64748b" }}>Admin Panel · {houses.length} Properties</div>
        </div>
      </div>

      <div style={{ padding: "24px 32px", maxWidth: 1400, margin: "0 auto" }}>

        {/* ===== ADD/EDIT FORM ===== */}
        <div style={{ background: "#1a1d27", borderRadius: 16, border: "1px solid #2a2d3a", marginBottom: 32, animation: "fadeUp 0.4s ease" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #2a2d3a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: "#fff" }}>
              {editId ? "✏️ Edit Property" : "➕ Add New Property"}
            </div>
            {editId && (
              <button onClick={() => { setEditId(null); setForm(initialForm); setFiles({}); }}
                style={{ padding: "6px 16px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
                Cancel Edit
              </button>
            )}
          </div>

          {/* TABS */}
          <div style={{ padding: "16px 24px", display: "flex", gap: 8, flexWrap: "wrap", borderBottom: "1px solid #2a2d3a" }}>
            {tabs.map(t => (
              <button key={t} className={`tab-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
                {t === "basic" ? "📋 Basic" : t === "location" ? "📍 Location" : t === "contact" ? "📞 Contact" : t === "pricing" ? "💰 Pricing" : t === "policies" ? "📜 Policies" : t === "images" ? "🖼 Images" : "📄 Docs"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ padding: 24 }}>

            {/* BASIC */}
            {tab === "basic" && (
              <div style={{ animation: "fadeUp 0.3s ease" }}>
                <div className="row" style={{ marginBottom: 16 }}>
                  <Field label="Property Name *" required value={form.propertyName} onChange={v => handleInput("propertyName", v)} placeholder="e.g. Sunset Villa Goa" />
                  <Field label="Star Rating" type="number" min={0} max={5} value={form.starRating} onChange={v => handleInput("starRating", v)} placeholder="0-5" />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <Field label="Short Description" value={form.shortDescription} onChange={v => handleInput("shortDescription", v)} placeholder="One line tagline..." />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Description</label>
                  <textarea value={form.description} onChange={e => handleInput("description", e.target.value)}
                    placeholder="Full property description..." rows={4}
                    style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
                </div>
                <div className="row" style={{ marginBottom: 16 }}>
                  <Field label="Check In Time" value={form.checkInTime} onChange={v => handleInput("checkInTime", v)} placeholder="12:00 PM" />
                  <Field label="Check Out Time" value={form.checkOutTime} onChange={v => handleInput("checkOutTime", v)} placeholder="11:00 AM" />
                </div>
                <div>
                  <label style={labelStyle}>Amenities</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8 }}>
                    {AMENITIES_LIST.map(a => (
                      <button key={a} type="button" onClick={() => toggleAmenity(a)}
                        style={{ padding: "7px 16px", borderRadius: 8, border: "1.5px solid", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.2s",
                          background: form.amenities.includes(a) ? "#f59e0b" : "transparent",
                          borderColor: form.amenities.includes(a) ? "#f59e0b" : "#2a2d3a",
                          color: form.amenities.includes(a) ? "#0f1117" : "#94a3b8" }}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* LOCATION */}
            {tab === "location" && (
              <div style={{ animation: "fadeUp 0.3s ease" }}>
                <div className="row" style={{ marginBottom: 16 }}>
                  <Field label="Street" value={form.address.street} onChange={v => handleInput("address.street", v)} placeholder="123, Main Road" />
                  <Field label="Area" value={form.address.area} onChange={v => handleInput("address.area", v)} placeholder="Calangute" />
                </div>
                <div className="row" style={{ marginBottom: 16 }}>
                  <Field label="Landmark" value={form.address.landmark} onChange={v => handleInput("address.landmark", v)} placeholder="Near Beach" />
                  <Field label="Pincode" value={form.address.pincode} onChange={v => handleInput("address.pincode", v)} placeholder="403516" />
                </div>
                <div className="row3" style={{ marginBottom: 16 }}>
                  <Field label="City" value={form.address.city} onChange={v => handleInput("address.city", v)} placeholder="Goa" />
                  <Field label="State" value={form.address.state} onChange={v => handleInput("address.state", v)} placeholder="Goa" />
                  <Field label="Country" value={form.address.country} onChange={v => handleInput("address.country", v)} placeholder="India" />
                </div>
                <div className="row">
                  <Field label="Latitude" value={form.geoLocation.latitude} onChange={v => handleInput("geoLocation.latitude", v)} placeholder="15.4989" />
                  <Field label="Longitude" value={form.geoLocation.longitude} onChange={v => handleInput("geoLocation.longitude", v)} placeholder="73.8278" />
                </div>
              </div>
            )}

            {/* CONTACT */}
            {tab === "contact" && (
              <div style={{ animation: "fadeUp 0.3s ease" }}>
                <div className="row" style={{ marginBottom: 16 }}>
                  <Field label="Owner Name" value={form.contactDetails.ownerName} onChange={v => handleInput("contactDetails.ownerName", v)} placeholder="Ramesh Sharma" />
                  <Field label="Email" type="email" value={form.contactDetails.email} onChange={v => handleInput("contactDetails.email", v)} placeholder="owner@email.com" />
                </div>
                <div className="row">
                  <Field label="Phone" value={form.contactDetails.phone} onChange={v => handleInput("contactDetails.phone", v)} placeholder="+91 98765 43210" />
                  <Field label="Alternate Phone" value={form.contactDetails.alternatePhone} onChange={v => handleInput("contactDetails.alternatePhone", v)} placeholder="+91 91234 56789" />
                </div>
              </div>
            )}

            {/* PRICING */}
            {tab === "pricing" && (
              <div style={{ animation: "fadeUp 0.3s ease" }}>
                <div style={{ marginBottom: 8, color: "#f59e0b", fontSize: 13, fontWeight: 600 }}>💰 Pricing (in ₹)</div>
                <div className="row3" style={{ marginBottom: 16 }}>
                  <Field label="Base Price / Night" type="number" value={form.price.basePrice} onChange={v => handleInput("price.basePrice", v)} placeholder="2500" />
                  <Field label="Weekend Price" type="number" value={form.price.weekendPrice} onChange={v => handleInput("price.weekendPrice", v)} placeholder="3500" />
                  <Field label="Monthly Price" type="number" value={form.price.monthlyPrice} onChange={v => handleInput("price.monthlyPrice", v)} placeholder="45000" />
                </div>
                <div className="row" style={{ marginBottom: 24 }}>
                  <Field label="Cleaning Fee" type="number" value={form.price.cleaningFee} onChange={v => handleInput("price.cleaningFee", v)} placeholder="500" />
                  <Field label="Security Deposit" type="number" value={form.price.securityDeposit} onChange={v => handleInput("price.securityDeposit", v)} placeholder="5000" />
                </div>
                <div style={{ marginBottom: 8, color: "#f59e0b", fontSize: 13, fontWeight: 600 }}>🏷 Discount</div>
                <div className="row">
                  <Field label="Discount %" type="number" value={form.discount.percentage} onChange={v => handleInput("discount.percentage", v)} placeholder="15" />
                  <Field label="Valid Till" type="date" value={form.discount.validTill} onChange={v => handleInput("discount.validTill", v)} />
                </div>
              </div>
            )}

            {/* POLICIES */}
            {tab === "policies" && (
              <div style={{ animation: "fadeUp 0.3s ease" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                  {[
                    ["guestAllowed", "Guests Allowed"],
                    ["unmarriedCouplesAllowed", "Unmarried Couples"],
                    ["petsAllowed", "Pets Allowed"],
                    ["smokingAllowed", "Smoking Allowed"]
                  ].map(([key, label]) => (
                    <div key={key} onClick={() => handleInput(`policies.${key}`, !form.policies[key])}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 10, border: `1.5px solid ${form.policies[key] ? "#10b981" : "#2a2d3a"}`, cursor: "pointer", background: form.policies[key] ? "rgba(16,185,129,0.08)" : "transparent", transition: "all 0.2s" }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, background: form.policies[key] ? "#10b981" : "#2a2d3a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, transition: "all 0.2s" }}>
                        {form.policies[key] ? "✓" : ""}
                      </div>
                      <span style={{ fontWeight: 500, color: form.policies[key] ? "#10b981" : "#64748b", fontSize: 14 }}>{label}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Cancellation Policy</label>
                  <textarea value={form.policies.cancellationPolicy} onChange={e => handleInput("policies.cancellationPolicy", e.target.value)}
                    rows={3} placeholder="e.g. Full refund if cancelled 7 days before check-in..."
                    style={{ ...inputStyle, resize: "vertical" }} />
                </div>
                <div>
                  <label style={labelStyle}>House Rules</label>
                  <textarea value={form.policies.houseRules} onChange={e => handleInput("policies.houseRules", e.target.value)}
                    rows={3} placeholder="e.g. No loud music after 10 PM..."
                    style={{ ...inputStyle, resize: "vertical" }} />
                </div>
              </div>
            )}

            {/* IMAGES */}
            {tab === "images" && (
              <div style={{ animation: "fadeUp 0.3s ease" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[
                    ["thumbnail", "Thumbnail (Main)", 1],
                    ["frontView", "Front View", 10],
                    ["livingRoom", "Living Room", 10],
                    ["bedRoom", "Bedroom", 10],
                    ["kitchen", "Kitchen", 10],
                    ["washroom", "Washroom", 10],
                    ["balcony", "Balcony", 10],
                    ["amenitiesImages", "Amenities Images", 10],
                    ["surroundings", "Surroundings", 10],
                    ["otherImages", "Other Images", 10],
                  ].map(([field, label, max]) => (
                    <FileUploadField key={field} field={field} label={label} max={max} onChange={handleFile} files={files} />
                  ))}
                </div>
              </div>
            )}

            {/* DOCUMENTS */}
            {tab === "documents" && (
              <div style={{ animation: "fadeUp 0.3s ease" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[
                    ["propertyDocument", "Property Document", 5],
                    ["ownerIdProof", "Owner ID Proof", 5],
                    ["addressProof", "Address Proof", 5],
                    ["govtLicense", "Govt License", 5],
                    ["otherDocuments", "Other Documents", 5],
                  ].map(([field, label, max]) => (
                    <FileUploadField key={field} field={field} label={label} max={max} onChange={handleFile} files={files} isDoc />
                  ))}
                </div>
              </div>
            )}

            {/* SUBMIT */}
            <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
              <button type="submit" disabled={loading}
                style={{ padding: "12px 32px", background: loading ? "#4a3a12" : "#f59e0b", color: "#0f1117", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s", fontFamily: "'Syne', sans-serif" }}>
                {loading ? "⏳ Saving..." : editId ? "✅ Update Property" : "🏡 Add Property"}
              </button>
              <button type="button" onClick={() => { setForm(initialForm); setFiles({}); setEditId(null); }}
                style={{ padding: "12px 24px", background: "#1e2130", color: "#94a3b8", border: "1px solid #2a2d3a", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* ===== TABLE ===== */}
        <div style={{ background: "#1a1d27", borderRadius: 16, border: "1px solid #2a2d3a", animation: "fadeUp 0.5s ease" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #2a2d3a", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: "#fff" }}>
              🏘 All Properties <span style={{ fontSize: 14, color: "#64748b", fontFamily: "'DM Sans'" }}>({filtered.length})</span>
            </div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search property..."
              style={{ ...inputStyle, width: 260, margin: 0 }} />
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#13161f" }}>
                  {["Image", "Property", "ID", "City", "Price/Night", "Status", "Featured", "Actions"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#f59e0b", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: "#475569" }}>No properties found</td></tr>
                ) : filtered.map((h, i) => (
                  <tr key={h._id} style={{ borderTop: "1px solid #1e2130", transition: "background 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#1e2130"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "10px 16px" }}>
                      {h.images?.thumbnail ? (
                        <img src={h.images.thumbnail} alt="" style={{ width: 60, height: 44, objectFit: "cover", borderRadius: 8 }} />
                      ) : (
                        <div style={{ width: 60, height: 44, background: "#272c3d", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏡</div>
                      )}
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <div style={{ fontWeight: 600, color: "#e2e8f0", marginBottom: 3 }}>{h.propertyName}</div>
                      <div style={{ color: "#64748b", fontSize: 12 }}>⭐ {h.starRating || 0} · {h.amenities?.length || 0} amenities</div>
                    </td>
                    <td style={{ padding: "10px 16px", color: "#94a3b8", fontFamily: "monospace" }}>{h.propertyId}</td>
                    <td style={{ padding: "10px 16px", color: "#94a3b8" }}>{h.address?.city || "—"}</td>
                    <td style={{ padding: "10px 16px", color: "#10b981", fontWeight: 600 }}>
                      {h.price?.basePrice ? `₹${Number(h.price.basePrice).toLocaleString()}` : "—"}
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <span className="badge" style={{ background: h.isActive ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: h.isActive ? "#10b981" : "#ef4444" }}>
                        {h.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <span className="badge" style={{ background: h.isFeatured ? "rgba(245,158,11,0.15)" : "rgba(100,116,139,0.15)", color: h.isFeatured ? "#f59e0b" : "#64748b" }}>
                        {h.isFeatured ? "⭐ Yes" : "No"}
                      </span>
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <button className="action-btn" onClick={() => setViewData(h)}
                          style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}>👁 View</button>
                        <button className="action-btn" onClick={() => handleEdit(h)}
                          style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>✏️ Edit</button>
                        <button className="action-btn" onClick={() => handleToggle("toggle-active", h._id)}
                          style={{ background: h.isActive ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)", color: h.isActive ? "#ef4444" : "#10b981" }}>
                          {h.isActive ? "⛔" : "✅"}
                        </button>
                        <button className="action-btn" onClick={() => handleToggle("toggle-featured", h._id)}
                          style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>⭐</button>
                        <button className="action-btn" onClick={() => handleDelete(h._id)}
                          style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===== VIEW MODAL ===== */}
      {viewData && <ViewModal data={viewData} onClose={() => setViewData(null)} />}
    </div>
  );
}

/* ====== SUB COMPONENTS ====== */
const labelStyle = { display: "block", marginBottom: 6, fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 };
const inputStyle = { width: "100%", background: "#13161f", border: "1.5px solid #2a2d3a", borderRadius: 8, padding: "10px 14px", color: "#e2e8f0", fontSize: 14, boxSizing: "border-box", transition: "border-color 0.2s", fontFamily: "'DM Sans', sans-serif" };

function Field({ label, value, onChange, type = "text", placeholder, required, min, max }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        required={required} min={min} max={max} style={inputStyle} />
    </div>
  );
}

function FileUploadField({ field, label, max, onChange, files, isDoc }) {
  const count = files[field] ? files[field].length : 0;
  return (
    <div style={{ padding: 16, background: "#13161f", borderRadius: 10, border: "1.5px dashed #2a2d3a", cursor: "pointer" }}>
      <label style={{ ...labelStyle, cursor: "pointer" }}>
        {isDoc ? "📄" : "🖼"} {label} {max > 1 && `(max ${max})`}
        <input type="file" multiple={max > 1} accept={isDoc ? ".pdf,.jpg,.png,.jpeg" : "image/*"}
          onChange={e => onChange(field, e)} style={{ display: "none" }} />
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
        <div style={{ flex: 1, height: 6, background: "#1e2130", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ width: `${(count / max) * 100}%`, height: "100%", background: "#f59e0b", borderRadius: 3, transition: "width 0.3s" }} />
        </div>
        <span style={{ color: count > 0 ? "#10b981" : "#475569", fontSize: 12, fontWeight: 600, minWidth: 50 }}>
          {count > 0 ? `${count} file${count > 1 ? "s" : ""}` : "No files"}
        </span>
      </div>
    </div>
  );
}

function ViewModal({ data: h, onClose }) {
  const section = (title, content) => content && (
    <div style={{ marginBottom: 20 }}>
      <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>{title}</div>
      {content}
    </div>
  );

  const row = (k, v) => v !== undefined && v !== "" && v !== null && (
    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #1e2130", gap: 12 }}>
      <span style={{ color: "#64748b", fontSize: 13 }}>{k}</span>
      <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{String(v)}</span>
    </div>
  );

  const allImages = [
    ...(h.images?.frontView || []),
    ...(h.images?.livingRoom || []),
    ...(h.images?.bedRoom || []),
    ...(h.images?.kitchen || []),
    ...(h.images?.washroom || []),
    ...(h.images?.balcony || []),
    ...(h.images?.surroundings || []),
    ...(h.images?.otherImages || []),
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px 16px", overflowY: "auto" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#1a1d27", borderRadius: 20, border: "1px solid #2a2d3a", width: "100%", maxWidth: 900, animation: "fadeUp 0.3s ease" }}>

        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #2a2d3a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: "#fff" }}>{h.propertyName}</div>
            <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>ID: {h.propertyId} · Added: {new Date(h.createdAt).toLocaleDateString("en-IN")}</div>
          </div>
          <button onClick={onClose} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 10, width: 36, height: 36, cursor: "pointer", fontSize: 18, fontWeight: 700 }}>×</button>
        </div>

        <div style={{ padding: 24 }}>
          {/* Thumbnail + Info */}
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24, marginBottom: 24 }}>
            <div>
              {h.images?.thumbnail ? (
                <img src={h.images.thumbnail} alt="thumbnail" style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 12 }} />
              ) : (
                <div style={{ width: "100%", height: 200, background: "#272c3d", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>🏡</div>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                <span className="badge" style={{ background: h.isActive ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)", color: h.isActive ? "#10b981" : "#ef4444" }}>{h.isActive ? "Active" : "Inactive"}</span>
                <span className="badge" style={{ background: "rgba(99,102,241,0.2)", color: "#818cf8" }}>{h.isApproved ? "Approved" : "Pending"}</span>
                {h.isFeatured && <span className="badge" style={{ background: "rgba(245,158,11,0.2)", color: "#f59e0b" }}>⭐ Featured</span>}
              </div>
            </div>
            <div>
              {section("Basic Info", <>
                {row("Description", h.description)}
                {row("Short Desc", h.shortDescription)}
                {row("Star Rating", h.starRating ? `⭐ ${h.starRating}` : null)}
                {row("Check In", h.checkInTime)}
                {row("Check Out", h.checkOutTime)}
                {row("Total Bookings", h.totalBookings)}
              </>)}
            </div>
          </div>

          {/* Grid sections */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {section("📍 Address", <>
              {row("Street", h.address?.street)}
              {row("Area", h.address?.area)}
              {row("Landmark", h.address?.landmark)}
              {row("City", h.address?.city)}
              {row("State", h.address?.state)}
              {row("Pincode", h.address?.pincode)}
              {row("Country", h.address?.country)}
              {row("Latitude", h.geoLocation?.latitude)}
              {row("Longitude", h.geoLocation?.longitude)}
            </>)}

            <div>
              {section("📞 Contact", <>
                {row("Owner", h.contactDetails?.ownerName)}
                {row("Phone", h.contactDetails?.phone)}
                {row("Alt Phone", h.contactDetails?.alternatePhone)}
                {row("Email", h.contactDetails?.email)}
              </>)}
              {section("💰 Pricing", <>
                {row("Base Price", h.price?.basePrice ? `₹${Number(h.price.basePrice).toLocaleString()}` : null)}
                {row("Weekend", h.price?.weekendPrice ? `₹${Number(h.price.weekendPrice).toLocaleString()}` : null)}
                {row("Monthly", h.price?.monthlyPrice ? `₹${Number(h.price.monthlyPrice).toLocaleString()}` : null)}
                {row("Cleaning Fee", h.price?.cleaningFee ? `₹${h.price.cleaningFee}` : null)}
                {row("Security Deposit", h.price?.securityDeposit ? `₹${h.price.securityDeposit}` : null)}
                {row("Discount", h.discount?.percentage ? `${h.discount.percentage}%` : null)}
              </>)}
            </div>
          </div>

          {h.amenities?.length > 0 && section("🏷 Amenities", (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {h.amenities.map(a => (
                <span key={a} style={{ padding: "5px 14px", background: "rgba(245,158,11,0.1)", color: "#f59e0b", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{a}</span>
              ))}
            </div>
          ))}

          {section("📜 Policies", (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[["Guests Allowed", h.policies?.guestAllowed], ["Unmarried Couples", h.policies?.unmarriedCouplesAllowed], ["Pets", h.policies?.petsAllowed], ["Smoking", h.policies?.smokingAllowed]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#13161f", borderRadius: 8 }}>
                  <span style={{ color: "#94a3b8", fontSize: 13 }}>{k}</span>
                  <span style={{ color: v ? "#10b981" : "#ef4444", fontWeight: 700, fontSize: 13 }}>{v ? "✓ Yes" : "✗ No"}</span>
                </div>
              ))}
            </div>
          ))}

          {(h.policies?.cancellationPolicy || h.policies?.houseRules) && section("📋 Rules & Policy", <>
            {h.policies?.cancellationPolicy && <div style={{ marginBottom: 10 }}><div style={{ color: "#64748b", fontSize: 12, marginBottom: 4 }}>Cancellation Policy</div><div style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.6 }}>{h.policies.cancellationPolicy}</div></div>}
            {h.policies?.houseRules && <div><div style={{ color: "#64748b", fontSize: 12, marginBottom: 4 }}>House Rules</div><div style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.6 }}>{h.policies.houseRules}</div></div>}
          </>)}

          {/* Image Gallery */}
          {allImages.length > 0 && section("🖼 Property Images", (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
              {allImages.map((img, i) => (
                <a key={i} href={img} target="_blank" rel="noreferrer">
                  <img src={img} alt="" style={{ width: "100%", height: 90, objectFit: "cover", borderRadius: 8, transition: "transform 0.2s", cursor: "pointer" }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"} />
                </a>
              ))}
            </div>
          ))}

          {/* Documents */}
          {(h.documents?.propertyDocument?.length > 0 || h.documents?.ownerIdProof?.length > 0 || h.documents?.govtLicense?.length > 0) && section("📄 Documents", (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {["propertyDocument", "ownerIdProof", "addressProof", "govtLicense", "otherDocuments"].map(key =>
                (h.documents?.[key] || []).map((doc, i) => (
                  <a key={`${key}-${i}`} href={doc} target="_blank" rel="noreferrer"
                    style={{ padding: "8px 16px", background: "rgba(99,102,241,0.1)", color: "#818cf8", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none", border: "1px solid rgba(99,102,241,0.2)" }}>
                    📄 {key.replace(/([A-Z])/g, ' $1')} {i + 1}
                  </a>
                ))
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}