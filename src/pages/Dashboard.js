// import { useState, useEffect, useCallback, useRef } from "react";
// import {
//   Plane, Hotel, Users, CreditCard, CalendarDays, TrendingUp, TrendingDown,
//   Bus, Car, Anchor, MapPin, Bell, Search, ChevronDown, ArrowUpRight,
//   Settings, BarChart2, Globe, Umbrella, Package, Train, Shield,
//   RefreshCw, Filter, Download, Activity, Zap, AlertTriangle,
//   CheckCircle, Clock, XCircle, WifiOff,
// } from "lucide-react";
// import {
//   AreaChart, Area, XAxis, YAxis, CartesianGrid,
//   Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
// } from "recharts";

// // ─── Data generators ────────────────────────────────────────────────────────
// const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
// const randF = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(1));

// const SERVICES = ["Flight", "Hotel", "Holiday", "Car", "Cruise", "Bus", "Train"];
// const ROUTES   = ["DEL → BOM","BLR → DEL","BOM → GOA","DEL → BLR","HYD → MAA","BOM → CCU","DEL → JAI","BLR → HYD","PNQ → DEL","CCU → BOM"];
// const HOTELS   = ["Taj Palace","Goa Marriott","Hyatt Regency","ITC Grand","Leela Palace","Oberoi"];
// const NAMES    = ["Rajesh Kumar","Priya Sharma","Arjun Singh","Sneha Patel","Vikram Mehta","Ananya Gupta","Rohit Verma","Kavya Nair","Suresh Reddy","Pooja Joshi","Amit Saxena","Neha Kapoor","Ravi Tiwari","Divya Menon","Sanjay Yadav"];
// const STATUSES = ["confirmed","pending","cancelled"];
// const PIE_LABELS  = ["Flights","Hotels","Holidays","Cars","Cruise","Others"];
// const PIE_COLORS  = ["#0ea5e9","#a855f7","#f97316","#22c55e","#f43f5e","#94a3b8"];

// let seq = 9821;

// const mkBooking = () => {
//   const svc = SERVICES[rand(0, SERVICES.length - 1)];
//   const raw = svc === "Flight"   ? rand(3000, 18000)
//             : svc === "Hotel"    ? rand(5000, 35000)
//             : svc === "Holiday"  ? rand(40000, 200000)
//             : svc === "Cruise"   ? rand(80000, 350000)
//             : rand(1000, 8000);
//   return {
//     id: `BK-${seq++}`,
//     name: NAMES[rand(0, NAMES.length - 1)],
//     service: svc,
//     route: svc === "Hotel" ? HOTELS[rand(0, HOTELS.length - 1)] : ROUTES[rand(0, ROUTES.length - 1)],
//     amount: `₹${raw.toLocaleString("en-IN")}`,
//     rawAmount: raw,
//     status: STATUSES[rand(0, 2)],
//     time: "just now",
//     ts: Date.now(),
//   };
// };

// const mkMonthly = () =>
//   ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"].map(month => ({
//     month, flights: rand(700,1600), hotels: rand(400,1100), holidays: rand(200,750), revenue: rand(60,165),
//   }));

// const mkRoutes = () => [
//   { route:"Delhi → Mumbai",      bookings: rand(280,400), growth: randF(-8,28)  },
//   { route:"Bangalore → Delhi",   bookings: rand(200,320), growth: randF(-5,22)  },
//   { route:"Mumbai → Goa",        bookings: rand(160,280), growth: randF(-3,35)  },
//   { route:"Delhi → Bangalore",   bookings: rand(130,240), growth: randF(-10,18) },
//   { route:"Hyderabad → Chennai", bookings: rand(100,200), growth: randF(-6,25)  },
// ];

// const mkPie = () => {
//   const raw = [rand(32,44),rand(18,28),rand(14,22),rand(7,13),rand(3,8)];
//   const sum = raw.reduce((a,b)=>a+b,0);
//   return [...raw, 100-sum].map((v,i) => ({ name: PIE_LABELS[i], value: v, color: PIE_COLORS[i] }));
// };

// // ─── Static configs ─────────────────────────────────────────────────────────
// const NAV_ITEMS = [
//   { icon: BarChart2, label:"Dashboard" }, { icon: Plane,   label:"Flights"   },
//   { icon: Hotel,     label:"Hotels"    }, { icon: Package, label:"Holidays"  },
//   { icon: Car,       label:"Cars"      }, { icon: Bus,     label:"Bus"       },
//   { icon: Train,     label:"Trains"    }, { icon: Anchor,  label:"Cruise"    },
//   { icon: Globe,     label:"Visa"      }, { icon: Shield,  label:"Insurance" },
//   { icon: Users,     label:"Agents"    }, { icon: Settings,label:"Settings"  },
// ];

// const SVC_ICON = { Flight:Plane, Hotel:Hotel, Holiday:Umbrella, Car:Car, Cruise:Anchor, Bus:Bus, Train:Train };
// const STATUS_META = {
//   confirmed: { bg:"#052e16", color:"#4ade80", label:"Confirmed", Icon:CheckCircle },
//   pending:   { bg:"#1c1917", color:"#fb923c", label:"Pending",   Icon:Clock       },
//   cancelled: { bg:"#1f0a0a", color:"#f87171", label:"Cancelled", Icon:XCircle     },
// };

// // ─── Sub-components ──────────────────────────────────────────────────────────
// const PulseDot = ({ color="#22c55e", size=9 }) => (
//   <span style={{ position:"relative", display:"inline-flex", width:size, height:size, flexShrink:0 }}>
//     <span style={{ position:"absolute", inset:0, borderRadius:"50%", background:color, opacity:0.35, animation:"ping 1.5s ease infinite" }} />
//     <span style={{ position:"relative", borderRadius:"50%", width:size, height:size, background:color }} />
//   </span>
// );

// const Chip = ({ label, active, onClick }) => (
//   <span onClick={onClick} style={{
//     display:"inline-flex", alignItems:"center", padding:"4px 11px",
//     borderRadius:20, fontSize:11, fontWeight:600, cursor:"pointer",
//     background: active ? "#1e3a5f" : "#0d1526",
//     color:       active ? "#38bdf8" : "#475569",
//     border:`1px solid ${active ? "#1e40af55" : "#1a2f4a"}`,
//     transition:"all 0.14s", userSelect:"none",
//   }}>{label}</span>
// );

// const TipBox = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div style={{ background:"#0d1526", border:"1px solid #1e3a5f", borderRadius:10, padding:"10px 14px", fontSize:12 }}>
//       <p style={{ color:"#64748b", marginBottom:6, fontWeight:700 }}>{label}</p>
//       {payload.map(p => (
//         <p key={p.name} style={{ color:p.color, margin:"3px 0", display:"flex", justifyContent:"space-between", gap:18 }}>
//           <span>{p.name}</span><strong>{p.value}</strong>
//         </p>
//       ))}
//     </div>
//   );
// };

// // ─── Main ────────────────────────────────────────────────────────────────────
// export default function Dashboard() {
//   const [activeNav,      setActiveNav]      = useState("Dashboard");
//   const [bookings,       setBookings]       = useState(() => Array.from({length:14}, mkBooking));
//   const [monthly,        setMonthly]        = useState(mkMonthly);
//   const [pie,            setPie]            = useState(mkPie);
//   const [routes,         setRoutes]         = useState(mkRoutes);
//   const [stats,          setStats]          = useState({ flights:1280, hotels:965, users:23410, revenue:132.0, bookings:7120 });
//   const [sparkline,      setSparkline]      = useState(() => Array.from({length:24},(_,i)=>({i, v:rand(75,155)})));
//   const [notifs,         setNotifs]         = useState([]);
//   const [showNotifs,     setShowNotifs]     = useState(false);
//   const [isLive,         setIsLive]         = useState(true);
//   const [refreshing,     setRefreshing]     = useState(false);
//   const [lastRefresh,    setLastRefresh]    = useState(new Date());
//   const [chartTab,       setChartTab]       = useState("3M");
//   const [filterStatus,   setFilterStatus]   = useState("all");
//   const [filterService,  setFilterService]  = useState("all");
//   const [searchQuery,    setSearchQuery]    = useState("");
//   const timerRef = useRef(null);

