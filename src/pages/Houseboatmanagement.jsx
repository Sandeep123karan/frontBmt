import { useState, useEffect, useRef } from "react";

const API = "http://localhost:9000/api/houseboat";
const PER_PAGE = 8;

const AMENITIES_LIST = ["WiFi","AC","TV","Parking","Hot Water","Room Service","Laundry","Kitchen","CCTV","Power Backup","Geyser","Refrigerator","Life Jackets","Fire Extinguisher","First Aid","Sun Deck","Fishing Equipment","Kayak"];
const FACILITIES_LIST = ["Generator","Solar Power","Water Purifier","Air Cooler","Mini Bar","Swimming Deck","Bonfire Area","Outdoor Seating","Indoor Dining","Private Balcony","Jacuzzi","Barbeque"];
const BOAT_SIZES = ["Small","Medium","Large","Luxury","Super Luxury"];

const emptyRoom = { roomName:"", price:"", capacity:"", availableRooms:"", roomImages:[] };

const initialForm = {
  propertyId:"", propertyName:"", propertyType:"HouseBoat", starRating:0, description:"",
  ownerName:"", vendorName:"", email:"", phone:"", alternatePhone:"",
  gstNumber:"", panNumber:"",
  country:"India", state:"", city:"", area:"", address:"", pincode:"", latitude:"", longitude:"", landmark:"",
  boatSize:"Medium", totalRooms:"", totalDecks:"", buildYear:"", maxGuests:"",
  roomTypes:[{ ...emptyRoom }],
  amenities:[], facilities:[],
  mealPlan:{ breakfast:false, lunch:false, dinner:false, welcomeDrink:false },
  basePrice:"", discountPrice:"", taxPercentage:"", extraGuestPrice:"",
  checkInTime:"14:00", checkOutTime:"11:00",
  houseRules:"", cancellationPolicy:"", childPolicy:"", petPolicy:"", alcoholPolicy:"",
  instantBooking:true, isFeatured:false, isTopRated:false,
  status:"pending", isActive:true, addedBy:"vendor",
};

