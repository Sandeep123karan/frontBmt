// import { useState, useEffect } from "react";

// const API = "http://localhost:9000/api/bus";

// const STYLES = `
//   @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//   :root {
//     --primary: #1a56db;
//     --primary-dark: #1e429f;
//     --success: #057a55;
//     --success-bg: #def7ec;
//     --danger: #c81e1e;
//     --danger-bg: #fde8e8;
//     --warning: #b45309;
//     --warning-bg: #fef3c7;
//     --g50:#f9fafb; --g100:#f3f4f6; --g200:#e5e7eb; --g300:#d1d5db;
//     --g400:#9ca3af; --g500:#6b7280; --g600:#4b5563; --g700:#374151;
//     --g800:#1f2937; --g900:#111827; --white:#fff;
//     --shadow-sm:0 1px 2px rgba(0,0,0,.06);
//     --shadow:0 1px 3px rgba(0,0,0,.1),0 1px 2px rgba(0,0,0,.06);
//     --shadow-lg:0 10px 15px rgba(0,0,0,.1),0 4px 6px rgba(0,0,0,.05);
//   }
//   html { font-size: 14px; }
//   body { font-family:'Inter',sans-serif; background:#eef0f5; color:var(--g900); min-height:100vh; }

//   /* TOPBAR */
//   .topbar {
//     background:var(--white); border-bottom:1px solid var(--g200);
//     height:56px; display:flex; align-items:center; justify-content:space-between;
//     padding:0 28px; position:sticky; top:0; z-index:100; box-shadow:var(--shadow-sm);
//   }
//   .logo { font-weight:800; font-size:1.1rem; color:var(--primary); display:flex; align-items:center; gap:9px; }
//   .logo-box { width:28px; height:28px; background:var(--primary); border-radius:7px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:.9rem; }
//   .topbar-r { display:flex; align-items:center; gap:10px; font-size:.8rem; color:var(--g500); }
//   .chip { background:#e0e7ff; color:#3730a3; font-weight:700; font-size:.68rem; padding:3px 10px; border-radius:20px; letter-spacing:.5px; }

//   /* PAGE */
//   .page { max-width:1480px; margin:0 auto; padding:28px 24px; }
//   .pg-head { margin-bottom:22px; }
//   .pg-head h1 { font-size:1.4rem; font-weight:800; color:var(--g900); }
//   .pg-head p { color:var(--g500); font-size:.82rem; margin-top:3px; }

//   /* STATS */
//   .stats { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:22px; }
//   .stat { background:var(--white); border:1px solid var(--g200); border-radius:12px; padding:16px 18px; box-shadow:var(--shadow-sm); display:flex; align-items:center; justify-content:space-between; }
//   .stat-n { font-size:2rem; font-weight:800; line-height:1; }
//   .stat-l { font-size:.71rem; color:var(--g500); font-weight:500; margin-top:3px; text-transform:uppercase; letter-spacing:.5px; }
//   .stat-ic { width:44px; height:44px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:1.3rem; flex-shrink:0; }

//   /* ADD BUS CARD */
//   .add-card { background:var(--white); border:1px solid var(--g200); border-radius:12px; box-shadow:var(--shadow-sm); margin-bottom:20px; overflow:hidden; }
//   .add-card-header {
//     padding:15px 20px;
//     display:flex; align-items:center; justify-content:space-between;
//     cursor:pointer;
//     user-select:none;
//     border-bottom:1px solid transparent;
//     transition:background .15s, border-color .15s;
//   }
//   .add-card-header.open {
//     border-bottom-color:var(--g200);
//     background:var(--g50);
//   }
//   .add-card-header:hover { background:var(--g50); }
//   .add-card-header-left { display:flex; align-items:center; gap:10px; }
//   .add-card-title { font-weight:700; font-size:.95rem; color:var(--g800); }
//   .add-card-sub { font-size:.75rem; color:var(--g400); margin-top:1px; }
//   .add-card-arrow {
//     width:28px; height:28px; border-radius:6px; background:var(--g100);
//     display:flex; align-items:center; justify-content:center;
//     font-size:.75rem; color:var(--g500); transition:transform .25s, background .15s;
//     flex-shrink:0;
//   }
//   .add-card-arrow.open { transform:rotate(180deg); background:#e0e7ff; color:var(--primary); }

//   .form-collapse {
//     max-height:0; overflow:hidden;
//     transition:max-height .35s cubic-bezier(.4,0,.2,1);
//   }
//   .form-collapse.open { max-height:3000px; }

//   .card-body { padding:22px 24px; }

//   /* FORM */
//   .sec { margin-bottom:22px; }
//   .sec-t {
//     font-size:.68rem; font-weight:700; text-transform:uppercase; letter-spacing:.8px;
//     color:var(--g500); margin-bottom:12px; padding-bottom:9px;
//     border-bottom:1px solid var(--g200); display:flex; align-items:center; gap:7px;
//   }
//   .frow { display:grid; gap:12px; margin-bottom:0; }
//   .c2{grid-template-columns:repeat(2,1fr);}
//   .c3{grid-template-columns:repeat(3,1fr);}
//   .c4{grid-template-columns:repeat(4,1fr);}
//   .c5{grid-template-columns:repeat(5,1fr);}
//   .s2{grid-column:span 2;} .s3{grid-column:span 3;} .s4{grid-column:span 4;}

//   .f { display:flex; flex-direction:column; gap:4px; }
//   .f label { font-size:.73rem; font-weight:600; color:var(--g700); }
//   .f label em { color:#ef4444; font-style:normal; margin-left:2px; }
//   .f input, .f select, .f textarea {
//     width:100%; border:1.5px solid var(--g300); border-radius:6px;
//     padding:8px 10px; font-family:'Inter',sans-serif; font-size:.84rem;
//     color:var(--g900); background:var(--white); outline:none;
//     transition:border-color .15s, box-shadow .15s;
//   }
//   .f input::placeholder,.f textarea::placeholder { color:var(--g400); }
//   .f input:focus,.f select:focus,.f textarea:focus {
//     border-color:var(--primary); box-shadow:0 0 0 3px rgba(26,86,219,.1);
//   }
//   .f textarea { resize:vertical; min-height:68px; }
//   .f input[type="file"] { padding:5px 10px; cursor:pointer; background:var(--g50); color:var(--g600); }
//   .file-hint { font-size:.71rem; color:var(--g400); margin-top:3px; }
//   .form-acts { display:flex; justify-content:flex-end; gap:8px; padding-top:18px; border-top:1px solid var(--g200); margin-top:20px; }

//   /* BUSES TABLE CARD */
//   .tbl-card { background:var(--white); border:1px solid var(--g200); border-radius:12px; box-shadow:var(--shadow-sm); overflow:hidden; }

//   /* SEARCH BAR SECTION */
//   .tbl-topbar {
//     padding:14px 20px;
//     border-bottom:1px solid var(--g200);
//     background:var(--g50);
//     display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;
//   }
//   .tbl-topbar-left { font-weight:700; font-size:.92rem; color:var(--g800); display:flex; align-items:center; gap:7px; }
//   .tbl-topbar-right { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
//   .srch {
//     border:1.5px solid var(--g300); border-radius:6px;
//     padding:7px 11px 7px 32px; font-family:'Inter',sans-serif; font-size:.82rem;
//     outline:none; width:230px; background:var(--white)
//     url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.5'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E") no-repeat 10px center;
//     transition:border-color .15s;
//   }
//   .srch:focus { border-color:var(--primary); }
//   .sel { border:1.5px solid var(--g300); border-radius:6px; padding:7px 10px; font-family:'Inter',sans-serif; font-size:.82rem; color:var(--g700); background:var(--white); outline:none; cursor:pointer; transition:border-color .15s; }
//   .sel:focus { border-color:var(--primary); }

//   /* BUTTONS */
//   .btn { display:inline-flex; align-items:center; gap:5px; padding:8px 16px; border-radius:6px; font-family:'Inter',sans-serif; font-weight:600; font-size:.8rem; cursor:pointer; transition:all .15s; border:1px solid transparent; white-space:nowrap; line-height:1; }
//   .btn:disabled { opacity:.5; cursor:not-allowed; pointer-events:none; }
//   .btn-primary { background:var(--primary); color:#fff; }
//   .btn-primary:hover { background:var(--primary-dark); }
//   .btn-light { background:var(--white); color:var(--g700); border-color:var(--g300); }
//   .btn-light:hover { background:var(--g50); }
//   .btn-success { background:var(--success); color:#fff; }
//   .btn-success:hover { background:#046c4e; }
//   .btn-danger { background:#e02424; color:#fff; }
//   .btn-danger:hover { background:var(--danger); }
//   .btn-warn { background:#d97706; color:#fff; }
//   .btn-warn:hover { background:var(--warning); }
//   .btn-sm { padding:6px 13px; font-size:.78rem; }
//   .btn-xs { padding:4px 9px; font-size:.72rem; border-radius:5px; }

//   /* TABLE */
//   .tbl-wrap { overflow-x:auto; }
//   table { width:100%; border-collapse:collapse; }
//   thead th { background:var(--g50); padding:10px 13px; text-align:left; font-size:.68rem; font-weight:700; text-transform:uppercase; letter-spacing:.6px; color:var(--g500); border-bottom:1px solid var(--g200); white-space:nowrap; }
//   tbody td { padding:11px 13px; border-bottom:1px solid var(--g100); font-size:.83rem; vertical-align:middle; }
//   tbody tr:last-child td { border-bottom:none; }
//   tbody tr:hover { background:#f5f8ff; }

//   /* BADGES */
//   .badge { display:inline-flex; align-items:center; padding:2px 8px; border-radius:20px; font-size:.67rem; font-weight:700; letter-spacing:.3px; white-space:nowrap; }
//   .b-approved { background:var(--success-bg); color:var(--success); }
//   .b-pending { background:var(--warning-bg); color:var(--warning); }
//   .b-rejected { background:var(--danger-bg); color:var(--danger); }
//   .b-blue { background:#e0e7ff; color:#3730a3; }
//   .b-gray { background:var(--g100); color:var(--g600); }
//   .b-on-time { background:var(--success-bg); color:var(--success); }
//   .b-delayed { background:var(--warning-bg); color:var(--warning); }
//   .b-cancelled { background:var(--danger-bg); color:var(--danger); }

//   /* BUS THUMB */
//   .thumb { width:36px; height:36px; border-radius:6px; object-fit:cover; border:1px solid var(--g200); display:block; }
//   .thumb-ph { width:36px; height:36px; border-radius:6px; background:var(--g100); border:1px dashed var(--g300); display:flex; align-items:center; justify-content:center; font-size:1rem; color:var(--g400); }

//   .acts { display:flex; align-items:center; gap:4px; flex-wrap:nowrap; }

//   .tbl-foot { padding:9px 16px; border-top:1px solid var(--g200); background:var(--g50); display:flex; justify-content:space-between; align-items:center; font-size:.73rem; color:var(--g500); }

//   /* EMPTY */
//   .empty-cell { padding:52px 20px; text-align:center; }
//   .empty-cell .ei { font-size:2.5rem; margin-bottom:8px; }
//   .empty-cell h3 { font-size:.9rem; font-weight:700; color:var(--g700); margin-bottom:3px; }
//   .empty-cell p { font-size:.78rem; color:var(--g400); }
//   .spin { display:inline-block; animation:spin 1s linear infinite; }
//   @keyframes spin { to{transform:rotate(360deg);} }

//   /* MODAL 
//   .ov { position:fixed; inset:0; background:rgba(0,0,0,.45); z-index:200; display:flex; align-items:center; justify-content:center; padding:16px; }
//   .modal { background:var(--white); border-radius:14px; box-shadow:var(--shadow-lg); width:100%; overflow:hidden; }
//   .modal-sm { max-width:400px; }
//   .modal-lg { max-width:860px; max-height:90vh; display:flex; flex-direction:column;  }
//   .modal-hd { padding:16px 20px; border-bottom:1px solid var(--g200); display:flex; align-items:center; justify-content:space-between; flex-shrink:0; background:var(--g50); }
//   .modal-hd h2 { font-size:.92rem; font-weight:700; color:var(--g800); }
//   .modal-body { padding:20px; overflow-y:auto; }
//   .modal-ft { padding:12px 20px; border-top:1px solid var(--g200); display:flex; justify-content:flex-end; gap:8px; background:var(--g50); flex-shrink:0; }
//   .x-btn { background:none; border:none; width:28px; height:28px; border-radius:6px; cursor:pointer; font-size:1rem; color:var(--g400); display:flex; align-items:center; justify-content:center; transition:background .15s; }
//   .x-btn:hover { background:var(--g200); color:var(--g700); }*/

//   .ov{
//   position: fixed;
//   inset: 0;
//   background: rgba(0,0,0,.45);
//   z-index: 200;

//   /* CENTER PERFECTLY */
//   display: flex;
//   justify-content: center;
//   align-items: center;

//   padding: 16px;

//   /* important for full height */
//   min-height: 100vh;
// }

// /* modal base */
// .modal{
//   background: var(--white);
//   border-radius: 14px;
//   box-shadow: var(--shadow-lg);
//   width: 100%;
//   margin: auto;              /* extra safety center */
//   overflow: hidden;
// }

// /* small modal */
// .modal-sm{
//   max-width: 400px;
// }

