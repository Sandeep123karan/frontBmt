import { useState, useEffect, useRef } from "react";

const API = "https://bmtadmin.onrender.com/api/place";
const PER_PAGE = 8;

const CATEGORIES = ["Tourist Place","City","Beach","Mountain","Temple","Historical","Adventure","Shopping","Nightlife","Other"];
const AMENITIES_LIST = ["Parking","Washroom","WiFi","Food Court","Ticket Counter","Guide Available","Wheelchair Access","CCTV","First Aid","Drinking Water","Photography Allowed","Locker Room"];
const ACTIVITIES_LIST = ["Boating","Trekking","Camping","Rock Climbing","Zip-lining","Paragliding","Snorkeling","Cycling","Photography","Bird Watching","Rappelling","River Rafting"];
const SEASONS = ["Summer","Winter","Monsoon","Spring","Autumn","All Year Round"];
const TAGS_LIST = ["Honeymoon","Family","Couple","Solo","Adventure","Spiritual","Budget","Luxury","Nature","History","Photography","Weekend Getaway"];

const initialForm = {
  placeName:"", shortDescription:"", fullDescription:"",
  highlights:[""],
  country:"India", state:"", city:"", area:"", address:"", pincode:"",
  location:{ latitude:"", longitude:"", googleMapLink:"" },
  category:"Tourist Place",
  coverImage:null, bannerImage:null, gallery:[],
  videos:[""],
  openingTime:"", closingTime:"", bestTimeToVisit:"", recommendedDuration:"",
  entryFee:{ adult:0, child:0, foreigner:0 },
  amenities:[], activities:[],
  nearbyHotels:[""], nearbyRestaurants:[""], nearbyPlaces:[""],
  bestSeason:"", temperature:"",
  faqs:[{ question:"", answer:"" }],
  tags:[],
  metaTitle:"", metaDescription:"", metaKeywords:[""],
  isPopular:false, isTrending:false, isTopDestination:false, isRecommended:false,
  status:"pending", addedBy:"admin", vendorId:"",
};

