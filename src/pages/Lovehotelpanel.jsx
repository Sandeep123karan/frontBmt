import { useState, useEffect, useCallback } from "react";

const API_BASE = "https://bmtadmin.onrender.com/api/lovehotels";

const blankRoom = {
  roomId: "", roomType: "", maxGuests: "", bedType: "",
  pricePerNight: "", pricePerHour: "", totalRooms: "", availableRooms: "",
  amenities: "", isAC: false, isSmokingAllowed: false,
};

const initialForm = {
  propertyName: "", tagline: "", description: "", propertyType: "Love Hotel", starRating: "3",
  address: { street: "", area: "", landmark: "", city: "", state: "", country: "India", pincode: "" },
  geoLocation: { latitude: "", longitude: "" },
  contactDetails: { phone: "", email: "", website: "", whatsapp: "" },
  coupleFriendly: true, localIdAccepted: true, hourlyBookingAvailable: true, privacyAssured: true,
  priceRange: { minPrice: "", maxPrice: "" },
  amenities: "",
  policies: { checkInTime: "", checkOutTime: "", cancellationPolicy: "", idProofRequired: true, petsAllowed: false, smokingAllowed: false, unmarriedCouplesAllowed: true },
  commissionPercent: "10",
  seo: { metaTitle: "", metaDescription: "", metaKeywords: "" },
  isFeatured: false, isTrending: false,
};

const C = {
  bg: "#070d1a", surface: "#0f1623", surface2: "#0b1220",
  border: "#1a2640", accent: "#4f6ef7", green: "#10b981",
  orange: "#f59e0b", red: "#ef4444", pink: "#ec4899",
  text: "#e8edf5", textMuted: "#4d607a", textSub: "#7a8ea8",
};

const inp = {
  background: "#060c18", border: `1px solid ${C.border}`, borderRadius: 9,
  padding: "10px 13px", color: C.text, fontSize: 13, fontFamily: "inherit",
  outline: "none", width: "100%", boxSizing: "border-box", transition: "border-color .15s",
};

