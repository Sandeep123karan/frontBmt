import { useState, useEffect } from "react";

const API = "http://localhost:9000/api/guesthouses";
const PER_PAGE = 8;

const AMENITIES_LIST = [
  "WiFi", "AC", "TV", "Parking", "Hot Water", "Room Service", "Laundry",
  "Kitchen", "CCTV", "Power Backup", "Geyser", "Refrigerator", "Intercom",
  "Lift", "Security", "Garden", "Terrace"
];

const ROOM_TYPES = ["Single", "Double", "Triple", "Deluxe", "Suite", "Dormitory"];
const BED_TYPES = ["Single Bed", "Double Bed", "Twin Bed", "King Bed", "Queen Bed", "Bunk Bed"];

const emptyRoom = { roomType: "", price: "", capacity: "", bedType: "", totalRoom: "", availableRoom: "" };

const initialForm = {
  propertyId: "", propertyName: "", propertyType: "Guest House",
  ownerName: "", ownerPhone: "", ownerEmail: "",
  aadharNumber: "", panNumber: "", gstNumber: "",
  vendorId: "", vendorName: "", vendorPhone: "", vendorEmail: "",
  address: "", landmark: "", city: "", state: "", country: "India",
  pincode: "", latitude: "", longitude: "", googleMapLink: "",
  totalRooms: "", availableRooms: "", basePrice: "", extraBedPrice: "", tax: "",
  amenities: [], foodAvailable: false, foodType: "",
  checkInTime: "14:00", checkOutTime: "11:00",
  description: "", propertyRules: "",
  status: "pending", isActive: true, isFeatured: false, addedBy: "admin",
  roomDetails: [{ ...emptyRoom }],
};