//   // live tick
//   const tick = useCallback(() => {
//     const nb = mkBooking();
//     setBookings(p => [nb, ...p.slice(0,24)]);
//     setStats(p => ({
//       flights:  p.flights  + rand(0,3),
//       hotels:   p.hotels   + rand(0,2),
//       users:    p.users    + rand(0,6),
//       revenue:  parseFloat((p.revenue + randF(0,0.9)).toFixed(1)),
//       bookings: p.bookings + rand(0,4),
//     }));
//     setSparkline(p => [...p.slice(1), { i: p[p.length-1].i+1, v: rand(75,155) }]);
//     if (rand(0,5) === 0) {
//       setNotifs(p => [{id:Date.now(), msg:`New ${nb.service}: ${nb.amount}`, status:nb.status, time:"just now"}, ...p.slice(0,11)]);
//     }
//   }, []);

//   useEffect(() => {
//     if (isLive) timerRef.current = setInterval(tick, 2600);
//     else        clearInterval(timerRef.current);
//     return () => clearInterval(timerRef.current);
//   }, [isLive, tick]);

//   const doRefresh = async () => {
//     setRefreshing(true);
//     await new Promise(r => setTimeout(r, 850));
//     setMonthly(mkMonthly()); setPie(mkPie()); setRoutes(mkRoutes());
//     setLastRefresh(new Date());
//     setRefreshing(false);
//   };

//   // derived
//   const filtered = bookings.filter(b => {
//     if (filterStatus  !== "all" && b.status  !== filterStatus)  return false;
//     if (filterService !== "all" && b.service !== filterService) return false;
//     if (searchQuery) {
//       const q = searchQuery.toLowerCase();
//       return b.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q) || b.route.toLowerCase().includes(q);
//     }
//     return true;
//   });

//   const confirmedBookings = bookings.filter(b => b.status === "confirmed");
//   const liveRevenue  = confirmedBookings.reduce((s,b) => s+b.rawAmount, 0);
//   const avgTicket    = bookings.length ? Math.round(bookings.reduce((s,b)=>s+b.rawAmount,0)/bookings.length) : 0;
//   const pendingCount = bookings.filter(b=>b.status==="pending").length;

//   const STAT_CARDS = [
//     { Icon:Plane,       label:"Flights",  value:stats.flights.toLocaleString("en-IN"),  change:"+8.2%",  up:true,  color:"#0ea5e9", bg:"#0c1e35" },
//     { Icon:Hotel,       label:"Hotels",   value:stats.hotels.toLocaleString("en-IN"),   change:"+5.1%",  up:true,  color:"#a855f7", bg:"#1a0d2e" },
//     { Icon:Users,       label:"Users",    value:stats.users.toLocaleString("en-IN"),    change:"+12.4%", up:true,  color:"#22c55e", bg:"#0a1f12" },
//     { Icon:CreditCard,  label:"Revenue",  value:`₹${stats.revenue} Cr`,                change:"+9.8%",  up:true,  color:"#f97316", bg:"#1f1005" },
//     { Icon:CalendarDays,label:"Bookings", value:stats.bookings.toLocaleString("en-IN"), change:"-2.1%",  up:false, color:"#f43f5e", bg:"#200510" },
//   ];

//   return (
//     <div style={{ minHeight:"100vh", background:"#060b18", color:"#e2e8f0", fontFamily:"'Plus Jakarta Sans','DM Sans',sans-serif" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
//         @keyframes ping    { 0%,100%{transform:scale(1);opacity:.35} 50%{transform:scale(2);opacity:0} }
//         @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes slideIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes spin    { to{transform:rotate(360deg)} }
//         * { box-sizing:border-box; margin:0; padding:0; }
//         ::-webkit-scrollbar{width:4px;height:4px}
//         ::-webkit-scrollbar-track{background:transparent}
//         ::-webkit-scrollbar-thumb{background:#1e3a5f;border-radius:4px}
//         .sc { background:linear-gradient(145deg,#0d1526,#0a1220); border:1px solid #1a2f4a; border-radius:16px; padding:20px; cursor:pointer; transition:transform .2s,border-color .2s,box-shadow .2s; animation:fadeUp .5s ease both; }
//         .sc:hover { transform:translateY(-3px); border-color:#2563eb55; box-shadow:0 8px 28px #0ea5e918; }
//         .nav-pill { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:8px; cursor:pointer; font-size:13px; font-weight:500; color:#64748b; transition:all .15s; white-space:nowrap; border:1px solid transparent; user-select:none; }
//         .nav-pill:hover  { background:#0f1f35; color:#cbd5e1; }
//         .nav-pill.active { background:#1e3a5f; color:#38bdf8; border-color:#1e40af44; }
//         .brow { border-bottom:1px solid #0f1f3522; transition:background .12s; }
//         .brow:hover { background:#0d1a2e99; }
//         .brow.fresh { animation:slideIn .3s ease; }
//         .ibtn { background:none; border:none; cursor:pointer; display:flex; align-items:center; gap:6px; padding:7px 12px; border-radius:8px; font-size:12px; font-weight:600; transition:all .15s; font-family:inherit; }
//         input::placeholder { color:#2a3f5a; }
//       `}</style>

//       {/* ══ TOPBAR ══════════════════════════════════════════════════════════ */}
//       <div style={{ position:"sticky", top:0, zIndex:50, background:"#07101e", borderBottom:"1px solid #0f1f35", height:60, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 28px" }}>
//         {/* Logo + Search */}
//         <div style={{ display:"flex", alignItems:"center", gap:18 }}>
//           <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
//             <div style={{ width:36, height:36, background:"linear-gradient(135deg,#0ea5e9,#6366f1)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }}>
//               <Plane size={16} color="white" />
//             </div>
//             <div>
//               <div style={{ fontWeight:800, fontSize:15, color:"#f1f5f9", letterSpacing:"-0.01em" }}>BirdMyTrip</div>
//               <div style={{ fontSize:10, color:"#2a3f5a", textTransform:"uppercase", letterSpacing:"0.06em", marginTop:1 }}>Admin Panel</div>
//             </div>
//           </div>
//           <div style={{ display:"flex", alignItems:"center", gap:8, background:"#0d1526", border:"1px solid #1a2f4a", borderRadius:10, padding:"7px 14px" }}>
//             <Search size={13} color="#2a3f5a" />
//             <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
//               placeholder="Search bookings, users…"
//               style={{ background:"none", border:"none", outline:"none", color:"#94a3b8", fontSize:13, width:200, fontFamily:"inherit" }} />
//           </div>
//         </div>

//         {/* Right controls */}
//         <div style={{ display:"flex", alignItems:"center", gap:10 }}>
//           {/* Live toggle */}
//           <button onClick={() => setIsLive(v=>!v)} className="ibtn" style={{
//             color: isLive?"#22c55e":"#64748b",
//             background: isLive?"#0a1f1280":"#0d1526",
//             border:`1px solid ${isLive?"#22c55e35":"#1a2f4a"}`,
//           }}>
//             {isLive ? <><PulseDot color="#22c55e" /><span>Live</span></> : <><WifiOff size={13}/><span>Paused</span></>}
//           </button>

//           {/* Refresh */}
//           <button onClick={doRefresh} disabled={refreshing} className="ibtn" style={{ color:"#64748b", border:"1px solid #1a2f4a", background:"#0d1526" }}>
//             <RefreshCw size={13} style={{ animation:refreshing?"spin .8s linear infinite":"none" }} />
//             <span>{refreshing ? "Refreshing…" : "Refresh"}</span>
//           </button>