export default function PlaceManagement() {
  const [places, setPlaces] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [editId, setEditId] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [coverPrev, setCoverPrev] = useState(null);
  const [bannerPrev, setBannerPrev] = useState(null);
  const [galleryPrev, setGalleryPrev] = useState([]);
  const coverRef = useRef(); const bannerRef = useRef(); const galleryRef = useRef();

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => setPage(1), [search, filterCat, filterStatus]);

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/all`);
      const d = await r.json();
      setPlaces(d.data || []);
    } catch { showToast("Failed to load", "error"); }
    finally { setLoading(false); }
  };

  // --- array field helpers ---
  const arrChange = (key, idx, val) => setForm(p => {
    const a = [...p[key]]; a[idx] = val; return { ...p, [key]: a };
  });
  const arrAdd = (key, empty="") => setForm(p => ({ ...p, [key]: [...p[key], empty] }));
  const arrRemove = (key, idx) => setForm(p => ({ ...p, [key]: p[key].filter((_, i) => i !== idx) }));

  const nestedChange = (key, field, val) => setForm(p => ({ ...p, [key]: { ...p[key], [field]: val } }));
  const feeChange = (field, val) => setForm(p => ({ ...p, entryFee: { ...p.entryFee, [field]: val } }));

  const toggleArr = (key, val) => setForm(p => ({
    ...p, [key]: p[key].includes(val) ? p[key].filter(x => x !== val) : [...p[key], val]
  }));
  const toggleBool = (key) => setForm(p => ({ ...p, [key]: !p[key] }));

  const faqChange = (idx, field, val) => setForm(p => {
    const f = [...p.faqs]; f[idx] = { ...f[idx], [field]: val }; return { ...p, faqs: f };
  });

  // --- image handlers ---
  const handleCover = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(p => ({ ...p, coverImage: file }));
    setCoverPrev(URL.createObjectURL(file));
  };
  const handleBanner = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(p => ({ ...p, bannerImage: file }));
    setBannerPrev(URL.createObjectURL(file));
  };
  const handleGallery = (e) => {
    const files = Array.from(e.target.files);
    const existing = form.gallery || [];
    if (existing.length + files.length > 10) { showToast("Max 10 gallery images","error"); return; }
    setForm(p => ({ ...p, gallery: [...(p.gallery||[]), ...files] }));
    setGalleryPrev(p => [...p, ...files.map(f => URL.createObjectURL(f))]);
    if (galleryRef.current) galleryRef.current.value = "";
  };
  const removeGallery = (idx) => {
    setForm(p => ({ ...p, gallery: p.gallery.filter((_,i)=>i!==idx) }));
    setGalleryPrev(p => p.filter((_,i)=>i!==idx));
  };

  // --- submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      // flat fields
      const skip = ["coverImage","bannerImage","gallery","highlights","videos","nearbyHotels","nearbyRestaurants","nearbyPlaces","amenities","activities","tags","metaKeywords","faqs","location","entryFee"];
      Object.entries(form).forEach(([k,v]) => {
        if (!skip.includes(k)) fd.append(k, v ?? "");
      });
      // nested
      fd.append("location[latitude]", form.location.latitude);
      fd.append("location[longitude]", form.location.longitude);
      fd.append("location[googleMapLink]", form.location.googleMapLink);
      fd.append("entryFee[adult]", form.entryFee.adult);
      fd.append("entryFee[child]", form.entryFee.child);
      fd.append("entryFee[foreigner]", form.entryFee.foreigner);
      // arrays
      form.highlights.filter(Boolean).forEach(h => fd.append("highlights[]", h));
      form.videos.filter(Boolean).forEach(v => fd.append("videos[]", v));
      form.nearbyHotels.filter(Boolean).forEach(v => fd.append("nearbyHotels[]", v));
      form.nearbyRestaurants.filter(Boolean).forEach(v => fd.append("nearbyRestaurants[]", v));
      form.nearbyPlaces.filter(Boolean).forEach(v => fd.append("nearbyPlaces[]", v));
      form.amenities.forEach(v => fd.append("amenities[]", v));
      form.activities.forEach(v => fd.append("activities[]", v));
      form.tags.forEach(v => fd.append("tags[]", v));
      form.metaKeywords.filter(Boolean).forEach(v => fd.append("metaKeywords[]", v));
      form.faqs.filter(f=>f.question).forEach((f,i) => {
        fd.append(`faqs[${i}][question]`, f.question);
        fd.append(`faqs[${i}][answer]`, f.answer);
      });
      // booleans
      ["isPopular","isTrending","isTopDestination","isRecommended"].forEach(k => fd.set(k, form[k]));
      // files
      if (form.coverImage instanceof File) fd.append("coverImage", form.coverImage);
      if (form.bannerImage instanceof File) fd.append("bannerImage", form.bannerImage);
      (form.gallery||[]).forEach(f => { if (f instanceof File) fd.append("gallery", f); });

      const method = editId ? "PUT" : "POST";
      const url = editId ? `${API}/update/${editId}` : `${API}/create`;
      const r = await fetch(url, { method, body: fd });
      const d = await r.json();
      if (d.success) {
        showToast(editId ? "Updated!" : "Place added!");
        resetForm(); fetchAll();
      } else showToast(d.message || "Error", "error");
    } catch(err) { showToast("Failed: " + err.message, "error"); }
    finally { setSubmitting(false); }
  };

  const resetForm = () => {
    setForm(initialForm); setEditId(null); setActiveTab("basic");
    setCoverPrev(null); setBannerPrev(null); setGalleryPrev([]);
  };

  const handleEdit = (p) => {
    setForm({
      ...initialForm, ...p,
      location: p.location || { latitude:"", longitude:"", googleMapLink:"" },
      entryFee: p.entryFee || { adult:0, child:0, foreigner:0 },
      highlights: p.highlights?.length ? p.highlights : [""],
      videos: p.videos?.length ? p.videos : [""],
      nearbyHotels: p.nearbyHotels?.length ? p.nearbyHotels : [""],
      nearbyRestaurants: p.nearbyRestaurants?.length ? p.nearbyRestaurants : [""],
      nearbyPlaces: p.nearbyPlaces?.length ? p.nearbyPlaces : [""],
      faqs: p.faqs?.length ? p.faqs : [{ question:"", answer:"" }],
      metaKeywords: p.metaKeywords?.length ? p.metaKeywords : [""],
      amenities: p.amenities || [],
      activities: p.activities || [],
      tags: p.tags || [],
      gallery: [],
    });
    setCoverPrev(p.coverImage || null);
    setBannerPrev(p.bannerImage || null);
    setGalleryPrev(p.gallery || []);
    setEditId(p._id);
    setActiveTab("basic");
    window.scrollTo({ top:0, behavior:"smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/delete/${id}`, { method:"DELETE" });
      showToast("Deleted!"); setDeleteModal(null); fetchAll();
    } catch { showToast("Delete failed","error"); }
  };

  const filtered = places.filter(p => {
    const q = search.toLowerCase();
    const m = p.placeName?.toLowerCase().includes(q) || p.city?.toLowerCase().includes(q) || p.state?.toLowerCase().includes(q);
    const c = filterCat === "all" || p.category === filterCat;
    const s = filterStatus === "all" || p.status === filterStatus;
    return m && c && s;
  });
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const sColor = (s) => ({
    active:   { c:"#4ade80", bg:"rgba(74,222,128,0.08)",  b:"rgba(74,222,128,0.25)" },
    inactive: { c:"#f87171", bg:"rgba(248,113,113,0.08)", b:"rgba(248,113,113,0.25)" },
    pending:  { c:"#fbbf24", bg:"rgba(251,191,36,0.08)",  b:"rgba(251,191,36,0.25)" },
  }[s] || { c:"#888", bg:"#1a1a28", b:"#333" });

  const catColor = (c) => {
    const m = { Beach:"#38bdf8", Mountain:"#a78bfa", Temple:"#fbbf24", Historical:"#fb923c", Adventure:"#4ade80", City:"#e879f9" };
    return m[c] || "#94a3b8";
  };

  const stats = [
    { label:"Total",      val:places.length,                              c:"#7c3aed" },
    { label:"Active",     val:places.filter(p=>p.status==="active").length, c:"#4ade80" },
    { label:"Pending",    val:places.filter(p=>p.status==="pending").length, c:"#fbbf24" },
    { label:"Trending",   val:places.filter(p=>p.isTrending).length,       c:"#38bdf8" },
    { label:"Top Dest.",  val:places.filter(p=>p.isTopDestination).length,  c:"#fb923c" },
  ];

  const tabs = [
    { id:"basic",    label:"🏔 Basic" },
    { id:"location", label:"📍 Location" },
    { id:"images",   label:"🖼 Images" },
    { id:"timing",   label:"⏰ Timing & Fees" },
    { id:"features", label:"✨ Features" },
    { id:"nearby",   label:"🏨 Nearby" },
    { id:"content",  label:"📝 Content" },
    { id:"seo",      label:"🔍 SEO" },
    { id:"settings", label:"⚙️ Settings" },
  ];

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#080b14", minHeight:"100vh", color:"#cbd5e1" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:wght@600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes slideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(36px)}to{opacity:1;transform:translateX(0)}}
        @keyframes popIn{from{opacity:0;transform:scale(0.93)}to{opacity:1;transform:scale(1)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        *{box-sizing:border-box;margin:0;padding:0}
        input,select,textarea{outline:none;font-family:'DM Sans',sans-serif;transition:border-color .2s,box-shadow .2s}
        input:focus,select:focus,textarea:focus{border-color:#6366f1!important;box-shadow:0 0 0 3px rgba(99,102,241,0.15)!important}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#080b14}
        ::-webkit-scrollbar-thumb{background:#1e2535;border-radius:4px}
        .rh:hover{background:rgba(99,102,241,0.04)!important}
        .tab-btn:hover{color:#a5b4fc!important}
        .pill:hover{transform:translateY(-1px)}
        .act-btn:hover{opacity:.75;transform:scale(.91)}
        .drop:hover,.drop:focus-within{border-color:#6366f1!important;background:rgba(99,102,241,0.05)!important}
        .ph:hover:not(:disabled){background:rgba(99,102,241,0.14)!important;color:#a5b4fc!important}
        .gallery-card:hover .gc-overlay{opacity:1!important}
        .gallery-card:hover{border-color:#6366f1!important}
      `}</style>

      {/* TOAST */}
      {toast && (
        <div style={{ position:"fixed",top:18,right:18,zIndex:9999,padding:"12px 22px",borderRadius:10,fontSize:13,fontWeight:500,background:toast.type==="error"?"#160808":"#081608",border:`1px solid ${toast.type==="error"?"#f87171":"#4ade80"}`,color:toast.type==="error"?"#f87171":"#4ade80",boxShadow:"0 20px 60px rgba(0,0,0,.8)",animation:"slideIn .25s ease" }}>
          {toast.type==="error"?"✗ ":"✓ "}{toast.msg}
        </div>
      )}

      {/* LIGHTBOX */}
      {lightbox && (
        <div onClick={()=>setLightbox(null)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.97)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn .2s ease" }}>
          <div onClick={e=>e.stopPropagation()} style={{ position:"relative",maxWidth:"90vw",maxHeight:"90vh",display:"flex",flexDirection:"column",alignItems:"center",gap:12 }}>
            <img src={lightbox.images[lightbox.idx]} alt="" style={{ maxWidth:"88vw",maxHeight:"78vh",objectFit:"contain",borderRadius:12,boxShadow:"0 40px 100px rgba(0,0,0,.9)" }} />
            <div style={{ display:"flex",gap:8,alignItems:"center" }}>
              <button onClick={()=>setLightbox(l=>({...l,idx:Math.max(0,l.idx-1)}))} disabled={lightbox.idx===0}
                style={{ width:36,height:36,borderRadius:8,background:"#111827",border:"1px solid #1e2535",color:lightbox.idx===0?"#1e2535":"#cbd5e1",cursor:lightbox.idx===0?"not-allowed":"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center" }}>‹</button>
              <span style={{ color:"#4b5563",fontSize:12 }}>{lightbox.idx+1} / {lightbox.images.length}</span>
              <button onClick={()=>setLightbox(l=>({...l,idx:Math.min(l.images.length-1,l.idx+1)}))} disabled={lightbox.idx===lightbox.images.length-1}
                style={{ width:36,height:36,borderRadius:8,background:"#111827",border:"1px solid #1e2535",color:lightbox.idx===lightbox.images.length-1?"#1e2535":"#cbd5e1",cursor:lightbox.idx===lightbox.images.length-1?"not-allowed":"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center" }}>›</button>
            </div>
          </div>
          <button onClick={()=>setLightbox(null)} style={{ position:"fixed",top:16,right:16,width:38,height:38,borderRadius:10,background:"#111827",border:"1px solid #1e2535",color:"#64748b",cursor:"pointer",fontSize:18 }}>✕</button>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewData && <ViewModal data={viewData} onClose={()=>setViewData(null)} sColor={sColor} catColor={catColor} onLightbox={setLightbox} />}

      {/* DELETE MODAL */}
      {deleteModal && (
        <ModalWrap onClose={()=>setDeleteModal(null)}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:48,marginBottom:14 }}>🗺️</div>
            <h3 style={{ fontFamily:"'Playfair Display',serif",color:"#f87171",marginBottom:8,fontSize:20 }}>Delete Place?</h3>
            <p style={{ color:"#4b5563",fontSize:13,marginBottom:26,lineHeight:1.6 }}>This will permanently remove the place and all its data.</p>
            <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
              <Btn ghost onClick={()=>setDeleteModal(null)}>Cancel</Btn>
              <Btn danger onClick={()=>handleDelete(deleteModal)}>Delete</Btn>
            </div>
          </div>
        </ModalWrap>
      )}

      <div style={{ maxWidth:1500,margin:"0 auto",padding:"32px 20px" }}>

        {/* HEADER */}
        <div style={{ marginBottom:32 }}>
          <div style={{ display:"flex",alignItems:"center",gap:16,marginBottom:22 }}>
            <div style={{ width:54,height:54,borderRadius:16,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0,boxShadow:"0 8px 24px rgba(99,102,241,0.4)" }}>🗺️</div>
            <div>
              <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:32,fontWeight:800,color:"#f1f5f9",lineHeight:1 }}>Place Management</h1>
              <p style={{ color:"#334155",fontSize:13,marginTop:5 }}>Manage tourist destinations, cities, and attractions</p>
            </div>
          </div>
          <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
            {stats.map(s => (
              <div key={s.label} style={{ background:"#0d1117",border:"1px solid #1e2535",borderRadius:14,padding:"14px 22px",minWidth:106 }}>
                <div style={{ fontSize:26,fontWeight:700,color:s.c,fontFamily:"'Playfair Display',serif" }}>{s.val}</div>
                <div style={{ fontSize:12,color:"#334155",marginTop:3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== FORM ===== */}
        <div style={{ background:"#0d1117",border:"1px solid #1e2535",borderRadius:20,marginBottom:36,overflow:"hidden",animation:"slideUp .35s ease" }}>
          <div style={{ padding:"18px 28px",borderBottom:"1px solid #1e2535",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#0a0e17" }}>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <span style={{ fontSize:18 }}>{editId?"✏️":"➕"}</span>
              <span style={{ fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:18,color:"#f1f5f9" }}>{editId?"Edit Place":"Add New Place"}</span>
            </div>
            {editId && <button onClick={resetForm} style={{ padding:"7px 18px",background:"#111827",border:"1px solid #1e2535",borderRadius:8,color:"#64748b",cursor:"pointer",fontSize:12 }}>✕ Cancel</button>}
          </div>

          {/* TABS */}
          <div style={{ display:"flex",overflowX:"auto",background:"#0a0e17",borderBottom:"1px solid #1e2535",padding:"0 20px",gap:2 }}>
            {tabs.map(t => (
              <button key={t.id} className="tab-btn" onClick={()=>setActiveTab(t.id)}
                style={{ padding:"13px 16px",background:"transparent",border:"none",borderBottom:activeTab===t.id?"2px solid #6366f1":"2px solid transparent",color:activeTab===t.id?"#a5b4fc":"#334155",cursor:"pointer",fontSize:12.5,fontWeight:500,whiteSpace:"nowrap",transition:"color .2s" }}>
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ padding:"28px" }}>

              {activeTab==="basic" && (
                <div style={{ display:"flex",flexDirection:"column",gap:22 }}>
                  <Grid>
                    <Field label="Place Name *">
                      <FInput name="placeName" value={form.placeName} onChange={e=>setForm(p=>({...p,placeName:e.target.value}))} placeholder="Taj Mahal" required />
                    </Field>
                    <Field label="Category">
                      <FSelect value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>
                        {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                      </FSelect>
                    </Field>
                    <Field label="Short Description" full>
                      <FTextarea value={form.shortDescription} onChange={e=>setForm(p=>({...p,shortDescription:e.target.value}))} placeholder="Brief one-line description..." rows={2} />
                    </Field>
                    <Field label="Full Description" full>
                      <FTextarea value={form.fullDescription} onChange={e=>setForm(p=>({...p,fullDescription:e.target.value}))} placeholder="Detailed description of the place..." rows={4} />
                    </Field>
                  </Grid>
                  <div>
                    <Label>Highlights</Label>
                    <div style={{ display:"flex",flexDirection:"column",gap:8,marginTop:10 }}>
                      {form.highlights.map((h,i) => (
                        <div key={i} style={{ display:"flex",gap:8 }}>
                          <FInput value={h} onChange={e=>arrChange("highlights",i,e.target.value)} placeholder={`Highlight ${i+1}...`} />
                          {form.highlights.length>1 && <SmBtn red onClick={()=>arrRemove("highlights",i)}>✕</SmBtn>}
                        </div>
                      ))}
                      <AddBtn onClick={()=>arrAdd("highlights")}>+ Add Highlight</AddBtn>
                    </div>
                  </div>
                </div>
              )}

              {activeTab==="location" && (
                <Grid>
                  <Field label="Country *"><FInput value={form.country} onChange={e=>setForm(p=>({...p,country:e.target.value}))} placeholder="India" /></Field>
                  <Field label="State"><FInput value={form.state} onChange={e=>setForm(p=>({...p,state:e.target.value}))} placeholder="Uttar Pradesh" /></Field>
                  <Field label="City *"><FInput value={form.city} onChange={e=>setForm(p=>({...p,city:e.target.value}))} placeholder="Agra" required /></Field>
                  <Field label="Area"><FInput value={form.area} onChange={e=>setForm(p=>({...p,area:e.target.value}))} placeholder="Taj Nagri" /></Field>
                  <Field label="Address" full><FTextarea value={form.address} onChange={e=>setForm(p=>({...p,address:e.target.value}))} placeholder="Full address..." rows={2} /></Field>
                  <Field label="Pincode"><FInput value={form.pincode} onChange={e=>setForm(p=>({...p,pincode:e.target.value}))} placeholder="282001" /></Field>
                  <Field label="Latitude"><FInput value={form.location.latitude} onChange={e=>nestedChange("location","latitude",e.target.value)} placeholder="27.1751" /></Field>
                  <Field label="Longitude"><FInput value={form.location.longitude} onChange={e=>nestedChange("location","longitude",e.target.value)} placeholder="78.0421" /></Field>
                  <Field label="Google Map Link" full><FInput value={form.location.googleMapLink} onChange={e=>nestedChange("location","googleMapLink",e.target.value)} placeholder="https://maps.google.com/..." /></Field>
                </Grid>
              )}

              {activeTab==="images" && (
                <div style={{ display:"flex",flexDirection:"column",gap:28 }}>
                  {/* Cover Image */}
                  <div>
                    <Label>Cover Image <span style={{ color:"#334155",fontWeight:400,textTransform:"none",letterSpacing:0 }}>(Main thumbnail)</span></Label>
                    <div className="drop" onClick={()=>coverRef.current?.click()}
                      style={{ marginTop:10,border:"2px dashed #1e2535",borderRadius:14,padding:coverPrev?"12px":"40px 20px",textAlign:"center",cursor:"pointer",background:"#080b14",transition:"all .2s",position:"relative" }}>
                      <input ref={coverRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleCover} />
                      {coverPrev ? (
                        <div style={{ position:"relative",display:"inline-block" }}>
                          <img src={coverPrev} alt="cover" style={{ maxHeight:200,maxWidth:"100%",borderRadius:10,objectFit:"cover" }} />
                          <button type="button" onClick={e=>{e.stopPropagation();setCoverPrev(null);setForm(p=>({...p,coverImage:null}));}}
                            style={{ position:"absolute",top:-8,right:-8,width:22,height:22,borderRadius:"50%",background:"#f87171",border:"none",color:"#fff",cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
                        </div>
                      ) : (
                        <>
                          <div style={{ fontSize:36,marginBottom:8 }}>🖼️</div>
                          <div style={{ color:"#a5b4fc",fontSize:13,fontWeight:500 }}>Click to upload cover image</div>
                          <div style={{ color:"#334155",fontSize:12,marginTop:4 }}>PNG, JPG, WEBP • Recommended 1200×800</div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Banner Image */}
                  <div>
                    <Label>Banner Image <span style={{ color:"#334155",fontWeight:400,textTransform:"none",letterSpacing:0 }}>(Wide banner)</span></Label>
                    <div className="drop" onClick={()=>bannerRef.current?.click()}
                      style={{ marginTop:10,border:"2px dashed #1e2535",borderRadius:14,padding:bannerPrev?"12px":"40px 20px",textAlign:"center",cursor:"pointer",background:"#080b14",transition:"all .2s" }}>
                      <input ref={bannerRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleBanner} />
                      {bannerPrev ? (
                        <div style={{ position:"relative",display:"inline-block" }}>
                          <img src={bannerPrev} alt="banner" style={{ maxHeight:150,maxWidth:"100%",borderRadius:10,objectFit:"cover" }} />
                          <button type="button" onClick={e=>{e.stopPropagation();setBannerPrev(null);setForm(p=>({...p,bannerImage:null}));}}
                            style={{ position:"absolute",top:-8,right:-8,width:22,height:22,borderRadius:"50%",background:"#f87171",border:"none",color:"#fff",cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
                        </div>
                      ) : (
                        <>
                          <div style={{ fontSize:36,marginBottom:8 }}>🏞️</div>
                          <div style={{ color:"#a5b4fc",fontSize:13,fontWeight:500 }}>Click to upload banner image</div>
                          <div style={{ color:"#334155",fontSize:12,marginTop:4 }}>PNG, JPG, WEBP • Recommended 1920×500</div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Gallery */}
                  <div>
                    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
                      <Label>Gallery <span style={{ color:"#334155",fontWeight:400,textTransform:"none",letterSpacing:0 }}>(Max 10 photos)</span></Label>
                      <span style={{ fontSize:12,color:galleryPrev.length>=10?"#f87171":"#334155",fontWeight:600 }}>{galleryPrev.length}/10</span>
                    </div>
                    {galleryPrev.length < 10 && (
                      <div className="drop" onClick={()=>galleryRef.current?.click()}
                        style={{ border:"2px dashed #1e2535",borderRadius:14,padding:"28px 20px",textAlign:"center",cursor:"pointer",background:"#080b14",transition:"all .2s",marginBottom:14 }}>
                        <input ref={galleryRef} type="file" accept="image/*" multiple style={{ display:"none" }} onChange={handleGallery} />
                        <div style={{ fontSize:30,marginBottom:6 }}>📷</div>
                        <div style={{ color:"#a5b4fc",fontSize:13,fontWeight:500 }}>Click to add gallery images</div>
                        <div style={{ color:"#334155",fontSize:12,marginTop:4 }}>Max {10-galleryPrev.length} more images</div>
                      </div>
                    )}
                    {galleryPrev.length > 0 && (
                      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:12 }}>
                        {galleryPrev.map((src,i) => (
                          <div key={i} className="gallery-card" style={{ position:"relative",borderRadius:10,overflow:"hidden",border:"2px solid #1e2535",paddingTop:"70%",background:"#080b14",transition:"border-color .2s",cursor:"pointer" }}>
                            <img src={src} alt="" onClick={()=>setLightbox({images:galleryPrev,idx:i})} style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover" }} />
                            <div className="gc-overlay" style={{ position:"absolute",inset:0,background:"rgba(0,0,0,.5)",opacity:0,transition:"opacity .2s",display:"flex",alignItems:"center",justifyContent:"center" }}>
                              <button type="button" onClick={()=>setLightbox({images:galleryPrev,idx:i})} style={{ width:32,height:32,borderRadius:7,background:"rgba(255,255,255,.15)",border:"none",color:"#fff",cursor:"pointer",fontSize:15 }}>👁</button>
                            </div>
                            <button type="button" onClick={()=>removeGallery(i)}
                              style={{ position:"absolute",top:6,right:6,width:22,height:22,borderRadius:"50%",background:"rgba(248,113,113,.9)",border:"none",color:"#fff",cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Video Links */}
                  <div>
                    <Label>Video Links (YouTube)</Label>
                    <div style={{ display:"flex",flexDirection:"column",gap:8,marginTop:10 }}>
                      {form.videos.map((v,i) => (
                        <div key={i} style={{ display:"flex",gap:8 }}>
                          <FInput value={v} onChange={e=>arrChange("videos",i,e.target.value)} placeholder="https://youtube.com/watch?v=..." />
                          {form.videos.length>1 && <SmBtn red onClick={()=>arrRemove("videos",i)}>✕</SmBtn>}
                        </div>
                      ))}
                      <AddBtn onClick={()=>arrAdd("videos")}>+ Add Video Link</AddBtn>
                    </div>
                  </div>
                </div>
              )}

              {activeTab==="timing" && (
                <div style={{ display:"flex",flexDirection:"column",gap:24 }}>
                  <Grid>
                    <Field label="Opening Time"><FInput type="time" value={form.openingTime} onChange={e=>setForm(p=>({...p,openingTime:e.target.value}))} /></Field>
                    <Field label="Closing Time"><FInput type="time" value={form.closingTime} onChange={e=>setForm(p=>({...p,closingTime:e.target.value}))} /></Field>
                    <Field label="Best Time to Visit"><FInput value={form.bestTimeToVisit} onChange={e=>setForm(p=>({...p,bestTimeToVisit:e.target.value}))} placeholder="October - March" /></Field>
                    <Field label="Recommended Duration"><FInput value={form.recommendedDuration} onChange={e=>setForm(p=>({...p,recommendedDuration:e.target.value}))} placeholder="2-3 Hours" /></Field>
                    <Field label="Best Season">
                      <FSelect value={form.bestSeason} onChange={e=>setForm(p=>({...p,bestSeason:e.target.value}))}>
                        <option value="">Select Season</option>
                        {SEASONS.map(s=><option key={s}>{s}</option>)}
                      </FSelect>
                    </Field>
                    <Field label="Temperature Range"><FInput value={form.temperature} onChange={e=>setForm(p=>({...p,temperature:e.target.value}))} placeholder="15°C - 35°C" /></Field>
                  </Grid>
                  <div>
                    <Label>Entry Fee</Label>
                    <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12,marginTop:12 }}>
                      {[["adult","Adult (₹)"],["child","Child (₹)"],["foreigner","Foreigner (₹)"]].map(([k,l]) => (
                        <Field key={k} label={l}>
                          <FInput type="number" value={form.entryFee[k]} onChange={e=>feeChange(k,e.target.value)} placeholder="0" />
                        </Field>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>FAQs</Label>
                    <div style={{ display:"flex",flexDirection:"column",gap:12,marginTop:10 }}>
                      {form.faqs.map((f,i) => (
                        <div key={i} style={{ background:"#080b14",border:"1px solid #1e2535",borderRadius:12,padding:16 }}>
                          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:10 }}>
                            <span style={{ fontSize:12,color:"#6366f1",fontWeight:600 }}>FAQ {i+1}</span>
                            {form.faqs.length>1 && <SmBtn red onClick={()=>setForm(p=>({...p,faqs:p.faqs.filter((_,ii)=>ii!==i)}))}>Remove</SmBtn>}
                          </div>
                          <FInput value={f.question} onChange={e=>faqChange(i,"question",e.target.value)} placeholder="Question..." style={{ marginBottom:8 }} />
                          <FTextarea value={f.answer} onChange={e=>faqChange(i,"answer",e.target.value)} placeholder="Answer..." rows={2} />
                        </div>
                      ))}
                      <AddBtn onClick={()=>setForm(p=>({...p,faqs:[...p.faqs,{question:"",answer:""}]}))}>+ Add FAQ</AddBtn>
                    </div>
                  </div>
                </div>
              )}

              {activeTab==="features" && (
                <div style={{ display:"flex",flexDirection:"column",gap:26 }}>
                  <div>
                    <Label>Amenities</Label>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginTop:12 }}>
                      {AMENITIES_LIST.map(a => {
                        const on = form.amenities.includes(a);
                        return <Chip key={a} on={on} onClick={()=>toggleArr("amenities",a)}>{on&&"✓ "}{a}</Chip>;
                      })}
                    </div>
                  </div>
                  <div>
                    <Label>Activities</Label>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginTop:12 }}>
                      {ACTIVITIES_LIST.map(a => {
                        const on = form.activities.includes(a);
                        return <Chip key={a} on={on} onClick={()=>toggleArr("activities",a)}>{on&&"✓ "}{a}</Chip>;
                      })}
                    </div>
                  </div>
                  <div>
                    <Label>Tags</Label>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginTop:12 }}>
                      {TAGS_LIST.map(t => {
                        const on = form.tags.includes(t);
                        return <Chip key={t} on={on} accent="#f59e0b" onClick={()=>toggleArr("tags",t)}>{on&&"✓ "}{t}</Chip>;
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab==="nearby" && (
                <div style={{ display:"flex",flexDirection:"column",gap:24 }}>
                  {[["nearbyHotels","🏨 Nearby Hotels"],["nearbyRestaurants","🍽️ Nearby Restaurants"],["nearbyPlaces","📍 Nearby Places"]].map(([key,title]) => (
                    <div key={key}>
                      <Label>{title}</Label>
                      <div style={{ display:"flex",flexDirection:"column",gap:8,marginTop:10 }}>
                        {form[key].map((v,i) => (
                          <div key={i} style={{ display:"flex",gap:8 }}>
                            <FInput value={v} onChange={e=>arrChange(key,i,e.target.value)} placeholder="Name..." />
                            {form[key].length>1 && <SmBtn red onClick={()=>arrRemove(key,i)}>✕</SmBtn>}
                          </div>
                        ))}
                        <AddBtn onClick={()=>arrAdd(key)}>+ Add</AddBtn>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab==="content" && (
                <div style={{ display:"flex",flexDirection:"column",gap:22 }}>
                  <Field label="Meta Title">
                    <FInput value={form.metaTitle} onChange={e=>setForm(p=>({...p,metaTitle:e.target.value}))} placeholder="Taj Mahal - Wonder of the World | YourSite" />
                  </Field>
                  <Field label="Meta Description">
                    <FTextarea value={form.metaDescription} onChange={e=>setForm(p=>({...p,metaDescription:e.target.value}))} placeholder="SEO description..." rows={3} />
                  </Field>
                  <div>
                    <Label>Meta Keywords</Label>
                    <div style={{ display:"flex",flexDirection:"column",gap:8,marginTop:10 }}>
                      {form.metaKeywords.map((k,i) => (
                        <div key={i} style={{ display:"flex",gap:8 }}>
                          <FInput value={k} onChange={e=>arrChange("metaKeywords",i,e.target.value)} placeholder="keyword..." />
                          {form.metaKeywords.length>1 && <SmBtn red onClick={()=>arrRemove("metaKeywords",i)}>✕</SmBtn>}
                        </div>
                      ))}
                      <AddBtn onClick={()=>arrAdd("metaKeywords")}>+ Add Keyword</AddBtn>
                    </div>
                  </div>
                </div>
              )}

              {activeTab==="seo" && (
                <div style={{ display:"flex",flexDirection:"column",gap:22 }}>
                  <Field label="Vendor ID">
                    <FInput value={form.vendorId} onChange={e=>setForm(p=>({...p,vendorId:e.target.value}))} placeholder="VND001" />
                  </Field>
                  <Field label="Added By">
                    <FSelect value={form.addedBy} onChange={e=>setForm(p=>({...p,addedBy:e.target.value}))}>
                      <option>admin</option><option>vendor</option>
                    </FSelect>
                  </Field>
                </div>
              )}

              {activeTab==="settings" && (
                <div style={{ display:"flex",flexDirection:"column",gap:24 }}>
                  <Grid>
                    <Field label="Status">
                      <FSelect value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}>
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </FSelect>
                    </Field>
                    <Field label="Added By">
                      <FSelect value={form.addedBy} onChange={e=>setForm(p=>({...p,addedBy:e.target.value}))}>
                        <option>admin</option><option>vendor</option>
                      </FSelect>
                    </Field>
                    <Field label="Vendor ID">
                      <FInput value={form.vendorId} onChange={e=>setForm(p=>({...p,vendorId:e.target.value}))} placeholder="VND001" />
                    </Field>
                  </Grid>
                  <div style={{ display:"flex",flexWrap:"wrap",gap:20,marginTop:4 }}>
                    {[["isPopular","⭐ Popular"],["isTrending","🔥 Trending"],["isTopDestination","🏆 Top Destination"],["isRecommended","💡 Recommended"]].map(([k,l]) => (
                      <Check key={k} label={l} checked={form[k]} onChange={()=>toggleBool(k)} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding:"16px 28px",borderTop:"1px solid #1e2535",display:"flex",gap:10,justifyContent:"flex-end",background:"#0a0e17" }}>
              <Btn ghost onClick={resetForm}>Reset</Btn>
              <Btn primary type="submit" disabled={submitting}>
                {submitting?"Saving...":editId?"Update Place":"Add Place"}
              </Btn>
            </div>
          </form>
        </div>

        {/* ===== TABLE ===== */}
        <div style={{ background:"#0d1117",border:"1px solid #1e2535",borderRadius:20,overflow:"hidden",animation:"slideUp .45s ease" }}>
          <div style={{ padding:"18px 24px",borderBottom:"1px solid #1e2535",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,background:"#0a0e17" }}>
            <div style={{ fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:18,color:"#f1f5f9" }}>
              All Places <span style={{ color:"#334155",fontSize:13,fontWeight:400 }}>({filtered.length})</span>
            </div>
            <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search places, city..."
                style={{ padding:"8px 14px",background:"#080b14",border:"1px solid #1e2535",borderRadius:8,color:"#cbd5e1",fontSize:13,width:230 }} />
              <select value={filterCat} onChange={e=>setFilterCat(e.target.value)}
                style={{ padding:"8px 12px",background:"#080b14",border:"1px solid #1e2535",borderRadius:8,color:"#cbd5e1",fontSize:13,cursor:"pointer" }}>
                <option value="all">All Categories</option>
                {CATEGORIES.map(c=><option key={c}>{c}</option>)}
              </select>
              <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
                style={{ padding:"8px 12px",background:"#080b14",border:"1px solid #1e2535",borderRadius:8,color:"#cbd5e1",fontSize:13,cursor:"pointer" }}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button onClick={fetchAll} style={{ padding:"8px 14px",background:"#111827",border:"1px solid #1e2535",borderRadius:8,color:"#64748b",cursor:"pointer",fontSize:13 }}>↺</button>
            </div>
          </div>

          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
              <thead>
                <tr style={{ background:"#080b14",borderBottom:"1px solid #1e2535" }}>
                  {["#","Place","Category","Location","Timing","Rating","Status","Flags","Actions"].map(h=>(
                    <th key={h} style={{ padding:"11px 14px",textAlign:"left",color:"#334155",fontWeight:600,fontSize:11,letterSpacing:".07em",textTransform:"uppercase",whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} style={{ padding:60,textAlign:"center",color:"#1e2535" }}>
                    <div style={{ fontSize:36,marginBottom:10 }}>⏳</div>Loading...
                  </td></tr>
                ) : paginated.length===0 ? (
                  <tr><td colSpan={9} style={{ padding:60,textAlign:"center",color:"#1e2535" }}>
                    <div style={{ fontSize:40,marginBottom:10 }}>🗺️</div>No places found
                  </td></tr>
                ) : paginated.map((p,i) => {
                  const sc = sColor(p.status);
                  const cc = catColor(p.category);
                  return (
                    <tr key={p._id} className="rh" style={{ borderBottom:"1px solid #0f1520",transition:"background .15s" }}>
                      <td style={{ padding:"13px 14px",color:"#1e2535",fontWeight:600 }}>{(page-1)*PER_PAGE+i+1}</td>
                      <td style={{ padding:"13px 14px" }}>
                        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                          <div style={{ width:46,height:38,borderRadius:8,overflow:"hidden",background:"#080b14",border:"1px solid #1e2535",flexShrink:0 }}>
                            {p.coverImage
                              ? <img src={p.coverImage} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                              : <div style={{ width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"#1e2535" }}>🏔</div>
                            }
                          </div>
                          <div>
                            <div style={{ fontWeight:600,color:"#f1f5f9" }}>{p.placeName}</div>
                            <div style={{ fontSize:11,color:"#334155",marginTop:1 }}>{p.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:"13px 14px" }}>
                        <span style={{ fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:10,background:`${cc}15`,border:`1px solid ${cc}40`,color:cc }}>{p.category}</span>
                      </td>
                      <td style={{ padding:"13px 14px",color:"#475569" }}>
                        <div>{p.city}{p.state?`, ${p.state}`:""}</div>
                        {p.country && <div style={{ fontSize:11,color:"#334155",marginTop:1 }}>{p.country}</div>}
                      </td>
                      <td style={{ padding:"13px 14px",color:"#475569" }}>
                        {p.openingTime && p.closingTime
                          ? <div style={{ fontSize:12 }}>{p.openingTime} - {p.closingTime}</div>
                          : <span style={{ color:"#1e2535" }}>—</span>
                        }
                        {p.recommendedDuration && <div style={{ fontSize:11,color:"#334155",marginTop:2 }}>{p.recommendedDuration}</div>}
                      </td>
                      <td style={{ padding:"13px 14px" }}>
                        <div style={{ color:"#fbbf24",fontWeight:600 }}>★ {p.rating?.toFixed(1)||"0.0"}</div>
                        <div style={{ fontSize:11,color:"#334155",marginTop:1 }}>{p.totalReviews||0} reviews</div>
                      </td>
                      <td style={{ padding:"13px 14px" }}>
                        <span style={{ fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:12,background:sc.bg,border:`1px solid ${sc.b}`,color:sc.c }}>
                          {p.status?.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding:"13px 14px" }}>
                        <div style={{ display:"flex",gap:3,flexWrap:"wrap" }}>
                          {p.isTrending && <span title="Trending" style={{ fontSize:10,padding:"2px 6px",borderRadius:4,background:"rgba(56,189,248,.1)",border:"1px solid rgba(56,189,248,.3)",color:"#38bdf8" }}>🔥</span>}
                          {p.isPopular && <span title="Popular" style={{ fontSize:10,padding:"2px 6px",borderRadius:4,background:"rgba(251,191,36,.1)",border:"1px solid rgba(251,191,36,.3)",color:"#fbbf24" }}>⭐</span>}
                          {p.isTopDestination && <span title="Top Dest." style={{ fontSize:10,padding:"2px 6px",borderRadius:4,background:"rgba(251,146,60,.1)",border:"1px solid rgba(251,146,60,.3)",color:"#fb923c" }}>🏆</span>}
                          {p.isRecommended && <span title="Recommended" style={{ fontSize:10,padding:"2px 6px",borderRadius:4,background:"rgba(99,102,241,.1)",border:"1px solid rgba(99,102,241,.3)",color:"#a5b4fc" }}>💡</span>}
                        </div>
                      </td>
                      <td style={{ padding:"13px 14px" }}>
                        <div style={{ display:"flex",gap:5 }}>
                          <ActBtn color="#38bdf8" onClick={()=>setViewData(p)} title="View">👁</ActBtn>
                          <ActBtn color="#6366f1" onClick={()=>handleEdit(p)} title="Edit">✎</ActBtn>
                          <ActBtn color="#f87171" onClick={()=>setDeleteModal(p._id)} title="Delete">🗑</ActBtn>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages>1 && (
            <div style={{ padding:"14px 24px",borderTop:"1px solid #1e2535",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,background:"#0a0e17" }}>
              <div style={{ fontSize:13,color:"#334155" }}>
                Showing {Math.min((page-1)*PER_PAGE+1,filtered.length)}–{Math.min(page*PER_PAGE,filtered.length)} of {filtered.length}
              </div>
              <div style={{ display:"flex",gap:5,alignItems:"center" }}>
                <PBtn disabled={page===1} onClick={()=>setPage(1)}>«</PBtn>
                <PBtn disabled={page===1} onClick={()=>setPage(p=>p-1)}>‹</PBtn>
                {Array.from({length:totalPages},(_,i)=>i+1)
                  .filter(p=>p===1||p===totalPages||Math.abs(p-page)<=1)
                  .reduce((acc,p,idx,arr)=>{if(idx>0&&p-arr[idx-1]>1)acc.push("...");acc.push(p);return acc;},[])
                  .map((p,idx)=>p==="..."
                    ?<span key={`d${idx}`} style={{ color:"#334155",padding:"0 4px",fontSize:13 }}>•••</span>
                    :<PBtn key={p} active={page===p} onClick={()=>setPage(p)}>{p}</PBtn>
                  )}
                <PBtn disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>›</PBtn>
                <PBtn disabled={page===totalPages} onClick={()=>setPage(totalPages)}>»</PBtn>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===================== VIEW MODAL ===================== */
function ViewModal({ data: p, onClose, sColor, catColor, onLightbox }) {
  const sc = sColor(p.status);
  const cc = catColor(p.category);
  const [activeImg, setActiveImg] = useState(0);
  const gallery = p.gallery || [];
  const allImgs = [p.coverImage, ...gallery].filter(Boolean);

  const InfoCard = ({ label, value }) => value ? (
    <div style={{ background:"#080b14",border:"1px solid #1e2535",borderRadius:9,padding:"10px 14px" }}>
      <div style={{ fontSize:11,color:"#334155",marginBottom:4 }}>{label}</div>
      <div style={{ fontSize:13,color:"#a5b4fc",wordBreak:"break-all" }}>{String(value)}</div>
    </div>
  ) : null;

  const Section = ({ title, children }) => (
    <div style={{ marginBottom:24 }}>
      <div style={{ fontSize:11,color:"#6366f1",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",marginBottom:12,paddingBottom:7,borderBottom:"1px solid #1e2535" }}>{title}</div>
      {children}
    </div>
  );

  const InfoGrid = ({ items }) => (
    <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10 }}>
      {items.map(([l,v])=><InfoCard key={l} label={l} value={v} />)}
    </div>
  );

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.92)",zIndex:9990,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:20,overflowY:"auto" }}>
      <div style={{ background:"#0d1117",border:"1px solid #1e2535",borderRadius:20,width:"100%",maxWidth:920,animation:"popIn .3s ease",marginTop:10,marginBottom:10 }}>

        {/* Header */}
        <div style={{ padding:"20px 26px",borderBottom:"1px solid #1e2535",display:"flex",alignItems:"flex-start",justifyContent:"space-between",background:"#0a0e17",borderRadius:"20px 20px 0 0",gap:12 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:6 }}>
              <span style={{ fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:10,background:`${cc}15`,border:`1px solid ${cc}40`,color:cc }}>{p.category}</span>
              <span style={{ fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:12,background:sc.bg,border:`1px solid ${sc.b}`,color:sc.c }}>{p.status?.toUpperCase()}</span>
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:800,color:"#f1f5f9",margin:0 }}>{p.placeName}</h2>
            <div style={{ fontSize:12,color:"#334155",marginTop:4 }}>{p.city}{p.state?`, ${p.state}`:""}{p.country?` · ${p.country}`:""}</div>
          </div>
          <button onClick={onClose} style={{ width:34,height:34,borderRadius:9,background:"#111827",border:"1px solid #1e2535",color:"#64748b",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>✕</button>
        </div>

        <div style={{ padding:"26px" }}>

          {/* FLAGS */}
          <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:22 }}>
            {[["isTrending","🔥 Trending","#38bdf8"],["isPopular","⭐ Popular","#fbbf24"],["isTopDestination","🏆 Top Destination","#fb923c"],["isRecommended","💡 Recommended","#a5b4fc"]].map(([k,l,c])=>
              p[k] ? <span key={k} style={{ fontSize:12,fontWeight:600,padding:"4px 12px",borderRadius:20,background:`${c}15`,border:`1px solid ${c}40`,color:c }}>{l}</span> : null
            )}
          </div>

          {/* IMAGES SECTION */}
          {allImgs.length > 0 && (
            <Section title="📸 Photos">
              {/* Banner if exists */}
              {p.bannerImage && (
                <div style={{ borderRadius:12,overflow:"hidden",marginBottom:14,cursor:"zoom-in" }} onClick={()=>onLightbox({images:[p.bannerImage,...allImgs],idx:0})}>
                  <img src={p.bannerImage} alt="banner" style={{ width:"100%",height:180,objectFit:"cover",display:"block" }} />
                </div>
              )}

              {/* Main image + thumbnails */}
              <div style={{ position:"relative",borderRadius:12,overflow:"hidden",cursor:"zoom-in",marginBottom:10 }}
                onClick={()=>onLightbox({images:allImgs,idx:activeImg})}>
                <img src={allImgs[activeImg]} alt="main" style={{ width:"100%",height:300,objectFit:"cover",display:"block" }} />
                <div style={{ position:"absolute",bottom:10,right:10,background:"rgba(0,0,0,.6)",color:"#fff",fontSize:11,padding:"3px 9px",borderRadius:5,backdropFilter:"blur(4px)" }}>
                  🔍 Click to zoom
                </div>
                {allImgs.length > 1 && (<>
                  <button onClick={e=>{e.stopPropagation();setActiveImg(i=>Math.max(0,i-1));}} disabled={activeImg===0}
                    style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",width:32,height:32,borderRadius:8,background:"rgba(0,0,0,.6)",border:"none",color:activeImg===0?"#333":"#fff",cursor:activeImg===0?"not-allowed":"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)" }}>‹</button>
                  <button onClick={e=>{e.stopPropagation();setActiveImg(i=>Math.min(allImgs.length-1,i+1));}} disabled={activeImg===allImgs.length-1}
                    style={{ position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",width:32,height:32,borderRadius:8,background:"rgba(0,0,0,.6)",border:"none",color:activeImg===allImgs.length-1?"#333":"#fff",cursor:activeImg===allImgs.length-1?"not-allowed":"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)" }}>›</button>
                </>)}
              </div>

              {allImgs.length > 1 && (
                <div style={{ display:"flex",gap:8,overflowX:"auto",paddingBottom:4 }}>
                  {allImgs.map((img,i) => (
                    <div key={i} onClick={()=>setActiveImg(i)}
                      style={{ flexShrink:0,width:72,height:54,borderRadius:8,overflow:"hidden",cursor:"pointer",border:`2px solid ${activeImg===i?"#6366f1":"transparent"}`,opacity:activeImg===i?1:.55,transition:"all .15s" }}>
                      <img src={img} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                    </div>
                  ))}
                </div>
              )}
            </Section>
          )}

          {/* SHORT DESCRIPTION */}
          {p.shortDescription && (
            <div style={{ background:"rgba(99,102,241,.06)",border:"1px solid rgba(99,102,241,.15)",borderRadius:12,padding:"14px 18px",marginBottom:24,color:"#94a3b8",fontSize:14,lineHeight:1.6,fontStyle:"italic" }}>
              "{p.shortDescription}"
            </div>
          )}

          {/* BASIC INFO */}
          <Section title="🏔 Basic Info">
            <InfoGrid items={[
              ["Place Name",p.placeName],["Slug",p.slug],["Category",p.category],["Status",p.status],
              ["Added By",p.addedBy],["Vendor ID",p.vendorId],["Created",p.createdAt?new Date(p.createdAt).toLocaleDateString():null]
            ]} />
          </Section>

          {/* LOCATION */}
          <Section title="📍 Location">
            <InfoGrid items={[
              ["Country",p.country],["State",p.state],["City",p.city],["Area",p.area],
              ["Pincode",p.pincode],["Latitude",p.location?.latitude],["Longitude",p.location?.longitude]
            ]} />
            {p.address && <div style={{ marginTop:10,background:"#080b14",border:"1px solid #1e2535",borderRadius:9,padding:"10px 14px" }}>
              <div style={{ fontSize:11,color:"#334155",marginBottom:4 }}>Full Address</div>
              <div style={{ fontSize:13,color:"#a5b4fc" }}>{p.address}</div>
            </div>}
            {p.location?.googleMapLink && (
              <a href={p.location.googleMapLink} target="_blank" rel="noreferrer"
                style={{ display:"inline-flex",alignItems:"center",gap:6,marginTop:10,padding:"7px 14px",background:"rgba(99,102,241,.1)",border:"1px solid rgba(99,102,241,.25)",borderRadius:8,color:"#a5b4fc",textDecoration:"none",fontSize:12,fontWeight:500 }}>
                🗺️ Open in Google Maps
              </a>
            )}
          </Section>

          {/* TIMING & FEES */}
          <Section title="⏰ Timing & Entry">
            <InfoGrid items={[
              ["Opening Time",p.openingTime],["Closing Time",p.closingTime],
              ["Best Time",p.bestTimeToVisit],["Duration",p.recommendedDuration],
              ["Best Season",p.bestSeason],["Temperature",p.temperature],
              ["Adult Fee",p.entryFee?.adult!=null?`₹${p.entryFee.adult}`:null],
              ["Child Fee",p.entryFee?.child!=null?`₹${p.entryFee.child}`:null],
              ["Foreigner Fee",p.entryFee?.foreigner!=null?`₹${p.entryFee.foreigner}`:null],
            ]} />
          </Section>

          {/* RATINGS */}
          <Section title="⭐ Ratings">
            <InfoGrid items={[["Rating",p.rating?.toFixed(1)],["Total Reviews",p.totalReviews]]} />
            {p.reviews?.length > 0 && (
              <div style={{ marginTop:12,display:"flex",flexDirection:"column",gap:8 }}>
                {p.reviews.slice(0,3).map((r,i) => (
                  <div key={i} style={{ background:"#080b14",border:"1px solid #1e2535",borderRadius:10,padding:"12px 14px" }}>
                    <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                      <span style={{ fontSize:13,fontWeight:600,color:"#e2e8f0" }}>{r.userName||"Anonymous"}</span>
                      <span style={{ fontSize:12,color:"#fbbf24" }}>★ {r.rating}</span>
                    </div>
                    <div style={{ fontSize:13,color:"#64748b" }}>{r.comment}</div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* HIGHLIGHTS */}
          {p.highlights?.length > 0 && (
            <Section title="✨ Highlights">
              <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                {p.highlights.map((h,i) => (
                  <div key={i} style={{ display:"flex",alignItems:"center",gap:10,fontSize:13,color:"#94a3b8" }}>
                    <span style={{ color:"#6366f1",fontWeight:700 }}>→</span> {h}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* AMENITIES & ACTIVITIES */}
          {(p.amenities?.length > 0 || p.activities?.length > 0) && (
            <Section title="🎯 Amenities & Activities">
              {p.amenities?.length > 0 && (
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:11,color:"#334155",marginBottom:8 }}>AMENITIES</div>
                  <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                    {p.amenities.map(a=><span key={a} style={{ fontSize:12,color:"#a5b4fc",background:"rgba(99,102,241,.1)",border:"1px solid rgba(99,102,241,.2)",borderRadius:5,padding:"3px 10px" }}>{a}</span>)}
                  </div>
                </div>
              )}
              {p.activities?.length > 0 && (
                <div>
                  <div style={{ fontSize:11,color:"#334155",marginBottom:8 }}>ACTIVITIES</div>
                  <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                    {p.activities.map(a=><span key={a} style={{ fontSize:12,color:"#4ade80",background:"rgba(74,222,128,.08)",border:"1px solid rgba(74,222,128,.2)",borderRadius:5,padding:"3px 10px" }}>{a}</span>)}
                  </div>
                </div>
              )}
            </Section>
          )}

          {/* TAGS */}
          {p.tags?.length > 0 && (
            <Section title="🏷 Tags">
              <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                {p.tags.map(t=><span key={t} style={{ fontSize:12,color:"#fbbf24",background:"rgba(251,191,36,.08)",border:"1px solid rgba(251,191,36,.2)",borderRadius:5,padding:"3px 10px" }}>{t}</span>)}
              </div>
            </Section>
          )}

          {/* NEARBY */}
          {(p.nearbyHotels?.length||p.nearbyRestaurants?.length||p.nearbyPlaces?.length) ? (
            <Section title="🏨 Nearby">
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14 }}>
                {[["🏨 Hotels",p.nearbyHotels],["🍽️ Restaurants",p.nearbyRestaurants],["📍 Places",p.nearbyPlaces]].map(([l,arr])=>
                  arr?.filter(Boolean).length ? (
                    <div key={l} style={{ background:"#080b14",border:"1px solid #1e2535",borderRadius:10,padding:14 }}>
                      <div style={{ fontSize:12,color:"#6366f1",fontWeight:600,marginBottom:8 }}>{l}</div>
                      {arr.filter(Boolean).map((x,i)=><div key={i} style={{ fontSize:13,color:"#64748b",padding:"3px 0" }}>• {x}</div>)}
                    </div>
                  ) : null
                )}
              </div>
            </Section>
          ) : null}

          {/* VIDEOS */}
          {p.videos?.filter(Boolean).length > 0 && (
            <Section title="🎬 Videos">
              <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                {p.videos.filter(Boolean).map((v,i)=>(
                  <a key={i} href={v} target="_blank" rel="noreferrer"
                    style={{ fontSize:13,color:"#f87171",textDecoration:"none",display:"flex",alignItems:"center",gap:6 }}>
                    ▶ {v}
                  </a>
                ))}
              </div>
            </Section>
          )}

          {/* FAQS */}
          {p.faqs?.filter(f=>f.question).length > 0 && (
            <Section title="❓ FAQs">
              <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                {p.faqs.filter(f=>f.question).map((f,i)=>(
                  <div key={i} style={{ background:"#080b14",border:"1px solid #1e2535",borderRadius:10,padding:"12px 16px" }}>
                    <div style={{ fontSize:13,color:"#e2e8f0",fontWeight:600,marginBottom:6 }}>Q: {f.question}</div>
                    <div style={{ fontSize:13,color:"#64748b" }}>A: {f.answer}</div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* DESCRIPTION */}
          {p.fullDescription && (
            <Section title="📝 Full Description">
              <p style={{ color:"#64748b",fontSize:13,lineHeight:1.8,margin:0 }}>{p.fullDescription}</p>
            </Section>
          )}

          {/* SEO */}
          {(p.metaTitle||p.metaDescription) && (
            <Section title="🔍 SEO">
              <InfoGrid items={[["Meta Title",p.metaTitle],["Meta Description",p.metaDescription]]} />
              {p.metaKeywords?.filter(Boolean).length > 0 && (
                <div style={{ marginTop:10,display:"flex",flexWrap:"wrap",gap:6 }}>
                  {p.metaKeywords.filter(Boolean).map(k=><span key={k} style={{ fontSize:11,color:"#64748b",background:"#111827",border:"1px solid #1e2535",borderRadius:4,padding:"2px 8px" }}>{k}</span>)}
                </div>
              )}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===================== SMALL COMPONENTS ===================== */
function ModalWrap({ children, onClose }) {
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.88)",zIndex:9995,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
      <div style={{ background:"#0d1117",border:"1px solid #1e2535",borderRadius:20,padding:"38px 32px",maxWidth:420,width:"100%",animation:"popIn .25s ease",position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute",top:14,right:14,width:28,height:28,borderRadius:7,background:"#111827",border:"1px solid #1e2535",color:"#64748b",cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
        {children}
      </div>
    </div>
  );
}

function Grid({ children }) {
  return <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:18 }}>{children}</div>;
}
function Field({ label, children, full }) {
  return (
    <div style={full?{gridColumn:"1/-1"}:{}}>
      <Label>{label}</Label>
      <div style={{ marginTop:7 }}>{children}</div>
    </div>
  );
}
function Label({ children }) {
  return <div style={{ fontSize:11,color:"#334155",fontWeight:600,letterSpacing:".05em",textTransform:"uppercase" }}>{children}</div>;
}
function FInput({ style, ...props }) {
  return <input {...props} style={{ width:"100%",padding:"9px 12px",background:"#080b14",border:"1px solid #1e2535",borderRadius:8,color:"#cbd5e1",fontSize:13,boxSizing:"border-box",...style }} />;
}
function FSelect({ children, ...props }) {
  return <select {...props} style={{ width:"100%",padding:"9px 12px",background:"#080b14",border:"1px solid #1e2535",borderRadius:8,color:"#cbd5e1",fontSize:13,cursor:"pointer",boxSizing:"border-box" }}>{children}</select>;
}
function FTextarea({ style, ...props }) {
  return <textarea {...props} style={{ width:"100%",padding:"9px 12px",background:"#080b14",border:"1px solid #1e2535",borderRadius:8,color:"#cbd5e1",fontSize:13,resize:"vertical",lineHeight:1.6,boxSizing:"border-box",...style }} />;
}
function Chip({ children, on, accent="#6366f1", onClick }) {
  return (
    <div className="pill" onClick={onClick}
      style={{ padding:"7px 15px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:500,transition:"all .2s",userSelect:"none",border:`1px solid ${on?accent:`${accent}30`}`,background:on?`${accent}20`:"#0d1117",color:on?accent:"#334155" }}>
      {children}
    </div>
  );
}
function Check({ label, checked, onChange }) {
  return (
    <label style={{ display:"flex",alignItems:"center",gap:9,cursor:"pointer",fontSize:13,color:checked?"#a5b4fc":"#475569",userSelect:"none" }}>
      <div onClick={onChange} style={{ width:20,height:20,borderRadius:5,border:`2px solid ${checked?"#6366f1":"#1e2535"}`,background:checked?"#6366f1":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s",cursor:"pointer" }}>
        {checked&&<span style={{ color:"#fff",fontSize:11 }}>✓</span>}
      </div>
      {label}
    </label>
  );
}
function SmBtn({ children, red, onClick }) {
  return (
    <button type="button" onClick={onClick}
      style={{ padding:"0 12px",height:38,borderRadius:8,background:red?"rgba(248,113,113,.1)":"rgba(99,102,241,.1)",border:`1px solid ${red?"rgba(248,113,113,.25)":"rgba(99,102,241,.25)"}`,color:red?"#f87171":"#a5b4fc",cursor:"pointer",fontSize:12,fontWeight:600,flexShrink:0 }}>
      {children}
    </button>
  );
}
function AddBtn({ children, onClick }) {
  return (
    <button type="button" onClick={onClick}
      style={{ alignSelf:"flex-start",padding:"6px 16px",background:"rgba(99,102,241,.1)",border:"1px solid rgba(99,102,241,.25)",borderRadius:8,color:"#a5b4fc",cursor:"pointer",fontSize:12,fontWeight:600 }}>
      {children}
    </button>
  );
}
function Btn({ children, primary, ghost, danger, onClick, type="button", disabled }) {
  const bg = primary?"linear-gradient(135deg,#6366f1,#8b5cf6)":danger?"#f87171":ghost?"#111827":"#111827";
  const border = ghost||danger?"1px solid #1e2535":"none";
  const color = ghost?"#64748b":danger?"#fff":"#fff";
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ padding:"9px 24px",background:disabled?"#1e2535":bg,border,borderRadius:9,color:disabled?"#334155":color,cursor:disabled?"not-allowed":"pointer",fontSize:13,fontWeight:600,opacity:disabled?.7:1 }}>
      {children}
    </button>
  );
}
function ActBtn({ children, color, onClick, title }) {
  return (
    <button className="act-btn" onClick={onClick} title={title}
      style={{ width:30,height:30,borderRadius:7,background:`${color}18`,border:`1px solid ${color}30`,color,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s",flexShrink:0 }}>
      {children}
    </button>
  );
}
function PBtn({ children, onClick, disabled, active }) {
  return (
    <button className="ph" onClick={onClick} disabled={disabled}
      style={{ minWidth:34,height:34,borderRadius:8,border:active?"1px solid #6366f1":"1px solid #1e2535",background:active?"rgba(99,102,241,.14)":"#0d1117",color:active?"#a5b4fc":disabled?"#1e2535":"#475569",cursor:disabled?"not-allowed":"pointer",fontSize:13,fontWeight:active?600:400,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s" }}>
      {children}
    </button>
  );
}