// /* large modal */
// .modal-lg{
//   max-width: 860px;
//   max-height: 90vh;
//   display: flex;
//   flex-direction: column;
// }


//   /* CONFIRM */
//   .cf-ico { font-size:2.5rem; text-align:center; margin:4px 0 12px; }
//   .cf-t { font-size:.98rem; font-weight:700; text-align:center; margin-bottom:6px; }
//   .cf-m { font-size:.82rem; color:var(--g500); text-align:center; line-height:1.55; }

//   /* TOAST */
//   .toasts { position:fixed; bottom:18px; right:18px; z-index:999; display:flex; flex-direction:column; gap:7px; }
//   .toast { background:var(--g900); color:#fff; padding:10px 16px; border-radius:8px; font-size:.81rem; font-weight:500; box-shadow:var(--shadow-lg); display:flex; align-items:center; gap:9px; min-width:230px; max-width:320px; animation:ti .2s ease; border-left:4px solid var(--g600); }
//   .t-success { border-left-color:#057a55; }
//   .t-error { border-left-color:#e02424; }
//   .t-warn { border-left-color:#d97706; }
//   @keyframes ti { from{transform:translateX(50px);opacity:0;} to{transform:translateX(0);opacity:1;} }

//   /* RESPONSIVE */
//   @media(max-width:1100px) { .stats{grid-template-columns:repeat(2,1fr);} }
//   @media(max-width:768px) {
//     .page{padding:14px 10px;}
//     .c3,.c4,.c5{grid-template-columns:repeat(2,1fr);}
//     .s3,.s4{grid-column:span 2;}
//     .stats{grid-template-columns:repeat(2,1fr); gap:10px;}
//     .srch{width:160px;}
//   }
//   @media(max-width:480px) {
//     .c2,.c3,.c4,.c5{grid-template-columns:1fr;}
//     .s2,.s3,.s4{grid-column:span 1;}
//     .srch{width:100%;}
//     .tbl-topbar{flex-direction:column; align-items:flex-start;}
//   }
// `;

// /* ─── TOAST ─── */
// function useToast() {
//   const [list, setList] = useState([]);
//   const push = (msg, cls = "") => {
//     const id = Date.now();
//     setList(p => [...p, { id, msg, cls }]);
//     setTimeout(() => setList(p => p.filter(t => t.id !== id)), 3400);
//   };
//   return { list, success: m => push(m,"t-success"), error: m => push(m,"t-error"), warn: m => push(m,"t-warn"), info: m => push(m) };
// }

// /* ─── BLANK FORM ─── */
// const BLANK = {
//   busName:"", busType:"AC Seater", operatorName:"", busNumber:"", busModel:"",
//   seatLayoutType:"2+2", fromCity:"", toCity:"", journeyDate:"", duration:"",
//   departureTime:"", arrivalTime:"", basePrice:"", offerPrice:"", tax:"",
//   discountPercent:"", totalSeats:"40", amenities:"", boardingPoints:"",
//   droppingPoints:"", busFeatures:"", cancellationPolicy:"", refundPolicy:"",
//   vendorId:"", vendorName:"", addedBy:"admin",
// };

// /* ─── FIELD ─── */
// const F = ({ label, req, children }) => (
//   <div className="f">
//     <label>{label}{req && <em>*</em>}</label>
//     {children}
//   </div>
// );

// /* ═══════════════════
//    ADD BUS FORM
// ═══════════════════ */
// function AddBusForm({ onAdded, toast }) {
//   const [d, setD] = useState(BLANK);
//   const [files, setFiles] = useState([]);
//   const [open, setOpen] = useState(false); // starts collapsed
//   const [busy, setBusy] = useState(false);
//   const u = k => e => setD(p => ({ ...p, [k]: e.target.value }));

//   const submit = async () => {
//     if (!d.busName.trim()) return toast.error("Bus name is required");
//     if (!d.fromCity.trim() || !d.toCity.trim()) return toast.error("From & To city required");
//     setBusy(true);
//     try {
//       const fd = new FormData();
//       Object.entries(d).forEach(([k,v]) => fd.append(k, v));
//       files.forEach(f => fd.append("busImages", f));
//       const res = await fetch(`${API}/add`, { method:"POST", body:fd });
//       const json = await res.json();
//       if (json.success) {
//         toast.success("Bus added successfully!");
//         setD(BLANK); setFiles([]);
//         setOpen(false); // collapse after add
//         onAdded();
//       } else toast.error(json.error || "Failed to add bus");
//     } catch (e) { toast.error("Network error: " + e.message); }
//     setBusy(false);
//   };

//   const BT = ["AC Seater","AC Sleeper","Non-AC Seater","Non-AC Sleeper","Volvo AC","Semi Sleeper","Luxury"];
//   const SL = ["2+2","2+1","1+1 Sleeper","2+1 Sleeper"];

//   return (
//     <div className="add-card">
//       {/* CLICKABLE HEADER */}
//       <div className={`add-card-header ${open ? "open" : ""}`} onClick={() => setOpen(o => !o)}>
//         <div className="add-card-header-left">
//           <span style={{fontSize:"1.2rem"}}>🚌</span>
//           <div>
//             <div className="add-card-title">Add New Bus</div>
//             <div className="add-card-sub">{open ? "Click to collapse form" : "Click to expand and fill bus details"}</div>
//           </div>
//         </div>
//         <div className={`add-card-arrow ${open ? "open" : ""}`}>▼</div>
//       </div>

//       {/* COLLAPSIBLE FORM */}
//       <div className={`form-collapse ${open ? "open" : ""}`}>
//         <div className="card-body">

//           <div className="sec">
//             <div className="sec-t">📋 Basic Information</div>
//             <div className="frow c4" style={{marginBottom:12}}>
//               <F label="Bus Name" req><input value={d.busName} onChange={u("busName")} placeholder="e.g. Shivshahi Express" /></F>
//               <F label="Bus Type"><select value={d.busType} onChange={u("busType")}>{BT.map(t=><option key={t}>{t}</option>)}</select></F>
//               <F label="Operator Name"><input value={d.operatorName} onChange={u("operatorName")} placeholder="MSRTC, RedBus…" /></F>
//               <F label="Bus Number"><input value={d.busNumber} onChange={u("busNumber")} placeholder="MH-12-AB-1234" /></F>
//             </div>
//             <div className="frow c4">
//               <F label="Bus Model"><input value={d.busModel} onChange={u("busModel")} placeholder="Volvo, BharatBenz" /></F>
//               <F label="Seat Layout"><select value={d.seatLayoutType} onChange={u("seatLayoutType")}>{SL.map(t=><option key={t}>{t}</option>)}</select></F>
//               <F label="Total Seats"><input type="number" value={d.totalSeats} onChange={u("totalSeats")} min="1" /></F>
//               <F label="Added By"><select value={d.addedBy} onChange={u("addedBy")}><option value="admin">Admin</option><option value="vendor">Vendor</option></select></F>
//             </div>
//           </div>

//           <div className="sec">
//             <div className="sec-t">🗺️ Route & Schedule</div>
//             <div className="frow c5" style={{marginBottom:12}}>
//               <F label="From City" req><input value={d.fromCity} onChange={u("fromCity")} placeholder="Mumbai" /></F>
//               <F label="To City" req><input value={d.toCity} onChange={u("toCity")} placeholder="Pune" /></F>
//               <F label="Journey Date"><input type="date" value={d.journeyDate} onChange={u("journeyDate")} /></F>
//               <F label="Departure Time"><input type="time" value={d.departureTime} onChange={u("departureTime")} /></F>
//               <F label="Arrival Time"><input type="time" value={d.arrivalTime} onChange={u("arrivalTime")} /></F>
//             </div>
//             <div className="frow c3">
//               <F label="Duration"><input value={d.duration} onChange={u("duration")} placeholder="e.g. 4h 30m" /></F>
//               <F label="Boarding Points (comma)"><input value={d.boardingPoints} onChange={u("boardingPoints")} placeholder="Dadar, Thane, Kalyan" /></F>
//               <F label="Dropping Points (comma)"><input value={d.droppingPoints} onChange={u("droppingPoints")} placeholder="Shivajinagar, Kothrud" /></F>
//             </div>
//           </div>

//           <div className="sec">
//             <div className="sec-t">💰 Pricing</div>
//             <div className="frow c4">
//               <F label="Base Price (₹)"><input type="number" value={d.basePrice} onChange={u("basePrice")} placeholder="500" /></F>
//               <F label="Offer Price (₹)"><input type="number" value={d.offerPrice} onChange={u("offerPrice")} placeholder="450" /></F>
//               <F label="Tax (%)"><input type="number" value={d.tax} onChange={u("tax")} placeholder="5" /></F>
//               <F label="Discount (%)"><input type="number" value={d.discountPercent} onChange={u("discountPercent")} placeholder="10" /></F>
//             </div>
//           </div>

//           <div className="sec">
//             <div className="sec-t">👤 Vendor Details</div>
//             <div className="frow c2">
//               <F label="Vendor ID"><input value={d.vendorId} onChange={u("vendorId")} placeholder="vendor_001" /></F>
//               <F label="Vendor Name"><input value={d.vendorName} onChange={u("vendorName")} placeholder="Rahul Travels" /></F>
//             </div>
//           </div>

//           <div className="sec">
//             <div className="sec-t">⭐ Amenities & Features</div>
//             <div className="frow c2">
//               <F label="Amenities (comma separated)"><input value={d.amenities} onChange={u("amenities")} placeholder="WiFi, Charging Point, Blanket, Reading Light" /></F>
//               <F label="Bus Features (comma separated)"><input value={d.busFeatures} onChange={u("busFeatures")} placeholder="Water Bottle, TV, Pillow, AC" /></F>
//             </div>
//           </div>

//           <div className="sec">
//             <div className="sec-t">📄 Policies & Images</div>
//             <div className="frow c2" style={{marginBottom:12}}>
//               <F label="Cancellation Policy">
//                 <textarea value={d.cancellationPolicy} onChange={u("cancellationPolicy")} placeholder="e.g. Free cancellation 24 hours before departure…" />
//               </F>
//               <F label="Refund Policy">
//                 <textarea value={d.refundPolicy} onChange={u("refundPolicy")} placeholder="e.g. Refund in 5-7 working days…" />
//               </F>
//             </div>
//             <div className="frow" style={{gridTemplateColumns:"1fr"}}>
//               <F label="Bus Images (max 10)">
//                 <input type="file" multiple accept="image/*" onChange={e => setFiles(Array.from(e.target.files))} />
//                 {files.length > 0 && <div className="file-hint">{files.length} file(s): {files.map(f=>f.name).join(", ")}</div>}
//               </F>
//             </div>
//           </div>

//           <div className="form-acts">
//             <button className="btn btn-light" onClick={() => { setD(BLANK); setFiles([]); }}>Reset</button>
//             <button className="btn btn-primary" onClick={submit} disabled={busy}>
//               {busy ? <><span className="spin">↻</span> Adding…</> : "➕ Add Bus"}
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// /* ═══════════════════
//    EDIT MODAL
// ═══════════════════ */
// function EditModal({ bus, onClose, onSaved, toast }) {
//   const [d, setD] = useState({
//     busName:bus.busName||"", busType:bus.busType||"AC Seater",
//     operatorName:bus.operatorName||"", busNumber:bus.busNumber||"",
//     busModel:bus.busModel||"", seatLayoutType:bus.seatLayoutType||"2+2",
//     fromCity:bus.fromCity||"", toCity:bus.toCity||"",
//     journeyDate:bus.journeyDate||"", duration:bus.duration||"",
//     departureTime:bus.departureTime||"", arrivalTime:bus.arrivalTime||"",
//     basePrice:bus.basePrice||"", offerPrice:bus.offerPrice||"",
//     tax:bus.tax||"", discountPercent:bus.discountPercent||"",
//     totalSeats:bus.totalSeats||40,
//     amenities:(bus.amenities||[]).join(", "),
//     boardingPoints:(bus.boardingPoints||[]).join(", "),
//     droppingPoints:(bus.droppingPoints||[]).join(", "),
//     busFeatures:(bus.busFeatures||[]).join(", "),
//     cancellationPolicy:bus.cancellationPolicy||"",
//     refundPolicy:bus.refundPolicy||"",
//     vendorId:bus.vendorId||"", vendorName:bus.vendorName||"",
//     addedBy:bus.addedBy||"admin",
//   });
//   const [busy, setBusy] = useState(false);
//   const u = k => e => setD(p => ({ ...p, [k]: e.target.value }));
//   const BT = ["AC Seater","AC Sleeper","Non-AC Seater","Non-AC Sleeper","Volvo AC","Semi Sleeper","Luxury"];

//   const save = async () => {
//     if (!d.busName.trim()) return toast.error("Bus name is required");
//     setBusy(true);
//     try {
//       const fd = new FormData();
//       Object.entries(d).forEach(([k,v]) => fd.append(k, v));
//       const res = await fetch(`${API}/update/${bus._id}`, { method:"PUT", body:fd });
//       const json = await res.json();
//       if (json.success) { toast.success("Bus updated!"); onSaved(); onClose(); }
//       else toast.error(json.error || "Update failed");
//     } catch (e) { toast.error("Error: " + e.message); }
//     setBusy(false);
//   };