export default function LoveHotelPanel() {
  const [form, setForm] = useState(initialForm);
  const [rooms, setRooms] = useState([]);
  const [files, setFiles] = useState({ thumbnail: null, banner: null, gallery: [] });
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [activeSection, setActiveSection] = useState(0);
  const [viewHotel, setViewHotel] = useState(null);
  const token = localStorage.getItem("token") || "";

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/all`);
      const data = await res.json();
      setHotels(data.data || []);
    } catch { showToast("Hotels fetch mein error", "error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchHotels(); }, [fetchHotels]);

  const setNested = (parent, key, val) =>
    setForm(p => ({ ...p, [parent]: { ...p[parent], [key]: val } }));

  const addRoom = () => setRooms(r => [...r, { ...blankRoom, roomId: "RM" + Date.now() }]);
  const updateRoom = (idx, key, val) => setRooms(r => r.map((rm, i) => i === idx ? { ...rm, [key]: val } : rm));
  const removeRoom = (idx) => setRooms(r => r.filter((_, i) => i !== idx));

  const buildFD = () => {
    const fd = new FormData();
    ["propertyName","tagline","description","propertyType","starRating","commissionPercent",
     "coupleFriendly","localIdAccepted","hourlyBookingAvailable","privacyAssured","isFeatured","isTrending"
    ].forEach(k => fd.append(k, form[k]));
    ["address","geoLocation","contactDetails","policies","priceRange","seo"].forEach(parent => {
      Object.entries(form[parent]).forEach(([k,v]) => fd.append(`${parent}[${k}]`, v));
    });
    form.amenities.split(",").map(a=>a.trim()).filter(Boolean).forEach(a => fd.append("amenities[]", a));
    rooms.forEach((rm, i) => {
      Object.entries(rm).forEach(([k, v]) => {
        if (k === "amenities" && typeof v === "string")
          v.split(",").map(x=>x.trim()).filter(Boolean).forEach(a => fd.append(`rooms[${i}][amenities][]`, a));
        else fd.append(`rooms[${i}][${k}]`, v);
      });
    });
    if (files.thumbnail) fd.append("thumbnail", files.thumbnail);
    if (files.banner) fd.append("banner", files.banner);
    files.gallery.forEach(f => fd.append("gallery", f));
    return fd;
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitLoading(true);
//     try {
//       const url = editId ? `${API_BASE}/update/${editId}` : `${API_BASE}/add`;
//       const res = await fetch(url, { method: editId?"PUT":"POST", headers:{Authorization:`Bearer ${token}`}, body: buildFD() });
//       const data = await res.json();
//       if (data.success) {
//         showToast(editId ? "Hotel update ho gaya!" : "Hotel add ho gaya! Approval pending.");
//         setForm(initialForm); setRooms([]); setFiles({thumbnail:null,banner:null,gallery:[]}); setEditId(null); setActiveSection(0); fetchHotels();
//       } else showToast(data.message||"Error aaya","error");
//     } catch { showToast("Server error","error"); }
//     finally { setSubmitLoading(false); }
//   };

const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitLoading(true);

  try {
    const token = localStorage.getItem("adminToken");   // 🔥 yaha se token lo
    if (!token) {
      showToast("Login expired, dubara login karo", "error");
      return;
    }

    const url = editId 
      ? `${API_BASE}/update/${editId}` 
      : `${API_BASE}/add`;

    const res = await fetch(url, {
      method: editId ? "PUT" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,   // 🔥 correct header
      },
      body: buildFD(),
    });

    const data = await res.json();

    if (data.success) {
      showToast(editId ? "Hotel update ho gaya!" : "Hotel add ho gaya! Approval pending.");
      setForm(initialForm);
      setRooms([]);
      setFiles({ thumbnail: null, banner: null, gallery: [] });
      setEditId(null);
      setActiveSection(0);
      fetchHotels();
    } else {
      showToast(data.message || "Error aaya", "error");
    }

  } catch (err) {
    showToast("Server error", "error");
    console.log(err);
  } finally {
    setSubmitLoading(false);
  }
};
  const handleEdit = (hotel) => {
    setEditId(hotel._id);
    setForm({
      propertyName:hotel.propertyName||"", tagline:hotel.tagline||"", description:hotel.description||"",
      propertyType:hotel.propertyType||"Love Hotel", starRating:String(hotel.starRating||3),
      address:{street:"",area:"",landmark:"",city:"",state:"",country:"India",pincode:"",...hotel.address},
      geoLocation:{latitude:"",longitude:"",...hotel.geoLocation},
      contactDetails:{phone:"",email:"",website:"",whatsapp:"",...hotel.contactDetails},
      coupleFriendly:hotel.coupleFriendly??true, localIdAccepted:hotel.localIdAccepted??true,
      hourlyBookingAvailable:hotel.hourlyBookingAvailable??true, privacyAssured:hotel.privacyAssured??true,
      priceRange:{minPrice:"",maxPrice:"",...hotel.priceRange},
      amenities:(hotel.amenities||[]).join(", "),
      policies:{checkInTime:"",checkOutTime:"",cancellationPolicy:"",idProofRequired:true,petsAllowed:false,smokingAllowed:false,unmarriedCouplesAllowed:true,...hotel.policies},
      commissionPercent:String(hotel.commissionPercent||10),
      seo:{metaTitle:"",metaDescription:"",metaKeywords:"",...hotel.seo, metaKeywords:(hotel.seo?.metaKeywords||[]).join(", ")},
      isFeatured:hotel.isFeatured||false, isTrending:hotel.isTrending||false,
    });
    setRooms((hotel.rooms||[]).map(r=>({...blankRoom,...r,amenities:(r.amenities||[]).join(", ")})));
    window.scrollTo({top:0,behavior:"smooth"});
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete karna chahte ho?")) return;
    try {
      const res = await fetch(`${API_BASE}/delete/${id}`,{method:"DELETE",headers:{Authorization:`Bearer ${token}`}});
      const data = await res.json();
      if (data.success){showToast("Deleted!");fetchHotels();}
    } catch {showToast("Error","error");}
  };

//   const handleApprove = async (id) => {
//     try {
//       const res = await fetch(`${API_BASE}/approve/${id}`,{method:"PUT",headers:{Authorization:`Bearer ${token}`}});
      
//       const data = await res.json();
//       if(data.success){showToast("Hotel approved! ✅");fetchHotels();}
//     } catch {showToast("Error","error");}
//   };
const handleApprove = async (id) => {
  try {
    const token = localStorage.getItem("adminToken");   // 🔥 token yaha se lo

    if (!token) {
      showToast("Login expired, dubara login karo", "error");
      return;
    }

    const res = await fetch(`${API_BASE}/approve/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,   // 🔥 correct header
      },
    });

    const data = await res.json();

    if (data.success) {
      showToast("Hotel approved! ✅");
      fetchHotels();   // list refresh
    } else {
      showToast(data.message || "Approve failed", "error");
    }

  } catch (err) {
    console.log(err);
    showToast("Server error", "error");
  }
};
//   const handleReject = async (id) => {
//     try {
//       const res = await fetch(`${API_BASE}/reject/${id}`,{method:"PUT",headers:{Authorization:`Bearer ${token}`}});
//       const data = await res.json();
//       if(data.success){showToast("Hotel rejected","warn");fetchHotels();}
//     } catch {showToast("Error","error");}
//   };
const handleReject = async (id) => {
  try {
    const token = localStorage.getItem("adminToken");   // 🔥 always yaha se lo

    if (!token) {
      showToast("Login expired, dubara login karo", "error");
      return;
    }

    const res = await fetch(`${API_BASE}/reject/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (data.success) {
      showToast("Hotel rejected ❌", "warn");
      fetchHotels();   // table refresh
    } else {
      showToast(data.message || "Reject failed", "error");
    }

  } catch (err) {
    console.log(err);
    showToast("Server error", "error");
  }
};
  const filtered = hotels.filter(h => {
    const q = search.toLowerCase();
    const m = h.propertyName?.toLowerCase().includes(q)||h.address?.city?.toLowerCase().includes(q)||h.propertyId?.toLowerCase().includes(q);
    if(activeTab==="approved") return m && h.isApproved;
    if(activeTab==="pending") return m && !h.isApproved;
    if(activeTab==="inactive") return m && !h.isActive;
    if(activeTab==="featured") return m && h.isFeatured;
    return m;
  });

  const Stars = ({n=3}) => <span>{Array.from({length:5},(_,i)=><span key={i} style={{color:i<n?"#f59e0b":"#243040",fontSize:13}}>★</span>)}</span>;

  const Toggle = ({on,onChange,label}) => (
    <label style={{display:"flex",alignItems:"center",gap:9,padding:"9px 14px",cursor:"pointer",background:on?"rgba(79,110,247,.08)":"#0b1220",border:`1px solid ${on?"#4f6ef7":C.border}`,borderRadius:9,userSelect:"none"}}>
      <input type="checkbox" checked={on} onChange={e=>onChange(e.target.checked)} style={{display:"none"}} />
      <div style={{width:34,height:18,borderRadius:999,background:on?"#4f6ef7":"#1a2640",position:"relative",flexShrink:0,transition:"background .18s"}}>
        <div style={{width:12,height:12,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:on?19:3,transition:"left .18s"}}></div>
      </div>
      <span style={{fontSize:12,fontWeight:600,color:on?C.text:C.textSub}}>{label}</span>
    </label>
  );

  const Lbl = ({children}) => <label style={{fontSize:10,fontWeight:700,color:C.textSub,textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:6}}>{children}</label>;
  const Fld = ({label,children}) => <div style={{display:"flex",flexDirection:"column"}}><Lbl>{label}</Lbl>{children}</div>;
  const G2 = ({children}) => <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14}}>{children}</div>;
  const G3 = ({children}) => <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:14}}>{children}</div>;
  const SH = ({icon,title,desc}) => (
    <div style={{display:"flex",alignItems:"center",gap:12,paddingBottom:14,borderBottom:`1px solid ${C.border}`,marginBottom:4}}>
      <span style={{fontSize:26}}>{icon}</span>
      <div>
        <div style={{fontSize:15,fontWeight:700,color:C.text}}>{title}</div>
        <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{desc}</div>
      </div>
    </div>
  );

  const SECS = ["Basic Info","Location","Contact","Rooms","Pricing & Amenities","Policies","Images","SEO & Status"];

  return (
    <div style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",background:C.bg,minHeight:"100vh",color:C.text,boxSizing:"border-box"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap');
        @keyframes lh_sd{from{transform:translateY(-12px);opacity:0}to{transform:none;opacity:1}}
        @keyframes lh_sp{to{transform:rotate(360deg)}}
        .lh_inp:focus{border-color:#4f6ef7 !important}
        .lh_row:hover>td{background:rgba(255,255,255,.012) !important}
        .lh_abn:hover{filter:brightness(1.3);transform:translateY(-1px)}
        .lh_snb:hover{color:#b0c4ff !important;background:rgba(79,110,247,.04) !important}
        .lh_tb:hover{color:#b0c4ff !important}
        .lh_rmb:hover{border-color:#4f6ef7 !important;color:#7b97fb !important}
        .lh_file input[type=file]::file-selector-button{background:#1a2640;color:#7a8ea8;border:none;padding:4px 10px;border-radius:6px;cursor:pointer;font-size:11px;margin-right:8px}
      `}</style>

      {/* TOAST */}
      {toast && (
        <div style={{position:"fixed",top:20,right:20,zIndex:99999,display:"flex",alignItems:"center",gap:10,padding:"13px 20px",borderRadius:12,fontSize:14,fontWeight:600,boxShadow:"0 8px 32px rgba(0,0,0,.7)",maxWidth:360,animation:"lh_sd .3s ease",
          ...(toast.type==="error"?{background:"#2a0808",border:"1px solid #7f1d1d",color:"#fca5a5"}:
             toast.type==="warn"?{background:"#2a1800",border:"1px solid #78350f",color:"#fcd34d"}:
             {background:"#011f14",border:"1px solid #065f46",color:"#6ee7b7"})}}>
          <span style={{width:22,height:22,borderRadius:"50%",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,flexShrink:0,
            background:toast.type==="error"?C.red:toast.type==="warn"?C.orange:C.green}}>
            {toast.type==="error"?"✕":toast.type==="warn"?"!":"✓"}
          </span>
          {toast.msg}
        </div>
      )}

      {/* MODAL */}
      {viewHotel && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setViewHotel(null)}>
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,width:"100%",maxWidth:520,maxHeight:"88vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:"18px 22px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
              <div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,color:C.text,fontWeight:700}}>{viewHotel.propertyName}</div>
                <div style={{fontSize:11,color:C.textMuted,marginTop:3}}>{viewHotel.propertyId} · {viewHotel.propertyType}</div>
              </div>
              <button onClick={()=>setViewHotel(null)} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.textSub,width:30,height:30,borderRadius:7,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            </div>
            <div style={{padding:"4px 22px 18px"}}>
              {[["Property",viewHotel.propertyName],["Tagline",viewHotel.tagline],["Description",viewHotel.description],
                ["City",`${viewHotel.address?.city||""}, ${viewHotel.address?.state||""}`],
                ["Phone",viewHotel.contactDetails?.phone],["Email",viewHotel.contactDetails?.email],
                ["Check-in",viewHotel.policies?.checkInTime],["Check-out",viewHotel.policies?.checkOutTime],
                ["Commission",`${viewHotel.commissionPercent}%`],["Bookings",viewHotel.totalBookings],
                ["Avg Rating",viewHotel.ratings?.average],["Reviews",viewHotel.ratings?.totalReviews],
                ["Couple Friendly",viewHotel.coupleFriendly?"✅ Yes":"❌ No"],
                ["Unmarried",viewHotel.policies?.unmarriedCouplesAllowed?"✅ Yes":"❌ No"],
                ["Room Types",viewHotel.rooms?.length||0],
              ].map(([l,v])=>(
                <div key={l} style={{display:"flex",gap:14,padding:"9px 0",borderBottom:`1px solid #0d1525`}}>
                  <div style={{fontSize:11,color:C.textMuted,fontWeight:700,minWidth:110,flexShrink:0}}>{l}</div>
                  <div style={{fontSize:13,color:C.text}}>{v||"—"}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <div style={{background:"#080e1b",borderBottom:`1px solid ${C.border}`,padding:"0 32px"}}>
        <div style={{maxWidth:1440,margin:"0 auto",height:68,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:32}}>🏩</span>
            <div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:21,color:C.text,fontWeight:700}}>
                LoveHotel<span style={{color:C.accent}}>Pro</span>
              </div>
              <div style={{fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginTop:1}}>Property Management System</div>
            </div>
          </div>
          <div style={{display:"flex",gap:36}}>
            {[{l:"Total",v:hotels.length,c:"#a78bfa"},{l:"Approved",v:hotels.filter(h=>h.isApproved).length,c:C.green},{l:"Pending",v:hotels.filter(h=>!h.isApproved).length,c:C.orange},{l:"Featured",v:hotels.filter(h=>h.isFeatured).length,c:C.pink}].map(s=>(
              <div key={s.l} style={{textAlign:"center"}}>
                <div style={{fontSize:22,fontWeight:800,color:s.c,display:"block",lineHeight:1}}>{s.v}</div>
                <div style={{fontSize:9,color:C.textMuted,textTransform:"uppercase",letterSpacing:".08em",marginTop:3}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PAGE ── */}
      <div style={{maxWidth:1440,margin:"0 auto",padding:"28px 32px",display:"flex",flexDirection:"column",gap:28}}>

        {/* ═══════════ FORM CARD ═══════════ */}
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,display:"flex",flexDirection:"column",overflow:"hidden"}}>

          {/* Card Header */}
          <div style={{padding:"20px 28px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,background:"linear-gradient(90deg,rgba(79,110,247,.07),transparent)",borderLeft:`3px solid ${C.accent}`,flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:26}}>{editId?"✏️":"🏩"}</span>
              <div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:19,color:C.text,fontWeight:700}}>{editId?"Hotel Update Karo":"Add Love Hotel"}</div>
                <div style={{fontSize:12,color:C.textMuted,marginTop:3}}>{editId?"Details modify karke save karo":"Saari details fill karo aur submit karo"}</div>
              </div>
            </div>
            {editId && (
              <button onClick={()=>{setForm(initialForm);setRooms([]);setEditId(null);setActiveSection(0);}} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.textSub,borderRadius:9,padding:"8px 15px",cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:600}}>✕ Cancel</button>
            )}
          </div>

          {/* Section Nav */}
          <div style={{display:"flex",overflowX:"auto",borderBottom:`1px solid ${C.border}`,background:"#0b1220",flexShrink:0,scrollbarWidth:"none"}}>
            {SECS.map((s,i)=>(
              <button key={i} type="button" className="lh_snb"
                onClick={()=>setActiveSection(i)}
                style={{background:activeSection===i?"rgba(79,110,247,.07)":"transparent",border:"none",borderBottom:activeSection===i?"3px solid #4f6ef7":"3px solid transparent",color:activeSection===i?"#7b97fb":C.textMuted,padding:"14px 18px",cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:700,display:"flex",alignItems:"center",gap:7,whiteSpace:"nowrap",transition:"all .15s",flexShrink:0}}>
                <span style={{width:20,height:20,borderRadius:"50%",background:activeSection===i?"#4f6ef7":"#1a2640",color:activeSection===i?"#fff":C.textSub,fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</span>
                {s}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{padding:28,display:"flex",flexDirection:"column",gap:24}}>

            {/* 0 — BASIC INFO */}
            {activeSection===0 && (
              <div style={{display:"flex",flexDirection:"column",gap:18}}>
                <SH icon="📋" title="Basic Information" desc="Hotel ki primary details" />
                <G2>
                  <Fld label="Property Name *"><input required className="lh_inp" style={inp} value={form.propertyName} onChange={e=>setForm(p=>({...p,propertyName:e.target.value}))} placeholder="e.g. The Velvet Inn" /></Fld>
                  <Fld label="Tagline"><input className="lh_inp" style={inp} value={form.tagline} onChange={e=>setForm(p=>({...p,tagline:e.target.value}))} placeholder="e.g. Where every night is special" /></Fld>
                </G2>
                <Fld label="Description *"><textarea required className="lh_inp" style={{...inp,minHeight:90,resize:"vertical"}} value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} placeholder="Hotel ki detailed description..." /></Fld>
                <G3>
                  <Fld label="Property Type">
                    <select className="lh_inp" style={inp} value={form.propertyType} onChange={e=>setForm(p=>({...p,propertyType:e.target.value}))}>
                      {["Love Hotel","Budget Hotel","Boutique Hotel","Resort","Guest House","Service Apartment"].map(t=><option key={t}>{t}</option>)}
                    </select>
                  </Fld>
                  <Fld label="Star Rating">
                    <select className="lh_inp" style={inp} value={form.starRating} onChange={e=>setForm(p=>({...p,starRating:e.target.value}))}>
                      {[1,2,3,4,5].map(n=><option key={n} value={n}>{"★".repeat(n)} {n} Star</option>)}
                    </select>
                  </Fld>
                  <Fld label="Commission %"><input type="number" className="lh_inp" style={inp} value={form.commissionPercent} onChange={e=>setForm(p=>({...p,commissionPercent:e.target.value}))} placeholder="10" /></Fld>
                </G3>
                <div style={{display:"flex",flexWrap:"wrap",gap:9}}>
                  {[["coupleFriendly","💑 Couple Friendly"],["localIdAccepted","🪪 Local ID Accepted"],["hourlyBookingAvailable","⏰ Hourly Booking"],["privacyAssured","🔒 Privacy Assured"],["isFeatured","⭐ Featured"],["isTrending","🔥 Trending"]].map(([k,l])=>(
                    <Toggle key={k} on={form[k]} onChange={v=>setForm(p=>({...p,[k]:v}))} label={l} />
                  ))}
                </div>
              </div>
            )}

            {/* 1 — LOCATION */}
            {activeSection===1 && (
              <div style={{display:"flex",flexDirection:"column",gap:18}}>
                <SH icon="📍" title="Location Details" desc="Address aur geo coordinates" />
                <G3>
                  {[["street","Street Address","123 Main Road"],["area","Area / Locality","Connaught Place"],["landmark","Landmark","Near Metro"],["city","City *","New Delhi"],["state","State *","Delhi"],["country","Country","India"],["pincode","Pincode","110001"]].map(([k,l,ph])=>(
                    <Fld key={k} label={l}><input className="lh_inp" style={inp} value={form.address[k]} onChange={e=>setNested("address",k,e.target.value)} placeholder={ph} /></Fld>
                  ))}
                </G3>
                <div style={{display:"flex",alignItems:"center",gap:12,color:C.textMuted,fontSize:12,fontWeight:600}}>
                  <div style={{flex:1,height:1,background:C.border}}></div><span>📡 Geo Coordinates (Optional)</span><div style={{flex:1,height:1,background:C.border}}></div>
                </div>
                <G2>
                  <Fld label="Latitude"><input type="number" className="lh_inp" style={inp} value={form.geoLocation.latitude} onChange={e=>setNested("geoLocation","latitude",e.target.value)} placeholder="28.6139" /></Fld>
                  <Fld label="Longitude"><input type="number" className="lh_inp" style={inp} value={form.geoLocation.longitude} onChange={e=>setNested("geoLocation","longitude",e.target.value)} placeholder="77.2090" /></Fld>
                </G2>
              </div>
            )}

            {/* 2 — CONTACT */}
            {activeSection===2 && (
              <div style={{display:"flex",flexDirection:"column",gap:18}}>
                <SH icon="📞" title="Contact Details" desc="Hotel ka contact information" />
                <G2>
                  {[["phone","Phone Number","text","+91 98765 43210"],["email","Email Address","email","info@hotel.com"],["website","Website URL","text","https://hotel.com"],["whatsapp","WhatsApp","text","+91 98765 43210"]].map(([k,l,t,ph])=>(
                    <Fld key={k} label={l}><input type={t} className="lh_inp" style={inp} value={form.contactDetails[k]} onChange={e=>setNested("contactDetails",k,e.target.value)} placeholder={ph} /></Fld>
                  ))}
                </G2>
              </div>
            )}

            {/* 3 — ROOMS */}
            {activeSection===3 && (
              <div style={{display:"flex",flexDirection:"column",gap:18}}>
                <SH icon="🛏️" title="Room Management" desc="Hotel ke saare room types add karo" />
                {rooms.length===0 && (
                  <div style={{textAlign:"center",padding:44,border:`2px dashed ${C.border}`,borderRadius:12}}>
                    <div style={{fontSize:44}}>🛏️</div>
                    <div style={{color:C.textSub,marginTop:10,fontWeight:600,fontSize:14}}>Koi room nahi hai abhi</div>
                    <div style={{color:C.textMuted,fontSize:12,marginTop:4}}>Neeche button se add karo</div>
                  </div>
                )}
                {rooms.map((rm,idx)=>(
                  <div key={idx} style={{background:"#0b1220",border:`1px solid ${C.border}`,borderRadius:12,padding:18,display:"flex",flexDirection:"column",gap:14}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,paddingBottom:12,borderBottom:`1px solid ${C.border}`}}>
                      <span style={{background:"rgba(79,110,247,.15)",color:"#7b97fb",borderRadius:6,padding:"3px 10px",fontSize:11,fontWeight:700}}>Room {idx+1}</span>
                      <span style={{fontWeight:600,color:C.text,flex:1,fontSize:13}}>{rm.roomType||"Untitled Room"}</span>
                      <button type="button" onClick={()=>removeRoom(idx)} style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.25)",color:"#f87171",borderRadius:7,padding:"4px 12px",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Remove</button>
                    </div>
                    <G3>
                      <Fld label="Room ID"><input className="lh_inp" style={inp} value={rm.roomId} onChange={e=>updateRoom(idx,"roomId",e.target.value)} placeholder="RM001" /></Fld>
                      <Fld label="Room Type">
                        <select className="lh_inp" style={inp} value={rm.roomType} onChange={e=>updateRoom(idx,"roomType",e.target.value)}>
                          <option value="">Select Type</option>
                          {["Standard","Deluxe","Suite","Executive","Honeymoon","Couple Special","Jacuzzi Room"].map(t=><option key={t}>{t}</option>)}
                        </select>
                      </Fld>
                      <Fld label="Bed Type">
                        <select className="lh_inp" style={inp} value={rm.bedType} onChange={e=>updateRoom(idx,"bedType",e.target.value)}>
                          <option value="">Select Bed</option>
                          {["Single","Double","Queen","King","Twin"].map(t=><option key={t}>{t}</option>)}
                        </select>
                      </Fld>
                      <Fld label="Max Guests"><input type="number" className="lh_inp" style={inp} value={rm.maxGuests} onChange={e=>updateRoom(idx,"maxGuests",e.target.value)} placeholder="2" /></Fld>
                      <Fld label="Price / Night (₹)"><input type="number" className="lh_inp" style={inp} value={rm.pricePerNight} onChange={e=>updateRoom(idx,"pricePerNight",e.target.value)} placeholder="2000" /></Fld>
                      <Fld label="Price / Hour (₹)"><input type="number" className="lh_inp" style={inp} value={rm.pricePerHour} onChange={e=>updateRoom(idx,"pricePerHour",e.target.value)} placeholder="500" /></Fld>
                      <Fld label="Total Rooms"><input type="number" className="lh_inp" style={inp} value={rm.totalRooms} onChange={e=>updateRoom(idx,"totalRooms",e.target.value)} placeholder="5" /></Fld>
                      <Fld label="Available Rooms"><input type="number" className="lh_inp" style={inp} value={rm.availableRooms} onChange={e=>updateRoom(idx,"availableRooms",e.target.value)} placeholder="3" /></Fld>
                      <Fld label="Amenities (comma sep.)"><input className="lh_inp" style={inp} value={rm.amenities} onChange={e=>updateRoom(idx,"amenities",e.target.value)} placeholder="TV, WiFi, AC" /></Fld>
                    </G3>
                    <div style={{display:"flex",gap:20}}>
                      {[["isAC","❄️ AC Room"],["isSmokingAllowed","🚬 Smoking Allowed"]].map(([k,l])=>(
                        <label key={k} style={{display:"flex",alignItems:"center",gap:7,fontSize:12,color:C.textSub,cursor:"pointer"}}>
                          <input type="checkbox" checked={rm[k]} onChange={e=>updateRoom(idx,k,e.target.checked)} style={{accentColor:"#4f6ef7",width:14,height:14}} />
                          {l}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addRoom} className="lh_rmb" style={{background:"transparent",border:`2px dashed ${C.border}`,color:C.textMuted,borderRadius:10,padding:13,cursor:"pointer",fontSize:13,fontFamily:"inherit",fontWeight:700,transition:"all .15s"}}>
                  + Naya Room Add Karo
                </button>
              </div>
            )}

            {/* 4 — PRICING & AMENITIES */}
            {activeSection===4 && (
              <div style={{display:"flex",flexDirection:"column",gap:18}}>
                <SH icon="💰" title="Pricing & Amenities" desc="Price range aur hotel amenities" />
                <div style={{background:"rgba(79,110,247,.06)",border:"1px solid rgba(79,110,247,.2)",borderRadius:9,padding:"11px 15px",fontSize:12,color:"#7b97fb"}}>
                  ℹ️ Ye fields search filters ke liye hain. Exact room pricing Room section mein set karo.
                </div>
                <G2>
                  <Fld label="Minimum Price (₹)"><input type="number" className="lh_inp" style={inp} value={form.priceRange.minPrice} onChange={e=>setNested("priceRange","minPrice",e.target.value)} placeholder="500" /></Fld>
                  <Fld label="Maximum Price (₹)"><input type="number" className="lh_inp" style={inp} value={form.priceRange.maxPrice} onChange={e=>setNested("priceRange","maxPrice",e.target.value)} placeholder="5000" /></Fld>
                </G2>
                <Fld label="Hotel Amenities (comma separated)">
                  <textarea className="lh_inp" style={{...inp,minHeight:90,resize:"vertical"}} value={form.amenities} onChange={e=>setForm(p=>({...p,amenities:e.target.value}))} placeholder="Free WiFi, Parking, Room Service, CCTV, 24hr Reception..." />
                </Fld>
                {form.amenities && (
                  <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                    {form.amenities.split(",").map(a=>a.trim()).filter(Boolean).map((a,i)=>(
                      <span key={i} style={{background:"rgba(16,185,129,.1)",border:"1px solid rgba(16,185,129,.25)",color:"#6ee7b7",borderRadius:999,padding:"3px 11px",fontSize:11,fontWeight:600}}>{a}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5 — POLICIES */}
            {activeSection===5 && (
              <div style={{display:"flex",flexDirection:"column",gap:18}}>
                <SH icon="📜" title="Hotel Policies" desc="Check-in/out timings aur rules" />
                <G3>
                  {[["checkInTime","Check-In Time","12:00 PM"],["checkOutTime","Check-Out Time","11:00 AM"],["cancellationPolicy","Cancellation Policy","Free before 24hrs"]].map(([k,l,ph])=>(
                    <Fld key={k} label={l}><input className="lh_inp" style={inp} value={form.policies[k]} onChange={e=>setNested("policies",k,e.target.value)} placeholder={ph} /></Fld>
                  ))}
                </G3>
                <div style={{display:"flex",flexWrap:"wrap",gap:9}}>
                  {[["idProofRequired","🪪 ID Proof Required"],["petsAllowed","🐾 Pets Allowed"],["smokingAllowed","🚬 Smoking Allowed"],["unmarriedCouplesAllowed","💑 Unmarried Couples Allowed"]].map(([k,l])=>(
                    <Toggle key={k} on={form.policies[k]} onChange={v=>setNested("policies",k,v)} label={l} />
                  ))}
                </div>
              </div>
            )}

            {/* 6 — IMAGES */}
            {activeSection===6 && (
              <div style={{display:"flex",flexDirection:"column",gap:18}}>
                <SH icon="🖼️" title="Property Images" desc="Hotel ki photos upload karo" />
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:14}}>
                  {[["thumbnail","🖼️","Thumbnail","Main listing photo (1:1)"],["banner","🏨","Banner","Header banner (16:9)"]].map(([k,ico,title,desc])=>(
                    <div key={k} className="lh_file" style={{background:"#0b1220",border:`2px dashed ${C.border}`,borderRadius:12,padding:"24px 16px",textAlign:"center"}}>
                      <div style={{fontSize:36,marginBottom:8}}>{ico}</div>
                      <div style={{fontSize:14,fontWeight:700,color:C.text}}>{title}</div>
                      <div style={{fontSize:11,color:C.textMuted,marginTop:4,marginBottom:12}}>{desc}</div>
                      <input type="file" accept="image/*" onChange={e=>setFiles(p=>({...p,[k]:e.target.files[0]}))} />
                      {files[k] && <div style={{marginTop:10,fontSize:11,color:C.green,fontWeight:600}}>✓ {files[k].name}</div>}
                    </div>
                  ))}
                  <div className="lh_file" style={{background:"#0b1220",border:`2px dashed ${C.border}`,borderRadius:12,padding:"24px 16px",textAlign:"center"}}>
                    <div style={{fontSize:36,marginBottom:8}}>📸</div>
                    <div style={{fontSize:14,fontWeight:700,color:C.text}}>Gallery</div>
                    <div style={{fontSize:11,color:C.textMuted,marginTop:4,marginBottom:12}}>Multiple photos (max 20)</div>
                    <input type="file" accept="image/*" multiple onChange={e=>setFiles(p=>({...p,gallery:Array.from(e.target.files)}))} />
                    {files.gallery.length>0 && <div style={{marginTop:10,fontSize:11,color:C.green,fontWeight:600}}>✓ {files.gallery.length} photos selected</div>}
                  </div>
                </div>
              </div>
            )}

            {/* 7 — SEO */}
            {activeSection===7 && (
              <div style={{display:"flex",flexDirection:"column",gap:18}}>
                <SH icon="🔍" title="SEO & Status" desc="Search engine optimization settings" />
                <G2>
                  <Fld label="Meta Title"><input className="lh_inp" style={inp} value={form.seo.metaTitle} onChange={e=>setNested("seo","metaTitle",e.target.value)} placeholder="Best Couple Hotel in Delhi | Hotel Name" /></Fld>
                  <Fld label="Meta Keywords (comma sep.)"><input className="lh_inp" style={inp} value={form.seo.metaKeywords} onChange={e=>setNested("seo","metaKeywords",e.target.value)} placeholder="love hotel, couple, hourly booking" /></Fld>
                </G2>
                <Fld label="Meta Description (max 160 chars)">
                  <textarea className="lh_inp" style={{...inp,minHeight:80,resize:"vertical"}} value={form.seo.metaDescription} onChange={e=>setNested("seo","metaDescription",e.target.value)} placeholder="160 characters mein hotel description..." />
                </Fld>
                <div style={{fontSize:11,color:form.seo.metaDescription.length>160?C.red:C.textMuted,textAlign:"right"}}>{form.seo.metaDescription.length}/160</div>
              </div>
            )}

            {/* Footer */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:18,borderTop:`1px solid ${C.border}`,flexWrap:"wrap",gap:12}}>
              <div style={{display:"flex",gap:8}}>
                {activeSection>0 && <button type="button" onClick={()=>setActiveSection(s=>s-1)} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.textSub,borderRadius:9,padding:"10px 18px",cursor:"pointer",fontSize:13,fontFamily:"inherit",fontWeight:600}}>← Prev</button>}
                {activeSection<7 && <button type="button" onClick={()=>setActiveSection(s=>s+1)} style={{background:"rgba(79,110,247,.1)",border:"1px solid rgba(79,110,247,.25)",color:"#7b97fb",borderRadius:9,padding:"10px 18px",cursor:"pointer",fontSize:13,fontFamily:"inherit",fontWeight:600}}>Next →</button>}
              </div>
              <button type="submit" disabled={submitLoading} style={{background:"linear-gradient(135deg,#3d57e8,#6b42e0)",border:"none",color:"#fff",borderRadius:10,padding:"11px 26px",cursor:"pointer",fontSize:14,fontFamily:"inherit",fontWeight:700,boxShadow:"0 4px 18px rgba(79,110,247,.35)",display:"flex",alignItems:"center",gap:8,opacity:submitLoading?.6:1}}>
                {submitLoading?<><span style={{width:15,height:15,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"lh_sp .7s linear infinite",display:"inline-block"}}></span>Saving...</>:editId?"💾 Hotel Update Karo":"🚀 Hotel Submit"}
              </button>
            </div>
          </form>
        </div>

        {/* ═══════════ TABLE CARD ═══════════ */}
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,display:"flex",flexDirection:"column",overflow:"hidden"}}>

          {/* Table Card Header */}
          <div style={{padding:"20px 28px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,background:"linear-gradient(90deg,rgba(16,185,129,.06),transparent)",borderLeft:`3px solid ${C.green}`,flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:26}}>🏨</span>
              <div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:19,color:C.text,fontWeight:700}}>Hotels Directory</div>
                <div style={{fontSize:12,color:C.textMuted,marginTop:3}}>Saare hotels manage karo</div>
              </div>
            </div>
            <button onClick={fetchHotels} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.textSub,borderRadius:9,padding:"8px 15px",cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:600}}>↻ Refresh</button>
          </div>

          {/* Table Controls */}
          <div style={{padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,borderBottom:`1px solid ${C.border}`,flexWrap:"wrap",flexShrink:0}}>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {[{k:"all",l:"All",c:hotels.length},{k:"approved",l:"Approved",c:hotels.filter(h=>h.isApproved).length},{k:"pending",l:"Pending",c:hotels.filter(h=>!h.isApproved).length},{k:"featured",l:"Featured",c:hotels.filter(h=>h.isFeatured).length},{k:"inactive",l:"Inactive",c:hotels.filter(h=>!h.isActive).length}].map(t=>(
                <button key={t.k} className="lh_tb" onClick={()=>setActiveTab(t.k)} style={{background:activeTab===t.k?"rgba(79,110,247,.1)":"transparent",border:`1px solid ${activeTab===t.k?"rgba(79,110,247,.35)":"transparent"}`,color:activeTab===t.k?"#7b97fb":C.textMuted,borderRadius:8,padding:"7px 13px",cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:700,display:"flex",alignItems:"center",gap:6}}>
                  {t.l}<span style={{background:activeTab===t.k?"rgba(79,110,247,.2)":"#1a2640",borderRadius:999,padding:"1px 7px",fontSize:10,color:activeTab===t.k?"#7b97fb":C.textMuted}}>{t.c}</span>
                </button>
              ))}
            </div>
            <div style={{position:"relative",display:"flex",alignItems:"center"}}>
              <span style={{position:"absolute",left:10,fontSize:13}}>🔍</span>
              <input className="lh_inp" style={{...inp,width:240,paddingLeft:32}} placeholder="Name, city, ID..." value={search} onChange={e=>setSearch(e.target.value)} />
            </div>
          </div>

          {/* Table Body */}
          {loading ? (
            <div style={{padding:80,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
              <div style={{width:44,height:44,border:`3px solid ${C.border}`,borderTopColor:C.accent,borderRadius:"50%",animation:"lh_sp .8s linear infinite"}}></div>
              <div style={{color:C.textMuted,fontSize:13}}>Hotels load ho rahe hain...</div>
            </div>
          ) : filtered.length===0 ? (
            <div style={{padding:80,textAlign:"center"}}>
              <div style={{fontSize:52}}>🏜️</div>
              <div style={{color:C.textSub,marginTop:12,fontSize:15,fontWeight:600}}>Koi hotel nahi mila</div>
            </div>
          ) : (
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead>
                  <tr>
                    {["#","Property","Location","Stars","Price Range","Status","Flags","Actions"].map(h=>(
                      <th key={h} style={{padding:"11px 15px",fontSize:10,textTransform:"uppercase",letterSpacing:".08em",color:C.textMuted,fontWeight:700,textAlign:"left",whiteSpace:"nowrap",borderBottom:`1px solid ${C.border}`,background:"#0b1220"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((hotel,idx)=>(
                    <tr key={hotel._id} className="lh_row">
                      <td style={{padding:"13px 15px",verticalAlign:"middle",borderBottom:"1px solid #0c1525"}}><span style={{background:"#1a2640",color:C.textSub,borderRadius:6,padding:"3px 8px",fontSize:11,fontWeight:700}}>{idx+1}</span></td>
                      <td style={{padding:"13px 15px",verticalAlign:"middle",borderBottom:"1px solid #0c1525"}}>
                        <div style={{fontWeight:700,color:C.text,fontSize:13}}>{hotel.propertyName}</div>
                        <div style={{fontSize:11,color:C.textMuted,marginTop:1}}>{hotel.propertyType}</div>
                        <div style={{fontSize:10,color:"#1e2d45",marginTop:1,fontFamily:"monospace"}}>#{hotel.propertyId}</div>
                      </td>
                      <td style={{padding:"13px 15px",verticalAlign:"middle",borderBottom:"1px solid #0c1525"}}>
                        <div style={{fontSize:13,fontWeight:600,color:C.text}}>{hotel.address?.city||"—"}</div>
                        <div style={{fontSize:11,color:C.textMuted}}>{hotel.address?.state}</div>
                      </td>
                      <td style={{padding:"13px 15px",verticalAlign:"middle",borderBottom:"1px solid #0c1525"}}><Stars n={hotel.starRating} /></td>
                      <td style={{padding:"13px 15px",verticalAlign:"middle",borderBottom:"1px solid #0c1525"}}>
                        {hotel.priceRange?.minPrice?<span style={{fontSize:13,fontWeight:700,color:C.green}}>₹{hotel.priceRange.minPrice}–₹{hotel.priceRange.maxPrice}</span>:<span style={{color:"#1e2d45"}}>—</span>}
                      </td>
                      <td style={{padding:"13px 15px",verticalAlign:"middle",borderBottom:"1px solid #0c1525"}}>
                        <div style={{display:"flex",flexDirection:"column",gap:4}}>
                          {hotel.isApproved
                            ?<span style={{display:"inline-block",borderRadius:6,padding:"3px 9px",fontSize:10,fontWeight:700,color:C.green,background:"rgba(16,185,129,.1)",border:"1px solid rgba(16,185,129,.25)"}}>✅ Approved</span>
                            :<span style={{display:"inline-block",borderRadius:6,padding:"3px 9px",fontSize:10,fontWeight:700,color:C.orange,background:"rgba(245,158,11,.1)",border:"1px solid rgba(245,158,11,.25)"}}>⏳ Pending</span>}
                          {!hotel.isActive&&<span style={{display:"inline-block",borderRadius:6,padding:"3px 9px",fontSize:10,fontWeight:700,color:C.red,background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.25)"}}>🚫 Inactive</span>}
                        </div>
                      </td>
                      <td style={{padding:"13px 15px",verticalAlign:"middle",borderBottom:"1px solid #0c1525"}}>
                        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                          {hotel.isFeatured&&<span title="Featured" style={{fontSize:15}}>⭐</span>}
                          {hotel.isTrending&&<span title="Trending" style={{fontSize:15}}>🔥</span>}
                          {hotel.coupleFriendly&&<span title="Couple Friendly" style={{fontSize:15}}>💑</span>}
                          {hotel.hourlyBookingAvailable&&<span title="Hourly" style={{fontSize:15}}>⏰</span>}
                        </div>
                      </td>
                      <td style={{padding:"13px 15px",verticalAlign:"middle",borderBottom:"1px solid #0c1525"}}>
                        <div style={{display:"flex",gap:5}}>
                          <button className="lh_abn" title="View" onClick={()=>setViewHotel(hotel)} style={{background:"#0b1220",border:`1px solid ${C.border}`,borderRadius:7,padding:"6px 9px",cursor:"pointer",fontSize:13,transition:"all .15s"}}>👁</button>
                          <button className="lh_abn" title="Edit" onClick={()=>handleEdit(hotel)} style={{background:"#0b1220",border:`1px solid ${C.border}`,borderRadius:7,padding:"6px 9px",cursor:"pointer",fontSize:13,transition:"all .15s"}}>✏️</button>
                          {!hotel.isApproved&&<button className="lh_abn" title="Approve" onClick={()=>handleApprove(hotel._id)} style={{background:"#0b1220",border:`1px solid ${C.border}`,borderRadius:7,padding:"6px 9px",cursor:"pointer",fontSize:13,transition:"all .15s"}}>✅</button>}
                          {hotel.isApproved&&<button className="lh_abn" title="Reject" onClick={()=>handleReject(hotel._id)} style={{background:"#0b1220",border:`1px solid ${C.border}`,borderRadius:7,padding:"6px 9px",cursor:"pointer",fontSize:13,transition:"all .15s"}}>🚫</button>}
                          <button className="lh_abn" title="Delete" onClick={()=>handleDelete(hotel._id)} style={{background:"#0b1220",border:`1px solid ${C.border}`,borderRadius:7,padding:"6px 9px",cursor:"pointer",fontSize:13,transition:"all .15s"}}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div style={{padding:"12px 24px",display:"flex",justifyContent:"space-between",fontSize:11,color:C.textMuted,borderTop:`1px solid ${C.border}`,flexShrink:0}}>
            <span>{filtered.length} of {hotels.length} hotels</span>
            <span>Updated: {new Date().toLocaleTimeString("en-IN")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tiny helper components
function Toggle({on,onChange,label}) {
  return (
    <label style={{display:"flex",alignItems:"center",gap:9,padding:"9px 14px",cursor:"pointer",background:on?"rgba(79,110,247,.08)":"#0b1220",border:`1px solid ${on?"#4f6ef7":"#1a2640"}`,borderRadius:9,userSelect:"none",transition:"all .15s"}}>
      <input type="checkbox" checked={on} onChange={e=>onChange(e.target.checked)} style={{display:"none"}} />
      <div style={{width:34,height:18,borderRadius:999,background:on?"#4f6ef7":"#1a2640",position:"relative",flexShrink:0,transition:"background .18s"}}>
        <div style={{width:12,height:12,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:on?19:3,transition:"left .18s"}}></div>
      </div>
      <span style={{fontSize:12,fontWeight:600,color:on?"#e8edf5":"#7a8ea8"}}>{label}</span>
    </label>
  );
}
function SH({icon,title,desc}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:12,paddingBottom:14,borderBottom:"1px solid #1a2640",marginBottom:2}}>
      <span style={{fontSize:24}}>{icon}</span>
      <div>
        <div style={{fontSize:15,fontWeight:700,color:"#e8edf5"}}>{title}</div>
        <div style={{fontSize:11,color:"#4d607a",marginTop:2}}>{desc}</div>
      </div>
    </div>
  );
}
function Fld({label,children}) {
  return <div style={{display:"flex",flexDirection:"column",gap:6}}><label style={{fontSize:10,fontWeight:700,color:"#7a8ea8",textTransform:"uppercase",letterSpacing:".06em"}}>{label}</label>{children}</div>;
}
function G2({children}) { return <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14}}>{children}</div>; }
function G3({children}) { return <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:14}}>{children}</div>; }
function Stars({n=3}) { return <span>{Array.from({length:5},(_,i)=><span key={i} style={{color:i<n?"#f59e0b":"#1e2d40",fontSize:13}}>★</span>)}</span>; }