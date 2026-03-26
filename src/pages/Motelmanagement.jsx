import { useState, useEffect, useRef } from "react";

const API = "https://bmtadmin.onrender.com/api/motel";
const PER_PAGE = 8;

const AMENITIES_LIST = [
  "WiFi","AC","TV","Parking","Hot Water","Room Service","Laundry","Restaurant",
  "Swimming Pool","Bar","CCTV","Power Backup","Geyser","Refrigerator","Lift",
  "Security","Garden","Gym","Spa","Conference Room","EV Charging","Wheelchair Access"
];
const BED_TYPES = ["Single Bed","Double Bed","Twin Bed","King Bed","Queen Bed","Bunk Bed"];

const emptyRoom = { roomName:"", pricePerNight:"", maxGuests:"", bedType:"", roomSize:"", amenities:[], isAvailable:true };
const emptyNearby = { placeName:"", distance:"" };

const initialForm = {
  motelName:"", description:"", propertyType:"Motel",
  street:"", area:"", landmark:"", city:"", state:"", country:"India", pincode:"",
  latitude:"", longitude:"", googleMapLink:"",
  nearbyPlaces:[{ ...emptyNearby }],
  contactPerson:"", phone:"", email:"", alternatePhone:"", website:"",
  totalRooms:"", totalFloors:"", buildYear:"",
  roomTypes:[{ ...emptyRoom }],
  amenities:[],
  parkingAvailable:false, restaurantAvailable:false, wifiAvailable:false, poolAvailable:false, barAvailable:false,
  checkInTime:"14:00", checkOutTime:"11:00",
  cancellationPolicy:"", houseRules:"", petPolicy:"",
  basePrice:"", weekendPrice:"", taxPercentage:"", discountPercentage:"",
  vendorId:"",
  isFeatured:false, isTopRated:false, isActive:true,
  // doc numbers
  gstNumber:"", panNumber:"", ownerIdNumber:"", tradeNumber:"",
};

const emptyFiles = {
  thumbnailImage:null,
  propertyImages:[], receptionImages:[], roomImages:[],
  gstImages:[], panImages:[], ownerImages:[], tradeImages:[], chequeImages:[], otherDocs:[],
};
const emptyPrev = {
  thumbnailImage:null,
  propertyImages:[], receptionImages:[], roomImages:[],
  gstImages:[], panImages:[], ownerImages:[], tradeImages:[], chequeImages:[], otherDocs:[],
};

