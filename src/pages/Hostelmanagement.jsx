import { useState, useEffect, useRef } from "react";

const API = "http://localhost:9000/api/hostel";
const PER_PAGE = 8;

const AMENITIES_LIST = [
  "WiFi","AC","Hot Water","CCTV","Power Backup","Washing Machine","Study Room",
  "Common Room","Locker","Gym","Library","Parking","Lift","Security Guard",
  "Water Purifier","Geyser","Microwave","Refrigerator","TV","Newspaper",
  "Housekeeping","Laundry","Solar Water","Fire Safety"
];
const BED_TYPES = ["Single Bed","Double Bed","Bunk Bed","Triple Bed","Dormitory"];

const emptyRoom = { roomName:"", bedType:"", occupancy:"", pricePerMonth:"", pricePerDay:"", availableRooms:"" };

const initialForm = {
  hostelName:"", description:"",
  ownerName:"", companyName:"", email:"", phone:"", alternatePhone:"",
  country:"India", state:"", city:"", area:"", address:"", pincode:"",
  latitude:"", longitude:"", googleMapLink:"",
  hostelType:"Boys",
  totalRooms:"", totalBeds:"",
  roomTypes:[{ ...emptyRoom }],
  amenities:[], foodAvailable:false, messCharges:"",
  checkInTime:"", checkOutTime:"", gateClosingTime:"",
  rules:[""],
  gstNumber:"",
  addedBy:"vendor", isActive:true, featured:false, status:"pending",
};

const emptyFiles = {
  hostelImages:[], receptionImages:[], roomGallery:[], washroomImages:[], kitchenImages:[],
  ownerAadharFront:null, ownerAadharBack:null, ownerPanCard:null,
  gstCertificate:null, propertyDocument:null, policeVerification:null,
  ownerPhoto:null, cancelledCheque:null, otherDocuments:[],
};
const emptyPrev = {
  hostelImages:[], receptionImages:[], roomGallery:[], washroomImages:[], kitchenImages:[],
  ownerAadharFront:null, ownerAadharBack:null, ownerPanCard:null,
  gstCertificate:null, propertyDocument:null, policeVerification:null,
  ownerPhoto:null, cancelledCheque:null, otherDocuments:[],
};

