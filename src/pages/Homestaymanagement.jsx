import { useState, useEffect } from "react";

const API = "https://bmtadmin.onrender.com/api/homestay";
const PER_PAGE = 8;

const AMENITIES_LIST = [
  "WiFi", "AC", "TV", "Kitchen", "Washing Machine", "Parking", "Hot Water",
  "Swimming Pool", "Gym", "BBQ", "Garden", "Balcony", "Fireplace",
  "Pet Friendly", "Kids Area", "CCTV", "Power Backup", "First Aid Kit"
];

const PROPERTY_TYPES = ["Villa", "Apartment", "Cottage", "Farmhouse", "Bungalow", "Treehouse", "Homestay"];
const MEAL_PLANS = ["No Meals", "Breakfast Only", "Half Board", "Full Board", "All Inclusive"];
const ROOM_TYPES = ["Entire Place", "Private Room", "Shared Room"];

const emptyForm = {
  propertyId: "", propertyName: "", propertyType: "", hostName: "", vendorName: "",
  email: "", phone: "", altPhone: "",
  country: "India", state: "", city: "", area: "", address: "", pincode: "",
  lat: "", lng: "",
  bedrooms: "", bathrooms: "", maxGuests: "", beds: "",
  checkInTime: "14:00", checkOutTime: "11:00",
  amenities: [],
  pricePerNight: "", cleaningFee: "", serviceFee: "", tax: "",
  discount: "", finalPrice: "", vendorCost: "", profit: "",
  roomType: "", mealPlan: "",
  availableFrom: "", availableTo: "",
  houseRules: "", cancellationPolicy: "", notes: "",
  addedBy: "admin", assignUser: "",
  // owner
  ownerFullName: "", ownerFatherName: "", ownerDob: "", ownerGender: "",
  ownerPhone: "", ownerAltPhone: "", ownerEmail: "",
  ownerAddr1: "", ownerAddr2: "", ownerCity: "", ownerState: "", ownerCountry: "India", ownerPincode: "",
  ownerAadhar: "", ownerPan: "", ownerPassport: "",
  ownerBank: "", ownerBankName: "", ownerAccount: "", ownerIfsc: "", ownerUpi: "", ownerGst: "",
  // files
  thumbnail: null, gallery: [], aadharFront: null, aadharBack: null,
  panCardImage: null, passportImage: null, propertyProof: null,
  agreementCopy: null, electricityBill: null,
};