export default function GuestHouseManagement() {
  const [houses, setHouses] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [editId, setEditId] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [statusModal, setStatusModal] = useState(null);
  const [verifyModal, setVerifyModal] = useState(null);

  useEffect(() => { fetchAll(); }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/all`);
      const d = await r.json();
      setHouses(d.data || []);
    } catch { showToast("Failed to load data", "error"); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleAmenity = (val) => {
    setForm(p => ({
      ...p,
      amenities: p.amenities.includes(val) ? p.amenities.filter(x => x !== val) : [...p.amenities, val]
    }));
  };

  const handleRoomChange = (idx, field, val) => {
    setForm(p => {
      const rooms = [...p.roomDetails];
      rooms[idx] = { ...rooms[idx], [field]: val };
      return { ...p, roomDetails: rooms };
    });
  };

  const addRoom = () => setForm(p => ({ ...p, roomDetails: [...p.roomDetails, { ...emptyRoom }] }));
  const removeRoom = (idx) => setForm(p => ({ ...p, roomDetails: p.roomDetails.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form };
      const method = editId ? "PUT" : "POST";
      const url = editId ? `${API}/update/${editId}` : `${API}/add`;
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await r.json();
      if (d.success) {
        showToast(editId ? "Updated successfully!" : "Guest house added!");
        setForm(initialForm); setEditId(null); setActiveTab("basic");
        fetchAll();
      } else showToast(d.message || "Something went wrong", "error");
    } catch { showToast("Submission failed", "error"); }
    finally { setSubmitting(false); }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const r = await fetch(`${API}/status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const d = await r.json();
      if (d.success) { showToast(`Status set to ${status}`); fetchAll(); }
    } catch { showToast("Status update failed", "error"); }
    setStatusModal(null);
  };

  const handleVerify = async (id, verificationStatus) => {
    try {
      const r = await fetch(`${API}/verify-owner/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationStatus, verifiedBy: "admin" })
      });
      const d = await r.json();
      if (d.success) { showToast(`Owner ${verificationStatus}`); fetchAll(); }
    } catch { showToast("Verification failed", "error"); }
    setVerifyModal(null);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/delete/${id}`, { method: "DELETE" });
      showToast("Deleted successfully");
      setDeleteModal(null);
      fetchAll();
    } catch { showToast("Delete failed", "error"); }
  };

  const handleEdit = (h) => {
    const { ownerDocuments = {}, ...rest } = h;
    setForm({
      ...initialForm, ...rest,
      aadharNumber: ownerDocuments.aadharNumber || "",
      panNumber: ownerDocuments.panNumber || "",
      gstNumber: ownerDocuments.gstNumber || "",
      roomDetails: h.roomDetails?.length ? h.roomDetails : [{ ...emptyRoom }],
    });
    setEditId(h._id);
    setActiveTab("basic");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filtered = houses.filter(h => {
    const q = search.toLowerCase();
    const match = h.propertyName?.toLowerCase().includes(q) ||
      h.propertyId?.toLowerCase().includes(q) ||
      h.ownerName?.toLowerCase().includes(q) ||
      h.city?.toLowerCase().includes(q);
    const s = filterStatus === "all" || h.status === filterStatus;
    return match && s;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  useEffect(() => setPage(1), [search, filterStatus]);

  const tabs = [
    { id: "basic", label: "🏠 Basic" },
    { id: "owner", label: "👤 Owner & KYC" },
    { id: "location", label: "📍 Location" },
    { id: "rooms", label: "🛏 Rooms" },
    { id: "pricing", label: "💰 Pricing" },
    { id: "amenities", label: "✨ Amenities" },
    { id: "info", label: "📋 Info" },
  ];

  const sColor = (s) => ({
    approved: { c: "#4ade80", bg: "rgba(74,222,128,0.08)", b: "rgba(74,222,128,0.25)" },
    rejected: { c: "#f87171", bg: "rgba(248,113,113,0.08)", b: "rgba(248,113,113,0.25)" },
    pending: { c: "#fbbf24", bg: "rgba(251,191,36,0.08)", b: "rgba(251,191,36,0.25)" },
  }[s] || { c: "#888", bg: "#1a1a28", b: "#333" });

  const stats = [
    { label: "Total", val: houses.length, c: "#7c3aed" },
    { label: "Approved", val: houses.filter(h => h.status === "approved").length, c: "#4ade80" },
    { label: "Pending", val: houses.filter(h => h.status === "pending").length, c: "#fbbf24" },
    { label: "Rejected", val: houses.filter(h => h.status === "rejected").length, c: "#f87171" },
    { label: "Featured", val: houses.filter(h => h.isFeatured).length, c: "#38bdf8" },
  ];

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#06060e", minHeight: "100vh", color: "#ddd8f0" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,700;1,600&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes up { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
        @keyframes tin { from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)} }
        @keyframes min { from{opacity:0;transform:scale(0.94)}to{opacity:1;transform:scale(1)} }
        *{box-sizing:border-box}
        input,select,textarea{outline:none;transition:border-color .2s,box-shadow .2s}
        input:focus,select:focus,textarea:focus{border-color:#7c3aed!important;box-shadow:0 0 0 3px rgba(124,58,237,0.13)!important}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#06060e}
        ::-webkit-scrollbar-thumb{background:#1c1c2e;border-radius:4px}
        .rh:hover{background:rgba(124,58,237,0.04)!important}
        .ph:hover:not(:disabled){background:rgba(124,58,237,0.12)!important;color:#a78bfa!important}
        .ah:hover{transform:scale(0.92);opacity:0.8}
        .pill:hover{transform:translateY(-1px)}
        .tab:hover{color:#c4b5fd!important}
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed",top:18,right:18,zIndex:9999,padding:"12px 20px",borderRadius:10,fontSize:13,fontWeight:500,background:toast.type==="error"?"#170a0a":"#0a1708",border:`1px solid ${toast.type==="error"?"#f87171":"#4ade80"}`,color:toast.type==="error"?"#f87171":"#4ade80",boxShadow:"0 16px 48px rgba(0,0,0,0.7)",animation:"tin 0.28s ease" }}>
          {toast.type==="error"?"✗ ":"✓ "}{toast.msg}
        </div>
      )}

      {/* VIEW MODAL */}
      {viewData && <ViewModal data={viewData} onClose={() => setViewData(null)} sColor={sColor} />}

      {/* STATUS MODAL */}
      {statusModal && (
        <Modal onClose={() => setStatusModal(null)}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:44,marginBottom:14 }}>🔄</div>
            <h3 style={{ margin:"0 0 6px",fontFamily:"'Fraunces',serif",color:"#ddd8f0" }}>Update Status</h3>
            <p style={{ color:"#555",fontSize:13,margin:"0 0 24px" }}>Choose new status for this property</p>
            <div style={{ display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap" }}>
              {["pending","approved","rejected"].map(s => {
                const sc = sColor(s);
                return <button key={s} onClick={() => handleStatusUpdate(statusModal, s)} style={{ padding:"9px 22px",borderRadius:8,border:`1px solid ${sc.b}`,background:sc.bg,color:sc.c,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:600,textTransform:"capitalize" }}>{s}</button>;
              })}
            </div>
          </div>
        </Modal>
      )}

      {/* VERIFY MODAL */}
      {verifyModal && (
        <Modal onClose={() => setVerifyModal(null)}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:44,marginBottom:14 }}>📋</div>
            <h3 style={{ margin:"0 0 6px",fontFamily:"'Fraunces',serif",color:"#ddd8f0" }}>Owner KYC Verification</h3>
            <p style={{ color:"#555",fontSize:13,margin:"0 0 24px" }}>Update owner document verification status</p>
            <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
              <button onClick={() => handleVerify(verifyModal,"verified")} style={{ padding:"9px 22px",borderRadius:8,border:"1px solid rgba(74,222,128,0.3)",background:"rgba(74,222,128,0.08)",color:"#4ade80",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:600 }}>✓ Verify</button>
              <button onClick={() => handleVerify(verifyModal,"rejected")} style={{ padding:"9px 22px",borderRadius:8,border:"1px solid rgba(248,113,113,0.3)",background:"rgba(248,113,113,0.08)",color:"#f87171",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:600 }}>✗ Reject</button>
            </div>
          </div>
        </Modal>
      )}

      {/* DELETE MODAL */}
      {deleteModal && (
        <Modal onClose={() => setDeleteModal(null)}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:48,marginBottom:14 }}>🗑️</div>
            <h3 style={{ margin:"0 0 8px",fontFamily:"'Fraunces',serif",color:"#f87171" }}>Delete Guest House?</h3>
            <p style={{ color:"#555",margin:"0 0 26px",fontSize:13,lineHeight:1.6 }}>This will permanently remove the property and all its data.</p>
            <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
              <button onClick={() => setDeleteModal(null)} style={{ padding:"9px 22px",background:"#141422",border:"1px solid #1e1e30",borderRadius:8,color:"#888",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13 }}>Cancel</button>
              <button onClick={() => handleDelete(deleteModal)} style={{ padding:"9px 22px",background:"#f87171",border:"none",borderRadius:8,color:"#fff",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:600 }}>Delete</button>
            </div>
          </div>
        </Modal>
      )}

      <div style={{ maxWidth:1460,margin:"0 auto",padding:"30px 18px" }}>

        {/* HEADER */}
        <div style={{ marginBottom:30 }}>
          <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:18 }}>
            <div style={{ width:50,height:50,borderRadius:14,background:"linear-gradient(135deg,#7c3aed,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0 }}>🏡</div>
            <div>
              <h1 style={{ margin:0,fontFamily:"'Fraunces',serif",fontSize:30,fontWeight:700,color:"#ddd8f0" }}>Guest House Management</h1>
              <p style={{ margin:0,color:"#3d3d55",fontSize:13,marginTop:3 }}>Add, manage and verify guest house properties</p>
            </div>
          </div>
          <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
            {stats.map(s => (
              <div key={s.label} style={{ background:"#0e0e1c",border:"1px solid #18182a",borderRadius:12,padding:"13px 20px",minWidth:100 }}>
                <div style={{ fontSize:24,fontWeight:700,color:s.c,fontFamily:"'Fraunces',serif" }}>{s.val}</div>
                <div style={{ fontSize:12,color:"#3d3d55",marginTop:3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FORM */}
        <div style={{ background:"#0e0e1c",border:"1px solid #18182a",borderRadius:18,marginBottom:32,overflow:"hidden",animation:"up 0.35s ease" }}>
          <div style={{ padding:"17px 26px",borderBottom:"1px solid #18182a",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#0b0b17" }}>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <span style={{ fontSize:18 }}>{editId?"✏️":"➕"}</span>
              <span style={{ fontFamily:"'Fraunces',serif",fontWeight:700,fontSize:17 }}>{editId?"Edit Guest House":"Add New Guest House"}</span>
            </div>
            {editId && (
              <button onClick={() => { setForm(initialForm); setEditId(null); setActiveTab("basic"); }}
                style={{ padding:"7px 16px",background:"#141422",border:"1px solid #1e1e30",borderRadius:8,color:"#666",cursor:"pointer",fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                ✕ Cancel
              </button>
            )}
          </div>

          {/* Tabs */}
          <div style={{ display:"flex",overflowX:"auto",background:"#0b0b17",borderBottom:"1px solid #18182a",padding:"0 18px",gap:2 }}>
            {tabs.map(t => (
              <button key={t.id} className="tab" onClick={() => setActiveTab(t.id)}
                style={{ padding:"12px 16px",background:"transparent",border:"none",borderBottom:activeTab===t.id?"2px solid #7c3aed":"2px solid transparent",color:activeTab===t.id?"#a78bfa":"#3d3d55",cursor:"pointer",fontSize:13,fontWeight:500,whiteSpace:"nowrap",fontFamily:"'Plus Jakarta Sans',sans-serif",transition:"color 0.2s" }}>
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ padding:"26px" }}>

              {activeTab === "basic" && (
                <FG>
                  <FF label="Property ID *"><FI name="propertyId" value={form.propertyId} onChange={handleChange} placeholder="GH-2024-001" required /></FF>
                  <FF label="Property Name *"><FI name="propertyName" value={form.propertyName} onChange={handleChange} placeholder="Shanti Guest House" required /></FF>
                  <FF label="Property Type"><FS name="propertyType" value={form.propertyType} onChange={handleChange}><option>Guest House</option><option>Lodge</option><option>Dormitory</option><option>Hostel</option><option>Homestay</option></FS></FF>
                  <FF label="Status"><FS name="status" value={form.status} onChange={handleChange}><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></FS></FF>
                  <FF label="Added By"><FI name="addedBy" value={form.addedBy} onChange={handleChange} placeholder="admin" /></FF>
                  <div style={{ gridColumn:"1/-1",display:"flex",flexWrap:"wrap",gap:22,marginTop:4 }}>
                    {[["isActive","🟢 Active Property"],["isFeatured","⭐ Featured"]].map(([k,l]) => (
                      <TC key={k} label={l} checked={form[k]} onChange={() => setForm(p=>({...p,[k]:!p[k]}))} />
                    ))}
                  </div>
                </FG>
              )}

              {activeTab === "owner" && (
                <FG>
                  <FF label="Owner Name *"><FI name="ownerName" value={form.ownerName} onChange={handleChange} placeholder="Ramesh Kumar" required /></FF>
                  <FF label="Owner Phone"><FI name="ownerPhone" value={form.ownerPhone} onChange={handleChange} placeholder="+91 98765 43210" /></FF>
                  <FF label="Owner Email"><FI type="email" name="ownerEmail" value={form.ownerEmail} onChange={handleChange} placeholder="owner@email.com" /></FF>
                  <div style={{ gridColumn:"1/-1",height:1,background:"#18182a",margin:"6px 0" }} />
                  <div style={{ gridColumn:"1/-1" }}><SL>KYC Documents</SL></div>
                  <FF label="Aadhar Number"><FI name="aadharNumber" value={form.aadharNumber} onChange={handleChange} placeholder="XXXX XXXX XXXX" /></FF>
                  <FF label="PAN Number"><FI name="panNumber" value={form.panNumber} onChange={handleChange} placeholder="ABCDE1234F" /></FF>
                  <FF label="GST Number"><FI name="gstNumber" value={form.gstNumber} onChange={handleChange} placeholder="27AAPFU0939F1ZV" /></FF>
                </FG>
              )}

              {/* {activeTab === "vendor" && (
                <FG>
                  <FF label="Vendor ID"><FI name="vendorId" value={form.vendorId} onChange={handleChange} placeholder="VND001" /></FF>
                  <FF label="Vendor Name"><FI name="vendorName" value={form.vendorName} onChange={handleChange} placeholder="Travel Partner Name" /></FF>
                  <FF label="Vendor Phone"><FI name="vendorPhone" value={form.vendorPhone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" /></FF>
                  <FF label="Vendor Email"><FI type="email" name="vendorEmail" value={form.vendorEmail} onChange={handleChange} placeholder="vendor@email.com" /></FF>
                </FG>
              )} */}

              {activeTab === "location" && (
                <FG>
                  <FF label="Full Address *" full><FTA name="address" value={form.address} onChange={handleChange} placeholder="House No, Street, Area..." rows={2} required /></FF>
                  <FF label="Landmark"><FI name="landmark" value={form.landmark} onChange={handleChange} placeholder="Near Railway Station" /></FF>
                  <FF label="City *"><FI name="city" value={form.city} onChange={handleChange} placeholder="Varanasi" required /></FF>
                  <FF label="State"><FI name="state" value={form.state} onChange={handleChange} placeholder="Uttar Pradesh" /></FF>
                  <FF label="Country"><FI name="country" value={form.country} onChange={handleChange} placeholder="India" /></FF>
                  <FF label="Pincode"><FI name="pincode" value={form.pincode} onChange={handleChange} placeholder="221001" /></FF>
                  <FF label="Latitude"><FI name="latitude" value={form.latitude} onChange={handleChange} placeholder="25.3176" /></FF>
                  <FF label="Longitude"><FI name="longitude" value={form.longitude} onChange={handleChange} placeholder="82.9739" /></FF>
                  <FF label="Google Map Link" full><FI name="googleMapLink" value={form.googleMapLink} onChange={handleChange} placeholder="https://maps.google.com/..." /></FF>
                </FG>
              )}

              {activeTab === "rooms" && (
                <div>
                  <FG>
                    <FF label="Total Rooms"><FI type="number" name="totalRooms" value={form.totalRooms} onChange={handleChange} placeholder="20" /></FF>
                    <FF label="Available Rooms"><FI type="number" name="availableRooms" value={form.availableRooms} onChange={handleChange} placeholder="15" /></FF>
                    <FF label="Check-In Time"><FI type="time" name="checkInTime" value={form.checkInTime} onChange={handleChange} /></FF>
                    <FF label="Check-Out Time"><FI type="time" name="checkOutTime" value={form.checkOutTime} onChange={handleChange} /></FF>
                  </FG>
                  <div style={{ marginTop:22 }}>
                    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
                      <SL>Room Types</SL>
                      <button type="button" onClick={addRoom} style={{ padding:"6px 16px",background:"rgba(124,58,237,0.12)",border:"1px solid rgba(124,58,237,0.3)",borderRadius:8,color:"#a78bfa",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif" }}>+ Add Room Type</button>
                    </div>
                    {form.roomDetails.map((r, idx) => (
                      <div key={idx} style={{ background:"#0b0b17",border:"1px solid #18182a",borderRadius:12,padding:18,marginBottom:12,position:"relative" }}>
                        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
                          <span style={{ fontSize:13,fontWeight:600,color:"#7c3aed" }}>Room Type {idx+1}</span>
                          {form.roomDetails.length > 1 && (
                            <button type="button" onClick={() => removeRoom(idx)} style={{ background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:6,color:"#f87171",cursor:"pointer",padding:"3px 10px",fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Remove</button>
                          )}
                        </div>
                        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12 }}>
                          <div>
                            <label style={{ display:"block",fontSize:11,color:"#3d3d55",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6 }}>Room Type</label>
                            <select value={r.roomType} onChange={e => handleRoomChange(idx,"roomType",e.target.value)} style={{ width:"100%",padding:"8px 10px",background:"#06060e",border:"1px solid #1e1e30",borderRadius:8,color:"#ddd8f0",fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",cursor:"pointer" }}>
                              <option value="">Select</option>
                              {ROOM_TYPES.map(rt => <option key={rt}>{rt}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={{ display:"block",fontSize:11,color:"#3d3d55",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6 }}>Bed Type</label>
                            <select value={r.bedType} onChange={e => handleRoomChange(idx,"bedType",e.target.value)} style={{ width:"100%",padding:"8px 10px",background:"#06060e",border:"1px solid #1e1e30",borderRadius:8,color:"#ddd8f0",fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",cursor:"pointer" }}>
                              <option value="">Select</option>
                              {BED_TYPES.map(bt => <option key={bt}>{bt}</option>)}
                            </select>
                          </div>
                          {[["price","Price (₹)","2500"],["capacity","Max Capacity","2"],["totalRoom","Total Rooms","5"],["availableRoom","Available","3"]].map(([f,l,p]) => (
                            <div key={f}>
                              <label style={{ display:"block",fontSize:11,color:"#3d3d55",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6 }}>{l}</label>
                              <input type="number" value={r[f]} onChange={e => handleRoomChange(idx,f,e.target.value)} placeholder={p}
                                style={{ width:"100%",padding:"8px 10px",background:"#06060e",border:"1px solid #1e1e30",borderRadius:8,color:"#ddd8f0",fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",boxSizing:"border-box" }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "pricing" && (
                <FG>
                  <FF label="Base Price (₹)"><FI type="number" name="basePrice" value={form.basePrice} onChange={handleChange} placeholder="1200" /></FF>
                  <FF label="Extra Bed Price (₹)"><FI type="number" name="extraBedPrice" value={form.extraBedPrice} onChange={handleChange} placeholder="300" /></FF>
                  <FF label="Tax (%)"><FI type="number" name="tax" value={form.tax} onChange={handleChange} placeholder="12" /></FF>
                </FG>
              )}

              {activeTab === "amenities" && (
                <div>
                  <SL>Select Amenities</SL>
                  <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginTop:14 }}>
                    {AMENITIES_LIST.map(a => {
                      const on = form.amenities.includes(a);
                      return (
                        <div key={a} className="pill" onClick={() => handleAmenity(a)}
                          style={{ padding:"7px 15px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:500,transition:"all 0.2s",userSelect:"none",border:`1px solid ${on?"#7c3aed":"#1e1e30"}`,background:on?"rgba(124,58,237,0.14)":"#0b0b17",color:on?"#a78bfa":"#3d3d55" }}>
                          {on&&"✓ "}{a}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop:22,display:"flex",flexWrap:"wrap",gap:22 }}>
                    <TC label="🍽️ Food Available" checked={form.foodAvailable} onChange={() => setForm(p=>({...p,foodAvailable:!p.foodAvailable}))} />
                  </div>
                  {form.foodAvailable && (
                    <div style={{ marginTop:16,maxWidth:280 }}>
                      <FF label="Food Type"><FS name="foodType" value={form.foodType} onChange={handleChange}><option value="">Select</option><option>Veg Only</option><option>Non-Veg</option><option>Both</option><option>Jain Food</option></FS></FF>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "info" && (
                <FG>
                  <FF label="Description" full><FTA name="description" value={form.description} onChange={handleChange} placeholder="Describe the property, nearby attractions, what makes it special..." rows={4} /></FF>
                  <FF label="Property Rules" full><FTA name="propertyRules" value={form.propertyRules} onChange={handleChange} placeholder="No smoking, No pets, Checkout by 11 AM..." rows={3} /></FF>
                </FG>
              )}
            </div>

            <div style={{ padding:"15px 26px",borderTop:"1px solid #18182a",display:"flex",gap:10,justifyContent:"flex-end",background:"#0b0b17" }}>
              <button type="button" onClick={() => { setForm(initialForm); setEditId(null); setActiveTab("basic"); }}
                style={{ padding:"9px 22px",background:"#141422",border:"1px solid #1e1e30",borderRadius:8,color:"#666",cursor:"pointer",fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                Reset
              </button>
              <button type="submit" disabled={submitting}
                style={{ padding:"9px 26px",background:submitting?"#333":"linear-gradient(135deg,#7c3aed,#a855f7)",border:"none",borderRadius:8,color:"#fff",cursor:submitting?"not-allowed":"pointer",fontSize:13,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif",opacity:submitting?0.7:1 }}>
                {submitting?"Saving...":editId?"Update Guest House":"Add Guest House"}
              </button>
            </div>
          </form>
        </div>

        {/* TABLE */}
        <div style={{ background:"#0e0e1c",border:"1px solid #18182a",borderRadius:18,overflow:"hidden",animation:"up 0.45s ease" }}>
          <div style={{ padding:"17px 22px",borderBottom:"1px solid #18182a",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,background:"#0b0b17" }}>
            <div style={{ fontFamily:"'Fraunces',serif",fontWeight:700,fontSize:17 }}>
              All Properties <span style={{ color:"#3d3d55",fontSize:13,fontWeight:400 }}>({filtered.length})</span>
            </div>
            <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search name, ID, city, owner..."
                style={{ padding:"8px 14px",background:"#06060e",border:"1px solid #1e1e30",borderRadius:8,color:"#ddd8f0",fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",width:240 }} />
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                style={{ padding:"8px 12px",background:"#06060e",border:"1px solid #1e1e30",borderRadius:8,color:"#ddd8f0",fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",cursor:"pointer" }}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <button onClick={fetchAll} style={{ padding:"8px 14px",background:"#141422",border:"1px solid #1e1e30",borderRadius:8,color:"#666",cursor:"pointer",fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif" }}>↺</button>
            </div>
          </div>

          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
              <thead>
                <tr style={{ background:"#09091a",borderBottom:"1px solid #18182a" }}>
                  {["#","Property","Owner","Location","Rooms","Price","Status","KYC","Actions"].map(h => (
                    <th key={h} style={{ padding:"11px 14px",textAlign:"left",color:"#3d3d55",fontWeight:600,fontSize:11,letterSpacing:"0.07em",textTransform:"uppercase",whiteSpace:"nowrap",fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} style={{ padding:60,textAlign:"center",color:"#2a2a40" }}>
                    <div style={{ fontSize:36,marginBottom:10 }}>⏳</div>Loading properties...
                  </td></tr>
                ) : paginated.length === 0 ? (
                  <tr><td colSpan={9} style={{ padding:60,textAlign:"center",color:"#2a2a40" }}>
                    <div style={{ fontSize:40,marginBottom:10 }}>🏡</div>No guest houses found
                  </td></tr>
                ) : paginated.map((h, i) => {
                  const sc = sColor(h.status);
                  const ksc = sColor(h.ownerDocuments?.verificationStatus || "pending");
                  return (
                    <tr key={h._id} className="rh" style={{ borderBottom:"1px solid #10101e",transition:"background 0.15s" }}>
                      <td style={{ padding:"13px 14px",color:"#2a2a40",fontWeight:600 }}>{(page-1)*PER_PAGE+i+1}</td>
                      <td style={{ padding:"13px 14px" }}>
                        <div style={{ fontWeight:600,color:"#ddd8f0" }}>{h.propertyName}</div>
                        <div style={{ fontSize:11,color:"#7c3aed",marginTop:2 }}>{h.propertyId}</div>
                        <div style={{ display:"flex",gap:4,marginTop:4,flexWrap:"wrap" }}>
                          {h.isFeatured && <span style={{ fontSize:10,color:"#38bdf8",border:"1px solid rgba(56,189,248,0.3)",borderRadius:3,padding:"1px 5px" }}>FEATURED</span>}
                          {h.isActive && <span style={{ fontSize:10,color:"#4ade80",border:"1px solid rgba(74,222,128,0.3)",borderRadius:3,padding:"1px 5px" }}>ACTIVE</span>}
                        </div>
                      </td>
                      <td style={{ padding:"13px 14px" }}>
                        <div style={{ color:"#c4b5fd" }}>{h.ownerName}</div>
                        <div style={{ fontSize:11,color:"#3d3d55",marginTop:2 }}>{h.ownerPhone}</div>
                      </td>
                      <td style={{ padding:"13px 14px",color:"#555" }}>
                        <div>{h.city}{h.state?`, ${h.state}`:""}</div>
                        {h.landmark && <div style={{ fontSize:11,color:"#3d3d55",marginTop:1 }}>{h.landmark}</div>}
                      </td>
                      <td style={{ padding:"13px 14px" }}>
                        <div style={{ color:"#c4b5fd",fontWeight:600 }}>{h.totalRooms || "—"}</div>
                        {h.availableRooms !== undefined && <div style={{ fontSize:11,color:"#4ade80",marginTop:1 }}>{h.availableRooms} avail</div>}
                      </td>
                      <td style={{ padding:"13px 14px" }}>
                        {h.basePrice ? <span style={{ color:"#4ade80",fontWeight:600 }}>₹{h.basePrice.toLocaleString()}</span> : <span style={{ color:"#2a2a40" }}>—</span>}
                        {h.tax ? <div style={{ fontSize:11,color:"#3d3d55" }}>+{h.tax}% tax</div> : null}
                      </td>
                      <td style={{ padding:"13px 14px" }}>
                        <span style={{ fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:12,background:sc.bg,border:`1px solid ${sc.b}`,color:sc.c }}>
                          {h.status?.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding:"13px 14px" }}>
                        <span style={{ fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:12,background:ksc.bg,border:`1px solid ${ksc.b}`,color:ksc.c }}>
                          {(h.ownerDocuments?.verificationStatus || "pending").toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding:"13px 14px" }}>
                        <div style={{ display:"flex",gap:5,flexWrap:"nowrap" }}>
                          <AB color="#38bdf8" onClick={() => setViewData(h)} title="View">👁</AB>
                          <AB color="#7c3aed" onClick={() => handleEdit(h)} title="Edit">✎</AB>
                          <AB color="#fbbf24" onClick={() => setStatusModal(h._id)} title="Status">⚡</AB>
                          <AB color="#a78bfa" onClick={() => setVerifyModal(h._id)} title="KYC">📋</AB>
                          <AB color="#f87171" onClick={() => setDeleteModal(h._id)} title="Delete">🗑</AB>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div style={{ padding:"14px 22px",borderTop:"1px solid #18182a",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,background:"#0b0b17" }}>
              <div style={{ fontSize:13,color:"#3d3d55" }}>
                Showing {Math.min((page-1)*PER_PAGE+1,filtered.length)}–{Math.min(page*PER_PAGE,filtered.length)} of {filtered.length}
              </div>
              <div style={{ display:"flex",gap:5,alignItems:"center" }}>
                <PB disabled={page===1} onClick={() => setPage(1)}>«</PB>
                <PB disabled={page===1} onClick={() => setPage(p=>p-1)}>‹</PB>
                {Array.from({length:totalPages},(_,i)=>i+1)
                  .filter(p=>p===1||p===totalPages||Math.abs(p-page)<=1)
                  .reduce((acc,p,idx,arr)=>{if(idx>0&&p-arr[idx-1]>1)acc.push("...");acc.push(p);return acc;},[])
                  .map((p,idx)=> p==="..."
                    ? <span key={`d${idx}`} style={{ color:"#3d3d55",padding:"0 4px",fontSize:13 }}>•••</span>
                    : <PB key={p} active={page===p} onClick={()=>setPage(p)}>{p}</PB>
                  )}
                <PB disabled={page===totalPages} onClick={() => setPage(p=>p+1)}>›</PB>
                <PB disabled={page===totalPages} onClick={() => setPage(totalPages)}>»</PB>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===== VIEW MODAL ===== */
function ViewModal({ data: h, onClose, sColor }) {
  const sc = sColor(h.status);
  const ksc = sColor(h.ownerDocuments?.verificationStatus || "pending");
  const Section = ({ title, items }) => (
    <div style={{ marginBottom:20 }}>
      <div style={{ fontSize:11,color:"#7c3aed",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:12,paddingBottom:6,borderBottom:"1px solid #18182a" }}>{title}</div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10 }}>
        {items.filter(([,v])=>v!==null&&v!==undefined&&v!=="").map(([l,v])=>(
          <div key={l} style={{ background:"#06060e",border:"1px solid #18182a",borderRadius:8,padding:"10px 13px" }}>
            <div style={{ fontSize:11,color:"#3d3d55",marginBottom:4 }}>{l}</div>
            <div style={{ fontSize:13,color:"#c4b5fd",wordBreak:"break-all" }}>{String(v)}</div>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",zIndex:9990,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"20px",overflowY:"auto" }}>
      <div style={{ background:"#0e0e1c",border:"1px solid #18182a",borderRadius:18,width:"100%",maxWidth:860,animation:"min 0.3s ease",marginTop:10,marginBottom:10 }}>
        {/* Header */}
        <div style={{ padding:"18px 24px",borderBottom:"1px solid #18182a",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#0b0b17",borderRadius:"18px 18px 0 0" }}>
          <div>
            <div style={{ fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:700,color:"#ddd8f0" }}>{h.propertyName}</div>
            <div style={{ fontSize:12,color:"#7c3aed",marginTop:2 }}>{h.propertyId} • {h.propertyType}</div>
          </div>
          <div style={{ display:"flex",gap:8,alignItems:"center" }}>
            <span style={{ fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:12,background:sc.bg,border:`1px solid ${sc.b}`,color:sc.c }}>{h.status?.toUpperCase()}</span>
            <button onClick={onClose} style={{ width:32,height:32,borderRadius:8,background:"#141422",border:"1px solid #1e1e30",color:"#666",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Plus Jakarta Sans',sans-serif" }}>✕</button>
          </div>
        </div>
        <div style={{ padding:"24px" }}>
          <Section title="🏠 Basic Info" items={[
            ["Property Type",h.propertyType],["Status",h.status],
            ["Active",h.isActive?"Yes":"No"],["Featured",h.isFeatured?"Yes":"No"],
            ["Added By",h.addedBy],["Created",h.createdAt?new Date(h.createdAt).toLocaleDateString():null]
          ]} />
          <Section title="👤 Owner" items={[
            ["Name",h.ownerName],["Phone",h.ownerPhone],["Email",h.ownerEmail]
          ]} />
          <Section title="📋 KYC Documents" items={[
            ["Aadhar",h.ownerDocuments?.aadharNumber],["PAN",h.ownerDocuments?.panNumber],
            ["GST",h.ownerDocuments?.gstNumber],
            ["Verification",h.ownerDocuments?.verificationStatus],
            ["Verified By",h.ownerDocuments?.verifiedBy],
            ["Verification Date",h.ownerDocuments?.verificationDate?new Date(h.ownerDocuments.verificationDate).toLocaleDateString():null]
          ]} />
          <Section title="🤝 Vendor" items={[
            ["Vendor ID",h.vendorId],["Name",h.vendorName],["Phone",h.vendorPhone],["Email",h.vendorEmail]
          ]} />
          <Section title="📍 Location" items={[
            ["Address",h.address],["Landmark",h.landmark],["City",h.city],
            ["State",h.state],["Country",h.country],["Pincode",h.pincode],
            ["Lat",h.latitude],["Long",h.longitude]
          ]} />
          <Section title="🛏 Room & Pricing" items={[
            ["Total Rooms",h.totalRooms],["Available",h.availableRooms],
            ["Base Price",h.basePrice?`₹${h.basePrice}`:null],["Extra Bed",h.extraBedPrice?`₹${h.extraBedPrice}`:null],
            ["Tax",h.tax?`${h.tax}%`:null],["Check-In",h.checkInTime],["Check-Out",h.checkOutTime]
          ]} />
          {h.roomDetails?.length>0 && (
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11,color:"#7c3aed",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:12,paddingBottom:6,borderBottom:"1px solid #18182a" }}>🛏 Room Types</div>
              <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                {h.roomDetails.map((r,i)=>(
                  <div key={i} style={{ background:"#06060e",border:"1px solid #18182a",borderRadius:10,padding:"12px 16px",display:"flex",flexWrap:"wrap",gap:16 }}>
                    <div><div style={{ fontSize:11,color:"#3d3d55" }}>Type</div><div style={{ fontSize:13,color:"#c4b5fd",marginTop:2 }}>{r.roomType||"—"}</div></div>
                    <div><div style={{ fontSize:11,color:"#3d3d55" }}>Bed</div><div style={{ fontSize:13,color:"#c4b5fd",marginTop:2 }}>{r.bedType||"—"}</div></div>
                    <div><div style={{ fontSize:11,color:"#3d3d55" }}>Price</div><div style={{ fontSize:13,color:"#4ade80",fontWeight:600,marginTop:2 }}>₹{r.price||"—"}</div></div>
                    <div><div style={{ fontSize:11,color:"#3d3d55" }}>Capacity</div><div style={{ fontSize:13,color:"#c4b5fd",marginTop:2 }}>{r.capacity||"—"} guests</div></div>
                    <div><div style={{ fontSize:11,color:"#3d3d55" }}>Rooms</div><div style={{ fontSize:13,color:"#c4b5fd",marginTop:2 }}>{r.availableRoom||0}/{r.totalRoom||0}</div></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {h.amenities?.length>0 && (
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11,color:"#7c3aed",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:12,paddingBottom:6,borderBottom:"1px solid #18182a" }}>✨ Amenities</div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                {h.amenities.map(a=><span key={a} style={{ fontSize:12,color:"#a78bfa",background:"rgba(124,58,237,0.1)",border:"1px solid rgba(124,58,237,0.2)",borderRadius:5,padding:"3px 10px" }}>{a}</span>)}
              </div>
            </div>
          )}
          {h.description && (
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11,color:"#7c3aed",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10,paddingBottom:6,borderBottom:"1px solid #18182a" }}>📝 Description</div>
              <p style={{ color:"#555",fontSize:13,lineHeight:1.7,margin:0 }}>{h.description}</p>
            </div>
          )}
          {h.propertyRules && (
            <div>
              <div style={{ fontSize:11,color:"#7c3aed",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10,paddingBottom:6,borderBottom:"1px solid #18182a" }}>📌 Property Rules</div>
              <p style={{ color:"#555",fontSize:13,lineHeight:1.7,margin:0 }}>{h.propertyRules}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===== SMALL COMPONENTS ===== */
function Modal({ children, onClose }) {
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:9995,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
      <div style={{ background:"#0e0e1c",border:"1px solid #18182a",borderRadius:18,padding:"36px 32px",maxWidth:400,width:"100%",animation:"min 0.25s ease",position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute",top:14,right:14,width:28,height:28,borderRadius:7,background:"#141422",border:"1px solid #1e1e30",color:"#555",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Plus Jakarta Sans',sans-serif" }}>✕</button>
        {children}
      </div>
    </div>
  );
}

function FG({ children }) {
  return <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:18 }}>{children}</div>;
}
function FF({ label, children, full }) {
  return (
    <div style={full?{gridColumn:"1/-1"}:{}}>
      <label style={{ display:"block",fontSize:11,color:"#3d3d55",fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:7 }}>{label}</label>
      {children}
    </div>
  );
}
function FI(props) {
  return <input {...props} style={{ width:"100%",padding:"9px 11px",background:"#06060e",border:"1px solid #1e1e30",borderRadius:8,color:"#ddd8f0",fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",boxSizing:"border-box",...props.style }} />;
}
function FS({ children, ...props }) {
  return <select {...props} style={{ width:"100%",padding:"9px 11px",background:"#06060e",border:"1px solid #1e1e30",borderRadius:8,color:"#ddd8f0",fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",cursor:"pointer",boxSizing:"border-box" }}>{children}</select>;
}
function FTA(props) {
  return <textarea {...props} style={{ width:"100%",padding:"9px 11px",background:"#06060e",border:"1px solid #1e1e30",borderRadius:8,color:"#ddd8f0",fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",resize:"vertical",lineHeight:1.6,boxSizing:"border-box",...props.style }} />;
}
function TC({ label, checked, onChange }) {
  return (
    <label style={{ display:"flex",alignItems:"center",gap:9,cursor:"pointer",fontSize:13,color:checked?"#a78bfa":"#555",userSelect:"none" }}>
      <div onClick={onChange} style={{ width:20,height:20,borderRadius:5,border:`2px solid ${checked?"#7c3aed":"#1e1e30"}`,background:checked?"#7c3aed":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s",cursor:"pointer" }}>
        {checked&&<span style={{ color:"#fff",fontSize:11 }}>✓</span>}
      </div>
      {label}
    </label>
  );
}
function SL({ children }) {
  return <div style={{ fontSize:11,color:"#3d3d55",fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase" }}>{children}</div>;
}
function AB({ color, onClick, children, title }) {
  return (
    <button className="ah" onClick={onClick} title={title}
      style={{ width:30,height:30,borderRadius:7,background:`${color}18`,border:`1px solid ${color}30`,color,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.15s",fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      {children}
    </button>
  );
}
function PB({ children, onClick, disabled, active }) {
  return (
    <button className="ph" onClick={onClick} disabled={disabled}
      style={{ minWidth:34,height:34,borderRadius:8,border:active?"1px solid #7c3aed":"1px solid #1e1e30",background:active?"rgba(124,58,237,0.14)":"#0b0b17",color:active?"#a78bfa":disabled?"#1e1e30":"#555",cursor:disabled?"not-allowed":"pointer",fontSize:13,fontWeight:active?600:400,fontFamily:"'Plus Jakarta Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s" }}>
      {children}
    </button>
  );
}