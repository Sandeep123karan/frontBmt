import { useState, useEffect, useRef } from "react";

const API = "http://localhost:9000/api/apartment";

const AMENITIES = [
  { value: "WiFi", label: "📶 WiFi" },
  { value: "AC", label: "❄️ AC" },
  { value: "Parking", label: "🚗 Parking" },
  { value: "Lift", label: "🛗 Lift" },
  { value: "TV", label: "📺 TV" },
  { value: "Kitchen", label: "🍳 Kitchen" },
  { value: "Geyser", label: "🚿 Geyser" },
  { value: "Power Backup", label: "⚡ Power Backup" },
  { value: "Washing Machine", label: "🫧 Washing Machine" },
  { value: "Security", label: "🔒 Security" },
  { value: "Gym", label: "🏋️ Gym" },
  { value: "Swimming Pool", label: "🏊 Pool" },
];

const INITIAL_FORM = {
  apartmentName: "", propertyType: "Apartment",
  hostName: "", vendorName: "",
  email: "", phone: "", altPhone: "",
  country: "India", state: "", city: "", area: "",
  address: "", pincode: "", landmark: "",
  buildingName: "", towerName: "", floorNumber: "",
  totalFloors: "", flatNumber: "", societyName: "",
  apartmentType: "", bedrooms: "", hall: "", kitchen: "",
  bathrooms: "", balcony: "", furnishing: "",
  carpetArea: "", superArea: "", maxGuests: "", beds: "",
  checkInTime: "12:00", checkOutTime: "11:00",
  roomType: "", mealPlan: "",
  pricePerNight: "", pricePerMonth: "", securityDeposit: "",
  cleaningFee: "", serviceFee: "", tax: "", discount: "", finalPrice: "",
  availableFrom: "", availableTo: "",
  houseRules: "", cancellationPolicy: "", notes: "",
  ownerFullName: "", ownerPhone: "", ownerEmail: "",
  ownerAadhar: "", ownerPan: "",
  ownerBankName: "", ownerAccount: "", ownerIfsc: "",
  ownerUpi: "", ownerAccountHolder: "",
  addedBy: "admin",
};