export default function MotelManagement() {
  const [motels, setMotels] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [fileState, setFileState] = useState(emptyFiles);
  const [prevState, setPrevState] = useState(emptyPrev);
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

  // refs for file inputs
  const refs = {
    thumbnailImage: useRef(), propertyImages: useRef(), receptionImages: useRef(),
    roomImages: useRef(), gstImages: useRef(), panImages: useRef(),
    ownerImages: useRef(), tradeImages: useRef(), chequeImages: useRef(), otherDocs: useRef(),
  };

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => setPage(1), [search, filterStatus]);

  const showToast = (msg, type="success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/all-motels`);
      const d = await r.json();
      setMotels(d.data || []);
    } catch { showToast("Failed to load", "error"); }
    finally { setLoading(false); }
  };

  const fc = (e) => { const { name, value, type, checked } = e.target; setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value })); };
  const toggleBool = (k) => setForm(p => ({ ...p, [k]: !p[k] }));
  const toggleAmenity = (val) => setForm(p => ({ ...p, amenities: p.amenities.includes(val) ? p.amenities.filter(x => x !== val) : [...p.amenities, val] }));

  // nearby places
  const nearbyChange = (i, field, val) => setForm(p => { const a = [...p.nearbyPlaces]; a[i] = { ...a[i], [field]: val }; return { ...p, nearbyPlaces: a }; });
  const addNearby = () => setForm(p => ({ ...p, nearbyPlaces: [...p.nearbyPlaces, { ...emptyNearby }] }));
  const removeNearby = (i) => setForm(p => ({ ...p, nearbyPlaces: p.nearbyPlaces.filter((_, ii) => ii !== i) }));

  // room types
  const roomChange = (i, field, val) => setForm(p => { const r = [...p.roomTypes]; r[i] = { ...r[i], [field]: val }; return { ...p, roomTypes: r }; });
  const toggleRoomAmenity = (i, val) => setForm(p => { const r = [...p.roomTypes]; r[i] = { ...r[i], amenities: r[i].amenities.includes(val) ? r[i].amenities.filter(x => x !== val) : [...r[i].amenities, val] }; return { ...p, roomTypes: r }; });
  const addRoom = () => setForm(p => ({ ...p, roomTypes: [...p.roomTypes, { ...emptyRoom }] }));
  const removeRoom = (i) => setForm(p => ({ ...p, roomTypes: p.roomTypes.filter((_, ii) => ii !== i) }));

  // single file
  const handleSingle = (field) => (e) => {
    const f = e.target.files[0]; if (!f) return;
    setFileState(p => ({ ...p, [field]: f }));
    setPrevState(p => ({ ...p, [field]: URL.createObjectURL(f) }));
  };
  // multi file
  const handleMulti = (field, max) => (e) => {
    const fs = Array.from(e.target.files);
    const cur = fileState[field].length;
    if (cur + fs.length > max) { showToast(`Max ${max} images`, "error"); return; }
    setFileState(p => ({ ...p, [field]: [...p[field], ...fs] }));
    setPrevState(p => ({ ...p, [field]: [...p[field], ...fs.map(f => URL.createObjectURL(f))] }));
    if (refs[field]?.current) refs[field].current.value = "";
  };
  const removeMulti = (field, idx) => {
    setFileState(p => ({ ...p, [field]: p[field].filter((_, i) => i !== idx) }));
    setPrevState(p => ({ ...p, [field]: p[field].filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      const fd = new FormData();
      const skip = ["amenities","roomTypes","nearbyPlaces"];
      Object.entries(form).forEach(([k, v]) => { if (!skip.includes(k)) fd.append(k, v ?? ""); });
      fd.set("amenities", form.amenities.join(","));
      form.roomTypes.forEach((r, i) => {
        Object.entries(r).forEach(([k, v]) => {
          if (k === "amenities") r.amenities.forEach(a => fd.append(`roomTypes[${i}][amenities][]`, a));
          else fd.append(`roomTypes[${i}][${k}]`, v ?? "");
        });
      });
      form.nearbyPlaces.filter(n => n.placeName).forEach((n, i) => {
        fd.append(`nearbyPlaces[${i}][placeName]`, n.placeName);
        fd.append(`nearbyPlaces[${i}][distance]`, n.distance);
      });
      ["parkingAvailable","restaurantAvailable","wifiAvailable","poolAvailable","barAvailable","isFeatured","isTopRated","isActive"].forEach(k => fd.set(k, form[k]));

      if (fileState.thumbnailImage) fd.append("thumbnailImage", fileState.thumbnailImage);
      ["propertyImages","receptionImages","roomImages","gstImages","panImages","ownerImages","tradeImages","chequeImages","otherDocs"].forEach(field => {
        fileState[field].forEach(f => fd.append(field, f));
      });

      const method = editId ? "PUT" : "POST";
      const url = editId ? `${API}/update-motel/${editId}` : `${API}/add-motel`;
      const r = await fetch(url, { method, body: fd });
      const d = await r.json();
      if (d.success) { showToast(editId ? "Updated!" : "Motel added!"); resetForm(); fetchAll(); }
      else showToast(d.message || "Error", "error");
    } catch (err) { showToast("Failed: " + err.message, "error"); }
    finally { setSubmitting(false); }
  };

  const resetForm = () => {
    setForm(initialForm); setEditId(null); setActiveTab("basic");
    setFileState(emptyFiles); setPrevState(emptyPrev);
  };

  const handleEdit = (m) => {
    setForm({
      ...initialForm, ...m,
      street: m.address?.street || "", area: m.address?.area || "", landmark: m.address?.landmark || "",
      city: m.address?.city || "", state: m.address?.state || "", country: m.address?.country || "India", pincode: m.address?.pincode || "",
      latitude: m.location?.latitude || "", longitude: m.location?.longitude || "",
      nearbyPlaces: m.nearbyPlaces?.length ? m.nearbyPlaces : [{ ...emptyNearby }],
      roomTypes: m.roomTypes?.length ? m.roomTypes : [{ ...emptyRoom }],
      amenities: m.amenities || [],
      gstNumber: m.documents?.gstCertificate?.documentNumber || "",
      panNumber: m.documents?.panCard?.documentNumber || "",
      ownerIdNumber: m.documents?.ownerIdProof?.documentNumber || "",
      tradeNumber: m.documents?.tradeLicense?.documentNumber || "",
    });
    setPrevState({
      thumbnailImage: m.thumbnailImage || null,
      propertyImages: m.propertyImages || [],
      receptionImages: m.receptionImages || [],
      roomImages: m.roomImages || [],
      gstImages: m.documents?.gstCertificate?.images || [],
      panImages: m.documents?.panCard?.images || [],
      ownerImages: m.documents?.ownerIdProof?.images || [],
      tradeImages: m.documents?.tradeLicense?.images || [],
      chequeImages: m.documents?.cancelledCheque?.images || [],
      otherDocs: m.documents?.otherDocuments?.[0]?.images || [],
    });
    setFileState(emptyFiles);
    setEditId(m._id); setActiveTab("basic");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try { await fetch(`${API}/delete-motel/${id}`, { method: "DELETE" }); showToast("Deleted!"); setDeleteModal(null); fetchAll(); }
    catch { showToast("Delete failed", "error"); }
  };
  const handleApprove = async (id) => {
    try { const r = await fetch(`${API}/approve-motel/${id}`, { method: "PUT" }); const d = await r.json(); if (d.success) { showToast("✓ Approved!"); fetchAll(); } }
    catch { showToast("Failed", "error"); }
  };
  const handleReject = async () => {
    try {
      const r = await fetch(`${API}/reject-motel/${rejectModal}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reason: rejectReason }) });
      const d = await r.json(); if (d.success) { showToast("Rejected"); setRejectModal(null); setRejectReason(""); fetchAll(); }
    } catch { showToast("Failed", "error"); }
  };

  const filtered = motels.filter(m => {
    const q = search.toLowerCase();
    const match = m.motelName?.toLowerCase().includes(q) || m.propertyId?.toLowerCase().includes(q) || m.address?.city?.toLowerCase().includes(q) || m.contactPerson?.toLowerCase().includes(q);
    const s = filterStatus === "all" || m.status === filterStatus;
    return match && s;
  });
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const sColor = (s) => ({
    approved: { c:"#4ade80", bg:"rgba(74,222,128,.08)", b:"rgba(74,222,128,.28)" },
    rejected:  { c:"#f87171", bg:"rgba(248,113,113,.08)", b:"rgba(248,113,113,.28)" },
    pending:   { c:"#fbbf24", bg:"rgba(251,191,36,.08)",  b:"rgba(251,191,36,.28)" },
  }[s] || { c:"#888", bg:"#111", b:"#333" });

  const stats = [
    { l:"Total",    v:motels.length,                              c:"#e879f9" },
    { l:"Approved", v:motels.filter(m=>m.status==="approved").length, c:"#4ade80" },
    { l:"Pending",  v:motels.filter(m=>m.status==="pending").length,  c:"#fbbf24" },
    { l:"Rejected", v:motels.filter(m=>m.status==="rejected").length, c:"#f87171" },
    { l:"Featured", v:motels.filter(m=>m.isFeatured).length,          c:"#38bdf8" },
  ];

  const TABS = [
    { id:"basic",     label:"🏨 Basic"      },
    { id:"location",  label:"📍 Location"   },
    { id:"contact",   label:"📞 Contact"    },
    { id:"rooms",     label:"🛏 Rooms"      },
    { id:"amenities", label:"✨ Amenities"  },
    { id:"images",    label:"🖼 Images"     },
    { id:"documents", label:"📄 Documents"  },
    { id:"pricing",   label:"💰 Pricing"    },
    { id:"policies",  label:"📋 Policies"   },
    { id:"settings",  label:"⚙️ Settings"   },
  ];

  // reusable image grid section in form
  const ImgSection = ({ title, field, max, icon, single }) => (
    <div style={{ marginBottom:28 }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
        <div style={{ fontSize:11,color:"#9333ea",fontWeight:700,letterSpacing:".06em",textTransform:"uppercase" }}>{icon} {title}</div>
        {!single && <span style={{ fontSize:12,color:prevState[field].length>=max?"#f87171":"#3b1f5e",fontWeight:600 }}>{prevState[field].length}/{max}</span>}
      </div>
      <div
        onClick={() => refs[field]?.current?.click()}
        style={{ border:"2px dashed #2d1b4e",borderRadius:14,padding:prevState[field]||prevState[field]?.length>0?"12px":"34px 20px",textAlign:"center",cursor:"pointer",background:"#0b0518",transition:"all .2s",marginBottom:12 }}
        onMouseEnter={e=>{e.currentTarget.style.borderColor="#9333ea";e.currentTarget.style.background="rgba(147,51,234,.05)"}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor="#2d1b4e";e.currentTarget.style.background="#0b0518"}}
      >
        <input ref={refs[field]} type="file" accept="image/*" multiple={!single} style={{ display:"none" }}
          onChange={single ? handleSingle(field) : handleMulti(field, max)} />
        {single ? (
          prevState[field] ? (
            <div style={{ position:"relative",display:"inline-block" }}>
              <img src={prevState[field]} alt="thumb" style={{ maxHeight:180,maxWidth:"100%",borderRadius:10,objectFit:"cover" }} />
              <button type="button" onClick={e=>{e.stopPropagation();setPrevState(p=>({...p,[field]:null}));setFileState(p=>({...p,[field]:null}));}}
                style={{ position:"absolute",top:-8,right:-8,width:22,height:22,borderRadius:"50%",background:"#f87171",border:"none",color:"#fff",cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
            </div>
          ) : (
            <><div style={{ fontSize:32,marginBottom:6 }}>{icon}</div>
            <div style={{ color:"#c084fc",fontSize:13,fontWeight:500 }}>Click to upload {title}</div>
            <div style={{ color:"#3b1f5e",fontSize:12,marginTop:4 }}>PNG, JPG, WEBP</div></>
          )
        ) : (
          (prevState[field]?.length === 0) && (
            <><div style={{ fontSize:28,marginBottom:6 }}>{icon}</div>
            <div style={{ color:"#c084fc",fontSize:13,fontWeight:500 }}>Upload {title}</div>
            <div style={{ color:"#3b1f5e",fontSize:12,marginTop:4 }}>Max {max} images</div></>
          )
        )}
        {!single && prevState[field]?.length > 0 && prevState[field].length < max && (
          <div style={{ color:"#9333ea",fontSize:12,fontWeight:500,marginTop:4 }}>+ Click to add more ({max - prevState[field].length} left)</div>
        )}
      </div>
      {!single && prevState[field]?.length > 0 && (
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:8 }}>
          {prevState[field].map((src, i) => (
            <div key={i} style={{ position:"relative",borderRadius:9,overflow:"hidden",paddingTop:"72%",background:"#0b0518",border:"2px solid #2d1b4e",cursor:"pointer",transition:"border-color .2s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#9333ea"} onMouseLeave={e=>e.currentTarget.style.borderColor="#2d1b4e"}>
              <img src={src} alt="" onClick={() => setLightbox({ images: prevState[field], idx: i })}
                style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover" }} />
              <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,.45)",opacity:0,transition:"opacity .2s",display:"flex",alignItems:"center",justifyContent:"center" }}
                onMouseEnter={e=>{e.currentTarget.style.opacity=1}} onMouseLeave={e=>{e.currentTarget.style.opacity=0}}>
                <span style={{ color:"#fff",fontSize:18 }}>🔍</span>
              </div>
              <button type="button" onClick={() => removeMulti(field, i)}
                style={{ position:"absolute",top:5,right:5,width:20,height:20,borderRadius:"50%",background:"rgba(248,113,113,.9)",border:"none",color:"#fff",cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ fontFamily:"'Nunito',sans-serif", background:"#080514", minHeight:"100vh", color:"#d8ccf0" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&family=Unbounded:wght@600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes tin{from{opacity:0;transform:translateX(36px)}to{opacity:1;transform:translateX(0)}}
        @keyframes pop{from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        *{box-sizing:border-box;margin:0;padding:0}
        input,select,textarea{outline:none;font-family:'Nunito',sans-serif;transition:border .2s,box-shadow .2s}
        input:focus,select:focus,textarea:focus{border-color:#9333ea!important;box-shadow:0 0 0 3px rgba(147,51,234,.14)!important}
        ::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:#080514}::-webkit-scrollbar-thumb{background:#1a0d30;border-radius:4px}
        .rh:hover{background:rgba(147,51,234,.04)!important}
        .ttab:hover{color:#c084fc!important}
        .apill:hover{transform:translateY(-1px)}
        .aab:hover{opacity:.72;transform:scale(.9)}
        .pph:hover:not(:disabled){background:rgba(147,51,234,.13)!important;color:#c084fc!important}
      `}</style>

      {/* TOAST */}
      {toast && <div style={{ position:"fixed",top:18,right:18,zIndex:9999,padding:"12px 22px",borderRadius:10,fontSize:13,fontWeight:600,background:toast.type==="error"?"#170508":"#060f08",border:`1px solid ${toast.type==="error"?"#f87171":"#4ade80"}`,color:toast.type==="error"?"#f87171":"#4ade80",boxShadow:"0 20px 60px rgba(0,0,0,.85)",animation:"tin .25s ease" }}>{toast.type==="error"?"✗ ":"✓ "}{toast.msg}</div>}

      {/* LIGHTBOX */}
      {lightbox && (
        <div onClick={()=>setLightbox(null)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.97)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn .18s ease" }}>
          <div onClick={e=>e.stopPropagation()} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:14 }}>
            <img src={lightbox.images[lightbox.idx]} alt="" style={{ maxWidth:"88vw",maxHeight:"78vh",objectFit:"contain",borderRadius:14,boxShadow:"0 40px 100px rgba(0,0,0,.9)" }} />
            <div style={{ display:"flex",gap:10,alignItems:"center" }}>
              <LbB disabled={lightbox.idx===0} onClick={()=>setLightbox(l=>({...l,idx:Math.max(0,l.idx-1)}))}>‹</LbB>
              <span style={{ color:"#4b5563",fontSize:13 }}>{lightbox.idx+1} / {lightbox.images.length}</span>
              <LbB disabled={lightbox.idx===lightbox.images.length-1} onClick={()=>setLightbox(l=>({...l,idx:Math.min(l.images.length-1,l.idx+1)}))}>›</LbB>
            </div>
          </div>
          <button onClick={()=>setLightbox(null)} style={{ position:"fixed",top:16,right:16,width:38,height:38,borderRadius:10,background:"#111",border:"1px solid #222",color:"#666",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
        </div>
      )}

      {/* DOCUMENT VIEWER MODAL */}
      {docModal && (
        <div onClick={()=>setDocModal(null)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.95)",zIndex:9995,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"#0e0720",border:"1px solid #2d1b4e",borderRadius:20,padding:28,maxWidth:920,width:"100%",maxHeight:"90vh",overflowY:"auto",animation:"pop .28s ease" }}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22 }}>
              <h3 style={{ fontFamily:"'Unbounded',sans-serif",color:"#e9d5ff",fontSize:16 }}>📄 Documents — {docModal.motelName}</h3>
              <button onClick={()=>setDocModal(null)} style={{ width:32,height:32,borderRadius:8,background:"#130826",border:"1px solid #2d1b4e",color:"#64748b",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:14 }}>
              {[
                ["GST Certificate", docModal.documents?.gstCertificate?.documentNumber, docModal.documents?.gstCertificate?.images],
                ["PAN Card", docModal.documents?.panCard?.documentNumber, docModal.documents?.panCard?.images],
                ["Owner ID Proof", docModal.documents?.ownerIdProof?.documentNumber, docModal.documents?.ownerIdProof?.images],
                ["Trade License", docModal.documents?.tradeLicense?.documentNumber, docModal.documents?.tradeLicense?.images],
                ["Cancelled Cheque", null, docModal.documents?.cancelledCheque?.images],
                ["Other Documents", null, docModal.documents?.otherDocuments?.[0]?.images],
              ].map(([label, docNum, imgs]) => (
                <div key={label} style={{ background:"#0b0518",border:"1px solid #2d1b4e",borderRadius:12,overflow:"hidden" }}>
                  <div style={{ padding:"9px 13px",borderBottom:"1px solid #2d1b4e" }}>
                    <div style={{ fontSize:11,color:"#9333ea",fontWeight:700 }}>{label}</div>
                    {docNum && <div style={{ fontSize:12,color:"#c084fc",marginTop:3 }}>#{docNum}</div>}
                  </div>
                  {imgs?.length > 0 ? (
                    <div style={{ display:"grid",gridTemplateColumns:imgs.length>1?"1fr 1fr":"1fr",gap:4,padding:6 }}>
                      {imgs.slice(0,4).map((img, i) => (
                        <div key={i} style={{ position:"relative",paddingTop:"70%",borderRadius:7,overflow:"hidden",cursor:"zoom-in" }} onClick={()=>setLightbox({images:imgs,idx:i})}>
                          <img src={img} alt="" style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover" }} />
                          {i===3 && imgs.length>4 && <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:16,fontWeight:700 }}>+{imgs.length-4}</div>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding:"24px 13px",textAlign:"center",color:"#2d1b4e",fontSize:12 }}>Not uploaded</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectModal && (
        <MW onClose={()=>{setRejectModal(null);setRejectReason("");}}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:44,marginBottom:12 }}>🚫</div>
            <h3 style={{ fontFamily:"'Unbounded',sans-serif",color:"#f87171",marginBottom:8,fontSize:16 }}>Reject Motel?</h3>
            <p style={{ color:"#4b5563",fontSize:13,marginBottom:16,lineHeight:1.6 }}>Provide a reason for rejection (optional)</p>
            <textarea value={rejectReason} onChange={e=>setRejectReason(e.target.value)} rows={3} placeholder="Reason for rejection..."
              style={{ width:"100%",padding:"10px 12px",background:"#0b0518",border:"1px solid #2d1b4e",borderRadius:8,color:"#d8ccf0",fontSize:13,resize:"vertical",marginBottom:18,fontFamily:"'Nunito',sans-serif" }} />
            <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
              <GhB onClick={()=>{setRejectModal(null);setRejectReason("");}}>Cancel</GhB>
              <button onClick={handleReject} style={{ padding:"9px 22px",background:"#f87171",border:"none",borderRadius:8,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"'Nunito',sans-serif" }}>Reject</button>
            </div>
          </div>
        </MW>
      )}

      {/* DELETE MODAL */}
      {deleteModal && (
        <MW onClose={()=>setDeleteModal(null)}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:46,marginBottom:12 }}>🏨</div>
            <h3 style={{ fontFamily:"'Unbounded',sans-serif",color:"#f87171",marginBottom:8,fontSize:16 }}>Delete Motel?</h3>
            <p style={{ color:"#4b5563",fontSize:13,marginBottom:26,lineHeight:1.6 }}>This will permanently remove this motel and all its data.</p>
            <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
              <GhB onClick={()=>setDeleteModal(null)}>Cancel</GhB>
              <button onClick={()=>handleDelete(deleteModal)} style={{ padding:"9px 22px",background:"#f87171",border:"none",borderRadius:8,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"'Nunito',sans-serif" }}>Delete</button>
            </div>
          </div>
        </MW>
      )}

      {/* VIEW MODAL */}
      {viewData && <ViewModal data={viewData} onClose={()=>setViewData(null)} sColor={sColor} onLightbox={setLightbox} onDocView={setDocModal} onApprove={(id)=>{handleApprove(id);setViewData(null);}} onReject={(id)=>{setViewData(null);setRejectModal(id);}} />}

      <div style={{ maxWidth:1520,margin:"0 auto",padding:"32px 20px" }}>

        {/* HEADER */}
        <div style={{ marginBottom:32 }}>
          <div style={{ display:"flex",alignItems:"center",gap:16,marginBottom:22 }}>
            <div style={{ width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,#7e22ce,#9333ea)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,flexShrink:0,boxShadow:"0 8px 28px rgba(147,51,234,.45)" }}>🏨</div>
            <div>
              <h1 style={{ fontFamily:"'Unbounded',sans-serif",fontSize:28,fontWeight:800,color:"#f3e8ff",lineHeight:1 }}>Motel Management</h1>
              <p style={{ color:"#3b1f5e",fontSize:13,marginTop:6 }}>Manage motel properties, approvals and documents</p>
            </div>
          </div>
          <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
            {stats.map(s => (
              <div key={s.l} style={{ background:"#0e0720",border:"1px solid #2d1b4e",borderRadius:14,padding:"14px 22px",minWidth:100 }}>
                <div style={{ fontSize:26,fontWeight:700,color:s.c,fontFamily:"'Unbounded',sans-serif" }}>{s.v}</div>
                <div style={{ fontSize:12,color:"#3b1f5e",marginTop:3 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== FORM ===== */}
        <div style={{ background:"#0e0720",border:"1px solid #2d1b4e",borderRadius:20,marginBottom:36,overflow:"hidden",animation:"up .35s ease" }}>
          <div style={{ padding:"18px 28px",borderBottom:"1px solid #2d1b4e",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#0b0518" }}>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <span style={{ fontSize:18 }}>{editId?"✏️":"➕"}</span>
              <span style={{ fontFamily:"'Unbounded',sans-serif",fontWeight:700,fontSize:16,color:"#f3e8ff" }}>{editId?"Edit Motel":"Add New Motel"}</span>
            </div>
            {editId && <button onClick={resetForm} style={{ padding:"7px 18px",background:"#130826",border:"1px solid #2d1b4e",borderRadius:8,color:"#64748b",cursor:"pointer",fontSize:12,fontFamily:"'Nunito',sans-serif" }}>✕ Cancel</button>}
          </div>

          {/* TABS */}
          <div style={{ display:"flex",overflowX:"auto",background:"#0b0518",borderBottom:"1px solid #2d1b4e",padding:"0 20px",gap:2 }}>
            {TABS.map(t => (
              <button key={t.id} className="ttab" onClick={()=>setActiveTab(t.id)}
                style={{ padding:"13px 15px",background:"transparent",border:"none",borderBottom:activeTab===t.id?"2px solid #9333ea":"2px solid transparent",color:activeTab===t.id?"#c084fc":"#3b1f5e",cursor:"pointer",fontSize:12.5,fontWeight:600,whiteSpace:"nowrap",transition:"color .2s",fontFamily:"'Nunito',sans-serif" }}>
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ padding:"28px" }}>

              {/* BASIC */}
              {activeTab==="basic" && (
                <FG>
                  <FF l="Motel Name *"><FI name="motelName" value={form.motelName} onChange={fc} placeholder="Highway Inn" required /></FF>
                  <FF l="Property Type"><FI name="propertyType" value={form.propertyType} onChange={fc} /></FF>
                  <FF l="Total Rooms"><FI type="number" name="totalRooms" value={form.totalRooms} onChange={fc} placeholder="25" /></FF>
                  <FF l="Total Floors"><FI type="number" name="totalFloors" value={form.totalFloors} onChange={fc} placeholder="3" /></FF>
                  <FF l="Build Year"><FI name="buildYear" value={form.buildYear} onChange={fc} placeholder="2015" /></FF>
                  <FF l="Vendor ID"><FI name="vendorId" value={form.vendorId} onChange={fc} placeholder="VND001" /></FF>
                  <FF l="Description" full><FTA name="description" value={form.description} onChange={fc} placeholder="Describe this motel..." rows={4} /></FF>
                </FG>
              )}

              {/* LOCATION */}
              {activeTab==="location" && (
                <div style={{ display:"flex",flexDirection:"column",gap:22 }}>
                  <FG>
                    <FF l="Street"><FI name="street" value={form.street} onChange={fc} placeholder="NH-48, Opp. Highway Plaza" /></FF>
                    <FF l="Area"><FI name="area" value={form.area} onChange={fc} placeholder="Chandigarh Road" /></FF>
                    <FF l="Landmark"><FI name="landmark" value={form.landmark} onChange={fc} placeholder="Near Petrol Pump" /></FF>
                    <FF l="City"><FI name="city" value={form.city} onChange={fc} placeholder="Ambala" /></FF>
                    <FF l="State"><FI name="state" value={form.state} onChange={fc} placeholder="Haryana" /></FF>
                    <FF l="Country"><FI name="country" value={form.country} onChange={fc} /></FF>
                    <FF l="Pincode"><FI name="pincode" value={form.pincode} onChange={fc} placeholder="134003" /></FF>
                    <FF l="Latitude"><FI name="latitude" value={form.latitude} onChange={fc} placeholder="30.3782" /></FF>
                    <FF l="Longitude"><FI name="longitude" value={form.longitude} onChange={fc} placeholder="76.7731" /></FF>
                    <FF l="Google Map Link" full><FI name="googleMapLink" value={form.googleMapLink} onChange={fc} placeholder="https://maps.google.com/..." /></FF>
                  </FG>
                  <div>
                    <SL>📍 Nearby Places</SL>
                    <div style={{ display:"flex",flexDirection:"column",gap:10,marginTop:12 }}>
                      {form.nearbyPlaces.map((n, i) => (
                        <div key={i} style={{ display:"flex",gap:8,alignItems:"center" }}>
                          <FI value={n.placeName} onChange={e=>nearbyChange(i,"placeName",e.target.value)} placeholder="Place name..." style={{ flex:2 }} />
                          <FI value={n.distance} onChange={e=>nearbyChange(i,"distance",e.target.value)} placeholder="Distance (e.g. 2 km)" style={{ flex:1 }} />
                          {form.nearbyPlaces.length>1 && <SmD onClick={()=>removeNearby(i)}>✕</SmD>}
                        </div>
                      ))}
                      <AddB onClick={addNearby}>+ Add Nearby Place</AddB>
                    </div>
                  </div>
                </div>
              )}

              {/* CONTACT */}
              {activeTab==="contact" && (
                <FG>
                  <FF l="Contact Person"><FI name="contactPerson" value={form.contactPerson} onChange={fc} placeholder="Rajesh Sharma" /></FF>
                  <FF l="Phone"><FI name="phone" value={form.phone} onChange={fc} placeholder="+91 98765 43210" /></FF>
                  <FF l="Email"><FI type="email" name="email" value={form.email} onChange={fc} placeholder="motel@email.com" /></FF>
                  <FF l="Alternate Phone"><FI name="alternatePhone" value={form.alternatePhone} onChange={fc} placeholder="+91 98765 43211" /></FF>
                  <FF l="Website"><FI name="website" value={form.website} onChange={fc} placeholder="https://motel.com" /></FF>
                </FG>
              )}

              {/* ROOMS */}
              {activeTab==="rooms" && (
                <div>
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18 }}>
                    <SL>Room Types</SL>
                    <AddB onClick={addRoom}>+ Add Room Type</AddB>
                  </div>
                  {form.roomTypes.map((r, i) => (
                    <div key={i} style={{ background:"#0b0518",border:"1px solid #2d1b4e",borderRadius:14,padding:20,marginBottom:14 }}>
                      <div style={{ display:"flex",justifyContent:"space-between",marginBottom:16 }}>
                        <span style={{ fontSize:13,color:"#9333ea",fontWeight:700 }}>Room Type {i+1}</span>
                        {form.roomTypes.length>1 && <SmD onClick={()=>removeRoom(i)}>Remove</SmD>}
                      </div>
                      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12,marginBottom:14 }}>
                        {[["roomName","Room Name","Deluxe"],["pricePerNight","Price/Night (₹)","2500"],["maxGuests","Max Guests","2"],["roomSize","Room Size","250 sqft"]].map(([f,l,p])=>(
                          <div key={f}>
                            <label style={{ display:"block",fontSize:11,color:"#3b1f5e",fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",marginBottom:6 }}>{l}</label>
                            <input type={f==="roomName"||f==="roomSize"?"text":"number"} value={r[f]} onChange={e=>roomChange(i,f,e.target.value)} placeholder={p}
                              style={{ width:"100%",padding:"9px 11px",background:"#080514",border:"1px solid #2d1b4e",borderRadius:8,color:"#d8ccf0",fontSize:13,fontFamily:"'Nunito',sans-serif",boxSizing:"border-box" }} />
                          </div>
                        ))}
                        <div>
                          <label style={{ display:"block",fontSize:11,color:"#3b1f5e",fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",marginBottom:6 }}>Bed Type</label>
                          <select value={r.bedType} onChange={e=>roomChange(i,"bedType",e.target.value)}
                            style={{ width:"100%",padding:"9px 11px",background:"#080514",border:"1px solid #2d1b4e",borderRadius:8,color:"#d8ccf0",fontSize:13,fontFamily:"'Nunito',sans-serif",cursor:"pointer" }}>
                            <option value="">Select</option>
                            {BED_TYPES.map(b=><option key={b}>{b}</option>)}
                          </select>
                        </div>
                        <div style={{ display:"flex",alignItems:"flex-end" }}>
                          <Chk label="Available" checked={r.isAvailable} onChange={()=>roomChange(i,"isAvailable",!r.isAvailable)} />
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize:11,color:"#3b1f5e",fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",marginBottom:8 }}>Room Amenities</div>
                        <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                          {["WiFi","AC","TV","Hot Water","Geyser","Balcony"].map(a=>{
                            const on=r.amenities.includes(a);
                            return <div key={a} className="apill" onClick={()=>toggleRoomAmenity(i,a)}
                              style={{ padding:"4px 12px",borderRadius:14,cursor:"pointer",fontSize:12,fontWeight:500,transition:"all .2s",userSelect:"none",border:`1px solid ${on?"#9333ea":"#2d1b4e"}`,background:on?"rgba(147,51,234,.14)":"#080514",color:on?"#c084fc":"#3b1f5e" }}>
                              {on&&"✓ "}{a}
                            </div>;
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16,marginTop:20 }}>
                    <FF l="Check-In Time"><FI type="time" name="checkInTime" value={form.checkInTime} onChange={fc} /></FF>
                    <FF l="Check-Out Time"><FI type="time" name="checkOutTime" value={form.checkOutTime} onChange={fc} /></FF>
                  </div>
                </div>
              )}

              {/* AMENITIES */}
              {activeTab==="amenities" && (
                <div style={{ display:"flex",flexDirection:"column",gap:26 }}>
                  <div>
                    <SL>Property Amenities</SL>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginTop:14 }}>
                      {AMENITIES_LIST.map(a=>{const on=form.amenities.includes(a);return <Chip key={a} on={on} onClick={()=>toggleAmenity(a)}>{on&&"✓ "}{a}</Chip>;})}
                    </div>
                  </div>
                  <div>
                    <SL>Quick Toggles</SL>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:18,marginTop:14 }}>
                      {[["parkingAvailable","🅿️ Parking"],["restaurantAvailable","🍽️ Restaurant"],["wifiAvailable","📶 WiFi"],["poolAvailable","🏊 Pool"],["barAvailable","🍷 Bar"]].map(([k,l])=>(
                        <Chk key={k} label={l} checked={form[k]} onChange={()=>toggleBool(k)} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* IMAGES */}
              {activeTab==="images" && (
                <div>
                  <ImgSection title="Thumbnail Image" field="thumbnailImage" max={1} icon="🏨" single />
                  <ImgSection title="Property Images" field="propertyImages" max={20} icon="🏠" />
                  <ImgSection title="Reception Images" field="receptionImages" max={20} icon="🛎️" />
                  <ImgSection title="Room Images" field="roomImages" max={30} icon="🛏" />
                </div>
              )}

              {/* DOCUMENTS */}
              {activeTab==="documents" && (
                <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                  <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:18,marginBottom:20 }}>
                    <FF l="GST Number"><FI name="gstNumber" value={form.gstNumber} onChange={fc} placeholder="27AAPFU0939F1ZV" /></FF>
                    <FF l="PAN Number"><FI name="panNumber" value={form.panNumber} onChange={fc} placeholder="ABCDE1234F" /></FF>
                    <FF l="Owner ID Number"><FI name="ownerIdNumber" value={form.ownerIdNumber} onChange={fc} placeholder="Aadhar/Voter ID No." /></FF>
                    <FF l="Trade License Number"><FI name="tradeNumber" value={form.tradeNumber} onChange={fc} placeholder="TL-2024-001" /></FF>
                  </div>
                  <ImgSection title="GST Certificate" field="gstImages" max={5} icon="📄" />
                  <ImgSection title="PAN Card" field="panImages" max={5} icon="🪪" />
                  <ImgSection title="Owner ID Proof" field="ownerImages" max={5} icon="👤" />
                  <ImgSection title="Trade License" field="tradeImages" max={5} icon="📋" />
                  <ImgSection title="Cancelled Cheque" field="chequeImages" max={5} icon="🏦" />
                  <ImgSection title="Other Documents" field="otherDocs" max={10} icon="📁" />
                </div>
              )}

              {/* PRICING */}
              {activeTab==="pricing" && (
                <FG>
                  <FF l="Base Price (₹)"><FI type="number" name="basePrice" value={form.basePrice} onChange={fc} placeholder="1500" /></FF>
                  <FF l="Weekend Price (₹)"><FI type="number" name="weekendPrice" value={form.weekendPrice} onChange={fc} placeholder="2000" /></FF>
                  <FF l="Tax (%)"><FI type="number" name="taxPercentage" value={form.taxPercentage} onChange={fc} placeholder="12" /></FF>
                  <FF l="Discount (%)"><FI type="number" name="discountPercentage" value={form.discountPercentage} onChange={fc} placeholder="10" /></FF>
                </FG>
              )}

              {/* POLICIES */}
              {activeTab==="policies" && (
                <FG>
                  <FF l="Cancellation Policy" full><FTA name="cancellationPolicy" value={form.cancellationPolicy} onChange={fc} placeholder="Free cancellation 24 hours before check-in..." rows={3} /></FF>
                  <FF l="House Rules" full><FTA name="houseRules" value={form.houseRules} onChange={fc} placeholder="No smoking, no loud music after 10 PM..." rows={3} /></FF>
                  <FF l="Pet Policy"><FTA name="petPolicy" value={form.petPolicy} onChange={fc} placeholder="Pets not allowed..." rows={2} /></FF>
                </FG>
              )}

              {/* SETTINGS */}
              {activeTab==="settings" && (
                <div style={{ display:"flex",flexDirection:"column",gap:24 }}>
                  <FG>
                    <FF l="Status">
                      <FS name="status" value={form.status||"pending"} onChange={fc}>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </FS>
                    </FF>
                    <FF l="Rating (0-5)"><FI type="number" name="rating" value={form.rating||0} onChange={fc} min="0" max="5" step="0.1" /></FF>
                  </FG>
                  <div style={{ display:"flex",flexWrap:"wrap",gap:20 }}>
                    {[["isFeatured","⭐ Featured"],["isTopRated","🏆 Top Rated"],["isActive","🟢 Active"]].map(([k,l])=>(
                      <Chk key={k} label={l} checked={form[k]} onChange={()=>toggleBool(k)} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding:"16px 28px",borderTop:"1px solid #2d1b4e",display:"flex",gap:10,justifyContent:"flex-end",background:"#0b0518" }}>
              <GhB onClick={resetForm}>Reset</GhB>
              <PrB type="submit" disabled={submitting}>{submitting?"Saving...":editId?"Update Motel":"Add Motel"}</PrB>
            </div>
          </form>
        </div>

        {/* ===== TABLE ===== */}
        <div style={{ background:"#0e0720",border:"1px solid #2d1b4e",borderRadius:20,overflow:"hidden",animation:"up .45s ease" }}>
          <div style={{ padding:"18px 24px",borderBottom:"1px solid #2d1b4e",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,background:"#0b0518" }}>
            <div style={{ fontFamily:"'Unbounded',sans-serif",fontWeight:700,fontSize:16,color:"#f3e8ff" }}>
              All Motels <span style={{ color:"#3b1f5e",fontSize:13,fontWeight:400 }}>({filtered.length})</span>
            </div>
            <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search motel, city, contact..."
                style={{ padding:"8px 14px",background:"#080514",border:"1px solid #2d1b4e",borderRadius:8,color:"#d8ccf0",fontSize:13,width:240,fontFamily:"'Nunito',sans-serif" }} />
              <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
                style={{ padding:"8px 12px",background:"#080514",border:"1px solid #2d1b4e",borderRadius:8,color:"#d8ccf0",fontSize:13,cursor:"pointer",fontFamily:"'Nunito',sans-serif" }}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <button onClick={fetchAll} style={{ padding:"8px 14px",background:"#130826",border:"1px solid #2d1b4e",borderRadius:8,color:"#64748b",cursor:"pointer",fontSize:13,fontFamily:"'Nunito',sans-serif" }}>↺</button>
            </div>
          </div>

          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
              <thead>
                <tr style={{ background:"#080514",borderBottom:"1px solid #2d1b4e" }}>
                  {["#","Motel","Contact","Location","Rooms","Price","Status","Flags","Actions"].map(h=>(
                    <th key={h} style={{ padding:"11px 14px",textAlign:"left",color:"#3b1f5e",fontWeight:700,fontSize:11,letterSpacing:".07em",textTransform:"uppercase",whiteSpace:"nowrap",fontFamily:"'Nunito',sans-serif" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} style={{ padding:60,textAlign:"center",color:"#2d1b4e" }}><div style={{ fontSize:36,marginBottom:10 }}>⏳</div>Loading...</td></tr>
                ) : paginated.length===0 ? (
                  <tr><td colSpan={9} style={{ padding:60,textAlign:"center",color:"#2d1b4e" }}><div style={{ fontSize:40,marginBottom:10 }}>🏨</div>No motels found</td></tr>
                ) : paginated.map((m, i) => {
                  const sc = sColor(m.status);
                  return (
                    <tr key={m._id} className="rh" style={{ borderBottom:"1px solid #10082a",transition:"background .15s" }}>
                      <td style={{ padding:"13px 14px",color:"#2d1b4e",fontWeight:600 }}>{(page-1)*PER_PAGE+i+1}</td>

                      <td style={{ padding:"13px 14px" }}>
                        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                          <div style={{ width:48,height:38,borderRadius:8,overflow:"hidden",background:"#0b0518",border:"1px solid #2d1b4e",flexShrink:0 }}>
                            {m.thumbnailImage ? <img src={m.thumbnailImage} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                              : <div style={{ width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"#2d1b4e" }}>🏨</div>}
                          </div>
                          <div>
                            <div style={{ fontWeight:700,color:"#f3e8ff" }}>{m.motelName}</div>
                            <div style={{ fontSize:11,color:"#9333ea",marginTop:1 }}>{m.propertyId}</div>
                            {m.rating>0 && <div style={{ fontSize:10,color:"#fbbf24",marginTop:2 }}>{"★".repeat(Math.round(m.rating))} {m.rating.toFixed(1)}</div>}
                          </div>
                        </div>
                      </td>

                      <td style={{ padding:"13px 14px" }}>
                        <div style={{ color:"#c084fc" }}>{m.contactPerson||"—"}</div>
                        <div style={{ fontSize:11,color:"#3b1f5e",marginTop:2 }}>{m.phone}</div>
                        {m.email && <div style={{ fontSize:11,color:"#3b1f5e",marginTop:1 }}>{m.email}</div>}
                      </td>

                      <td style={{ padding:"13px 14px",color:"#4b5563" }}>
                        <div>{m.address?.city}{m.address?.state?`, ${m.address?.state}`:""}</div>
                        {m.address?.landmark && <div style={{ fontSize:11,color:"#3b1f5e",marginTop:1 }}>{m.address.landmark}</div>}
                      </td>

                      <td style={{ padding:"13px 14px" }}>
                        <div style={{ color:"#c084fc",fontWeight:600 }}>{m.totalRooms||"—"} rooms</div>
                        {m.totalFloors && <div style={{ fontSize:11,color:"#3b1f5e",marginTop:1 }}>{m.totalFloors} floors</div>}
                      </td>

                      <td style={{ padding:"13px 14px" }}>
                        {m.basePrice ? <div style={{ color:"#4ade80",fontWeight:700 }}>₹{Number(m.basePrice).toLocaleString()}</div> : <span style={{ color:"#2d1b4e" }}>—</span>}
                        {m.weekendPrice && <div style={{ fontSize:11,color:"#c084fc",marginTop:1 }}>Wknd: ₹{Number(m.weekendPrice).toLocaleString()}</div>}
                        {m.taxPercentage && <div style={{ fontSize:11,color:"#3b1f5e" }}>+{m.taxPercentage}% tax</div>}
                      </td>

                      <td style={{ padding:"13px 14px" }}>
                        <span style={{ fontSize:11,fontWeight:700,padding:"4px 11px",borderRadius:12,background:sc.bg,border:`1px solid ${sc.b}`,color:sc.c,display:"inline-block" }}>{m.status?.toUpperCase()}</span>
                        {m.rejectionReason && <div style={{ fontSize:10,color:"#f87171",marginTop:4,maxWidth:110,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }} title={m.rejectionReason}>↳ {m.rejectionReason}</div>}
                      </td>

                      <td style={{ padding:"13px 14px" }}>
                        <div style={{ display:"flex",gap:3,flexWrap:"wrap" }}>
                          {m.isFeatured && <span style={{ fontSize:10,padding:"2px 6px",borderRadius:4,background:"rgba(56,189,248,.1)",border:"1px solid rgba(56,189,248,.3)",color:"#38bdf8" }}>⭐</span>}
                          {m.isTopRated && <span style={{ fontSize:10,padding:"2px 6px",borderRadius:4,background:"rgba(251,191,36,.1)",border:"1px solid rgba(251,191,36,.3)",color:"#fbbf24" }}>🏆</span>}
                          {m.wifiAvailable && <span style={{ fontSize:10,padding:"2px 6px",borderRadius:4,background:"rgba(74,222,128,.1)",border:"1px solid rgba(74,222,128,.3)",color:"#4ade80" }}>📶</span>}
                          {!m.isActive && <span style={{ fontSize:10,padding:"2px 6px",borderRadius:4,background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.3)",color:"#f87171" }}>OFF</span>}
                        </div>
                      </td>

                      <td style={{ padding:"13px 14px" }}>
                        <div style={{ display:"flex",gap:4,flexWrap:"nowrap" }}>
                          <AB c="#c084fc" onClick={()=>setViewData(m)} t="View">👁</AB>
                          <AB c="#60a5fa" onClick={()=>handleEdit(m)} t="Edit">✎</AB>
                          {m.status!=="approved" && <AB c="#4ade80" onClick={()=>handleApprove(m._id)} t="Approve">✓</AB>}
                          {m.status!=="rejected" && <AB c="#f87171" onClick={()=>setRejectModal(m._id)} t="Reject">✗</AB>}
                          <AB c="#94a3b8" onClick={()=>setDocModal(m)} t="Documents">📄</AB>
                          <AB c="#f87171" onClick={()=>setDeleteModal(m._id)} t="Delete">🗑</AB>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{ padding:"14px 24px",borderTop:"1px solid #2d1b4e",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,background:"#0b0518" }}>
              <div style={{ fontSize:13,color:"#3b1f5e" }}>Showing {Math.min((page-1)*PER_PAGE+1,filtered.length)}–{Math.min(page*PER_PAGE,filtered.length)} of {filtered.length}</div>
              <div style={{ display:"flex",gap:5,alignItems:"center" }}>
                <PgB disabled={page===1} onClick={()=>setPage(1)}>«</PgB>
                <PgB disabled={page===1} onClick={()=>setPage(p=>p-1)}>‹</PgB>
                {Array.from({length:totalPages},(_,i)=>i+1).filter(p=>p===1||p===totalPages||Math.abs(p-page)<=1).reduce((acc,p,idx,arr)=>{if(idx>0&&p-arr[idx-1]>1)acc.push("...");acc.push(p);return acc;},[])
                  .map((p,idx)=>p==="..."?<span key={`d${idx}`} style={{ color:"#3b1f5e",padding:"0 4px",fontSize:13 }}>•••</span>:<PgB key={p} active={page===p} onClick={()=>setPage(p)}>{p}</PgB>)}
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

/* ============================= VIEW MODAL ============================= */
function ViewModal({ data:m, onClose, sColor, onLightbox, onDocView, onApprove, onReject }) {
  const sc = sColor(m.status);
  const allImgs = [m.thumbnailImage, ...(m.propertyImages||[])].filter(Boolean);
  const [activeImg, setActiveImg] = useState(0);

  const IC = ({ label, value }) => value!==null&&value!==undefined&&value!==""&&value!==0 ? (
    <div style={{ background:"#080514",border:"1px solid #2d1b4e",borderRadius:9,padding:"10px 14px" }}>
      <div style={{ fontSize:11,color:"#3b1f5e",marginBottom:4 }}>{label}</div>
      <div style={{ fontSize:13,color:"#c084fc",wordBreak:"break-all" }}>{String(value)}</div>
    </div>
  ) : null;

  const Sec = ({ title, children }) => (
    <div style={{ marginBottom:24 }}>
      <div style={{ fontSize:11,color:"#9333ea",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",marginBottom:12,paddingBottom:7,borderBottom:"1px solid #2d1b4e" }}>{title}</div>
      {children}
    </div>
  );
  const IG = ({ items }) => (
    <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10 }}>
      {items.map(([l,v])=><IC key={l} label={l} value={v} />)}
    </div>
  );
  const SmGal = ({ title, images }) => images?.length>0 && (
    <Sec title={title}>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:8 }}>
        {images.map((img,i)=>(
          <div key={i} onClick={()=>onLightbox({images,idx:i})} style={{ position:"relative",paddingTop:"68%",borderRadius:9,overflow:"hidden",cursor:"zoom-in",background:"#080514",border:"1px solid #2d1b4e" }}>
            <img src={img} alt="" style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover" }} />
            <div style={{ position:"absolute",bottom:4,right:4,background:"rgba(0,0,0,.6)",color:"#fff",fontSize:9,padding:"2px 6px",borderRadius:4 }}>🔍</div>
          </div>
        ))}
      </div>
    </Sec>
  );

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.93)",zIndex:9990,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:20,overflowY:"auto" }}>
      <div style={{ background:"#0e0720",border:"1px solid #2d1b4e",borderRadius:20,width:"100%",maxWidth:960,animation:"pop .3s ease",marginTop:10,marginBottom:10 }}>

        {/* Header */}
        <div style={{ padding:"20px 26px",borderBottom:"1px solid #2d1b4e",display:"flex",alignItems:"flex-start",justifyContent:"space-between",background:"#0b0518",borderRadius:"20px 20px 0 0",gap:12,flexWrap:"wrap" }}>
          <div style={{ flex:1 }}>
            <h2 style={{ fontFamily:"'Unbounded',sans-serif",fontSize:20,fontWeight:800,color:"#f3e8ff",margin:0 }}>{m.motelName}</h2>
            <div style={{ fontSize:12,color:"#9333ea",marginTop:3 }}>{m.propertyId} • {m.propertyType}</div>
            <div style={{ fontSize:12,color:"#3b1f5e",marginTop:2 }}>{m.address?.city}{m.address?.state?`, ${m.address?.state}`:""}</div>
          </div>
          <div style={{ display:"flex",gap:8,alignItems:"center",flexWrap:"wrap" }}>
            <span style={{ fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:12,background:sc.bg,border:`1px solid ${sc.b}`,color:sc.c }}>{m.status?.toUpperCase()}</span>
            {m.status==="pending" && (
              <>
                <button onClick={()=>{onApprove(m._id);onClose();}} style={{ padding:"6px 14px",background:"rgba(74,222,128,.1)",border:"1px solid rgba(74,222,128,.3)",borderRadius:8,color:"#4ade80",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'Nunito',sans-serif" }}>✓ Approve</button>
                <button onClick={()=>onReject(m._id)} style={{ padding:"6px 14px",background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.3)",borderRadius:8,color:"#f87171",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'Nunito',sans-serif" }}>✗ Reject</button>
              </>
            )}
            <button onClick={()=>onDocView(m)} style={{ padding:"6px 14px",background:"rgba(147,51,234,.1)",border:"1px solid rgba(147,51,234,.3)",borderRadius:8,color:"#c084fc",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'Nunito',sans-serif" }}>📄 Docs</button>
            <button onClick={onClose} style={{ width:34,height:34,borderRadius:9,background:"#130826",border:"1px solid #2d1b4e",color:"#64748b",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>✕</button>
          </div>
        </div>

        <div style={{ padding:"26px" }}>

          {/* Flags */}
          <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:22 }}>
            {[["isFeatured","⭐ Featured","#38bdf8"],["isTopRated","🏆 Top Rated","#fbbf24"],["isActive","🟢 Active","#4ade80"],["parkingAvailable","🅿️ Parking","#94a3b8"],["restaurantAvailable","🍽️ Restaurant","#fb923c"],["wifiAvailable","📶 WiFi","#34d399"],["poolAvailable","🏊 Pool","#06b6d4"],["barAvailable","🍷 Bar","#f472b6"]].map(([k,l,c])=>
              m[k]?<span key={k} style={{ fontSize:12,fontWeight:600,padding:"4px 12px",borderRadius:20,background:`${c}15`,border:`1px solid ${c}40`,color:c }}>{l}</span>:null
            )}
          </div>

          {/* MAIN IMAGE GALLERY */}
          {allImgs.length > 0 && (
            <Sec title="📸 Photos">
              <div style={{ position:"relative",borderRadius:12,overflow:"hidden",cursor:"zoom-in",marginBottom:10 }} onClick={()=>onLightbox({images:allImgs,idx:activeImg})}>
                <img src={allImgs[activeImg]} alt="" style={{ width:"100%",height:310,objectFit:"cover",display:"block" }} />
                <div style={{ position:"absolute",bottom:10,right:10,background:"rgba(0,0,0,.6)",color:"#fff",fontSize:11,padding:"3px 9px",borderRadius:5 }}>🔍 Click to zoom</div>
                {allImgs.length>1 && (<>
                  <button onClick={e=>{e.stopPropagation();setActiveImg(i=>Math.max(0,i-1));}} disabled={activeImg===0} style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",width:34,height:34,borderRadius:8,background:"rgba(0,0,0,.65)",border:"none",color:activeImg===0?"#333":"#fff",cursor:activeImg===0?"not-allowed":"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center" }}>‹</button>
                  <button onClick={e=>{e.stopPropagation();setActiveImg(i=>Math.min(allImgs.length-1,i+1));}} disabled={activeImg===allImgs.length-1} style={{ position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",width:34,height:34,borderRadius:8,background:"rgba(0,0,0,.65)",border:"none",color:activeImg===allImgs.length-1?"#333":"#fff",cursor:activeImg===allImgs.length-1?"not-allowed":"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center" }}>›</button>
                </>)}
              </div>
              {allImgs.length>1 && (
                <div style={{ display:"flex",gap:8,overflowX:"auto",paddingBottom:4 }}>
                  {allImgs.map((img,i)=>(
                    <div key={i} onClick={()=>setActiveImg(i)} style={{ flexShrink:0,width:72,height:52,borderRadius:8,overflow:"hidden",cursor:"pointer",border:`2px solid ${activeImg===i?"#9333ea":"transparent"}`,opacity:activeImg===i?1:.5,transition:"all .15s" }}>
                      <img src={img} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                    </div>
                  ))}
                </div>
              )}
            </Sec>
          )}

          {/* Description */}
          {m.description && <div style={{ background:"rgba(147,51,234,.05)",border:"1px solid rgba(147,51,234,.15)",borderRadius:12,padding:"14px 18px",marginBottom:24,color:"#94a3b8",fontSize:13.5,lineHeight:1.7,fontStyle:"italic" }}>"{m.description}"</div>}

          <Sec title="🏨 Basic Info">
            <IG items={[["Property ID",m.propertyId],["Motel Name",m.motelName],["Property Type",m.propertyType],["Total Rooms",m.totalRooms],["Total Floors",m.totalFloors],["Build Year",m.buildYear],["Rating",m.rating?`★ ${m.rating}`:null],["Reviews",m.reviewsCount],["Added By Vendor",m.vendorId?.name||m.vendorId]]} />
          </Sec>

          <Sec title="📍 Location">
            <IG items={[["Street",m.address?.street],["Area",m.address?.area],["Landmark",m.address?.landmark],["City",m.address?.city],["State",m.address?.state],["Country",m.address?.country],["Pincode",m.address?.pincode],["Latitude",m.location?.latitude],["Longitude",m.location?.longitude]]} />
            {m.googleMapLink && <a href={m.googleMapLink} target="_blank" rel="noreferrer" style={{ display:"inline-flex",alignItems:"center",gap:6,marginTop:10,padding:"7px 14px",background:"rgba(147,51,234,.1)",border:"1px solid rgba(147,51,234,.25)",borderRadius:8,color:"#c084fc",textDecoration:"none",fontSize:12,fontWeight:600 }}>🗺️ Open in Maps</a>}
            {m.nearbyPlaces?.filter(n=>n.placeName).length>0 && (
              <div style={{ marginTop:12,display:"flex",flexDirection:"column",gap:6 }}>
                {m.nearbyPlaces.filter(n=>n.placeName).map((n,i)=>(
                  <div key={i} style={{ display:"flex",gap:10,fontSize:13,color:"#64748b" }}>
                    <span style={{ color:"#9333ea" }}>📍</span> {n.placeName} {n.distance&&<span style={{ color:"#3b1f5e" }}>— {n.distance}</span>}
                  </div>
                ))}
              </div>
            )}
          </Sec>

          <Sec title="📞 Contact">
            <IG items={[["Contact Person",m.contactPerson],["Phone",m.phone],["Email",m.email],["Alternate Phone",m.alternatePhone],["Website",m.website]]} />
          </Sec>

          <Sec title="💰 Pricing">
            <IG items={[["Base Price",m.basePrice?`₹${Number(m.basePrice).toLocaleString()}`:null],["Weekend Price",m.weekendPrice?`₹${Number(m.weekendPrice).toLocaleString()}`:null],["Tax",m.taxPercentage?`${m.taxPercentage}%`:null],["Discount",m.discountPercentage?`${m.discountPercentage}%`:null],["Check-In",m.checkInTime],["Check-Out",m.checkOutTime]]} />
          </Sec>

          {/* Room Types */}
          {m.roomTypes?.length>0 && (
            <Sec title="🛏 Room Types">
              <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                {m.roomTypes.map((r,i)=>(
                  <div key={i} style={{ background:"#080514",border:"1px solid #2d1b4e",borderRadius:10,padding:"14px 16px" }}>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:18,marginBottom:r.amenities?.length>0?10:0 }}>
                      <div><div style={{ fontSize:11,color:"#3b1f5e" }}>Room</div><div style={{ fontSize:13,color:"#f3e8ff",fontWeight:700,marginTop:2 }}>{r.roomName||"—"}</div></div>
                      <div><div style={{ fontSize:11,color:"#3b1f5e" }}>Price/Night</div><div style={{ fontSize:13,color:"#4ade80",fontWeight:700,marginTop:2 }}>₹{r.pricePerNight||"—"}</div></div>
                      <div><div style={{ fontSize:11,color:"#3b1f5e" }}>Max Guests</div><div style={{ fontSize:13,color:"#c084fc",marginTop:2 }}>{r.maxGuests||"—"}</div></div>
                      <div><div style={{ fontSize:11,color:"#3b1f5e" }}>Bed Type</div><div style={{ fontSize:13,color:"#c084fc",marginTop:2 }}>{r.bedType||"—"}</div></div>
                      <div><div style={{ fontSize:11,color:"#3b1f5e" }}>Room Size</div><div style={{ fontSize:13,color:"#c084fc",marginTop:2 }}>{r.roomSize||"—"}</div></div>
                      <div><div style={{ fontSize:11,color:"#3b1f5e" }}>Available</div><div style={{ fontSize:13,marginTop:2,color:r.isAvailable?"#4ade80":"#f87171" }}>{r.isAvailable?"Yes":"No"}</div></div>
                    </div>
                    {r.amenities?.length>0 && <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>{r.amenities.map(a=><span key={a} style={{ fontSize:11,color:"#c084fc",background:"rgba(147,51,234,.1)",border:"1px solid rgba(147,51,234,.2)",borderRadius:4,padding:"2px 8px" }}>{a}</span>)}</div>}
                  </div>
                ))}
              </div>
            </Sec>
          )}

          {/* Amenities */}
          {m.amenities?.length>0 && (
            <Sec title="✨ Amenities">
              <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                {m.amenities.map(a=><span key={a} style={{ fontSize:12,color:"#c084fc",background:"rgba(147,51,234,.08)",border:"1px solid rgba(147,51,234,.2)",borderRadius:5,padding:"3px 10px" }}>{a}</span>)}
              </div>
            </Sec>
          )}

          {/* Reception & Room Images */}
          <SmGal title="🛎️ Reception Images" images={m.receptionImages} />
          <SmGal title="🛏 Room Images" images={m.roomImages} />

          {/* Policies */}
          {(m.cancellationPolicy||m.houseRules||m.petPolicy) && (
            <Sec title="📋 Policies">
              {[["❌ Cancellation",m.cancellationPolicy],["🏨 House Rules",m.houseRules],["🐾 Pet Policy",m.petPolicy]].filter(([,v])=>v).map(([l,v])=>(
                <div key={l} style={{ background:"#080514",border:"1px solid #2d1b4e",borderRadius:9,padding:"12px 14px",marginBottom:10 }}>
                  <div style={{ fontSize:11,color:"#3b1f5e",fontWeight:700,marginBottom:6 }}>{l}</div>
                  <div style={{ fontSize:13,color:"#64748b",lineHeight:1.6 }}>{v}</div>
                </div>
              ))}
            </Sec>
          )}

          {/* Rejection reason */}
          {m.rejectionReason && (
            <Sec title="🚫 Rejection Details">
              <div style={{ background:"rgba(248,113,113,.06)",border:"1px solid rgba(248,113,113,.2)",borderRadius:10,padding:"12px 16px",color:"#f87171",fontSize:13 }}>{m.rejectionReason}</div>
            </Sec>
          )}

          <Sec title="📊 Meta">
            <IG items={[["Created",m.createdAt?new Date(m.createdAt).toLocaleDateString():null],["Updated",m.updatedAt?new Date(m.updatedAt).toLocaleDateString():null]]} />
          </Sec>

        </div>
      </div>
    </div>
  );
}

/* ============================= MINI COMPONENTS ============================= */
function MW({ children, onClose }) {
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.9)",zIndex:9995,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
      <div style={{ background:"#0e0720",border:"1px solid #2d1b4e",borderRadius:20,padding:"36px 32px",maxWidth:430,width:"100%",animation:"pop .25s ease",position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute",top:14,right:14,width:28,height:28,borderRadius:7,background:"#130826",border:"1px solid #2d1b4e",color:"#64748b",cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
        {children}
      </div>
    </div>
  );
}
function LbB({ children, onClick, disabled }) {
  return <button onClick={onClick} disabled={disabled} style={{ width:36,height:36,borderRadius:8,background:"#111",border:"1px solid #222",color:disabled?"#1f2937":"#d8ccf0",cursor:disabled?"not-allowed":"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center" }}>{children}</button>;
}
function FG({ children }) { return <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:18 }}>{children}</div>; }
function FF({ l, children, full }) {
  return <div style={full?{gridColumn:"1/-1"}:{}}>
    <label style={{ display:"block",fontSize:11,color:"#3b1f5e",fontWeight:700,letterSpacing:".05em",textTransform:"uppercase",marginBottom:7 }}>{l}</label>
    {children}
  </div>;
}
function SL({ children }) { return <div style={{ fontSize:11,color:"#3b1f5e",fontWeight:700,letterSpacing:".06em",textTransform:"uppercase" }}>{children}</div>; }
function FI({ style, ...props }) { return <input {...props} style={{ width:"100%",padding:"9px 12px",background:"#080514",border:"1px solid #2d1b4e",borderRadius:8,color:"#d8ccf0",fontSize:13,boxSizing:"border-box",fontFamily:"'Nunito',sans-serif",...style }} />; }
function FS({ children, ...props }) { return <select {...props} style={{ width:"100%",padding:"9px 12px",background:"#080514",border:"1px solid #2d1b4e",borderRadius:8,color:"#d8ccf0",fontSize:13,cursor:"pointer",boxSizing:"border-box",fontFamily:"'Nunito',sans-serif" }}>{children}</select>; }
function FTA({ style, ...props }) { return <textarea {...props} style={{ width:"100%",padding:"9px 12px",background:"#080514",border:"1px solid #2d1b4e",borderRadius:8,color:"#d8ccf0",fontSize:13,resize:"vertical",lineHeight:1.6,boxSizing:"border-box",fontFamily:"'Nunito',sans-serif",...style }} />; }
function Chip({ children, on, onClick }) {
  return <div className="apill" onClick={onClick} style={{ padding:"7px 15px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:500,transition:"all .2s",userSelect:"none",border:`1px solid ${on?"#9333ea":"#2d1b4e"}`,background:on?"rgba(147,51,234,.14)":"#0e0720",color:on?"#c084fc":"#3b1f5e" }}>{children}</div>;
}
function Chk({ label, checked, onChange }) {
  return <label style={{ display:"flex",alignItems:"center",gap:9,cursor:"pointer",fontSize:13,color:checked?"#c084fc":"#4b5563",userSelect:"none" }}>
    <div onClick={onChange} style={{ width:20,height:20,borderRadius:5,border:`2px solid ${checked?"#9333ea":"#2d1b4e"}`,background:checked?"#9333ea":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s",cursor:"pointer" }}>
      {checked&&<span style={{ color:"#fff",fontSize:11 }}>✓</span>}
    </div>
    {label}
  </label>;
}
function SmD({ children, onClick }) { return <button type="button" onClick={onClick} style={{ padding:"3px 12px",background:"rgba(248,113,113,.08)",border:"1px solid rgba(248,113,113,.2)",borderRadius:6,color:"#f87171",cursor:"pointer",fontSize:12,fontFamily:"'Nunito',sans-serif",whiteSpace:"nowrap" }}>{children}</button>; }
function AddB({ children, onClick }) { return <button type="button" onClick={onClick} style={{ alignSelf:"flex-start",padding:"7px 18px",background:"rgba(147,51,234,.1)",border:"1px solid rgba(147,51,234,.25)",borderRadius:8,color:"#c084fc",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'Nunito',sans-serif" }}>{children}</button>; }
function GhB({ children, onClick }) { return <button type="button" onClick={onClick} style={{ padding:"9px 22px",background:"#130826",border:"1px solid #2d1b4e",borderRadius:8,color:"#64748b",cursor:"pointer",fontSize:13,fontFamily:"'Nunito',sans-serif" }}>{children}</button>; }
function PrB({ children, type="button", onClick, disabled }) { return <button type={type} onClick={onClick} disabled={disabled} style={{ padding:"9px 26px",background:disabled?"#2d1b4e":"linear-gradient(135deg,#7e22ce,#9333ea)",border:"none",borderRadius:8,color:disabled?"#3b1f5e":"#fff",cursor:disabled?"not-allowed":"pointer",fontSize:13,fontWeight:700,fontFamily:"'Nunito',sans-serif",opacity:disabled?.7:1 }}>{children}</button>; }
function AB({ children, c, onClick, t }) { return <button className="aab" onClick={onClick} title={t} style={{ width:30,height:30,borderRadius:7,background:`${c}18`,border:`1px solid ${c}30`,color:c,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s",flexShrink:0,fontFamily:"'Nunito',sans-serif" }}>{children}</button>; }
function PgB({ children, onClick, disabled, active }) { return <button className="pph" onClick={onClick} disabled={disabled} style={{ minWidth:34,height:34,borderRadius:8,border:active?"1px solid #9333ea":"1px solid #2d1b4e",background:active?"rgba(147,51,234,.14)":"#0e0720",color:active?"#c084fc":disabled?"#2d1b4e":"#4b5563",cursor:disabled?"not-allowed":"pointer",fontSize:13,fontWeight:active?700:400,fontFamily:"'Nunito',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s" }}>{children}</button>; }