//   return (
//     <div className="ov" onClick={onClose}>
//       <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
//         <div className="modal-hd">
//           <h2>✏️ Edit Bus — {bus.busName}</h2>
//           <button className="x-btn" onClick={onClose}>✕</button>
//         </div>
//         <div className="modal-body">
//           <div className="sec-t" style={{fontSize:".68rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".8px",color:"var(--g500)",paddingBottom:"9px",borderBottom:"1px solid var(--g200)",marginBottom:"12px"}}>Basic Info</div>
//           <div className="frow c3" style={{marginBottom:12}}>
//             <F label="Bus Name" req><input value={d.busName} onChange={u("busName")} /></F>
//             <F label="Bus Type"><select value={d.busType} onChange={u("busType")}>{BT.map(t=><option key={t}>{t}</option>)}</select></F>
//             <F label="Operator"><input value={d.operatorName} onChange={u("operatorName")} /></F>
//           </div>
//           <div className="frow c3" style={{marginBottom:16}}>
//             <F label="Bus Number"><input value={d.busNumber} onChange={u("busNumber")} /></F>
//             <F label="Bus Model"><input value={d.busModel} onChange={u("busModel")} /></F>
//             <F label="Total Seats"><input type="number" value={d.totalSeats} onChange={u("totalSeats")} /></F>
//           </div>
//           <div className="sec-t" style={{fontSize:".68rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".8px",color:"var(--g500)",paddingBottom:"9px",borderBottom:"1px solid var(--g200)",marginBottom:"12px"}}>Route & Schedule</div>
//           <div className="frow c3" style={{marginBottom:12}}>
//             <F label="From City" req><input value={d.fromCity} onChange={u("fromCity")} /></F>
//             <F label="To City" req><input value={d.toCity} onChange={u("toCity")} /></F>
//             <F label="Journey Date"><input type="date" value={d.journeyDate} onChange={u("journeyDate")} /></F>
//           </div>
//           <div className="frow c3" style={{marginBottom:16}}>
//             <F label="Departure"><input type="time" value={d.departureTime} onChange={u("departureTime")} /></F>
//             <F label="Arrival"><input type="time" value={d.arrivalTime} onChange={u("arrivalTime")} /></F>
//             <F label="Duration"><input value={d.duration} onChange={u("duration")} placeholder="4h 30m" /></F>
//           </div>
//           <div className="sec-t" style={{fontSize:".68rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".8px",color:"var(--g500)",paddingBottom:"9px",borderBottom:"1px solid var(--g200)",marginBottom:"12px"}}>Pricing</div>
//           <div className="frow c4" style={{marginBottom:16}}>
//             <F label="Base Price ₹"><input type="number" value={d.basePrice} onChange={u("basePrice")} /></F>
//             <F label="Offer Price ₹"><input type="number" value={d.offerPrice} onChange={u("offerPrice")} /></F>
//             <F label="Tax %"><input type="number" value={d.tax} onChange={u("tax")} /></F>
//             <F label="Discount %"><input type="number" value={d.discountPercent} onChange={u("discountPercent")} /></F>
//           </div>
//           <div className="sec-t" style={{fontSize:".68rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".8px",color:"var(--g500)",paddingBottom:"9px",borderBottom:"1px solid var(--g200)",marginBottom:"12px"}}>Amenities & Stops</div>
//           <div className="frow c2" style={{marginBottom:12}}>
//             <F label="Amenities (comma)"><input value={d.amenities} onChange={u("amenities")} /></F>
//             <F label="Bus Features (comma)"><input value={d.busFeatures} onChange={u("busFeatures")} /></F>
//           </div>
//           <div className="frow c2">
//             <F label="Boarding Points (comma)"><input value={d.boardingPoints} onChange={u("boardingPoints")} /></F>
//             <F label="Dropping Points (comma)"><input value={d.droppingPoints} onChange={u("droppingPoints")} /></F>
//           </div>
//         </div>
//         <div className="modal-ft">
//           <button className="btn btn-light" onClick={onClose}>Cancel</button>
//           <button className="btn btn-primary" onClick={save} disabled={busy}>{busy?"Saving…":"💾 Save Changes"}</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ═══════════════════
//    CONFIRM
// ═══════════════════ */
// function Confirm({ icon, title, msg, onYes, onNo, yesLabel, yesCls }) {
//   return (
//     <div className="ov" onClick={onNo}>
//       <div className="modal modal-sm" onClick={e=>e.stopPropagation()}>
//         <div className="modal-body" style={{padding:"28px 22px 8px"}}>
//           <div className="cf-ico">{icon}</div>
//           <div className="cf-t">{title}</div>
//           <div className="cf-m">{msg}</div>
//         </div>
//         <div className="modal-ft">
//           <button className="btn btn-light" onClick={onNo}>Cancel</button>
//           <button className={`btn ${yesCls}`} onClick={onYes}>{yesLabel}</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ═══════════════════
//    MAIN
// ═══════════════════ */
// export default function AdminBusPanel() {
//   const [buses, setBuses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [srch, setSrch] = useState("");
//   const [stF, setStF] = useState("all");
//   const [editBus, setEditBus] = useState(null);
//   const [confirm, setConfirm] = useState(null);
//   const toast = useToast();

//   const load = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API}/admin/all`);
//       const data = await res.json();
//       setBuses(Array.isArray(data) ? data : []);
//     } catch { toast.error("Failed to load buses"); }
//     setLoading(false);
//   };

//   useEffect(() => { load(); }, []);

//   const filtered = buses.filter(b => {
//     const q = srch.toLowerCase();
//     return (!q || [b.busName,b.busNumber,b.fromCity,b.toCity,b.operatorName].some(v=>v?.toLowerCase().includes(q)))
//       && (stF==="all" || b.status===stF);
//   });

//   const STATS = [
//     {n:buses.length, l:"Total Buses", ic:"🚌", bg:"#e0e7ff", col:"#3730a3"},
//     {n:buses.filter(b=>b.status==="approved").length, l:"Approved", ic:"✅", bg:"#def7ec", col:"#057a55"},
//     {n:buses.filter(b=>b.status==="pending").length, l:"Pending", ic:"⏳", bg:"#fef3c7", col:"#b45309"},
//     {n:buses.filter(b=>b.status==="rejected").length, l:"Rejected", ic:"❌", bg:"#fde8e8", col:"#c81e1e"},
//   ];

//   const doApprove = async (bus) => {
//     try { const r=await fetch(`${API}/approve/${bus._id}`,{method:"PUT"}); const d=await r.json(); d.success?toast.success(`"${bus.busName}" approved!`):toast.error(d.error||"Failed"); load(); } catch { toast.error("Network error"); }
//     setConfirm(null);
//   };
//   const doReject = async (bus) => {
//     try { const r=await fetch(`${API}/reject/${bus._id}`,{method:"PUT"}); const d=await r.json(); d.success?toast.warn(`"${bus.busName}" rejected`):toast.error(d.error||"Failed"); load(); } catch { toast.error("Network error"); }
//     setConfirm(null);
//   };
//   const doDelete = async (bus) => {
//     try { const r=await fetch(`${API}/delete/${bus._id}`,{method:"DELETE"}); const d=await r.json(); d.success?toast.info(`"${bus.busName}" deleted`):toast.error(d.error||"Failed"); load(); } catch { toast.error("Network error"); }
//     setConfirm(null);
//   };

//   const statusBadge = (s) => {
//     const map = {approved:"b-approved",pending:"b-pending",rejected:"b-rejected"};
//     const icons = {approved:"✓ ",pending:"⏳ ",rejected:"✗ "};
//     const st = s||"pending";
//     return <span className={`badge ${map[st]||"b-gray"}`}>{icons[st]||""}{st.charAt(0).toUpperCase()+st.slice(1)}</span>;
//   };

//   return (
//     <>
//       <style>{STYLES}</style>

//       {/* TOPBAR */}
//       <div className="topbar">
//         <div className="logo">
//           <div className="logo-box">🚌</div>
//           BusGo Admin
//         </div>
//         <div className="topbar-r">
//           <span>Dashboard</span>
//           <span className="chip">ADMIN PANEL</span>
//         </div>
//       </div>

//       <div className="page">
//         <div className="pg-head">
//           <h1>Bus Management</h1>
//           <p>Add buses, manage listings, and approve vendor submissions</p>
//         </div>

//         {/* STATS */}
//         <div className="stats">
//           {STATS.map(s=>(
//             <div className="stat" key={s.l}>
//               <div>
//                 <div className="stat-n" style={{color:s.col}}>{s.n}</div>
//                 <div className="stat-l">{s.l}</div>
//               </div>
//               <div className="stat-ic" style={{background:s.bg}}>{s.ic}</div>
//             </div>
//           ))}
//         </div>

//         {/* ADD BUS — Expand/Collapse */}
//         <AddBusForm onAdded={load} toast={toast} />

//         {/* ALL BUSES TABLE */}
//         <div className="tbl-card">

//           {/* SEARCH BAR — TOP OF TABLE */}
//           <div className="tbl-topbar">
//             <div className="tbl-topbar-left">
//               📋 All Buses
//             </div>
//             <div className="tbl-topbar-right">
//               <input
//                 className="srch"
//                 placeholder="Search name, city, operator…"
//                 value={srch}
//                 onChange={e=>setSrch(e.target.value)}
//               />
//               <select className="sel" value={stF} onChange={e=>setStF(e.target.value)}>
//                 <option value="all">All Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="approved">Approved</option>
//                 <option value="rejected">Rejected</option>
//               </select>
//               <button className="btn btn-light btn-sm" onClick={load}>🔄 Refresh</button>
//             </div>
//           </div>

//           {/* TABLE */}
//           <div className="tbl-wrap">
//             <table>
//               <thead>
//                 <tr>
//                   <th>Img</th>
//                   <th>Bus Name</th>
//                   <th>Type</th>
//                   <th>Route</th>
//                   <th>Date & Time</th>
//                   <th>Price</th>
//                   <th>Seats</th>
//                   <th>Operator</th>
//                   <th>Status</th>
//                   <th>Running</th>
//                   <th>Added By</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading && (
//                   <tr><td colSpan={12} style={{textAlign:"center",padding:40,color:"var(--g400)"}}>
//                     <span className="spin">↻</span> &nbsp;Loading buses…
//                   </td></tr>
//                 )}
//                 {!loading && filtered.length===0 && (
//                   <tr><td colSpan={12}>
//                     <div className="empty-cell">
//                       <div className="ei">🚌</div>
//                       <h3>{buses.length===0?"No buses yet":"No results found"}</h3>
//                       <p>{buses.length===0?"Add your first bus using the form above.":"Try adjusting your search or filter."}</p>
//                     </div>
//                   </td></tr>
//                 )}
//                 {!loading && filtered.map(bus=>(
//                   <tr key={bus._id}>
//                     <td>
//                       {bus.busImages?.[0]
//                         ? <img className="thumb" src={`http://localhost:9000/${bus.busImages[0]}`} alt="" onError={e=>{e.target.style.display="none"}} />
//                         : <div className="thumb-ph">🚌</div>
//                       }
//                     </td>
//                     <td>
//                       <div style={{fontWeight:600}}>{bus.busName}</div>
//                       <div style={{fontSize:".7rem",color:"var(--g400)",marginTop:2}}>{bus.busNumber||"—"}</div>
//                     </td>
//                     <td><span className="badge b-blue">{bus.busType||"—"}</span></td>
//                     <td>
//                       <div style={{fontWeight:600,whiteSpace:"nowrap"}}>{bus.fromCity||"—"} → {bus.toCity||"—"}</div>
//                       {bus.duration && <div style={{fontSize:".72rem",color:"var(--g400)",marginTop:2}}>{bus.duration}</div>}
//                     </td>
//                     <td>
//                       <div>{bus.journeyDate||"—"}</div>
//                       {bus.departureTime && <div style={{fontSize:".72rem",color:"var(--g500)",marginTop:1}}>{bus.departureTime}{bus.arrivalTime?` → ${bus.arrivalTime}`:""}</div>}
//                     </td>
//                     <td>
//                       <div style={{fontWeight:700,color:"var(--primary)"}}>₹{bus.offerPrice||bus.basePrice||"—"}</div>
//                       {bus.offerPrice && bus.basePrice && bus.offerPrice<bus.basePrice && (
//                         <div style={{fontSize:".7rem",color:"var(--g400)",textDecoration:"line-through"}}>₹{bus.basePrice}</div>
//                       )}
//                     </td>
//                     <td style={{textAlign:"center"}}>
//                       <div style={{fontWeight:600}}>{bus.availableSeats??bus.totalSeats??"—"}</div>
//                       <div style={{fontSize:".7rem",color:"var(--g400)"}}>/ {bus.totalSeats||"—"}</div>
//                     </td>
//                     <td style={{color:"var(--g600)"}}>{bus.operatorName||"—"}</td>
//                     <td>{statusBadge(bus.status)}</td>
//                     <td>
//                       <span className={`badge b-${(bus.busRunningStatus||"on-time")}`}>
//                         {bus.busRunningStatus||"on-time"}
//                       </span>
//                     </td>
//                     <td><span className="badge b-gray">{bus.addedBy||"vendor"}</span></td>
//                     <td>
//                       <div className="acts">
//                         {bus.status==="pending" && <>
//                           <button className="btn btn-success btn-xs" onClick={()=>setConfirm({type:"approve",bus})}>✓ Approve</button>
//                           <button className="btn btn-danger btn-xs" onClick={()=>setConfirm({type:"reject",bus})}>✗ Reject</button>
//                         </>}
//                         {bus.status==="approved" && <button className="btn btn-warn btn-xs" onClick={()=>setConfirm({type:"reject",bus})}>Revoke</button>}
//                         {bus.status==="rejected" && <button className="btn btn-success btn-xs" onClick={()=>setConfirm({type:"approve",bus})}>Re-approve</button>}
//                         <button className="btn btn-light btn-xs" onClick={()=>setEditBus(bus)}>✏️ Edit</button>
//                         <button className="btn btn-danger btn-xs" onClick={()=>setConfirm({type:"delete",bus})}>🗑</button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {!loading && filtered.length>0 && (
//             <div className="tbl-foot">
//               <span>Showing <strong>{filtered.length}</strong> of <strong>{buses.length}</strong> buses</span>
//               <span>{buses.filter(b=>b.status==="pending").length} pending approval</span>
//             </div>
//           )}
//         </div>
//       </div>