export default function ApartmentPage() {
  const [form, setForm]           = useState(INITIAL_FORM);
  const [amenities, setAmenities] = useState([]);
  const [thumbPrev, setThumbPrev] = useState(null);
  const [gallPrev, setGallPrev]   = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]         = useState(null);

  const [apartments, setApartments] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch]       = useState("");
  const [viewApt, setViewApt]     = useState(null);

  const thumbRef = useRef();
  const gallRef  = useRef();

  /* ─── TOAST ─── */
  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  }

  /* ─── FETCH TABLE ─── */
  async function fetchAll() {
    setTableLoading(true);
    try {
      const r = await fetch(`${API}/admin/all`);
      const j = await r.json();
      setApartments(j.data || []);
    } catch {
      showToast("Cannot connect to server", "error");
    } finally {
      setTableLoading(false);
    }
  }

  useEffect(() => { fetchAll(); }, []);

  /* ─── FORM CHANGE ─── */
  const fc = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  /* ─── SUBMIT ─── */
  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.apartmentName) return showToast("Apartment name required", "error");
    setSubmitting(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (!k.startsWith("owner")) fd.append(k, v); });
    fd.append("owner[fullName]",          form.ownerFullName);
    fd.append("owner[phone]",             form.ownerPhone);
    fd.append("owner[email]",             form.ownerEmail);
    fd.append("owner[aadharNumber]",      form.ownerAadhar);
    fd.append("owner[panNumber]",         form.ownerPan);
    fd.append("owner[bankName]",          form.ownerBankName);
    fd.append("owner[accountNumber]",     form.ownerAccount);
    fd.append("owner[ifscCode]",          form.ownerIfsc);
    fd.append("owner[upiId]",             form.ownerUpi);
    fd.append("owner[bankAccountHolder]", form.ownerAccountHolder);
    fd.append("amenities", amenities.join(","));
    if (thumbRef.current?.files[0]) fd.set("thumbnail", thumbRef.current.files[0]);
    if (gallRef.current?.files) Array.from(gallRef.current.files).forEach(f => fd.append("gallery", f));
    try {
      const r = await fetch(`${API}/add`, { method: "POST", body: fd });
      const j = await r.json();
      if (j.success) {
        showToast("Apartment added successfully! ✅");
        setForm(INITIAL_FORM);
        setAmenities([]);
        setThumbPrev(null);
        setGallPrev([]);
        fetchAll();
      } else showToast(j.message || "Error", "error");
    } catch { showToast("Server error", "error"); }
    finally { setSubmitting(false); }
  }

  /* ─── ADMIN ACTIONS ─── */
  async function approve(id) {
    await fetch(`${API}/approve/${id}`, { method: "PUT" });
    showToast("Approved ✅"); fetchAll();
  }
  async function reject(id) {
    await fetch(`${API}/reject/${id}`, { method: "PUT" });
    showToast("Rejected"); fetchAll();
  }
  async function remove(id) {
    if (!confirm("Delete this apartment?")) return;
    await fetch(`${API}/delete/${id}`, { method: "DELETE" });
    showToast("Deleted"); fetchAll();
    if (viewApt?._id === id) setViewApt(null);
  }

  /* ─── FILTERED LIST ─── */
  const displayed = apartments.filter(a => {
    const ms = filterStatus === "all" || a.status === filterStatus;
    const q  = search.toLowerCase();
    const mq = !q || `${a.apartmentName} ${a.city} ${a.state}`.toLowerCase().includes(q);
    return ms && mq;
  });

  const stats = {
    total:    apartments.length,
    approved: apartments.filter(a => a.status === "approved").length,
    pending:  apartments.filter(a => a.status === "pending").length,
    rejected: apartments.filter(a => a.status === "rejected").length,
  };

  /* ─── HELPERS ─── */
  const inp = (name, type = "text", ph = "") => (
    <input type={type} name={name} value={form[name]} onChange={fc}
      placeholder={ph} style={styles.input} />
  );
  const sel = (name, opts) => (
    <select name={name} value={form[name]} onChange={fc} style={styles.input}>
      <option value="">Select</option>
      {opts.map(o => <option key={o}>{o}</option>)}
    </select>
  );
  const grp = (label, children, span = 1) => (
    <div style={{ gridColumn: `span ${span}` }}>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
  const sec = (icon, title) => (
    <div style={styles.secTitle}><span>{icon}</span>{title}</div>
  );

  return (
    <div style={styles.root}>
      {/* ══ HEADER ══ */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.logoText}>Stay<span style={{ color: "#f4a261" }}>Ease</span></h1>
          <p style={styles.headerSub}>Admin Dashboard</p>
        </div>
        <div style={styles.headerStats}>
          {[
            ["Total",    stats.total,    "#e63946"],
            ["Approved", stats.approved, "#2ecc71"],
            ["Pending",  stats.pending,  "#f4a261"],
            ["Rejected", stats.rejected, "#94a3b8"],
          ].map(([l, v, c]) => (
            <div key={l} style={styles.hStat}>
              <span style={{ ...styles.hStatNum, color: c }}>{v}</span>
              <span style={styles.hStatLabel}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.pageWrap}>

        {/* ══ FORM ══ */}
        <div style={styles.formCard}>
          <div style={styles.formCardHeader}>
            <div>
              <h2 style={styles.formTitle}>🏢 Add New Apartment</h2>
              <p style={styles.formSub}>Fill in details below — apartment will be auto-approved (admin)</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: "28px 32px 32px" }}>

            {/* BASIC */}
            {sec("📋", "Basic Information")}
            <div style={styles.grid4}>
              {grp("Apartment Name *",
                <input type="text" name="apartmentName" value={form.apartmentName}
                  onChange={fc} placeholder="e.g. Luxury 2BHK near Metro"
                  style={styles.input} required />
              )}
              {grp("Property Type", sel("propertyType", ["Apartment","Villa","Studio","Penthouse"]))}
              {grp("Host Name", inp("hostName","text","Your name"))}
              {grp("Vendor Name", inp("vendorName","text","Brand/Company"))}
            </div>

            {/* CONTACT */}
            {sec("📞", "Contact")}
            <div style={styles.grid3}>
              {grp("Email", inp("email","email","email@example.com"))}
              {grp("Phone", inp("phone","tel","+91 9876543210"))}
              {grp("Alt Phone", inp("altPhone","tel","+91 9876543210"))}
            </div>

            {/* LOCATION */}
            {sec("📍", "Location")}
            <div style={styles.grid3}>
              {grp("Country", inp("country"))}
              {grp("State", inp("state","text","e.g. Maharashtra"))}
              {grp("City", inp("city","text","e.g. Mumbai"))}
              {grp("Area", inp("area","text","e.g. Andheri West"))}
              {grp("Pincode", inp("pincode","text","400001"))}
              {grp("Landmark", inp("landmark","text","Near Metro"))}
              {grp("Full Address",
                <textarea name="address" value={form.address} onChange={fc}
                  placeholder="Complete address..." rows={2}
                  style={{ ...styles.input, resize: "vertical", minHeight: 62 }} />,
                3
              )}
            </div>

            {/* BUILDING */}
            {sec("🏗️", "Building Details")}
            <div style={styles.grid3}>
              {grp("Building Name", inp("buildingName","text","Sunshine Tower"))}
              {grp("Tower", inp("towerName","text","Tower A"))}
              {grp("Floor No.", inp("floorNumber","text","5"))}
              {grp("Total Floors", inp("totalFloors","text","20"))}
              {grp("Flat No.", inp("flatNumber","text","502"))}
              {grp("Society", inp("societyName","text","Sunshine Society"))}
            </div>

            {/* APARTMENT DETAILS */}
            {sec("🛏️", "Apartment Details")}
            <div style={styles.grid4}>
              {grp("Apt. Type", sel("apartmentType", ["1BHK","2BHK","3BHK","4BHK","Studio","Penthouse"]))}
              {grp("Bedrooms", inp("bedrooms","number","2"))}
              {grp("Bathrooms", inp("bathrooms","number","2"))}
              {grp("Hall", inp("hall","number","1"))}
              {grp("Kitchen", inp("kitchen","number","1"))}
              {grp("Balcony", inp("balcony","number","1"))}
              {grp("Max Guests", inp("maxGuests","number","4"))}
              {grp("Beds", inp("beds","number","2"))}
              {grp("Furnishing", sel("furnishing", ["Furnished","Semi-Furnished","Unfurnished"]))}
              {grp("Carpet Area (sqft)", inp("carpetArea","text","850"))}
              {grp("Super Area (sqft)", inp("superArea","text","1100"))}
              {grp("Room Type", sel("roomType", ["Entire Apartment","Private Room","Shared Room"]))}
              {grp("Check-In", inp("checkInTime","time"))}
              {grp("Check-Out", inp("checkOutTime","time"))}
              {grp("Meal Plan", sel("mealPlan", ["None","Breakfast Included","All Meals Included","Self Cooking"]))}
            </div>

            {/* AMENITIES */}
            {sec("✨", "Amenities")}
            <div style={styles.amenGrid}>
              {AMENITIES.map(a => (
                <button key={a.value} type="button"
                  onClick={() => setAmenities(p => p.includes(a.value) ? p.filter(x => x !== a.value) : [...p, a.value])}
                  style={{
                    ...styles.amenBtn,
                    ...(amenities.includes(a.value) ? styles.amenBtnOn : {}),
                  }}>
                  {a.label}
                </button>
              ))}
            </div>

            {/* PRICING */}
            {sec("💰", "Pricing")}
            <div style={styles.grid4}>
              {grp("Price/Night (₹)", inp("pricePerNight","text","2500"))}
              {grp("Price/Month (₹)", inp("pricePerMonth","text","35000"))}
              {grp("Security Deposit (₹)", inp("securityDeposit","text","50000"))}
              {grp("Cleaning Fee (₹)", inp("cleaningFee","text","500"))}
              {grp("Service Fee (₹)", inp("serviceFee","text","200"))}
              {grp("Tax (%)", inp("tax","text","18"))}
              {grp("Discount (%)", inp("discount","text","10"))}
              {grp("Final Price (₹)", inp("finalPrice","text",""))}
            </div>

            {/* AVAILABILITY */}
            {sec("📅", "Availability")}
            <div style={styles.grid4}>
              {grp("Available From", inp("availableFrom","date"))}
              {grp("Available To", inp("availableTo","date"))}
            </div>

            {/* OWNER */}
            {sec("👤", "Owner & Bank Details")}
            <div style={styles.grid4}>
              {grp("Owner Full Name", inp("ownerFullName","text","Full name"))}
              {grp("Owner Phone", inp("ownerPhone","tel","+91"))}
              {grp("Owner Email", inp("ownerEmail","email","owner@email.com"))}
              {grp("Aadhar No.", inp("ownerAadhar","text","XXXX XXXX XXXX"))}
              {grp("PAN", inp("ownerPan","text","ABCDE1234F"))}
              {grp("Bank Name", inp("ownerBankName","text","HDFC Bank"))}
              {grp("Account No.", inp("ownerAccount","text","1234567890"))}
              {grp("IFSC Code", inp("ownerIfsc","text","HDFC0001234"))}
              {grp("UPI ID", inp("ownerUpi","text","owner@upi"))}
              {grp("Account Holder", inp("ownerAccountHolder","text","Name as per bank"))}
            </div>

            {/* PHOTOS */}
            {sec("📸", "Photos")}
            <div style={styles.grid2}>
              <div>
                <label style={styles.label}>Thumbnail Image</label>
                <div style={styles.uploadBox} onClick={() => thumbRef.current.click()}>
                  <input ref={thumbRef} type="file" accept="image/*"
                    style={{ display: "none" }}
                    onChange={e => { const f = e.target.files[0]; if(f) setThumbPrev(URL.createObjectURL(f)); }} />
                  {thumbPrev
                    ? <img src={thumbPrev} alt="" style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 8 }} />
                    : <><div style={{ fontSize: "2rem", marginBottom: 6 }}>🖼️</div><p style={{ fontSize: "0.82rem", color: "#94a3b8" }}>Click to upload thumbnail</p></>
                  }
                </div>
              </div>
              <div>
                <label style={styles.label}>Gallery Images (max 10)</label>
                <div style={styles.uploadBox} onClick={() => gallRef.current.click()}>
                  <input ref={gallRef} type="file" accept="image/*" multiple
                    style={{ display: "none" }}
                    onChange={e => setGallPrev(Array.from(e.target.files).slice(0,10).map(f => URL.createObjectURL(f)))} />
                  <div style={{ fontSize: "2rem", marginBottom: 6 }}>🖼️</div>
                  <p style={{ fontSize: "0.82rem", color: "#94a3b8" }}>Click to upload gallery</p>
                </div>
                {gallPrev.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                    {gallPrev.map((s, i) => (
                      <img key={i} src={s} alt="" style={{ width: 56, height: 56, borderRadius: 6, objectFit: "cover", border: "2px solid #e2e8f0" }} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RULES */}
            {sec("📝", "Rules & Notes")}
            <div style={styles.grid3}>
              {grp("House Rules",
                <textarea name="houseRules" value={form.houseRules} onChange={fc}
                  placeholder="No smoking, no parties..." rows={3}
                  style={{ ...styles.input, resize: "vertical" }} />
              )}
              {grp("Cancellation Policy",
                <textarea name="cancellationPolicy" value={form.cancellationPolicy} onChange={fc}
                  placeholder="Free cancellation up to 24 hrs..." rows={3}
                  style={{ ...styles.input, resize: "vertical" }} />
              )}
              {grp("Notes",
                <textarea name="notes" value={form.notes} onChange={fc}
                  placeholder="Any additional info..." rows={3}
                  style={{ ...styles.input, resize: "vertical" }} />
              )}
            </div>

            {/* SUBMIT */}
            <button type="submit" disabled={submitting} style={{
              ...styles.submitBtn,
              opacity: submitting ? 0.6 : 1,
              cursor: submitting ? "not-allowed" : "pointer",
            }}>
              {submitting ? "Submitting..." : "🚀 Add Apartment"}
            </button>
          </form>
        </div>

        {/* ══ TABLE ══ */}
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <div>
              <h2 style={styles.tableTitle}>All Apartments</h2>
              <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: 2 }}>
                {displayed.length} record{displayed.length !== 1 ? "s" : ""} found
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              {/* FILTER TABS */}
              <div style={{ display: "flex", gap: 6 }}>
                {["all","pending","approved","rejected"].map(f => (
                  <button key={f} onClick={() => setFilterStatus(f)} style={{
                    ...styles.filterTab,
                    ...(filterStatus === f ? styles.filterTabActive : {}),
                  }}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                    <span style={{
                      marginLeft: 5,
                      background: filterStatus === f ? "rgba(255,255,255,0.25)" : "#f0f0f0",
                      color: filterStatus === f ? "#fff" : "#888",
                      padding: "1px 7px", borderRadius: 50, fontSize: "0.7rem"
                    }}>
                      {f === "all" ? apartments.length : apartments.filter(a => a.status === f).length}
                    </span>
                  </button>
                ))}
              </div>
              {/* SEARCH */}
              <input type="text" placeholder="🔍 Search..." value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ ...styles.input, width: 200, margin: 0 }} />
              {/* REFRESH */}
              <button onClick={fetchAll} style={styles.refreshBtn}>↻ Refresh</button>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  {["#","Property","Location","Type","Price/Night","Added By","Status","Date","Actions"].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableLoading ? (
                  <tr><td colSpan={9} style={{ textAlign: "center", padding: 50, color: "#94a3b8" }}>
                    <div style={{ display: "inline-block", width: 32, height: 32, border: "3px solid #e2e8f0", borderTopColor: "#e63946", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    <p style={{ marginTop: 12 }}>Loading...</p>
                  </td></tr>
                ) : displayed.length === 0 ? (
                  <tr><td colSpan={9} style={{ textAlign: "center", padding: 50, color: "#94a3b8" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>🏘️</div>
                    <p>No apartments found</p>
                  </td></tr>
                ) : displayed.map((apt, i) => (
                  <tr key={apt._id} style={styles.trow}
                    onMouseEnter={e => e.currentTarget.style.background = "#f8faff"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ ...styles.td, color: "#94a3b8", fontSize: "0.8rem" }}>{i + 1}</td>
                    <td style={styles.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={styles.tdThumb}>
                          {apt.thumbnail
                            ? <img src={`http://localhost:9000/uploads/${apt.thumbnail}`} alt=""
                                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            : <span>🏢</span>}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>{apt.apartmentName}</div>
                          <div style={{ fontSize: "0.74rem", color: "#94a3b8", marginTop: 2 }}>{apt.hostName || apt.vendorName || "—"}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ ...styles.td, color: "#64748b", fontSize: "0.83rem" }}>
                      {[apt.city, apt.state].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td style={styles.td}>{apt.apartmentType || apt.propertyType || "—"}</td>
                    <td style={{ ...styles.td, fontWeight: 600 }}>
                      {apt.pricePerNight ? `₹${Number(apt.pricePerNight).toLocaleString("en-IN")}` : "—"}
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        padding: "3px 10px", borderRadius: 50, fontSize: "0.72rem", fontWeight: 700,
                        background: apt.addedBy === "admin" ? "#ede9fe" : "#e0f2fe",
                        color: apt.addedBy === "admin" ? "#5b21b6" : "#0369a1",
                      }}>{apt.addedBy || "user"}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        ...(apt.status === "approved" ? styles.badgeApproved
                          : apt.status === "rejected" ? styles.badgeRejected
                          : styles.badgePending),
                      }}>{apt.status}</span>
                    </td>
                    <td style={{ ...styles.td, color: "#94a3b8", fontSize: "0.78rem", whiteSpace: "nowrap" }}>
                      {new Date(apt.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button style={styles.actBtn} onClick={() => setViewApt(apt)}
                          title="View Details">👁</button>
                        {apt.status !== "approved" &&
                          <button style={{ ...styles.actBtn, background: "#d1fae5", color: "#065f46" }}
                            onClick={() => approve(apt._id)} title="Approve">✓</button>}
                        {apt.status !== "rejected" &&
                          <button style={{ ...styles.actBtn, background: "#fee2e2", color: "#991b1b" }}
                            onClick={() => reject(apt._id)} title="Reject">✗</button>}
                        <button style={{ ...styles.actBtn, background: "#f1f5f9", color: "#475569" }}
                          onClick={() => remove(apt._id)} title="Delete">🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ══ DETAIL MODAL ══ */}
      {viewApt && (
        <div style={styles.overlay} onClick={e => e.target === e.currentTarget && setViewApt(null)}>
          <div style={styles.modal}>
            {/* Header */}
            <div style={styles.modalHeader}>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.2rem" }}>{viewApt.apartmentName}</h3>
                <span style={{
                  ...styles.statusBadge, marginTop: 6, display: "inline-block",
                  ...(viewApt.status === "approved" ? styles.badgeApproved
                    : viewApt.status === "rejected" ? styles.badgeRejected : styles.badgePending)
                }}>{viewApt.status}</span>
              </div>
              <button onClick={() => setViewApt(null)} style={styles.closeBtn}>✕</button>
            </div>

            {/* Img */}
            {viewApt.thumbnail && (
              <img src={`http://localhost:9000/uploads/${viewApt.thumbnail}`} alt=""
                style={{ width: "100%", height: 180, objectFit: "cover" }} />
            )}

            {/* Details grid */}
            <div style={{ padding: "20px 24px", overflowY: "auto", maxHeight: 420 }}>
              <div style={styles.detailGrid}>
                {[
                  ["City / State", [viewApt.city, viewApt.state].filter(Boolean).join(", ")],
                  ["Type", viewApt.apartmentType],
                  ["Bedrooms", viewApt.bedrooms],
                  ["Bathrooms", viewApt.bathrooms],
                  ["Max Guests", viewApt.maxGuests],
                  ["Furnishing", viewApt.furnishing],
                  ["Price/Night", viewApt.pricePerNight ? `₹${Number(viewApt.pricePerNight).toLocaleString("en-IN")}` : null],
                  ["Price/Month", viewApt.pricePerMonth ? `₹${Number(viewApt.pricePerMonth).toLocaleString("en-IN")}` : null],
                  ["Security Dep.", viewApt.securityDeposit ? `₹${Number(viewApt.securityDeposit).toLocaleString("en-IN")}` : null],
                  ["Check-In", viewApt.checkInTime],
                  ["Check-Out", viewApt.checkOutTime],
                  ["Host", viewApt.hostName],
                  ["Phone", viewApt.phone],
                  ["Email", viewApt.email],
                  ["Building", viewApt.buildingName],
                  ["Floor", viewApt.floorNumber],
                  ["Owner", viewApt.owner?.fullName],
                  ["Owner Phone", viewApt.owner?.phone],
                  ["Bank", viewApt.owner?.bankName],
                  ["IFSC", viewApt.owner?.ifscCode],
                  ["Added", new Date(viewApt.createdAt).toLocaleString("en-IN")],
                ].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} style={styles.detailRow}>
                    <span style={styles.detailKey}>{k}</span>
                    <span style={styles.detailVal}>{v}</span>
                  </div>
                ))}
              </div>

              {viewApt.amenities?.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  <p style={{ fontSize: "0.74rem", fontWeight: 700, color: "#94a3b8", marginBottom: 8 }}>AMENITIES</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {viewApt.amenities.map(a => (
                      <span key={a} style={styles.pill}>{a}</span>
                    ))}
                  </div>
                </div>
              )}

              {viewApt.houseRules && (
                <div style={{ marginTop: 14 }}>
                  <p style={{ fontSize: "0.74rem", fontWeight: 700, color: "#94a3b8", marginBottom: 6 }}>HOUSE RULES</p>
                  <p style={{ fontSize: "0.84rem", color: "#64748b", background: "#f8faff", padding: "10px 14px", borderRadius: 8 }}>{viewApt.houseRules}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={styles.modalActions}>
              {viewApt.status !== "approved" && (
                <button style={{ ...styles.modalActBtn, background: "#d1fae5", color: "#065f46" }}
                  onClick={() => { approve(viewApt._id); setViewApt(p => ({ ...p, status: "approved" })); }}>
                  ✓ Approve
                </button>
              )}
              {viewApt.status !== "rejected" && (
                <button style={{ ...styles.modalActBtn, background: "#fee2e2", color: "#991b1b" }}
                  onClick={() => { reject(viewApt._id); setViewApt(p => ({ ...p, status: "rejected" })); }}>
                  ✗ Reject
                </button>
              )}
              <button style={{ ...styles.modalActBtn, background: "#f1f5f9", color: "#475569" }}
                onClick={() => remove(viewApt._id)}>
                🗑 Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ TOAST ══ */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 9999,
          background: "#1a1a2e", color: "#fff",
          padding: "13px 22px", borderRadius: 12, fontSize: "0.9rem", fontWeight: 500,
          borderLeft: `4px solid ${toast.type === "success" ? "#2ecc71" : "#e63946"}`,
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          animation: "slideUp 0.3s ease",
        }}>
          {toast.msg}
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        input:focus, select:focus, textarea:focus { outline: none; border-color: #e63946 !important; box-shadow: 0 0 0 3px rgba(230,57,70,0.1); }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 10px; }
      `}</style>
    </div>
  );
}

/* ══ STYLES ══ */
const styles = {
  root: { minHeight: "100vh", background: "#f4f6fb", fontFamily: "'DM Sans', sans-serif" },

  /* HEADER */
  header: {
    background: "#1a1a2e", padding: "18px 36px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    position: "sticky", top: 0, zIndex: 90,
    boxShadow: "0 2px 20px rgba(0,0,0,0.3)",
  },
  logoText: { fontFamily: "'Playfair Display', serif", fontSize: "1.55rem", color: "#fff", fontWeight: 700 },
  headerSub: { fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", marginTop: 2 },
  headerStats: { display: "flex", gap: 28, alignItems: "center" },
  hStat: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
  hStatNum: { fontSize: "1.4rem", fontWeight: 700 },
  hStatLabel: { fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.5px" },

  pageWrap: { maxWidth: 1360, margin: "0 auto", padding: "30px 24px 60px" },

  /* FORM CARD */
  formCard: {
    background: "#fff", borderRadius: 18,
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
    marginBottom: 28, overflow: "hidden",
  },
  formCardHeader: {
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    padding: "24px 32px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  formTitle: { fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#fff", marginBottom: 4 },
  formSub: { fontSize: "0.82rem", color: "rgba(255,255,255,0.5)" },

  /* SECTION TITLE */
  secTitle: {
    display: "flex", alignItems: "center", gap: 8,
    fontWeight: 700, fontSize: "0.88rem", color: "#1a1a2e",
    padding: "14px 0 12px", marginBottom: 14, marginTop: 6,
    borderBottom: "2px solid #e63946",
  },

  /* GRIDS */
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 6 },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 6 },
  grid4: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 6 },

  label: { display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#475569", marginBottom: 5 },
  input: {
    width: "100%", padding: "9px 12px",
    border: "1.5px solid #e2e8f0", borderRadius: 8,
    fontSize: "0.87rem", color: "#1a1a2e",
    background: "#fafbff", fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.2s",
  },

  /* AMENITIES */
  amenGrid: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  amenBtn: {
    padding: "7px 16px", borderRadius: 50,
    border: "1.5px solid #e2e8f0", background: "#fff",
    fontSize: "0.82rem", fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500, cursor: "pointer", color: "#1a1a2e",
    transition: "all 0.2s",
  },
  amenBtnOn: { background: "#1a1a2e", color: "#fff", borderColor: "#1a1a2e" },

  /* UPLOAD */
  uploadBox: {
    border: "2px dashed #d0d5e8", borderRadius: 10,
    padding: "22px 16px", textAlign: "center",
    cursor: "pointer", background: "#fafbff",
  },

  /* SUBMIT */
  submitBtn: {
    width: "100%", padding: 15, marginTop: 24,
    background: "linear-gradient(135deg, #e63946, #c1121f)",
    color: "#fff", border: "none", borderRadius: 12,
    fontFamily: "'DM Sans', sans-serif", fontSize: "0.98rem", fontWeight: 700,
    transition: "opacity 0.2s, transform 0.2s",
  },

  /* TABLE CARD */
  tableCard: {
    background: "#fff", borderRadius: 18,
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)", overflow: "hidden",
  },
  tableHeader: {
    padding: "20px 24px", borderBottom: "1px solid #f1f5f9",
    display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
  },
  tableTitle: { fontFamily: "'Playfair Display', serif", fontSize: "1.25rem" },

  filterTab: {
    padding: "6px 14px", borderRadius: 50,
    border: "1.5px solid #e2e8f0", background: "transparent",
    fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
    color: "#64748b", fontFamily: "'DM Sans', sans-serif",
    display: "flex", alignItems: "center",
  },
  filterTabActive: { background: "#1a1a2e", color: "#fff", borderColor: "#1a1a2e" },
  refreshBtn: {
    padding: "8px 16px", borderRadius: 8, border: "none",
    background: "#f1f5f9", color: "#475569",
    fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.83rem", cursor: "pointer",
  },

  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f8faff" },
  th: {
    padding: "11px 14px", textAlign: "left",
    fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8",
    textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap",
  },
  td: { padding: "13px 14px", verticalAlign: "middle" },
  trow: { borderBottom: "1px solid #f1f5f9", transition: "background 0.15s" },

  tdThumb: {
    width: 40, height: 40, borderRadius: 8,
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    overflow: "hidden", flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "1.2rem",
  },

  statusBadge: { padding: "3px 11px", borderRadius: 50, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" },
  badgePending:  { background: "#fef3c7", color: "#92400e" },
  badgeApproved: { background: "#d1fae5", color: "#065f46" },
  badgeRejected: { background: "#fee2e2", color: "#991b1b" },

  actBtn: {
    padding: "5px 10px", borderRadius: 6, border: "none",
    background: "#dbeafe", color: "#1e40af",
    fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },

  /* MODAL */
  overlay: {
    position: "fixed", inset: 0, zIndex: 500,
    background: "rgba(10,10,30,0.65)", backdropFilter: "blur(6px)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
  },
  modal: {
    background: "#fff", borderRadius: 18,
    width: "100%", maxWidth: 620, maxHeight: "88vh",
    overflow: "hidden", display: "flex", flexDirection: "column",
    animation: "slideUp 0.3s ease",
  },
  modalHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    padding: "22px 24px 16px", borderBottom: "1px solid #f1f5f9",
  },
  closeBtn: {
    width: 32, height: 32, borderRadius: "50%",
    border: "none", background: "#f1f5f9", cursor: "pointer",
    fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center",
  },
  detailGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 },
  detailRow: {
    display: "flex", justifyContent: "space-between",
    padding: "7px 11px", background: "#fafbff",
    borderRadius: 7, border: "1px solid #f1f5f9",
  },
  detailKey: { fontSize: "0.74rem", fontWeight: 700, color: "#94a3b8" },
  detailVal: { fontSize: "0.8rem", fontWeight: 500, color: "#1a1a2e", textAlign: "right" },
  pill: { padding: "4px 12px", background: "#eef2ff", color: "#3730a3", borderRadius: 50, fontSize: "0.75rem", fontWeight: 500 },
  modalActions: {
    display: "flex", gap: 10, padding: "14px 24px",
    borderTop: "1px solid #f1f5f9", background: "#f8faff",
  },
  modalActBtn: {
    flex: 1, padding: "11px", borderRadius: 9, border: "none",
    fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer",
  },
};