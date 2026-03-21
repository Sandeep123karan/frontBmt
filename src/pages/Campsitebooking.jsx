import { useState, useEffect, useCallback } from "react";

/* ============================================================
   API CONFIG — apna token aur base URL yahan lagao
============================================================ */
const API_BASE = "http://localhost:9000/api/bookings";
const token = () => localStorage.getItem("token");

const api = {
  post: (url, data) =>
    fetch(API_BASE + url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
  get: (url) =>
    fetch(API_BASE + url, { headers: { Authorization: `Bearer ${token()}` } }).then((r) => r.json()),
  put: (url, data = {}) =>
    fetch(API_BASE + url, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
};

/* ============================================================
   UTILS
============================================================ */
const fmt = {
  date: (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—",
  inr: (n) => (n == null ? "—" : "₹" + Number(n).toLocaleString("en-IN")),
  nights: (a, b) => a && b ? Math.max(0, Math.round((new Date(b) - new Date(a)) / 86400000)) : 0,
};

const PAYMENT_METHODS = [
  { value: "upi", label: "UPI", icon: "📱" },
  { value: "razorpay", label: "Razorpay", icon: "💳" },
  { value: "stripe", label: "Stripe", icon: "🌐" },
  { value: "cash", label: "Cash", icon: "💵" },
];

const STATUS_META = {
  booking: {
    pending:   { bg: "#431407", border: "#ea580c", text: "#fb923c" },
    confirmed: { bg: "#052e16", border: "#16a34a", text: "#4ade80" },
    cancelled: { bg: "#2d0a0a", border: "#dc2626", text: "#f87171" },
    completed: { bg: "#0c1a3a", border: "#3b82f6", text: "#93c5fd" },
  },
  payment: {
    pending:  { bg: "#431407", border: "#ea580c", text: "#fb923c" },
    paid:     { bg: "#052e16", border: "#16a34a", text: "#4ade80" },
    failed:   { bg: "#2d0a0a", border: "#dc2626", text: "#f87171" },
    refunded: { bg: "#0c1a3a", border: "#3b82f6", text: "#93c5fd" },
  },
};

/* ============================================================
   GLOBAL CSS
============================================================ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #05100a; color: #d4edda; font-family: 'Outfit', sans-serif; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #05100a; }
  ::-webkit-scrollbar-thumb { background: #16a34a44; border-radius: 4px; }
  input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.7) sepia(1) hue-rotate(95deg) brightness(0.9); cursor: pointer; }
  input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; }
  ::placeholder { color: #86efac33; }
  select option { background: #0a1e0f; color: #d4edda; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes spin     { to { transform:rotate(360deg); } }
  @keyframes bounce   { 0%,80%,100%{transform:scale(0.6);opacity:0.3;} 40%{transform:scale(1.2);opacity:1;} }
  @keyframes slideToast { from{opacity:0;transform:translateX(60px);} to{opacity:1;transform:translateX(0);} }
  @keyframes stepReveal { from{opacity:0;transform:translateX(24px);} to{opacity:1;transform:translateX(0);} }
  @keyframes glow     { 0%,100%{box-shadow:0 0 10px #22c55e22;} 50%{box-shadow:0 0 22px #22c55e55;} }

  .card-hover { transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s; }
  .card-hover:hover { border-color: #22c55e22 !important; transform: translateY(-3px); box-shadow: 0 16px 48px #00000066; }
  .btn-green { transition: all 0.2s; }
  .btn-green:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 8px 28px #16a34a44 !important; }
  .btn-red:hover:not(:disabled) { background: #3d1010 !important; }
  .field-input:focus { border-color: #22c55e55 !important; background: #0a2a1577 !important; box-shadow: 0 0 0 3px #22c55e0f !important; }
  .tab-btn:hover:not(.active) { color: #86efac99 !important; background: #ffffff08 !important; }
  .counter-btn:hover { background: #22c55e18 !important; color: #86efac !important; }
`;

/* ============================================================
   TOAST
============================================================ */
function Toast({ toasts, remove }) {
  return (
    <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 999, display: "flex", flexDirection: "column", gap: 10 }}>
      {toasts.map((t) => {
        const isErr = t.type === "error";
        return (
          <div key={t.id} style={{
            background: isErr ? "#2d0a0a" : "#052e16",
            border: `1px solid ${isErr ? "#dc262666" : "#16a34a66"}`,
            borderRadius: 14, padding: "14px 18px",
            display: "flex", alignItems: "center", gap: 12,
            animation: "slideToast 0.35s cubic-bezier(0.34,1.56,0.64,1)",
            boxShadow: `0 8px 32px ${isErr ? "#ef444422" : "#22c55e22"}`,
            maxWidth: 340, minWidth: 260,
          }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{isErr ? "⚠️" : "✅"}</span>
            <span style={{ fontSize: 13, color: isErr ? "#fca5a5" : "#86efac", lineHeight: 1.4, flex: 1 }}>{t.msg}</span>
            <button onClick={() => remove(t.id)} style={{ background: "none", border: "none", color: "#ffffff33", cursor: "pointer", fontSize: 18, flexShrink: 0, lineHeight: 1 }}>×</button>
          </div>
        );
      })}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  }, []);
  const remove = useCallback((id) => setToasts((p) => p.filter((t) => t.id !== id)), []);
  return { toasts, toast: add, remove };
}

/* ============================================================
   SHARED FIELD COMPONENTS
============================================================ */
function Field({ label, hint, required, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: "#86efac88", letterSpacing: "1px", textTransform: "uppercase" }}>
        {label}
        {required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}
        {hint && <span style={{ color: "#86efac33", fontWeight: 400, marginLeft: 6, textTransform: "none", letterSpacing: 0 }}>{hint}</span>}
      </label>
      {children}
    </div>
  );
}