//       {editBus && <EditModal bus={editBus} toast={toast} onClose={()=>setEditBus(null)} onSaved={load} />}

//       {confirm?.type==="approve" && <Confirm icon="✅" title="Approve this bus?" msg={`"${confirm.bus.busName}" will become visible to users.`} yesLabel="✓ Yes, Approve" yesCls="btn-success" onYes={()=>doApprove(confirm.bus)} onNo={()=>setConfirm(null)} />}
//       {confirm?.type==="reject" && <Confirm icon="⚠️" title="Reject this bus?" msg={`"${confirm.bus.busName}" will be hidden from users.`} yesLabel="✗ Reject" yesCls="btn-danger" onYes={()=>doReject(confirm.bus)} onNo={()=>setConfirm(null)} />}
//       {confirm?.type==="delete" && <Confirm icon="🗑️" title="Delete permanently?" msg={`"${confirm.bus.busName}" will be deleted. Cannot be undone!`} yesLabel="Delete" yesCls="btn-danger" onYes={()=>doDelete(confirm.bus)} onNo={()=>setConfirm(null)} />}

//       <div className="toasts">
//         {toast.list.map(t=><div key={t.id} className={`toast ${t.cls}`}>{t.msg}</div>)}
//       </div>
//     </>
//   );
// }






import { useState, useEffect, useRef } from "react";