//           {/* Notifications */}
//           <div style={{ position:"relative" }}>
//             <button className="ibtn" onClick={()=>setShowNotifs(v=>!v)} style={{ color:"#64748b", border:"1px solid #1a2f4a", background:"#0d1526", position:"relative" }}>
//               <Bell size={14} />
//               {notifs.length > 0 && (
//                 <span style={{ position:"absolute", top:-5, right:-5, minWidth:18, height:18, background:"#f97316", borderRadius:9, fontSize:10, fontWeight:800, color:"white", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #07101e", padding:"0 4px" }}>
//                   {notifs.length > 9 ? "9+" : notifs.length}
//                 </span>
//               )}
//             </button>
//             {showNotifs && (
//               <div style={{ position:"absolute", top:"calc(100% + 10px)", right:0, width:300, background:"#0d1526", border:"1px solid #1e3a5f", borderRadius:14, overflow:"hidden", zIndex:999, animation:"slideIn .2s ease" }}>
//                 <div style={{ padding:"12px 16px", borderBottom:"1px solid #0f1f35", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
//                   <span style={{ fontSize:13, fontWeight:700, color:"#f1f5f9" }}>Notifications</span>
//                   <button className="ibtn" style={{ fontSize:11, color:"#475569", padding:"2px 6px" }} onClick={()=>setNotifs([])}>Clear all</button>
//                 </div>
//                 {notifs.length === 0
//                   ? <div style={{ padding:"20px 16px", color:"#334155", fontSize:13, textAlign:"center" }}>No new notifications</div>
//                   : notifs.map(n => (
//                     <div key={n.id} style={{ padding:"10px 16px", borderBottom:"1px solid #0f1f3520", display:"flex", gap:10, alignItems:"flex-start" }}>
//                       <div style={{ width:8, height:8, borderRadius:"50%", background:STATUS_META[n.status]?.color??"#38bdf8", marginTop:4, flexShrink:0 }} />
//                       <div>
//                         <div style={{ fontSize:12, color:"#cbd5e1" }}>{n.msg}</div>
//                         <div style={{ fontSize:11, color:"#2a3f5a", marginTop:2 }}>{n.time}</div>
//                       </div>
//                     </div>
//                   ))
//                 }
//               </div>
//             )}
//           </div>

//           {/* Profile */}
//           <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", padding:"4px 10px 4px 4px", borderRadius:24, border:"1px solid #1a2f4a", background:"#0d1526" }}>
//             <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#0ea5e9)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800 }}>AD</div>
//             <span style={{ fontSize:13, fontWeight:600, color:"#cbd5e1" }}>Admin</span>
//             <ChevronDown size={13} color="#334155" />
//           </div>
//         </div>
//       </div>

//       {/* ══ NAV BAR ═════════════════════════════════════════════════════════ */}
//       <div style={{ position:"sticky", top:60, zIndex:40, background:"#07101e", borderBottom:"1px solid #0f1f35", padding:"8px 28px", display:"flex", gap:4, overflowX:"auto" }}>
//         {NAV_ITEMS.map(({ icon:Icon, label }) => (
//           <div key={label} className={`nav-pill${activeNav===label?" active":""}`} onClick={()=>setActiveNav(label)}>
//             <Icon size={13} />{label}
//           </div>
//         ))}
//       </div>

//       {/* ══ CONTENT ═════════════════════════════════════════════════════════ */}
//       <div style={{ padding:"28px" }}>

//         {/* Page header */}
//         <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
//           <div>
//             <h1 style={{ fontWeight:800, fontSize:27, color:"#f1f5f9", letterSpacing:"-0.025em" }}>Dashboard Overview</h1>
//             <p style={{ color:"#2a3f5a", fontSize:13, marginTop:5, display:"flex", alignItems:"center", gap:8 }}>
//               <Activity size={12} color="#22c55e" />
//               Refreshed {lastRefresh.toLocaleTimeString("en-IN")}
//               {isLive && <><span style={{color:"#1a2f4a"}}>·</span><PulseDot color="#22c55e" size={8}/><span style={{color:"#22c55e"}}>Live</span></>}
//             </p>
//           </div>
//           <button className="ibtn" style={{ color:"#64748b", border:"1px solid #1a2f4a", background:"#0d1526" }}>
//             <Download size={13}/><span>Export</span>
//           </button>
//         </div>

//         {/* Stat cards */}
//         <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:16, marginBottom:22 }}>
//           {STAT_CARDS.map(({ Icon, label, value, change, up, color, bg }, i) => (
//             <div key={label} className="sc" style={{ animationDelay:`${i*55}ms` }}>
//               <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
//                 <div style={{ width:42, height:42, borderRadius:12, background:bg, border:`1px solid ${color}28`, display:"flex", alignItems:"center", justifyContent:"center" }}>
//                   <Icon size={18} color={color} />
//                 </div>
//                 <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:12, fontWeight:700, color:up?"#4ade80":"#f87171", background:up?"#4ade8012":"#f8717112", padding:"3px 9px", borderRadius:20, border:`1px solid ${up?"#4ade8028":"#f8717128"}` }}>
//                   {up ? <TrendingUp size={11}/> : <TrendingDown size={11}/>}{change}
//                 </span>
//               </div>
//               <div style={{ fontSize:24, fontWeight:800, color:"#f1f5f9", letterSpacing:"-0.02em" }}>{value}</div>
//               <div style={{ fontSize:12, color:"#334155", marginTop:5 }}>{label} this month</div>
//             </div>
//           ))}
//         </div>

//         {/* Summary strip */}
//         <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:22 }}>
//           {[
//             { label:"Confirmed Revenue", value:`₹${liveRevenue.toLocaleString("en-IN")}`, color:"#f97316", Icon:Zap },
//             { label:"Confirmed today",   value:confirmedBookings.length,                  color:"#22c55e", Icon:CheckCircle },
//             { label:"Pending approval",  value:pendingCount,                              color:"#fb923c", Icon:AlertTriangle },
//             { label:"Avg ticket size",   value:`₹${avgTicket.toLocaleString("en-IN")}`,   color:"#38bdf8", Icon:CreditCard },
//           ].map(({ label, value, color, Icon }) => (
//             <div key={label} style={{ background:"#0d1526", border:"1px solid #1a2f4a", borderRadius:12, padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
//               <div style={{ width:38, height:38, borderRadius:10, background:`${color}14`, border:`1px solid ${color}22`, display:"flex", alignItems:"center", justifyContent:"center" }}>
//                 <Icon size={16} color={color} />
//               </div>
//               <div>
//                 <div style={{ fontSize:18, fontWeight:800, color:"#f1f5f9", letterSpacing:"-0.01em" }}>{value}</div>
//                 <div style={{ fontSize:11, color:"#2a3f5a", marginTop:2 }}>{label}</div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Charts row */}
//         <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:16, marginBottom:22 }}>

