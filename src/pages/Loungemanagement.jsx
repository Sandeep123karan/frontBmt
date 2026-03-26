import { useState, useEffect } from "react";

const API = "https://bmtadmin.onrender.com/api/lounge";
const PER_PAGE = 8;

const FACILITIES_LIST = [
  "WiFi", "Shower", "Sleeping Pods", "Buffet", "Bar", "TV", "Newspaper",    
  "Prayer Room", "Smoking Area", "Kids Area", "Conference Room", "Spa",
  "Charging Ports", "Air Conditioning", "Baggage Storage"
];

const initialForm = {
  ownerName: "", companyName: "", email: "", phone: "", password: "",
  gstNumber: "", panNumber: "", businessType: "individual",
  address: "", city: "", state: "", country: "India", pincode: "",
  bankName: "", accountHolderName: "", accountNumber: "", ifscCode: "",
  loungeName: "", airportName: "", terminal: "", location: "",
  openingTime: "06:00", closingTime: "23:00", open24Hours: false,
  price: "", childPrice: "", gst: "", currency: "INR",
  facilities: [],
  foodIncluded: true, drinksIncluded: true, buffet: false,
  entryType: "paid", maxStayHours: "", refundable: false,
  contactNumber: "", contactEmail: "",
  loungeImages: [],
};