const API = "http://localhost:9000/api/bus";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #0d1117;
    --ink2: #1c2333;
    --ink3: #2d3748;
    --muted: #6b7a99;
    --muted2: #8892aa;
    --border: #e2e8f4;
    --border2: #cdd5e8;
    --bg: #f0f3fa;
    --surface: #ffffff;
    --surface2: #f7f9fe;
    --accent: #2563eb;
    --accent-l: #dbeafe;
    --accent-d: #1d4ed8;
    --green: #059669;
    --green-l: #d1fae5;
    --amber: #d97706;
    --amber-l: #fef3c7;
    --red: #dc2626;
    --red-l: #fee2e2;
    --purple: #7c3aed;
    --purple-l: #ede9fe;
    --shadow-xs: 0 1px 2px rgba(0,0,0,.05);
    --shadow-s: 0 2px 8px rgba(13,17,23,.08);
    --shadow-m: 0 4px 16px rgba(13,17,23,.1);
    --shadow-l: 0 12px 40px rgba(13,17,23,.14);
    --radius: 10px;
    --radius-sm: 6px;
    --radius-lg: 14px;
  }

  html { font-size: 14px; -webkit-font-smoothing: antialiased; }
  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--ink); min-height: 100vh; }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }

  /* ── TOPBAR ── */
  .topbar {
    position: sticky; top: 0; z-index: 100;
    height: 58px; background: var(--surface);
    border-bottom: 1px solid var(--border);
    box-shadow: var(--shadow-xs);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px;
  }
  .brand { display: flex; align-items: center; gap: 11px; }
  .brand-icon {
    width: 34px; height: 34px; background: var(--accent); border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; box-shadow: 0 4px 12px rgba(37,99,235,.35);
  }
  .brand-name { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 800; color: var(--ink); letter-spacing: -.3px; }
  .brand-name span { color: var(--accent); }
  .topbar-right { display: flex; align-items: center; gap: 10px; }
  .pill { background: var(--accent-l); color: var(--accent); font-size: .68rem; font-weight: 700; padding: 4px 12px; border-radius: 20px; letter-spacing: .5px; text-transform: uppercase; }
  .topbar-avatar { width: 32px; height: 32px; background: linear-gradient(135deg,#667eea,#764ba2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: .75rem; cursor: pointer; }

  /* ── PAGE ── */
  .page { max-width: 1560px; margin: 0 auto; padding: 28px 24px; }
  .pg-head { margin-bottom: 24px; display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  .pg-title { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800; color: var(--ink); letter-spacing: -.5px; }
  .pg-sub { color: var(--muted); font-size: .82rem; margin-top: 3px; }

  /* ── STATS ── */
  .stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 24px; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius-lg); padding: 18px 20px;
    box-shadow: var(--shadow-xs);
    display: flex; align-items: center; justify-content: space-between;
    transition: transform .2s, box-shadow .2s;
  }
  .stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-s); }
  .stat-num { font-family: 'Syne', sans-serif; font-size: 2.2rem; font-weight: 800; line-height: 1; }
  .stat-lbl { font-size: .72rem; color: var(--muted); font-weight: 600; margin-top: 4px; text-transform: uppercase; letter-spacing: .6px; }
  .stat-trend { font-size: .72rem; margin-top: 6px; font-weight: 500; }
  .stat-ico { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; }

  /* ── CARD ── */
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); box-shadow: var(--shadow-xs); overflow: hidden; margin-bottom: 20px; }
  .card-hd {
    padding: 16px 22px; border-bottom: 1px solid transparent;
    display: flex; align-items: center; justify-content: space-between;
    cursor: pointer; user-select: none; transition: background .15s;
    background: var(--surface);
  }
  .card-hd:hover { background: var(--surface2); }
  .card-hd.is-open { border-bottom-color: var(--border); background: var(--surface2); }
  .card-hd-left { display: flex; align-items: center; gap: 12px; }
  .card-hd-icon { width: 36px; height: 36px; background: var(--accent-l); border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 1rem; }
  .card-hd-title { font-weight: 700; font-size: .97rem; color: var(--ink2); }
  .card-hd-sub { font-size: .74rem; color: var(--muted); margin-top: 2px; }
  .chevron { width: 28px; height: 28px; border-radius: 7px; background: var(--border); display: flex; align-items: center; justify-content: center; transition: transform .25s, background .15s; font-size: .7rem; color: var(--muted); flex-shrink: 0; }
  .chevron.is-open { transform: rotate(180deg); background: var(--accent-l); color: var(--accent); }

  /* ── COLLAPSE ── */
  .collapse { max-height: 0; overflow: hidden; transition: max-height .4s cubic-bezier(.4,0,.2,1); }
  .collapse.is-open { max-height: 6000px; }
  .card-body { padding: 24px; }

  /* ── SECTION ── */
  .sec { margin-bottom: 24px; }
  .sec:last-child { margin-bottom: 0; }
  .sec-label {
    font-size: .68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .9px;
    color: var(--muted2); margin-bottom: 14px; padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 8px;
  }
  .sec-label-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); }

  /* ── GRID ── */
  .g { display: grid; gap: 12px; }
  .g2 { grid-template-columns: repeat(2,1fr); }
  .g3 { grid-template-columns: repeat(3,1fr); }
  .g4 { grid-template-columns: repeat(4,1fr); }
  .g5 { grid-template-columns: repeat(5,1fr); }
  .g6 { grid-template-columns: repeat(6,1fr); }
  .sp2 { grid-column: span 2; }
  .sp3 { grid-column: span 3; }
  .sp4 { grid-column: span 4; }
  .sp6 { grid-column: span 6; }

  /* ── FIELD ── */
  .field { display: flex; flex-direction: column; gap: 5px; }
  .field label { font-size: .72rem; font-weight: 600; color: var(--ink3); display: flex; align-items: center; gap: 4px; }
  .field label .req { color: var(--red); }
  .field label .opt { font-weight: 400; color: var(--muted2); font-size: .68rem; }
  .inp, .sel-inp, .textarea-inp {
    border: 1.5px solid var(--border2); border-radius: var(--radius-sm);
    padding: 9px 11px; font-family: 'DM Sans', sans-serif; font-size: .85rem;
    color: var(--ink); background: var(--surface); outline: none; width: 100%;
    transition: border-color .15s, box-shadow .15s, background .15s;
  }
  .inp::placeholder, .textarea-inp::placeholder { color: var(--muted2); }
  .inp:focus, .sel-inp:focus, .textarea-inp:focus {
    border-color: var(--accent); box-shadow: 0 0 0 3px rgba(37,99,235,.12);
    background: #fafcff;
  }
  .textarea-inp { resize: vertical; min-height: 76px; line-height: 1.5; }
  .inp[type="file"] { background: var(--surface2); cursor: pointer; color: var(--muted); }
  .file-hint { font-size: .7rem; color: var(--muted2); margin-top: 3px; display: flex; align-items: center; gap: 5px; }
  .field-hint { font-size: .7rem; color: var(--muted2); }
  .inp-group { display: flex; }
  .inp-group .inp-pre { background: var(--surface2); border: 1.5px solid var(--border2); border-right: none; border-radius: var(--radius-sm) 0 0 var(--radius-sm); padding: 9px 11px; font-size: .82rem; color: var(--muted); white-space: nowrap; display: flex; align-items: center; }
  .inp-group .inp { border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }

  /* ── FORM ACTIONS ── */
  .form-acts { display: flex; align-items: center; justify-content: flex-end; gap: 10px; padding-top: 20px; border-top: 1px solid var(--border); margin-top: 24px; }

  /* ── DIVIDER ── */
  .divider { border: none; border-top: 1px dashed var(--border2); margin: 20px 0; }

  /* ── BTN ── */
  .btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; border-radius: var(--radius-sm); font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: .82rem; cursor: pointer; transition: all .15s; border: 1px solid transparent; line-height: 1; white-space: nowrap; }
  .btn:disabled { opacity: .5; cursor: not-allowed; pointer-events: none; }
  .btn-primary { background: var(--accent); color: #fff; box-shadow: 0 2px 8px rgba(37,99,235,.3); }
  .btn-primary:hover { background: var(--accent-d); box-shadow: 0 4px 14px rgba(37,99,235,.4); }
  .btn-ghost { background: var(--surface); color: var(--ink3); border-color: var(--border2); }
  .btn-ghost:hover { background: var(--surface2); }
  .btn-success { background: var(--green); color: #fff; }
  .btn-success:hover { background: #047857; }
  .btn-danger { background: var(--red); color: #fff; }
  .btn-danger:hover { background: #b91c1c; }
  .btn-warn { background: var(--amber); color: #fff; }
  .btn-warn:hover { background: #b45309; }
  .btn-sm { padding: 6px 13px; font-size: .78rem; }
  .btn-xs { padding: 4px 10px; font-size: .73rem; border-radius: 5px; }
  .spin { display: inline-block; animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── TABLE CARD ── */
  .tbl-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); box-shadow: var(--shadow-xs); overflow: hidden; }
  .tbl-header { padding: 16px 22px; border-bottom: 1px solid var(--border); background: var(--surface2); display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
  .tbl-header-l { display: flex; align-items: center; gap: 10px; }
  .tbl-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: .95rem; color: var(--ink); }
  .tbl-count { background: var(--accent-l); color: var(--accent); font-size: .7rem; font-weight: 700; padding: 2px 8px; border-radius: 10px; }
  .tbl-controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .search-wrap { position: relative; }
  .search-ic { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); font-size: .8rem; color: var(--muted2); pointer-events: none; }
  .search-inp { border: 1.5px solid var(--border2); border-radius: var(--radius-sm); padding: 7px 11px 7px 30px; font-family: 'DM Sans', sans-serif; font-size: .82rem; outline: none; width: 220px; transition: border-color .15s; }
  .search-inp:focus { border-color: var(--accent); }
  .filter-sel { border: 1.5px solid var(--border2); border-radius: var(--radius-sm); padding: 7px 10px; font-family: 'DM Sans', sans-serif; font-size: .82rem; color: var(--ink3); background: var(--surface); outline: none; cursor: pointer; transition: border-color .15s; }
  .filter-sel:focus { border-color: var(--accent); }

  /* ── TABLE ── */
  .tbl-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  thead tr { background: var(--surface2); }
  thead th { padding: 11px 14px; text-align: left; font-size: .68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .7px; color: var(--muted); border-bottom: 1px solid var(--border); white-space: nowrap; }
  tbody td { padding: 12px 14px; border-bottom: 1px solid var(--border); font-size: .84rem; vertical-align: middle; }
  tbody tr:last-child td { border-bottom: none; }
  tbody tr { transition: background .1s; }
  tbody tr:hover { background: var(--surface2); }

  /* ── BADGE ── */
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 20px; font-size: .67rem; font-weight: 700; letter-spacing: .3px; white-space: nowrap; }
  .b-approved { background: var(--green-l); color: var(--green); }
  .b-pending { background: var(--amber-l); color: var(--amber); }
  .b-rejected { background: var(--red-l); color: var(--red); }
  .b-accent { background: var(--accent-l); color: var(--accent); }
  .b-purple { background: var(--purple-l); color: var(--purple); }
  .b-gray { background: var(--surface2); color: var(--muted); border: 1px solid var(--border); }

  /* ── THUMB ── */
  .thumb { width: 38px; height: 38px; border-radius: 8px; object-fit: cover; border: 1px solid var(--border); display: block; }
  .thumb-ph { width: 38px; height: 38px; border-radius: 8px; background: var(--surface2); border: 1.5px dashed var(--border2); display: flex; align-items: center; justify-content: center; font-size: 1rem; color: var(--muted2); }

  /* ── ROW TEXT STYLES ── */
  .row-main { font-weight: 600; color: var(--ink2); }
  .row-sub { font-size: .72rem; color: var(--muted); margin-top: 2px; }
  .price-main { font-weight: 700; color: var(--accent); }
  .price-old { font-size: .7rem; color: var(--muted2); text-decoration: line-through; margin-top: 2px; }
  .acts { display: flex; align-items: center; gap: 4px; flex-wrap: nowrap; }

  /* ── TABLE FOOTER ── */
  .tbl-foot { padding: 10px 18px; border-top: 1px solid var(--border); background: var(--surface2); display: flex; justify-content: space-between; align-items: center; font-size: .73rem; color: var(--muted); }

  /* ── EMPTY ── */
  .empty { padding: 60px 20px; text-align: center; }
  .empty-ico { font-size: 3rem; margin-bottom: 12px; opacity: .5; }
  .empty-t { font-weight: 700; font-size: .95rem; color: var(--ink3); margin-bottom: 5px; }
  .empty-s { font-size: .8rem; color: var(--muted); }

  /* ── MODAL ── */
  .overlay { position: fixed; inset: 0; background: rgba(13,17,23,.55); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 16px; backdrop-filter: blur(2px); }
  .modal { background: var(--surface); border-radius: var(--radius-lg); box-shadow: var(--shadow-l); width: 100%; margin: auto; overflow: hidden; }
  .modal-sm { max-width: 420px; }
  .modal-lg { max-width: 900px; max-height: 92vh; display: flex; flex-direction: column; }
  .modal-hd { padding: 18px 22px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; background: var(--surface2); }
  .modal-hd h2 { font-family: 'Syne', sans-serif; font-size: .95rem; font-weight: 800; color: var(--ink); display: flex; align-items: center; gap: 8px; }
  .modal-body { padding: 22px; overflow-y: auto; }
  .modal-ft { padding: 14px 22px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 8px; background: var(--surface2); flex-shrink: 0; }
  .x-btn { background: none; border: none; width: 30px; height: 30px; border-radius: 7px; cursor: pointer; font-size: 1rem; color: var(--muted2); display: flex; align-items: center; justify-content: center; transition: background .15s; }
  .x-btn:hover { background: var(--border); color: var(--ink3); }

  /* ── CONFIRM ── */
  .cf-ico { font-size: 2.8rem; text-align: center; margin: 6px 0 14px; }
  .cf-t { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 800; text-align: center; margin-bottom: 8px; }
  .cf-m { font-size: .83rem; color: var(--muted); text-align: center; line-height: 1.6; }

  /* ── TOAST ── */
  .toasts { position: fixed; bottom: 20px; right: 20px; z-index: 999; display: flex; flex-direction: column-reverse; gap: 8px; }
  .toast { background: var(--ink2); color: #fff; padding: 11px 16px; border-radius: var(--radius); font-size: .81rem; font-weight: 500; box-shadow: var(--shadow-l); display: flex; align-items: center; gap: 10px; min-width: 240px; max-width: 340px; animation: toastIn .22s ease; border-left: 4px solid #374151; }
  .t-success { border-left-color: var(--green); }
  .t-error { border-left-color: var(--red); }
  .t-warn { border-left-color: var(--amber); }
  @keyframes toastIn { from { transform: translateX(60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

  /* ── TABS (for modal) ── */
  .tab-row { display: flex; gap: 2px; margin-bottom: 18px; background: var(--surface2); padding: 4px; border-radius: 8px; }
  .tab { padding: 7px 14px; border-radius: 6px; font-size: .78rem; font-weight: 600; cursor: pointer; transition: all .15s; color: var(--muted); border: none; background: none; white-space: nowrap; }
  .tab.active { background: var(--surface); color: var(--accent); box-shadow: var(--shadow-xs); }

  /* ── RESPONSIVE ── */
  @media(max-width:1200px) { .stats { grid-template-columns: repeat(2,1fr); } }
  @media(max-width:900px) { .g4,.g5,.g6 { grid-template-columns: repeat(2,1fr); } .sp3,.sp4,.sp6 { grid-column: span 2; } }
  @media(max-width:768px) { .page { padding: 14px 10px; } .search-inp { width: 150px; } }
  @media(max-width:560px) { .g2,.g3,.g4,.g5,.g6 { grid-template-columns: 1fr; } .sp2,.sp3,.sp4,.sp6 { grid-column: span 1; } .stats { grid-template-columns: repeat(2,1fr); } }
`;

/* ═══════ TOAST ═══════ */
function useToast() {
  const [list, setList] = useState([]);
  const push = (msg, cls = "") => {
    const id = Date.now() + Math.random();
    setList(p => [...p, { id, msg, cls }]);
    setTimeout(() => setList(p => p.filter(t => t.id !== id)), 3600);
  };
  return { list, success: m => push(m, "t-success"), error: m => push(m, "t-error"), warn: m => push(m, "t-warn"), info: m => push(m) };
}

/* ═══════ FIELD COMPONENT ═══════ */
const F = ({ label, req, opt, hint, children, className = "" }) => (
  <div className={`field ${className}`}>
    <label>
      {label}
      {req && <span className="req">*</span>}
      {opt && <span className="opt"> (optional)</span>}
    </label>
    {children}
    {hint && <div className="field-hint">{hint}</div>}
  </div>
);

/* ═══════ CONSTANTS ═══════ */
const BUS_TYPES = ["AC Seater","AC Sleeper","Non-AC Seater","Non-AC Sleeper","Volvo AC","Semi Sleeper","Luxury","Mini Bus","Deluxe","Super Deluxe"];
const SEAT_LAYOUTS = ["2+2","2+1","1+1","2+1 Sleeper","1+1 Sleeper","2+2 Sleeper"];
const AMENITIES_LIST = ["WiFi","Charging Point","Blanket","Reading Light","AC","TV","Water Bottle","Pillow","Snacks","Toilet","USB Port","Fan","Curtains","Footrest","Movie Streaming"];

const BLANK = {
  busName:"", busNumber:"", operatorName:"", vendorName:"", busOwner:"",
  email:"", phone:"", altPhone:"", address:"", city:"", state:"", country:"",
  fromCity:"", toCity:"", routeName:"", viaCities:"",
  boardingPoints:"", droppingPoints:"",
  departureTime:"", arrivalTime:"", journeyDuration:"", reportingTime:"",
  travelDate:"", returnDate:"",
  busType:"AC Seater", busCategory:"seater", busModel:"", busColor:"",
  seatLayoutType:"2+2", totalSeats:"40",
  seatNumbers:"", basePrice:"", tax:"", tollTax:"", discount:"", offerPrice:"", finalPrice:"",
  agentCommission:"", agentPrice:"", vendorCost:"",
  driverName:"", driverPhone:"", driverLicense:"", helperName:"", helperPhone:"",
  rcNumber:"", insuranceNumber:"", permitNumber:"", fitnessExpiry:"",
  gpsDeviceId:"", liveTrackingLink:"", busCurrentLocation:"",
  amenities:"", cancellationPolicy:"", notes:"",
  addedBy:"admin", assignUser:"",
};

/* ═══════════════════════════
   ADD BUS FORM
═══════════════════════════ */
function AddBusForm({ onAdded, toast }) {
  const [d, setD] = useState(BLANK);
  const [files, setFiles] = useState({ front: null, back: null, seatLayout: null, inside: [], gallery: [] });
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const u = k => e => setD(p => ({ ...p, [k]: e.target.value }));

  const TABS = [
    { id: "basic", label: "🚌 Bus Info" },
    { id: "route", label: "🗺️ Route" },
    { id: "pricing", label: "💰 Pricing" },
    { id: "staff", label: "👤 Staff" },
    { id: "docs", label: "📄 Documents" },
    { id: "media", label: "🖼️ Media" },
  ];

  const submit = async () => {
    if (!d.busName.trim()) return toast.error("Bus name is required");
    if (!d.busNumber.trim()) return toast.error("Bus number is required");
    if (!d.fromCity.trim() || !d.toCity.trim()) return toast.error("From & To city are required");
    setBusy(true);
    try {
      const fd = new FormData();
      Object.entries(d).forEach(([k, v]) => fd.append(k, v));
      if (files.front) fd.append("frontImage", files.front);
      if (files.back) fd.append("backImage", files.back);
      if (files.seatLayout) fd.append("seatLayoutImage", files.seatLayout);
      files.inside.forEach(f => fd.append("insideImages", f));
      files.gallery.forEach(f => fd.append("gallery", f));
      const res = await fetch(`${API}/add`, { method: "POST", body: fd });
      const json = await res.json();
      if (json.success) {
        toast.success("🚌 Bus added successfully!");
        setD(BLANK); setFiles({ front: null, back: null, seatLayout: null, inside: [], gallery: [] });
        setOpen(false); onAdded();
      } else toast.error(json.error || "Failed to add bus");
    } catch (e) { toast.error("Network error: " + e.message); }
    setBusy(false);
  };

  return (
    <div className="card">
      <div className={`card-hd ${open ? "is-open" : ""}`} onClick={() => setOpen(o => !o)}>
        <div className="card-hd-left">
          <div className="card-hd-icon">🚌</div>
          <div>
            <div className="card-hd-title">Add New Bus</div>
            <div className="card-hd-sub">{open ? "Click to collapse" : "Fill all bus details — basic info, route, pricing, documents & media"}</div>
          </div>
        </div>
        <div className={`chevron ${open ? "is-open" : ""}`}>▼</div>
      </div>

      <div className={`collapse ${open ? "is-open" : ""}`}>
        <div className="card-body">
          {/* TABS */}
          <div className="tab-row" style={{ overflowX: "auto" }}>
            {TABS.map(t => (
              <button key={t.id} className={`tab ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB: BASIC */}
          {activeTab === "basic" && (
            <>
              <div className="sec">
                <div className="sec-label"><div className="sec-label-dot" />Basic Bus Information</div>
                <div className="g g4" style={{ marginBottom: 12 }}>
                  <F label="Bus Name" req><input className="inp" value={d.busName} onChange={u("busName")} placeholder="e.g. Shivshahi Express" /></F>
                  <F label="Bus Number" req><input className="inp" value={d.busNumber} onChange={u("busNumber")} placeholder="MH-12-AB-1234" /></F>
                  <F label="Operator Name"><input className="inp" value={d.operatorName} onChange={u("operatorName")} placeholder="MSRTC, RedBus…" /></F>
                  <F label="Vendor Name"><input className="inp" value={d.vendorName} onChange={u("vendorName")} placeholder="Rahul Travels" /></F>
                </div>
                <div className="g g4">
                  <F label="Bus Owner"><input className="inp" value={d.busOwner} onChange={u("busOwner")} placeholder="Owner name" /></F>
                  <F label="Bus Model"><input className="inp" value={d.busModel} onChange={u("busModel")} placeholder="Volvo 9400, BharatBenz" /></F>
                  <F label="Bus Color"><input className="inp" value={d.busColor} onChange={u("busColor")} placeholder="Red, Blue, White" /></F>
                  <F label="Added By">
                    <select className="sel-inp" value={d.addedBy} onChange={u("addedBy")}>
                      <option value="admin">Admin</option>
                      <option value="vendor">Vendor</option>
                    </select>
                  </F>
                </div>
              </div>

              <div className="sec">
                <div className="sec-label"><div className="sec-label-dot" />Bus Configuration</div>
                <div className="g g4" style={{ marginBottom: 12 }}>
                  <F label="Bus Type">
                    <select className="sel-inp" value={d.busType} onChange={u("busType")}>
                      {BUS_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </F>
                  <F label="Bus Category">
                    <select className="sel-inp" value={d.busCategory} onChange={u("busCategory")}>
                      <option value="seater">Seater</option>
                      <option value="sleeper">Sleeper</option>
                      <option value="semi-sleeper">Semi Sleeper</option>
                    </select>
                  </F>
                  <F label="Seat Layout">
                    <select className="sel-inp" value={d.seatLayoutType} onChange={u("seatLayoutType")}>
                      {SEAT_LAYOUTS.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </F>
                  <F label="Total Seats"><input type="number" className="inp" value={d.totalSeats} onChange={u("totalSeats")} min="1" /></F>
                </div>
                <div className="g g2">
                  <F label="Seat Numbers" hint="Comma separated: A1, A2, B1, B2…">
                    <input className="inp" value={d.seatNumbers} onChange={u("seatNumbers")} placeholder="A1, A2, B1, B2, C1, C2…" />
                  </F>
                  <F label="Assign User"><input className="inp" value={d.assignUser} onChange={u("assignUser")} placeholder="Username or ID" /></F>
                </div>
              </div>

              <div className="sec">
                <div className="sec-label"><div className="sec-label-dot" />Operator Contact Details</div>
                <div className="g g4" style={{ marginBottom: 12 }}>
                  <F label="Email"><input type="email" className="inp" value={d.email} onChange={u("email")} placeholder="operator@email.com" /></F>
                  <F label="Phone"><input className="inp" value={d.phone} onChange={u("phone")} placeholder="+91 98000 00000" /></F>
                  <F label="Alt Phone"><input className="inp" value={d.altPhone} onChange={u("altPhone")} placeholder="+91 97000 00000" /></F>
                  <F label="City"><input className="inp" value={d.city} onChange={u("city")} placeholder="Mumbai" /></F>
                </div>
                <div className="g g3">
                  <F label="State"><input className="inp" value={d.state} onChange={u("state")} placeholder="Maharashtra" /></F>
                  <F label="Country"><input className="inp" value={d.country} onChange={u("country")} placeholder="India" /></F>
                  <F label="Address" className="sp1"><input className="inp" value={d.address} onChange={u("address")} placeholder="Full address" /></F>
                </div>
              </div>

              <div className="sec">
                <div className="sec-label"><div className="sec-label-dot" />Amenities & Notes</div>
                <div className="g g2" style={{ marginBottom: 12 }}>
                  <F label="Amenities" hint="Select or type comma separated">
                    <input className="inp" value={d.amenities} onChange={u("amenities")} placeholder="WiFi, Charging Point, Blanket, AC, TV, Water Bottle…" />
                  </F>
                  <div>
                    <div style={{ fontSize: ".71rem", fontWeight: 600, color: "var(--ink3)", marginBottom: 8 }}>Quick Select Amenities</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {AMENITIES_LIST.map(a => {
                        const selected = d.amenities.split(",").map(x => x.trim()).includes(a);
                        return (
                          <button key={a} type="button"
                            onClick={() => {
                              const arr = d.amenities ? d.amenities.split(",").map(x => x.trim()).filter(Boolean) : [];
                              if (selected) setD(p => ({ ...p, amenities: arr.filter(x => x !== a).join(", ") }));
                              else setD(p => ({ ...p, amenities: [...arr, a].join(", ") }));
                            }}
                            style={{ padding: "4px 10px", borderRadius: 20, fontSize: ".71rem", fontWeight: 600, cursor: "pointer", transition: "all .15s", border: "1.5px solid", borderColor: selected ? "var(--accent)" : "var(--border2)", background: selected ? "var(--accent-l)" : "var(--surface2)", color: selected ? "var(--accent)" : "var(--muted)" }}>
                            {a}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="g" style={{ gridTemplateColumns: "1fr" }}>
                  <F label="Notes / Internal Remarks">
                    <textarea className="textarea-inp" value={d.notes} onChange={u("notes")} placeholder="Any internal notes about this bus…" />
                  </F>
                </div>
              </div>
            </>
          )}

          {/* TAB: ROUTE */}
          {activeTab === "route" && (
            <>
              <div className="sec">
                <div className="sec-label"><div className="sec-label-dot" />Route Information</div>
                <div className="g g4" style={{ marginBottom: 12 }}>
                  <F label="From City" req><input className="inp" value={d.fromCity} onChange={u("fromCity")} placeholder="Mumbai" /></F>
                  <F label="To City" req><input className="inp" value={d.toCity} onChange={u("toCity")} placeholder="Pune" /></F>
                  <F label="Route Name"><input className="inp" value={d.routeName} onChange={u("routeName")} placeholder="Mumbai-Pune Express" /></F>
                  <F label="Via Cities" hint="Comma separated">
                    <input className="inp" value={d.viaCities} onChange={u("viaCities")} placeholder="Lonavala, Khopoli" />
                  </F>
                </div>
                <div className="g g2">
                  <F label="Boarding Points" hint="Format: Location|Time|Address|Landmark — comma separated between stops">
                    <textarea className="textarea-inp" value={d.boardingPoints} onChange={u("boardingPoints")} placeholder="Dadar|06:00|Dadar Station, WE|Near McDonald's, Thane|07:00|Thane Bus Stand|Near Clock Tower" />
                  </F>
                  <F label="Dropping Points" hint="Format: Location|Time|Address|Landmark — comma separated between stops">
                    <textarea className="textarea-inp" value={d.droppingPoints} onChange={u("droppingPoints")} placeholder="Shivajinagar|10:30|Shivajinagar Bus Stand|Near Railway Station, Kothrud|11:00|Kothrud Depot|" />
                  </F>
                </div>
              </div>

              <div className="sec">
                <div className="sec-label"><div className="sec-label-dot" />Timing</div>
                <div className="g g4" style={{ marginBottom: 12 }}>
                  <F label="Departure Time"><input type="time" className="inp" value={d.departureTime} onChange={u("departureTime")} /></F>
                  <F label="Arrival Time"><input type="time" className="inp" value={d.arrivalTime} onChange={u("arrivalTime")} /></F>
                  <F label="Journey Duration"><input className="inp" value={d.journeyDuration} onChange={u("journeyDuration")} placeholder="4h 30m" /></F>
                  <F label="Reporting Time"><input type="time" className="inp" value={d.reportingTime} onChange={u("reportingTime")} /></F>
                </div>
                <div className="g g3">
                  <F label="Travel Date"><input type="date" className="inp" value={d.travelDate} onChange={u("travelDate")} /></F>
                  <F label="Return Date"><input type="date" className="inp" value={d.returnDate} onChange={u("returnDate")} /></F>
                  <F label="GPS Device ID"><input className="inp" value={d.gpsDeviceId} onChange={u("gpsDeviceId")} placeholder="GPS-001" /></F>
                </div>
                <div className="g g2" style={{ marginTop: 12 }}>
                  <F label="Live Tracking Link"><input type="url" className="inp" value={d.liveTrackingLink} onChange={u("liveTrackingLink")} placeholder="https://track.example.com/bus-001" /></F>
                  <F label="Bus Current Location"><input className="inp" value={d.busCurrentLocation} onChange={u("busCurrentLocation")} placeholder="In depot / On route to Pune" /></F>
                </div>
              </div>

              <div className="sec">
                <div className="sec-label"><div className="sec-label-dot" />Route Map Coordinates</div>
                <div className="g g4">
                  <F label="From Latitude"><input className="inp" value={d.fromLat || ""} onChange={e => setD(p => ({ ...p, fromLat: e.target.value }))} placeholder="19.0760" /></F>
                  <F label="From Longitude"><input className="inp" value={d.fromLng || ""} onChange={e => setD(p => ({ ...p, fromLng: e.target.value }))} placeholder="72.8777" /></F>
                  <F label="To Latitude"><input className="inp" value={d.toLat || ""} onChange={e => setD(p => ({ ...p, toLat: e.target.value }))} placeholder="18.5204" /></F>
                  <F label="To Longitude"><input className="inp" value={d.toLng || ""} onChange={e => setD(p => ({ ...p, toLng: e.target.value }))} placeholder="73.8567" /></F>
                </div>
              </div>
            </>
          )}

          {/* TAB: PRICING */}
          {activeTab === "pricing" && (
            <>
              <div className="sec">
                <div className="sec-label"><div className="sec-label-dot" />Base Pricing</div>
                <div className="g g4" style={{ marginBottom: 12 }}>
                  <F label="Base Price (₹)" req>
                    <div className="inp-group"><span className="inp-pre">₹</span><input type="number" className="inp" value={d.basePrice} onChange={u("basePrice")} placeholder="500" /></div>
                  </F>
                  <F label="Offer Price (₹)">
                    <div className="inp-group"><span className="inp-pre">₹</span><input type="number" className="inp" value={d.offerPrice} onChange={u("offerPrice")} placeholder="450" /></div>
                  </F>
                  <F label="Final Price (₹)">
                    <div className="inp-group"><span className="inp-pre">₹</span><input type="number" className="inp" value={d.finalPrice} onChange={u("finalPrice")} placeholder="475" /></div>
                  </F>
                  <F label="Discount (₹ or %)">
                    <input className="inp" value={d.discount} onChange={u("discount")} placeholder="50 or 10%" />
                  </F>
                </div>
                <div className="g g3">
                  <F label="Tax (%)"><input type="number" className="inp" value={d.tax} onChange={u("tax")} placeholder="5" /></F>
                  <F label="Toll Tax (₹)">
                    <div className="inp-group"><span className="inp-pre">₹</span><input type="number" className="inp" value={d.tollTax} onChange={u("tollTax")} placeholder="50" /></div>
                  </F>
                  <div style={{ background: "var(--accent-l)", borderRadius: "var(--radius-sm)", padding: "12px 14px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ fontSize: ".7rem", color: "var(--accent)", fontWeight: 700, marginBottom: 4 }}>EFFECTIVE PRICE</div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "var(--accent)" }}>
                      ₹{d.finalPrice || d.offerPrice || d.basePrice || "—"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="sec">
                <div className="sec-label"><div className="sec-label-dot" />Agent & Vendor Pricing</div>
                <div className="g g4">
                  <F label="Agent Commission (%)"><input type="number" className="inp" value={d.agentCommission} onChange={u("agentCommission")} placeholder="8" /></F>
                  <F label="Agent Price (₹)">
                    <div className="inp-group"><span className="inp-pre">₹</span><input type="number" className="inp" value={d.agentPrice} onChange={u("agentPrice")} placeholder="420" /></div>
                  </F>
                  <F label="Vendor Cost (₹)">
                    <div className="inp-group"><span className="inp-pre">₹</span><input type="number" className="inp" value={d.vendorCost} onChange={u("vendorCost")} placeholder="350" /></div>
                  </F>
                  <F label="Vendor Payment Status">
                    <select className="sel-inp" value={d.vendorPaymentStatus || ""} onChange={u("vendorPaymentStatus")}>
                      <option value="">-- Select --</option>
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="partial">Partial</option>
                    </select>
                  </F>
                </div>
              </div>

              <div className="sec">
                <div className="sec-label"><div className="sec-label-dot" />Policies</div>
                <div className="g g2">
                  <F label="Cancellation Policy">
                    <textarea className="textarea-inp" value={d.cancellationPolicy} onChange={u("cancellationPolicy")} placeholder="e.g. Free cancellation 24 hours before departure. 50% refund within 12 hours." />
                  </F>
                  <F label="Booking Date Range">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <F label="Start Booking Date"><input type="date" className="inp" value={d.startBookingDate || ""} onChange={e => setD(p => ({ ...p, startBookingDate: e.target.value }))} /></F>
                      <F label="End Booking Date"><input type="date" className="inp" value={d.endBookingDate || ""} onChange={e => setD(p => ({ ...p, endBookingDate: e.target.value }))} /></F>
                    </div>
                  </F>
                </div>
              </div>
            </>
          )}

          {/* TAB: STAFF */}
          {activeTab === "staff" && (
            <>
              <div className="sec">
                <div className="sec-label"><div className="sec-label-dot" />Driver Details</div>
                <div className="g g3">
                  <F label="Driver Name"><input className="inp" value={d.driverName} onChange={u("driverName")} placeholder="Ramesh Kumar" /></F>
                  <F label="Driver Phone"><input className="inp" value={d.driverPhone} onChange={u("driverPhone")} placeholder="+91 98000 00000" /></F>
                  <F label="Driver License No."><input className="inp" value={d.driverLicense} onChange={u("driverLicense")} placeholder="MH-0120210012345" /></F>
                </div>
              </div>
              <div className="sec">
                <div className="sec-label"><div className="sec-label-dot" />Helper / Conductor</div>
                <div className="g g2">
                  <F label="Helper Name"><input className="inp" value={d.helperName} onChange={u("helperName")} placeholder="Suresh Patil" /></F>
                  <F label="Helper Phone"><input className="inp" value={d.helperPhone} onChange={u("helperPhone")} placeholder="+91 97000 00000" /></F>
                </div>
              </div>
            </>
          )}

          {/* TAB: DOCUMENTS */}
          {activeTab === "docs" && (
            <>
              <div className="sec">
                <div className="sec-label"><div className="sec-label-dot" />Vehicle Documents</div>
                <div className="g g4">
                  <F label="RC Number"><input className="inp" value={d.rcNumber} onChange={u("rcNumber")} placeholder="MH12AB1234" /></F>
                  <F label="Insurance Number"><input className="inp" value={d.insuranceNumber} onChange={u("insuranceNumber")} placeholder="INS-2024-001" /></F>
                  <F label="Permit Number"><input className="inp" value={d.permitNumber} onChange={u("permitNumber")} placeholder="PERMIT-MH-001" /></F>
                  <F label="Fitness Expiry"><input type="date" className="inp" value={d.fitnessExpiry} onChange={u("fitnessExpiry")} /></F>
                </div>
              </div>
            </>
          )}

          {/* TAB: MEDIA */}
          {activeTab === "media" && (
            <>
              <div className="sec">
                <div className="sec-label"><div className="sec-label-dot" />Bus Images</div>
                <div className="g g3" style={{ marginBottom: 12 }}>
                  <F label="Front Image">
                    <input type="file" accept="image/*" className="inp" onChange={e => setFiles(p => ({ ...p, front: e.target.files[0] }))} />
                    {files.front && <div className="file-hint">📎 {files.front.name}</div>}
                  </F>
                  <F label="Back Image">
                    <input type="file" accept="image/*" className="inp" onChange={e => setFiles(p => ({ ...p, back: e.target.files[0] }))} />
                    {files.back && <div className="file-hint">📎 {files.back.name}</div>}
                  </F>
                  <F label="Seat Layout Image">
                    <input type="file" accept="image/*" className="inp" onChange={e => setFiles(p => ({ ...p, seatLayout: e.target.files[0] }))} />
                    {files.seatLayout && <div className="file-hint">📎 {files.seatLayout.name}</div>}
                  </F>
                </div>
                <div className="g g2">
                  <F label="Inside Images (multiple)" hint="Select multiple interior photos">
                    <input type="file" accept="image/*" multiple className="inp" onChange={e => setFiles(p => ({ ...p, inside: Array.from(e.target.files) }))} />
                    {files.inside.length > 0 && <div className="file-hint">📎 {files.inside.length} file(s) selected</div>}
                  </F>
                  <F label="Gallery Images (min 3)" hint="Select 3 or more photos for gallery">
                    <input type="file" accept="image/*" multiple className="inp" onChange={e => setFiles(p => ({ ...p, gallery: Array.from(e.target.files) }))} />
                    {files.gallery.length > 0 && <div className="file-hint">📎 {files.gallery.length} file(s) selected {files.gallery.length < 3 ? "⚠️ Need at least 3" : "✅"}</div>}
                  </F>
                </div>
              </div>
            </>
          )}

          <div className="form-acts">
            <button className="btn btn-ghost" onClick={() => { setD(BLANK); setFiles({ front: null, back: null, seatLayout: null, inside: [], gallery: [] }); }}>Reset</button>
            <button className="btn btn-primary" onClick={submit} disabled={busy}>
              {busy ? <><span className="spin">↻</span> Adding…</> : "🚌 Add Bus"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════
   EDIT MODAL
═══════════════════════════ */
function EditModal({ bus, onClose, onSaved, toast }) {
  const [d, setD] = useState({
    busName: bus.busName || "", busNumber: bus.busNumber || "",
    operatorName: bus.operatorName || "", vendorName: bus.vendorName || "",
    busOwner: bus.busOwner || "", email: bus.email || "", phone: bus.phone || "",
    altPhone: bus.altPhone || "", city: bus.city || "", state: bus.state || "",
    country: bus.country || "", address: bus.address || "",
    fromCity: bus.fromCity || "", toCity: bus.toCity || "",
    routeName: bus.routeName || "",
    viaCities: (bus.viaCities || []).join(", "),
    departureTime: bus.departureTime || "", arrivalTime: bus.arrivalTime || "",
    journeyDuration: bus.journeyDuration || "", travelDate: bus.travelDate || "",
    busType: bus.busType || "AC Seater", busCategory: bus.busCategory || "seater",
    busModel: bus.busModel || "", seatLayoutType: bus.seatLayoutType || "2+2",
    totalSeats: bus.totalSeats || 40, busColor: bus.busColor || "",
    basePrice: bus.basePrice || "", offerPrice: bus.offerPrice || "",
    finalPrice: bus.finalPrice || "", tax: bus.tax || "",
    tollTax: bus.tollTax || "", discount: bus.discount || "",
    agentCommission: bus.agentCommission || "", vendorCost: bus.vendorCost || "",
    driverName: bus.driverName || "", driverPhone: bus.driverPhone || "",
    driverLicense: bus.driverLicense || "", helperName: bus.helperName || "",
    helperPhone: bus.helperPhone || "", rcNumber: bus.rcNumber || "",
    insuranceNumber: bus.insuranceNumber || "", permitNumber: bus.permitNumber || "",
    fitnessExpiry: bus.fitnessExpiry || "",
    amenities: (bus.amenities || []).join(", "),
    boardingPoints: (bus.boardingPoints || []).map(b => typeof b === "object" ? `${b.location}|${b.time}|${b.address}|${b.landmark}` : b).join(", "),
    droppingPoints: (bus.droppingPoints || []).map(b => typeof b === "object" ? `${b.location}|${b.time}|${b.address}|${b.landmark}` : b).join(", "),
    cancellationPolicy: bus.cancellationPolicy || "", notes: bus.notes || "",
    addedBy: bus.addedBy || "admin",
  });
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("basic");
  const u = k => e => setD(p => ({ ...p, [k]: e.target.value }));
  const BT = BUS_TYPES;

  const save = async () => {
    if (!d.busName.trim()) return toast.error("Bus name is required");
    setBusy(true);
    try {
      const fd = new FormData();
      Object.entries(d).forEach(([k, v]) => fd.append(k, v));
      const res = await fetch(`${API}/update/${bus._id}`, { method: "PUT", body: fd });
      const json = await res.json();
      if (json.success) { toast.success("✅ Bus updated!"); onSaved(); onClose(); }
      else toast.error(json.error || "Update failed");
    } catch (e) { toast.error("Error: " + e.message); }
    setBusy(false);
  };

  const ETABS = [
    { id: "basic", label: "🚌 Bus Info" },
    { id: "route", label: "🗺️ Route" },
    { id: "pricing", label: "💰 Pricing" },
    { id: "staff", label: "👤 Staff" },
  ];

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-hd">
          <h2>✏️ Edit — {bus.busName}</h2>
          <button className="x-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="tab-row">
            {ETABS.map(t => <button key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>{t.label}</button>)}
          </div>

          {tab === "basic" && (
            <>
              <div className="g g3" style={{ marginBottom: 12 }}>
                <F label="Bus Name" req><input className="inp" value={d.busName} onChange={u("busName")} /></F>
                <F label="Bus Number" req><input className="inp" value={d.busNumber} onChange={u("busNumber")} /></F>
                <F label="Operator Name"><input className="inp" value={d.operatorName} onChange={u("operatorName")} /></F>
              </div>
              <div className="g g4" style={{ marginBottom: 12 }}>
                <F label="Bus Type"><select className="sel-inp" value={d.busType} onChange={u("busType")}>{BT.map(t => <option key={t}>{t}</option>)}</select></F>
                <F label="Bus Category"><select className="sel-inp" value={d.busCategory} onChange={u("busCategory")}><option value="seater">Seater</option><option value="sleeper">Sleeper</option><option value="semi-sleeper">Semi Sleeper</option></select></F>
                <F label="Seat Layout"><select className="sel-inp" value={d.seatLayoutType} onChange={u("seatLayoutType")}>{SEAT_LAYOUTS.map(t => <option key={t}>{t}</option>)}</select></F>
                <F label="Total Seats"><input type="number" className="inp" value={d.totalSeats} onChange={u("totalSeats")} /></F>
              </div>
              <div className="g g3" style={{ marginBottom: 12 }}>
                <F label="Bus Model"><input className="inp" value={d.busModel} onChange={u("busModel")} /></F>
                <F label="Bus Color"><input className="inp" value={d.busColor} onChange={u("busColor")} /></F>
                <F label="Vendor Name"><input className="inp" value={d.vendorName} onChange={u("vendorName")} /></F>
              </div>
              <div className="g g4" style={{ marginBottom: 12 }}>
                <F label="Email"><input type="email" className="inp" value={d.email} onChange={u("email")} /></F>
                <F label="Phone"><input className="inp" value={d.phone} onChange={u("phone")} /></F>
                <F label="City"><input className="inp" value={d.city} onChange={u("city")} /></F>
                <F label="State"><input className="inp" value={d.state} onChange={u("state")} /></F>
              </div>
              <div className="g g2">
                <F label="Amenities (comma)"><input className="inp" value={d.amenities} onChange={u("amenities")} /></F>
                <F label="Notes"><input className="inp" value={d.notes} onChange={u("notes")} /></F>
              </div>
            </>
          )}

          {tab === "route" && (
            <>
              <div className="g g4" style={{ marginBottom: 12 }}>
                <F label="From City" req><input className="inp" value={d.fromCity} onChange={u("fromCity")} /></F>
                <F label="To City" req><input className="inp" value={d.toCity} onChange={u("toCity")} /></F>
                <F label="Via Cities"><input className="inp" value={d.viaCities} onChange={u("viaCities")} /></F>
                <F label="Travel Date"><input type="date" className="inp" value={d.travelDate} onChange={u("travelDate")} /></F>
              </div>
              <div className="g g3" style={{ marginBottom: 12 }}>
                <F label="Departure Time"><input type="time" className="inp" value={d.departureTime} onChange={u("departureTime")} /></F>
                <F label="Arrival Time"><input type="time" className="inp" value={d.arrivalTime} onChange={u("arrivalTime")} /></F>
                <F label="Duration"><input className="inp" value={d.journeyDuration} onChange={u("journeyDuration")} /></F>
              </div>
              <div className="g g2">
                <F label="Boarding Points"><textarea className="textarea-inp" value={d.boardingPoints} onChange={u("boardingPoints")} /></F>
                <F label="Dropping Points"><textarea className="textarea-inp" value={d.droppingPoints} onChange={u("droppingPoints")} /></F>
              </div>
            </>
          )}

          {tab === "pricing" && (
            <div className="g g4">
              <F label="Base Price ₹"><input type="number" className="inp" value={d.basePrice} onChange={u("basePrice")} /></F>
              <F label="Offer Price ₹"><input type="number" className="inp" value={d.offerPrice} onChange={u("offerPrice")} /></F>
              <F label="Final Price ₹"><input type="number" className="inp" value={d.finalPrice} onChange={u("finalPrice")} /></F>
              <F label="Discount"><input className="inp" value={d.discount} onChange={u("discount")} /></F>
              <F label="Tax %"><input type="number" className="inp" value={d.tax} onChange={u("tax")} /></F>
              <F label="Toll Tax ₹"><input type="number" className="inp" value={d.tollTax} onChange={u("tollTax")} /></F>
              <F label="Agent Commission %"><input type="number" className="inp" value={d.agentCommission} onChange={u("agentCommission")} /></F>
              <F label="Vendor Cost ₹"><input type="number" className="inp" value={d.vendorCost} onChange={u("vendorCost")} /></F>
            </div>
          )}

          {tab === "staff" && (
            <>
              <div className="g g3" style={{ marginBottom: 12 }}>
                <F label="Driver Name"><input className="inp" value={d.driverName} onChange={u("driverName")} /></F>
                <F label="Driver Phone"><input className="inp" value={d.driverPhone} onChange={u("driverPhone")} /></F>
                <F label="Driver License"><input className="inp" value={d.driverLicense} onChange={u("driverLicense")} /></F>
              </div>
              <div className="g g2" style={{ marginBottom: 12 }}>
                <F label="Helper Name"><input className="inp" value={d.helperName} onChange={u("helperName")} /></F>
                <F label="Helper Phone"><input className="inp" value={d.helperPhone} onChange={u("helperPhone")} /></F>
              </div>
              <div className="g g4">
                <F label="RC Number"><input className="inp" value={d.rcNumber} onChange={u("rcNumber")} /></F>
                <F label="Insurance No."><input className="inp" value={d.insuranceNumber} onChange={u("insuranceNumber")} /></F>
                <F label="Permit No."><input className="inp" value={d.permitNumber} onChange={u("permitNumber")} /></F>
                <F label="Fitness Expiry"><input type="date" className="inp" value={d.fitnessExpiry} onChange={u("fitnessExpiry")} /></F>
              </div>
            </>
          )}
        </div>
        <div className="modal-ft">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={busy}>{busy ? "Saving…" : "💾 Save Changes"}</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════
   CONFIRM
═══════════════════════════ */
function Confirm({ icon, title, msg, onYes, onNo, yesLabel, yesCls }) {
  return (
    <div className="overlay" onClick={onNo}>
      <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
        <div className="modal-body" style={{ padding: "30px 24px 10px" }}>
          <div className="cf-ico">{icon}</div>
          <div className="cf-t">{title}</div>
          <div className="cf-m">{msg}</div>
        </div>
        <div className="modal-ft">
          <button className="btn btn-ghost" onClick={onNo}>Cancel</button>
          <button className={`btn ${yesCls}`} onClick={onYes}>{yesLabel}</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════
   VIEW MODAL
═══════════════════════════ */
function ViewModal({ bus, onClose }) {
  const Row = ({ l, v }) => v ? (
    <div style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: ".83rem" }}>
      <div style={{ minWidth: 160, color: "var(--muted)", fontWeight: 500, fontSize: ".75rem" }}>{l}</div>
      <div style={{ fontWeight: 500, color: "var(--ink2)" }}>{v}</div>
    </div>
  ) : null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-hd">
          <h2>🚌 {bus.busName} — {bus.busNumber}</h2>
          <button className="x-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
            <div>
              <div className="sec-label" style={{ marginBottom: 10 }}><div className="sec-label-dot" />Bus Info</div>
              <Row l="Operator" v={bus.operatorName} />
              <Row l="Type" v={bus.busType} />
              <Row l="Model" v={bus.busModel} />
              <Row l="Color" v={bus.busColor} />
              <Row l="Layout" v={bus.seatLayoutType} />
              <Row l="Total Seats" v={bus.totalSeats} />
              <Row l="Available Seats" v={bus.availableSeats} />
            </div>
            <div>
              <div className="sec-label" style={{ marginBottom: 10 }}><div className="sec-label-dot" />Route</div>
              <Row l="From" v={bus.fromCity} />
              <Row l="To" v={bus.toCity} />
              <Row l="Departure" v={bus.departureTime} />
              <Row l="Arrival" v={bus.arrivalTime} />
              <Row l="Duration" v={bus.journeyDuration} />
              <Row l="Travel Date" v={bus.travelDate} />
            </div>
          </div>
          <hr className="divider" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
            <div>
              <div className="sec-label" style={{ marginBottom: 10 }}><div className="sec-label-dot" />Pricing</div>
              <Row l="Base Price" v={bus.basePrice ? `₹${bus.basePrice}` : null} />
              <Row l="Offer Price" v={bus.offerPrice ? `₹${bus.offerPrice}` : null} />
              <Row l="Final Price" v={bus.finalPrice ? `₹${bus.finalPrice}` : null} />
              <Row l="Tax" v={bus.tax ? `${bus.tax}%` : null} />
              <Row l="Toll Tax" v={bus.tollTax ? `₹${bus.tollTax}` : null} />
              <Row l="Agent Commission" v={bus.agentCommission ? `${bus.agentCommission}%` : null} />
            </div>
            <div>
              <div className="sec-label" style={{ marginBottom: 10 }}><div className="sec-label-dot" />Driver / Docs</div>
              <Row l="Driver" v={bus.driverName} />
              <Row l="Driver Phone" v={bus.driverPhone} />
              <Row l="RC Number" v={bus.rcNumber} />
              <Row l="Insurance" v={bus.insuranceNumber} />
              <Row l="Permit" v={bus.permitNumber} />
              <Row l="Fitness Expiry" v={bus.fitnessExpiry} />
            </div>
          </div>
          {bus.amenities?.length > 0 && (
            <>
              <hr className="divider" />
              <div className="sec-label" style={{ marginBottom: 10 }}><div className="sec-label-dot" />Amenities</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {bus.amenities.map(a => <span key={a} className="badge b-accent">{a}</span>)}
              </div>
            </>
          )}
        </div>
        <div className="modal-ft">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════
   MAIN PANEL
═══════════════════════════ */
export default function AdminBusPanel() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [srch, setSrch] = useState("");
  const [stF, setStF] = useState("all");
  const [typeF, setTypeF] = useState("all");
  const [editBus, setEditBus] = useState(null);
  const [viewBus, setViewBus] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/all`);
      const data = await res.json();
      setBuses(Array.isArray(data) ? data : []);
    } catch { toast.error("Failed to load buses"); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = buses.filter(b => {
    const q = srch.toLowerCase();
    const matchQ = !q || [b.busName, b.busNumber, b.fromCity, b.toCity, b.operatorName, b.vendorName, b.driverName].some(v => v?.toLowerCase().includes(q));
    const matchSt = stF === "all" || b.status === stF;
    const matchTy = typeF === "all" || b.busType === typeF;
    return matchQ && matchSt && matchTy;
  });

  const STATS = [
    { n: buses.length, l: "Total Buses", ic: "🚌", bg: "#dbeafe", col: "#1d4ed8" },
    { n: buses.filter(b => b.status === "approved").length, l: "Approved", ic: "✅", bg: "#d1fae5", col: "#059669" },
    { n: buses.filter(b => b.status === "pending").length, l: "Pending Approval", ic: "⏳", bg: "#fef3c7", col: "#d97706" },
    { n: buses.filter(b => b.status === "rejected").length, l: "Rejected", ic: "❌", bg: "#fee2e2", col: "#dc2626" },
  ];

  const doApprove = async (bus) => {
    try { const r = await fetch(`${API}/approve/${bus._id}`, { method: "PUT" }); const d = await r.json(); d.success ? toast.success(`"${bus.busName}" approved!`) : toast.error(d.error || "Failed"); load(); }
    catch { toast.error("Network error"); }
    setConfirm(null);
  };
  const doReject = async (bus) => {
    try { const r = await fetch(`${API}/reject/${bus._id}`, { method: "PUT" }); const d = await r.json(); d.success ? toast.warn(`"${bus.busName}" rejected`) : toast.error(d.error || "Failed"); load(); }
    catch { toast.error("Network error"); }
    setConfirm(null);
  };
  const doDelete = async (bus) => {
    try { const r = await fetch(`${API}/delete/${bus._id}`, { method: "DELETE" }); const d = await r.json(); d.success ? toast.info(`"${bus.busName}" deleted`) : toast.error(d.error || "Failed"); load(); }
    catch { toast.error("Network error"); }
    setConfirm(null);
  };

  const statusBadge = (s) => {
    const map = { approved: "b-approved", pending: "b-pending", rejected: "b-rejected" };
    const ic = { approved: "✓", pending: "⏳", rejected: "✗" };
    const st = s || "pending";
    return <span className={`badge ${map[st] || "b-gray"}`}>{ic[st] || ""} {st.charAt(0).toUpperCase() + st.slice(1)}</span>;
  };

  const uniqueTypes = [...new Set(buses.map(b => b.busType).filter(Boolean))];

  return (
    <>
      <style>{STYLES}</style>

      {/* TOPBAR */}
      <div className="topbar">
        <div className="brand">
          <div className="brand-icon">🚌</div>
          <div className="brand-name">Bus<span>Go</span></div>
        </div>
        <div className="topbar-right">
          <span className="pill">Admin Panel</span>
          <div className="topbar-avatar">AD</div>
        </div>
      </div>

      <div className="page">
        <div className="pg-head">
          <div>
            <div className="pg-title">Bus Management</div>
            <div className="pg-sub">Manage all buses, approve vendor submissions, and monitor fleet</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={load}>🔄 Refresh</button>
        </div>

        {/* STATS */}
        <div className="stats">
          {STATS.map(s => (
            <div className="stat-card" key={s.l}>
              <div>
                <div className="stat-num" style={{ color: s.col }}>{s.n}</div>
                <div className="stat-lbl">{s.l}</div>
              </div>
              <div className="stat-ico" style={{ background: s.bg }}>{s.ic}</div>
            </div>
          ))}
        </div>

        {/* ADD FORM */}
        <AddBusForm onAdded={load} toast={toast} />

        {/* TABLE */}
        <div className="tbl-card">
          <div className="tbl-header">
            <div className="tbl-header-l">
              <div className="tbl-title">All Buses</div>
              <div className="tbl-count">{filtered.length}</div>
            </div>
            <div className="tbl-controls">
              <div className="search-wrap">
                <span className="search-ic">🔍</span>
                <input className="search-inp" placeholder="Search name, city, operator…" value={srch} onChange={e => setSrch(e.target.value)} />
              </div>
              <select className="filter-sel" value={stF} onChange={e => setStF(e.target.value)}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <select className="filter-sel" value={typeF} onChange={e => setTypeF(e.target.value)}>
                <option value="all">All Types</option>
                {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Bus</th>
                  <th>Type</th>
                  <th>Route</th>
                  <th>Schedule</th>
                  <th>Pricing</th>
                  <th>Seats</th>
                  <th>Driver</th>
                  <th>Documents</th>
                  <th>Status</th>
                  <th>Added By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={11} style={{ textAlign: "center", padding: 48, color: "var(--muted)" }}>
                    <span className="spin" style={{ fontSize: "1.2rem" }}>↻</span>
                    <div style={{ marginTop: 8, fontSize: ".82rem" }}>Loading buses…</div>
                  </td></tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={11}>
                    <div className="empty">
                      <div className="empty-ico">🚌</div>
                      <div className="empty-t">{buses.length === 0 ? "No buses yet" : "No results found"}</div>
                      <div className="empty-s">{buses.length === 0 ? "Add your first bus using the form above." : "Try adjusting your search or filter."}</div>
                    </div>
                  </td></tr>
                )}
                {!loading && filtered.map(bus => (
                  <tr key={bus._id}>
                    {/* BUS */}
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {bus.frontImage
                          ? <img className="thumb" src={`http://localhost:9000/${bus.frontImage}`} alt="" onError={e => e.target.style.display = "none"} />
                          : <div className="thumb-ph">🚌</div>}
                        <div>
                          <div className="row-main">{bus.busName}</div>
                          <div className="row-sub">{bus.busNumber}</div>
                          {bus.operatorName && <div className="row-sub">{bus.operatorName}</div>}
                        </div>
                      </div>
                    </td>
                    {/* TYPE */}
                    <td>
                      <span className="badge b-accent">{bus.busType || "—"}</span>
                      {bus.busCategory && <div className="row-sub" style={{ marginTop: 4 }}>{bus.busCategory}</div>}
                    </td>
                    {/* ROUTE */}
                    <td>
                      <div className="row-main" style={{ whiteSpace: "nowrap" }}>{bus.fromCity || "—"} → {bus.toCity || "—"}</div>
                      {bus.journeyDuration && <div className="row-sub">{bus.journeyDuration}</div>}
                      {bus.viaCities?.length > 0 && <div className="row-sub">Via: {Array.isArray(bus.viaCities) ? bus.viaCities.join(", ") : bus.viaCities}</div>}
                    </td>
                    {/* SCHEDULE */}
                    <td>
                      <div>{bus.travelDate || "—"}</div>
                      {bus.departureTime && <div className="row-sub">{bus.departureTime}{bus.arrivalTime ? ` → ${bus.arrivalTime}` : ""}</div>}
                    </td>
                    {/* PRICING */}
                    <td>
                      <div className="price-main">₹{bus.finalPrice || bus.offerPrice || bus.basePrice || "—"}</div>
                      {bus.offerPrice && bus.basePrice && bus.offerPrice < bus.basePrice && <div className="price-old">₹{bus.basePrice}</div>}
                      {bus.tax && <div className="row-sub">+{bus.tax}% tax</div>}
                    </td>
                    {/* SEATS */}
                    <td style={{ textAlign: "center" }}>
                      <div style={{ fontWeight: 700 }}>{bus.availableSeats ?? bus.totalSeats ?? "—"}</div>
                      <div className="row-sub">/{bus.totalSeats || "—"}</div>
                    </td>
                    {/* DRIVER */}
                    <td>
                      {bus.driverName ? (
                        <>
                          <div style={{ fontWeight: 500, fontSize: ".82rem" }}>{bus.driverName}</div>
                          {bus.driverPhone && <div className="row-sub">{bus.driverPhone}</div>}
                        </>
                      ) : <span style={{ color: "var(--muted2)" }}>—</span>}
                    </td>
                    {/* DOCS */}
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {bus.rcNumber && <span className="badge b-gray" style={{ fontSize: ".64rem" }}>RC: {bus.rcNumber}</span>}
                        {bus.insuranceNumber && <span className="badge b-gray" style={{ fontSize: ".64rem" }}>Ins: {bus.insuranceNumber}</span>}
                        {!bus.rcNumber && !bus.insuranceNumber && <span style={{ color: "var(--muted2)", fontSize: ".8rem" }}>—</span>}
                      </div>
                    </td>
                    {/* STATUS */}
                    <td>{statusBadge(bus.status)}</td>
                    {/* ADDED BY */}
                    <td><span className="badge b-gray">{bus.addedBy || "vendor"}</span></td>
                    {/* ACTIONS */}
                    <td>
                      <div className="acts">
                        <button className="btn btn-ghost btn-xs" onClick={() => setViewBus(bus)} title="View Details">👁</button>
                        <button className="btn btn-ghost btn-xs" onClick={() => setEditBus(bus)} title="Edit">✏️</button>
                        {bus.status === "pending" && <>
                          <button className="btn btn-success btn-xs" onClick={() => setConfirm({ type: "approve", bus })}>✓</button>
                          <button className="btn btn-danger btn-xs" onClick={() => setConfirm({ type: "reject", bus })}>✗</button>
                        </>}
                        {bus.status === "approved" && <button className="btn btn-warn btn-xs" onClick={() => setConfirm({ type: "reject", bus })}>Revoke</button>}
                        {bus.status === "rejected" && <button className="btn btn-success btn-xs" onClick={() => setConfirm({ type: "approve", bus })}>Re-approve</button>}
                        <button className="btn btn-danger btn-xs" onClick={() => setConfirm({ type: "delete", bus })}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!loading && filtered.length > 0 && (
            <div className="tbl-foot">
              <span>Showing <strong>{filtered.length}</strong> of <strong>{buses.length}</strong> buses</span>
              <span>{buses.filter(b => b.status === "pending").length} pending approval</span>
            </div>
          )}
        </div>
      </div>

      {editBus && <EditModal bus={editBus} toast={toast} onClose={() => setEditBus(null)} onSaved={load} />}
      {viewBus && <ViewModal bus={viewBus} onClose={() => setViewBus(null)} />}

      {confirm?.type === "approve" && <Confirm icon="✅" title="Approve this bus?" msg={`"${confirm.bus.busName}" will become visible to users.`} yesLabel="✓ Approve" yesCls="btn-success" onYes={() => doApprove(confirm.bus)} onNo={() => setConfirm(null)} />}
      {confirm?.type === "reject" && <Confirm icon="⚠️" title="Reject / Revoke bus?" msg={`"${confirm.bus.busName}" will be hidden from users.`} yesLabel="✗ Reject" yesCls="btn-danger" onYes={() => doReject(confirm.bus)} onNo={() => setConfirm(null)} />}
      {confirm?.type === "delete" && <Confirm icon="🗑️" title="Delete permanently?" msg={`"${confirm.bus.busName}" will be deleted. This cannot be undone!`} yesLabel="Delete" yesCls="btn-danger" onYes={() => doDelete(confirm.bus)} onNo={() => setConfirm(null)} />}

      <div className="toasts">
        {toast.list.map(t => <div key={t.id} className={`toast ${t.cls}`}>{t.msg}</div>)}
      </div>
    </>
  );
}