//           {/* Area chart */}
//           <div style={{ background:"#0a0f1e", border:"1px solid #1a2f4a", borderRadius:16, padding:20 }}>
//             <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
//               <div>
//                 <h3 style={{ fontWeight:700, fontSize:15, color:"#f1f5f9" }}>Booking Trends</h3>
//                 <p style={{ fontSize:12, color:"#2a3f5a", marginTop:2 }}>Monthly by service · click tab to refresh</p>
//               </div>
//               <div style={{ display:"flex", gap:5 }}>
//                 {["7D","1M","3M","1Y"].map(t => (
//                   <button key={t} onClick={()=>{ setChartTab(t); doRefresh(); }} style={{
//                     padding:"4px 10px", borderRadius:6, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
//                     background: t===chartTab?"#1e3a5f":"transparent",
//                     border:     t===chartTab?"1px solid #1e40af55":"1px solid #1a2f4a",
//                     color:      t===chartTab?"#38bdf8":"#475569",
//                   }}>{t}</button>
//                 ))}
//               </div>
//             </div>
//             <ResponsiveContainer width="100%" height={220}>
//               <AreaChart data={monthly}>
//                 <defs>
//                   {[["gF","#0ea5e9"],["gH","#a855f7"],["gHo","#f97316"]].map(([id,c]) => (
//                     <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%"  stopColor={c} stopOpacity={0.22}/>
//                       <stop offset="95%" stopColor={c} stopOpacity={0}/>
//                     </linearGradient>
//                   ))}
//                 </defs>
//                 <CartesianGrid stroke="#0f1f35" strokeDasharray="3 3"/>
//                 <XAxis dataKey="month" tick={{fill:"#2a3f5a",fontSize:11}} axisLine={false} tickLine={false}/>
//                 <YAxis tick={{fill:"#2a3f5a",fontSize:11}} axisLine={false} tickLine={false}/>
//                 <Tooltip content={<TipBox/>}/>
//                 <Area type="monotone" dataKey="flights"  name="Flights"  stroke="#0ea5e9" strokeWidth={2} fill="url(#gF)"/>
//                 <Area type="monotone" dataKey="hotels"   name="Hotels"   stroke="#a855f7" strokeWidth={2} fill="url(#gH)"/>
//                 <Area type="monotone" dataKey="holidays" name="Holidays" stroke="#f97316" strokeWidth={2} fill="url(#gHo)"/>
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Right col: Pie + Sparkline */}
//           <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
//             <div style={{ background:"#0a0f1e", border:"1px solid #1a2f4a", borderRadius:16, padding:18, flex:1 }}>
//               <h3 style={{ fontWeight:700, fontSize:14, color:"#f1f5f9", marginBottom:3 }}>Revenue Split</h3>
//               <p style={{ fontSize:11, color:"#2a3f5a", marginBottom:12 }}>By service category</p>
//               <ResponsiveContainer width="100%" height={120}>
//                 <PieChart>
//                   <Pie data={pie} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
//                     {pie.map((e,i) => <Cell key={i} fill={e.color}/>)}
//                   </Pie>
//                   <Tooltip formatter={v=>`${v}%`} contentStyle={{background:"#0d1526",border:"1px solid #1e3a5f",borderRadius:8,fontSize:11}}/>
//                 </PieChart>
//               </ResponsiveContainer>
//               <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px 8px" }}>
//                 {pie.map(d => (
//                   <div key={d.name} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11 }}>
//                     <div style={{ width:7, height:7, borderRadius:2, background:d.color, flexShrink:0 }}/>
//                     <span style={{ color:"#475569" }}>{d.name}</span>
//                     <span style={{ color:"#94a3b8", fontWeight:700, marginLeft:"auto" }}>{d.value}%</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Live sparkline */}
//             <div style={{ background:"#0a0f1e", border:"1px solid #1a2f4a", borderRadius:16, padding:"15px 18px" }}>
//               <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
//                 <div>
//                   <p style={{ fontSize:11, color:"#2a3f5a" }}>Live Revenue (₹ Cr)</p>
//                   <p style={{ fontSize:22, fontWeight:800, color:"#f97316", letterSpacing:"-0.025em", marginTop:2 }}>{stats.revenue}</p>
//                 </div>
//                 <PulseDot color="#f97316"/>
//               </div>
//               <ResponsiveContainer width="100%" height={48}>
//                 <LineChart data={sparkline}>
//                   <Line type="monotone" dataKey="v" stroke="#f97316" strokeWidth={2} dot={false}/>
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>

//         {/* Bottom row */}
//         <div style={{ display:"grid", gridTemplateColumns:"1fr 310px", gap:16 }}>

//           {/* Bookings table */}
//           <div style={{ background:"#0a0f1e", border:"1px solid #1a2f4a", borderRadius:16, padding:20, overflow:"hidden" }}>
//             <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
//               <div>
//                 <h3 style={{ fontWeight:700, fontSize:15, color:"#f1f5f9" }}>Recent Bookings</h3>
//                 <p style={{ fontSize:12, color:"#2a3f5a", marginTop:2, display:"flex", alignItems:"center", gap:6 }}>
//                   {isLive && <PulseDot color="#22c55e" size={7}/>}
//                   {filtered.length} of {bookings.length} shown
//                 </p>
//               </div>
//               <button className="ibtn" style={{ color:"#38bdf8", background:"none", border:"none", fontSize:12 }}>
//                 View all <ArrowUpRight size={12}/>
//               </button>
//             </div>

//             {/* Filter bar */}
//             <div style={{ display:"flex", gap:7, marginBottom:14, flexWrap:"wrap", alignItems:"center" }}>
//               <Filter size={12} color="#2a3f5a"/>
//               {["all","confirmed","pending","cancelled"].map(s => (
//                 <Chip key={s} label={s==="all"?"All":s.charAt(0).toUpperCase()+s.slice(1)} active={filterStatus===s} onClick={()=>setFilterStatus(s)}/>
//               ))}
//               <div style={{ width:1, height:16, background:"#1a2f4a" }}/>
//               <select value={filterService} onChange={e=>setFilterService(e.target.value)}
//                 style={{ background:"#0d1526", border:"1px solid #1a2f4a", color:"#94a3b8", fontSize:12, borderRadius:8, padding:"5px 10px", outline:"none", cursor:"pointer", fontFamily:"inherit" }}>
//                 <option value="all">All Services</option>
//                 {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
//               </select>
//             </div>

//             {/* Table */}
//             <div style={{ overflowX:"auto" }}>
//               <table style={{ width:"100%", borderCollapse:"collapse", minWidth:580 }}>
//                 <thead>
//                   <tr style={{ borderBottom:"1px solid #0f1f35" }}>
//                     {["Booking ID","Customer","Service","Details","Amount","Status","Time"].map(h => (
//                       <th key={h} style={{ fontSize:10, color:"#2a3f5a", fontWeight:700, textAlign:"left", padding:"0 10px 10px", textTransform:"uppercase", letterSpacing:"0.08em", whiteSpace:"nowrap" }}>{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filtered.slice(0,10).map((b, idx) => {
//                     const st  = STATUS_META[b.status];
//                     const SIcon    = SVC_ICON[b.service] || Package;
//                     const StIcon   = st.Icon;
//                     return (
//                       <tr key={b.id} className={`brow${idx===0&&isLive?" fresh":""}`}>
//                         <td style={{ padding:"11px 10px", fontSize:12, color:"#38bdf8", fontWeight:700, fontVariantNumeric:"tabular-nums" }}>{b.id}</td>
//                         <td style={{ padding:"11px 10px", fontSize:12, color:"#e2e8f0", fontWeight:500, whiteSpace:"nowrap" }}>{b.name}</td>
//                         <td style={{ padding:"11px 10px" }}>
//                           <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#64748b" }}><SIcon size={11}/>{b.service}</span>
//                         </td>
//                         <td style={{ padding:"11px 10px", fontSize:12, color:"#475569", whiteSpace:"nowrap" }}>{b.route}</td>
//                         <td style={{ padding:"11px 10px", fontSize:12, color:"#f1f5f9", fontWeight:700, fontVariantNumeric:"tabular-nums", whiteSpace:"nowrap" }}>{b.amount}</td>
//                         <td style={{ padding:"11px 10px" }}>
//                           <span style={{ background:st.bg, color:st.color, border:`1px solid ${st.color}28`, borderRadius:20, padding:"3px 9px", fontSize:11, fontWeight:700, display:"inline-flex", alignItems:"center", gap:4 }}>
//                             <StIcon size={9}/>{st.label}
//                           </span>
//                         </td>
//                         <td style={{ padding:"11px 10px", fontSize:11, color:"#2a3f5a", whiteSpace:"nowrap" }}>{b.time}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//               {filtered.length === 0 && (
//                 <div style={{ textAlign:"center", padding:32, color:"#2a3f5a", fontSize:13 }}>No bookings match filters</div>
//               )}
//             </div>
//           </div>

