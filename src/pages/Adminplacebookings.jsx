import { useState, useEffect } from "react";

const API = "https://bmtadmin.onrender.com/api/place-bookings";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #F5F4F0;
    --surface: #FFFFFF;
    --border: #E2E0D8;
    --border2: #D0CEC4;
    --text: #1A1916;
    --muted: #8A8880;
    --accent: #1A1916;
    --tag-bg: #EEECEA;
    --mono: 'IBM Plex Mono', monospace;
    --sans: 'IBM Plex Sans', sans-serif;
    --r: 6px;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--sans); font-size: 14px; }

  /* ── LAYOUT ── */
  .wrap { max-width: 1140px; margin: 0 auto; padding: 40px 24px; }

  /* ── TOP BAR ── */
  .topbar {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 28px;
    gap: 16px;
    flex-wrap: wrap;
  }
  .title-block h1 {
    font-family: var(--mono);
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: -0.5px;
    line-height: 1;
  }
  .title-block p { color: var(--muted); font-size: 0.8rem; margin-top: 5px; font-weight: 300; }

  .controls { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }

  /* ── STATS ROW ── */
  .stats {
    display: flex;
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: var(--r);
    overflow: hidden;
    margin-bottom: 20px;
  }
  .stat {
    flex: 1;
    background: var(--surface);
    padding: 14px 18px;
  }
  .stat-n {
    font-family: var(--mono);
    font-size: 1.4rem;
    font-weight: 600;
    line-height: 1;
  }
  .stat-l { font-size: 0.72rem; color: var(--muted); margin-top: 3px; text-transform: uppercase; letter-spacing: 0.6px; }

  /* ── FILTER TABS ── */
  .filters { display: flex; gap: 4px; margin-bottom: 16px; flex-wrap: wrap; }
  .ftab {
    padding: 5px 13px;
    border-radius: 100px;
    border: 1px solid var(--border2);
    background: transparent;
    font-family: var(--sans);
    font-size: 0.78rem;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.15s;
  }
  .ftab:hover { border-color: var(--accent); color: var(--text); }
  .ftab.on { background: var(--accent); border-color: var(--accent); color: #fff; }

  /* ── TABLE ── */
  .table-wrap {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r);
    overflow: hidden;
  }
  table { width: 100%; border-collapse: collapse; }
  thead { background: var(--bg); border-bottom: 1px solid var(--border); }
  th {
    padding: 10px 14px;
    font-family: var(--mono);
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--muted);
    text-align: left;
    white-space: nowrap;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    cursor: pointer;
    user-select: none;
  }
  th:hover { color: var(--text); }
  td { padding: 12px 14px; border-bottom: 1px solid var(--border); vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #FAFAF8; }

  .id-cell {
    font-family: var(--mono);
    font-size: 0.72rem;
    color: var(--muted);
  }
  .place-name { font-weight: 500; font-size: 0.875rem; }
  .user-name  { font-size: 0.82rem; color: var(--muted); }

  /* ── STATUS BADGE ── */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 9px;
    border-radius: 4px;
    font-family: var(--mono);
    font-size: 0.68rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    white-space: nowrap;
  }
  .badge-dot { width: 5px; height: 5px; border-radius: 50%; }

  .s-pending   { background: #FEF3C7; color: #92400E; }  .d-pending   { background: #D97706; }
  .s-confirmed { background: #D1FAE5; color: #065F46; }  .d-confirmed { background: #10B981; }
  .s-cancelled { background: #FFE4E6; color: #9F1239; }  .d-cancelled { background: #F43F5E; }
  .s-completed { background: #DBEAFE; color: #1E40AF; }  .d-completed { background: #3B82F6; }

  .pay-pending { color: #D97706; }
  .pay-paid    { color: #10B981; }
  .pay-failed  { color: #F43F5E; }

  /* ── AMOUNT ── */
  .amount { font-family: var(--mono); font-size: 0.875rem; font-weight: 600; }

  /* ── ACTION BTNS ── */
  .act-row { display: flex; gap: 6px; align-items: center; }
  .btn {
    padding: 5px 12px;
    border-radius: 4px;
    border: 1px solid var(--border2);
    background: transparent;
    font-family: var(--sans);
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .btn:hover { border-color: var(--accent); color: var(--text); }
  .btn-cancel { color: #F43F5E; border-color: rgba(244,63,94,0.3); }
  .btn-cancel:hover { background: rgba(244,63,94,0.06); border-color: #F43F5E; }
  .btn-primary { background: var(--accent); color: #fff; border-color: var(--accent); }
  .btn-primary:hover { opacity: 0.85; }

  /* ── SEARCH ── */
  .search {
    padding: 7px 12px;
    border: 1px solid var(--border2);
    border-radius: 4px;
    font-family: var(--sans);
    font-size: 0.82rem;
    color: var(--text);
    background: var(--surface);
    outline: none;
    width: 220px;
  }
  .search:focus { border-color: var(--accent); }
  .search::placeholder { color: var(--muted); }

  /* ── SELECT ── */
  .sel {
    padding: 6px 10px;
    border: 1px solid var(--border2);
    border-radius: 4px;
    font-family: var(--mono);
    font-size: 0.75rem;
    color: var(--text);
    background: var(--surface);
    cursor: pointer;
    outline: none;
  }

  /* ── MODAL ── */
  .overlay {
    position: fixed; inset: 0;
    background: rgba(26,25,22,0.5);
    backdrop-filter: blur(4px);
    z-index: 100;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  }
  .modal {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 28px;
    width: 100%;
    max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
  }
  .modal-head {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 20px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border);
  }
  .modal-head h2 { font-family: var(--mono); font-size: 1rem; font-weight: 600; }
  .close-btn {
    width: 26px; height: 26px; border-radius: 4px;
    border: 1px solid var(--border); background: transparent;
    cursor: pointer; color: var(--muted); font-size: 0.85rem;
    display: flex; align-items: center; justify-content: center;
  }
  .close-btn:hover { color: var(--text); }

  .drow {
    display: flex; justify-content: space-between;
    padding: 8px 0; border-bottom: 1px solid var(--border);
    font-size: 0.82rem; gap: 12px;
  }
  .drow:last-child { border-bottom: none; }
  .dk { color: var(--muted); flex-shrink: 0; }
  .dv { font-weight: 500; text-align: right; word-break: break-all; font-family: var(--mono); font-size: 0.78rem; }

  .status-row {
    display: flex; align-items: center; gap: 8px;
    padding: 14px 0; border-top: 1px solid var(--border); margin-top: 8px;
  }
  .status-row label { color: var(--muted); font-size: 0.78rem; flex-shrink: 0; }

  /* ── EMPTY / LOADER ── */
  .empty { text-align: center; padding: 60px; color: var(--muted); }
  .empty code { font-family: var(--mono); font-size: 0.78rem; display: block; margin-top: 6px; }
  .spin {
    width: 28px; height: 28px; margin: 60px auto; border-radius: 50%;
    border: 2px solid var(--border); border-top-color: var(--accent);
    animation: sp 0.7s linear infinite;
  }
  @keyframes sp { to { transform: rotate(360deg); } }

  .count-chip {
    font-family: var(--mono); font-size: 0.68rem;
    background: var(--tag-bg); border-radius: 3px;
    padding: 1px 5px; color: var(--muted);
  }

  @media (max-width: 768px) {
    .stats { flex-direction: column; gap: 1px; }
    table { display: block; overflow-x: auto; }
    .search { width: 100%; }
  }
`;

const fmt     = d => d ? new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—";
const fmtRs   = n => `₹${Number(n||0).toLocaleString("en-IN")}`;
const getName = v => typeof v === "object" ? (v?.name || v?.email || String(v?._id).slice(-6).toUpperCase()) : (v ? String(v).slice(-6).toUpperCase() : "—");

const STATUSES = ["pending","confirmed","cancelled","completed"];

function Badge({ s }) {
  return (
    <span className={`badge s-${s}`}>
      <span className={`badge-dot d-${s}`} />
      {s}
    </span>
  );
}

function DetailModal({ b, onClose, onStatusSaved }) {
  const [status, setStatus] = useState(b.bookingStatus);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await fetch(`${API}/status/${b._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      onStatusSaved(b._id, status);
      onClose();
    } catch {}
    setSaving(false);
  };

  const rows = [
    ["ID",             b._id],
    ["Place",          getName(b.placeId)],
    ["User",           getName(b.userId)],
    ["Visit Date",     fmt(b.visitDate)],
    ["Booked On",      fmt(b.bookingDate || b.createdAt)],
    ["Guests",         b.totalGuests],
    ["Price/Person",   fmtRs(b.pricePerPerson)],
    ["Total",          fmtRs(b.totalAmount)],
    ["Payment",        b.paymentStatus],
    ["Method",         b.paymentMethod || "—"],
    ["Txn ID",         b.transactionId || "—"],
    ["Contact Name",   b.contactDetails?.name || "—"],
    ["Contact Phone",  b.contactDetails?.phone || "—"],
    ["Contact Email",  b.contactDetails?.email || "—"],
    ["Special Req.",   b.specialRequest || "—"],
  ];

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <h2>#{String(b._id).slice(-8).toUpperCase()}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {rows.map(([k, v]) => (
          <div className="drow" key={k}>
            <span className="dk">{k}</span>
            <span className="dv">{v}</span>
          </div>
        ))}

        <div className="status-row">
          <label>Update Status</label>
          <select className="sel" value={status} onChange={e => setStatus(e.target.value)}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <button className="btn btn-primary" onClick={save} disabled={saving} style={{ marginLeft: "auto" }}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPlaceBookings() {
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState("all");
  const [search, setSearch]       = useState("");
  const [sortKey, setSortKey]     = useState("createdAt");
  const [sortDir, setSortDir]     = useState(-1);
  const [selected, setSelected]   = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API}/all`);
        const d = await r.json();
        if (d.success) setBookings(d.bookings);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const cancel = async (id) => {
    if (!confirm("Cancel this booking?")) return;
    try {
      const r = await fetch(`${API}/cancel/${id}`, { method: "PUT" });
      const d = await r.json();
      if (d.success) setBookings(b => b.map(x => x._id === id ? { ...x, bookingStatus: "cancelled" } : x));
    } catch {}
  };

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d * -1);
    else { setSortKey(key); setSortDir(-1); }
  };

  const counts  = STATUSES.reduce((a, s) => ({ ...a, [s]: bookings.filter(b => b.bookingStatus === s).length }), {});
  const revenue = bookings.filter(b => b.bookingStatus !== "cancelled").reduce((s, b) => s + (b.totalAmount || 0), 0);

  const visible = bookings
    .filter(b => filter === "all" || b.bookingStatus === filter)
    .filter(b => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        String(b._id).toLowerCase().includes(q) ||
        getName(b.placeId).toLowerCase().includes(q) ||
        getName(b.userId).toLowerCase().includes(q) ||
        (b.contactDetails?.name || "").toLowerCase().includes(q) ||
        (b.contactDetails?.phone || "").includes(q)
      );
    })
    .sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (sortKey === "totalAmount" || sortKey === "totalGuests") { av = Number(av); bv = Number(bv); }
      else { av = String(av); bv = String(bv); }
      return av < bv ? sortDir : av > bv ? -sortDir : 0;
    });

  const sortIcon = (k) => sortKey === k ? (sortDir === -1 ? " ↓" : " ↑") : "";

  return (
    <>
      <style>{S}</style>
      <div className="wrap">

        {/* TOP */}
        <div className="topbar">
          <div className="title-block">
            <h1>place_bookings</h1>
            <p>All bookings · Admin view</p>
          </div>
          <div className="controls">
            <input className="search" placeholder="Search ID, place, user…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* STATS */}
        <div className="stats">
          {[
            { label: "Total",     val: bookings.length },
            { label: "Revenue",   val: fmtRs(revenue) },
            { label: "Pending",   val: counts.pending   || 0 },
            { label: "Confirmed", val: counts.confirmed || 0 },
            { label: "Cancelled", val: counts.cancelled || 0 },
            { label: "Completed", val: counts.completed || 0 },
          ].map(s => (
            <div className="stat" key={s.label}>
              <div className="stat-n">{s.val}</div>
              <div className="stat-l">{s.label}</div>
            </div>
          ))}
        </div>

        {/* FILTERS */}
        <div className="filters">
          {["all", ...STATUSES].map(f => (
            <button key={f} className={`ftab ${filter === f ? "on" : ""}`} onClick={() => setFilter(f)}>
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== "all" && counts[f] ? <span className="count-chip" style={{ marginLeft: 5 }}>{counts[f]}</span> : null}
            </button>
          ))}
          <span style={{ marginLeft: "auto", color: "var(--muted)", fontSize: "0.75rem", alignSelf: "center" }}>
            {visible.length} record{visible.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* TABLE */}
        <div className="table-wrap">
          {loading ? <div className="spin" /> : !visible.length ? (
            <div className="empty">
              No bookings found
              <code>{filter !== "all" ? `status = ${filter}` : search ? `q = "${search}"` : "empty collection"}</code>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSort("_id")}>ID{sortIcon("_id")}</th>
                  <th>Place</th>
                  <th>User</th>
                  <th onClick={() => handleSort("visitDate")}>Visit Date{sortIcon("visitDate")}</th>
                  <th onClick={() => handleSort("totalGuests")}>Guests{sortIcon("totalGuests")}</th>
                  <th onClick={() => handleSort("totalAmount")}>Amount{sortIcon("totalAmount")}</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map(b => (
                  <tr key={b._id}>
                    <td className="id-cell">#{String(b._id).slice(-8).toUpperCase()}</td>
                    <td>
                      <div className="place-name">{getName(b.placeId)}</div>
                    </td>
                    <td>
                      <div className="user-name">{getName(b.userId)}</div>
                      {b.contactDetails?.phone && <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontFamily: "var(--mono)" }}>{b.contactDetails.phone}</div>}
                    </td>
                    <td style={{ fontFamily: "var(--mono)", fontSize: "0.78rem" }}>{fmt(b.visitDate)}</td>
                    <td style={{ textAlign: "center" }}>{b.totalGuests}</td>
                    <td><span className="amount">{fmtRs(b.totalAmount)}</span></td>
                    <td>
                      <span className={`pay-${b.paymentStatus}`} style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.4px" }}>
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td><Badge s={b.bookingStatus} /></td>
                    <td>
                      <div className="act-row">
                        <button className="btn" onClick={() => setSelected(b)}>View</button>
                        {b.bookingStatus !== "cancelled" && (
                          <button className="btn btn-cancel" onClick={() => cancel(b._id)}>Cancel</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

      {selected && (
        <DetailModal
          b={selected}
          onClose={() => setSelected(null)}
          onStatusSaved={(id, status) => {
            setBookings(b => b.map(x => x._id === id ? { ...x, bookingStatus: status } : x));
            setSelected(null);
          }}
        />
      )}
    </>
  );
}