export default function LoungeManagement() {
  const [lounges, setLounges] = useState([]);
  const [viewData, setViewData] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("owner");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [editId, setEditId] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => { fetchLounges(); }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchLounges = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/all`);
      const d = await r.json();
      setLounges(d.data || []);
    } catch { showToast("Failed to load lounges", "error"); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFacilityToggle = (val) => {
    setForm(p => ({
      ...p,
      facilities: p.facilities.includes(val)
        ? p.facilities.filter(x => x !== val)
        : [...p.facilities, val]
    }));
  };

  const handleFiles = (e) => {
    setForm(p => ({ ...p, loungeImages: Array.from(e.target.files) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let options;
      if (!editId) {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => {
          if (k === "loungeImages") v.forEach(f => fd.append("loungeImages", f));
          else if (Array.isArray(v)) v.forEach(i => fd.append(k, i));
          else if (v !== null && v !== undefined) fd.append(k, v);
        });
        options = { method: "POST", body: fd };
      } else {
        const body = { ...form };
        delete body.loungeImages;
        options = { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
      }

      const r = await fetch(editId ? `${API}/update/${editId}` : `${API}/add`, options);
      const d = await r.json();
      if (d.success) {
        showToast(editId ? "Lounge updated!" : "Lounge submitted for approval!");
        setForm(initialForm); setEditId(null); setActiveTab("owner");
        fetchLounges();
      } else showToast(d.message || "Error occurred", "error");
    } catch { showToast("Submission failed", "error"); }
    finally { setSubmitting(false); }
  };

  const handleApprove = async (id) => {
    try {
      await fetch(`${API}/approve/${id}`, { method: "PUT" });
      showToast("Lounge approved ✓");
      fetchLounges();
    } catch { showToast("Failed to approve", "error"); }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this lounge?")) return;
    try {
      await fetch(`${API}/reject/${id}`, { method: "PUT" });
      showToast("Lounge rejected", "error");
      fetchLounges();
    } catch { showToast("Failed to reject", "error"); }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/delete/${id}`, { method: "DELETE" });
      showToast("Deleted successfully");
      setDeleteModal(null);
      fetchLounges();
    } catch { showToast("Delete failed", "error"); }
  };

  const handleEdit = (lounge) => {
    setForm({ ...initialForm, ...lounge, loungeImages: [], password: "" });
    setEditId(lounge._id);
    setActiveTab("owner");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filtered = lounges.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = l.loungeName?.toLowerCase().includes(q) ||
      l.airportName?.toLowerCase().includes(q) ||
      l.ownerName?.toLowerCase().includes(q) ||
      l.city?.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => { setPage(1); }, [search, filterStatus]);

  const tabs = [
    { id: "owner", label: "👤 Owner", icon: "👤" },
    { id: "business", label: "🏢 Business", icon: "🏢" },
    { id: "lounge", label: "🛋️ Lounge", icon: "🛋️" },
    { id: "pricing", label: "💰 Pricing", icon: "💰" },
    { id: "facilities", label: "✨ Facilities", icon: "✨" },
    { id: "bank", label: "🏦 Bank", icon: "🏦" },
    { id: "media", label: "🖼️ Media", icon: "🖼️" },
  ];

  const statusStyle = (s) => ({
    approved: { bg: "rgba(0,200,83,0.1)", border: "#00c853", color: "#00c853", label: "APPROVED" },
    rejected: { bg: "rgba(255,23,68,0.1)", border: "#ff1744", color: "#ff1744", label: "REJECTED" },
    pending: { bg: "rgba(255,145,0,0.1)", border: "#ff9100", color: "#ff9100", label: "PENDING" },
  }[s] || { bg: "#1e1e2e", border: "#555", color: "#888", label: s?.toUpperCase() });

  const stats = [
    { label: "Total", val: lounges.length, color: "#818cf8" },
    { label: "Approved", val: lounges.filter(l => l.status === "approved").length, color: "#00c853" },
    { label: "Pending", val: lounges.filter(l => l.status === "pending").length, color: "#ff9100" },
    { label: "Rejected", val: lounges.filter(l => l.status === "rejected").length, color: "#ff1744" },
  ];

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: "#07070d", minHeight: "100vh", color: "#e2e2ef" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes toastIn { from { opacity:0; transform:translateX(60px); } to { opacity:1; transform:translateX(0); } }
        * { box-sizing: border-box; }
        input, select, textarea { outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
        input:focus, select:focus, textarea:focus { border-color: #818cf8 !important; box-shadow: 0 0 0 3px rgba(129,140,248,0.12) !important; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #07070d; }
        ::-webkit-scrollbar-thumb { background: #1e1e2e; border-radius: 4px; }
        .row-hover:hover { background: rgba(129,140,248,0.04) !important; }
        .pill-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
        .page-btn:hover:not(:disabled) { background: rgba(129,140,248,0.15) !important; color: #818cf8 !important; }
        .action-btn:hover { transform: scale(0.93); opacity: 0.85; }
        .tab-item:hover { color: #c4c4e0 !important; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999,
          padding: "13px 20px", borderRadius: 10, fontSize: 13, fontWeight: 500,
          background: toast.type === "error" ? "#1a0808" : "#081a0f",
          border: `1px solid ${toast.type === "error" ? "#ff1744" : "#00c853"}`,
          color: toast.type === "error" ? "#ff6b6b" : "#4ade80",
          boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
          animation: "toastIn 0.3s ease"
        }}>
          {toast.type === "error" ? "✗ " : "✓ "}{toast.msg}
        </div>
      )}

      {/* Delete Modal */}
      {viewData && (
  <div style={{
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.9)",
    zIndex: 9999,
    overflow: "auto",
    padding: 40
  }}>
    <div style={{
      maxWidth: 900,
      margin: "auto",
      background: "#0f0f1a",
      border: "1px solid #1e1e30",
      borderRadius: 18,
      padding: 30
    }}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}>
        <h2 style={{margin:0,color:"#818cf8"}}>👁 Lounge Details</h2>
        <button onClick={()=>setViewData(null)}
          style={{background:"red",border:"none",padding:"6px 12px",borderRadius:6,color:"#fff"}}>
          X
        </button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>
        <Info label="Lounge Name" value={viewData.loungeName}/>
        <Info label="Airport" value={viewData.airportName}/>
        <Info label="Owner" value={viewData.ownerName}/>
        <Info label="Phone" value={viewData.phone}/>
        <Info label="Email" value={viewData.email}/>
        <Info label="City" value={viewData.city}/>
        <Info label="State" value={viewData.state}/>
        <Info label="Price" value={`₹${viewData.price}`}/>
        <Info label="GST" value={`${viewData.gst}%`}/>
        <Info label="Entry Type" value={viewData.entryType}/>
        <Info label="Opening" value={viewData.openingTime}/>
        <Info label="Closing" value={viewData.closingTime}/>
        <Info label="Max Stay" value={viewData.maxStayHours}/>
        <Info label="Status" value={viewData.status}/>
      </div>

      {/* Facilities */}
      {viewData.facilities?.length > 0 && (
        <div style={{marginTop:20}}>
          <h4 style={{color:"#818cf8"}}>Facilities</h4>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {viewData.facilities.map(f=>(
              <span key={f}
              style={{background:"#1e1e30",padding:"4px 10px",borderRadius:6,fontSize:12}}>
                {f}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
)}
      {deleteModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#0f0f1a", border: "1px solid #1e1e30", borderRadius: 18, padding: "40px 36px", maxWidth: 380, width: "100%", textAlign: "center", animation: "fadeUp 0.25s ease" }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>🗑️</div>
            <h3 style={{ margin: "0 0 8px", fontFamily: "'Syne', sans-serif", fontSize: 20, color: "#ff6b6b" }}>Delete Lounge?</h3>
            <p style={{ color: "#555", margin: "0 0 28px", fontSize: 13, lineHeight: 1.6 }}>This will permanently remove the lounge and all its data. This cannot be undone.</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => setDeleteModal(null)} style={{ padding: "10px 24px", background: "#1a1a28", border: "1px solid #2a2a3e", borderRadius: 8, color: "#888", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500 }}>Cancel</button>
              <button onClick={() => handleDelete(deleteModal)} style={{ padding: "10px 24px", background: "#ff1744", border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "32px 20px" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #818cf8, #c084fc)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>🛋️</div>
            <div>
              <h1 style={{ margin: 0, fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg, #e2e2ef, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Lounge Management</h1>
              <p style={{ margin: 0, color: "#444", fontSize: 13, marginTop: 2 }}>Manage airport lounges, approvals & listings</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {stats.map(s => (
              <div key={s.label} style={{ background: "#0f0f1a", border: "1px solid #1a1a28", borderRadius: 12, padding: "14px 22px", minWidth: 110 }}>
                <div style={{ fontSize: 26, fontWeight: 700, color: s.color, fontFamily: "'Syne', sans-serif" }}>{s.val}</div>
                <div style={{ fontSize: 12, color: "#444", marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FORM CARD */}
        <div style={{ background: "#0f0f1a", border: "1px solid #1a1a28", borderRadius: 18, marginBottom: 36, overflow: "hidden", animation: "fadeUp 0.4s ease" }}>

          {/* Form Header */}
          <div style={{ padding: "18px 28px", borderBottom: "1px solid #1a1a28", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0c0c16" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>{editId ? "✏️" : "➕"}</span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16 }}>{editId ? "Edit Lounge" : "Add New Lounge"}</span>
            </div>
            {editId && (
              <button onClick={() => { setForm(initialForm); setEditId(null); setActiveTab("owner"); }}
                style={{ padding: "7px 16px", background: "#1a1a28", border: "1px solid #2a2a3e", borderRadius: 8, color: "#888", cursor: "pointer", fontSize: 12, fontFamily: "'Outfit', sans-serif", fontWeight: 500 }}>
                ✕ Cancel Edit
              </button>
            )}
          </div>

          {/* Tab Nav */}
          <div style={{ display: "flex", overflowX: "auto", borderBottom: "1px solid #1a1a28", background: "#0c0c16", padding: "0 20px", gap: 2 }}>
            {tabs.map(t => (
              <button key={t.id} className="tab-item" onClick={() => setActiveTab(t.id)}
                style={{
                  padding: "13px 18px", background: "transparent", border: "none",
                  borderBottom: activeTab === t.id ? "2px solid #818cf8" : "2px solid transparent",
                  color: activeTab === t.id ? "#818cf8" : "#555",
                  cursor: "pointer", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap",
                  fontFamily: "'Outfit', sans-serif", transition: "color 0.2s"
                }}>
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ padding: "28px" }}>

              {/* OWNER */}
              {activeTab === "owner" && (
                <FGrid>
                  <FField label="Owner Name *"><FInput name="ownerName" value={form.ownerName} onChange={handleChange} placeholder="Full legal name" required /></FField>
                  <FField label="Email *"><FInput type="email" name="email" value={form.email} onChange={handleChange} placeholder="owner@email.com" required /></FField>
                  <FField label="Phone *"><FInput name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" required /></FField>
                  {!editId && <FField label="Password"><FInput type="password" name="password" value={form.password} onChange={handleChange} placeholder="Set login password" /></FField>}
                  <FField label="Contact Number"><FInput name="contactNumber" value={form.contactNumber} onChange={handleChange} placeholder="Lounge contact number" /></FField>
                  <FField label="Contact Email"><FInput name="contactEmail" value={form.contactEmail} onChange={handleChange} placeholder="lounge@email.com" /></FField>
                </FGrid>
              )}

              {/* BUSINESS */}
              {activeTab === "business" && (
                <FGrid>
                  <FField label="Company Name"><FInput name="companyName" value={form.companyName} onChange={handleChange} placeholder="ABC Hospitality Pvt Ltd" /></FField>
                  <FField label="Business Type">
                    <FSelect name="businessType" value={form.businessType} onChange={handleChange}>
                      <option value="individual">Individual</option>
                      <option value="private-limited">Private Limited</option>
                      <option value="partnership">Partnership</option>
                    </FSelect>
                  </FField>
                  <FField label="GST Number"><FInput name="gstNumber" value={form.gstNumber} onChange={handleChange} placeholder="27AAPFU0939F1ZV" /></FField>
                  <FField label="PAN Number"><FInput name="panNumber" value={form.panNumber} onChange={handleChange} placeholder="AAPFU0939F" /></FField>
                  <FField label="Address" full><FTextArea name="address" value={form.address} onChange={handleChange} placeholder="Full business address" rows={2} /></FField>
                  <FField label="City"><FInput name="city" value={form.city} onChange={handleChange} placeholder="Mumbai" /></FField>
                  <FField label="State"><FInput name="state" value={form.state} onChange={handleChange} placeholder="Maharashtra" /></FField>
                  <FField label="Country"><FInput name="country" value={form.country} onChange={handleChange} placeholder="India" /></FField>
                  <FField label="Pincode"><FInput name="pincode" value={form.pincode} onChange={handleChange} placeholder="400001" /></FField>
                </FGrid>
              )}

              {/* LOUNGE */}
              {activeTab === "lounge" && (
                <FGrid>
                  <FField label="Lounge Name *"><FInput name="loungeName" value={form.loungeName} onChange={handleChange} placeholder="IndiGo Travel Lounge" required /></FField>
                  <FField label="Airport Name *"><FInput name="airportName" value={form.airportName} onChange={handleChange} placeholder="Chhatrapati Shivaji International Airport" required /></FField>
                  <FField label="Terminal"><FInput name="terminal" value={form.terminal} onChange={handleChange} placeholder="Terminal 2" /></FField>
                  <FField label="Location in Airport"><FInput name="location" value={form.location} onChange={handleChange} placeholder="Near Gate 12, Level 3" /></FField>
                  <FField label="Opening Time"><FInput type="time" name="openingTime" value={form.openingTime} onChange={handleChange} /></FField>
                  <FField label="Closing Time"><FInput type="time" name="closingTime" value={form.closingTime} onChange={handleChange} /></FField>
                  <FField label="Max Stay (Hours)"><FInput type="number" name="maxStayHours" value={form.maxStayHours} onChange={handleChange} placeholder="3" /></FField>
                  <FField label="Entry Type">
                    <FSelect name="entryType" value={form.entryType} onChange={handleChange}>
                      <option value="paid">Paid</option>
                      <option value="free-with-card">Free with Card</option>
                      <option value="membership">Membership</option>
                    </FSelect>
                  </FField>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 20, gridColumn: "1/-1", marginTop: 6 }}>
                    {[["open24Hours", "Open 24 Hours"], ["refundable", "Refundable Booking"]].map(([key, label]) => (
                      <ToggleCheck key={key} label={label} checked={form[key]} onChange={() => setForm(p => ({ ...p, [key]: !p[key] }))} />
                    ))}
                  </div>
                </FGrid>
              )}

              {/* PRICING */}
              {activeTab === "pricing" && (
                <FGrid>
                  <FField label="Adult Price (₹)"><FInput type="number" name="price" value={form.price} onChange={handleChange} placeholder="1500" /></FField>
                  <FField label="Child Price (₹)"><FInput type="number" name="childPrice" value={form.childPrice} onChange={handleChange} placeholder="750" /></FField>
                  <FField label="GST (%)"><FInput type="number" name="gst" value={form.gst} onChange={handleChange} placeholder="18" /></FField>
                  <FField label="Currency">
                    <FSelect name="currency" value={form.currency} onChange={handleChange}>
                      {["INR","USD","EUR","GBP","AED","SGD"].map(c => <option key={c}>{c}</option>)}
                    </FSelect>
                  </FField>
                </FGrid>
              )}

              {/* FACILITIES */}
              {activeTab === "facilities" && (
                <div>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 12, color: "#555", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 }}>Select Facilities</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {FACILITIES_LIST.map(f => {
                        const on = form.facilities.includes(f);
                        return (
                          <div key={f} onClick={() => handleFacilityToggle(f)}
                            className="pill-btn"
                            style={{ padding: "8px 16px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontWeight: 500, transition: "all 0.2s", userSelect: "none", border: `1px solid ${on ? "#818cf8" : "#1e1e30"}`, background: on ? "rgba(129,140,248,0.15)" : "#0c0c16", color: on ? "#a5b4fc" : "#555" }}>
                            {on && "✓ "}{f}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginTop: 8 }}>
                    {[["foodIncluded", "🍽️ Food Included"], ["drinksIncluded", "🥤 Drinks Included"], ["buffet", "🍱 Buffet Available"]].map(([key, label]) => (
                      <ToggleCheck key={key} label={label} checked={form[key]} onChange={() => setForm(p => ({ ...p, [key]: !p[key] }))} />
                    ))}
                  </div>
                </div>
              )}

              {/* BANK */}
              {activeTab === "bank" && (
                <FGrid>
                  <FField label="Bank Name"><FInput name="bankName" value={form.bankName} onChange={handleChange} placeholder="State Bank of India" /></FField>
                  <FField label="Account Holder Name"><FInput name="accountHolderName" value={form.accountHolderName} onChange={handleChange} placeholder="Full name as per bank" /></FField>
                  <FField label="Account Number"><FInput name="accountNumber" value={form.accountNumber} onChange={handleChange} placeholder="XXXX XXXX XXXX" /></FField>
                  <FField label="IFSC Code"><FInput name="ifscCode" value={form.ifscCode} onChange={handleChange} placeholder="SBIN0001234" /></FField>
                </FGrid>
              )}

              {/* MEDIA */}
              {activeTab === "media" && (
                <div>
                  <FField label="Lounge Images (max 10)">
                    <div style={{ border: "2px dashed #1e1e30", borderRadius: 12, padding: 30, textAlign: "center", position: "relative", cursor: "pointer", transition: "border-color 0.2s", background: "#0c0c16" }}>
                      <input type="file" name="loungeImages" onChange={handleFiles} accept="image/*" multiple style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
                      {form.loungeImages.length > 0 ? (
                        <div>
                          <div style={{ fontSize: 36, marginBottom: 8 }}>🖼️</div>
                          <div style={{ color: "#4ade80", fontSize: 14, fontWeight: 500 }}>✓ {form.loungeImages.length} image(s) selected</div>
                          <div style={{ color: "#444", fontSize: 12, marginTop: 4 }}>{form.loungeImages.map(f => f.name).join(", ")}</div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize: 40, marginBottom: 10 }}>📸</div>
                          <div style={{ color: "#444", fontSize: 14 }}>Click or drag & drop lounge images</div>
                          <div style={{ color: "#333", fontSize: 12, marginTop: 4 }}>PNG, JPG up to 10 files</div>
                        </div>
                      )}
                    </div>
                  </FField>
                </div>
              )}
            </div>

            <div style={{ padding: "16px 28px", borderTop: "1px solid #1a1a28", display: "flex", gap: 10, justifyContent: "flex-end", background: "#0c0c16" }}>
              <button type="button" onClick={() => { setForm(initialForm); setEditId(null); setActiveTab("owner"); }}
                style={{ padding: "10px 22px", background: "#1a1a28", border: "1px solid #2a2a3e", borderRadius: 8, color: "#777", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "'Outfit', sans-serif" }}>
                Reset
              </button>
              <button type="submit" disabled={submitting}
                style={{ padding: "10px 26px", background: submitting ? "#444" : "linear-gradient(135deg, #818cf8, #c084fc)", border: "none", borderRadius: 8, color: "#fff", cursor: submitting ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'Outfit', sans-serif", transition: "opacity 0.2s" }}>
                {submitting ? "Saving..." : editId ? "Update Lounge" : "Submit for Approval"}
              </button>
            </div>
          </form>
        </div>

        {/* TABLE CARD */}
        <div style={{ background: "#0f0f1a", border: "1px solid #1a1a28", borderRadius: 18, overflow: "hidden", animation: "fadeUp 0.5s ease" }}>

          {/* Table Header */}
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #1a1a28", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, background: "#0c0c16" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16 }}>
              All Lounges <span style={{ color: "#444", fontSize: 13, fontWeight: 400 }}>({filtered.length} results)</span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search lounge, airport, city..."
                style={{ padding: "8px 14px", background: "#07070d", border: "1px solid #1e1e30", borderRadius: 8, color: "#e2e2ef", fontSize: 13, fontFamily: "'Outfit', sans-serif", width: 230 }} />
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                style={{ padding: "8px 14px", background: "#07070d", border: "1px solid #1e1e30", borderRadius: 8, color: "#e2e2ef", fontSize: 13, fontFamily: "'Outfit', sans-serif", cursor: "pointer" }}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <button onClick={fetchLounges}
                style={{ padding: "8px 14px", background: "#1a1a28", border: "1px solid #2a2a3e", borderRadius: 8, color: "#777", cursor: "pointer", fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>
                ↺
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#0a0a12", borderBottom: "1px solid #1a1a28" }}>
                  {["#", "Lounge / Airport", "Owner", "Location", "Timing", "Price", "Entry", "Status", "Actions"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#444", fontWeight: 600, fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase", whiteSpace: "nowrap", fontFamily: "'Syne', sans-serif" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} style={{ padding: 60, textAlign: "center", color: "#333" }}>
                    <div style={{ fontSize: 32, marginBottom: 10 }}>⏳</div>Loading lounges...
                  </td></tr>
                ) : paginated.length === 0 ? (
                  <tr><td colSpan={9} style={{ padding: 60, textAlign: "center", color: "#333" }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>🛋️</div>No lounges found
                  </td></tr>
                ) : paginated.map((l, i) => {
                  const st = statusStyle(l.status);
                  const rowNum = (page - 1) * PER_PAGE + i + 1;
                  return (
                    <>
                      <tr key={l._id} className="row-hover"
                        style={{ borderBottom: "1px solid #12121e", cursor: "pointer", transition: "background 0.15s" }}
                        onClick={() => setExpandedRow(expandedRow === l._id ? null : l._id)}>
                        <td style={{ padding: "14px 16px", color: "#333", fontWeight: 600 }}>{rowNum}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ fontWeight: 600, color: "#e2e2ef" }}>{l.loungeName}</div>
                          <div style={{ fontSize: 11, color: "#444", marginTop: 3 }}>✈ {l.airportName}</div>
                          {l.terminal && <div style={{ fontSize: 11, color: "#333", marginTop: 1 }}>{l.terminal}</div>}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ color: "#c4c4e0" }}>{l.ownerName}</div>
                          <div style={{ fontSize: 11, color: "#444", marginTop: 2 }}>{l.phone}</div>
                        </td>
                        <td style={{ padding: "14px 16px", color: "#666" }}>
                          {[l.city, l.state].filter(Boolean).join(", ") || "—"}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          {l.open24Hours ? (
                            <span style={{ color: "#818cf8", fontSize: 12 }}>🕐 24 Hours</span>
                          ) : (
                            <span style={{ color: "#666", fontSize: 12 }}>{l.openingTime || "—"} – {l.closingTime || "—"}</span>
                          )}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          {l.price ? <span style={{ color: "#4ade80", fontWeight: 600 }}>₹{l.price.toLocaleString()}</span> : <span style={{ color: "#333" }}>—</span>}
                          {l.gst ? <div style={{ fontSize: 11, color: "#444" }}>+{l.gst}% GST</div> : null}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ fontSize: 11, color: "#818cf8", background: "rgba(129,140,248,0.1)", border: "1px solid rgba(129,140,248,0.2)", borderRadius: 4, padding: "2px 8px" }}>
                            {l.entryType?.replace("-", " ").toUpperCase() || "PAID"}
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 12, background: st.bg, border: `1px solid ${st.border}`, color: st.color }}>
                            {st.label}
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px" }} onClick={e => e.stopPropagation()}>
                          <div style={{ display: "flex", gap: 5 }}>
                            {l.status === "pending" && (
                              <>
                                <ABtn color="#00c853" onClick={() => handleApprove(l._id)} title="Approve">✓</ABtn>
                                <ABtn color="#ff1744" onClick={() => handleReject(l._id)} title="Reject">✗</ABtn>
                              </>
                            )}
                            <ABtn color="#38bdf8" onClick={() => setViewData(l)} title="View">👁</ABtn>
                            <ABtn color="#818cf8" onClick={() => handleEdit(l)} title="Edit">✎</ABtn>
                            <ABtn color="#f87171" onClick={() => setDeleteModal(l._id)} title="Delete">🗑</ABtn>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Row */}
                      {expandedRow === l._id && (
                        <tr key={`exp-${l._id}`} style={{ borderBottom: "1px solid #12121e", background: "#0a0a12" }}>
                          <td colSpan={9} style={{ padding: "20px 24px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10, marginBottom: 14 }}>
                              {[
                                ["📍 Location", l.location],
                                ["✉️ Email", l.email],
                                ["📧 Contact Email", l.contactEmail],
                                ["📞 Contact", l.contactNumber],
                                ["🏦 Bank", l.bankName],
                                ["🆔 GST", l.gstNumber],
                                ["💳 PAN", l.panNumber],
                                ["⏱️ Max Stay", l.maxStayHours ? `${l.maxStayHours} hrs` : null],
                                ["💱 Currency", l.currency],
                                ["⭐ Rating", l.rating ? `${l.rating}/5 (${l.reviews} reviews)` : null],
                                ["🍽️ Food", l.foodIncluded ? "Included" : "Not included"],
                                ["🥤 Drinks", l.drinksIncluded ? "Included" : "Not included"],
                                ["🍱 Buffet", l.buffet ? "Available" : "Not available"],
                                ["💰 Child Price", l.childPrice ? `₹${l.childPrice}` : null],
                                ["↩️ Refundable", l.refundable ? "Yes" : "No"],
                              ].filter(([, v]) => v !== null && v !== undefined && v !== "").map(([label, val]) => (
                                <div key={label} style={{ background: "#0f0f1a", border: "1px solid #1a1a28", borderRadius: 8, padding: "10px 13px" }}>
                                  <div style={{ fontSize: 11, color: "#444", marginBottom: 4 }}>{label}</div>
                                  <div style={{ fontSize: 12, color: "#aaa" }}>{val}</div>
                                </div>
                              ))}
                            </div>
                            {l.facilities?.length > 0 && (
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                {l.facilities.map(f => (
                                  <span key={f} style={{ fontSize: 11, color: "#818cf8", background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.15)", borderRadius: 4, padding: "2px 8px" }}>{f}</span>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ padding: "16px 24px", borderTop: "1px solid #1a1a28", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, background: "#0c0c16" }}>
              <div style={{ fontSize: 13, color: "#444" }}>
                Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} lounges
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <PBtn disabled={page === 1} onClick={() => setPage(1)}>«</PBtn>
                <PBtn disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</PBtn>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, idx) =>
                    p === "..." ? (
                      <span key={`dots-${idx}`} style={{ color: "#444", padding: "0 6px", fontSize: 13 }}>•••</span>
                    ) : (
                      <PBtn key={p} active={page === p} onClick={() => setPage(p)}>{p}</PBtn>
                    )
                  )}
                <PBtn disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</PBtn>
                <PBtn disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</PBtn>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ======= HELPER COMPONENTS ======= */
function Info({label,value}) {
  return (
    <div style={{background:"#07070d",padding:12,borderRadius:8}}>
      <div style={{fontSize:11,color:"#666"}}>{label}</div>
      <div style={{fontSize:14,color:"#fff",marginTop:3}}>{value || "-"}</div>
    </div>
  )
}

function FGrid({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 18 }}>{children}</div>;
}

function FField({ label, children, full }) {
  return (
    <div style={full ? { gridColumn: "1/-1" } : {}}>
      <label style={{ display: "block", fontSize: 11, color: "#555", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 7 }}>{label}</label>
      {children}
    </div>
  );
}

function FInput(props) {
  return <input {...props} style={{ width: "100%", padding: "9px 12px", background: "#07070d", border: "1px solid #1e1e30", borderRadius: 8, color: "#e2e2ef", fontSize: 13, fontFamily: "'Outfit', sans-serif", boxSizing: "border-box", ...props.style }} />;
}

function FSelect({ children, ...props }) {
  return <select {...props} style={{ width: "100%", padding: "9px 12px", background: "#07070d", border: "1px solid #1e1e30", borderRadius: 8, color: "#e2e2ef", fontSize: 13, fontFamily: "'Outfit', sans-serif", cursor: "pointer", boxSizing: "border-box" }}>{children}</select>;
}

function FTextArea(props) {
  return <textarea {...props} style={{ width: "100%", padding: "9px 12px", background: "#07070d", border: "1px solid #1e1e30", borderRadius: 8, color: "#e2e2ef", fontSize: 13, fontFamily: "'Outfit', sans-serif", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box", ...props.style }} />;
}

function ToggleCheck({ label, checked, onChange }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13, color: checked ? "#a5b4fc" : "#777", userSelect: "none" }}>
      <div onClick={onChange} style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${checked ? "#818cf8" : "#2a2a3e"}`, background: checked ? "#818cf8" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s", cursor: "pointer" }}>
        {checked && <span style={{ color: "#fff", fontSize: 11, lineHeight: 1 }}>✓</span>}
      </div>
      {label}
    </label>
  );
}

function ABtn({ color, onClick, children, title }) {
  return (
    <button className="action-btn" onClick={onClick} title={title}
      style={{ width: 30, height: 30, borderRadius: 7, background: `${color}18`, border: `1px solid ${color}35`, color, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s", fontFamily: "'Outfit', sans-serif" }}>
      {children}
    </button>
  );
}

function PBtn({ children, onClick, disabled, active }) {
  return (
    <button className="page-btn" onClick={onClick} disabled={disabled}
      style={{ minWidth: 34, height: 34, borderRadius: 8, border: active ? "1px solid #818cf8" : "1px solid #1e1e30", background: active ? "rgba(129,140,248,0.15)" : "#0c0c16", color: active ? "#818cf8" : disabled ? "#2a2a3e" : "#777", cursor: disabled ? "not-allowed" : "pointer", fontSize: 13, fontWeight: active ? 600 : 400, fontFamily: "'Outfit', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
      {children}
    </button>
  );
}