//           {/* Right: routes + quick stats */}
//           <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
//             <div style={{ background:"#0a0f1e", border:"1px solid #1a2f4a", borderRadius:16, padding:20 }}>
//               <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
//                 <div>
//                   <h3 style={{ fontWeight:700, fontSize:14, color:"#f1f5f9" }}>Top Routes</h3>
//                   <p style={{ fontSize:11, color:"#2a3f5a", marginTop:2 }}>This month</p>
//                 </div>
//                 <MapPin size={13} color="#2a3f5a"/>
//               </div>
//               <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
//                 {routes.map((r, i) => (
//                   <div key={r.route}>
//                     <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
//                       <div style={{ display:"flex", alignItems:"center", gap:7 }}>
//                         <div style={{ width:19, height:19, borderRadius:5, background:"#0f1f35", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#475569", fontWeight:800 }}>{i+1}</div>
//                         <span style={{ fontSize:12, color:"#e2e8f0", fontWeight:500 }}>{r.route}</span>
//                       </div>
//                       <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, fontWeight:700, color:r.growth>=0?"#4ade80":"#f87171" }}>
//                         {r.growth>=0?<TrendingUp size={10}/>:<TrendingDown size={10}/>}
//                         {r.growth>=0?"+":""}{r.growth}%
//                       </span>
//                     </div>
//                     <div style={{ display:"flex", alignItems:"center", gap:7 }}>
//                       <div style={{ flex:1, height:3, background:"#0f1f35", borderRadius:4, overflow:"hidden" }}>
//                         <div style={{ height:"100%", width:`${(r.bookings/routes[0].bookings)*100}%`, background:"linear-gradient(90deg,#0ea5e9,#6366f1)", borderRadius:4, transition:"width .9s ease" }}/>
//                       </div>
//                       <span style={{ fontSize:11, color:"#334155", width:28, textAlign:"right", fontVariantNumeric:"tabular-nums" }}>{r.bookings}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div style={{ background:"#0a0f1e", border:"1px solid #1a2f4a", borderRadius:16, padding:20 }}>
//               <h3 style={{ fontWeight:700, fontSize:14, color:"#f1f5f9", marginBottom:14 }}>Quick Stats</h3>
//               <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
//                 {[
//                   { label:"Avg Ticket",    value:`₹${avgTicket.toLocaleString("en-IN")}`, Icon:CreditCard,  color:"#38bdf8" },
//                   { label:"Active Agents", value:rand(130,158).toString(),                Icon:Users,       color:"#a855f7" },
//                   { label:"Pending PNRs",  value:pendingCount.toString(),                 Icon:CalendarDays,color:"#fb923c" },
//                   { label:"Live Flights",  value:rand(80,115).toString(),                 Icon:Plane,       color:"#22c55e" },
//                 ].map(({ label, value, Icon, color }) => (
//                   <div key={label} style={{ background:"#0d1526", borderRadius:10, padding:"11px 12px", border:"1px solid #1a2f4a" }}>
//                     <div style={{ fontSize:11, color:"#2a3f5a", marginBottom:5, display:"flex", alignItems:"center", gap:5 }}>
//                       <Icon size={10} color={color}/> {label}
//                     </div>
//                     <div style={{ fontSize:16, fontWeight:800, color:"#f1f5f9", letterSpacing:"-0.01em" }}>{value}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Hotel, Users, CreditCard, CalendarDays, TrendingUp, TrendingDown,
  Bus, Car, Anchor, MapPin, Bell, Search, ChevronDown, ArrowUpRight,
  Settings, BarChart2, Globe, Umbrella, Package, Train, Shield,
  RefreshCw, Filter, Download, Activity, Zap, AlertTriangle,
  CheckCircle, Clock, XCircle, WifiOff, Star, BedDouble,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
} from "recharts";

// ─── Helpers ────────────────────────────────────────────────────────────────
const rand  = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randF = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(1));

const SERVICES = ["Hotel", "Holiday", "Car", "Cruise", "Bus", "Train"];
const NAMES    = ["Rajesh Kumar","Priya Sharma","Arjun Singh","Sneha Patel","Vikram Mehta","Ananya Gupta","Rohit Verma","Kavya Nair","Suresh Reddy","Pooja Joshi","Amit Saxena","Neha Kapoor","Ravi Tiwari","Divya Menon","Sanjay Yadav"];
const STATUSES = ["confirmed","pending","cancelled"];
const PIE_LABELS = ["Hotels","Holidays","Cars","Cruise","Bus","Train"];
const PIE_COLORS = ["#185FA5","#639922","#BA7517","#D4537E","#1D9E75","#888780"];

let seq = 9821;

const mkBooking = () => {
  const svc = SERVICES[rand(0, SERVICES.length - 1)];
  const raw = svc === "Hotel"   ? rand(5000, 35000)
            : svc === "Holiday" ? rand(40000, 200000)
            : svc === "Cruise"  ? rand(80000, 350000)
            : rand(1000, 8000);
  return {
    id: `BK-${seq++}`,
    name: NAMES[rand(0, NAMES.length - 1)],
    service: svc,
    route: svc === "Hotel" ? "See hotel data below" : `City ${rand(1,9)} → City ${rand(1,9)}`,
    amount: `₹${raw.toLocaleString("en-IN")}`,
    rawAmount: raw,
    status: STATUSES[rand(0, 2)],
    time: "just now",
    ts: Date.now(),
  };
};

const mkMonthly = () =>
  ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"].map(month => ({
    month,
    hotels:   rand(400, 1100),
    holidays: rand(200, 750),
    revenue:  rand(40, 130),
  }));

const mkPie = () => {
  const raw = [rand(30,42), rand(18,26), rand(12,20), rand(6,12), rand(4,9)];
  const sum = raw.reduce((a, b) => a + b, 0);
  return [...raw, 100 - sum].map((v, i) => ({ name: PIE_LABELS[i], value: v, color: PIE_COLORS[i] }));
};

// ─── Nav config ─────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { icon: BarChart2, label: "Dashboard" },
  { icon: Hotel,     label: "Hotels"    },
  { icon: Package,   label: "Holidays"  },
  { icon: Car,       label: "Cars"      },
  { icon: Bus,       label: "Bus"       },
  { icon: Train,     label: "Trains"    },
  { icon: Anchor,    label: "Cruise"    },
  { icon: Globe,     label: "Visa"      },
  { icon: Shield,    label: "Insurance" },
  { icon: Users,     label: "Agents"    },
  { icon: Settings,  label: "Settings"  },
];

const SVC_ICON = { Hotel, Holiday: Umbrella, Car, Cruise: Anchor, Bus, Train };

const STATUS_META = {
  confirmed: { bg: "#F0FDF4", color: "#166534", border: "#BBF7D0", label: "Confirmed", Icon: CheckCircle },
  pending:   { bg: "#FFFBEB", color: "#92400E", border: "#FDE68A", label: "Pending",   Icon: Clock       },
  cancelled: { bg: "#FEF2F2", color: "#991B1B", border: "#FECACA", label: "Cancelled", Icon: XCircle     },
};

// ─── Sub-components ──────────────────────────────────────────────────────────
const PulseDot = ({ color = "#16A34A", size = 9 }) => (
  <span style={{ position: "relative", display: "inline-flex", width: size, height: size, flexShrink: 0 }}>
    <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color, opacity: 0.3, animation: "ping 1.5s ease infinite" }} />
    <span style={{ position: "relative", borderRadius: "50%", width: size, height: size, background: color }} />
  </span>
);