export default function HostelManagement() {
  const [hostels, setHostels] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [fileState, setFileState] = useState(emptyFiles);
  const [prevState, setPrevState] = useState(emptyPrev);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [editId, setEditId] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [statusModal, setStatusModal] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [docModal, setDocModal] = useState(null);

  const MULTI_FIELDS = ["hostelImages","receptionImages","roomGallery","washroomImages","kitchenImages","otherDocuments"];
  const SINGLE_FIELDS = ["ownerAadharFront","ownerAadharBack","ownerPanCard","gstCertificate","propertyDocument","policeVerification","ownerPhoto","cancelledCheque"];
  const refs = Object.fromEntries([...MULTI_FIELDS,...SINGLE_FIELDS].map(k=>[k,useRef()]));

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => setPage(1), [search, filterStatus, filterType]);

  const showToast = (msg, type="success") => { setToast({ msg, type }); setTimeout(()=>setToast(null), 3500); };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/all`);
      const d = await r.json();
      setHostels(d.hostels || []);
    } catch { showToast("Failed to load","error"); }
    finally { setLoading(false); }
  };

  const fc = (e) => { const { name,value,type,checked } = e.target; setForm(p=>({...p,[name]:type==="checkbox"?checked:value})); };
  const toggleBool = (k) => setForm(p=>({...p,[k]:!p[k]}));
  const toggleAmenity = (val) => setForm(p=>({...p,amenities:p.amenities.includes(val)?p.amenities.filter(x=>x!==val):[...p.amenities,val]}));

  // rules
  const ruleChange = (i,val) => setForm(p=>{const r=[...p.rules];r[i]=val;return{...p,rules:r};});
  const addRule = () => setForm(p=>({...p,rules:[...p.rules,""]}));
  const removeRule = (i) => setForm(p=>({...p,rules:p.rules.filter((_,ii)=>ii!==i)}));

  // rooms
  const roomChange = (i,field,val) => setForm(p=>{const r=[...p.roomTypes];r[i]={...r[i],[field]:val};return{...p,roomTypes:r};});
  const addRoom = () => setForm(p=>({...p,roomTypes:[...p.roomTypes,{...emptyRoom}]}));
  const removeRoom = (i) => setForm(p=>({...p,roomTypes:p.roomTypes.filter((_,ii)=>ii!==i)}));

  // file handlers
  const handleSingle = (field) => (e) => {
    const f = e.target.files[0]; if(!f) return;
    setFileState(p=>({...p,[field]:f}));
    setPrevState(p=>({...p,[field]:URL.createObjectURL(f)}));
  };
  const handleMulti = (field, max) => (e) => {
    const fs = Array.from(e.target.files);
    const cur = fileState[field].length;
    if(cur+fs.length>max){showToast(`Max ${max} files`,"error");return;}
    setFileState(p=>({...p,[field]:[...p[field],...fs]}));
    setPrevState(p=>({...p,[field]:[...p[field],...fs.map(f=>URL.createObjectURL(f))]}));
    if(refs[field]?.current) refs[field].current.value="";
  };
  const removeSingle = (field) => { setFileState(p=>({...p,[field]:null})); setPrevState(p=>({...p,[field]:null})); };
  const removeMulti = (field,idx) => {
    setFileState(p=>({...p,[field]:p[field].filter((_,i)=>i!==idx)}));
    setPrevState(p=>({...p,[field]:p[field].filter((_,i)=>i!==idx)}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      const fd = new FormData();
      const skip = ["amenities","roomTypes","rules"];
      Object.entries(form).forEach(([k,v])=>{ if(!skip.includes(k)) fd.append(k,v??""); });
      // fd.append("amenities", JSON.stringify(form.amenities));
      // fd.append("roomTypes", JSON.stringify(form.roomTypes));
      // fd.append("rules", JSON.stringify(form.rules.filter(Boolean)));
      fd.append("amenities", JSON.stringify(form.amenities));
fd.append("roomTypes", JSON.stringify(form.roomTypes));
fd.append("rules", JSON.stringify(form.rules.filter(Boolean)));

fd.append("documents", JSON.stringify({
  gstNumber: form.gstNumber
}));

["foodAvailable","isActive","featured"].forEach(k=>fd.set(k,form[k]));
      ["foodAvailable","isActive","featured"].forEach(k=>fd.set(k,form[k]));

      MULTI_FIELDS.forEach(field=>{ fileState[field].forEach(f=>fd.append(field,f)); });
      SINGLE_FIELDS.forEach(field=>{ if(fileState[field]) fd.append(field,fileState[field]); });

      const method = editId?"PUT":"POST";
      const url = editId?`${API}/update/${editId}`:`${API}/add`;
      const r = await fetch(url,{method,body:fd});
      const d = await r.json();
      if(d.success){showToast(editId?"Updated!":"Hostel added!");resetForm();fetchAll();}
      else showToast(d.message||"Error","error");
    } catch(err){showToast("Failed: "+err.message,"error");}
    finally{setSubmitting(false);}
  };

  const resetForm = () => {
    setForm(initialForm); setEditId(null); setActiveTab("basic");
    setFileState(emptyFiles); setPrevState(emptyPrev);
  };

  const handleEdit = (h) => {
    setForm({
      ...initialForm,...h,
      roomTypes:h.roomTypes?.length?h.roomTypes:[{...emptyRoom}],
      amenities:h.amenities||[],
      rules:h.rules?.length?h.rules:[""],
      gstNumber:h.documents?.gstNumber||"",
    });
    setPrevState({
      hostelImages:h.hostelImages||[], receptionImages:h.receptionImages||[],
      roomGallery:h.roomGallery||[], washroomImages:h.washroomImages||[], kitchenImages:h.kitchenImages||[],
      ownerAadharFront:h.documents?.ownerAadharFront||null, ownerAadharBack:h.documents?.ownerAadharBack||null,
      ownerPanCard:h.documents?.ownerPanCard||null, gstCertificate:h.documents?.gstCertificate||null,
      propertyDocument:h.documents?.propertyDocument||null, policeVerification:h.documents?.policeVerification||null,
      ownerPhoto:h.documents?.ownerPhoto||null, cancelledCheque:h.documents?.cancelledCheque||null,
      otherDocuments:h.documents?.otherDocuments||[],
    });
    setFileState(emptyFiles); setEditId(h._id); setActiveTab("basic");
    window.scrollTo({top:0,behavior:"smooth"});
  };

  const handleDelete = async (id) => {
    try{ await fetch(`${API}/delete/${id}`,{method:"DELETE"}); showToast("Deleted!"); setDeleteModal(null); fetchAll(); }
    catch{ showToast("Delete failed","error"); }
  };

  const handleStatus = async (id, status) => {
    try{
      const r = await fetch(`${API}/status/${id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({status})});
      const d = await r.json();
      if(d.success){showToast(`Status: ${status}`);fetchAll();}
    }catch{showToast("Failed","error");}
    setStatusModal(null);
  };

  const filtered = hostels.filter(h=>{
    const q=search.toLowerCase();
    const m=h.hostelName?.toLowerCase().includes(q)||h.propertyId?.toLowerCase().includes(q)||h.ownerName?.toLowerCase().includes(q)||h.city?.toLowerCase().includes(q);
    const s=filterStatus==="all"||h.status===filterStatus;
    const t=filterType==="all"||h.hostelType===filterType;
    return m&&s&&t;
  });
  const totalPages = Math.ceil(filtered.length/PER_PAGE);
  const paginated = filtered.slice((page-1)*PER_PAGE,page*PER_PAGE);

  const sCol = (s)=>({
    approved:{c:"#4ade80",bg:"rgba(74,222,128,.08)",b:"rgba(74,222,128,.28)"},
    rejected: {c:"#f87171",bg:"rgba(248,113,113,.08)",b:"rgba(248,113,113,.28)"},
    pending:  {c:"#fbbf24",bg:"rgba(251,191,36,.08)", b:"rgba(251,191,36,.28)"},
  }[s]||{c:"#888",bg:"#111",b:"#333"});

  const typeCol = (t)=>({Boys:"#60a5fa",Girls:"#f472b6","Co-ed":"#a78bfa"}[t]||"#94a3b8");

  const stats = [
    {l:"Total",    v:hostels.length,                               c:"#38bdf8"},
    {l:"Approved", v:hostels.filter(h=>h.status==="approved").length, c:"#4ade80"},
    {l:"Pending",  v:hostels.filter(h=>h.status==="pending").length,  c:"#fbbf24"},
    {l:"Rejected", v:hostels.filter(h=>h.status==="rejected").length, c:"#f87171"},
    {l:"Boys",     v:hostels.filter(h=>h.hostelType==="Boys").length,  c:"#60a5fa"},
    {l:"Girls",    v:hostels.filter(h=>h.hostelType==="Girls").length, c:"#f472b6"},
  ];

  const TABS=[
    {id:"basic",    label:"🏠 Basic"},
    {id:"owner",    label:"👤 Owner"},
    {id:"location", label:"📍 Location"},
    {id:"rooms",    label:"🛏 Rooms"},
    {id:"amenities",label:"✨ Amenities"},
    {id:"images",   label:"🖼 Images"},
    {id:"documents",label:"📄 Docs"},
    {id:"settings", label:"⚙️ Settings"},
  ];

  /* reusable upload section */
  const UploadBox = ({field,max,label,icon,single}) => {
    const prev = prevState[field];
    const isEmpty = single?(prev===null||prev===undefined):(prev?.length===0);
    return (
      <div style={{marginBottom:22}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <div style={{fontSize:11,color:"#0891b2",fontWeight:700,letterSpacing:".06em",textTransform:"uppercase"}}>{icon} {label}</div>
          {!single&&<span style={{fontSize:12,color:prev?.length>=max?"#f87171":"#164e63",fontWeight:600}}>{prev?.length||0}/{max}</span>}
        </div>
        <div onClick={()=>refs[field]?.current?.click()} style={{border:"2px dashed #083344",borderRadius:14,padding:isEmpty?"32px 20px":"10px",textAlign:"center",cursor:"pointer",background:"#030f14",transition:"all .2s"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="#0891b2";e.currentTarget.style.background="rgba(8,145,178,.05)"}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="#083344";e.currentTarget.style.background="#030f14"}}>
          <input ref={refs[field]} type="file" accept="image/*" multiple={!single} style={{display:"none"}}
            onChange={single?handleSingle(field):handleMulti(field,max)} />
          {isEmpty?(
            <><div style={{fontSize:28,marginBottom:6}}>{icon}</div>
            <div style={{color:"#0891b2",fontSize:13,fontWeight:500}}>Upload {label}</div>
            <div style={{color:"#164e63",fontSize:11,marginTop:3}}>{single?"PNG, JPG, WEBP":`Max ${max} images`}</div></>
          ):(
            single?(
              <div style={{position:"relative",display:"inline-block"}}>
                <img src={prev} alt={label} style={{maxHeight:160,maxWidth:"100%",borderRadius:10,objectFit:"cover"}} />
                <button type="button" onClick={e=>{e.stopPropagation();removeSingle(field);}}
                  style={{position:"absolute",top:-8,right:-8,width:22,height:22,borderRadius:"50%",background:"#f87171",border:"none",color:"#fff",cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
              </div>
            ):(
              <div style={{color:"#0891b2",fontSize:12,fontWeight:500}}>+ Click to add more ({max-(prev?.length||0)} left)</div>
            )
          )}
        </div>
        {!single && prev?.length>0 && (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))",gap:8,marginTop:10}}>
            {prev.map((src,i)=>(
              <div key={i} style={{position:"relative",borderRadius:9,overflow:"hidden",paddingTop:"70%",background:"#030f14",border:"2px solid #083344",cursor:"pointer"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="#0891b2"} onMouseLeave={e=>e.currentTarget.style.borderColor="#083344"}>
                <img src={src} alt="" onClick={()=>setLightbox({images:prev,idx:i})} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} />
                <button type="button" onClick={()=>removeMulti(field,i)}
                  style={{position:"absolute",top:4,right:4,width:18,height:18,borderRadius:"50%",background:"rgba(248,113,113,.85)",border:"none",color:"#fff",cursor:"pointer",fontSize:9,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:"#020c10",minHeight:"100vh",color:"#bae6fd"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Lexend+Exa:wght@600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes tin{from{opacity:0;transform:translateX(36px)}to{opacity:1;transform:translateX(0)}}
        @keyframes pop{from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}
        @keyframes fd{from{opacity:0}to{opacity:1}}
        *{box-sizing:border-box;margin:0;padding:0}
        input,select,textarea{outline:none;font-family:'DM Sans',sans-serif;transition:border .2s,box-shadow .2s}
        input:focus,select:focus,textarea:focus{border-color:#0891b2!important;box-shadow:0 0 0 3px rgba(8,145,178,.14)!important}
        ::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:#020c10}::-webkit-scrollbar-thumb{background:#083344;border-radius:4px}
        .rh:hover{background:rgba(8,145,178,.04)!important}
        .htab:hover{color:#7dd3fc!important}
        .hpill:hover{transform:translateY(-1px)}
        .hab:hover{opacity:.72;transform:scale(.9)}
        .hpp:hover:not(:disabled){background:rgba(8,145,178,.13)!important;color:#7dd3fc!important}
      `}</style>

      {/* TOAST */}
      {toast&&<div style={{position:"fixed",top:18,right:18,zIndex:9999,padding:"12px 22px",borderRadius:10,fontSize:13,fontWeight:600,background:toast.type==="error"?"#120407":"#041209",border:`1px solid ${toast.type==="error"?"#f87171":"#4ade80"}`,color:toast.type==="error"?"#f87171":"#4ade80",boxShadow:"0 20px 60px rgba(0,0,0,.85)",animation:"tin .25s ease"}}>{toast.type==="error"?"✗ ":"✓ "}{toast.msg}</div>}

      {/* LIGHTBOX */}
      {lightbox&&(
        <div onClick={()=>setLightbox(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.97)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",animation:"fd .18s ease"}}>
          <div onClick={e=>e.stopPropagation()} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
            <img src={lightbox.images[lightbox.idx]} alt="" style={{maxWidth:"88vw",maxHeight:"78vh",objectFit:"contain",borderRadius:14,boxShadow:"0 40px 100px rgba(0,0,0,.9)"}} />
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <LbBtn disabled={lightbox.idx===0} onClick={()=>setLightbox(l=>({...l,idx:Math.max(0,l.idx-1)}))}>‹</LbBtn>
              <span style={{color:"#4b5563",fontSize:13}}>{lightbox.idx+1} / {lightbox.images.length}</span>
              <LbBtn disabled={lightbox.idx===lightbox.images.length-1} onClick={()=>setLightbox(l=>({...l,idx:Math.min(l.images.length-1,l.idx+1)}))}>›</LbBtn>
            </div>
          </div>
          <button onClick={()=>setLightbox(null)} style={{position:"fixed",top:16,right:16,width:38,height:38,borderRadius:10,background:"#111",border:"1px solid #222",color:"#666",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
      )}

      {/* DOCUMENT MODAL */}
      {docModal&&(
        <div onClick={()=>setDocModal(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.95)",zIndex:9995,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#050f14",border:"1px solid #083344",borderRadius:20,padding:26,maxWidth:960,width:"100%",maxHeight:"90vh",overflowY:"auto",animation:"pop .28s ease"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22}}>
              <h3 style={{fontFamily:"'Lexend Exa',sans-serif",color:"#e0f7ff",fontSize:16}}>📄 Owner Verification — {docModal.hostelName}</h3>
              <button onClick={()=>setDocModal(null)} style={{width:32,height:32,borderRadius:8,background:"#083344",border:"1px solid #0e4f5e",color:"#64748b",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            </div>
            {/* GST Number */}
            <div style={{background:"#030f14",border:"1px solid #083344",borderRadius:10,padding:"12px 16px",marginBottom:16,display:"flex",gap:20,flexWrap:"wrap"}}>
              <div><div style={{fontSize:11,color:"#164e63",fontWeight:700,marginBottom:4}}>GST NUMBER</div><div style={{fontSize:14,color:"#38bdf8",fontWeight:700}}>{docModal.documents?.gstNumber||"Not provided"}</div></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
              {[
                ["👤 Owner Photo",docModal.documents?.ownerPhoto,false],
                ["🪪 Aadhar Front",docModal.documents?.ownerAadharFront,false],
                ["🪪 Aadhar Back",docModal.documents?.ownerAadharBack,false],
                ["🗂 PAN Card",docModal.documents?.ownerPanCard,false],
                ["📋 GST Certificate",docModal.documents?.gstCertificate,false],
                ["🏠 Property Doc",docModal.documents?.propertyDocument,false],
                ["🚔 Police Verification",docModal.documents?.policeVerification,false],
                ["🏦 Cancelled Cheque",docModal.documents?.cancelledCheque,false],
              ].map(([label,url])=>(
                <div key={label} style={{background:"#030f14",border:"1px solid #083344",borderRadius:12,overflow:"hidden"}}>
                  <div style={{padding:"8px 12px",borderBottom:"1px solid #083344",fontSize:11,color:"#0891b2",fontWeight:700}}>{label}</div>
                  {url?(
                    <div style={{position:"relative",paddingTop:"68%",cursor:"zoom-in"}} onClick={()=>setLightbox({images:[url],idx:0})}>
                      <img src={url} alt={label} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} />
                      <div style={{position:"absolute",bottom:6,right:6,background:"rgba(0,0,0,.65)",color:"#fff",fontSize:9,padding:"2px 7px",borderRadius:4}}>🔍 Zoom</div>
                    </div>
                  ):(
                    <div style={{padding:"28px 12px",textAlign:"center",color:"#083344",fontSize:12}}>Not uploaded</div>
                  )}
                </div>
              ))}
            </div>
            {/* Other Docs */}
            {docModal.documents?.otherDocuments?.length>0&&(
              <div style={{marginTop:16}}>
                <div style={{fontSize:11,color:"#0891b2",fontWeight:700,marginBottom:10,textTransform:"uppercase",letterSpacing:".06em"}}>📁 Other Documents ({docModal.documents.otherDocuments.length})</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:8}}>
                  {docModal.documents.otherDocuments.map((url,i)=>(
                    <div key={i} style={{position:"relative",paddingTop:"68%",borderRadius:10,overflow:"hidden",cursor:"zoom-in",border:"1px solid #083344"}} onClick={()=>setLightbox({images:docModal.documents.otherDocuments,idx:i})}>
                      <img src={url} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STATUS MODAL */}
      {statusModal&&(
        <MWrap onClose={()=>setStatusModal(null)}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:44,marginBottom:12}}>🔄</div>
            <h3 style={{fontFamily:"'Lexend Exa',sans-serif",color:"#e0f7ff",marginBottom:8,fontSize:16}}>Update Status</h3>
            <p style={{color:"#4b5563",fontSize:13,marginBottom:22}}>Choose approval status for this hostel</p>
            <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
              {["pending","approved","rejected"].map(s=>{
                const sc=sCol(s);
                return <button key={s} onClick={()=>handleStatus(statusModal,s)} style={{padding:"9px 22px",borderRadius:8,border:`1px solid ${sc.b}`,background:sc.bg,color:sc.c,cursor:"pointer",fontSize:13,fontWeight:700,textTransform:"capitalize",fontFamily:"'DM Sans',sans-serif"}}>{s}</button>;
              })}
            </div>
          </div>
        </MWrap>
      )}

      {/* DELETE MODAL */}
      {deleteModal&&(
        <MWrap onClose={()=>setDeleteModal(null)}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:46,marginBottom:12}}>🏠</div>
            <h3 style={{fontFamily:"'Lexend Exa',sans-serif",color:"#f87171",marginBottom:8,fontSize:16}}>Delete Hostel?</h3>
            <p style={{color:"#4b5563",fontSize:13,marginBottom:26,lineHeight:1.6}}>This will permanently remove this hostel and all its data.</p>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <GhBtn onClick={()=>setDeleteModal(null)}>Cancel</GhBtn>
              <button onClick={()=>handleDelete(deleteModal)} style={{padding:"9px 22px",background:"#f87171",border:"none",borderRadius:8,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>Delete</button>
            </div>
          </div>
        </MWrap>
      )}

      {/* VIEW MODAL */}
      {viewData&&<ViewModal data={viewData} onClose={()=>setViewData(null)} sCol={sCol} typeCol={typeCol} onLightbox={setLightbox} onDocView={setDocModal} onStatus={(id)=>{setViewData(null);setStatusModal(id);}} />}

      <div style={{maxWidth:1520,margin:"0 auto",padding:"32px 20px"}}>

        {/* HEADER */}
        <div style={{marginBottom:32}}>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:22}}>
            <div style={{width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,#0369a1,#0891b2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,flexShrink:0,boxShadow:"0 8px 28px rgba(8,145,178,.45)"}}>🏠</div>
            <div>
              <h1 style={{fontFamily:"'Lexend Exa',sans-serif",fontSize:28,fontWeight:800,color:"#e0f7ff",lineHeight:1}}>Hostel Management</h1>
              <p style={{color:"#083344",fontSize:13,marginTop:6}}>Manage hostels, approvals, rooms & owner verification</p>
            </div>
          </div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {stats.map(s=>(
              <div key={s.l} style={{background:"#050f14",border:"1px solid #083344",borderRadius:14,padding:"14px 22px",minWidth:100}}>
                <div style={{fontSize:26,fontWeight:700,color:s.c,fontFamily:"'Lexend Exa',sans-serif"}}>{s.v}</div>
                <div style={{fontSize:12,color:"#083344",marginTop:3}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== FORM ===== */}
        <div style={{background:"#050f14",border:"1px solid #083344",borderRadius:20,marginBottom:36,overflow:"hidden",animation:"up .35s ease"}}>
          <div style={{padding:"18px 28px",borderBottom:"1px solid #083344",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#030f14"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:18}}>{editId?"✏️":"➕"}</span>
              <span style={{fontFamily:"'Lexend Exa',sans-serif",fontWeight:700,fontSize:15,color:"#e0f7ff"}}>{editId?"Edit Hostel":"Add New Hostel"}</span>
            </div>
            {editId&&<button onClick={resetForm} style={{padding:"7px 18px",background:"#083344",border:"1px solid #0e4f5e",borderRadius:8,color:"#64748b",cursor:"pointer",fontSize:12,fontFamily:"'DM Sans',sans-serif"}}>✕ Cancel</button>}
          </div>

          {/* TABS */}
          <div style={{display:"flex",overflowX:"auto",background:"#030f14",borderBottom:"1px solid #083344",padding:"0 20px",gap:2}}>
            {TABS.map(t=>(
              <button key={t.id} className="htab" onClick={()=>setActiveTab(t.id)}
                style={{padding:"13px 15px",background:"transparent",border:"none",borderBottom:activeTab===t.id?"2px solid #0891b2":"2px solid transparent",color:activeTab===t.id?"#38bdf8":"#083344",cursor:"pointer",fontSize:12.5,fontWeight:600,whiteSpace:"nowrap",transition:"color .2s",fontFamily:"'DM Sans',sans-serif"}}>
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{padding:"28px"}}>

              {/* BASIC */}
              {activeTab==="basic"&&(
                <FGrid>
                  <FField l="Hostel Name *"><FIn name="hostelName" value={form.hostelName} onChange={fc} placeholder="Krishna Boys Hostel" required /></FField>
                  <FField l="Hostel Type *">
                    <FSel name="hostelType" value={form.hostelType} onChange={fc}>
                      <option value="Boys">Boys</option>
                      <option value="Girls">Girls</option>
                      <option value="Co-ed">Co-ed</option>
                    </FSel>
                  </FField>
                  <FField l="Total Rooms"><FIn type="number" name="totalRooms" value={form.totalRooms} onChange={fc} placeholder="30" /></FField>
                  <FField l="Total Beds"><FIn type="number" name="totalBeds" value={form.totalBeds} onChange={fc} placeholder="60" /></FField>
                  <FField l="Check-In Time"><FIn type="time" name="checkInTime" value={form.checkInTime} onChange={fc} /></FField>
                  <FField l="Check-Out Time"><FIn type="time" name="checkOutTime" value={form.checkOutTime} onChange={fc} /></FField>
                  <FField l="Gate Closing Time"><FIn name="gateClosingTime" value={form.gateClosingTime} onChange={fc} placeholder="10:00 PM" /></FField>
                  <div style={{display:"flex",alignItems:"center",gap:14,marginTop:8,flexWrap:"wrap"}}>
                    <CHK label="🍽️ Food Available" checked={form.foodAvailable} onChange={()=>toggleBool("foodAvailable")} />
                  </div>
                  {form.foodAvailable&&(
                    <FField l="Mess Charges (₹/month)"><FIn type="number" name="messCharges" value={form.messCharges} onChange={fc} placeholder="2000" /></FField>
                  )}
                  <FField l="Description" full><FTxt name="description" value={form.description} onChange={fc} placeholder="Describe this hostel..." rows={4} /></FField>
                  <div style={{gridColumn:"1/-1"}}>
                    <div style={{fontSize:11,color:"#083344",fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",marginBottom:12}}>House Rules</div>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {form.rules.map((r,i)=>(
                        <div key={i} style={{display:"flex",gap:8}}>
                          <FIn value={r} onChange={e=>ruleChange(i,e.target.value)} placeholder={`Rule ${i+1}...`} />
                          {form.rules.length>1&&<SmlDel onClick={()=>removeRule(i)}>✕</SmlDel>}
                        </div>
                      ))}
                      <AddBtn onClick={addRule}>+ Add Rule</AddBtn>
                    </div>
                  </div>
                </FGrid>
              )}

              {/* OWNER */}
              {activeTab==="owner"&&(
                <FGrid>
                  <FField l="Owner Name *"><FIn name="ownerName" value={form.ownerName} onChange={fc} placeholder="Suresh Patel" required /></FField>
                  <FField l="Company Name"><FIn name="companyName" value={form.companyName} onChange={fc} placeholder="Patel Properties Pvt Ltd" /></FField>
                  <FField l="Email *"><FIn type="email" name="email" value={form.email} onChange={fc} placeholder="owner@email.com" required /></FField>
                  <FField l="Phone *"><FIn name="phone" value={form.phone} onChange={fc} placeholder="+91 98765 43210" required /></FField>
                  <FField l="Alternate Phone"><FIn name="alternatePhone" value={form.alternatePhone} onChange={fc} placeholder="+91 98765 43211" /></FField>
                  <FField l="GST Number"><FIn name="gstNumber" value={form.gstNumber} onChange={fc} placeholder="27AAPFU0939F1ZV" /></FField>
                  <FField l="Added By">
                    <FSel name="addedBy" value={form.addedBy} onChange={fc}>
                      <option value="vendor">Vendor</option>
                      <option value="admin">Admin</option>
                    </FSel>
                  </FField>
                </FGrid>
              )}

              {/* LOCATION */}
              {activeTab==="location"&&(
                <FGrid>
                  <FField l="Country"><FIn name="country" value={form.country} onChange={fc} /></FField>
                  <FField l="State"><FIn name="state" value={form.state} onChange={fc} placeholder="Maharashtra" /></FField>
                  <FField l="City *"><FIn name="city" value={form.city} onChange={fc} placeholder="Pune" required /></FField>
                  <FField l="Area"><FIn name="area" value={form.area} onChange={fc} placeholder="Kothrud" /></FField>
                  <FField l="Pincode"><FIn name="pincode" value={form.pincode} onChange={fc} placeholder="411038" /></FField>
                  <FField l="Latitude"><FIn name="latitude" value={form.latitude} onChange={fc} placeholder="18.5204" /></FField>
                  <FField l="Longitude"><FIn name="longitude" value={form.longitude} onChange={fc} placeholder="73.8567" /></FField>
                  <FField l="Google Map Link" full><FIn name="googleMapLink" value={form.googleMapLink} onChange={fc} placeholder="https://maps.google.com/..." /></FField>
                  <FField l="Full Address" full><FTxt name="address" value={form.address} onChange={fc} placeholder="Street, Landmark, Area..." rows={2} /></FField>
                </FGrid>
              )}

              {/* ROOMS */}
              {activeTab==="rooms"&&(
                <div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
                    <div style={{fontSize:11,color:"#083344",fontWeight:700,textTransform:"uppercase",letterSpacing:".05em"}}>Room Types</div>
                    <AddBtn onClick={addRoom}>+ Add Room Type</AddBtn>
                  </div>
                  {form.roomTypes.map((r,i)=>(
                    <div key={i} style={{background:"#030f14",border:"1px solid #083344",borderRadius:14,padding:20,marginBottom:14}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
                        <span style={{fontSize:13,color:"#0891b2",fontWeight:700}}>Room Type {i+1}</span>
                        {form.roomTypes.length>1&&<SmlDel onClick={()=>removeRoom(i)}>Remove</SmlDel>}
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}}>
                        <div>
                          <label style={{display:"block",fontSize:11,color:"#083344",fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",marginBottom:6}}>Room Name</label>
                          <FIn value={r.roomName} onChange={e=>roomChange(i,"roomName",e.target.value)} placeholder="Dormitory 6-Bed" />
                        </div>
                        <div>
                          <label style={{display:"block",fontSize:11,color:"#083344",fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",marginBottom:6}}>Bed Type</label>
                          <select value={r.bedType} onChange={e=>roomChange(i,"bedType",e.target.value)}
                            style={{width:"100%",padding:"9px 11px",background:"#020c10",border:"1px solid #083344",borderRadius:8,color:"#bae6fd",fontSize:13,fontFamily:"'DM Sans',sans-serif",cursor:"pointer"}}>
                            <option value="">Select</option>
                            {BED_TYPES.map(b=><option key={b}>{b}</option>)}
                          </select>
                        </div>
                        {[["occupancy","Occupancy","6"],["pricePerMonth","Price/Month (₹)","4500"],["pricePerDay","Price/Day (₹)","200"],["availableRooms","Available Rooms","8"]].map(([f,l,p])=>(
                          <div key={f}>
                            <label style={{display:"block",fontSize:11,color:"#083344",fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",marginBottom:6}}>{l}</label>
                            <input type="number" value={r[f]} onChange={e=>roomChange(i,f,e.target.value)} placeholder={p}
                              style={{width:"100%",padding:"9px 11px",background:"#020c10",border:"1px solid #083344",borderRadius:8,color:"#bae6fd",fontSize:13,fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box"}} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* AMENITIES */}
              {activeTab==="amenities"&&(
                <div>
                  <div style={{fontSize:11,color:"#083344",fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",marginBottom:14}}>Select Amenities</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                    {AMENITIES_LIST.map(a=>{
                      const on=form.amenities.includes(a);
                      return <div key={a} className="hpill" onClick={()=>toggleAmenity(a)}
                        style={{padding:"7px 15px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:500,transition:"all .2s",userSelect:"none",border:`1px solid ${on?"#0891b2":"#083344"}`,background:on?"rgba(8,145,178,.14)":"#050f14",color:on?"#38bdf8":"#083344"}}>
                        {on&&"✓ "}{a}
                      </div>;
                    })}
                  </div>
                </div>
              )}

              {/* IMAGES */}
              {activeTab==="images"&&(
                <div>
                  <UploadBox field="hostelImages" max={20} label="Hostel Images" icon="🏠" />
                  <UploadBox field="receptionImages" max={10} label="Reception Images" icon="🛎️" />
                  <UploadBox field="roomGallery" max={20} label="Room Gallery" icon="🛏" />
                  <UploadBox field="washroomImages" max={10} label="Washroom Images" icon="🚿" />
                  <UploadBox field="kitchenImages" max={10} label="Kitchen / Mess Images" icon="🍳" />
                </div>
              )}

              {/* DOCUMENTS */}
              {activeTab==="documents"&&(
                <div>
                  <div style={{background:"rgba(8,145,178,.06)",border:"1px solid rgba(8,145,178,.18)",borderRadius:12,padding:"12px 16px",marginBottom:22,fontSize:13,color:"#7dd3fc",lineHeight:1.6}}>
                    📌 Upload owner KYC documents for verification. These are required for hostel approval.
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
                    <UploadBox field="ownerPhoto" label="Owner Photo" icon="👤" single />
                    <UploadBox field="ownerAadharFront" label="Aadhar Card (Front)" icon="🪪" single />
                    <UploadBox field="ownerAadharBack" label="Aadhar Card (Back)" icon="🪪" single />
                    <UploadBox field="ownerPanCard" label="PAN Card" icon="🗂" single />
                    <UploadBox field="gstCertificate" label="GST Certificate" icon="📄" single />
                    <UploadBox field="propertyDocument" label="Property Document" icon="🏠" single />
                    <UploadBox field="policeVerification" label="Police Verification" icon="🚔" single />
                    <UploadBox field="cancelledCheque" label="Cancelled Cheque" icon="🏦" single />
                  </div>
                  <div style={{marginTop:16}}>
                    <UploadBox field="otherDocuments" max={10} label="Other Documents" icon="📁" />
                  </div>
                </div>
              )}

              {/* SETTINGS */}
              {activeTab==="settings"&&(
                <div style={{display:"flex",flexDirection:"column",gap:24}}>
                  <FGrid>
                    <FField l="Status">
                      <FSel name="status" value={form.status} onChange={fc}>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </FSel>
                    </FField>
                    <FField l="Rating (0-5)"><FIn type="number" name="rating" value={form.rating||0} onChange={fc} min="0" max="5" step="0.1" /></FField>
                  </FGrid>
                  <div style={{display:"flex",flexWrap:"wrap",gap:20}}>
                    {[["isActive","🟢 Active"],["featured","⭐ Featured"]].map(([k,l])=>(
                      <CHK key={k} label={l} checked={form[k]} onChange={()=>toggleBool(k)} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{padding:"16px 28px",borderTop:"1px solid #083344",display:"flex",gap:10,justifyContent:"flex-end",background:"#030f14"}}>
              <GhBtn onClick={resetForm}>Reset</GhBtn>
              <PriBtn type="submit" disabled={submitting}>{submitting?"Saving...":editId?"Update Hostel":"Add Hostel"}</PriBtn>
            </div>
          </form>
        </div>

        {/* ===== TABLE ===== */}
        <div style={{background:"#050f14",border:"1px solid #083344",borderRadius:20,overflow:"hidden",animation:"up .45s ease"}}>
          <div style={{padding:"18px 24px",borderBottom:"1px solid #083344",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,background:"#030f14"}}>
            <div style={{fontFamily:"'Lexend Exa',sans-serif",fontWeight:700,fontSize:16,color:"#e0f7ff"}}>
              All Hostels <span style={{color:"#083344",fontSize:13,fontWeight:400}}>({filtered.length})</span>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search hostel, city, owner..."
                style={{padding:"8px 14px",background:"#020c10",border:"1px solid #083344",borderRadius:8,color:"#bae6fd",fontSize:13,width:240,fontFamily:"'DM Sans',sans-serif"}} />
              <select value={filterType} onChange={e=>setFilterType(e.target.value)}
                style={{padding:"8px 12px",background:"#020c10",border:"1px solid #083344",borderRadius:8,color:"#bae6fd",fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                <option value="all">All Types</option>
                <option value="Boys">Boys</option>
                <option value="Girls">Girls</option>
                <option value="Co-ed">Co-ed</option>
              </select>
              <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
                style={{padding:"8px 12px",background:"#020c10",border:"1px solid #083344",borderRadius:8,color:"#bae6fd",fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <button onClick={fetchAll} style={{padding:"8px 14px",background:"#083344",border:"1px solid #0e4f5e",borderRadius:8,color:"#64748b",cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>↺</button>
            </div>
          </div>

          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead>
                <tr style={{background:"#020c10",borderBottom:"1px solid #083344"}}>
                  {["#","Hostel","Owner","Location","Rooms","Price","Status","Actions"].map(h=>(
                    <th key={h} style={{padding:"11px 14px",textAlign:"left",color:"#083344",fontWeight:700,fontSize:11,letterSpacing:".07em",textTransform:"uppercase",whiteSpace:"nowrap",fontFamily:"'DM Sans',sans-serif"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading?(
                  <tr><td colSpan={8} style={{padding:60,textAlign:"center",color:"#083344"}}><div style={{fontSize:36,marginBottom:10}}>⏳</div>Loading...</td></tr>
                ):paginated.length===0?(
                  <tr><td colSpan={8} style={{padding:60,textAlign:"center",color:"#083344"}}><div style={{fontSize:40,marginBottom:10}}>🏠</div>No hostels found</td></tr>
                ):paginated.map((h,i)=>{
                  const sc=sCol(h.status);
                  const tc=typeCol(h.hostelType);
                  const cover=h.hostelImages?.[0]||null;
                  return (
                    <tr key={h._id} className="rh" style={{borderBottom:"1px solid #0a1f28",transition:"background .15s"}}>
                      <td style={{padding:"13px 14px",color:"#083344",fontWeight:600}}>{(page-1)*PER_PAGE+i+1}</td>

                      <td style={{padding:"13px 14px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <div style={{width:48,height:38,borderRadius:8,overflow:"hidden",background:"#030f14",border:"1px solid #083344",flexShrink:0}}>
                            {cover?<img src={cover} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                              :<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"#083344"}}>🏠</div>}
                          </div>
                          <div>
                            <div style={{fontWeight:700,color:"#e0f7ff"}}>{h.hostelName}</div>
                            <div style={{fontSize:11,color:"#0891b2",marginTop:1}}>{h.propertyId}</div>
                            <div style={{display:"flex",gap:4,marginTop:3,flexWrap:"wrap"}}>
                              <span style={{fontSize:10,padding:"2px 7px",borderRadius:4,background:`${tc}18`,border:`1px solid ${tc}40`,color:tc}}>{h.hostelType}</span>
                              {h.featured&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:4,background:"rgba(251,191,36,.1)",border:"1px solid rgba(251,191,36,.3)",color:"#fbbf24"}}>⭐</span>}
                              {h.foodAvailable&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:4,background:"rgba(74,222,128,.08)",border:"1px solid rgba(74,222,128,.25)",color:"#4ade80"}}>🍽️</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{padding:"13px 14px"}}>
                        <div style={{color:"#7dd3fc"}}>{h.ownerName}</div>
                        <div style={{fontSize:11,color:"#083344",marginTop:2}}>{h.phone}</div>
                        <div style={{fontSize:11,color:"#083344",marginTop:1}}>{h.email}</div>
                      </td>

                      <td style={{padding:"13px 14px",color:"#4b5563"}}>
                        <div>{h.city}{h.state?`, ${h.state}`:""}</div>
                        {h.area&&<div style={{fontSize:11,color:"#083344",marginTop:1}}>{h.area}</div>}
                      </td>

                      <td style={{padding:"13px 14px"}}>
                        <div style={{color:"#7dd3fc",fontWeight:600}}>{h.totalRooms||"—"} rooms</div>
                        <div style={{fontSize:11,color:"#083344",marginTop:1}}>{h.totalBeds||0} beds</div>
                      </td>

                      <td style={{padding:"13px 14px"}}>
                        {h.roomTypes?.length>0?(
                          <div>
                            <div style={{color:"#4ade80",fontWeight:700}}>₹{Math.min(...h.roomTypes.map(r=>r.pricePerMonth||Infinity)).toLocaleString()}<span style={{fontSize:10,color:"#083344"}}>/mo</span></div>
                            <div style={{fontSize:11,color:"#083344",marginTop:1}}>from</div>
                          </div>
                        ):<span style={{color:"#083344"}}>—</span>}
                      </td>

                      <td style={{padding:"13px 14px"}}>
                        <span style={{fontSize:11,fontWeight:700,padding:"4px 11px",borderRadius:12,background:sc.bg,border:`1px solid ${sc.b}`,color:sc.c,display:"inline-block"}}>{h.status?.toUpperCase()}</span>
                      </td>

                      <td style={{padding:"13px 14px"}}>
                        <div style={{display:"flex",gap:4,flexWrap:"nowrap"}}>
                          <AB c="#38bdf8" onClick={()=>setViewData(h)} t="View">👁</AB>
                          <AB c="#60a5fa" onClick={()=>handleEdit(h)} t="Edit">✎</AB>
                          <AB c="#fbbf24" onClick={()=>setStatusModal(h._id)} t="Approve/Reject">⚡</AB>
                          <AB c="#a78bfa" onClick={()=>setDocModal(h)} t="Verify Documents">📄</AB>
                          <AB c="#f87171" onClick={()=>setDeleteModal(h._id)} t="Delete">🗑</AB>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages>1&&(
            <div style={{padding:"14px 24px",borderTop:"1px solid #083344",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,background:"#030f14"}}>
              <div style={{fontSize:13,color:"#083344"}}>Showing {Math.min((page-1)*PER_PAGE+1,filtered.length)}–{Math.min(page*PER_PAGE,filtered.length)} of {filtered.length}</div>
              <div style={{display:"flex",gap:5,alignItems:"center"}}>
                <PgBtn disabled={page===1} onClick={()=>setPage(1)}>«</PgBtn>
                <PgBtn disabled={page===1} onClick={()=>setPage(p=>p-1)}>‹</PgBtn>
                {Array.from({length:totalPages},(_,i)=>i+1).filter(p=>p===1||p===totalPages||Math.abs(p-page)<=1).reduce((acc,p,idx,arr)=>{if(idx>0&&p-arr[idx-1]>1)acc.push("...");acc.push(p);return acc;},[])
                  .map((p,idx)=>p==="..."?<span key={`d${idx}`} style={{color:"#083344",padding:"0 4px",fontSize:13}}>•••</span>:<PgBtn key={p} active={page===p} onClick={()=>setPage(p)}>{p}</PgBtn>)}
                <PgBtn disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>›</PgBtn>
                <PgBtn disabled={page===totalPages} onClick={()=>setPage(totalPages)}>»</PgBtn>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===================== VIEW MODAL ===================== */
function ViewModal({data:h,onClose,sCol,typeCol,onLightbox,onDocView,onStatus}) {
  const sc=sCol(h.status); const tc=typeCol(h.hostelType);
  const allImgs=[...(h.hostelImages||[])].filter(Boolean);
  const [activeImg,setActiveImg]=useState(0);

  const IC=({label,value})=>value!==null&&value!==undefined&&value!==""?(
    <div style={{background:"#020c10",border:"1px solid #083344",borderRadius:9,padding:"10px 14px"}}>
      <div style={{fontSize:11,color:"#083344",marginBottom:4}}>{label}</div>
      <div style={{fontSize:13,color:"#7dd3fc",wordBreak:"break-all"}}>{String(value)}</div>
    </div>
  ):null;

  const Sec=({title,children})=>(
    <div style={{marginBottom:24}}>
      <div style={{fontSize:11,color:"#0891b2",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",marginBottom:12,paddingBottom:7,borderBottom:"1px solid #083344"}}>{title}</div>
      {children}
    </div>
  );
  const IG=({items})=>(
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10}}>
      {items.map(([l,v])=><IC key={l} label={l} value={v} />)}
    </div>
  );
  const ImgRow=({title,images})=>images?.length>0&&(
    <Sec title={title}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))",gap:8}}>
        {images.map((img,i)=>(
          <div key={i} onClick={()=>onLightbox({images,idx:i})} style={{position:"relative",paddingTop:"68%",borderRadius:9,overflow:"hidden",cursor:"zoom-in",background:"#020c10",border:"1px solid #083344"}}>
            <img src={img} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} />
            <div style={{position:"absolute",bottom:4,right:4,background:"rgba(0,0,0,.65)",color:"#fff",fontSize:9,padding:"2px 6px",borderRadius:4}}>🔍</div>
          </div>
        ))}
      </div>
    </Sec>
  );

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.93)",zIndex:9990,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:20,overflowY:"auto"}}>
      <div style={{background:"#050f14",border:"1px solid #083344",borderRadius:20,width:"100%",maxWidth:960,animation:"pop .3s ease",marginTop:10,marginBottom:10}}>

        {/* Header */}
        <div style={{padding:"20px 26px",borderBottom:"1px solid #083344",display:"flex",alignItems:"flex-start",justifyContent:"space-between",background:"#030f14",borderRadius:"20px 20px 0 0",gap:12,flexWrap:"wrap"}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",gap:8,marginBottom:6,flexWrap:"wrap"}}>
              <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:10,background:`${tc}18`,border:`1px solid ${tc}40`,color:tc}}>{h.hostelType}</span>
              <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:12,background:sc.bg,border:`1px solid ${sc.b}`,color:sc.c}}>{h.status?.toUpperCase()}</span>
              {h.featured&&<span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:12,background:"rgba(251,191,36,.08)",border:"1px solid rgba(251,191,36,.28)",color:"#fbbf24"}}>⭐ Featured</span>}
            </div>
            <h2 style={{fontFamily:"'Lexend Exa',sans-serif",fontSize:20,fontWeight:800,color:"#e0f7ff",margin:0}}>{h.hostelName}</h2>
            <div style={{fontSize:12,color:"#0891b2",marginTop:3}}>{h.propertyId}</div>
            <div style={{fontSize:12,color:"#083344",marginTop:2}}>{h.city}{h.state?`, ${h.state}`:""}</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <button onClick={()=>onStatus(h._id)} style={{padding:"6px 14px",background:"rgba(251,191,36,.1)",border:"1px solid rgba(251,191,36,.3)",borderRadius:8,color:"#fbbf24",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>⚡ Status</button>
            <button onClick={()=>onDocView(h)} style={{padding:"6px 14px",background:"rgba(8,145,178,.1)",border:"1px solid rgba(8,145,178,.3)",borderRadius:8,color:"#38bdf8",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>📄 Verify Docs</button>
            <button onClick={onClose} style={{width:34,height:34,borderRadius:9,background:"#083344",border:"1px solid #0e4f5e",color:"#64748b",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✕</button>
          </div>
        </div>

        <div style={{padding:"26px"}}>

          {/* MAIN GALLERY */}
          {allImgs.length>0&&(
            <Sec title="📸 Hostel Photos">
              <div style={{position:"relative",borderRadius:12,overflow:"hidden",cursor:"zoom-in",marginBottom:10}} onClick={()=>onLightbox({images:allImgs,idx:activeImg})}>
                <img src={allImgs[activeImg]} alt="" style={{width:"100%",height:300,objectFit:"cover",display:"block"}} />
                <div style={{position:"absolute",bottom:10,right:10,background:"rgba(0,0,0,.65)",color:"#fff",fontSize:11,padding:"3px 9px",borderRadius:5}}>🔍 Click to zoom</div>
                {allImgs.length>1&&(<>
                  <button onClick={e=>{e.stopPropagation();setActiveImg(i=>Math.max(0,i-1));}} disabled={activeImg===0}
                    style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",width:34,height:34,borderRadius:8,background:"rgba(0,0,0,.65)",border:"none",color:activeImg===0?"#333":"#fff",cursor:activeImg===0?"not-allowed":"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
                  <button onClick={e=>{e.stopPropagation();setActiveImg(i=>Math.min(allImgs.length-1,i+1));}} disabled={activeImg===allImgs.length-1}
                    style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",width:34,height:34,borderRadius:8,background:"rgba(0,0,0,.65)",border:"none",color:activeImg===allImgs.length-1?"#333":"#fff",cursor:activeImg===allImgs.length-1?"not-allowed":"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
                </>)}
              </div>
              {allImgs.length>1&&(
                <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
                  {allImgs.map((img,i)=>(
                    <div key={i} onClick={()=>setActiveImg(i)} style={{flexShrink:0,width:72,height:52,borderRadius:8,overflow:"hidden",cursor:"pointer",border:`2px solid ${activeImg===i?"#0891b2":"transparent"}`,opacity:activeImg===i?1:.5,transition:"all .15s"}}>
                      <img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                    </div>
                  ))}
                </div>
              )}
            </Sec>
          )}

          {/* Description */}
          {h.description&&<div style={{background:"rgba(8,145,178,.05)",border:"1px solid rgba(8,145,178,.14)",borderRadius:12,padding:"14px 18px",marginBottom:24,color:"#94a3b8",fontSize:13.5,lineHeight:1.7,fontStyle:"italic"}}>"{h.description}"</div>}

          <Sec title="🏠 Basic Info">
            <IG items={[["Property ID",h.propertyId],["Hostel Name",h.hostelName],["Hostel Type",h.hostelType],["Total Rooms",h.totalRooms],["Total Beds",h.totalBeds],["Food Available",h.foodAvailable?"Yes":"No"],["Mess Charges",h.messCharges?`₹${h.messCharges}/month`:null],["Check-In",h.checkInTime],["Check-Out",h.checkOutTime],["Gate Closing",h.gateClosingTime],["Rating",h.rating?`★ ${h.rating}`:null],["Featured",h.featured?"Yes":"No"],["Active",h.isActive?"Yes":"No"],["Added By",h.addedBy]]} />
          </Sec>

          <Sec title="👤 Owner Info">
            <IG items={[["Owner Name",h.ownerName],["Company",h.companyName],["Email",h.email],["Phone",h.phone],["Alternate Phone",h.alternatePhone],["GST Number",h.documents?.gstNumber]]} />
          </Sec>

          <Sec title="📍 Location">
            <IG items={[["Country",h.country],["State",h.state],["City",h.city],["Area",h.area],["Pincode",h.pincode],["Latitude",h.latitude],["Longitude",h.longitude]]} />
            {h.address&&<div style={{marginTop:10,background:"#020c10",border:"1px solid #083344",borderRadius:9,padding:"10px 14px"}}><div style={{fontSize:11,color:"#083344",marginBottom:4}}>Full Address</div><div style={{fontSize:13,color:"#7dd3fc"}}>{h.address}</div></div>}
            {h.googleMapLink&&<a href={h.googleMapLink} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,marginTop:10,padding:"7px 14px",background:"rgba(8,145,178,.1)",border:"1px solid rgba(8,145,178,.25)",borderRadius:8,color:"#38bdf8",textDecoration:"none",fontSize:12,fontWeight:600}}>🗺️ Open in Maps</a>}
          </Sec>

          {/* Room Types */}
          {h.roomTypes?.length>0&&(
            <Sec title="🛏 Room Types">
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {h.roomTypes.map((r,i)=>(
                  <div key={i} style={{background:"#020c10",border:"1px solid #083344",borderRadius:10,padding:"14px 16px",display:"flex",flexWrap:"wrap",gap:18}}>
                    <div><div style={{fontSize:11,color:"#083344"}}>Room</div><div style={{fontSize:13,color:"#e0f7ff",fontWeight:700,marginTop:2}}>{r.roomName||"—"}</div></div>
                    <div><div style={{fontSize:11,color:"#083344"}}>Bed Type</div><div style={{fontSize:13,color:"#7dd3fc",marginTop:2}}>{r.bedType||"—"}</div></div>
                    <div><div style={{fontSize:11,color:"#083344"}}>Occupancy</div><div style={{fontSize:13,color:"#7dd3fc",marginTop:2}}>{r.occupancy||"—"} beds</div></div>
                    <div><div style={{fontSize:11,color:"#083344"}}>Price/Month</div><div style={{fontSize:13,color:"#4ade80",fontWeight:700,marginTop:2}}>₹{r.pricePerMonth||"—"}</div></div>
                    <div><div style={{fontSize:11,color:"#083344"}}>Price/Day</div><div style={{fontSize:13,color:"#4ade80",marginTop:2}}>₹{r.pricePerDay||"—"}</div></div>
                    <div><div style={{fontSize:11,color:"#083344"}}>Available</div><div style={{fontSize:13,color:"#38bdf8",marginTop:2}}>{r.availableRooms||0} rooms</div></div>
                  </div>
                ))}
              </div>
            </Sec>
          )}

          {/* Amenities */}
          {h.amenities?.length>0&&(
            <Sec title="✨ Amenities">
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {h.amenities.map(a=><span key={a} style={{fontSize:12,color:"#38bdf8",background:"rgba(8,145,178,.08)",border:"1px solid rgba(8,145,178,.2)",borderRadius:5,padding:"3px 10px"}}>{a}</span>)}
              </div>
            </Sec>
          )}

          {/* Rules */}
          {h.rules?.filter(Boolean).length>0&&(
            <Sec title="📋 House Rules">
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {h.rules.filter(Boolean).map((r,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,fontSize:13,color:"#94a3b8"}}>
                    <span style={{color:"#0891b2",fontWeight:700,marginTop:1}}>→</span>{r}
                  </div>
                ))}
              </div>
            </Sec>
          )}

          {/* All image sections */}
          <ImgRow title="🛎️ Reception Images" images={h.receptionImages} />
          <ImgRow title="🛏 Room Gallery" images={h.roomGallery} />
          <ImgRow title="🚿 Washroom Images" images={h.washroomImages} />
          <ImgRow title="🍳 Kitchen / Mess Images" images={h.kitchenImages} />

          <Sec title="📊 Meta">
            <IG items={[["Created",h.createdAt?new Date(h.createdAt).toLocaleDateString():null],["Updated",h.updatedAt?new Date(h.updatedAt).toLocaleDateString():null]]} />
          </Sec>
        </div>
      </div>
    </div>
  );
}

/* ===================== MINI COMPONENTS ===================== */
function MWrap({children,onClose}){
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.9)",zIndex:9995,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
    <div style={{background:"#050f14",border:"1px solid #083344",borderRadius:20,padding:"36px 32px",maxWidth:430,width:"100%",animation:"pop .25s ease",position:"relative"}}>
      <button onClick={onClose} style={{position:"absolute",top:14,right:14,width:28,height:28,borderRadius:7,background:"#083344",border:"1px solid #0e4f5e",color:"#64748b",cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
      {children}
    </div>
  </div>;
}
function LbBtn({children,onClick,disabled}){
  return <button onClick={onClick} disabled={disabled} style={{width:36,height:36,borderRadius:8,background:"#111",border:"1px solid #222",color:disabled?"#1f2937":"#bae6fd",cursor:disabled?"not-allowed":"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>{children}</button>;
}
function FGrid({children}){return <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:18}}>{children}</div>;}
function FField({l,children,full}){
  return <div style={full?{gridColumn:"1/-1"}:{}}>
    <label style={{display:"block",fontSize:11,color:"#083344",fontWeight:700,letterSpacing:".05em",textTransform:"uppercase",marginBottom:7}}>{l}</label>
    {children}
  </div>;
}
function FIn({style,...props}){return <input {...props} style={{width:"100%",padding:"9px 12px",background:"#020c10",border:"1px solid #083344",borderRadius:8,color:"#bae6fd",fontSize:13,boxSizing:"border-box",fontFamily:"'DM Sans',sans-serif",...style}} />;}
function FSel({children,...props}){return <select {...props} style={{width:"100%",padding:"9px 12px",background:"#020c10",border:"1px solid #083344",borderRadius:8,color:"#bae6fd",fontSize:13,cursor:"pointer",boxSizing:"border-box",fontFamily:"'DM Sans',sans-serif"}}>{children}</select>;}
function FTxt({style,...props}){return <textarea {...props} style={{width:"100%",padding:"9px 12px",background:"#020c10",border:"1px solid #083344",borderRadius:8,color:"#bae6fd",fontSize:13,resize:"vertical",lineHeight:1.6,boxSizing:"border-box",fontFamily:"'DM Sans',sans-serif",...style}} />;}
function CHK({label,checked,onChange}){
  return <label style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer",fontSize:13,color:checked?"#38bdf8":"#4b5563",userSelect:"none"}}>
    <div onClick={onChange} style={{width:20,height:20,borderRadius:5,border:`2px solid ${checked?"#0891b2":"#083344"}`,background:checked?"#0891b2":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s",cursor:"pointer"}}>
      {checked&&<span style={{color:"#fff",fontSize:11}}>✓</span>}
    </div>
    {label}
  </label>;
}
function SmlDel({children,onClick}){return <button type="button" onClick={onClick} style={{padding:"3px 12px",background:"rgba(248,113,113,.08)",border:"1px solid rgba(248,113,113,.2)",borderRadius:6,color:"#f87171",cursor:"pointer",fontSize:12,fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap"}}>{children}</button>;}
function AddBtn({children,onClick}){return <button type="button" onClick={onClick} style={{alignSelf:"flex-start",padding:"7px 18px",background:"rgba(8,145,178,.1)",border:"1px solid rgba(8,145,178,.25)",borderRadius:8,color:"#38bdf8",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>{children}</button>;}
function GhBtn({children,onClick}){return <button type="button" onClick={onClick} style={{padding:"9px 22px",background:"#083344",border:"1px solid #0e4f5e",borderRadius:8,color:"#64748b",cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>{children}</button>;}
function PriBtn({children,type="button",onClick,disabled}){return <button type={type} onClick={onClick} disabled={disabled} style={{padding:"9px 26px",background:disabled?"#083344":"linear-gradient(135deg,#0369a1,#0891b2)",border:"none",borderRadius:8,color:disabled?"#083344":"#fff",cursor:disabled?"not-allowed":"pointer",fontSize:13,fontWeight:700,fontFamily:"'DM Sans',sans-serif",opacity:disabled?.7:1}}>{children}</button>;}
function AB({children,c,onClick,t}){return <button className="hab" onClick={onClick} title={t} style={{width:30,height:30,borderRadius:7,background:`${c}18`,border:`1px solid ${c}30`,color:c,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s",flexShrink:0}}>{children}</button>;}
function PgBtn({children,onClick,disabled,active}){return <button className="hpp" onClick={onClick} disabled={disabled} style={{minWidth:34,height:34,borderRadius:8,border:active?"1px solid #0891b2":"1px solid #083344",background:active?"rgba(8,145,178,.14)":"#050f14",color:active?"#38bdf8":disabled?"#083344":"#4b5563",cursor:disabled?"not-allowed":"pointer",fontSize:13,fontWeight:active?700:400,fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}>{children}</button>;}