const inputBase = {
  background: "#ffffff07", border: "1px solid #ffffff12", borderRadius: 11,
  padding: "12px 15px", color: "#d4edda", fontSize: 14,
  fontFamily: "'Outfit', sans-serif", outline: "none",
  transition: "all 0.2s", width: "100%",
};

function Input(props) {
  return <input className="field-input" style={inputBase} {...props} />;
}

function SelectField({ children, ...props }) {
  return (
    <select className="field-input" style={{ ...inputBase, cursor: "pointer" }} {...props}>
      {children}
    </select>
  );
}

function Textarea(props) {
  return <textarea className="field-input" style={{ ...inputBase, resize: "vertical", minHeight: 80 }} {...props} />;
}

function Counter({ value, onChange, min = 1, max = 99 }) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <button type="button" className="counter-btn" onClick={() => onChange(Math.max(min, value - 1))} style={{
        width: 40, height: 44, background: "#ffffff0a", border: "1px solid #ffffff12",
        borderRadius: "11px 0 0 11px", color: "#86efac88", fontSize: 20, cursor: "pointer",
        transition: "all 0.2s", fontFamily: "'Outfit', sans-serif",
      }}>−</button>
      <div style={{
        flex: 1, height: 44, background: "#ffffff07", border: "1px solid #ffffff12",
        borderLeft: "none", borderRight: "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16, fontWeight: 600, color: "#d4edda",
      }}>{value}</div>
      <button type="button" className="counter-btn" onClick={() => onChange(Math.min(max, value + 1))} style={{
        width: 40, height: 44, background: "#ffffff0a", border: "1px solid #ffffff12",
        borderRadius: "0 11px 11px 0", color: "#86efac88", fontSize: 20, cursor: "pointer",
        transition: "all 0.2s", fontFamily: "'Outfit', sans-serif",
      }}>+</button>
    </div>
  );
}

/* ============================================================
   STEP INDICATOR
============================================================ */
const STEPS = [
  { label: "Campsite" },
  { label: "Guests" },
  { label: "Contact" },
  { label: "Review" },
];