const Chip = ({ label, active, onClick }) => (
  <span onClick={onClick} style={{
    display: "inline-flex", alignItems: "center", padding: "4px 12px",
    borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer",
    background: active ? "#EFF6FF" : "#F8FAFC",
    color:       active ? "#1D4ED8" : "#64748B",
    border:     `1px solid ${active ? "#BFDBFE" : "#E2E8F0"}`,
    transition: "all 0.14s", userSelect: "none",
  }}>{label}</span>
);

const TipBox = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "10px 14px", fontSize: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
      <p style={{ color: "#64748B", marginBottom: 6, fontWeight: 600 }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color, margin: "3px 0", display: "flex", justifyContent: "space-between", gap: 18 }}>
          <span>{p.name}</span><strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// ─── Hotel Card component ─────────────────────────────────────────────────
const HotelCard = ({ hotel }) => {
  const stars = hotel.star_rating || hotel.stars || hotel.rating || 3;
  const price = hotel.price_per_night || hotel.price || hotel.room_price || 0;
  const name  = hotel.name || hotel.hotel_name || "Unknown Hotel";
  const city  = hotel.city || hotel.location || hotel.address || "—";
  const rooms = hotel.available_rooms || hotel.rooms || hotel.total_rooms || "—";
  const status = hotel.status || (hotel.is_active ? "active" : "inactive") || "active";

  return (
    <div style={{
      background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12,
      padding: "14px 16px", display: "flex", gap: 14, alignItems: "flex-start",
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: 10, background: "#EFF6FF",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <BedDouble size={18} color="#185FA5" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
          <span style={{
            fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, flexShrink: 0,
            background: status === "active" ? "#F0FDF4" : "#F1F5F9",
            color:      status === "active" ? "#166534"  : "#64748B",
            border:    `1px solid ${status === "active" ? "#BBF7D0" : "#CBD5E1"}`,
          }}>{status}</span>
        </div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
          <MapPin size={10} color="#94A3B8" /> {city}
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
          <div>
            <div style={{ fontSize: 10, color: "#94A3B8" }}>Price/night</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#185FA5" }}>₹{Number(price).toLocaleString("en-IN")}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#94A3B8" }}>Rooms avail.</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{rooms}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#94A3B8" }}>Stars</div>
            <div style={{ display: "flex", gap: 2, marginTop: 2 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={11} color={i < stars ? "#F59E0B" : "#E2E8F0"} fill={i < stars ? "#F59E0B" : "none"} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activeNav,     setActiveNav]     = useState("Dashboard");
  const [bookings,      setBookings]      = useState(() => Array.from({ length: 14 }, mkBooking));
  const [monthly,       setMonthly]       = useState(mkMonthly);
  const [pie,           setPie]           = useState(mkPie);
  const [stats,         setStats]         = useState({ hotels: 965, users: 23410, revenue: 132.0, bookings: 7120 });
  const [sparkline,     setSparkline]     = useState(() => Array.from({ length: 24 }, (_, i) => ({ i, v: rand(75, 155) })));
  const [notifs,        setNotifs]        = useState([]);
  const [showNotifs,    setShowNotifs]    = useState(false);
  const [isLive,        setIsLive]        = useState(true);
  const [refreshing,    setRefreshing]    = useState(false);
  const [lastRefresh,   setLastRefresh]   = useState(new Date());
  const [chartTab,      setChartTab]      = useState("3M");
  const [filterStatus,  setFilterStatus]  = useState("all");
  const [filterService, setFilterService] = useState("all");
  const [searchQuery,   setSearchQuery]   = useState("");

  // Hotels API state
  const [hotels,        setHotels]        = useState([]);
  const [hotelsLoading, setHotelsLoading] = useState(true);
  const [hotelsError,   setHotelsError]   = useState(null);
  const [hotelSearch,   setHotelSearch]   = useState("");

  const timerRef = useRef(null);

  // ── Fetch hotels from local API ─────────────────────────────────────────
  const fetchHotels = useCallback(async () => {
    setHotelsLoading(true);
    setHotelsError(null);
    try {
      const res  = await fetch("https://bmtadmin.onrender.com/api/hotels");
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();
      // Support both array response and { data: [] } / { hotels: [] } shape
      const list = Array.isArray(data) ? data : (data.data ?? data.hotels ?? data.results ?? []);
      setHotels(list);
    } catch (err) {
      setHotelsError(err.message);
    } finally {
      setHotelsLoading(false);
    }
  }, []);

  useEffect(() => { fetchHotels(); }, [fetchHotels]);

  // ── Live tick ────────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    const nb = mkBooking();
    setBookings(p => [nb, ...p.slice(0, 24)]);
    setStats(p => ({
      hotels:   p.hotels   + rand(0, 2),
      users:    p.users    + rand(0, 6),
      revenue:  parseFloat((p.revenue + randF(0, 0.9)).toFixed(1)),
      bookings: p.bookings + rand(0, 4),
    }));
    setSparkline(p => [...p.slice(1), { i: p[p.length - 1].i + 1, v: rand(75, 155) }]);
    if (rand(0, 5) === 0) {
      setNotifs(p => [{ id: Date.now(), msg: `New ${nb.service}: ${nb.amount}`, status: nb.status, time: "just now" }, ...p.slice(0, 11)]);
    }
  }, []);

  useEffect(() => {
    if (isLive) timerRef.current = setInterval(tick, 2600);
    else        clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [isLive, tick]);

  const doRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      new Promise(r => setTimeout(r, 700)),
      fetchHotels(),
    ]);
    setMonthly(mkMonthly());
    setPie(mkPie());
    setLastRefresh(new Date());
    setRefreshing(false);
  };

  // ── Derived values ───────────────────────────────────────────────────────
  const filtered = bookings.filter(b => {
    if (filterStatus  !== "all" && b.status  !== filterStatus)  return false;
    if (filterService !== "all" && b.service !== filterService) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return b.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q);
    }
    return true;
  });

  const confirmedBookings = bookings.filter(b => b.status === "confirmed");
  const liveRevenue = confirmedBookings.reduce((s, b) => s + b.rawAmount, 0);
  const avgTicket   = bookings.length ? Math.round(bookings.reduce((s, b) => s + b.rawAmount, 0) / bookings.length) : 0;
  const pendingCount = bookings.filter(b => b.status === "pending").length;

  const filteredHotels = hotels.filter(h => {
    const name = (h.name || h.hotel_name || "").toLowerCase();
    const city = (h.city || h.location || "").toLowerCase();
    return name.includes(hotelSearch.toLowerCase()) || city.includes(hotelSearch.toLowerCase());
  });

  const STAT_CARDS = [
    { Icon: Hotel,       label: "Hotels",   value: stats.hotels.toLocaleString("en-IN"),   change: "+5.1%",  up: true,  color: "#185FA5", bg: "#EFF6FF", border: "#BFDBFE" },
    { Icon: Users,       label: "Users",    value: stats.users.toLocaleString("en-IN"),    change: "+12.4%", up: true,  color: "#059669", bg: "#ECFDF5", border: "#A7F3D0" },
    { Icon: CreditCard,  label: "Revenue",  value: `₹${stats.revenue} Cr`,                change: "+9.8%",  up: true,  color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
    { Icon: CalendarDays,label: "Bookings", value: stats.bookings.toLocaleString("en-IN"), change: "-2.1%",  up: false, color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  ];

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", color: "#0F172A", fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes ping    { 0%,100%{transform:scale(1);opacity:.3} 50%{transform:scale(2.2);opacity:0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:#F1F5F9}
        ::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:4px}
        .sc { background:#fff; border:1px solid #E2E8F0; border-radius:14px; padding:20px; cursor:pointer; transition:transform .2s,box-shadow .2s,border-color .2s; animation:fadeUp .45s ease both; }
        .sc:hover { transform:translateY(-2px); box-shadow:0 6px 24px rgba(0,0,0,0.07); border-color:#CBD5E1; }
        .nav-pill { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:8px; cursor:pointer; font-size:13px; font-weight:500; color:#64748B; transition:all .15s; white-space:nowrap; border:1px solid transparent; user-select:none; }
        .nav-pill:hover  { background:#F1F5F9; color:#334155; }
        .nav-pill.active { background:#EFF6FF; color:#1D4ED8; border-color:#BFDBFE; }
        .brow { border-bottom:1px solid #F1F5F9; transition:background .12s; }
        .brow:hover { background:#F8FAFC; }
        .brow.fresh { animation:slideIn .3s ease; }
        .ibtn { background:#fff; border:1px solid #E2E8F0; cursor:pointer; display:flex; align-items:center; gap:6px; padding:7px 12px; border-radius:8px; font-size:12px; font-weight:600; transition:all .15s; font-family:inherit; color:#475569; }
        .ibtn:hover { background:#F8FAFC; border-color:#CBD5E1; }
        input::placeholder { color:#94A3B8; }
        .hotel-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:12px; }
      `}</style>

      {/* ══ TOPBAR ══════════════════════════════════════════════════════════ */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "#fff", borderBottom: "1px solid #E2E8F0", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, background: "#185FA5", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Hotel size={16} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#0F172A", letterSpacing: "-0.01em" }}>TravelAdmin</div>
              <div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 1 }}>Control Panel</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "7px 14px" }}>
            <Search size={13} color="#94A3B8" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search bookings, users…"
              style={{ background: "none", border: "none", outline: "none", color: "#334155", fontSize: 13, width: 200, fontFamily: "inherit" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setIsLive(v => !v)} className="ibtn" style={{
            color: isLive ? "#16A34A" : "#64748B",
            background: isLive ? "#F0FDF4" : "#F8FAFC",
            borderColor: isLive ? "#BBF7D0" : "#E2E8F0",
          }}>
            {isLive ? <><PulseDot color="#16A34A" /><span>Live</span></> : <><WifiOff size={13} /><span>Paused</span></>}
          </button>

          <button onClick={doRefresh} disabled={refreshing} className="ibtn">
            <RefreshCw size={13} style={{ animation: refreshing ? "spin .8s linear infinite" : "none" }} />
            <span>{refreshing ? "Refreshing…" : "Refresh"}</span>
          </button>

          <div style={{ position: "relative" }}>
            <button className="ibtn" onClick={() => setShowNotifs(v => !v)} style={{ position: "relative" }}>
              <Bell size={14} />
              {notifs.length > 0 && (
                <span style={{ position: "absolute", top: -5, right: -5, minWidth: 18, height: 18, background: "#DC2626", borderRadius: 9, fontSize: 10, fontWeight: 800, color: "white", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff", padding: "0 4px" }}>
                  {notifs.length > 9 ? "9+" : notifs.length}
                </span>
              )}
            </button>
            {showNotifs && (
              <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, width: 300, background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, overflow: "hidden", zIndex: 999, animation: "slideIn .2s ease", boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Notifications</span>
                  <button className="ibtn" style={{ fontSize: 11, padding: "2px 8px", border: "none", background: "none", color: "#94A3B8" }} onClick={() => setNotifs([])}>Clear all</button>
                </div>
                {notifs.length === 0
                  ? <div style={{ padding: "20px 16px", color: "#94A3B8", fontSize: 13, textAlign: "center" }}>No new notifications</div>
                  : notifs.map(n => (
                    <div key={n.id} style={{ padding: "10px 16px", borderBottom: "1px solid #F8FAFC", display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_META[n.status]?.color ?? "#185FA5", marginTop: 4, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 12, color: "#334155" }}>{n.msg}</div>
                        <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{n.time}</div>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "4px 10px 4px 4px", borderRadius: 24, border: "1px solid #E2E8F0", background: "#F8FAFC" }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#185FA5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff" }}>AD</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>Admin</span>
            <ChevronDown size={13} color="#94A3B8" />
          </div>
        </div>
      </div>

      {/* ══ NAV BAR ═════════════════════════════════════════════════════════ */}
      <div style={{ position: "sticky", top: 60, zIndex: 40, background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "8px 28px", display: "flex", gap: 4, overflowX: "auto" }}>
        {NAV_ITEMS.map(({ icon: Icon, label }) => (
          <div key={label} className={`nav-pill${activeNav === label ? " active" : ""}`} onClick={() => setActiveNav(label)}>
            <Icon size={13} />{label}
          </div>
        ))}
      </div>

      {/* ══ CONTENT ═════════════════════════════════════════════════════════ */}
      <div style={{ padding: "28px" }}>

        {/* Page header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: 26, color: "#0F172A", letterSpacing: "-0.025em" }}>Dashboard Overview</h1>
            <p style={{ color: "#94A3B8", fontSize: 13, marginTop: 5, display: "flex", alignItems: "center", gap: 8 }}>
              <Activity size={12} color="#16A34A" />
              Refreshed {lastRefresh.toLocaleTimeString("en-IN")}
              {isLive && <><span style={{ color: "#CBD5E1" }}>·</span><PulseDot color="#16A34A" size={8} /><span style={{ color: "#16A34A" }}>Live</span></>}
            </p>
          </div>
          <button className="ibtn">
            <Download size={13} /><span>Export</span>
          </button>
        </div>

        {/* ── Stat cards ──────────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 22 }}>
          {STAT_CARDS.map(({ Icon, label, value, change, up, color, bg, border }, i) => (
            <div key={label} className="sc" style={{ animationDelay: `${i * 55}ms` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={18} color={color} />
                </div>
                <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 700, color: up ? "#166534" : "#991B1B", background: up ? "#F0FDF4" : "#FEF2F2", padding: "3px 9px", borderRadius: 20, border: `1px solid ${up ? "#BBF7D0" : "#FECACA"}` }}>
                  {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}{change}
                </span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>{value}</div>
              <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 5 }}>{label} this month</div>
            </div>
          ))}
        </div>

        {/* ── Summary strip ───────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 22 }}>
          {[
            { label: "Confirmed revenue", value: `₹${liveRevenue.toLocaleString("en-IN")}`, color: "#D97706", Icon: Zap },
            { label: "Confirmed today",   value: confirmedBookings.length,                  color: "#059669", Icon: CheckCircle },
            { label: "Pending approval",  value: pendingCount,                              color: "#D97706", Icon: AlertTriangle },
            { label: "Avg ticket size",   value: `₹${avgTicket.toLocaleString("en-IN")}`,   color: "#185FA5", Icon: CreditCard },
          ].map(({ label, value, color, Icon }) => (
            <div key={label} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}15`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={16} color={color} />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.01em" }}>{value}</div>
                <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Charts row ──────────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, marginBottom: 22 }}>
          {/* Area chart */}
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>Booking Trends</h3>
                <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>Monthly by service</p>
              </div>
              <div style={{ display: "flex", gap: 5 }}>
                {["7D","1M","3M","1Y"].map(t => (
                  <button key={t} onClick={() => { setChartTab(t); doRefresh(); }} style={{
                    padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                    background:   t === chartTab ? "#EFF6FF" : "transparent",
                    border:      `1px solid ${t === chartTab ? "#BFDBFE" : "#E2E8F0"}`,
                    color:        t === chartTab ? "#1D4ED8"  : "#94A3B8",
                  }}>{t}</button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthly}>
                <defs>
                  <linearGradient id="gH" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#185FA5" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#185FA5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gHo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#D97706" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#F1F5F9" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<TipBox />} />
                <Area type="monotone" dataKey="hotels"   name="Hotels"   stroke="#185FA5" strokeWidth={2} fill="url(#gH)" />
                <Area type="monotone" dataKey="holidays" name="Holidays" stroke="#D97706" strokeWidth={2} fill="url(#gHo)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Right col */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Pie */}
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 18, flex: 1 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "#0F172A", marginBottom: 3 }}>Revenue split</h3>
              <p style={{ fontSize: 11, color: "#94A3B8", marginBottom: 12 }}>By service category</p>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie data={pie} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
                    {pie.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={v => `${v}%`} contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 8px" }}>
                {pie.map(d => (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
                    <div style={{ width: 7, height: 7, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                    <span style={{ color: "#64748B" }}>{d.name}</span>
                    <span style={{ color: "#0F172A", fontWeight: 700, marginLeft: "auto" }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sparkline */}
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: "15px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div>
                  <p style={{ fontSize: 11, color: "#94A3B8" }}>Live revenue (₹ Cr)</p>
                  <p style={{ fontSize: 22, fontWeight: 800, color: "#D97706", letterSpacing: "-0.025em", marginTop: 2 }}>{stats.revenue}</p>
                </div>
                <PulseDot color="#D97706" />
              </div>
              <ResponsiveContainer width="100%" height={48}>
                <LineChart data={sparkline}>
                  <Line type="monotone" dataKey="v" stroke="#D97706" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── Hotels from API ──────────────────────────────────────────────── */}
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20, marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>Hotels</h3>
              <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>
                Live from <code style={{ fontSize: 11, background: "#F1F5F9", padding: "1px 5px", borderRadius: 4 }}>localhost:9000/api/hotels</code>
                {!hotelsLoading && !hotelsError && <span style={{ marginLeft: 8, color: "#16A34A", fontWeight: 600 }}>{hotels.length} records</span>}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8, padding: "6px 12px" }}>
                <Search size={12} color="#94A3B8" />
                <input
                  value={hotelSearch}
                  onChange={e => setHotelSearch(e.target.value)}
                  placeholder="Search hotels…"
                  style={{ background: "none", border: "none", outline: "none", fontSize: 12, color: "#334155", fontFamily: "inherit", width: 140 }}
                />
              </div>
              <button className="ibtn" onClick={fetchHotels} disabled={hotelsLoading}>
                <RefreshCw size={12} style={{ animation: hotelsLoading ? "spin .8s linear infinite" : "none" }} />
                <span>Reload</span>
              </button>
            </div>
          </div>

          {hotelsLoading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: 12 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ background: "#F8FAFC", border: "1px solid #F1F5F9", borderRadius: 12, height: 110, animation: "fadeUp .4s ease both", animationDelay: `${i * 60}ms` }} />
              ))}
            </div>
          )}

          {hotelsError && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: 12 }}>
              <AlertTriangle size={16} color="#DC2626" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#991B1B" }}>API Error</div>
                <div style={{ fontSize: 12, color: "#B91C1C", marginTop: 3 }}>{hotelsError}</div>
                <div style={{ fontSize: 11, color: "#DC2626", marginTop: 6 }}>Make sure your server is running at <code>https://bmtadmin.onrender.com</code> and CORS is enabled.</div>
              </div>
            </div>
          )}

          {!hotelsLoading && !hotelsError && filteredHotels.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: "#94A3B8", fontSize: 13 }}>
              {hotels.length === 0 ? "No hotel data returned from API." : "No hotels match your search."}
            </div>
          )}

          {!hotelsLoading && !hotelsError && filteredHotels.length > 0 && (
            <div className="hotel-grid">
              {filteredHotels.map((hotel, i) => (
                <HotelCard key={hotel.id ?? hotel._id ?? hotel.hotel_id ?? i} hotel={hotel} />
              ))}
            </div>
          )}
        </div>

        {/* ── Bottom row: bookings + routes ───────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 310px", gap: 16 }}>

          {/* Bookings table */}
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20, overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>Recent Bookings</h3>
                <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                  {isLive && <PulseDot color="#16A34A" size={7} />}
                  {filtered.length} of {bookings.length} shown
                </p>
              </div>
              <button className="ibtn" style={{ color: "#185FA5", borderColor: "#BFDBFE", background: "#EFF6FF" }}>
                View all <ArrowUpRight size={12} />
              </button>
            </div>

            <div style={{ display: "flex", gap: 7, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
              <Filter size={12} color="#94A3B8" />
              {["all","confirmed","pending","cancelled"].map(s => (
                <Chip key={s} label={s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)} active={filterStatus === s} onClick={() => setFilterStatus(s)} />
              ))}
              <div style={{ width: 1, height: 16, background: "#E2E8F0" }} />
              <select
                value={filterService}
                onChange={e => setFilterService(e.target.value)}
                style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#475569", fontSize: 12, borderRadius: 8, padding: "5px 10px", outline: "none", cursor: "pointer", fontFamily: "inherit" }}
              >
                <option value="all">All services</option>
                {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 540 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                    {["Booking ID","Customer","Service","Amount","Status","Time"].map(h => (
                      <th key={h} style={{ fontSize: 10, color: "#94A3B8", fontWeight: 700, textAlign: "left", padding: "0 10px 10px", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 10).map((b, idx) => {
                    const st    = STATUS_META[b.status];
                    const SIcon = SVC_ICON[b.service] || Package;
                    const StIcon = st.Icon;
                    return (
                      <tr key={b.id} className={`brow${idx === 0 && isLive ? " fresh" : ""}`}>
                        <td style={{ padding: "11px 10px", fontSize: 12, color: "#185FA5", fontWeight: 700 }}>{b.id}</td>
                        <td style={{ padding: "11px 10px", fontSize: 12, color: "#0F172A", fontWeight: 500, whiteSpace: "nowrap" }}>{b.name}</td>
                        <td style={{ padding: "11px 10px" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#64748B" }}><SIcon size={11} />{b.service}</span>
                        </td>
                        <td style={{ padding: "11px 10px", fontSize: 12, color: "#0F172A", fontWeight: 700 }}>{b.amount}</td>
                        <td style={{ padding: "11px 10px" }}>
                          <span style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}`, borderRadius: 20, padding: "3px 9px", fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <StIcon size={9} />{st.label}
                          </span>
                        </td>
                        <td style={{ padding: "11px 10px", fontSize: 11, color: "#94A3B8", whiteSpace: "nowrap" }}>{b.time}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: 32, color: "#94A3B8", fontSize: 13 }}>No bookings match filters</div>
              )}
            </div>
          </div>

          {/* Right: quick stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "#0F172A", marginBottom: 16 }}>Quick stats</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { label: "Avg ticket",    value: `₹${avgTicket.toLocaleString("en-IN")}`, Icon: CreditCard,   color: "#185FA5" },
                  { label: "Active agents", value: rand(130, 158).toString(),                Icon: Users,        color: "#7C3AED" },
                  { label: "Pending PNRs",  value: pendingCount.toString(),                 Icon: CalendarDays, color: "#D97706" },
                  { label: "Hotels live",   value: hotels.length > 0 ? hotels.length : "—", Icon: Hotel,        color: "#059669" },
                ].map(({ label, value, Icon, color }) => (
                  <div key={label} style={{ background: "#F8FAFC", borderRadius: 10, padding: "11px 12px", border: "1px solid #F1F5F9" }}>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 5, display: "flex", alignItems: "center", gap: 5 }}>
                      <Icon size={10} color={color} /> {label}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.01em" }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "#0F172A", marginBottom: 12 }}>API status</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Hotels API",   ok: !hotelsError && !hotelsLoading, url: "localhost:9000/api/hotels" },
                  { label: "Bookings",     ok: true, url: "Live (frontend)" },
                  { label: "Auth service", ok: true, url: "Running" },
                ].map(s => (
                  <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.ok ? "#16A34A" : "#DC2626" }} />
                      <span style={{ color: "#334155", fontWeight: 500 }}>{s.label}</span>
                    </div>
                    <span style={{ color: "#94A3B8", fontSize: 11 }}>{s.url}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}