export default function HomeStayManagement() {
  const [stays, setStays] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState("basic");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [editId, setEditId] = useState(null);
  const [viewData, setViewData] = useState(null);

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => setPage(1), [search, filterStatus]);

  const toast$ = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/admin/all`);
      const d = await r.json();
      setStays(d.data || []);
    } catch { toast$("Failed to load", "error"); }
    finally { setLoading(false); }
  };

  const hc = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const toggleAmenity = (a) => setForm(p => ({
    ...p,
    amenities: p.amenities.includes(a) ? p.amenities.filter(x => x !== a) : [...p.amenities, a]
  }));

  const hf = (e) => {
    const { name, files } = e.target;
    if (name === "gallery") setForm(p => ({ ...p, gallery: Array.from(files) }));
    else setForm(p => ({ ...p, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let r, d;
      if (!editId) {
        const fd = new FormData();
        const ownerObj = {
          fullName: form.ownerFullName, fatherName: form.ownerFatherName,
          dob: form.ownerDob, gender: form.ownerGender,
          phone: form.ownerPhone, alternatePhone: form.ownerAltPhone, email: form.ownerEmail,
          addressLine1: form.ownerAddr1, addressLine2: form.ownerAddr2,
          city: form.ownerCity, state: form.ownerState, country: form.ownerCountry, pincode: form.ownerPincode,
          aadharNumber: form.ownerAadhar, panNumber: form.ownerPan, passportNumber: form.ownerPassport,
          bankAccountHolder: form.ownerBank, bankName: form.ownerBankName,
          accountNumber: form.ownerAccount, ifscCode: form.ownerIfsc,
          upiId: form.ownerUpi, gstNumber: form.ownerGst,
        };
        const skip = ["thumbnail","gallery","aadharFront","aadharBack","panCardImage","passportImage","propertyProof","agreementCopy","electricityBill","ownerFullName","ownerFatherName","ownerDob","ownerGender","ownerPhone","ownerAltPhone","ownerEmail","ownerAddr1","ownerAddr2","ownerCity","ownerState","ownerCountry","ownerPincode","ownerAadhar","ownerPan","ownerPassport","ownerBank","ownerBankName","ownerAccount","ownerIfsc","ownerUpi","ownerGst","lat","lng"];
        Object.entries(form).forEach(([k, v]) => {
          if (skip.includes(k)) return;
          if (Array.isArray(v)) v.forEach(i => fd.append(k, i));
          else if (v !== null && v !== undefined && v !== "") fd.append(k, v);
        });
        fd.append("owner", JSON.stringify(ownerObj));
        fd.append("mapLocation[lat]", form.lat);
        fd.append("mapLocation[lng]", form.lng);
        const fileFields = ["thumbnail","aadharFront","aadharBack","panCardImage","passportImage","propertyProof","agreementCopy","electricityBill"];
        fileFields.forEach(f => { if (form[f]) fd.append(f, form[f]); });
        form.gallery.forEach(f => fd.append("gallery", f));
        r = await fetch(`${API}/add`, { method: "POST", body: fd });
      } else {
        const body = {};
        const skip2 = ["thumbnail","gallery","aadharFront","aadharBack","panCardImage","passportImage","propertyProof","agreementCopy","electricityBill"];
        Object.entries(form).forEach(([k, v]) => { if (!skip2.includes(k)) body[k] = v; });
        r = await fetch(`${API}/update/${editId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      }
      d = await r.json();
      if (d.success || d.homeStay) {
        toast$(editId ? "Updated!" : "HomeStay added!");
        setForm(emptyForm); setEditId(null); setTab("basic"); fetchAll();
      } else toast$(d.message || "Error", "error");
    } catch (err) { toast$(err.message || "Failed", "error"); }
    finally { setSubmitting(false); }
  };

  const handleApprove = async (id) => {
    await fetch(`${API}/approve/${id}`, { method: "PUT" });
    toast$("Approved ✓"); fetchAll();
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this homestay?")) return;
    await fetch(`${API}/reject/${id}`, { method: "PUT" });
    toast$("Rejected", "error"); fetchAll();
  };

  const handleDelete = async (id) => {
    await fetch(`${API}/delete/${id}`, { method: "DELETE" });
    toast$("Deleted"); setDeleteModal(null); fetchAll();
  };

  const handleEdit = (s) => {
    setForm({
      ...emptyForm, ...s,
      lat: s.mapLocation?.lat || "", lng: s.mapLocation?.lng || "",
      ownerFullName: s.owner?.fullName || "", ownerFatherName: s.owner?.fatherName || "",
      ownerDob: s.owner?.dob || "", ownerGender: s.owner?.gender || "",
      ownerPhone: s.owner?.phone || "", ownerAltPhone: s.owner?.alternatePhone || "",
      ownerEmail: s.owner?.email || "",
      ownerAddr1: s.owner?.addressLine1 || "", ownerAddr2: s.owner?.addressLine2 || "",
      ownerCity: s.owner?.city || "", ownerState: s.owner?.state || "",
      ownerCountry: s.owner?.country || "India", ownerPincode: s.owner?.pincode || "",
      ownerAadhar: s.owner?.aadharNumber || "", ownerPan: s.owner?.panNumber || "",
      ownerPassport: s.owner?.passportNumber || "",
      ownerBank: s.owner?.bankAccountHolder || "", ownerBankName: s.owner?.bankName || "",
      ownerAccount: s.owner?.accountNumber || "", ownerIfsc: s.owner?.ifscCode || "",
      ownerUpi: s.owner?.upiId || "", ownerGst: s.owner?.gstNumber || "",
      thumbnail: null, gallery: [],
    });
    setEditId(s._id); setTab("basic");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filtered = stays.filter(s => {
    const q = search.toLowerCase();
    const m = s.propertyName?.toLowerCase().includes(q) || s.hostName?.toLowerCase().includes(q) || s.city?.toLowerCase().includes(q) || s.propertyId?.toLowerCase().includes(q);
    return m && (filterStatus === "all" || s.status === filterStatus);
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const sc = (s) => ({
    approved: { c: "#4ade80", bg: "rgba(74,222,128,0.09)", b: "rgba(74,222,128,0.25)" },
    rejected: { c: "#f87171", bg: "rgba(248,113,113,0.09)", b: "rgba(248,113,113,0.25)" },
    pending:  { c: "#fbbf24", bg: "rgba(251,191,36,0.09)", b: "rgba(251,191,36,0.25)" },
  }[s] || { c: "#888", bg: "#111", b: "#333" });

  const TABS = [
    { id: "basic",     label: "🏠 Basic" },
    { id: "location",  label: "📍 Location" },
    { id: "details",   label: "🛏 Details" },
    { id: "pricing",   label: "💰 Pricing" },
    { id: "amenities", label: "✨ Amenities" },
    { id: "owner",     label: "👤 Owner" },
    { id: "kyc",       label: "📋 KYC" },
    { id: "bank",      label: "🏦 Bank" },
    { id: "media",     label: "🖼 Media" },
    { id: "rules",     label: "📌 Rules" },
  ];

  const stats = [
    { l: "Total",    v: stays.length,                                       c: "#a78bfa" },
    { l: "Approved", v: stays.filter(s => s.status === "approved").length,  c: "#4ade80" },
    { l: "Pending",  v: stays.filter(s => s.status === "pending").length,   c: "#fbbf24" },
    { l: "Rejected", v: stays.filter(s => s.status === "rejected").length,  c: "#f87171" },
  ];

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: "#080810", minHeight: "100vh", color: "#e0dff4" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
        @keyframes toastIn { from{opacity:0;transform:translateX(50px)}to{opacity:1;transform:translateX(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)} }
        * { box-sizing:border-box; }
        input,select,textarea { outline:none; transition:border-color .2s,box-shadow .2s; }
        input:focus,select:focus,textarea:focus { border-color:#a78bfa!important; box-shadow:0 0 0 3px rgba(167,139,250,0.12)!important; }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-track { background:#080810; }
        ::-webkit-scrollbar-thumb { background:#1c1c2e; border-radius:4px; }
        .rh:hover { background:rgba(167,139,250,0.04)!important; }
        .ph:hover:not(:disabled) { background:rgba(167,139,250,0.12)!important; color:#a78bfa!important; }
        .ah:hover { transform:scale(0.91); opacity:.8; }
        .chip:hover { transform:translateY(-1px); }
        .tabx:hover { color:#c4b5fd!important; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed",top:18,right:18,zIndex:9999,padding:"12px 20px",borderRadius:10,fontSize:13,fontWeight:600,background:toast.type==="error"?"#1a0808":"#081408",border:`1px solid ${toast.type==="error"?"#f87171":"#4ade80"}`,color:toast.type==="error"?"#f87171":"#4ade80",boxShadow:"0 16px 50px rgba(0,0,0,.75)",animation:"toastIn .28s ease" }}>
          {toast.type==="error"?"✗ ":"✓ "}{toast.msg}
        </div>
      )}

      {/* View Modal */}
      {viewData && <ViewModal data={viewData} onClose={() => setViewData(null)} sc={sc} />}

      {/* Delete Modal */}
      {deleteModal && (
        <Overlay>
          <div style={{ background:"#0f0f1c",border:"1px solid #1e1e30",borderRadius:18,padding:"38px 32px",maxWidth:380,width:"100%",textAlign:"center",animation:"modalIn .25s ease" }}>
            <div style={{ fontSize:50,marginBottom:14 }}>🗑️</div>
            <h3 style={{ margin:"0 0 8px",fontFamily:"'Playfair Display',serif",color:"#f87171" }}>Delete HomeStay?</h3>
            <p style={{ color:"#444",fontSize:13,margin:"0 0 26px",lineHeight:1.7 }}>This will permanently remove the property and all its data.</p>
            <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
              <Btn onClick={() => setDeleteModal(null)} ghost>Cancel</Btn>
              <Btn onClick={() => handleDelete(deleteModal)} danger>Delete</Btn>
            </div>
          </div>
        </Overlay>
      )}

      <div style={{ maxWidth:1460,margin:"0 auto",padding:"28px 18px" }}>

        {/* HEADER */}
        <div style={{ marginBottom:28 }}>
          <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:18 }}>
            <div style={{ width:50,height:50,borderRadius:14,background:"linear-gradient(135deg,#a78bfa,#60a5fa)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0 }}>🏡</div>
            <div>
              <h1 style={{ margin:0,fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:800,color:"#e0dff4" }}>HomeStay Management</h1>
              <p style={{ margin:"3px 0 0",color:"#35354d",fontSize:13 }}>Add, manage and approve homestay listings</p>
            </div>
          </div>
          <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
            {stats.map(s => (
              <div key={s.l} style={{ background:"#0f0f1c",border:"1px solid #1a1a2c",borderRadius:12,padding:"12px 20px",minWidth:100 }}>
                <div style={{ fontSize:24,fontWeight:800,color:s.c,fontFamily:"'Playfair Display',serif" }}>{s.v}</div>
                <div style={{ fontSize:12,color:"#35354d",marginTop:3 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FORM */}
        <div style={{ background:"#0f0f1c",border:"1px solid #1a1a2c",borderRadius:18,marginBottom:30,overflow:"hidden",animation:"fadeUp .35s ease" }}>
          <div style={{ padding:"16px 24px",borderBottom:"1px solid #1a1a2c",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#0c0c18" }}>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <span style={{ fontSize:18 }}>{editId?"✏️":"➕"}</span>
              <span style={{ fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:17 }}>{editId?"Edit HomeStay":"Add New HomeStay"}</span>
            </div>
            {editId && <Btn ghost onClick={() => { setForm(emptyForm); setEditId(null); setTab("basic"); }}>✕ Cancel</Btn>}
          </div>

          {/* TABS */}
          <div style={{ display:"flex",overflowX:"auto",background:"#0c0c18",borderBottom:"1px solid #1a1a2c",padding:"0 16px",gap:2 }}>
            {TABS.map(t => (
              <button key={t.id} className="tabx" onClick={() => setTab(t.id)}
                style={{ padding:"12px 15px",background:"transparent",border:"none",borderBottom:tab===t.id?"2px solid #a78bfa":"2px solid transparent",color:tab===t.id?"#a78bfa":"#35354d",cursor:"pointer",fontSize:13,fontWeight:600,whiteSpace:"nowrap",fontFamily:"'Nunito',sans-serif",transition:"color .2s" }}>
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ padding:"24px" }}>

              {tab==="basic" && (
                <FGrid>
                  <FF l="Property ID"><FIn name="propertyId" value={form.propertyId} onChange={hc} placeholder="HS-2024-001" /></FF>
                  <FF l="Property Name *"><FIn name="propertyName" value={form.propertyName} onChange={hc} placeholder="Himalayan Cottage" required /></FF>
                  <FF l="Property Type">
                    <FSel name="propertyType" value={form.propertyType} onChange={hc}>
                      <option value="">Select Type</option>
                      {PROPERTY_TYPES.map(p=><option key={p}>{p}</option>)}
                    </FSel>
                  </FF>
                  <FF l="Host Name"><FIn name="hostName" value={form.hostName} onChange={hc} placeholder="Host full name" /></FF>
                  <FF l="Vendor Name"><FIn name="vendorName" value={form.vendorName} onChange={hc} placeholder="Vendor name" /></FF>
                  <FF l="Email"><FIn type="email" name="email" value={form.email} onChange={hc} placeholder="contact@homestay.com" /></FF>
                  <FF l="Phone"><FIn name="phone" value={form.phone} onChange={hc} placeholder="+91 98765 43210" /></FF>
                  <FF l="Alt Phone"><FIn name="altPhone" value={form.altPhone} onChange={hc} placeholder="+91 XXXXX XXXXX" /></FF>
                  <FF l="Added By">
                    <FSel name="addedBy" value={form.addedBy} onChange={hc}>
                      <option value="admin">Admin</option>
                      <option value="vendor">Vendor</option>
                    </FSel>
                  </FF>
                  <FF l="Assign User"><FIn name="assignUser" value={form.assignUser} onChange={hc} placeholder="Username" /></FF>
                </FGrid>
              )}

              {tab==="location" && (
                <FGrid>
                  <FF l="Country"><FIn name="country" value={form.country} onChange={hc} placeholder="India" /></FF>
                  <FF l="State"><FIn name="state" value={form.state} onChange={hc} placeholder="Himachal Pradesh" /></FF>
                  <FF l="City"><FIn name="city" value={form.city} onChange={hc} placeholder="Manali" /></FF>
                  <FF l="Area"><FIn name="area" value={form.area} onChange={hc} placeholder="Old Manali" /></FF>
                  <FF l="Pincode"><FIn name="pincode" value={form.pincode} onChange={hc} placeholder="175131" /></FF>
                  <FF l="Latitude"><FIn name="lat" value={form.lat} onChange={hc} placeholder="32.2396" /></FF>
                  <FF l="Longitude"><FIn name="lng" value={form.lng} onChange={hc} placeholder="77.1887" /></FF>
                  <FF l="Full Address" full><FTa name="address" value={form.address} onChange={hc} placeholder="Full address..." rows={2} /></FF>
                </FGrid>
              )}

              {tab==="details" && (
                <FGrid>
                  <FF l="Bedrooms"><FIn type="number" name="bedrooms" value={form.bedrooms} onChange={hc} placeholder="3" /></FF>
                  <FF l="Bathrooms"><FIn type="number" name="bathrooms" value={form.bathrooms} onChange={hc} placeholder="2" /></FF>
                  <FF l="Beds"><FIn type="number" name="beds" value={form.beds} onChange={hc} placeholder="4" /></FF>
                  <FF l="Max Guests"><FIn type="number" name="maxGuests" value={form.maxGuests} onChange={hc} placeholder="6" /></FF>
                  <FF l="Check-In Time"><FIn type="time" name="checkInTime" value={form.checkInTime} onChange={hc} /></FF>
                  <FF l="Check-Out Time"><FIn type="time" name="checkOutTime" value={form.checkOutTime} onChange={hc} /></FF>
                  <FF l="Room Type">
                    <FSel name="roomType" value={form.roomType} onChange={hc}>
                      <option value="">Select</option>
                      {ROOM_TYPES.map(r=><option key={r}>{r}</option>)}
                    </FSel>
                  </FF>
                  <FF l="Meal Plan">
                    <FSel name="mealPlan" value={form.mealPlan} onChange={hc}>
                      <option value="">Select</option>
                      {MEAL_PLANS.map(m=><option key={m}>{m}</option>)}
                    </FSel>
                  </FF>
                  <FF l="Available From"><FIn type="date" name="availableFrom" value={form.availableFrom} onChange={hc} /></FF>
                  <FF l="Available To"><FIn type="date" name="availableTo" value={form.availableTo} onChange={hc} /></FF>
                </FGrid>
              )}

              {tab==="pricing" && (
                <FGrid>
                  <FF l="Price Per Night (₹)"><FIn type="number" name="pricePerNight" value={form.pricePerNight} onChange={hc} placeholder="3500" /></FF>
                  <FF l="Cleaning Fee (₹)"><FIn type="number" name="cleaningFee" value={form.cleaningFee} onChange={hc} placeholder="500" /></FF>
                  <FF l="Service Fee (₹)"><FIn type="number" name="serviceFee" value={form.serviceFee} onChange={hc} placeholder="200" /></FF>
                  <FF l="Tax (%)"><FIn type="number" name="tax" value={form.tax} onChange={hc} placeholder="12" /></FF>
                  <FF l="Discount (%)"><FIn type="number" name="discount" value={form.discount} onChange={hc} placeholder="10" /></FF>
                  <FF l="Final Price (₹)"><FIn type="number" name="finalPrice" value={form.finalPrice} onChange={hc} placeholder="4200" /></FF>
                  <FF l="Vendor Cost (₹)"><FIn type="number" name="vendorCost" value={form.vendorCost} onChange={hc} placeholder="3000" /></FF>
                  <FF l="Profit (₹)"><FIn type="number" name="profit" value={form.profit} onChange={hc} placeholder="700" /></FF>
                </FGrid>
              )}

              {tab==="amenities" && (
                <div>
                  <SLabel>Select Amenities</SLabel>
                  <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginTop:14 }}>
                    {AMENITIES_LIST.map(a => {
                      const on = form.amenities.includes(a);
                      return (
                        <div key={a} className="chip" onClick={() => toggleAmenity(a)}
                          style={{ padding:"7px 15px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:600,transition:"all .2s",userSelect:"none",border:`1px solid ${on?"#a78bfa":"#1e1e30"}`,background:on?"rgba(167,139,250,0.14)":"#0c0c18",color:on?"#c4b5fd":"#35354d" }}>
                          {on && "✓ "}{a}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {tab==="owner" && (
                <FGrid>
                  <FF l="Full Name"><FIn name="ownerFullName" value={form.ownerFullName} onChange={hc} placeholder="Owner full name" /></FF>
                  <FF l="Father's Name"><FIn name="ownerFatherName" value={form.ownerFatherName} onChange={hc} placeholder="Father's name" /></FF>
                  <FF l="Date of Birth"><FIn type="date" name="ownerDob" value={form.ownerDob} onChange={hc} /></FF>
                  <FF l="Gender">
                    <FSel name="ownerGender" value={form.ownerGender} onChange={hc}>
                      <option value="">Select</option>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </FSel>
                  </FF>
                  <FF l="Phone"><FIn name="ownerPhone" value={form.ownerPhone} onChange={hc} placeholder="+91 XXXXX XXXXX" /></FF>
                  <FF l="Alt Phone"><FIn name="ownerAltPhone" value={form.ownerAltPhone} onChange={hc} placeholder="+91 XXXXX XXXXX" /></FF>
                  <FF l="Email"><FIn type="email" name="ownerEmail" value={form.ownerEmail} onChange={hc} placeholder="owner@email.com" /></FF>
                  <FF l="Address Line 1" full><FIn name="ownerAddr1" value={form.ownerAddr1} onChange={hc} placeholder="Street, House No." /></FF>
                  <FF l="Address Line 2"><FIn name="ownerAddr2" value={form.ownerAddr2} onChange={hc} placeholder="Area, Colony" /></FF>
                  <FF l="City"><FIn name="ownerCity" value={form.ownerCity} onChange={hc} placeholder="City" /></FF>
                  <FF l="State"><FIn name="ownerState" value={form.ownerState} onChange={hc} placeholder="State" /></FF>
                  <FF l="Country"><FIn name="ownerCountry" value={form.ownerCountry} onChange={hc} placeholder="India" /></FF>
                  <FF l="Pincode"><FIn name="ownerPincode" value={form.ownerPincode} onChange={hc} placeholder="110001" /></FF>
                </FGrid>
              )}

              {tab==="kyc" && (
                <FGrid>
                  <FF l="Aadhar Number"><FIn name="ownerAadhar" value={form.ownerAadhar} onChange={hc} placeholder="XXXX XXXX XXXX" /></FF>
                  <FF l="PAN Number"><FIn name="ownerPan" value={form.ownerPan} onChange={hc} placeholder="ABCDE1234F" /></FF>
                  <FF l="Passport Number"><FIn name="ownerPassport" value={form.ownerPassport} onChange={hc} placeholder="A1234567" /></FF>
                  <FF l="GST Number"><FIn name="ownerGst" value={form.ownerGst} onChange={hc} placeholder="27XXXXX0939F1ZV" /></FF>
                  {!editId && (
                    <>
                      <FF l="Aadhar Front"><FIn type="file" name="aadharFront" onChange={hf} accept="image/*" /></FF>
                      <FF l="Aadhar Back"><FIn type="file" name="aadharBack" onChange={hf} accept="image/*" /></FF>
                      <FF l="PAN Card Image"><FIn type="file" name="panCardImage" onChange={hf} accept="image/*" /></FF>
                      <FF l="Passport Image"><FIn type="file" name="passportImage" onChange={hf} accept="image/*" /></FF>
                      <FF l="Property Proof"><FIn type="file" name="propertyProof" onChange={hf} accept="image/*,.pdf" /></FF>
                      <FF l="Agreement Copy"><FIn type="file" name="agreementCopy" onChange={hf} accept="image/*,.pdf" /></FF>
                      <FF l="Electricity Bill"><FIn type="file" name="electricityBill" onChange={hf} accept="image/*,.pdf" /></FF>
                    </>
                  )}
                </FGrid>
              )}

              {tab==="bank" && (
                <FGrid>
                  <FF l="Account Holder Name"><FIn name="ownerBank" value={form.ownerBank} onChange={hc} placeholder="Full name as per bank" /></FF>
                  <FF l="Bank Name"><FIn name="ownerBankName" value={form.ownerBankName} onChange={hc} placeholder="State Bank of India" /></FF>
                  <FF l="Account Number"><FIn name="ownerAccount" value={form.ownerAccount} onChange={hc} placeholder="XXXXXXXXXXXXXXXX" /></FF>
                  <FF l="IFSC Code"><FIn name="ownerIfsc" value={form.ownerIfsc} onChange={hc} placeholder="SBIN0001234" /></FF>
                  <FF l="UPI ID"><FIn name="ownerUpi" value={form.ownerUpi} onChange={hc} placeholder="name@upi" /></FF>
                </FGrid>
              )}

              {tab==="media" && (
                <FGrid>
                  <FF l="Thumbnail Image" full>
                    <UploadBox name="thumbnail" onChange={hf} accept="image/*" file={form.thumbnail} label="Click to upload thumbnail" icon="🖼️" />
                  </FF>
                  <FF l="Gallery Images (max 10)" full>
                    <UploadBox name="gallery" onChange={hf} accept="image/*" multiple file={null} count={form.gallery.length} label="Click to upload gallery images" icon="📸" />
                  </FF>
                </FGrid>
              )}

              {tab==="rules" && (
                <FGrid>
                  <FF l="House Rules" full><FTa name="houseRules" value={form.houseRules} onChange={hc} placeholder="No smoking, No pets, No loud music after 10 PM..." rows={4} /></FF>
                  <FF l="Cancellation Policy" full><FTa name="cancellationPolicy" value={form.cancellationPolicy} onChange={hc} placeholder="Free cancellation 48 hours before check-in..." rows={3} /></FF>
                  <FF l="Admin Notes" full><FTa name="notes" value={form.notes} onChange={hc} placeholder="Internal notes..." rows={2} /></FF>
                </FGrid>
              )}
            </div>

            <div style={{ padding:"14px 24px",borderTop:"1px solid #1a1a2c",display:"flex",gap:10,justifyContent:"flex-end",background:"#0c0c18" }}>
              <Btn ghost onClick={() => { setForm(emptyForm); setEditId(null); setTab("basic"); }} type="button">Reset</Btn>
              <Btn type="submit" disabled={submitting} primary>
                {submitting ? "Saving..." : editId ? "Update HomeStay" : "Add HomeStay"}
              </Btn>
            </div>
          </form>
        </div>

        {/* TABLE */}
        <div style={{ background:"#0f0f1c",border:"1px solid #1a1a2c",borderRadius:18,overflow:"hidden",animation:"fadeUp .45s ease" }}>
          <div style={{ padding:"16px 22px",borderBottom:"1px solid #1a1a2c",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,background:"#0c0c18" }}>
            <div style={{ fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:17 }}>
              All HomeStays <span style={{ color:"#35354d",fontSize:13,fontWeight:400,fontFamily:"'Nunito',sans-serif" }}>({filtered.length})</span>
            </div>
            <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search name, city, host, ID..."
                style={{ padding:"8px 14px",background:"#080810",border:"1px solid #1e1e30",borderRadius:8,color:"#e0dff4",fontSize:13,fontFamily:"'Nunito',sans-serif",width:240 }} />
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                style={{ padding:"8px 12px",background:"#080810",border:"1px solid #1e1e30",borderRadius:8,color:"#e0dff4",fontSize:13,fontFamily:"'Nunito',sans-serif",cursor:"pointer" }}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <button onClick={fetchAll} style={{ padding:"8px 14px",background:"#141422",border:"1px solid #1e1e30",borderRadius:8,color:"#555",cursor:"pointer",fontSize:13,fontFamily:"'Nunito',sans-serif" }}>↺</button>
            </div>
          </div>

          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
              <thead>
                <tr style={{ background:"#09091a",borderBottom:"1px solid #1a1a2c" }}>
                  {["#","Property","Host / Contact","Location","Details","Price","Status","Actions"].map(h => (
                    <th key={h} style={{ padding:"11px 14px",textAlign:"left",color:"#35354d",fontWeight:700,fontSize:11,letterSpacing:"0.07em",textTransform:"uppercase",whiteSpace:"nowrap",fontFamily:"'Nunito',sans-serif" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} style={{ padding:60,textAlign:"center",color:"#252535" }}>
                    <div style={{ fontSize:36,marginBottom:10 }}>⏳</div>Loading homestays...
                  </td></tr>
                ) : paginated.length === 0 ? (
                  <tr><td colSpan={8} style={{ padding:60,textAlign:"center",color:"#252535" }}>
                    <div style={{ fontSize:40,marginBottom:10 }}>🏡</div>No homestays found
                  </td></tr>
                ) : paginated.map((s, i) => {
                  const { c, bg, b } = sc(s.status);
                  return (
                    <tr key={s._id} className="rh" style={{ borderBottom:"1px solid #10101e",transition:"background .15s" }}>
                      <td style={{ padding:"13px 14px",color:"#252535",fontWeight:700 }}>{(page-1)*PER_PAGE+i+1}</td>
                      <td style={{ padding:"13px 14px" }}>
                        <div style={{ fontWeight:700,color:"#e0dff4" }}>{s.propertyName}</div>
                        {s.propertyId && <div style={{ fontSize:11,color:"#a78bfa",marginTop:2 }}>{s.propertyId}</div>}
                        {s.propertyType && <div style={{ fontSize:11,color:"#35354d",marginTop:1 }}>{s.propertyType}</div>}
                      </td>
                      <td style={{ padding:"13px 14px" }}>
                        <div style={{ color:"#c4b5fd",fontWeight:600 }}>{s.hostName || "—"}</div>
                        <div style={{ fontSize:11,color:"#35354d",marginTop:2 }}>{s.phone || ""}</div>
                        <div style={{ fontSize:11,color:"#35354d" }}>{s.email || ""}</div>
                      </td>
                      <td style={{ padding:"13px 14px",color:"#555" }}>
                        <div>{[s.city,s.state].filter(Boolean).join(", ") || "—"}</div>
                        {s.area && <div style={{ fontSize:11,color:"#35354d",marginTop:1 }}>{s.area}</div>}
                      </td>
                      <td style={{ padding:"13px 14px" }}>
                        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
                          {s.bedrooms && <InfoChip>🛏 {s.bedrooms}BR</InfoChip>}
                          {s.maxGuests && <InfoChip>👥 {s.maxGuests}</InfoChip>}
                          {s.mealPlan && <InfoChip>{s.mealPlan}</InfoChip>}
                        </div>
                        <div style={{ fontSize:11,color:"#35354d",marginTop:4 }}>
                          {s.checkInTime && `In: ${s.checkInTime}`} {s.checkOutTime && `| Out: ${s.checkOutTime}`}
                        </div>
                      </td>
                      <td style={{ padding:"13px 14px" }}>
                        {s.pricePerNight ? <div style={{ color:"#4ade80",fontWeight:700 }}>₹{Number(s.pricePerNight).toLocaleString()}<span style={{ fontSize:10,color:"#35354d",fontWeight:400 }}>/night</span></div> : <span style={{ color:"#252535" }}>—</span>}
                        {s.tax && <div style={{ fontSize:11,color:"#35354d" }}>+{s.tax}% tax</div>}
                      </td>
                      <td style={{ padding:"13px 14px" }}>
                        <span style={{ fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:12,background:bg,border:`1px solid ${b}`,color:c }}>
                          {s.status?.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding:"13px 14px" }}>
                        <div style={{ display:"flex",gap:5,flexWrap:"nowrap" }}>
                          <AB color="#38bdf8" onClick={() => setViewData(s)} title="View">👁</AB>
                          <AB color="#a78bfa" onClick={() => handleEdit(s)} title="Edit">✎</AB>
                          {s.status==="pending" && <>
                            <AB color="#4ade80" onClick={() => handleApprove(s._id)} title="Approve">✓</AB>
                            <AB color="#f87171" onClick={() => handleReject(s._id)} title="Reject">✗</AB>
                          </>}
                          <AB color="#f87171" onClick={() => setDeleteModal(s._id)} title="Delete">🗑</AB>
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
            <div style={{ padding:"13px 22px",borderTop:"1px solid #1a1a2c",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,background:"#0c0c18" }}>
              <div style={{ fontSize:13,color:"#35354d" }}>
                Showing {Math.min((page-1)*PER_PAGE+1,filtered.length)}–{Math.min(page*PER_PAGE,filtered.length)} of {filtered.length}
              </div>
              <div style={{ display:"flex",gap:5,alignItems:"center" }}>
                <PB disabled={page===1} onClick={() => setPage(1)}>«</PB>
                <PB disabled={page===1} onClick={() => setPage(p=>p-1)}>‹</PB>
                {Array.from({length:totalPages},(_,i)=>i+1)
                  .filter(p=>p===1||p===totalPages||Math.abs(p-page)<=1)
                  .reduce((acc,p,idx,arr)=>{if(idx>0&&p-arr[idx-1]>1)acc.push("…");acc.push(p);return acc;},[])
                  .map((p,idx)=> p==="…"
                    ? <span key={`d${idx}`} style={{ color:"#35354d",padding:"0 4px",fontSize:13 }}>•••</span>
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

/* ====================================================
   VIEW MODAL
==================================================== */
function ViewModal({ data: s, onClose, sc }) {
  const { c, bg, b } = sc(s.status);
  const Sec = ({ title, items }) => (
    <div style={{ marginBottom:20 }}>
      <div style={{ fontSize:11,color:"#a78bfa",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:12,paddingBottom:7,borderBottom:"1px solid #1a1a2c" }}>{title}</div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:9 }}>
        {items.filter(([,v])=>v!==null&&v!==undefined&&v!=="").map(([l,v])=>(
          <div key={l} style={{ background:"#080810",border:"1px solid #1a1a2c",borderRadius:8,padding:"9px 12px" }}>
            <div style={{ fontSize:10,color:"#35354d",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em" }}>{l}</div>
            <div style={{ fontSize:13,color:"#c4b5fd",wordBreak:"break-all" }}>{String(v)}</div>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:9990,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"18px",overflowY:"auto" }}>
      <div style={{ background:"#0f0f1c",border:"1px solid #1a1a2c",borderRadius:18,width:"100%",maxWidth:880,animation:"modalIn .28s ease",margin:"10px 0" }}>
        <div style={{ padding:"18px 22px",borderBottom:"1px solid #1a1a2c",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#0c0c18",borderRadius:"18px 18px 0 0" }}>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:800,color:"#e0dff4" }}>{s.propertyName}</div>
            <div style={{ fontSize:12,color:"#a78bfa",marginTop:3 }}>{s.propertyId} {s.propertyType && `• ${s.propertyType}`}</div>
          </div>
          <div style={{ display:"flex",gap:8,alignItems:"center" }}>
            <span style={{ fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:12,background:bg,border:`1px solid ${b}`,color:c }}>{s.status?.toUpperCase()}</span>
            <button onClick={onClose} style={{ width:32,height:32,borderRadius:8,background:"#141422",border:"1px solid #1e1e30",color:"#555",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
          </div>
        </div>
        <div style={{ padding:"22px" }}>
          <Sec title="🏠 Basic Info" items={[
            ["Host",s.hostName],["Vendor",s.vendorName],["Email",s.email],["Phone",s.phone],
            ["Alt Phone",s.altPhone],["Type",s.propertyType],["Room Type",s.roomType],
            ["Meal Plan",s.mealPlan],["Added By",s.addedBy],
            ["Created",s.createdAt?new Date(s.createdAt).toLocaleDateString():null]
          ]} />
          <Sec title="📍 Location" items={[
            ["Address",s.address],["Area",s.area],["City",s.city],["State",s.state],
            ["Country",s.country],["Pincode",s.pincode],
            ["Lat",s.mapLocation?.lat],["Lng",s.mapLocation?.lng]
          ]} />
          <Sec title="🛏 Property Details" items={[
            ["Bedrooms",s.bedrooms],["Bathrooms",s.bathrooms],["Beds",s.beds],
            ["Max Guests",s.maxGuests],["Check-In",s.checkInTime],["Check-Out",s.checkOutTime],
            ["Available From",s.availableFrom?new Date(s.availableFrom).toLocaleDateString():null],
            ["Available To",s.availableTo?new Date(s.availableTo).toLocaleDateString():null]
          ]} />
          <Sec title="💰 Pricing" items={[
            ["Price/Night",s.pricePerNight?`₹${s.pricePerNight}`:null],
            ["Cleaning Fee",s.cleaningFee?`₹${s.cleaningFee}`:null],
            ["Service Fee",s.serviceFee?`₹${s.serviceFee}`:null],
            ["Tax",s.tax?`${s.tax}%`:null],["Discount",s.discount?`${s.discount}%`:null],
            ["Final Price",s.finalPrice?`₹${s.finalPrice}`:null],
            ["Vendor Cost",s.vendorCost?`₹${s.vendorCost}`:null],
            ["Profit",s.profit?`₹${s.profit}`:null]
          ]} />
          <Sec title="👤 Owner Info" items={[
            ["Name",s.owner?.fullName],["Father",s.owner?.fatherName],["DOB",s.owner?.dob],
            ["Gender",s.owner?.gender],["Phone",s.owner?.phone],["Email",s.owner?.email],
            ["City",s.owner?.city],["State",s.owner?.state]
          ]} />
          <Sec title="📋 KYC" items={[
            ["Aadhar",s.owner?.aadharNumber],["PAN",s.owner?.panNumber],
            ["Passport",s.owner?.passportNumber],["GST",s.owner?.gstNumber],
            ["Verified",s.owner?.isVerified?"Yes":"No"],["Verified By",s.owner?.verifiedBy],
            ["Verified At",s.owner?.verifiedAt?new Date(s.owner.verifiedAt).toLocaleDateString():null]
          ]} />
          <Sec title="🏦 Bank Details" items={[
            ["Account Holder",s.owner?.bankAccountHolder],["Bank",s.owner?.bankName],
            ["Account No",s.owner?.accountNumber],["IFSC",s.owner?.ifscCode],["UPI",s.owner?.upiId]
          ]} />
          {s.amenities?.length > 0 && (
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11,color:"#a78bfa",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:12,paddingBottom:7,borderBottom:"1px solid #1a1a2c" }}>✨ Amenities</div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
                {s.amenities.map(a=><span key={a} style={{ fontSize:12,color:"#c4b5fd",background:"rgba(167,139,250,0.1)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:5,padding:"3px 10px" }}>{a}</span>)}
              </div>
            </div>
          )}{/* ================= MEDIA ================= */}
{(s.thumbnail || s.gallery?.length > 0) && (
  <div style={{ marginBottom:20 }}>
    <div style={{
      fontSize:11,
      color:"#a78bfa",
      fontWeight:700,
      letterSpacing:"0.08em",
      textTransform:"uppercase",
      marginBottom:12,
      paddingBottom:7,
      borderBottom:"1px solid #1a1a2c"
    }}>
      🖼 Property Images
    </div>

    {/* Thumbnail */}
    {s.thumbnail && (
      <div style={{ marginBottom:15 }}>
        <div style={{ fontSize:12, color:"#888", marginBottom:6 }}>Thumbnail</div>
        <img
          src={`https://bmtadmin.onrender.com/${s.thumbnail}`}
          alt="thumb"
          style={{
            width:180,
            height:120,
            objectFit:"cover",
            borderRadius:10,
            border:"1px solid #222"
          }}
        />
      </div>
    )}

    {/* Gallery */}
    {s.gallery?.length > 0 && (
      <div>
        <div style={{ fontSize:12, color:"#888", marginBottom:6 }}>Gallery</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {s.gallery.map((img, i) => (
            <img
              key={i}
              src={`https://bmtadmin.onrender.com/${img}`}
              alt="gallery"
              style={{
                width:120,
                height:90,
                objectFit:"cover",
                borderRadius:8,
                border:"1px solid #222",
                cursor:"pointer"
              }}
              onClick={() => window.open(`https://bmtadmin.onrender.com/${img}`, "_blank")}
            />
          ))}
        </div>
      </div>
    )}
  </div>
)}
          {(s.houseRules||s.cancellationPolicy) && (
            <Sec title="📌 Rules & Policies" items={[
              ["House Rules",s.houseRules],["Cancellation",s.cancellationPolicy]
            ]} />
          )}
          {s.notes && (
            <div style={{ marginTop:8,padding:"12px 16px",background:"rgba(167,139,250,0.05)",border:"1px solid rgba(167,139,250,0.1)",borderRadius:10,fontSize:13,color:"#555",fontStyle:"italic" }}>
              📝 {s.notes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ====================================================
   SMALL HELPERS
==================================================== */
function Overlay({ children }) {
  return <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",zIndex:9998,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>{children}</div>;
}
function FGrid({ children }) {
  return <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:18 }}>{children}</div>;
}
function FF({ l, children, full }) {
  return (
    <div style={full?{gridColumn:"1/-1"}:{}}>
      <label style={{ display:"block",fontSize:11,color:"#35354d",fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:7 }}>{l}</label>
      {children}
    </div>
  );
}
function FIn(props) {
  return <input {...props} style={{ width:"100%",padding:"9px 11px",background:"#080810",border:"1px solid #1e1e30",borderRadius:8,color:"#e0dff4",fontSize:13,fontFamily:"'Nunito',sans-serif",boxSizing:"border-box",...props.style }} />;
}
function FSel({ children, ...props }) {
  return <select {...props} style={{ width:"100%",padding:"9px 11px",background:"#080810",border:"1px solid #1e1e30",borderRadius:8,color:"#e0dff4",fontSize:13,fontFamily:"'Nunito',sans-serif",cursor:"pointer",boxSizing:"border-box" }}>{children}</select>;
}
function FTa(props) {
  return <textarea {...props} style={{ width:"100%",padding:"9px 11px",background:"#080810",border:"1px solid #1e1e30",borderRadius:8,color:"#e0dff4",fontSize:13,fontFamily:"'Nunito',sans-serif",resize:"vertical",lineHeight:1.7,boxSizing:"border-box",...props.style }} />;
}
function SLabel({ children }) {
  return <div style={{ fontSize:11,color:"#35354d",fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase" }}>{children}</div>;
}
function AB({ color, onClick, children, title }) {
  return (
    <button className="ah" onClick={onClick} title={title}
      style={{ width:30,height:30,borderRadius:7,background:`${color}15`,border:`1px solid ${color}30`,color,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .15s",fontFamily:"'Nunito',sans-serif" }}>
      {children}
    </button>
  );
}
function PB({ children, onClick, disabled, active }) {
  return (
    <button className="ph" onClick={onClick} disabled={disabled}
      style={{ minWidth:34,height:34,borderRadius:8,border:active?"1px solid #a78bfa":"1px solid #1e1e30",background:active?"rgba(167,139,250,0.14)":"#0c0c18",color:active?"#a78bfa":disabled?"#1e1e30":"#555",cursor:disabled?"not-allowed":"pointer",fontSize:13,fontWeight:active?700:400,fontFamily:"'Nunito',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s" }}>
      {children}
    </button>
  );
}
function InfoChip({ children }) {
  return <span style={{ fontSize:11,color:"#888",background:"#131320",border:"1px solid #1e1e30",borderRadius:4,padding:"1px 7px" }}>{children}</span>;
}
function UploadBox({ name, onChange, accept, multiple, file, count, label, icon }) {
  return (
    <div style={{ border:"2px dashed #1e1e30",borderRadius:12,padding:28,textAlign:"center",position:"relative",cursor:"pointer",background:"#0c0c18",transition:"border-color .2s" }}>
      <input type="file" name={name} onChange={onChange} accept={accept} multiple={multiple} style={{ position:"absolute",inset:0,opacity:0,cursor:"pointer" }} />
      {(file || count > 0) ? (
        <div style={{ color:"#4ade80",fontSize:14,fontWeight:600 }}>✓ {count > 0 ? `${count} file(s) selected` : file?.name}</div>
      ) : (
        <div>
          <div style={{ fontSize:36,marginBottom:8 }}>{icon}</div>
          <div style={{ color:"#35354d",fontSize:13 }}>{label}</div>
          <div style={{ color:"#252535",fontSize:11,marginTop:3 }}>PNG, JPG, PDF supported</div>
        </div>
      )}
    </div>
  );
}
function Btn({ children, onClick, type="button", disabled, primary, danger, ghost }) {
  const bg = primary ? "linear-gradient(135deg,#a78bfa,#60a5fa)" : danger ? "#f87171" : "transparent";
  const border = ghost ? "1px solid #1e1e30" : danger ? "none" : "none";
  const color = ghost ? "#555" : "#fff";
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ padding:"9px 22px",background:disabled?"#2a2a3a":bg,border,borderRadius:8,color:disabled?"#555":color,cursor:disabled?"not-allowed":"pointer",fontSize:13,fontWeight:600,fontFamily:"'Nunito',sans-serif",opacity:disabled?0.7:1,transition:"opacity .2s" }}>
      {children}
    </button>
  );
}