





import { useState, useEffect, useCallback } from "react";
import axios from "axios";


// ─── CONFIG ──────────────────────────────────────────────────────────────────
const BASE_URL = "https://bmtadmin.onrender.com/api/hotels"; // apna URL yahan lagao

// ─── STYLES ──────────────────────────────────────────────────────────────────
const injectStyles = () => {
  if (document.getElementById("hm-styles")) return;
  const style = document.createElement("style");
  style.id = "hm-styles";
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .hm-root {
      --bg: #f5f6fa;
      --white: #ffffff;
      --surf2: #f8f9fc;
      --border: #e4e8f0;
      --border2: #d0d6e8;
      --accent: #2563eb;
      --accent-h: #1d4ed8;
      --accent-dim: rgba(37,99,235,0.08);
      --text: #0f172a;
      --sub: #475569;
      --muted: #94a3b8;
      --green: #10b981;
      --green-dim: rgba(16,185,129,0.1);
      --red: #ef4444;
      --red-dim: rgba(239,68,68,0.1);
      --amber: #f59e0b;
      --amber-dim: rgba(245,158,11,0.1);
      --r: 10px;
      font-family: 'DM Sans', sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
    }
    .hm-page { padding: 28px 32px; max-width: 1500px; margin: 0 auto; }

    /* HEADER */
    .hm-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; }
    .hm-header h2 { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; }
    .hm-header p { font-size:13px; color:var(--sub); margin-top:2px; }
    .hm-hbtns { display:flex; gap:10px; }
    .hm-btn-add {
      display:flex; align-items:center; gap:7px; background:var(--accent);
      color:#fff; border:none; padding:10px 18px; border-radius:var(--r);
      font-family:'Syne',sans-serif; font-weight:700; font-size:13px;
      cursor:pointer; transition:.2s; box-shadow:0 2px 8px rgba(37,99,235,.2);
    }
    .hm-btn-add:hover { background:var(--accent-h); transform:translateY(-1px); }
    .hm-btn-add svg { width:15px; height:15px; }
    .hm-btn-ref {
      display:flex; align-items:center; gap:7px; background:var(--white);
      color:var(--sub); border:1px solid var(--border); padding:10px 16px; border-radius:var(--r);
      font-family:'DM Sans',sans-serif; font-size:13px; cursor:pointer; transition:.2s;
    }
    .hm-btn-ref:hover { border-color:var(--border2); color:var(--text); }
    .hm-btn-ref svg { width:14px; height:14px; }

    /* STATS */
    .hm-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:22px; }
    .hm-stat { background:var(--white); border:1px solid var(--border); border-radius:var(--r); padding:18px 20px; box-shadow:0 1px 4px rgba(0,0,0,.04); }
    .hm-stat .lbl { font-size:11px; text-transform:uppercase; letter-spacing:.7px; color:var(--muted); margin-bottom:8px; font-weight:500; }
    .hm-stat .val { font-family:'Syne',sans-serif; font-size:28px; font-weight:800; }
    .hm-stat .bdg { display:inline-block; font-size:11px; padding:3px 8px; border-radius:20px; margin-top:6px; font-weight:600; }
    .bdg-blue { background:rgba(37,99,235,.1); color:var(--accent); }
    .bdg-green { background:var(--green-dim); color:var(--green); }
    .bdg-amber { background:var(--amber-dim); color:var(--amber); }
    .bdg-red { background:var(--red-dim); color:var(--red); }

    /* TABLE CARD */
    .hm-card { background:var(--white); border:1px solid var(--border); border-radius:var(--r); box-shadow:0 1px 4px rgba(0,0,0,.04); overflow:hidden; }
    .hm-card-top { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid var(--border); }
    .hm-card-top h3 { font-family:'Syne',sans-serif; font-weight:700; font-size:14px; }
    .hm-search { display:flex; align-items:center; gap:8px; background:var(--surf2); border:1px solid var(--border); border-radius:8px; padding:8px 12px; width:240px; }
    .hm-search svg { width:14px; height:14px; color:var(--muted); flex-shrink:0; }
    .hm-search input { background:none; border:none; outline:none; color:var(--text); font-family:'DM Sans',sans-serif; font-size:13px; width:100%; }
    .hm-table { width:100%; border-collapse:collapse; }
    .hm-table thead tr { background:var(--surf2); }
    .hm-table th { padding:11px 14px; text-align:left; font-size:10px; text-transform:uppercase; letter-spacing:.7px; color:var(--muted); font-weight:600; white-space:nowrap; }
    .hm-table td { padding:12px 14px; font-size:13px; border-top:1px solid var(--border); vertical-align:middle; }
    .hm-table tbody tr:hover td { background:#fafbff; }
    .hm-hotel-name { font-weight:600; color:var(--text); }
    .hm-hotel-sub { font-size:11px; color:var(--muted); margin-top:1px; }
    .hm-rating { display:flex; align-items:center; gap:3px; }
    .hm-rating svg { width:13px; height:13px; fill:var(--amber); }
    .hm-status { display:inline-flex; align-items:center; gap:5px; font-size:11px; padding:4px 10px; border-radius:20px; font-weight:600; white-space:nowrap; }
    .hm-status::before { content:''; width:5px; height:5px; border-radius:50%; background:currentColor; }
    .hm-status-approved { background:var(--green-dim); color:var(--green); }
    .hm-status-pending { background:var(--amber-dim); color:var(--amber); }
    .hm-status-rejected { background:var(--red-dim); color:var(--red); }

    /* ACTION BUTTONS */
    .hm-actions { display:flex; gap:5px; flex-wrap:wrap; align-items:center; }
    .hm-ibtn {
      height:29px; border-radius:7px; border:1px solid var(--border); background:var(--surf2);
      display:flex; align-items:center; justify-content:center; cursor:pointer; transition:.2s;
      color:var(--sub); padding:0 9px; gap:4px; font-size:11px; font-family:'DM Sans',sans-serif;
      font-weight:500; white-space:nowrap;
    }
    .hm-ibtn svg { width:12px; height:12px; flex-shrink:0; }
    .hm-ibtn.view:hover { border-color:var(--accent); color:var(--accent); background:var(--accent-dim); }
    .hm-ibtn.edit:hover { border-color:var(--amber); color:var(--amber); background:var(--amber-dim); }
    .hm-ibtn.del:hover { border-color:var(--red); color:var(--red); background:var(--red-dim); }
    .hm-ibtn.approve { border-color:var(--green); color:var(--green); background:var(--green-dim); font-weight:600; }
    .hm-ibtn.approve:hover { background:rgba(16,185,129,.2); }
    .hm-ibtn.reject { border-color:var(--red); color:var(--red); background:var(--red-dim); font-weight:600; }
    .hm-ibtn.reject:hover { background:rgba(239,68,68,.2); }
    .hm-ibtn:disabled { opacity:.45; cursor:not-allowed; pointer-events:none; }

    .hm-empty { text-align:center; padding:60px; color:var(--muted); font-size:13px; }
    .hm-loading-row { text-align:center; padding:60px; color:var(--muted); font-size:13px; }

    /* OVERLAY */
    .hm-overlay {
      position:fixed; inset:0; background:rgba(15,23,42,.4); z-index:100;
      display:flex; align-items:flex-start; justify-content:flex-end;
      backdrop-filter:blur(3px); opacity:0; pointer-events:none; transition:opacity .25s;
    }
    .hm-overlay.open { opacity:1; pointer-events:all; }

    /* SLIDE PANEL */
    .hm-panel {
      background:var(--white); width:800px; height:100vh; overflow-y:auto;
      border-left:1px solid var(--border); display:flex; flex-direction:column;
      transform:translateX(100%); transition:transform .35s cubic-bezier(.4,0,.2,1);
      box-shadow:-8px 0 40px rgba(0,0,0,.08);
    }
    .hm-overlay.open .hm-panel { transform:translateX(0); }
    .hm-panel-head {
      display:flex; align-items:center; justify-content:space-between;
      padding:20px 24px; border-bottom:1px solid var(--border);
      position:sticky; top:0; background:var(--white); z-index:10;
    }
    .hm-panel-head h3 { font-family:'Syne',sans-serif; font-size:16px; font-weight:800; }
    .hm-panel-head p { font-size:12px; color:var(--sub); margin-top:2px; }
    .hm-close {
      width:32px; height:32px; border-radius:7px; border:1px solid var(--border);
      background:var(--surf2); display:flex; align-items:center; justify-content:center;
      cursor:pointer; color:var(--sub); transition:.2s;
    }
    .hm-close:hover { border-color:var(--red); color:var(--red); }
    .hm-close svg { width:15px; height:15px; }

    /* FORM */
    .hm-form-body { padding:22px 24px; flex:1; }
    .hm-sec-title {
      font-family:'Syne',sans-serif; font-size:11px; font-weight:700;
      text-transform:uppercase; letter-spacing:1px; color:var(--accent);
      margin:24px 0 14px; display:flex; align-items:center; gap:10px;
    }
    .hm-sec-title::after { content:''; flex:1; height:1px; background:var(--border); }
    .hm-sec-title:first-child { margin-top:0; }
    .hm-g2 { display:grid; grid-template-columns:1fr 1fr; gap:13px; margin-bottom:13px; }
    .hm-g3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:13px; margin-bottom:13px; }
    .hm-fg { display:flex; flex-direction:column; gap:5px; margin-bottom:13px; }
    .hm-fg label { font-size:11px; color:var(--sub); font-weight:600; letter-spacing:.2px; }
    .hm-fg input,.hm-fg select,.hm-fg textarea {
      background:var(--surf2); border:1px solid var(--border); border-radius:8px;
      padding:9px 12px; color:var(--text); font-family:'DM Sans',sans-serif;
      font-size:13px; outline:none; transition:.2s; width:100%;
    }
    .hm-fg input:focus,.hm-fg select:focus,.hm-fg textarea:focus {
      border-color:var(--accent); background:#fff; box-shadow:0 0 0 3px rgba(37,99,235,.08);
    }
    .hm-fg select option { background:#fff; }
    .hm-fg textarea { resize:vertical; min-height:70px; }
    .hm-cb-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:13px; }
    .hm-cb-item {
      display:flex; align-items:center; gap:8px; background:var(--surf2);
      border:1px solid var(--border); border-radius:7px; padding:9px 11px; cursor:pointer; transition:.2s;
    }
    .hm-cb-item:hover { border-color:var(--accent); background:var(--accent-dim); }
    .hm-cb-item input[type=checkbox] { width:14px; height:14px; accent-color:var(--accent); cursor:pointer; flex-shrink:0; }
    .hm-cb-item label { font-size:12px; cursor:pointer; user-select:none; color:var(--sub); }
    .hm-file-wrap {
      background:var(--surf2); border:2px dashed var(--border); border-radius:8px;
      padding:16px; text-align:center; cursor:pointer; transition:.2s; position:relative;
    }
    .hm-file-wrap:hover { border-color:var(--accent); }
    .hm-file-wrap input { position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; height:100%; }
    .hm-file-wrap p { font-size:12px; color:var(--muted); }
    .hm-file-wrap span { font-size:11px; color:var(--accent); margin-top:3px; display:block; }
    .hm-form-actions {
      display:flex; gap:10px; padding:16px 24px; border-top:1px solid var(--border);
      position:sticky; bottom:0; background:var(--white);
    }
    .hm-btn-submit {
      flex:1; background:var(--accent); color:#fff; border:none; padding:11px;
      border-radius:var(--r); font-family:'Syne',sans-serif; font-weight:700;
      font-size:13px; cursor:pointer; transition:.2s; display:flex; align-items:center; justify-content:center; gap:8px;
    }
    .hm-btn-submit:hover { background:var(--accent-h); }
    .hm-btn-submit:disabled { opacity:.6; cursor:not-allowed; }
    .hm-btn-cancel {
      background:var(--surf2); color:var(--sub); border:1px solid var(--border);
      padding:11px 20px; border-radius:var(--r); font-family:'DM Sans',sans-serif;
      font-size:13px; cursor:pointer; transition:.2s;
    }
    .hm-btn-cancel:hover { color:var(--text); border-color:var(--border2); }

    /* ROOM CARD */
    .hm-room-card { background:var(--surf2); border:1px solid var(--border); border-radius:var(--r); padding:16px; margin-bottom:12px; }
    .hm-room-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
    .hm-room-head span { font-family:'Syne',sans-serif; font-size:13px; font-weight:700; color:var(--accent); }
    .hm-btn-rm { background:var(--red-dim); color:var(--red); border:none; padding:4px 10px; border-radius:6px; font-size:11px; cursor:pointer; font-family:'DM Sans',sans-serif; }
    .hm-btn-add-room {
      display:flex; align-items:center; justify-content:center; gap:7px;
      background:var(--accent-dim); color:var(--accent); border:1.5px dashed var(--accent);
      padding:10px; border-radius:8px; font-size:13px; cursor:pointer; width:100%;
      transition:.2s; font-family:'DM Sans',sans-serif; margin-top:4px;
    }
    .hm-btn-add-room:hover { background:rgba(37,99,235,.14); }
    .hm-btn-add-room svg { width:15px; height:15px; }

    /* VIEW MODAL */
    .hm-view-overlay {
      position:fixed; inset:0; background:rgba(15,23,42,.45); z-index:200;
      display:flex; align-items:center; justify-content:center; padding:20px;
      backdrop-filter:blur(4px); opacity:0; pointer-events:none; transition:opacity .25s;
    }
    .hm-view-overlay.open { opacity:1; pointer-events:all; }
    .hm-view-modal {
      background:var(--white); border:1px solid var(--border); border-radius:14px;
      width:960px; max-height:90vh; overflow-y:auto;
      transform:scale(.96); transition:transform .25s; box-shadow:0 24px 80px rgba(0,0,0,.15);
    }
    .hm-view-overlay.open .hm-view-modal { transform:scale(1); }
    .hm-view-head {
      display:flex; align-items:center; justify-content:space-between;
      padding:20px 24px; border-bottom:1px solid var(--border);
      position:sticky; top:0; background:var(--white); border-radius:14px 14px 0 0; z-index:5;
    }
    .hm-view-head h3 { font-family:'Syne',sans-serif; font-size:18px; font-weight:800; }
    .hm-view-body { padding:22px 24px; }
    .hm-view-section { margin-bottom:22px; }
    .hm-view-section h4 {
      font-family:'Syne',sans-serif; font-size:11px; font-weight:700;
      text-transform:uppercase; letter-spacing:1px; color:var(--accent);
      margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid var(--border);
    }
    .hm-view-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
    .hm-vf { background:var(--surf2); border:1px solid var(--border); border-radius:8px; padding:11px 13px; }
    .hm-vf label { font-size:10px; text-transform:uppercase; letter-spacing:.7px; color:var(--muted); display:block; margin-bottom:4px; font-weight:600; }
    .hm-vf span { font-size:13px; color:var(--text); font-weight:500; }
    .hm-yes { color:var(--green) !important; }
    .hm-no { color:var(--red) !important; }
    .hm-tags { display:flex; flex-wrap:wrap; gap:6px; }
    .hm-tag { background:var(--accent-dim); color:var(--accent); font-size:11px; padding:4px 10px; border-radius:20px; font-weight:500; }
    .hm-room-view { background:var(--surf2); border:1px solid var(--border); border-radius:10px; padding:16px; margin-bottom:10px; }
    .hm-room-view h5 { font-family:'Syne',sans-serif; font-size:13px; font-weight:700; color:var(--accent); margin-bottom:12px; }

    /* TOAST */
    .hm-toast {
      position:fixed; bottom:22px; right:22px; padding:12px 18px; border-radius:9px;
      font-size:13px; font-weight:500; z-index:999; font-family:'DM Sans',sans-serif;
      transform:translateY(80px); opacity:0; transition:.3s; pointer-events:none;
      box-shadow:0 4px 20px rgba(0,0,0,.15); min-width:220px;
    }
    .hm-toast.show { transform:translateY(0); opacity:1; }
    .hm-toast.success { background:#10b981; color:#fff; }
    .hm-toast.error { background:#ef4444; color:#fff; }
    .hm-toast.info { background:#2563eb; color:#fff; }

    /* SPINNER */
    .hm-spin { display:inline-block; width:13px; height:13px; border:2px solid rgba(255,255,255,.4); border-top-color:#fff; border-radius:50%; animation:hm-spin .6s linear infinite; }
    @keyframes hm-spin { to { transform:rotate(360deg); } }

    /* SCROLLBAR */
    .hm-panel::-webkit-scrollbar,.hm-view-modal::-webkit-scrollbar { width:5px; }
    .hm-panel::-webkit-scrollbar-track,.hm-view-modal::-webkit-scrollbar-track { background:var(--surf2); }
    .hm-panel::-webkit-scrollbar-thumb,.hm-view-modal::-webkit-scrollbar-thumb { background:var(--border2); border-radius:3px; }
  `;
  document.head.appendChild(style);
};

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const AMENITY_LIST = [
  "Free WiFi","Swimming Pool","Gym / Fitness","Spa & Wellness",
  "Restaurant","Bar / Lounge","Parking","Air Conditioning",
  "Laundry","Concierge","Room Service","Elevator / Lift",
];

const PM_LIST = ["Cash","Credit/Debit Card","UPI","Net Banking","Wallets","EMI"];

const ROOM_BOOL_FIELDS = [
  { k:"extraBedAvailable", l:"Extra Bed" },{ k:"balcony", l:"Balcony" },
  { k:"airCondition", l:"AC" },{ k:"heater", l:"Heater" },
  { k:"wifi", l:"WiFi" },{ k:"tv", l:"TV" },
  { k:"minibar", l:"Minibar" },{ k:"wardrobe", l:"Wardrobe" },
  { k:"workDesk", l:"Work Desk" },{ k:"iron", l:"Iron" },
  { k:"kitchen", l:"Kitchen" },{ k:"bathtub", l:"Bathtub" },
  { k:"shower", l:"Shower" },{ k:"toiletries", l:"Toiletries" },
  { k:"hairDryer", l:"Hair Dryer" },{ k:"breakfastIncluded", l:"Breakfast" },
  { k:"lunchIncluded", l:"Lunch" },{ k:"dinnerIncluded", l:"Dinner" },
  { k:"smokingAllowed", l:"Smoking" },{ k:"refundable", l:"Refundable" },
];

const defRoom = () => ({
  _tid: Date.now() + Math.random(),
  roomType:"", roomName:"", description:"",
  basePrice:"", offerPrice:"", tax:"",
  totalRooms:"", availableRooms:"", maxGuests:"",
  adults:"", children:"", roomSize:"", floorNumber:"",
  bedType:"", bedCount:"", viewType:"", bathroomType:"",
  extraBedCharge:"", cancellationPolicy:"", status:"available",
  extraBedAvailable:false,balcony:false,airCondition:false,heater:false,
  wifi:false,tv:false,minibar:false,wardrobe:false,workDesk:false,
  iron:false,kitchen:false,bathtub:false,shower:false,toiletries:false,
  hairDryer:false,breakfastIncluded:false,lunchIncluded:false,dinnerIncluded:false,
  smokingAllowed:false,refundable:false,
});

const defHotel = () => ({
  hotelName:"",hotelType:"",description:"",starRating:"",yearBuilt:"",
  phone:"",alternatePhone:"",email:"",website:"",
  country:"India",state:"",city:"",area:"",address:"",pincode:"",landmark:"",
  latitude:"",longitude:"",virtualTourLink:"",
  vendorId:"",vendorName:"",
  checkInTime:"14:00",checkOutTime:"11:00",
  cancellationPolicy:"",refundPolicy:"",childPolicy:"",petPolicy:"",
  earlyCheckInAllowed:false,lateCheckOutAllowed:false,coupleFriendly:true,
  localIdAllowed:true,featured:false,isActive:true,
  pricePerNight:"",taxPercentage:"",serviceCharge:"",extraBedCharge:"",
  gstNumber:"",status:"pending",
  paymentMethods:[],amenities:[],
  propertyHighlights:"",foodAndDining:"",safetyAndSecurity:"",
  businessFacilities:"",transportServices:"",
  rooms:[],
});

// ─── API ─────────────────────────────────────────────────────────────────────
const api = {
  getAll: () => fetch(`${BASE_URL}/all`).then(r=>r.json()),
  // add: (fd) => fetch(`${BASE_URL}/add`,{method:"POST",body:fd}).then(r=>r.json()),
  
add: async (fd) => {
  const res = await axios.post(
    `${BASE_URL}/add`,
    fd,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data;
},
  update: (id,fd) => fetch(`${BASE_URL}/update/${id}`,{method:"PUT",body:fd}).then(r=>r.json()),
  delete: (id) => fetch(`${BASE_URL}/delete/${id}`,{method:"DELETE"}).then(r=>r.json()),
  approve: (id) => fetch(`${BASE_URL}/approve/${id}`,{method:"PUT"}).then(r=>r.json()),
  reject: (id) => fetch(`${BASE_URL}/update/${id}`,{
    method:"PUT", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({status:"rejected"})
  }).then(r=>r.json()),
};

const buildFD = (form, files) => {
  const fd = new FormData();
  const scalars = [
    "hotelName","hotelType","description","starRating","yearBuilt",
    "phone","alternatePhone","email","website","country","state","city",
    "area","address","pincode","landmark","latitude","longitude","virtualTourLink",
    "vendorId","vendorName","checkInTime","checkOutTime","cancellationPolicy","refundPolicy",
    "childPolicy","petPolicy","earlyCheckInAllowed","lateCheckOutAllowed","coupleFriendly",
    "localIdAllowed","featured","isActive","pricePerNight","taxPercentage","serviceCharge",
    "extraBedCharge","gstNumber","status"
  ];
  scalars.forEach(k=>{ if(form[k]!==undefined && form[k]!=="") fd.append(k,form[k]); });
  (form.amenities||[]).forEach(a=>fd.append("amenities",a));
  (form.paymentMethods||[]).forEach(p=>fd.append("paymentMethods",p));
  ["propertyHighlights","foodAndDining","safetyAndSecurity","businessFacilities","transportServices"]
    .forEach(k=>{ if(form[k]) form[k].split(",").map(s=>s.trim()).filter(Boolean).forEach(v=>fd.append(k,v)); });
  const cleanRooms = (form.rooms||[]).map(r=>{ const c={...r}; delete c._tid; return c; });
  fd.append("rooms",JSON.stringify(cleanRooms));
  if(files?.hotelImages) [...files.hotelImages].forEach(f=>fd.append("hotelImages",f));
  if(files?.roomImages) [...files.roomImages].forEach(f=>fd.append("roomImages",f));
  if(files?.videos) [...files.videos].forEach(f=>fd.append("videos",f));
  return fd;
};

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Ic = {
  Plus:()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  X:()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Eye:()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Edit:()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash:()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
  Search:()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Star:()=><svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  Check:()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  Ban:()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>,
  Refresh:()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
};

// ─── FORM FIELDS ─────────────────────────────────────────────────────────────
const FG = ({label,children})=><div className="hm-fg"><label>{label}</label>{children}</div>;
const Inp = ({label,value,onChange,type="text",placeholder=""})=>(
  <FG label={label}><input type={type} value={value??""} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/></FG>
);
const Sel = ({label,value,onChange,options})=>(
  <FG label={label}>
    <select value={value??""} onChange={e=>onChange(e.target.value)}>
      <option value="">Select</option>
      {options.map(o=><option key={o.value??o} value={o.value??o}>{o.label??o}</option>)}
    </select>
  </FG>
);
const Txta = ({label,value,onChange,placeholder="",rows=2})=>(
  <FG label={label}><textarea rows={rows} value={value??""} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/></FG>
);
const CbGrid = ({items,checked,onChange})=>(
  <div className="hm-cb-grid">
    {items.map(({key,label,k,l})=>{
      const id=key??k; const lbl=label??l;
      return(
        <div key={id} className="hm-cb-item" onClick={()=>onChange(id,!checked[id])}>
          <input type="checkbox" checked={!!checked[id]} onChange={()=>{}}/>
          <label>{lbl}</label>
        </div>
      );
    })}
  </div>
);

// ─── ROOM FORM ───────────────────────────────────────────────────────────────
function RoomForm({room,index,onChange,onRemove}){
  const u=(f,v)=>onChange(room._tid,f,v);
  return(
    <div className="hm-room-card">
      <div className="hm-room-head">
        <span>Room #{index+1}</span>
        <button type="button" className="hm-btn-rm" onClick={()=>onRemove(room._tid)}>Remove</button>
      </div>
      <div className="hm-g3">
        <Inp label="Room Type *" value={room.roomType} onChange={v=>u("roomType",v)} placeholder="Deluxe / Suite"/>
        <Inp label="Room Name" value={room.roomName} onChange={v=>u("roomName",v)} placeholder="Ocean Deluxe"/>
        <Inp label="Description" value={room.description} onChange={v=>u("description",v)} placeholder="Short desc..."/>
      </div>
      <div className="hm-g3">
        <Inp label="Base Price (₹) *" type="number" value={room.basePrice} onChange={v=>u("basePrice",v)} placeholder="2000"/>
        <Inp label="Offer Price (₹)" type="number" value={room.offerPrice} onChange={v=>u("offerPrice",v)} placeholder="1800"/>
        <Inp label="Tax (%)" type="number" value={room.tax} onChange={v=>u("tax",v)} placeholder="12"/>
      </div>
      <div className="hm-g3">
        <Inp label="Total Rooms *" type="number" value={room.totalRooms} onChange={v=>u("totalRooms",v)} placeholder="10"/>
        <Inp label="Available *" type="number" value={room.availableRooms} onChange={v=>u("availableRooms",v)} placeholder="8"/>
        <Inp label="Max Guests" type="number" value={room.maxGuests} onChange={v=>u("maxGuests",v)} placeholder="4"/>
      </div>
      <div className="hm-g3">
        <Inp label="Adults" type="number" value={room.adults} onChange={v=>u("adults",v)} placeholder="2"/>
        <Inp label="Children" type="number" value={room.children} onChange={v=>u("children",v)} placeholder="2"/>
        <Inp label="Room Size" value={room.roomSize} onChange={v=>u("roomSize",v)} placeholder="35 sqm"/>
      </div>
      <div className="hm-g3">
        <Inp label="Floor No." value={room.floorNumber} onChange={v=>u("floorNumber",v)} placeholder="3"/>
        <Sel label="Bed Type" value={room.bedType} onChange={v=>u("bedType",v)} options={["Single","Twin","Double","King","Queen","Super King"]}/>
        <Inp label="Bed Count" type="number" value={room.bedCount} onChange={v=>u("bedCount",v)} placeholder="1"/>
      </div>
      <div className="hm-g3">
        <Inp label="View Type" value={room.viewType} onChange={v=>u("viewType",v)} placeholder="Sea View, Garden"/>
        <Inp label="Bathroom Type" value={room.bathroomType} onChange={v=>u("bathroomType",v)} placeholder="Private / Shared"/>
        <Inp label="Extra Bed Charge (₹)" type="number" value={room.extraBedCharge} onChange={v=>u("extraBedCharge",v)} placeholder="500"/>
      </div>
      <div className="hm-g2">
        <Inp label="Cancellation Policy" value={room.cancellationPolicy} onChange={v=>u("cancellationPolicy",v)} placeholder="Free cancellation 24hr..."/>
        <Sel label="Status" value={room.status} onChange={v=>u("status",v)} options={[{value:"available",label:"Available"},{value:"soldout",label:"Sold Out"}]}/>
      </div>
      <CbGrid items={ROOM_BOOL_FIELDS} checked={room} onChange={(k,v)=>u(k,v)}/>
    </div>
  );
}

// ─── HOTEL FORM ──────────────────────────────────────────────────────────────
function HotelForm({form,setForm,onSubmit,onClose,isEdit,saving,files,setFiles}){
  const u=(f,v)=>setForm(p=>({...p,[f]:v}));
  const addRoom=()=>setForm(p=>({...p,rooms:[...p.rooms,defRoom()]}));
  const removeRoom=tid=>setForm(p=>({...p,rooms:p.rooms.filter(r=>r._tid!==tid)}));
  const updRoom=(tid,f,v)=>setForm(p=>({...p,rooms:p.rooms.map(r=>r._tid===tid?{...r,[f]:v}:r)}));
  const toggleArr=(field,key)=>{
    const cur=form[field]||[];
    setForm(p=>({...p,[field]:cur.includes(key)?cur.filter(k=>k!==key):[...cur,key]}));
  };

  return(
    <>
      <div className="hm-form-body">
        <div className="hm-sec-title">Basic Information</div>
        <div className="hm-g2">
          <Inp label="Hotel Name *" value={form.hotelName} onChange={v=>u("hotelName",v)} placeholder="Grand Palace Hotel"/>
          <Sel label="Hotel Type" value={form.hotelType} onChange={v=>u("hotelType",v)} options={["Luxury Hotel","Boutique Hotel","Budget Hotel","Resort","Motel","Hostel","Serviced Apartment"]}/>
        </div>
        <Txta label="Description" value={form.description} onChange={v=>u("description",v)} placeholder="Describe the hotel..." rows={3}/>
        <div className="hm-g3">
          <Sel label="Star Rating" value={form.starRating} onChange={v=>u("starRating",v)} options={["1","2","3","4","5"]}/>
          <Inp label="Year Built" type="number" value={form.yearBuilt} onChange={v=>u("yearBuilt",v)} placeholder="2010"/>
          <Inp label="Price / Night (₹)" type="number" value={form.pricePerNight} onChange={v=>u("pricePerNight",v)} placeholder="2500"/>
        </div>
        <div className="hm-g3">
          <Inp label="Tax (%)" type="number" value={form.taxPercentage} onChange={v=>u("taxPercentage",v)} placeholder="12"/>
          <Inp label="Service Charge (₹)" type="number" value={form.serviceCharge} onChange={v=>u("serviceCharge",v)} placeholder="200"/>
          <Inp label="Extra Bed Charge (₹)" type="number" value={form.extraBedCharge} onChange={v=>u("extraBedCharge",v)} placeholder="500"/>
        </div>
        <Inp label="GST Number" value={form.gstNumber} onChange={v=>u("gstNumber",v)} placeholder="22AAAAA0000A1Z5"/>

        <div className="hm-sec-title">Contact Information</div>
        <div className="hm-g2">
          <Inp label="Phone *" type="tel" value={form.phone} onChange={v=>u("phone",v)} placeholder="+91 98765 43210"/>
          <Inp label="Alternate Phone" type="tel" value={form.alternatePhone} onChange={v=>u("alternatePhone",v)} placeholder="+91 98765 00000"/>
        </div>
        <div className="hm-g2">
          <Inp label="Email" type="email" value={form.email} onChange={v=>u("email",v)} placeholder="info@hotel.com"/>
          <Inp label="Website" type="url" value={form.website} onChange={v=>u("website",v)} placeholder="https://hotel.com"/>
        </div>

        <div className="hm-sec-title">Location</div>
        <div className="hm-g3">
          <Inp label="Country" value={form.country} onChange={v=>u("country",v)} placeholder="India"/>
          <Inp label="State" value={form.state} onChange={v=>u("state",v)} placeholder="Rajasthan"/>
          <Inp label="City" value={form.city} onChange={v=>u("city",v)} placeholder="Jaipur"/>
        </div>
        <div className="hm-g3">
          <Inp label="Area" value={form.area} onChange={v=>u("area",v)} placeholder="MI Road"/>
          <Inp label="Pincode" value={form.pincode} onChange={v=>u("pincode",v)} placeholder="302001"/>
          <Inp label="Landmark" value={form.landmark} onChange={v=>u("landmark",v)} placeholder="Near City Palace"/>
        </div>
        <Txta label="Full Address" value={form.address} onChange={v=>u("address",v)} placeholder="Complete address..." rows={2}/>
        <div className="hm-g2">
          <Inp label="Latitude" type="number" value={form.latitude} onChange={v=>u("latitude",v)} placeholder="26.9124"/>
          <Inp label="Longitude" type="number" value={form.longitude} onChange={v=>u("longitude",v)} placeholder="75.7873"/>
        </div>
        <Inp label="Virtual Tour Link" value={form.virtualTourLink} onChange={v=>u("virtualTourLink",v)} placeholder="https://tour.hotel.com"/>

        <div className="hm-sec-title">Vendor Details</div>
        <div className="hm-g2">
          <Inp label="Vendor ID" value={form.vendorId} onChange={v=>u("vendorId",v)} placeholder="VENDOR001"/>
          <Inp label="Vendor Name" value={form.vendorName} onChange={v=>u("vendorName",v)} placeholder="Rajesh Kumar"/>
        </div>

        <div className="hm-sec-title">Timing & Policies</div>
        <div className="hm-g2">
          <Inp label="Check-In Time" type="time" value={form.checkInTime} onChange={v=>u("checkInTime",v)}/>
          <Inp label="Check-Out Time" type="time" value={form.checkOutTime} onChange={v=>u("checkOutTime",v)}/>
        </div>
        <div className="hm-g2">
          <Txta label="Cancellation Policy" value={form.cancellationPolicy} onChange={v=>u("cancellationPolicy",v)} placeholder="Free cancellation 24hrs before..." rows={2}/>
          <Txta label="Refund Policy" value={form.refundPolicy} onChange={v=>u("refundPolicy",v)} placeholder="Full refund within 7 days..." rows={2}/>
        </div>
        <div className="hm-g2">
          <Inp label="Child Policy" value={form.childPolicy} onChange={v=>u("childPolicy",v)} placeholder="Children under 5 stay free"/>
          <Inp label="Pet Policy" value={form.petPolicy} onChange={v=>u("petPolicy",v)} placeholder="No pets allowed"/>
        </div>
        <CbGrid
          items={[
            {key:"earlyCheckInAllowed",label:"Early Check-In"},{key:"lateCheckOutAllowed",label:"Late Check-Out"},
            {key:"coupleFriendly",label:"Couple Friendly"},{key:"localIdAllowed",label:"Local ID Allowed"},
            {key:"featured",label:"Featured Property"},{key:"isActive",label:"Active Listing"},
          ]}
          checked={form} onChange={(k,v)=>u(k,v)}
        />

        <div className="hm-sec-title">Status</div>
        <Sel label="Hotel Status" value={form.status} onChange={v=>u("status",v)}
          options={[{value:"pending",label:"Pending Review"},{value:"approved",label:"Approved"},{value:"rejected",label:"Rejected"}]}/>

        <div className="hm-sec-title">Payment Methods</div>
        <div className="hm-cb-grid">
          {PM_LIST.map(pm=>(
            <div key={pm} className="hm-cb-item" onClick={()=>toggleArr("paymentMethods",pm)}>
              <input type="checkbox" checked={form.paymentMethods?.includes(pm)} onChange={()=>{}}/>
              <label>{pm}</label>
            </div>
          ))}
        </div>

        <div className="hm-sec-title">Amenities</div>
        <div className="hm-cb-grid">
          {AMENITY_LIST.map(am=>(
            <div key={am} className="hm-cb-item" onClick={()=>toggleArr("amenities",am)}>
              <input type="checkbox" checked={form.amenities?.includes(am)} onChange={()=>{}}/>
              <label>{am}</label>
            </div>
          ))}
        </div>

        <div className="hm-sec-title">Highlights & Facilities</div>
        <Inp label="Property Highlights (comma separated)" value={form.propertyHighlights} onChange={v=>u("propertyHighlights",v)} placeholder="Rooftop View, Heritage Property, Sea Facing"/>
        <Inp label="Food & Dining (comma separated)" value={form.foodAndDining} onChange={v=>u("foodAndDining",v)} placeholder="Buffet Breakfast, Rooftop Dining"/>
        <Inp label="Safety & Security (comma separated)" value={form.safetyAndSecurity} onChange={v=>u("safetyAndSecurity",v)} placeholder="CCTV, 24/7 Security, Fire Safety"/>
        <Inp label="Business Facilities (comma separated)" value={form.businessFacilities} onChange={v=>u("businessFacilities",v)} placeholder="Conference Room, Business Center"/>
        <Inp label="Transport Services (comma separated)" value={form.transportServices} onChange={v=>u("transportServices",v)} placeholder="Airport Pickup, Car Rental"/>

        <div className="hm-sec-title">Media</div>
        <div className="hm-g2">
          <FG label="Hotel Images (max 20)">
            <div className="hm-file-wrap">
              <input type="file" multiple accept="image/*" onChange={e=>setFiles(f=>({...f,hotelImages:e.target.files}))}/>
              <p>Click to upload hotel images</p>
              <span>{files?.hotelImages?`${files.hotelImages.length} selected`:"No files chosen"}</span>
            </div>
          </FG>
          <FG label="Room Images (max 20)">
            <div className="hm-file-wrap">
              <input type="file" multiple accept="image/*" onChange={e=>setFiles(f=>({...f,roomImages:e.target.files}))}/>
              <p>Click to upload room images</p>
              <span>{files?.roomImages?`${files.roomImages.length} selected`:"No files chosen"}</span>
            </div>
          </FG>
        </div>
        <FG label="Videos (max 10)">
          <div className="hm-file-wrap">
            <input type="file" multiple accept="video/*" onChange={e=>setFiles(f=>({...f,videos:e.target.files}))}/>
            <p>Click to upload videos</p>
            <span>{files?.videos?`${files.videos.length} selected`:"No files chosen"}</span>
          </div>
        </FG>

        <div className="hm-sec-title">Room Configuration</div>
        {form.rooms.map((r,i)=><RoomForm key={r._tid||r._id||i} room={r} index={i} onChange={updRoom} onRemove={removeRoom}/>)}
        <button type="button" className="hm-btn-add-room" onClick={addRoom}>
          <Ic.Plus/> Add Room Type
        </button>
      </div>

      <div className="hm-form-actions">
        <button className="hm-btn-cancel" onClick={onClose}>Cancel</button>
        <button className="hm-btn-submit" onClick={onSubmit} disabled={saving}>
          {saving?<><span className="hm-spin"/>{isEdit?"Updating...":"Saving..."}</>:isEdit?"Update Hotel":"Save Hotel"}
        </button>
      </div>
    </>
  );
}

// ─── VIEW MODAL ───────────────────────────────────────────────────────────────
function ViewModal({hotel,onClose}){
  if(!hotel) return null;
  const b=v=>v?<span className="hm-yes">✓ Yes</span>:<span className="hm-no">✗ No</span>;
  const val=v=>(v!==undefined&&v!==null&&v!=="")?v:<span style={{color:"var(--muted)"}}>—</span>;
  const VF=({label,children})=><div className="hm-vf"><label>{label}</label><span>{children}</span></div>;
  const Tags=({arr})=>{
    const items=Array.isArray(arr)?arr:(arr?String(arr).split(",").map(s=>s.trim()).filter(Boolean):[]);
    return items.length?<div className="hm-tags">{items.map((a,i)=><span key={i} className="hm-tag">{a}</span>)}</div>
      :<span style={{color:"var(--muted)",fontSize:13}}>—</span>;
  };

  return(
    <div className="hm-view-overlay open" onClick={e=>e.target.classList.contains("hm-view-overlay")&&onClose()}>
      <div className="hm-view-modal">
        <div className="hm-view-head">
          <h3>{hotel.hotelName}</h3>
          <button className="hm-close" onClick={onClose}><Ic.X/></button>
        </div>
        <div className="hm-view-body">
          <div className="hm-view-section">
            <h4>Basic Information</h4>
            <div className="hm-view-grid">
              <VF label="Hotel Name">{val(hotel.hotelName)}</VF>
              <VF label="Hotel Type">{val(hotel.hotelType)}</VF>
              <VF label="Star Rating">{hotel.starRating?"⭐".repeat(+hotel.starRating):"—"}</VF>
              <VF label="Year Built">{val(hotel.yearBuilt)}</VF>
              <VF label="Price / Night">{hotel.pricePerNight?`₹${Number(hotel.pricePerNight).toLocaleString()}`:"—"}</VF>
              <VF label="Status"><span className={`hm-status hm-status-${hotel.status||"pending"}`}>{hotel.status||"pending"}</span></VF>
              <VF label="Tax">{hotel.taxPercentage?`${hotel.taxPercentage}%`:"—"}</VF>
              <VF label="Service Charge">{hotel.serviceCharge?`₹${hotel.serviceCharge}`:"—"}</VF>
              <VF label="Extra Bed Charge">{hotel.extraBedCharge?`₹${hotel.extraBedCharge}`:"—"}</VF>
              <VF label="GST">{val(hotel.gstNumber)}</VF>
              <VF label="Featured">{b(hotel.featured)}</VF>
              <VF label="Active">{b(hotel.isActive)}</VF>
            </div>
            {hotel.description&&<div className="hm-vf" style={{marginTop:10}}><label>Description</label><span>{hotel.description}</span></div>}
          </div>

          <div className="hm-view-section">
            <h4>Contact</h4>
            <div className="hm-view-grid">
              <VF label="Phone">{val(hotel.phone)}</VF>
              <VF label="Alternate">{val(hotel.alternatePhone)}</VF>
              <VF label="Email">{val(hotel.email)}</VF>
              <VF label="Website">{val(hotel.website)}</VF>
            </div>
          </div>

          <div className="hm-view-section">
            <h4>Location</h4>
            <div className="hm-view-grid">
              <VF label="Country">{val(hotel.country)}</VF>
              <VF label="State">{val(hotel.state)}</VF>
              <VF label="City">{val(hotel.city)}</VF>
              <VF label="Area">{val(hotel.area)}</VF>
              <VF label="Pincode">{val(hotel.pincode)}</VF>
              <VF label="Landmark">{val(hotel.landmark)}</VF>
            </div>
            {hotel.address&&<div className="hm-vf" style={{marginTop:8}}><label>Full Address</label><span>{hotel.address}</span></div>}
            {hotel.virtualTourLink&&<div className="hm-vf" style={{marginTop:8}}><label>Virtual Tour</label><span><a href={hotel.virtualTourLink} target="_blank" rel="noreferrer" style={{color:"var(--accent)"}}>{hotel.virtualTourLink}</a></span></div>}
          </div>

          <div className="hm-view-section">
            <h4>Vendor</h4>
            <div className="hm-view-grid">
              <VF label="Vendor ID">{val(hotel.vendorId)}</VF>
              <VF label="Vendor Name">{val(hotel.vendorName)}</VF>
            </div>
          </div>

          <div className="hm-view-section">
            <h4>Timing & Policies</h4>
            <div className="hm-view-grid">
              <VF label="Check-In">{val(hotel.checkInTime)}</VF>
              <VF label="Check-Out">{val(hotel.checkOutTime)}</VF>
              <VF label="Early Check-In">{b(hotel.earlyCheckInAllowed)}</VF>
              <VF label="Late Check-Out">{b(hotel.lateCheckOutAllowed)}</VF>
              <VF label="Couple Friendly">{b(hotel.coupleFriendly)}</VF>
              <VF label="Local ID Allowed">{b(hotel.localIdAllowed)}</VF>
            </div>
            {hotel.cancellationPolicy&&<div className="hm-vf" style={{marginTop:8}}><label>Cancellation Policy</label><span>{hotel.cancellationPolicy}</span></div>}
            {hotel.refundPolicy&&<div className="hm-vf" style={{marginTop:8}}><label>Refund Policy</label><span>{hotel.refundPolicy}</span></div>}
            {hotel.childPolicy&&<div className="hm-vf" style={{marginTop:8}}><label>Child Policy</label><span>{hotel.childPolicy}</span></div>}
            {hotel.petPolicy&&<div className="hm-vf" style={{marginTop:8}}><label>Pet Policy</label><span>{hotel.petPolicy}</span></div>}
          </div>

          <div className="hm-view-section"><h4>Amenities</h4><Tags arr={hotel.amenities}/></div>
          <div className="hm-view-section"><h4>Payment Methods</h4><Tags arr={hotel.paymentMethods}/></div>
          <div className="hm-view-section"><h4>Property Highlights</h4><Tags arr={hotel.propertyHighlights}/></div>
          <div className="hm-view-section"><h4>Food & Dining</h4><Tags arr={hotel.foodAndDining}/></div>
          <div className="hm-view-section"><h4>Safety & Security</h4><Tags arr={hotel.safetyAndSecurity}/></div>
          <div className="hm-view-section"><h4>Business Facilities</h4><Tags arr={hotel.businessFacilities}/></div>
          <div className="hm-view-section"><h4>Transport Services</h4><Tags arr={hotel.transportServices}/></div>

          {hotel.rooms?.length>0&&(
            <div className="hm-view-section">
              <h4>Rooms ({hotel.rooms.length} type{hotel.rooms.length>1?"s":""})</h4>
              {hotel.rooms.map((r,ri)=>(
                <div key={ri} className="hm-room-view">
                  <h5>Room #{ri+1} — {r.roomType||"Unknown"}{r.roomName?` (${r.roomName})`:""}</h5>
                  <div className="hm-view-grid">
                    <VF label="Base Price">{r.basePrice?`₹${Number(r.basePrice).toLocaleString()}`:"—"}</VF>
                    <VF label="Offer Price">{r.offerPrice?`₹${Number(r.offerPrice).toLocaleString()}`:"—"}</VF>
                    <VF label="Total / Available">{`${r.totalRooms||0} / ${r.availableRooms||0}`}</VF>
                    <VF label="Max Guests">{val(r.maxGuests)}</VF>
                    <VF label="Adults / Children">{`${r.adults||0} / ${r.children||0}`}</VF>
                    <VF label="Room Size">{val(r.roomSize)}</VF>
                    <VF label="Bed Type">{val(r.bedType)}</VF>
                    <VF label="Bed Count">{val(r.bedCount)}</VF>
                    <VF label="View">{val(r.viewType)}</VF>
                    <VF label="Bathroom">{val(r.bathroomType)}</VF>
                    <VF label="Status"><span className={`hm-status ${r.status==="soldout"?"hm-status-rejected":"hm-status-approved"}`}>{r.status||"available"}</span></VF>
                    <VF label="Refundable">{b(r.refundable)}</VF>
                  </div>
                  <div className="hm-view-grid" style={{marginTop:10}}>
                    {ROOM_BOOL_FIELDS.map(({k,l})=><VF key={k} label={l}>{b(r[k])}</VF>)}
                  </div>
                  {r.cancellationPolicy&&<div className="hm-vf" style={{marginTop:8}}><label>Cancellation</label><span>{r.cancellationPolicy}</span></div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── TOAST ───────────────────────────────────────────────────────────────────
function Toast({msg,type}){
  return <div className={`hm-toast ${type} ${msg?"show":""}`}>{msg}</div>;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function HotelManagement(){
  useEffect(()=>{injectStyles();},[]);

  const [hotels,setHotels]=useState([]);
  const [loading,setLoading]=useState(true);
  const [panelOpen,setPanelOpen]=useState(false);
  const [editId,setEditId]=useState(null);
  const [form,setForm]=useState(defHotel());
  const [files,setFiles]=useState({});
  const [saving,setSaving]=useState(false);
  const [viewHotel,setViewHotel]=useState(null);
  const [search,setSearch]=useState("");
  const [toast,setToast]=useState({msg:"",type:""});
  const [actL,setActL]=useState({});

  const showToast=(msg,type="success")=>{
    setToast({msg,type});
    setTimeout(()=>setToast({msg:"",type:""}),3500);
  };

  const fetchHotels=useCallback(async()=>{
    setLoading(true);
    try{
      const data=await api.getAll();
      setHotels(Array.isArray(data)?data:[]);
    }catch{ showToast("Failed to fetch hotels","error"); }
    finally{ setLoading(false); }
  },[]);

  useEffect(()=>{ fetchHotels(); },[fetchHotels]);

  const openAdd=()=>{ setForm(defHotel()); setFiles({}); setEditId(null); setPanelOpen(true); };

  const openEdit=(h)=>{
    setForm({
      ...defHotel(),...h,
      propertyHighlights:Array.isArray(h.propertyHighlights)?h.propertyHighlights.join(", "):h.propertyHighlights||"",
      foodAndDining:Array.isArray(h.foodAndDining)?h.foodAndDining.join(", "):h.foodAndDining||"",
      safetyAndSecurity:Array.isArray(h.safetyAndSecurity)?h.safetyAndSecurity.join(", "):h.safetyAndSecurity||"",
      businessFacilities:Array.isArray(h.businessFacilities)?h.businessFacilities.join(", "):h.businessFacilities||"",
      transportServices:Array.isArray(h.transportServices)?h.transportServices.join(", "):h.transportServices||"",
      rooms:(h.rooms||[]).map(r=>({...r,_tid:r._id||Date.now()+Math.random()})),
      latitude:h.location?.coordinates?.[1]||h.latitude||"",
      longitude:h.location?.coordinates?.[0]||h.longitude||"",
    });
    setFiles({}); setEditId(h._id); setPanelOpen(true);
  };

  const closePanel=()=>{ setPanelOpen(false); setEditId(null); setFiles({}); };

  const handleSubmit=async()=>{
    if(!form.hotelName.trim()){ showToast("Hotel name is required!","error"); return; }
    setSaving(true);
    try{
      const fd=buildFD(form,files);
      if(editId){ await api.update(editId,fd); showToast("Hotel updated successfully!"); }
      else{ await api.add(fd); showToast("Hotel added successfully!"); }
      closePanel(); fetchHotels();
    }catch{ showToast("Something went wrong!","error"); }
    finally{ setSaving(false); }
  };

  const handleDelete=async(h)=>{
    if(!confirm(`Delete "${h.hotelName}"? Cannot be undone.`)) return;
    setActL(p=>({...p,[h._id+"_d"]:true}));
    try{ await api.delete(h._id); showToast("Hotel deleted."); fetchHotels(); }
    catch{ showToast("Delete failed!","error"); }
    finally{ setActL(p=>({...p,[h._id+"_d"]:false})); }
  };

  const handleApprove=async(h)=>{
    setActL(p=>({...p,[h._id+"_a"]:true}));
    try{
      await api.approve(h._id);
      showToast(`"${h.hotelName}" approved! Vendor can now add properties.`,"success");
      fetchHotels();
    }catch{ showToast("Approve failed!","error"); }
    finally{ setActL(p=>({...p,[h._id+"_a"]:false})); }
  };

  const handleReject=async(h)=>{
    if(!confirm(`Reject "${h.hotelName}"? Vendor won't be able to add properties.`)) return;
    setActL(p=>({...p,[h._id+"_r"]:true}));
    try{ await api.reject(h._id); showToast(`"${h.hotelName}" rejected.`,"info"); fetchHotels(); }
    catch{ showToast("Reject failed!","error"); }
    finally{ setActL(p=>({...p,[h._id+"_r"]:false})); }
  };

  const filtered=hotels.filter(h=>
    [h.hotelName,h.city,h.state,h.vendorName].some(f=>(f||"").toLowerCase().includes(search.toLowerCase()))
  );

  const stats={
    total:hotels.length,
    approved:hotels.filter(h=>h.status==="approved").length,
    pending:hotels.filter(h=>h.status==="pending").length,
    rejected:hotels.filter(h=>h.status==="rejected").length,
  };

  return(
    <div className="hm-root">
      <div className="hm-page">

        {/* HEADER */}
        <div className="hm-header">
          <div>
            <h2>Hotel Management</h2>
            <p>Manage all properties, approvals & listings</p>
          </div>
          <div className="hm-hbtns">
            <button className="hm-btn-ref" onClick={fetchHotels}><Ic.Refresh/> Refresh</button>
            <button className="hm-btn-add" onClick={openAdd}><Ic.Plus/> Add Hotel</button>
          </div>
        </div>

        {/* STATS */}
        <div className="hm-stats">
          <div className="hm-stat"><div className="lbl">Total Hotels</div><div className="val">{stats.total}</div><div className="bdg bdg-blue">All Properties</div></div>
          <div className="hm-stat"><div className="lbl">Approved</div><div className="val">{stats.approved}</div><div className="bdg bdg-green">Active</div></div>
          <div className="hm-stat"><div className="lbl">Pending</div><div className="val">{stats.pending}</div><div className="bdg bdg-amber">Review</div></div>
          <div className="hm-stat"><div className="lbl">Rejected</div><div className="val">{stats.rejected}</div><div className="bdg bdg-red">Inactive</div></div>
        </div>

        {/* TABLE */}
        <div className="hm-card">
          <div className="hm-card-top">
            <h3>All Hotels</h3>
            <div className="hm-search">
              <Ic.Search/>
              <input placeholder="Search by name, city, vendor..." value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
          </div>
          <table className="hm-table">
            <thead>
              <tr>
                <th>#</th><th>Hotel</th><th>Location</th><th>Type</th>
                <th>Star</th><th>Price/Night</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading?(
                <tr><td colSpan={8} className="hm-loading-row">Loading hotels from server...</td></tr>
              ):filtered.length===0?(
                <tr><td colSpan={8} className="hm-empty">No hotels found. Click "Add Hotel" to get started.</td></tr>
              ):(
                filtered.map((h,i)=>(
                  <tr key={h._id}>
                    <td style={{color:"var(--muted)"}}>{i+1}</td>
                    <td>
                      <div className="hm-hotel-name">{h.hotelName}</div>
                      <div className="hm-hotel-sub">{h.vendorName||"—"}</div>
                    </td>
                    <td>
                      <div>{h.city||"—"}{h.state?`, ${h.state}`:""}</div>
                      <div style={{fontSize:11,color:"var(--muted)"}}>{h.country||"India"}</div>
                    </td>
                    <td style={{color:"var(--sub)",fontSize:12}}>{h.hotelType||"—"}</td>
                    <td>
                      <div className="hm-rating">
                        <Ic.Star/>
                        <span style={{fontSize:13,marginLeft:2}}>{h.starRating||"—"}</span>
                      </div>
                    </td>
                    <td style={{fontWeight:600}}>{h.pricePerNight?`₹${Number(h.pricePerNight).toLocaleString()}`:"—"}</td>
                    <td><span className={`hm-status hm-status-${h.status||"pending"}`}>{h.status||"pending"}</span></td>
                    <td>
                      <div className="hm-actions">
                        {/* VIEW */}
                        <button className="hm-ibtn view" onClick={()=>setViewHotel(h)}><Ic.Eye/>View</button>

                        {/* EDIT */}
                        <button className="hm-ibtn edit" onClick={()=>openEdit(h)}><Ic.Edit/>Edit</button>

                        {/* APPROVE — only if not already approved */}
                        {h.status!=="approved"&&(
                          <button className="hm-ibtn approve" onClick={()=>handleApprove(h)} disabled={!!actL[h._id+"_a"]}>
                            <Ic.Check/>{actL[h._id+"_a"]?"...":"Approve"}
                          </button>
                        )}

                        {/* REJECT — only if not already rejected */}
                        {h.status!=="rejected"&&(
                          <button className="hm-ibtn reject" onClick={()=>handleReject(h)} disabled={!!actL[h._id+"_r"]}>
                            <Ic.Ban/>{actL[h._id+"_r"]?"...":"Reject"}
                          </button>
                        )}

                        {/* DELETE */}
                        <button className="hm-ibtn del" onClick={()=>handleDelete(h)} disabled={!!actL[h._id+"_d"]}>
                          <Ic.Trash/>{actL[h._id+"_d"]?"...":"Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SLIDE PANEL */}
      <div className={`hm-overlay ${panelOpen?"open":""}`} onClick={e=>e.target.classList.contains("hm-overlay")&&closePanel()}>
        <div className="hm-panel">
          <div className="hm-panel-head">
            <div>
              <h3>{editId?"Edit Hotel":"Add New Hotel"}</h3>
              <p>{editId?`Editing: ${form.hotelName}`:"Fill in all hotel details below"}</p>
            </div>
            <button className="hm-close" onClick={closePanel}><Ic.X/></button>
          </div>
          {panelOpen&&(
            <HotelForm
              form={form} setForm={setForm}
              onSubmit={handleSubmit} onClose={closePanel}
              isEdit={!!editId} saving={saving}
              files={files} setFiles={setFiles}
            />
          )}
        </div>
      </div>

      {/* VIEW MODAL */}
      {viewHotel&&<ViewModal hotel={viewHotel} onClose={()=>setViewHotel(null)}/>}

      {/* TOAST */}
      <Toast msg={toast.msg} type={toast.type}/>
    </div>
  );
}