function StepBar({ current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: done ? "linear-gradient(135deg,#16a34a,#15803d)" : active ? "#0a2a15" : "#ffffff07",
                border: `2px solid ${done ? "#22c55e" : active ? "#22c55e77" : "#ffffff12"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: done ? 13 : 12, color: done ? "#fff" : active ? "#86efac" : "#86efac22",
                fontWeight: 700, transition: "all 0.3s",
                boxShadow: active ? "0 0 14px #22c55e33" : "none",
              }}>
                {done ? "✓" : i + 1}
              </div>
              <span style={{
                fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
                color: active ? "#86efac" : done ? "#86efac66" : "#86efac22",
                letterSpacing: "0.5px",
              }}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 1, margin: "0 10px",
                background: done ? "linear-gradient(90deg,#22c55e,#22c55e55)" : "#ffffff09",
                transition: "background 0.4s",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   BOOKING FORM — 4 STEPS
============================================================ */
const INITIAL_FORM = {
  campsiteId: "", checkInDate: "", checkOutDate: "", totalTents: 1, couponCode: "",
  totalGuests: 1, adults: 1, children: 0,
  guestDetails: [{ name: "", age: "", gender: "male" }],
  contactDetails: { name: "", email: "", phone: "" },
  paymentMethod: "upi",
  specialRequest: "",
};

function BookingForm({ onCreated, toast }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  const nights = fmt.nights(form.checkInDate, form.checkOutDate);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const setContact = (key, val) => setForm((f) => ({ ...f, contactDetails: { ...f.contactDetails, [key]: val } }));
  const setGuest = (i, key, val) => {
    const g = [...form.guestDetails];
    g[i] = { ...g[i], [key]: val };
    setForm((f) => ({ ...f, guestDetails: g }));
  };
  const addGuest = () => setForm((f) => ({ ...f, guestDetails: [...f.guestDetails, { name: "", age: "", gender: "male" }] }));
  const removeGuest = (i) => setForm((f) => ({ ...f, guestDetails: f.guestDetails.filter((_, idx) => idx !== i) }));

  const syncGuests = (total) => {
    const current = form.guestDetails.length;
    if (total > current) {
      setForm((f) => ({ ...f, totalGuests: total, guestDetails: [...f.guestDetails, ...Array.from({ length: total - current }, () => ({ name: "", age: "", gender: "male" }))] }));
    } else {
      setForm((f) => ({ ...f, totalGuests: total, guestDetails: f.guestDetails.slice(0, total) }));
    }
  };

  const validate = () => {
    if (step === 0) {
      if (!form.campsiteId.trim()) { toast("Campsite ID daalein", "error"); return false; }
      if (nights <= 0) { toast("Valid check-in aur check-out dates select karein", "error"); return false; }
    }
    if (step === 1) {
      if (form.adults < 1) { toast("Kam se kam 1 adult hona chahiye", "error"); return false; }
    }
    if (step === 2) {
      if (!form.contactDetails.name.trim()) { toast("Contact name daalein", "error"); return false; }
      if (!form.contactDetails.phone.trim()) { toast("Phone number daalein", "error"); return false; }
    }
    return true;
  };

  const next = () => { if (validate()) setStep((s) => s + 1); };
  const back = () => setStep((s) => s - 1);

  const submit = async () => {
    setLoading(true);
    try {
      const payload = {
        campsiteId: form.campsiteId,
        checkInDate: form.checkInDate,
        checkOutDate: form.checkOutDate,
        totalTents: +form.totalTents,
        totalGuests: +form.totalGuests,
        adults: +form.adults,
        children: +form.children,
        guestDetails: form.guestDetails.filter((g) => g.name.trim()),
        contactDetails: form.contactDetails,
        paymentMethod: form.paymentMethod,
        specialRequest: form.specialRequest,
        ...(form.couponCode.trim() && { couponCode: form.couponCode.trim().toUpperCase() }),
      };
      const res = await api.post("/create", payload);
      if (res.success) {
        toast("Booking ho gayi! 🏕️ Adventure shuru ho raha hai", "success");
        setForm(INITIAL_FORM);
        setStep(0);
        onCreated?.();
      } else {
        toast(res.message || "Kuch galat ho gaya", "error");
      }
    } catch {
      toast("Server se connect nahi hua", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      {/* Section heading */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", letterSpacing: "2px", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e", display: "inline-block" }} />
          NAYA BOOKING
        </div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: "#d4edda", lineHeight: 1.1 }}>
          Campsite Reserve Karo
        </h2>
        <p style={{ color: "#86efac44", fontSize: 14, marginTop: 6 }}>Jungle mein ghar dhundo — ek raat ya ek hafte</p>
      </div>

      <StepBar current={step} />

      <div style={{ animation: "stepReveal 0.3s ease" }} key={step}>

        {/* ── STEP 0: CAMPSITE ── */}
        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Field label="Campsite ID" required>
              <Input name="campsiteId" value={form.campsiteId} onChange={(e) => set("campsiteId", e.target.value)} placeholder="MongoDB ObjectId..." />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Check-in Date" required>
                <Input type="date" value={form.checkInDate} onChange={(e) => set("checkInDate", e.target.value)} />
              </Field>
              <Field label="Check-out Date" required>
                <Input type="date" value={form.checkOutDate} onChange={(e) => set("checkOutDate", e.target.value)} />
              </Field>
            </div>

            {nights > 0 && (
              <div style={{
                background: "linear-gradient(135deg,#052e1688,#0a3d1888)",
                border: "1px solid #22c55e22", borderRadius: 12, padding: "14px 18px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                animation: "fadeIn 0.3s ease",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>🌙</span>
                  <div>
                    <div style={{ color: "#86efac", fontWeight: 600, fontSize: 15 }}>{nights} Raat</div>
                    <div style={{ color: "#86efac44", fontSize: 12 }}>ka jungle stay</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  {Array.from({ length: Math.min(nights, 7) }).map((_, i) => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", opacity: 0.8 }} />
                  ))}
                  {nights > 7 && <span style={{ color: "#86efac55", fontSize: 11, alignSelf: "center" }}>+{nights - 7}</span>}
                </div>
              </div>
            )}

            <Field label="Total Tents" required>
              <Counter value={form.totalTents} onChange={(v) => set("totalTents", v)} />
            </Field>

            <Field label="Coupon Code" hint="(optional)">
              <div style={{ position: "relative" }}>
                <Input
                  value={form.couponCode}
                  onChange={(e) => set("couponCode", e.target.value.toUpperCase())}
                  placeholder="e.g. BMT10"
                  style={{ ...inputBase, paddingRight: 48, letterSpacing: "1.5px", fontWeight: 600 }}
                />
                {form.couponCode && (
                  <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🏷️</span>
                )}
              </div>
            </Field>
          </div>
        )}

        {/* ── STEP 1: GUESTS ── */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              <Field label="Total Guests" required>
                <Counter value={form.totalGuests} onChange={syncGuests} />
              </Field>
              <Field label="Adults" required>
                <Counter value={form.adults} onChange={(v) => set("adults", v)} />
              </Field>
              <Field label="Children">
                <Counter value={form.children} onChange={(v) => set("children", v)} min={0} />
              </Field>
            </div>

            <div style={{ height: 1, background: "#ffffff08" }} />

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#86efac66", letterSpacing: "1px", textTransform: "uppercase" }}>
                  Guest Details <span style={{ color: "#86efac33", fontWeight: 400, textTransform: "none" }}>(optional)</span>
                </div>
                <button type="button" onClick={addGuest} style={{
                  background: "#22c55e15", border: "1px solid #22c55e33", borderRadius: 8,
                  padding: "5px 12px", color: "#86efac", cursor: "pointer",
                  fontSize: 12, fontWeight: 600, fontFamily: "'Outfit', sans-serif", transition: "all 0.2s",
                }}>+ Add Guest</button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {form.guestDetails.map((g, i) => (
                  <div key={i} style={{
                    background: "#ffffff04", border: "1px solid #ffffff09",
                    borderRadius: 12, padding: "14px 16px",
                    display: "grid", gridTemplateColumns: "2fr 80px 110px 36px", gap: 10, alignItems: "end",
                  }}>
                    <Field label={`Guest ${i + 1}`}>
                      <Input value={g.name} onChange={(e) => setGuest(i, "name", e.target.value)} placeholder="Naam..." />
                    </Field>
                    <Field label="Age">
                      <Input type="number" value={g.age} onChange={(e) => setGuest(i, "age", e.target.value)} placeholder="25" min={1} />
                    </Field>
                    <Field label="Gender">
                      <SelectField value={g.gender} onChange={(e) => setGuest(i, "gender", e.target.value)}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </SelectField>
                    </Field>
                    <button type="button" onClick={() => removeGuest(i)} disabled={form.guestDetails.length === 1} style={{
                      width: 36, height: 44, background: "#ef444411", border: "1px solid #ef444433",
                      borderRadius: 10, color: "#ef4444", cursor: "pointer", fontSize: 16,
                      opacity: form.guestDetails.length === 1 ? 0.3 : 1, alignSelf: "end",
                      fontFamily: "'Outfit', sans-serif",
                    }}>×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: CONTACT & PAYMENT ── */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ background: "#ffffff04", border: "1px solid #ffffff08", borderRadius: 14, padding: "18px 20px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#86efac55", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 14 }}>
                Contact Information
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Field label="Full Name" required>
                  <Input value={form.contactDetails.name} onChange={(e) => setContact("name", e.target.value)} placeholder="Aapka poora naam..." />
                </Field>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <Field label="Email" hint="(optional)">
                    <Input type="email" value={form.contactDetails.email} onChange={(e) => setContact("email", e.target.value)} placeholder="email@example.com" />
                  </Field>
                  <Field label="Phone" required>
                    <Input type="tel" value={form.contactDetails.phone} onChange={(e) => setContact("phone", e.target.value)} placeholder="+91 98765 43210" />
                  </Field>
                </div>
              </div>
            </div>

            <Field label="Payment Method" required>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {PAYMENT_METHODS.map((m) => (
                  <button key={m.value} type="button" onClick={() => set("paymentMethod", m.value)} style={{
                    background: form.paymentMethod === m.value ? "#22c55e15" : "#ffffff06",
                    border: `1px solid ${form.paymentMethod === m.value ? "#22c55e44" : "#ffffff10"}`,
                    borderRadius: 12, padding: "12px 16px",
                    display: "flex", alignItems: "center", gap: 10,
                    cursor: "pointer", transition: "all 0.2s",
                    color: form.paymentMethod === m.value ? "#86efac" : "#86efac44",
                    fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 14,
                  }}>
                    <span style={{ fontSize: 20 }}>{m.icon}</span>
                    {m.label}
                    {form.paymentMethod === m.value && <span style={{ marginLeft: "auto", color: "#22c55e", fontSize: 13 }}>✓</span>}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Special Request" hint="(optional)">
              <Textarea
                value={form.specialRequest}
                onChange={(e) => set("specialRequest", e.target.value)}
                placeholder="Vegetarian khana, tent near river, extra blankets..."
              />
            </Field>
          </div>
        )}

        {/* ── STEP 3: REVIEW ── */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              {
                title: "🏕️ Campsite Details",
                rows: [
                  ["Campsite ID", form.campsiteId || "—"],
                  ["Check-in", fmt.date(form.checkInDate)],
                  ["Check-out", fmt.date(form.checkOutDate)],
                  ["Total Nights", nights || "—"],
                  ["Total Tents", form.totalTents],
                  ...(form.couponCode ? [["Coupon Code", form.couponCode]] : []),
                ],
              },
              {
                title: "👥 Guest Details",
                rows: [
                  ["Total Guests", form.totalGuests],
                  ["Adults", form.adults],
                  ["Children", form.children],
                  ...form.guestDetails.filter(g => g.name).map((g, i) => [`Guest ${i + 1}`, `${g.name}${g.age ? `, ${g.age} yrs` : ""}${g.gender ? ` (${g.gender})` : ""}`]),
                ],
              },
              {
                title: "📞 Contact & Payment",
                rows: [
                  ["Name", form.contactDetails.name || "—"],
                  ["Email", form.contactDetails.email || "—"],
                  ["Phone", form.contactDetails.phone || "—"],
                  ["Payment", PAYMENT_METHODS.find(m => m.value === form.paymentMethod)?.label || "—"],
                  ...(form.specialRequest ? [["Request", form.specialRequest]] : []),
                ],
              },
            ].map((section, si) => (
              <div key={si} style={{ background: "#ffffff05", border: "1px solid #ffffff08", borderRadius: 14, overflow: "hidden" }}>
                <div style={{ padding: "10px 16px", background: "#22c55e08", borderBottom: "1px solid #ffffff08", fontSize: 12, fontWeight: 700, color: "#86efac66", letterSpacing: "0.5px" }}>
                  {section.title}
                </div>
                {section.rows.map(([k, v], i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                    padding: "9px 16px", fontSize: 13,
                    borderBottom: i < section.rows.length - 1 ? "1px solid #ffffff05" : "none",
                  }}>
                    <span style={{ color: "#86efac44", minWidth: 110 }}>{k}</span>
                    <span style={{ color: "#d4edda", fontWeight: 500, textAlign: "right", wordBreak: "break-all" }}>{v}</span>
                  </div>
                ))}
              </div>
            ))}

            <div style={{
              background: "linear-gradient(135deg,#052e1688,#0a3d1888)",
              border: "1px solid #22c55e22", borderRadius: 14, padding: "16px 20px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 12, color: "#86efac55", textTransform: "uppercase", letterSpacing: "1px" }}>Estimated Total</div>
                <div style={{ fontSize: 11, color: "#86efac33", marginTop: 3 }}>Final amount campsite pricing se calculate hoga</div>
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: "#86efac", fontWeight: 700 }}>Server pe calc hoga</div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
        {step > 0 && (
          <button type="button" onClick={back} style={{
            flex: 1, padding: 14, background: "transparent",
            border: "1px solid #ffffff14", borderRadius: 13,
            color: "#86efac77", cursor: "pointer", fontSize: 14, fontWeight: 600,
            fontFamily: "'Outfit', sans-serif", transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#86efac33"; e.currentTarget.style.color = "#86efac"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#ffffff14"; e.currentTarget.style.color = "#86efac77"; }}
          >← Wapis</button>
        )}
        {step < 3 ? (
          <button type="button" onClick={next} className="btn-green" style={{
            flex: 2, padding: 14,
            background: "linear-gradient(135deg,#16a34a,#15803d)",
            border: "1px solid #22c55e33", borderRadius: 13,
            color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700,
            fontFamily: "'Outfit', sans-serif", boxShadow: "0 4px 20px #16a34a22",
          }}>Next →</button>
        ) : (
          <button type="button" onClick={submit} disabled={loading} className="btn-green" style={{
            flex: 2, padding: 14,
            background: loading ? "#15803d88" : "linear-gradient(135deg,#16a34a,#15803d)",
            border: "1px solid #22c55e44", borderRadius: 13,
            color: "#fff", cursor: loading ? "not-allowed" : "pointer",
            fontSize: 14, fontWeight: 700, fontFamily: "'Outfit', sans-serif",
            boxShadow: "0 4px 24px #16a34a22",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            {loading
              ? <><span style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid #fff4", borderTopColor: "#fff", animation: "spin 0.8s linear infinite", display: "inline-block" }} />Booking Ho Rahi Hai...</>
              : "⛺ Booking Confirm Karo"
            }
          </button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   STATUS BADGE
============================================================ */
function Badge({ status, type = "booking" }) {
  const c = STATUS_META[type]?.[status] || STATUS_META.booking.pending;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: c.bg, border: `1px solid ${c.border}44`,
      borderRadius: 20, padding: "4px 11px",
      fontSize: 11, fontWeight: 700, color: c.text,
      letterSpacing: "0.5px", textTransform: "uppercase",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.border, boxShadow: `0 0 5px ${c.border}` }} />
      {status}
    </span>
  );
}

/* ============================================================
   BOOKING CARD
============================================================ */
function BookingCard({ b, onCancel, isAdmin, index }) {
  const [cancelling, setCancelling] = useState(false);
  const [open, setOpen] = useState(false);
  const camp = b.campsiteId;
  const user = b.userId;
  const sc = STATUS_META.booking[b.bookingStatus] || STATUS_META.booking.pending;

  const handleCancel = async () => {
    if (!window.confirm("Pakka cancel karein? Ye booking wapis nahi hogi.")) return;
    setCancelling(true);
    await onCancel(b._id);
    setCancelling(false);
  };

  return (
    <div className="card-hover" style={{
      background: "#ffffff04", border: "1px solid #86efac0c",
      borderRadius: 18, overflow: "hidden",
      animation: `fadeUp 0.4s ${Math.min(index * 0.06, 0.5)}s both`,
    }}>
      <div style={{ height: 3, background: `linear-gradient(90deg,${sc.border},${sc.border}33)` }} />

      <div style={{ padding: 20 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#d4edda", lineHeight: 1.2, marginBottom: 5 }}>
              {camp?.name || "Campsite"}
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
              {camp?.location && (
                <span style={{ fontSize: 12, color: "#86efac77", background: "#86efac0d", border: "1px solid #86efac11", borderRadius: 20, padding: "2px 10px" }}>
                  📍 {camp.location}
                </span>
              )}
              {isAdmin && user && (
                <span style={{ fontSize: 11, color: "#86efac44" }}>👤 {user.name || user.email || user._id}</span>
              )}
            </div>
            <div style={{ fontSize: 10, color: "#86efac22", marginTop: 4 }}>#{b._id?.slice(-10).toUpperCase()}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, marginLeft: 12, flexShrink: 0 }}>
            <Badge status={b.bookingStatus} type="booking" />
            <Badge status={b.paymentStatus} type="payment" />
          </div>
        </div>

        {/* Date Strip */}
        <div style={{
          display: "flex", alignItems: "center",
          background: "#0a1a0f", borderRadius: 12, border: "1px solid #ffffff09", marginBottom: 14, overflow: "hidden",
        }}>
          <div style={{ flex: 1, padding: "11px 15px" }}>
            <div style={{ fontSize: 10, color: "#86efac33", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 3 }}>Check-in</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#d4edda" }}>{fmt.date(b.checkInDate)}</div>
          </div>
          <div style={{ padding: "0 12px", textAlign: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#22c55e", background: "#052e16", border: "1px solid #22c55e33", borderRadius: 20, padding: "3px 12px", whiteSpace: "nowrap" }}>
              {b.totalNights || "?"} 🌙
            </span>
          </div>
          <div style={{ flex: 1, padding: "11px 15px", textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "#86efac33", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 3 }}>Check-out</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#d4edda" }}>{fmt.date(b.checkOutDate)}</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(100px,1fr))", gap: 8, marginBottom: 14 }}>
          {[
            { icon: "👥", label: "Guests", val: b.totalGuests },
            { icon: "🧑‍🤝‍🧑", label: "Adults", val: b.adults },
            { icon: "🧒", label: "Children", val: b.children },
            { icon: "⛺", label: "Tents", val: b.totalTents },
            { icon: "💳", label: "Payment", val: b.paymentMethod?.toUpperCase() },
          ].map((s, i) => (
            <div key={i} style={{ background: "#ffffff05", border: "1px solid #ffffff07", borderRadius: 10, padding: "9px 12px" }}>
              <div style={{ fontSize: 15, marginBottom: 3 }}>{s.icon}</div>
              <div style={{ fontSize: 10, color: "#86efac33", textTransform: "uppercase", letterSpacing: "0.3px" }}>{s.label}</div>
              <div style={{ fontSize: 13, color: "#d4edda", fontWeight: 600, marginTop: 2 }}>{s.val ?? "—"}</div>
            </div>
          ))}
        </div>

        {/* Expand Toggle */}
        <button type="button" onClick={() => setOpen(!open)} style={{
          width: "100%", padding: "8px 0", background: "transparent",
          border: "none", borderTop: "1px solid #ffffff08",
          color: "#86efac33", cursor: "pointer", fontSize: 12,
          fontFamily: "'Outfit', sans-serif", transition: "color 0.2s",
          marginBottom: open ? 14 : 0,
        }}
          onMouseEnter={e => (e.currentTarget.style.color = "#86efac88")}
          onMouseLeave={e => (e.currentTarget.style.color = "#86efac33")}
        >
          {open ? "▲ Details Chhupao" : "▼ Poori Details Dekho"}
        </button>

        {/* Expanded */}
        {open && (
          <div style={{ animation: "fadeUp 0.25s ease", marginBottom: 14 }}>
            {/* Pricing Breakdown */}
            <div style={{ background: "#ffffff04", border: "1px solid #ffffff08", borderRadius: 12, overflow: "hidden", marginBottom: 10 }}>
              <div style={{ padding: "9px 14px", fontSize: 11, fontWeight: 700, color: "#86efac55", letterSpacing: "1px", textTransform: "uppercase", borderBottom: "1px solid #ffffff08" }}>
                💰 Pricing Breakdown
              </div>
              {[
                ["Per Night", fmt.inr(b.pricePerNight)],
                ["Subtotal", fmt.inr(b.subtotal)],
                ...(b.discountAmount > 0 ? [["Discount", `-${fmt.inr(b.discountAmount)}`]] : []),
                ...(b.couponCode ? [["Coupon", b.couponCode]] : []),
                ...(b.couponDiscount > 0 ? [["Coupon Discount", `-${fmt.inr(b.couponDiscount)}`]] : []),
                ...(b.taxAmount > 0 ? [["GST / Tax", fmt.inr(b.taxAmount)]] : []),
                ...(b.serviceFee > 0 ? [["Service Fee", fmt.inr(b.serviceFee)]] : []),
              ].map(([k, v], i, arr) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", padding: "8px 14px", fontSize: 13,
                  borderBottom: i < arr.length - 1 ? "1px solid #ffffff05" : "none",
                }}>
                  <span style={{ color: "#86efac44" }}>{k}</span>
                  <span style={{ color: String(v).startsWith("-") ? "#f87171" : "#d4edda", fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Guest List */}
            {b.guestDetails?.some(g => g.name) && (
              <div style={{ background: "#ffffff04", border: "1px solid #ffffff08", borderRadius: 12, overflow: "hidden", marginBottom: 10 }}>
                <div style={{ padding: "9px 14px", fontSize: 11, fontWeight: 700, color: "#86efac55", letterSpacing: "1px", textTransform: "uppercase", borderBottom: "1px solid #ffffff08" }}>
                  👥 Guest List
                </div>
                {b.guestDetails.filter(g => g.name).map((g, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, padding: "8px 14px", borderBottom: "1px solid #ffffff05", fontSize: 13 }}>
                    <span style={{ color: "#86efac33", minWidth: 20 }}>{i + 1}.</span>
                    <span style={{ color: "#d4edda", flex: 1 }}>{g.name}</span>
                    {g.age && <span style={{ color: "#86efac44" }}>{g.age} yrs</span>}
                    {g.gender && <span style={{ color: "#86efac22", textTransform: "capitalize" }}>{g.gender}</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Contact */}
            {b.contactDetails?.name && (
              <div style={{ background: "#ffffff04", border: "1px solid #ffffff08", borderRadius: 12, overflow: "hidden", marginBottom: 10 }}>
                <div style={{ padding: "9px 14px", fontSize: 11, fontWeight: 700, color: "#86efac55", letterSpacing: "1px", textTransform: "uppercase", borderBottom: "1px solid #ffffff08" }}>
                  📞 Contact
                </div>
                {[["Name", b.contactDetails.name], ["Email", b.contactDetails.email], ["Phone", b.contactDetails.phone]].filter(([, v]) => v).map(([k, v], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 14px", fontSize: 13, borderBottom: "1px solid #ffffff05" }}>
                    <span style={{ color: "#86efac44" }}>{k}</span>
                    <span style={{ color: "#d4edda" }}>{v}</span>
                  </div>
                ))}
              </div>
            )}

            {b.specialRequest && (
              <div style={{ background: "#86efac07", border: "1px solid #86efac11", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#86efac66", fontStyle: "italic" }}>
                💬 {b.specialRequest}
              </div>
            )}
          </div>
        )}

        {/* Total */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "linear-gradient(135deg,#052e1688,#0a3d1888)",
          border: "1px solid #22c55e18", borderRadius: 12, padding: "13px 16px",
          marginBottom: (b.bookingStatus !== "cancelled" && b.bookingStatus !== "completed") ? 12 : 0,
        }}>
          <div>
            <div style={{ fontSize: 11, color: "#86efac55", textTransform: "uppercase", letterSpacing: "1px" }}>Total Payable</div>
            {b.bookingSource && <div style={{ fontSize: 10, color: "#86efac22", marginTop: 2 }}>via {b.bookingSource}</div>}
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#86efac", fontWeight: 700 }}>
            {fmt.inr(b.totalAmount)}
          </div>
        </div>

        {/* Cancel Button */}
        {b.bookingStatus !== "cancelled" && b.bookingStatus !== "completed" && (
          <button type="button" onClick={handleCancel} disabled={cancelling} className="btn-red" style={{
            width: "100%", padding: 11,
            background: "#2d1010", border: "1px solid #ef444433", borderRadius: 12,
            color: "#f87171", cursor: cancelling ? "not-allowed" : "pointer",
            fontSize: 13, fontWeight: 600, fontFamily: "'Outfit', sans-serif",
            transition: "all 0.2s", opacity: cancelling ? 0.6 : 1,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            {cancelling
              ? <><span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid #f871714", borderTopColor: "#f87171", animation: "spin 0.8s linear infinite", display: "inline-block" }} />Cancel ho raha hai...</>
              : "✕ Booking Cancel Karo"
            }
          </button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   BOOKINGS LIST
============================================================ */
const FILTER_OPTIONS = [
  { key: "all",       label: "Saari",     color: "#86efac" },
  { key: "pending",   label: "Pending",   color: "#fb923c" },
  { key: "confirmed", label: "Confirmed", color: "#4ade80" },
  { key: "cancelled", label: "Cancelled", color: "#f87171" },
  { key: "completed", label: "Completed", color: "#93c5fd" },
];

function BookingsList({ isAdmin, refreshKey, toast }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const res = await api.get(isAdmin ? "/all" : "/my");
      if (res.success) setBookings(res.bookings || []);
      else setError(res.message || "Load nahi hua");
    } catch { setError("Server se data nahi mila"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [refreshKey, isAdmin]);

  const cancel = async (id) => {
    const res = await api.put(`/cancel/${id}`, { reason: "User cancelled from portal" });
    if (res.success) { toast("Booking cancel ho gayi", "success"); load(); }
    else toast(res.message || "Cancel nahi hua", "error");
  };

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.bookingStatus === filter);
  const counts = Object.fromEntries(FILTER_OPTIONS.map(f => [f.key, f.key === "all" ? bookings.length : bookings.filter(b => b.bookingStatus === f.key).length]));
  const totalRev = bookings.filter(b => b.paymentStatus === "paid").reduce((s, b) => s + (b.totalAmount || 0), 0);

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", letterSpacing: "2px", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e", display: "inline-block" }} />
          {isAdmin ? "ALL BOOKINGS" : ""}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: "#d4edda", lineHeight: 1.1 }}>
              {isAdmin ? " Bookings" : "Mera Adventure Log"}
            </h2>
            <p style={{ color: "#86efac44", fontSize: 14, marginTop: 5 }}>
              {bookings.length} booking{bookings.length !== 1 ? "s" : ""} mili
            </p>
          </div>
          <button onClick={load} style={{
            background: "transparent", border: "1px solid #ffffff11", borderRadius: 10,
            padding: "8px 16px", color: "#86efac44", cursor: "pointer", fontSize: 13,
            fontFamily: "'Outfit', sans-serif", display: "flex", alignItems: "center", gap: 7,
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#86efac33"; e.currentTarget.style.color = "#86efac"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#ffffff11"; e.currentTarget.style.color = "#86efac44"; }}
          >
            <span style={{ display: "inline-block", animation: loading ? "spin 1s linear infinite" : "none" }}>↻</span> Refresh
          </button>
        </div>
      </div>

      {/* Admin Summary Row */}
      {isAdmin && bookings.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
          {[
            { icon: "📋", label: "Total", val: bookings.length, color: "#86efac" },
            { icon: "⏳", label: "Pending", val: counts.pending, color: "#fb923c" },
            { icon: "💰", label: "Collected", val: fmt.inr(totalRev), color: "#4ade80" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#ffffff04", border: "1px solid #ffffff08", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 10, color: "#86efac33", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{s.val}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filter Row */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {FILTER_OPTIONS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding: "7px 14px", borderRadius: 20,
            border: `1px solid ${filter === f.key ? f.color + "44" : "#ffffff10"}`,
            background: filter === f.key ? f.color + "11" : "transparent",
            color: filter === f.key ? f.color : "#86efac44",
            cursor: "pointer", fontSize: 12, fontWeight: 600,
            fontFamily: "'Outfit', sans-serif", transition: "all 0.2s",
            display: "flex", alignItems: "center", gap: 7,
          }}>
            {f.label}
            <span style={{
              background: filter === f.key ? f.color + "22" : "#ffffff08",
              color: filter === f.key ? f.color : "#86efac33",
              borderRadius: 20, padding: "1px 7px", fontSize: 11, fontWeight: 700,
            }}>{counts[f.key]}</span>
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 14 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e", animation: `bounce 1.4s ${i * 0.2}s infinite` }} />
            ))}
          </div>
          <p style={{ color: "#86efac44", fontSize: 14 }}>Bookings load ho rahi hain...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background: "#2d0a0a", border: "1px solid #dc262633", borderRadius: 12, padding: "15px 20px", color: "#f87171", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>⚠️</span> {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: 52, marginBottom: 14, opacity: 0.35 }}>🌲</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#86efac55" }}>Koi booking nahi mili</div>
          <div style={{ color: "#86efac22", fontSize: 13, marginTop: 6 }}>
            {filter !== "all" ? `"${filter}" status mein koi booking nahi` : "Abhi tak koi booking nahi ki"}
          </div>
        </div>
      )}

      {!loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((b, i) => (
            <BookingCard key={b._id} b={b} onCancel={cancel} isAdmin={isAdmin} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   ROOT APP
============================================================ */
export default function CampsiteBookingApp() {
  const [tab, setTab] = useState("book");
  const [isAdmin, setIsAdmin] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { toasts, toast, remove } = useToast();

  const handleCreated = () => {
    setRefreshKey(k => k + 1);
    setTimeout(() => setTab("list"), 1200);
  };

  const TABS = [
    { key: "book", label: "Booking ", icon: "⛺" },
    { key: "list", label: isAdmin ? " Bookings" : "ALL Bookings", icon: "📋" },
  ];

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <Toast toasts={toasts} remove={remove} />

      <div style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse 80% 60% at 15% 10%, #0a2a1255 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 85% 90%, #051c0a44 0%, transparent 70%), #05100a",
        fontFamily: "'Outfit', sans-serif", color: "#d4edda",
      }}>
        {/* Header */}
        <header style={{
          position: "sticky", top: 0, zIndex: 50,
          background: "#05100add", backdropFilter: "blur(24px)",
          borderBottom: "1px solid #ffffff07",
          padding: "0 40px", height: 68,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          animation: "fadeUp 0.4s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 11,
              background: "linear-gradient(135deg,#16a34a,#0f6930)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, animation: "glow 3s ease infinite",
            }}>⛺</div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 21, color: "#86efac", lineHeight: 1 }}>WildStay</div>
              <div style={{ fontSize: 9, color: "#86efac33", letterSpacing: "2.5px", textTransform: "uppercase", marginTop: 2 }}>Camping Portal</div>
            </div>
          </div>

          <nav style={{ display: "flex", gap: 4, background: "#ffffff06", border: "1px solid #ffffff08", borderRadius: 12, padding: 4 }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} className={`tab-btn${tab === t.key ? " active" : ""}`} style={{
                padding: "8px 20px", borderRadius: 9,
                border: `1px solid ${tab === t.key ? "#22c55e33" : "transparent"}`,
                background: tab === t.key ? "#22c55e15" : "transparent",
                color: tab === t.key ? "#86efac" : "#86efac44",
                cursor: "pointer", fontSize: 13, fontWeight: 600,
                fontFamily: "'Outfit', sans-serif", transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: 7,
              }}>
                {t.icon} {t.label}
              </button>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: isAdmin ? "#86efac" : "#86efac33", transition: "color 0.3s", fontWeight: 500 }}>
              {isAdmin ? "🔑 Admin" : "User"}
            </span>
            <div onClick={() => setIsAdmin(v => !v)} style={{
              width: 46, height: 26, borderRadius: 13, cursor: "pointer", position: "relative",
              background: isAdmin ? "linear-gradient(135deg,#16a34a,#15803d)" : "#ffffff11",
              border: `1px solid ${isAdmin ? "#22c55e55" : "#ffffff11"}`,
              transition: "all 0.3s", boxShadow: isAdmin ? "0 0 14px #22c55e33" : "none",
            }}>
              <div style={{
                position: "absolute", top: 3, left: isAdmin ? 22 : 3,
                width: 18, height: 18, borderRadius: "50%", background: "#fff",
                transition: "left 0.3s cubic-bezier(0.34,1.56,0.64,1)", boxShadow: "0 2px 6px #0008",
              }} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 80px" }}>
          {tab === "book" && <BookingForm onCreated={handleCreated} toast={toast} />}
          {tab === "list" && <BookingsList isAdmin={isAdmin} refreshKey={refreshKey} toast={toast} />}
        </main>

        <footer style={{ textAlign: "center", padding: "20px", color: "#86efac15", fontSize: 11, letterSpacing: "2px", borderTop: "1px solid #ffffff05" }}>
          🌲 WILDSTAY — HAR RAAT EK NAYA SAFAR 🌲
        </footer>
      </div>
    </>
  );
}