export default function HouseboatManagement() {
  const [boats, setBoats] = useState([]);
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
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [lightbox, setLightbox] = useState(null);
  const [docModal, setDocModal] = useState(null);

  // image previews
  const [coverPrev, setCoverPrev] = useState(null);
  const [hbImgPrev, setHbImgPrev] = useState([]);
  const [intImgPrev, setIntImgPrev] = useState([]);
  const [extImgPrev, setExtImgPrev] = useState([]);
  const [hbVidPrev, setHbVidPrev] = useState([]);

  // file refs
  const coverRef = useRef(); const hbImgRef = useRef();
  const intImgRef = useRef(); const extImgRef = useRef(); const vidRef = useRef();

  // file state
  const [files, setFiles] = useState({ coverImage:null, houseboatImages:[], interiorImages:[], exteriorImages:[], houseboatVideos:[] });

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => setPage(1), [search, filterStatus]);

  const showToast = (msg, type="success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/all`);
      const d = await r.json();
      setBoats(d.data || []);
    } catch { showToast("Failed to load", "error"); }
    finally { setLoading(false); }
  };

  const fc = (e) => { const { name, value, type, checked } = e.target; setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value })); };
  const mealToggle = (k) => setForm(p => ({ ...p, mealPlan: { ...p.mealPlan, [k]: !p.mealPlan[k] } }));
  const toggleArr = (key, val) => setForm(p => ({ ...p, [key]: p[key].includes(val) ? p[key].filter(x => x !== val) : [...p[key], val] }));
  const toggleBool = (key) => setForm(p => ({ ...p, [key]: !p[key] }));

  const roomChange = (idx, field, val) => setForm(p => { const r = [...p.roomTypes]; r[idx] = { ...r[idx], [field]: val }; return { ...p, roomTypes: r }; });
  const addRoom = () => setForm(p => ({ ...p, roomTypes: [...p.roomTypes, { ...emptyRoom }] }));
  const removeRoom = (idx) => setForm(p => ({ ...p, roomTypes: p.roomTypes.filter((_, i) => i !== idx) }));

  // image handlers
  const handleCover = (e) => { const f = e.target.files[0]; if (!f) return; setFiles(p => ({ ...p, coverImage: f })); setCoverPrev(URL.createObjectURL(f)); };
  const handleImgUpload = (field, prevSetter, ref) => (e) => {
    const fs = Array.from(e.target.files);
    const cur = files[field];
    if (cur.length + fs.length > 20) { showToast("Max 20 images", "error"); return; }
    setFiles(p => ({ ...p, [field]: [...p[field], ...fs] }));
    prevSetter(p => [...p, ...fs.map(f => URL.createObjectURL(f))]);
    if (ref.current) ref.current.value = "";
  };
  const handleVid = (e) => {
    const fs = Array.from(e.target.files);
    if (files.houseboatVideos.length + fs.length > 5) { showToast("Max 5 videos", "error"); return; }
    setFiles(p => ({ ...p, houseboatVideos: [...p.houseboatVideos, ...fs] }));
    setHbVidPrev(p => [...p, ...fs.map(f => ({ name: f.name, url: URL.createObjectURL(f) }))]);
    if (vidRef.current) vidRef.current.value = "";
  };
  const removeImg = (field, prevSetter, idx) => {
    setFiles(p => ({ ...p, [field]: p[field].filter((_, i) => i !== idx) }));
    prevSetter(p => p.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      const fd = new FormData();
      const skipKeys = ["mealPlan","amenities","facilities","roomTypes"];
      Object.entries(form).forEach(([k, v]) => {
        if (!skipKeys.includes(k)) fd.append(k, v ?? "");
      });
      Object.entries(form.mealPlan).forEach(([k, v]) => fd.append(`mealPlan[${k}]`, v));
      form.amenities.forEach(a => fd.append("amenities[]", a));
      form.facilities.forEach(f => fd.append("facilities[]", f));
      form.roomTypes.forEach((r, i) => {
        fd.append(`roomTypes[${i}][roomName]`, r.roomName);
        fd.append(`roomTypes[${i}][price]`, r.price);
        fd.append(`roomTypes[${i}][capacity]`, r.capacity);
        fd.append(`roomTypes[${i}][availableRooms]`, r.availableRooms);
      });
      ["instantBooking","isFeatured","isTopRated","isActive"].forEach(k => fd.set(k, form[k]));

      if (files.coverImage) fd.append("coverImage", files.coverImage);
      files.houseboatImages.forEach(f => fd.append("houseboatImages", f));
      files.interiorImages.forEach(f => fd.append("interiorImages", f));
      files.exteriorImages.forEach(f => fd.append("exteriorImages", f));
      files.houseboatVideos.forEach(f => fd.append("houseboatVideos", f));

      const method = editId ? "PUT" : "POST";
      const url = editId ? `${API}/update/${editId}` : `${API}/add`;
      const r = await fetch(url, { method, body: fd });
      const d = await r.json();
      if (d.success) { showToast(editId ? "Updated!" : "Houseboat added!"); resetForm(); fetchAll(); }
      else showToast(d.message || d.error || "Error", "error");
    } catch (err) { showToast("Failed: " + err.message, "error"); }
    finally { setSubmitting(false); }
  };

  const resetForm = () => {
    setForm(initialForm); setEditId(null); setActiveTab("basic");
    setCoverPrev(null); setHbImgPrev([]); setIntImgPrev([]); setExtImgPrev([]); setHbVidPrev([]);
    setFiles({ coverImage:null, houseboatImages:[], interiorImages:[], exteriorImages:[], houseboatVideos:[] });
  };

  const handleEdit = (b) => {
    setForm({ ...initialForm, ...b, mealPlan: b.mealPlan || initialForm.mealPlan, amenities: b.amenities || [], facilities: b.facilities || [], roomTypes: b.roomTypes?.length ? b.roomTypes : [{ ...emptyRoom }] });
    setCoverPrev(b.coverImage || null);
    setHbImgPrev(b.houseboatImages || []);
    setIntImgPrev(b.interiorImages || []);
    setExtImgPrev(b.exteriorImages || []);
    setHbVidPrev((b.houseboatVideos || []).map(u => ({ name: u.split("/").pop(), url: u })));
    setFiles({ coverImage:null, houseboatImages:[], interiorImages:[], exteriorImages:[], houseboatVideos:[] });
    setEditId(b._id); setActiveTab("basic");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try { await fetch(`${API}/delete/${id}`, { method: "DELETE" }); showToast("Deleted!"); setDeleteModal(null); fetchAll(); }
    catch { showToast("Delete failed", "error"); }
  };
  const handleApprove = async (id) => {
    try { const r = await fetch(`${API}/approve/${id}`, { method: "PUT" }); const d = await r.json(); if (d.success) { showToast("Approved! ✓"); fetchAll(); } }
    catch { showToast("Failed", "error"); }
  };
  const handleReject = async () => {
    try {
      const r = await fetch(`${API}/reject/${rejectModal}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reason: rejectReason }) });
      const d = await r.json(); if (d.success) { showToast("Rejected"); setRejectModal(null); setRejectReason(""); fetchAll(); }
    } catch { showToast("Failed", "error"); }
  };

  const filtered = boats.filter(b => {
    const q = search.toLowerCase();
    const m = b.propertyName?.toLowerCase().includes(q) || b.propertyId?.toLowerCase().includes(q) || b.ownerName?.toLowerCase().includes(q) || b.city?.toLowerCase().includes(q);
    const s = filterStatus === "all" || b.status === filterStatus;
    return m && s;
  });
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const sColor = (s) => ({ approved:{ c:"#4ade80",bg:"rgba(74,222,128,0.08)",b:"rgba(74,222,128,0.25)" }, rejected:{ c:"#f87171",bg:"rgba(248,113,113,0.08)",b:"rgba(248,113,113,0.25)" }, pending:{ c:"#fbbf24",bg:"rgba(251,191,36,0.08)",b:"rgba(251,191,36,0.25)" } }[s] || { c:"#888",bg:"#111",b:"#333" });

  const stats = [
    { label:"Total", val:boats.length, c:"#06b6d4" },
    { label:"Approved", val:boats.filter(b=>b.status==="approved").length, c:"#4ade80" },
    { label:"Pending", val:boats.filter(b=>b.status==="pending").length, c:"#fbbf24" },
    { label:"Rejected", val:boats.filter(b=>b.status==="rejected").length, c:"#f87171" },
    { label:"Featured", val:boats.filter(b=>b.isFeatured).length, c:"#a78bfa" },
  ];

  const tabs = [
    { id:"basic", label:"🚢 Basic" }, { id:"owner", label:"👤 Owner" },
    { id:"location", label:"📍 Location" }, { id:"rooms", label:"🛏 Rooms" },
    { id:"pricing", label:"💰 Pricing" }, { id:"amenities", label:"✨ Amenities" },
    { id:"images", label:`🖼 Media${(files.houseboatImages.length+files.interiorImages.length+files.exteriorImages.length)>0?` (${files.houseboatImages.length+files.interiorImages.length+files.exteriorImages.length})`:""}` },
    { id:"policies", label:"📋 Policies" }, { id:"settings", label:"⚙️ Settings" },
  ];

  return (
    <div style={{ fontFamily:"'Outfit',sans-serif", background:"#05080f", minHeight:"100vh", color:"#c8d6e8" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes tin{from{opacity:0;transform:translateX(36px)}to{opacity:1;transform:translateX(0)}}
        @keyframes pop{from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        *{box-sizing:border-box;margin:0;padding:0}
        input,select,textarea{outline:none;font-family:'Outfit',sans-serif;transition:border .2s,box-shadow .2s}
        input:focus,select:focus,textarea:focus{border-color:#06b6d4!important;box-shadow:0 0 0 3px rgba(6,182,212,.13)!important}
        ::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:#05080f}::-webkit-scrollbar-thumb{background:#111d2b;border-radius:4px}
        .rh:hover{background:rgba(6,182,212,.04)!important}
        .tab:hover{color:#67e8f9!important}
        .pill:hover{transform:translateY(-1px)}
        .ab:hover{opacity:.75;transform:scale(.9)}
        .ph:hover:not(:disabled){background:rgba(6,182,212,.12)!important;color:#67e8f9!important}
        .gc:hover .gco{opacity:1!important}
        .gc:hover{border-color:#06b6d4!important}
        .dz:hover{border-color:#06b6d4!important;background:rgba(6,182,212,.05)!important}
      `}</style>

      {/* TOAST */}
      {toast && <div style={{ position:"fixed",top:18,right:18,zIndex:9999,padding:"12px 22px",borderRadius:10,fontSize:13,fontWeight:500,background:toast.type==="error"?"#160a0a":"#051408",border:`1px solid ${toast.type==="error"?"#f87171":"#4ade80"}`,color:toast.type==="error"?"#f87171":"#4ade80",boxShadow:"0 20px 60px rgba(0,0,0,.8)",animation:"tin .25s ease" }}>{toast.type==="error"?"✗ ":"✓ "}{toast.msg}</div>}

      {/* LIGHTBOX */}
      {lightbox && (
        <div onClick={()=>setLightbox(null)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.97)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn .2s ease" }}>
          <div onClick={e=>e.stopPropagation()} style={{ position:"relative",maxWidth:"90vw",maxHeight:"90vh",display:"flex",flexDirection:"column",alignItems:"center",gap:12 }}>
            <img src={lightbox.images[lightbox.idx]} alt="" style={{ maxWidth:"88vw",maxHeight:"78vh",objectFit:"contain",borderRadius:12,boxShadow:"0 40px 100px rgba(0,0,0,.9)" }} />
            <div style={{ display:"flex",gap:8,alignItems:"center" }}>
              <LbBtn disabled={lightbox.idx===0} onClick={()=>setLightbox(l=>({...l,idx:Math.max(0,l.idx-1)}))}>‹</LbBtn>
              <span style={{ color:"#4b5563",fontSize:12 }}>{lightbox.idx+1} / {lightbox.images.length}</span>
              <LbBtn disabled={lightbox.idx===lightbox.images.length-1} onClick={()=>setLightbox(l=>({...l,idx:Math.min(l.images.length-1,l.idx+1)}))}>›</LbBtn>
            </div>
          </div>
          <button onClick={()=>setLightbox(null)} style={{ position:"fixed",top:16,right:16,width:38,height:38,borderRadius:10,background:"#111827",border:"1px solid #1f2d3d",color:"#64748b",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
        </div>
      )}

      {/* DOCUMENT MODAL */}
      {docModal && (
        <div onClick={()=>setDocModal(null)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.95)",zIndex:9995,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"#0b1220",border:"1px solid #1f2d3d",borderRadius:20,padding:28,maxWidth:900,width:"100%",maxHeight:"90vh",overflowY:"auto",animation:"pop .28s ease" }}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22 }}>
              <h3 style={{ fontFamily:"'Syne',sans-serif",color:"#e0f2fe",fontSize:18 }}>📄 Owner Documents — {docModal.propertyName}</h3>
              <button onClick={()=>setDocModal(null)} style={{ width:30,height:30,borderRadius:7,background:"#111827",border:"1px solid #1f2d3d",color:"#64748b",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14 }}>
              {[
                ["👤 Owner Photo", docModal.ownerPhoto],
                ["🪪 Aadhar Front", docModal.ownerAadharFront],
                ["🪪 Aadhar Back", docModal.ownerAadharBack],
                ["📄 PAN Card", docModal.ownerPanCard],
                ["🤳 Selfie with Doc", docModal.ownerSelfieWithDoc],
                ["📃 Registration", docModal.registrationDoc],
                ["🛡 Insurance", docModal.insuranceDoc],
                ["📋 License", docModal.licenseDoc],
              ].map(([label, url]) => (
                <div key={label} style={{ background:"#080f1a",border:"1px solid #1f2d3d",borderRadius:12,overflow:"hidden" }}>
                  <div style={{ padding:"8px 12px",borderBottom:"1px solid #1f2d3d",fontSize:12,color:"#06b6d4",fontWeight:600 }}>{label}</div>
                  {url ? (
                    <div style={{ position:"relative",paddingTop:"65%",cursor:"zoom-in" }} onClick={()=>setLightbox({images:[url],idx:0})}>
                      <img src={url} alt={label} style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover" }} />
                      <div style={{ position:"absolute",bottom:6,right:6,background:"rgba(0,0,0,.6)",color:"#fff",fontSize:10,padding:"2px 7px",borderRadius:4,backdropFilter:"blur(4px)" }}>🔍 Zoom</div>
                    </div>
                  ) : (
                    <div style={{ padding:"30px 12px",textAlign:"center",color:"#1f2d3d",fontSize:12 }}>Not uploaded</div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop:20,padding:"14px 16px",background:"#080f1a",border:"1px solid #1f2d3d",borderRadius:12 }}>
              <div style={{ fontSize:11,color:"#334155",fontWeight:600,textTransform:"uppercase",letterSpacing:".05em",marginBottom:10 }}>KYC Details</div>
              <div style={{ display:"flex",gap:20,flexWrap:"wrap" }}>
                <div><div style={{ fontSize:11,color:"#334155" }}>GST Number</div><div style={{ fontSize:13,color:"#a5b4fc",marginTop:3 }}>{docModal.gstNumber||"—"}</div></div>
                <div><div style={{ fontSize:11,color:"#334155" }}>PAN Number</div><div style={{ fontSize:13,color:"#a5b4fc",marginTop:3 }}>{docModal.panNumber||"—"}</div></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectModal && (
        <MW onClose={()=>{ setRejectModal(null); setRejectReason(""); }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:44,marginBottom:14 }}>❌</div>
            <h3 style={{ fontFamily:"'Syne',sans-serif",color:"#f87171",marginBottom:8,fontSize:18 }}>Reject Houseboat?</h3>
            <p style={{ color:"#4b5563",fontSize:13,marginBottom:16,lineHeight:1.6 }}>Provide a reason for rejection (optional)</p>
            <textarea value={rejectReason} onChange={e=>setRejectReason(e.target.value)} rows={3} placeholder="Reason for rejection..." style={{ width:"100%",padding:"10px 12px",background:"#080f1a",border:"1px solid #1f2d3d",borderRadius:8,color:"#c8d6e8",fontSize:13,resize:"vertical",marginBottom:18,fontFamily:"'Outfit',sans-serif" }} />
            <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
              <GhBtn onClick={()=>{ setRejectModal(null); setRejectReason(""); }}>Cancel</GhBtn>
              <button onClick={handleReject} style={{ padding:"9px 22px",background:"#f87171",border:"none",borderRadius:8,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"'Outfit',sans-serif" }}>Reject</button>
            </div>
          </div>
        </MW>
      )}

      {/* DELETE MODAL */}
      {deleteModal && (
        <MW onClose={()=>setDeleteModal(null)}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:48,marginBottom:14 }}>🚢</div>
            <h3 style={{ fontFamily:"'Syne',sans-serif",color:"#f87171",marginBottom:8,fontSize:18 }}>Delete Houseboat?</h3>
            <p style={{ color:"#4b5563",fontSize:13,marginBottom:26,lineHeight:1.6 }}>This will permanently remove this houseboat and all its data.</p>
            <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
              <GhBtn onClick={()=>setDeleteModal(null)}>Cancel</GhBtn>
              <button onClick={()=>handleDelete(deleteModal)} style={{ padding:"9px 22px",background:"#f87171",border:"none",borderRadius:8,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"'Outfit',sans-serif" }}>Delete</button>
            </div>
          </div>
        </MW>
      )}

      {/* VIEW MODAL */}
      {viewData && <ViewModal data={viewData} onClose={()=>setViewData(null)} sColor={sColor} onLightbox={setLightbox} onDocView={setDocModal} onApprove={handleApprove} onReject={(id)=>{ setViewData(null); setRejectModal(id); }} fetchAll={fetchAll} showToast={showToast} API={API} />}

      <div style={{ maxWidth:1500,margin:"0 auto",padding:"32px 20px" }}>

        {/* HEADER */}
        <div style={{ marginBottom:32 }}>
          <div style={{ display:"flex",alignItems:"center",gap:16,marginBottom:22 }}>
            <div style={{ width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,#0891b2,#06b6d4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,flexShrink:0,boxShadow:"0 8px 28px rgba(6,182,212,.4)" }}>🚢</div>
            <div>
              <h1 style={{ fontFamily:"'Syne',sans-serif",fontSize:32,fontWeight:800,color:"#e0f2fe",lineHeight:1 }}>Houseboat Management</h1>
              <p style={{ color:"#1f3040",fontSize:13,marginTop:5 }}>Manage houseboat properties, approvals and documents</p>
            </div>
          </div>
          <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
            {stats.map(s => (
              <div key={s.label} style={{ background:"#0b1220",border:"1px solid #1f2d3d",borderRadius:14,padding:"14px 22px",minWidth:100 }}>
                <div style={{ fontSize:26,fontWeight:700,color:s.c,fontFamily:"'Syne',sans-serif" }}>{s.val}</div>
                <div style={{ fontSize:12,color:"#1f3040",marginTop:3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== FORM ===== */}
        <div style={{ background:"#0b1220",border:"1px solid #1f2d3d",borderRadius:20,marginBottom:36,overflow:"hidden",animation:"up .35s ease" }}>
          <div style={{ padding:"18px 28px",borderBottom:"1px solid #1f2d3d",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#080f1a" }}>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <span style={{ fontSize:18 }}>{editId?"✏️":"➕"}</span>
              <span style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:18,color:"#e0f2fe" }}>{editId?"Edit Houseboat":"Add New Houseboat"}</span>
            </div>
            {editId && <button onClick={resetForm} style={{ padding:"7px 18px",background:"#111827",border:"1px solid #1f2d3d",borderRadius:8,color:"#64748b",cursor:"pointer",fontSize:12,fontFamily:"'Outfit',sans-serif" }}>✕ Cancel</button>}
          </div>

          {/* TABS */}
          <div style={{ display:"flex",overflowX:"auto",background:"#080f1a",borderBottom:"1px solid #1f2d3d",padding:"0 20px",gap:2 }}>
            {tabs.map(t => (
              <button key={t.id} className="tab" onClick={()=>setActiveTab(t.id)}
                style={{ padding:"13px 16px",background:"transparent",border:"none",borderBottom:activeTab===t.id?"2px solid #06b6d4":"2px solid transparent",color:activeTab===t.id?"#67e8f9":"#1f3040",cursor:"pointer",fontSize:12.5,fontWeight:500,whiteSpace:"nowrap",transition:"color .2s",fontFamily:"'Outfit',sans-serif" }}>
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ padding:"28px" }}>

              {/* BASIC TAB */}
              {activeTab==="basic" && (
                <FG>
                  <FF l="Property ID *"><FI name="propertyId" value={form.propertyId} onChange={fc} placeholder="HB1001" required /></FF>
                  <FF l="Property Name *"><FI name="propertyName" value={form.propertyName} onChange={fc} placeholder="Royal Naini Houseboat" required /></FF>
                  <FF l="Property Type"><FI name="propertyType" value={form.propertyType} onChange={fc} /></FF>
                  <FF l="Star Rating">
                    <FS name="starRating" value={form.starRating} onChange={fc}>
                      {[0,1,2,3,4,5].map(n=><option key={n} value={n}>{n===0?"Select":n+" Star"}</option>)}
                    </FS>
                  </FF>
                  <FF l="Boat Size">
                    <FS name="boatSize" value={form.boatSize} onChange={fc}>{BOAT_SIZES.map(s=><option key={s}>{s}</option>)}</FS>
                  </FF>
                  <FF l="Build Year"><FI name="buildYear" value={form.buildYear} onChange={fc} placeholder="2018" /></FF>
                  <FF l="Total Rooms"><FI type="number" name="totalRooms" value={form.totalRooms} onChange={fc} placeholder="8" /></FF>
                  <FF l="Total Decks"><FI type="number" name="totalDecks" value={form.totalDecks} onChange={fc} placeholder="2" /></FF>
                  <FF l="Max Guests"><FI type="number" name="maxGuests" value={form.maxGuests} onChange={fc} placeholder="16" /></FF>
                  <FF l="Description" full><FTA name="description" value={form.description} onChange={fc} placeholder="Describe this houseboat..." rows={4} /></FF>
                </FG>
              )}

              {/* OWNER TAB */}
              {activeTab==="owner" && (
                <FG>
                  <FF l="Owner Name *"><FI name="ownerName" value={form.ownerName} onChange={fc} placeholder="Ramesh Kumar" required /></FF>
                  <FF l="Vendor Name"><FI name="vendorName" value={form.vendorName} onChange={fc} placeholder="Travel Partner" /></FF>
                  <FF l="Email"><FI type="email" name="email" value={form.email} onChange={fc} placeholder="owner@email.com" /></FF>
                  <FF l="Phone *"><FI name="phone" value={form.phone} onChange={fc} placeholder="+91 98765 43210" required /></FF>
                  <FF l="Alternate Phone"><FI name="alternatePhone" value={form.alternatePhone} onChange={fc} placeholder="+91 98765 43211" /></FF>
                  <FF l="GST Number"><FI name="gstNumber" value={form.gstNumber} onChange={fc} placeholder="27AAPFU0939F1ZV" /></FF>
                  <FF l="PAN Number"><FI name="panNumber" value={form.panNumber} onChange={fc} placeholder="ABCDE1234F" /></FF>
                </FG>
              )}

              {/* LOCATION TAB */}
              {activeTab==="location" && (
                <FG>
                  <FF l="Country"><FI name="country" value={form.country} onChange={fc} /></FF>
                  <FF l="State"><FI name="state" value={form.state} onChange={fc} placeholder="Kerala" /></FF>
                  <FF l="City"><FI name="city" value={form.city} onChange={fc} placeholder="Alleppey" /></FF>
                  <FF l="Area"><FI name="area" value={form.area} onChange={fc} placeholder="Backwaters Zone" /></FF>
                  <FF l="Landmark"><FI name="landmark" value={form.landmark} onChange={fc} placeholder="Near KSRTC Bus Stand" /></FF>
                  <FF l="Pincode"><FI name="pincode" value={form.pincode} onChange={fc} placeholder="688001" /></FF>
                  <FF l="Latitude"><FI name="latitude" value={form.latitude} onChange={fc} placeholder="9.4981" /></FF>
                  <FF l="Longitude"><FI name="longitude" value={form.longitude} onChange={fc} placeholder="76.3388" /></FF>
                  <FF l="Full Address" full><FTA name="address" value={form.address} onChange={fc} placeholder="Full address..." rows={2} /></FF>
                </FG>
              )}

              {/* ROOMS TAB */}
              {activeTab==="rooms" && (
                <div>
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18 }}>
                    <SL>Room Types</SL>
                    <AddBtn onClick={addRoom}>+ Add Room Type</AddBtn>
                  </div>
                  {form.roomTypes.map((r, idx) => (
                    <div key={idx} style={{ background:"#080f1a",border:"1px solid #1f2d3d",borderRadius:14,padding:20,marginBottom:14 }}>
                      <div style={{ display:"flex",justifyContent:"space-between",marginBottom:16 }}>
                        <span style={{ fontSize:13,color:"#06b6d4",fontWeight:700 }}>Room Type {idx+1}</span>
                        {form.roomTypes.length>1 && <SmDel onClick={()=>removeRoom(idx)}>Remove</SmDel>}
                      </div>
                      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12 }}>
                        {[["roomName","Room Name","Deluxe Room"],["price","Price (₹)","3500"],["capacity","Capacity","2"],["availableRooms","Available","3"]].map(([f,l,p])=>(
                          <div key={f}>
                            <label style={{ display:"block",fontSize:11,color:"#1f3040",fontWeight:600,textTransform:"uppercase",letterSpacing:".05em",marginBottom:6 }}>{l}</label>
                            <input type={f==="roomName"?"text":"number"} value={r[f]} onChange={e=>roomChange(idx,f,e.target.value)} placeholder={p}
                              style={{ width:"100%",padding:"9px 11px",background:"#05080f",border:"1px solid #1f2d3d",borderRadius:8,color:"#c8d6e8",fontSize:13,fontFamily:"'Outfit',sans-serif",boxSizing:"border-box" }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop:22,display:"flex",gap:12,flexWrap:"wrap" }}>
                    <FF l="Check-In Time"><FI type="time" name="checkInTime" value={form.checkInTime} onChange={fc} /></FF>
                    <FF l="Check-Out Time"><FI type="time" name="checkOutTime" value={form.checkOutTime} onChange={fc} /></FF>
                  </div>
                </div>
              )}

              {/* PRICING TAB */}
              {activeTab==="pricing" && (
                <div style={{ display:"flex",flexDirection:"column",gap:24 }}>
                  <FG>
                    <FF l="Base Price (₹)"><FI type="number" name="basePrice" value={form.basePrice} onChange={fc} placeholder="5000" /></FF>
                    <FF l="Discount Price (₹)"><FI type="number" name="discountPrice" value={form.discountPrice} onChange={fc} placeholder="4500" /></FF>
                    <FF l="Tax (%)"><FI type="number" name="taxPercentage" value={form.taxPercentage} onChange={fc} placeholder="12" /></FF>
                    <FF l="Extra Guest Price (₹)"><FI type="number" name="extraGuestPrice" value={form.extraGuestPrice} onChange={fc} placeholder="800" /></FF>
                  </FG>
                  <div>
                    <SL style={{ marginBottom:14 }}>Meal Plan</SL>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:14,marginTop:12 }}>
                      {[["breakfast","🌅 Breakfast"],["lunch","☀️ Lunch"],["dinner","🌙 Dinner"],["welcomeDrink","🥂 Welcome Drink"]].map(([k,l])=>(
                        <Chk key={k} label={l} checked={form.mealPlan[k]} onChange={()=>mealToggle(k)} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* AMENITIES TAB */}
              {activeTab==="amenities" && (
                <div style={{ display:"flex",flexDirection:"column",gap:26 }}>
                  <div>
                    <SL>Amenities</SL>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginTop:14 }}>
                      {AMENITIES_LIST.map(a=>{ const on=form.amenities.includes(a); return <Chip key={a} on={on} onClick={()=>toggleArr("amenities",a)}>{on&&"✓ "}{a}</Chip>; })}
                    </div>
                  </div>
                  <div>
                    <SL>Facilities</SL>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginTop:14 }}>
                      {FACILITIES_LIST.map(a=>{ const on=form.facilities.includes(a); return <Chip key={a} on={on} acc="#a78bfa" onClick={()=>toggleArr("facilities",a)}>{on&&"✓ "}{a}</Chip>; })}
                    </div>
                  </div>
                </div>
              )}

              {/* IMAGES TAB */}
              {activeTab==="images" && (
                <div style={{ display:"flex",flexDirection:"column",gap:30 }}>

                  {/* Cover Image */}
                  <div>
                    <SL>Cover Image</SL>
                    <div className="dz" onClick={()=>coverRef.current?.click()}
                      style={{ marginTop:12,border:"2px dashed #1f2d3d",borderRadius:14,padding:coverPrev?"12px":"40px 20px",textAlign:"center",cursor:"pointer",background:"#080f1a",transition:"all .2s" }}>
                      <input ref={coverRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleCover} />
                      {coverPrev ? (
                        <div style={{ position:"relative",display:"inline-block" }}>
                          <img src={coverPrev} alt="cover" style={{ maxHeight:200,maxWidth:"100%",borderRadius:10,objectFit:"cover" }} />
                          <button type="button" onClick={e=>{e.stopPropagation();setCoverPrev(null);setFiles(p=>({...p,coverImage:null}));}}
                            style={{ position:"absolute",top:-8,right:-8,width:22,height:22,borderRadius:"50%",background:"#f87171",border:"none",color:"#fff",cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
                        </div>
                      ) : (
                        <><div style={{ fontSize:36,marginBottom:8 }}>🚢</div>
                        <div style={{ color:"#06b6d4",fontSize:13,fontWeight:500 }}>Click to upload cover image</div>
                        <div style={{ color:"#1f3040",fontSize:12,marginTop:4 }}>PNG, JPG, WEBP • Recommended 1200×800</div></>
                      )}
                    </div>
                  </div>

                  {/* Gallery Sections */}
                  {[
                    ["Houseboat Images", "houseboatImages", hbImgPrev, setHbImgPrev, hbImgRef, "🚢"],
                    ["Interior Images", "interiorImages", intImgPrev, setIntImgPrev, intImgRef, "🛋️"],
                    ["Exterior Images", "exteriorImages", extImgPrev, setExtImgPrev, extImgRef, "🌊"],
                  ].map(([title, field, prev, setPrev, ref, icon]) => (
                    <div key={field}>
                      <div style={{ display:"flex",justifyContent:"space-between",marginBottom:12 }}>
                        <SL>{icon} {title}</SL>
                        <span style={{ fontSize:12,color:prev.length>=20?"#f87171":"#1f3040",fontWeight:600 }}>{prev.length}/20</span>
                      </div>
                      {prev.length < 20 && (
                        <div className="dz" onClick={()=>ref.current?.click()}
                          style={{ border:"2px dashed #1f2d3d",borderRadius:14,padding:"24px 20px",textAlign:"center",cursor:"pointer",background:"#080f1a",transition:"all .2s",marginBottom:12 }}>
                          <input ref={ref} type="file" accept="image/*" multiple style={{ display:"none" }} onChange={handleImgUpload(field,setPrev,ref)} />
                          <div style={{ fontSize:26,marginBottom:6 }}>{icon}</div>
                          <div style={{ color:"#06b6d4",fontSize:13,fontWeight:500 }}>Add {title}</div>
                          <div style={{ color:"#1f3040",fontSize:12,marginTop:3 }}>Max {20-prev.length} more images</div>
                        </div>
                      )}
                      {prev.length > 0 && (
                        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10 }}>
                          {prev.map((src,i)=>(
                            <div key={i} className="gc" style={{ position:"relative",borderRadius:10,overflow:"hidden",border:"2px solid #1f2d3d",paddingTop:"68%",background:"#080f1a",transition:"border-color .2s",cursor:"pointer" }}>
                              <img src={src} alt="" onClick={()=>setLightbox({images:prev,idx:i})} style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover" }} />
                              <div className="gco" style={{ position:"absolute",inset:0,background:"rgba(0,0,0,.5)",opacity:0,transition:"opacity .2s",display:"flex",alignItems:"center",justifyContent:"center" }}>
                                <button type="button" onClick={()=>setLightbox({images:prev,idx:i})} style={{ width:30,height:30,borderRadius:7,background:"rgba(255,255,255,.15)",border:"none",color:"#fff",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center" }}>👁</button>
                              </div>
                              <button type="button" onClick={()=>removeImg(field,setPrev,i)} style={{ position:"absolute",top:5,right:5,width:20,height:20,borderRadius:"50%",background:"rgba(248,113,113,.9)",border:"none",color:"#fff",cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Videos */}
                  <div>
                    <div style={{ display:"flex",justifyContent:"space-between",marginBottom:12 }}>
                      <SL>🎬 Houseboat Videos</SL>
                      <span style={{ fontSize:12,color:hbVidPrev.length>=5?"#f87171":"#1f3040",fontWeight:600 }}>{hbVidPrev.length}/5</span>
                    </div>
                    {hbVidPrev.length < 5 && (
                      <div className="dz" onClick={()=>vidRef.current?.click()}
                        style={{ border:"2px dashed #1f2d3d",borderRadius:14,padding:"24px 20px",textAlign:"center",cursor:"pointer",background:"#080f1a",transition:"all .2s",marginBottom:12 }}>
                        <input ref={vidRef} type="file" accept="video/*" multiple style={{ display:"none" }} onChange={handleVid} />
                        <div style={{ fontSize:26,marginBottom:6 }}>🎬</div>
                        <div style={{ color:"#06b6d4",fontSize:13,fontWeight:500 }}>Upload Videos</div>
                        <div style={{ color:"#1f3040",fontSize:12,marginTop:3 }}>MP4, MOV • Max {5-hbVidPrev.length} more</div>
                      </div>
                    )}
                    {hbVidPrev.length > 0 && (
                      <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                        {hbVidPrev.map((v,i)=>(
                          <div key={i} style={{ display:"flex",alignItems:"center",gap:10,background:"#080f1a",border:"1px solid #1f2d3d",borderRadius:8,padding:"10px 14px" }}>
                            <span style={{ fontSize:20 }}>🎬</span>
                            <span style={{ fontSize:13,color:"#94a3b8",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{v.name}</span>
                            <a href={v.url} target="_blank" rel="noreferrer" style={{ fontSize:11,color:"#06b6d4",textDecoration:"none" }}>Preview</a>
                            <button type="button" onClick={()=>{setHbVidPrev(p=>p.filter((_,ii)=>ii!==i));setFiles(p=>({...p,houseboatVideos:p.houseboatVideos.filter((_,ii)=>ii!==i)}));}}
                              style={{ width:20,height:20,borderRadius:"50%",background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.3)",color:"#f87171",cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* POLICIES TAB */}
              {activeTab==="policies" && (
                <FG>
                  <FF l="House Rules" full><FTA name="houseRules" value={form.houseRules} onChange={fc} placeholder="No smoking, quiet hours after 10PM..." rows={3} /></FF>
                  <FF l="Cancellation Policy" full><FTA name="cancellationPolicy" value={form.cancellationPolicy} onChange={fc} placeholder="Free cancellation within 24 hours..." rows={3} /></FF>
                  <FF l="Child Policy"><FTA name="childPolicy" value={form.childPolicy} onChange={fc} placeholder="Children under 5 stay free..." rows={2} /></FF>
                  <FF l="Pet Policy"><FTA name="petPolicy" value={form.petPolicy} onChange={fc} placeholder="No pets allowed..." rows={2} /></FF>
                  <FF l="Alcohol Policy"><FTA name="alcoholPolicy" value={form.alcoholPolicy} onChange={fc} placeholder="Alcohol not permitted on board..." rows={2} /></FF>
                </FG>
              )}

              {/* SETTINGS TAB */}
              {activeTab==="settings" && (
                <div style={{ display:"flex",flexDirection:"column",gap:24 }}>
                  <FG>
                    <FF l="Status">
                      <FS name="status" value={form.status} onChange={fc}>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </FS>
                    </FF>
                    <FF l="Added By">
                      <FS name="addedBy" value={form.addedBy} onChange={fc}>
                        <option>admin</option><option>vendor</option>
                      </FS>
                    </FF>
                  </FG>
                  <div style={{ display:"flex",flexWrap:"wrap",gap:20 }}>
                    {[["isActive","🟢 Active"],["isFeatured","⭐ Featured"],["isTopRated","🏆 Top Rated"],["instantBooking","⚡ Instant Booking"]].map(([k,l])=>(
                      <Chk key={k} label={l} checked={form[k]} onChange={()=>toggleBool(k)} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding:"16px 28px",borderTop:"1px solid #1f2d3d",display:"flex",gap:10,justifyContent:"flex-end",background:"#080f1a" }}>
              <GhBtn onClick={resetForm}>Reset</GhBtn>
              <PrBtn type="submit" disabled={submitting}>{submitting?"Saving...":editId?"Update Houseboat":"Add Houseboat"}</PrBtn>
            </div>
          </form>
        </div>

        {/* ===== TABLE ===== */}
        <div style={{ background:"#0b1220",border:"1px solid #1f2d3d",borderRadius:20,overflow:"hidden",animation:"up .45s ease" }}>
          <div style={{ padding:"18px 24px",borderBottom:"1px solid #1f2d3d",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,background:"#080f1a" }}>
            <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:18,color:"#e0f2fe" }}>
              All Houseboats <span style={{ color:"#1f3040",fontSize:13,fontWeight:400 }}>({filtered.length})</span>
            </div>
            <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search name, ID, city, owner..."
                style={{ padding:"8px 14px",background:"#05080f",border:"1px solid #1f2d3d",borderRadius:8,color:"#c8d6e8",fontSize:13,width:240,fontFamily:"'Outfit',sans-serif" }} />
              <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
                style={{ padding:"8px 12px",background:"#05080f",border:"1px solid #1f2d3d",borderRadius:8,color:"#c8d6e8",fontSize:13,cursor:"pointer",fontFamily:"'Outfit',sans-serif" }}>
                <option value="all">All Status</option><option value="pending">Pending</option>
                <option value="approved">Approved</option><option value="rejected">Rejected</option>
              </select>
              <button onClick={fetchAll} style={{ padding:"8px 14px",background:"#111827",border:"1px solid #1f2d3d",borderRadius:8,color:"#64748b",cursor:"pointer",fontSize:13,fontFamily:"'Outfit',sans-serif" }}>↺</button>
            </div>
          </div>

          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
              <thead>
                <tr style={{ background:"#05080f",borderBottom:"1px solid #1f2d3d" }}>
                  {["#","Houseboat","Owner","Location","Capacity","Price","Status","Flags","Actions"].map(h=>(
                    <th key={h} style={{ padding:"11px 14px",textAlign:"left",color:"#1f3040",fontWeight:600,fontSize:11,letterSpacing:".07em",textTransform:"uppercase",whiteSpace:"nowrap",fontFamily:"'Outfit',sans-serif" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} style={{ padding:60,textAlign:"center",color:"#1f2d3d" }}><div style={{ fontSize:36,marginBottom:10 }}>⏳</div>Loading...</td></tr>
                ) : paginated.length===0 ? (
                  <tr><td colSpan={9} style={{ padding:60,textAlign:"center",color:"#1f2d3d" }}><div style={{ fontSize:40,marginBottom:10 }}>🚢</div>No houseboats found</td></tr>
                ) : paginated.map((b,i) => {
                  const sc = sColor(b.status);
                  return (
                    <tr key={b._id} className="rh" style={{ borderBottom:"1px solid #0e1828",transition:"background .15s" }}>
                      <td style={{ padding:"13px 14px",color:"#1f2d3d",fontWeight:600 }}>{(page-1)*PER_PAGE+i+1}</td>
                      <td style={{ padding:"13px 14px" }}>
                        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                          <div style={{ width:48,height:38,borderRadius:8,overflow:"hidden",background:"#080f1a",border:"1px solid #1f2d3d",flexShrink:0 }}>
                            {b.coverImage ? <img src={b.coverImage} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} /> : <div style={{ width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"#1f2d3d" }}>🚢</div>}
                          </div>
                          <div>
                            <div style={{ fontWeight:600,color:"#e0f2fe" }}>{b.propertyName}</div>
                            <div style={{ fontSize:11,color:"#06b6d4",marginTop:1 }}>{b.propertyId}</div>
                            <div style={{ fontSize:10,color:"#1f3040",marginTop:2 }}>{b.boatSize} • {b.starRating?`${"★".repeat(b.starRating)}`:"No rating"}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:"13px 14px" }}>
                        <div style={{ color:"#93c5fd" }}>{b.ownerName}</div>
                        <div style={{ fontSize:11,color:"#1f3040",marginTop:2 }}>{b.phone}</div>
                        {b.email && <div style={{ fontSize:11,color:"#1f3040",marginTop:1 }}>{b.email}</div>}
                      </td>
                      <td style={{ padding:"13px 14px",color:"#4b5563" }}>
                        <div>{b.city}{b.state?`, ${b.state}`:""}</div>
                        {b.landmark && <div style={{ fontSize:11,color:"#1f3040",marginTop:1 }}>{b.landmark}</div>}
                      </td>
                      <td style={{ padding:"13px 14px" }}>
                        <div style={{ color:"#93c5fd",fontWeight:600 }}>{b.maxGuests||"—"} guests</div>
                        <div style={{ fontSize:11,color:"#1f3040",marginTop:1 }}>{b.totalRooms||0} rooms</div>
                      </td>
                      <td style={{ padding:"13px 14px" }}>
                        {b.basePrice ? <div style={{ color:"#4ade80",fontWeight:600 }}>₹{Number(b.basePrice).toLocaleString()}</div> : <span style={{ color:"#1f2d3d" }}>—</span>}
                        {b.discountPrice && <div style={{ fontSize:11,color:"#06b6d4",marginTop:1 }}>Offer: ₹{Number(b.discountPrice).toLocaleString()}</div>}
                        {b.taxPercentage && <div style={{ fontSize:11,color:"#1f3040",marginTop:1 }}>+{b.taxPercentage}% tax</div>}
                      </td>
                      <td style={{ padding:"13px 14px" }}>
                        <span style={{ fontSize:11,fontWeight:700,padding:"4px 11px",borderRadius:12,background:sc.bg,border:`1px solid ${sc.b}`,color:sc.c }}>{b.status?.toUpperCase()}</span>
                        {b.rejectReason && <div style={{ fontSize:10,color:"#f87171",marginTop:4,maxWidth:100,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }} title={b.rejectReason}>↳ {b.rejectReason}</div>}
                      </td>
                      <td style={{ padding:"13px 14px" }}>
                        <div style={{ display:"flex",gap:3,flexWrap:"wrap" }}>
                          {b.isFeatured && <span style={{ fontSize:10,padding:"2px 6px",borderRadius:4,background:"rgba(167,139,250,.1)",border:"1px solid rgba(167,139,250,.3)",color:"#a78bfa" }}>⭐</span>}
                          {b.isTopRated && <span style={{ fontSize:10,padding:"2px 6px",borderRadius:4,background:"rgba(251,191,36,.1)",border:"1px solid rgba(251,191,36,.3)",color:"#fbbf24" }}>🏆</span>}
                          {b.instantBooking && <span style={{ fontSize:10,padding:"2px 6px",borderRadius:4,background:"rgba(6,182,212,.1)",border:"1px solid rgba(6,182,212,.3)",color:"#06b6d4" }}>⚡</span>}
                          {!b.isActive && <span style={{ fontSize:10,padding:"2px 6px",borderRadius:4,background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.3)",color:"#f87171" }}>OFF</span>}
                        </div>
                      </td>
                      <td style={{ padding:"13px 14px" }}>
                        <div style={{ display:"flex",gap:4,flexWrap:"nowrap" }}>
                          <Ab color="#06b6d4" onClick={()=>setViewData(b)} title="View">👁</Ab>
                          <Ab color="#6366f1" onClick={()=>handleEdit(b)} title="Edit">✎</Ab>
                          <Ab color="#4ade80" onClick={()=>handleApprove(b._id)} title="Approve">✓</Ab>
                          <Ab color="#f87171" onClick={()=>setRejectModal(b._id)} title="Reject">✗</Ab>
                          <Ab color="#94a3b8" onClick={()=>setDocModal(b)} title="Documents">📄</Ab>
                          <Ab color="#f87171" onClick={()=>setDeleteModal(b._id)} title="Delete">🗑</Ab>
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
            <div style={{ padding:"14px 24px",borderTop:"1px solid #1f2d3d",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,background:"#080f1a" }}>
              <div style={{ fontSize:13,color:"#1f3040" }}>Showing {Math.min((page-1)*PER_PAGE+1,filtered.length)}–{Math.min(page*PER_PAGE,filtered.length)} of {filtered.length}</div>
              <div style={{ display:"flex",gap:5,alignItems:"center" }}>
                <PgB disabled={page===1} onClick={()=>setPage(1)}>«</PgB>
                <PgB disabled={page===1} onClick={()=>setPage(p=>p-1)}>‹</PgB>
                {Array.from({length:totalPages},(_,i)=>i+1).filter(p=>p===1||p===totalPages||Math.abs(p-page)<=1).reduce((acc,p,idx,arr)=>{if(idx>0&&p-arr[idx-1]>1)acc.push("...");acc.push(p);return acc;},[])
                  .map((p,idx)=>p==="..."?<span key={`d${idx}`} style={{ color:"#1f3040",padding:"0 4px",fontSize:13 }}>•••</span>:<PgB key={p} active={page===p} onClick={()=>setPage(p)}>{p}</PgB>)}
                <PgB disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>›</PgB>
                <PgB disabled={page===totalPages} onClick={()=>setPage(totalPages)}>»</PgB>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===================== VIEW MODAL ===================== */
function ViewModal({ data:b, onClose, sColor, onLightbox, onDocView, onApprove, onReject, fetchAll, showToast, API }) {
  const sc = sColor(b.status);
  const [activeSection, setActiveSection] = useState("main");
  const allImgs = [b.coverImage, ...(b.houseboatImages||[])].filter(Boolean);
  const [activeImg, setActiveImg] = useState(0);

  const IC = ({ label, value }) => value!==null&&value!==undefined&&value!==""&&value!==false ? (
    <div style={{ background:"#05080f",border:"1px solid #1f2d3d",borderRadius:9,padding:"10px 14px" }}>
      <div style={{ fontSize:11,color:"#1f3040",marginBottom:4 }}>{label}</div>
      <div style={{ fontSize:13,color:"#93c5fd",wordBreak:"break-all" }}>{String(value)}</div>
    </div>
  ) : null;

  const Sec = ({ title, children }) => (
    <div style={{ marginBottom:24 }}>
      <div style={{ fontSize:11,color:"#06b6d4",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",marginBottom:12,paddingBottom:7,borderBottom:"1px solid #1f2d3d" }}>{title}</div>
      {children}
    </div>
  );
  const IG = ({ items }) => (
    <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10 }}>
      {items.map(([l,v])=><IC key={l} label={l} value={v} />)}
    </div>
  );
  const GallSec = ({ title, images }) => images?.length>0 && (
    <Sec title={title}>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:10 }}>
        {images.map((img,i)=>(
          <div key={i} onClick={()=>onLightbox({images,idx:i})} style={{ position:"relative",paddingTop:"68%",borderRadius:10,overflow:"hidden",cursor:"zoom-in",background:"#05080f",border:"1px solid #1f2d3d" }}>
            <img src={img} alt="" style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover" }} />
            <div style={{ position:"absolute",bottom:4,right:4,background:"rgba(0,0,0,.6)",color:"#fff",fontSize:9,padding:"2px 6px",borderRadius:4 }}>🔍</div>
          </div>
        ))}
      </div>
    </Sec>
  );

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.93)",zIndex:9990,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:20,overflowY:"auto" }}>
      <div style={{ background:"#0b1220",border:"1px solid #1f2d3d",borderRadius:20,width:"100%",maxWidth:960,animation:"pop .3s ease",marginTop:10,marginBottom:10 }}>

        {/* Header */}
        <div style={{ padding:"20px 26px",borderBottom:"1px solid #1f2d3d",display:"flex",alignItems:"flex-start",justifyContent:"space-between",background:"#080f1a",borderRadius:"20px 20px 0 0",gap:12 }}>
          <div style={{ flex:1 }}>
            <h2 style={{ fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:"#e0f2fe",margin:0 }}>{b.propertyName}</h2>
            <div style={{ fontSize:12,color:"#06b6d4",marginTop:3 }}>{b.propertyId} • {b.boatSize} • {b.starRating?"★".repeat(b.starRating):"Unrated"}</div>
            <div style={{ fontSize:12,color:"#1f3040",marginTop:2 }}>{b.city}{b.state?`, ${b.state}`:""}</div>
          </div>
          <div style={{ display:"flex",gap:8,alignItems:"center",flexShrink:0 }}>
            <span style={{ fontSize:11,fontWeight:700,padding:"4px 11px",borderRadius:12,background:sc.bg,border:`1px solid ${sc.b}`,color:sc.c }}>{b.status?.toUpperCase()}</span>
            {b.status==="pending" && (
              <>
                <button onClick={()=>{ onApprove(b._id); onClose(); }} style={{ padding:"6px 14px",background:"rgba(74,222,128,.1)",border:"1px solid rgba(74,222,128,.3)",borderRadius:8,color:"#4ade80",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'Outfit',sans-serif" }}>✓ Approve</button>
                <button onClick={()=>onReject(b._id)} style={{ padding:"6px 14px",background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.3)",borderRadius:8,color:"#f87171",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'Outfit',sans-serif" }}>✗ Reject</button>
              </>
            )}
            <button onClick={()=>onDocView(b)} style={{ padding:"6px 14px",background:"rgba(6,182,212,.1)",border:"1px solid rgba(6,182,212,.3)",borderRadius:8,color:"#06b6d4",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'Outfit',sans-serif" }}>📄 Docs</button>
            <button onClick={onClose} style={{ width:34,height:34,borderRadius:9,background:"#111827",border:"1px solid #1f2d3d",color:"#64748b",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>✕</button>
          </div>
        </div>

        <div style={{ padding:"26px" }}>

          {/* Flags */}
          <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:22 }}>
            {[["isFeatured","⭐ Featured","#a78bfa"],["isTopRated","🏆 Top Rated","#fbbf24"],["instantBooking","⚡ Instant Booking","#06b6d4"],["isActive","🟢 Active","#4ade80"]].map(([k,l,c])=>
              b[k]?<span key={k} style={{ fontSize:12,fontWeight:600,padding:"4px 12px",borderRadius:20,background:`${c}15`,border:`1px solid ${c}40`,color:c }}>{l}</span>:null
            )}
          </div>

          {/* MAIN IMAGE GALLERY */}
          {allImgs.length > 0 && (
            <Sec title="📸 Cover & Gallery">
              <div style={{ position:"relative",borderRadius:12,overflow:"hidden",cursor:"zoom-in",marginBottom:10 }} onClick={()=>onLightbox({images:allImgs,idx:activeImg})}>
                <img src={allImgs[activeImg]} alt="main" style={{ width:"100%",height:320,objectFit:"cover",display:"block" }} />
                <div style={{ position:"absolute",bottom:10,right:10,background:"rgba(0,0,0,.6)",color:"#fff",fontSize:11,padding:"3px 9px",borderRadius:5,backdropFilter:"blur(4px)" }}>🔍 Click to zoom</div>
                {allImgs.length>1&&(<>
                  <button onClick={e=>{e.stopPropagation();setActiveImg(i=>Math.max(0,i-1));}} disabled={activeImg===0} style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",width:34,height:34,borderRadius:8,background:"rgba(0,0,0,.65)",border:"none",color:activeImg===0?"#333":"#fff",cursor:activeImg===0?"not-allowed":"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center" }}>‹</button>
                  <button onClick={e=>{e.stopPropagation();setActiveImg(i=>Math.min(allImgs.length-1,i+1));}} disabled={activeImg===allImgs.length-1} style={{ position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",width:34,height:34,borderRadius:8,background:"rgba(0,0,0,.65)",border:"none",color:activeImg===allImgs.length-1?"#333":"#fff",cursor:activeImg===allImgs.length-1?"not-allowed":"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center" }}>›</button>
                </>)}
              </div>
              {allImgs.length>1&&(
                <div style={{ display:"flex",gap:8,overflowX:"auto",paddingBottom:4 }}>
                  {allImgs.map((img,i)=>(
                    <div key={i} onClick={()=>setActiveImg(i)} style={{ flexShrink:0,width:74,height:54,borderRadius:8,overflow:"hidden",cursor:"pointer",border:`2px solid ${activeImg===i?"#06b6d4":"transparent"}`,opacity:activeImg===i?1:.5,transition:"all .15s" }}>
                      <img src={img} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                    </div>
                  ))}
                </div>
              )}
            </Sec>
          )}

          {/* Description */}
          {b.description && (
            <div style={{ background:"rgba(6,182,212,.05)",border:"1px solid rgba(6,182,212,.12)",borderRadius:12,padding:"14px 18px",marginBottom:24,color:"#94a3b8",fontSize:13.5,lineHeight:1.7,fontStyle:"italic" }}>"{b.description}"</div>
          )}

          <Sec title="🚢 Basic Info">
            <IG items={[["Property ID",b.propertyId],["Property Name",b.propertyName],["Property Type",b.propertyType],["Boat Size",b.boatSize],["Star Rating",b.starRating?`${"★".repeat(b.starRating)} (${b.starRating})`:null],["Build Year",b.buildYear],["Total Rooms",b.totalRooms],["Total Decks",b.totalDecks],["Max Guests",b.maxGuests],["Added By",b.addedBy]]} />
          </Sec>

          <Sec title="👤 Owner Details">
            <IG items={[["Owner Name",b.ownerName],["Vendor Name",b.vendorName],["Email",b.email],["Phone",b.phone],["Alternate Phone",b.alternatePhone],["GST Number",b.gstNumber],["PAN Number",b.panNumber]]} />
          </Sec>

          <Sec title="📍 Location">
            <IG items={[["Country",b.country],["State",b.state],["City",b.city],["Area",b.area],["Landmark",b.landmark],["Pincode",b.pincode],["Latitude",b.latitude],["Longitude",b.longitude]]} />
            {b.address && <div style={{ marginTop:10,background:"#05080f",border:"1px solid #1f2d3d",borderRadius:9,padding:"10px 14px" }}><div style={{ fontSize:11,color:"#1f3040",marginBottom:4 }}>Full Address</div><div style={{ fontSize:13,color:"#93c5fd" }}>{b.address}</div></div>}
          </Sec>

          <Sec title="💰 Pricing & Timing">
            <IG items={[["Base Price",b.basePrice?`₹${Number(b.basePrice).toLocaleString()}`:null],["Discount Price",b.discountPrice?`₹${Number(b.discountPrice).toLocaleString()}`:null],["Tax",b.taxPercentage?`${b.taxPercentage}%`:null],["Extra Guest Price",b.extraGuestPrice?`₹${b.extraGuestPrice}`:null],["Check-In",b.checkInTime],["Check-Out",b.checkOutTime]]} />
          </Sec>

          {/* Meal Plan */}
          {b.mealPlan && Object.values(b.mealPlan).some(Boolean) && (
            <Sec title="🍽️ Meal Plan">
              <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
                {[["breakfast","🌅 Breakfast"],["lunch","☀️ Lunch"],["dinner","🌙 Dinner"],["welcomeDrink","🥂 Welcome Drink"]].map(([k,l])=>
                  b.mealPlan[k]?<span key={k} style={{ fontSize:12,fontWeight:600,padding:"4px 12px",borderRadius:20,background:"rgba(6,182,212,.1)",border:"1px solid rgba(6,182,212,.25)",color:"#67e8f9" }}>{l}</span>:null
                )}
              </div>
            </Sec>
          )}

          {/* Room Types */}
          {b.roomTypes?.length>0 && (
            <Sec title="🛏 Room Types">
              <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                {b.roomTypes.map((r,i)=>(
                  <div key={i} style={{ background:"#05080f",border:"1px solid #1f2d3d",borderRadius:10,padding:"14px 16px",display:"flex",flexWrap:"wrap",gap:20 }}>
                    <div><div style={{ fontSize:11,color:"#1f3040" }}>Room Name</div><div style={{ fontSize:13,color:"#93c5fd",marginTop:2,fontWeight:600 }}>{r.roomName||"—"}</div></div>
                    <div><div style={{ fontSize:11,color:"#1f3040" }}>Price</div><div style={{ fontSize:13,color:"#4ade80",fontWeight:600,marginTop:2 }}>₹{r.price||"—"}</div></div>
                    <div><div style={{ fontSize:11,color:"#1f3040" }}>Capacity</div><div style={{ fontSize:13,color:"#93c5fd",marginTop:2 }}>{r.capacity||"—"} guests</div></div>
                    <div><div style={{ fontSize:11,color:"#1f3040" }}>Available</div><div style={{ fontSize:13,color:"#4ade80",marginTop:2 }}>{r.availableRooms||0} rooms</div></div>
                    {r.roomImages?.length>0&&(
                      <div style={{ marginLeft:"auto" }}>
                        <div style={{ fontSize:11,color:"#1f3040",marginBottom:6 }}>Room Photos</div>
                        <div style={{ display:"flex",gap:6 }}>
                          {r.roomImages.slice(0,3).map((img,ii)=>(
                            <div key={ii} onClick={()=>onLightbox({images:r.roomImages,idx:ii})} style={{ width:50,height:40,borderRadius:6,overflow:"hidden",cursor:"zoom-in",border:"1px solid #1f2d3d" }}>
                              <img src={img} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Sec>
          )}

          {/* Amenities & Facilities */}
          {(b.amenities?.length>0||b.facilities?.length>0) && (
            <Sec title="✨ Amenities & Facilities">
              {b.amenities?.length>0&&(<div style={{ marginBottom:12 }}><div style={{ fontSize:11,color:"#1f3040",marginBottom:8 }}>AMENITIES</div><div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>{b.amenities.map(a=><span key={a} style={{ fontSize:12,color:"#67e8f9",background:"rgba(6,182,212,.08)",border:"1px solid rgba(6,182,212,.2)",borderRadius:5,padding:"3px 10px" }}>{a}</span>)}</div></div>)}
              {b.facilities?.length>0&&(<div><div style={{ fontSize:11,color:"#1f3040",marginBottom:8 }}>FACILITIES</div><div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>{b.facilities.map(a=><span key={a} style={{ fontSize:12,color:"#a78bfa",background:"rgba(167,139,250,.08)",border:"1px solid rgba(167,139,250,.2)",borderRadius:5,padding:"3px 10px" }}>{a}</span>)}</div></div>)}
            </Sec>
          )}

          {/* Interior & Exterior Images */}
          <GallSec title="🛋️ Interior Images" images={b.interiorImages} />
          <GallSec title="🌊 Exterior Images" images={b.exteriorImages} />

          {/* Videos */}
          {b.houseboatVideos?.length>0 && (
            <Sec title="🎬 Videos">
              <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                {b.houseboatVideos.map((v,i)=>(
                  <a key={i} href={v} target="_blank" rel="noreferrer" style={{ display:"flex",alignItems:"center",gap:8,background:"#05080f",border:"1px solid #1f2d3d",borderRadius:8,padding:"10px 14px",color:"#06b6d4",textDecoration:"none",fontSize:13 }}>
                    🎬 <span style={{ overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{v.split("/").pop()}</span>
                  </a>
                ))}
              </div>
            </Sec>
          )}

          {/* Policies */}
          {(b.houseRules||b.cancellationPolicy||b.childPolicy||b.petPolicy||b.alcoholPolicy) && (
            <Sec title="📋 Policies">
              {[["🏠 House Rules",b.houseRules],["❌ Cancellation",b.cancellationPolicy],["👶 Child Policy",b.childPolicy],["🐾 Pet Policy",b.petPolicy],["🍷 Alcohol Policy",b.alcoholPolicy]].filter(([,v])=>v).map(([l,v])=>(
                <div key={l} style={{ background:"#05080f",border:"1px solid #1f2d3d",borderRadius:9,padding:"12px 14px",marginBottom:10 }}>
                  <div style={{ fontSize:11,color:"#1f3040",marginBottom:6,fontWeight:600 }}>{l}</div>
                  <div style={{ fontSize:13,color:"#64748b",lineHeight:1.6 }}>{v}</div>
                </div>
              ))}
            </Sec>
          )}

          {/* Stats */}
          <Sec title="📊 Statistics">
            <IG items={[["Average Rating",b.averageRating?`★ ${b.averageRating}`:null],["Total Reviews",b.totalReviews],["Total Bookings",b.totalBookings],["Created",b.createdAt?new Date(b.createdAt).toLocaleDateString():null]]} />
            {b.rejectReason && <div style={{ marginTop:12,background:"rgba(248,113,113,.06)",border:"1px solid rgba(248,113,113,.2)",borderRadius:9,padding:"10px 14px" }}><div style={{ fontSize:11,color:"#f87171",fontWeight:600,marginBottom:4 }}>REJECT REASON</div><div style={{ fontSize:13,color:"#f87171" }}>{b.rejectReason}</div></div>}
          </Sec>

        </div>
      </div>
    </div>
  );
}

/* ===================== SMALL COMPONENTS ===================== */
function MW({ children, onClose }) {
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.9)",zIndex:9995,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
      <div style={{ background:"#0b1220",border:"1px solid #1f2d3d",borderRadius:20,padding:"36px 32px",maxWidth:420,width:"100%",animation:"pop .25s ease",position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute",top:14,right:14,width:28,height:28,borderRadius:7,background:"#111827",border:"1px solid #1f2d3d",color:"#64748b",cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit',sans-serif" }}>✕</button>
        {children}
      </div>
    </div>
  );
}
function LbBtn({ children, onClick, disabled }) {
  return <button onClick={onClick} disabled={disabled} style={{ width:36,height:36,borderRadius:8,background:"#111827",border:"1px solid #1f2d3d",color:disabled?"#1f2d3d":"#c8d6e8",cursor:disabled?"not-allowed":"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit',sans-serif" }}>{children}</button>;
}
function FG({ children }) { return <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:18 }}>{children}</div>; }
function FF({ l, children, full }) {
  return <div style={full?{gridColumn:"1/-1"}:{}}>
    <label style={{ display:"block",fontSize:11,color:"#1f3040",fontWeight:600,letterSpacing:".05em",textTransform:"uppercase",marginBottom:7 }}>{l}</label>
    {children}
  </div>;
}
function SL({ children }) { return <div style={{ fontSize:11,color:"#1f3040",fontWeight:700,letterSpacing:".06em",textTransform:"uppercase" }}>{children}</div>; }
function FI({ style, ...props }) { return <input {...props} style={{ width:"100%",padding:"9px 12px",background:"#05080f",border:"1px solid #1f2d3d",borderRadius:8,color:"#c8d6e8",fontSize:13,boxSizing:"border-box",fontFamily:"'Outfit',sans-serif",...style }} />; }
function FS({ children, ...props }) { return <select {...props} style={{ width:"100%",padding:"9px 12px",background:"#05080f",border:"1px solid #1f2d3d",borderRadius:8,color:"#c8d6e8",fontSize:13,cursor:"pointer",boxSizing:"border-box",fontFamily:"'Outfit',sans-serif" }}>{children}</select>; }
function FTA({ style, ...props }) { return <textarea {...props} style={{ width:"100%",padding:"9px 12px",background:"#05080f",border:"1px solid #1f2d3d",borderRadius:8,color:"#c8d6e8",fontSize:13,resize:"vertical",lineHeight:1.6,boxSizing:"border-box",fontFamily:"'Outfit',sans-serif",...style }} />; }
function Chip({ children, on, acc="#06b6d4", onClick }) {
  return <div className="pill" onClick={onClick} style={{ padding:"7px 15px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:500,transition:"all .2s",userSelect:"none",border:`1px solid ${on?acc:`${acc}30`}`,background:on?`${acc}18`:"#0b1220",color:on?acc:"#1f3040" }}>{children}</div>;
}
function Chk({ label, checked, onChange }) {
  return <label style={{ display:"flex",alignItems:"center",gap:9,cursor:"pointer",fontSize:13,color:checked?"#67e8f9":"#4b5563",userSelect:"none" }}>
    <div onClick={onChange} style={{ width:20,height:20,borderRadius:5,border:`2px solid ${checked?"#06b6d4":"#1f2d3d"}`,background:checked?"#06b6d4":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s",cursor:"pointer" }}>
      {checked&&<span style={{ color:"#fff",fontSize:11 }}>✓</span>}
    </div>
    {label}
  </label>;
}
function SmDel({ children, onClick }) { return <button type="button" onClick={onClick} style={{ padding:"3px 12px",background:"rgba(248,113,113,.08)",border:"1px solid rgba(248,113,113,.2)",borderRadius:6,color:"#f87171",cursor:"pointer",fontSize:12,fontFamily:"'Outfit',sans-serif" }}>{children}</button>; }
function AddBtn({ children, onClick }) { return <button type="button" onClick={onClick} style={{ padding:"7px 18px",background:"rgba(6,182,212,.1)",border:"1px solid rgba(6,182,212,.25)",borderRadius:8,color:"#06b6d4",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'Outfit',sans-serif" }}>{children}</button>; }
function GhBtn({ children, onClick }) { return <button type="button" onClick={onClick} style={{ padding:"9px 22px",background:"#111827",border:"1px solid #1f2d3d",borderRadius:8,color:"#64748b",cursor:"pointer",fontSize:13,fontFamily:"'Outfit',sans-serif" }}>{children}</button>; }
function PrBtn({ children, type="button", onClick, disabled }) { return <button type={type} onClick={onClick} disabled={disabled} style={{ padding:"9px 26px",background:disabled?"#1f2d3d":"linear-gradient(135deg,#0891b2,#06b6d4)",border:"none",borderRadius:8,color:disabled?"#334155":"#fff",cursor:disabled?"not-allowed":"pointer",fontSize:13,fontWeight:600,fontFamily:"'Outfit',sans-serif",opacity:disabled?.7:1 }}>{children}</button>; }
function Ab({ children, color, onClick, title }) { return <button className="ab" onClick={onClick} title={title} style={{ width:30,height:30,borderRadius:7,background:`${color}18`,border:`1px solid ${color}30`,color,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s",flexShrink:0,fontFamily:"'Outfit',sans-serif" }}>{children}</button>; }
function PgB({ children, onClick, disabled, active }) { return <button className="ph" onClick={onClick} disabled={disabled} style={{ minWidth:34,height:34,borderRadius:8,border:active?"1px solid #06b6d4":"1px solid #1f2d3d",background:active?"rgba(6,182,212,.14)":"#0b1220",color:active?"#06b6d4":disabled?"#1f2d3d":"#4b5563",cursor:disabled?"not-allowed":"pointer",fontSize:13,fontWeight:active?600:400,fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s" }}>{children}</button>; }