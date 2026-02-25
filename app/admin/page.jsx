"use client";
import { useState, useEffect, useMemo } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_BOOKINGS = [
  {
    id: "BKG7F2A1K",
    guestName: "Rajesh Sharma",
    phone: "9876543210",
    address: "12 Mall Road, Darjeeling, WB",
    checkIn: "2026-02-20",
    checkOut: "2026-02-24",
    rooms: 2,
    nights: 4,
    total: 20000,
    status: "paid",
    paymentId: "pay_QmN8xTr3vK1234",
    razorpayOrderId: "order_Qm8xTr3vK12ABC",
    createdAt: "2026-02-17T09:14:22Z",
    cancellationNote: "",
  },
  {
    id: "BKG3C9D4P",
    guestName: "Priya Mehta",
    phone: "9123456789",
    address: "45 Rishi Road, Kalimpong, WB",
    checkIn: "2026-02-22",
    checkOut: "2026-02-25",
    rooms: 3,
    nights: 3,
    total: 22500,
    status: "paid",
    paymentId: "pay_Rp9yVs4wL5678",
    razorpayOrderId: "order_Rp9yVs4wL56DEF",
    createdAt: "2026-02-16T14:30:10Z",
    cancellationNote: "",
  },
  {
    id: "BKG1E5H8R",
    guestName: "Arun Bose",
    phone: "9988776655",
    address: "7 Deolo Hill Lane, Kalimpong",
    checkIn: "2026-02-28",
    checkOut: "2026-03-03",
    rooms: 1,
    nights: 3,
    total: 7500,
    status: "paid",
    paymentId: "pay_Sk2zA6bM9012",
    razorpayOrderId: "order_Sk2zA6bM90GHI",
    createdAt: "2026-02-15T11:05:45Z",
    cancellationNote: "",
  },
  {
    id: "BKG9A2L6N",
    guestName: "Sunita Gurung",
    phone: "9700112233",
    address: "23 Tista Road, Siliguri, WB",
    checkIn: "2026-03-05",
    checkOut: "2026-03-08",
    rooms: 4,
    nights: 3,
    total: 30000,
    status: "paid",
    paymentId: "pay_Tl3bB7cN3456",
    razorpayOrderId: "order_Tl3bB7cN34JKL",
    createdAt: "2026-02-14T08:22:00Z",
    cancellationNote: "",
  },
  {
    id: "BKG6M4T2V",
    guestName: "Dipesh Tamang",
    phone: "9456781234",
    address: "Lal Bazar, Kalimpong, WB 734301",
    checkIn: "2026-03-10",
    checkOut: "2026-03-13",
    rooms: 2,
    nights: 3,
    total: 15000,
    status: "paid",
    paymentId: "pay_Um4cC8dO7890",
    razorpayOrderId: "order_Um4cC8dO78MNO",
    createdAt: "2026-02-13T17:48:30Z",
    cancellationNote: "",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function fmtDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    paid: {
      bg: "rgba(80,200,120,0.13)",
      color: "#5ec882",
      border: "rgba(80,200,120,0.3)",
      label: "Paid",
    },
    cancelled: {
      bg: "rgba(220,80,80,0.12)",
      color: "#e07a7a",
      border: "rgba(220,80,80,0.3)",
      label: "Cancelled",
    },
    initiated: {
      bg: "rgba(220,180,60,0.12)",
      color: "#e8c96a",
      border: "rgba(220,180,60,0.3)",
      label: "Initiated",
    },
    failed: {
      bg: "rgba(160,80,200,0.12)",
      color: "#b87ae8",
      border: "rgba(160,80,200,0.3)",
      label: "Failed",
    },
  };
  const s = map[status] || map.initiated;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        borderRadius: 3,
        padding: "3px 10px",
        fontSize: 11,
        fontFamily: "'DM Mono', monospace",
        letterSpacing: "0.06em",
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {sub && <div className="stat-sub">{sub}</div>}
      </div>
    </div>
  );
}

function DetailRow({ label, value, mono }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "9px 0",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <span
        style={{
          fontFamily: "'Lora', serif",
          fontSize: 12,
          color: "rgba(240,230,210,0.45)",
          letterSpacing: "0.04em",
          minWidth: 140,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: mono ? "'DM Mono', monospace" : "'Lora', serif",
          fontSize: mono ? 12 : 14,
          color: "#f0e6d2",
          textAlign: "right",
          wordBreak: "break-all",
          maxWidth: 220,
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => setMounted(true), 60);
  }, []);

  async function handleLogin() {
    if (!user || !pass) {
      setErr("Please enter credentials.");
      return;
    }
    setLoading(true);
    setErr("");
    await new Promise((r) => setTimeout(r, 900));
    // Mock: admin / admin123
    if (user === "admin" && pass === "admin123") {
      onLogin({ name: "Admin", token: "mock-jwt-token-xyz" });
    } else {
      setErr("Invalid username or password.");
    }
    setLoading(false);
  }

  return (
    <div className={`login-root ${mounted ? "vis" : ""}`}>
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">🏨</div>
        </div>
        <div className="login-hotel">Traditional Hotel & Restaurant</div>
        <div className="login-sub">Admin Portal · Kalimpong, Darjeeling</div>

        <div className="login-divider">
          <span />
        </div>

        <div className="login-field-group">
          <label className="login-label">Username</label>
          <input
            className="login-input"
            type="text"
            value={user}
            onChange={(e) => {
              setUser(e.target.value);
              setErr("");
            }}
            placeholder="admin"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>
        <div className="login-field-group" style={{ marginTop: 16 }}>
          <label className="login-label">Password</label>
          <input
            className="login-input"
            type="password"
            value={pass}
            onChange={(e) => {
              setPass(e.target.value);
              setErr("");
            }}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        {err && <div className="login-error">⚠ {err}</div>}

        <button className="login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? <span className="ring" /> : null}
          {loading ? "Authenticating…" : "Sign In"}
        </button>

        <div className="login-hint">Use: admin / admin123</div>
      </div>
    </div>
  );
}

// ─── Cancel Modal ─────────────────────────────────────────────────────────────
function CancelModal({ booking, onConfirm, onClose }) {
  const [note, setNote] = useState("");
  const [refund, setRefund] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    onConfirm({ note, refund });
    setLoading(false);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Cancel Booking</span>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div
            style={{
              fontFamily: "'Lora', serif",
              fontSize: 14,
              color: "rgba(240,230,210,0.7)",
              marginBottom: 20,
              lineHeight: 1.6,
            }}
          >
            You are about to cancel{" "}
            <strong style={{ color: "#f0e6d2" }}>{booking.guestName}</strong>
            {"'"}s booking ({booking.id}). This action will free up{" "}
            {booking.rooms} room(s) for the dates{" "}
            <strong style={{ color: "#f0e6d2" }}>
              {fmtDate(booking.checkIn)} – {fmtDate(booking.checkOut)}
            </strong>
            .
          </div>

          <label className="modal-label">Cancellation Note (optional)</label>
          <textarea
            className="modal-textarea"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Reason for cancellation…"
            rows={3}
          />

          <div className="modal-toggle" onClick={() => setRefund((r) => !r)}>
            <div className={`toggle-box ${refund ? "on" : ""}`}>
              {refund && <span>✓</span>}
            </div>
            <span className="toggle-label">
              Trigger Razorpay Refund ({fmt(booking.total)})
            </span>
          </div>

          {refund && (
            <div className="modal-refund-notice">
              Refund will be initiated via Razorpay API. Amount will be credited
              within 5–7 business days.
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onClose}>
            Keep Booking
          </button>
          <button
            className="modal-btn-confirm"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? <span className="ring-dark" /> : null}
            {loading ? "Cancelling…" : "Yes, Cancel Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Booking Row / Expanded Detail ────────────────────────────────────────────
function BookingRow({ booking, isExpanded, onToggle, onCancel }) {
  return (
    <>
      <tr
        className={`table-row ${isExpanded ? "expanded" : ""} ${booking.status === "cancelled" ? "row-cancelled" : ""}`}
        onClick={onToggle}
      >
        <td className="td">
          <span className="booking-id">{booking.id}</span>
        </td>
        <td className="td">
          <div className="guest-name">{booking.guestName}</div>
          <div className="guest-phone">{booking.phone}</div>
        </td>
        <td className="td td-date">
          <div className="date-range">{fmtDate(booking.checkIn)}</div>
          <div className="date-arrow">→ {fmtDate(booking.checkOut)}</div>
        </td>
        <td className="td td-rooms">{booking.rooms}</td>
        <td className="td td-amount">{fmt(booking.total)}</td>
        <td className="td td-center">
          <StatusBadge status={booking.status} />
        </td>
        <td className="td td-center">
          <span className={`expand-arrow ${isExpanded ? "open" : ""}`}>›</span>
        </td>
      </tr>

      {isExpanded && (
        <tr className="detail-row">
          <td colSpan={7}>
            <div className="detail-panel">
              <div className="detail-grid">
                <div className="detail-section">
                  <div className="detail-section-title">Guest Information</div>
                  <DetailRow label="Full Name" value={booking.guestName} />
                  <DetailRow label="Phone" value={booking.phone} mono />
                  <DetailRow label="Address" value={booking.address} />
                </div>
                <div className="detail-section">
                  <div className="detail-section-title">Stay Details</div>
                  <DetailRow
                    label="Check-In"
                    value={fmtDate(booking.checkIn)}
                  />
                  <DetailRow
                    label="Check-Out"
                    value={fmtDate(booking.checkOut)}
                  />
                  <DetailRow
                    label="Duration"
                    value={`${booking.nights} night${booking.nights > 1 ? "s" : ""}`}
                  />
                  <DetailRow
                    label="Rooms"
                    value={`${booking.rooms} room${booking.rooms > 1 ? "s" : ""}`}
                  />
                  <DetailRow label="Total Paid" value={fmt(booking.total)} />
                </div>
                <div className="detail-section">
                  <div className="detail-section-title">Payment Details</div>
                  <DetailRow
                    label="Payment ID"
                    value={booking.paymentId}
                    mono
                  />
                  <DetailRow
                    label="Razorpay Order ID"
                    value={booking.razorpayOrderId}
                    mono
                  />
                  <DetailRow
                    label="Booking Created"
                    value={fmtDateTime(booking.createdAt)}
                  />
                  <DetailRow
                    label="Status"
                    value={<StatusBadge status={booking.status} />}
                  />
                  {booking.cancellationNote && (
                    <DetailRow
                      label="Cancellation Note"
                      value={booking.cancellationNote}
                    />
                  )}
                </div>
              </div>

              {booking.status === "paid" && (
                <div className="detail-actions">
                  <button
                    className="btn-cancel-booking"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCancel();
                    }}
                  >
                    ✕ Cancel Booking
                  </button>
                </div>
              )}
              {booking.status === "cancelled" && (
                <div className="cancelled-notice">
                  This booking has been cancelled. Dates are now available.
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
function AdminDashboard({ admin, onLogout }) {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [expandedId, setExpandedId] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [searchPhone, setSearchPhone] = useState("");
  const [filterCheckIn, setFilterCheckIn] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => setMounted(true), 60);
  }, []);

  // Stats (only paid)
  const paidBookings = bookings.filter((b) => b.status === "paid");
  const cancelledCount = bookings.filter(
    (b) => b.status === "cancelled",
  ).length;
  const totalRevenue = paidBookings.reduce((s, b) => s + b.total, 0);
  const totalRooms = paidBookings.reduce((s, b) => s + b.rooms, 0);

  // Filtered list (show paid + cancelled in dashboard)
  const filtered = useMemo(() => {
    let list = [...bookings].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
    if (searchPhone) list = list.filter((b) => b.phone.includes(searchPhone));
    if (filterCheckIn) list = list.filter((b) => b.checkIn === filterCheckIn);
    if (filterDateFrom) list = list.filter((b) => b.checkIn >= filterDateFrom);
    if (filterDateTo) list = list.filter((b) => b.checkIn <= filterDateTo);
    return list;
  }, [bookings, searchPhone, filterCheckIn, filterDateFrom, filterDateTo]);

  function handleCancel(id, { note, refund }) {
    setBookings((bs) =>
      bs.map((b) =>
        b.id === id
          ? {
              ...b,
              status: "cancelled",
              cancellationNote: note || "Cancelled by admin",
            }
          : b,
      ),
    );
    setCancelTarget(null);
    if (expandedId === id) setExpandedId(null);
  }

  function clearFilters() {
    setSearchPhone("");
    setFilterCheckIn("");
    setFilterDateFrom("");
    setFilterDateTo("");
  }

  const hasFilters =
    searchPhone || filterCheckIn || filterDateFrom || filterDateTo;

  return (
    <div className={`admin-root ${mounted ? "vis" : ""}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-icon">🏨</div>
          <div>
            <div className="sidebar-name">Traditional</div>
            <div className="sidebar-sub">Hotel & Restaurant</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item active">
            <span className="nav-icon">▦</span> Dashboard
          </div>
          <div className="nav-item">
            <span className="nav-icon">📅</span> Bookings
          </div>
          <div className="nav-item">
            <span className="nav-icon">🛏</span> Rooms
          </div>
          <div className="nav-item">
            <span className="nav-icon">💳</span> Payments
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{admin.name[0]}</div>
            <div>
              <div className="sidebar-username">{admin.name}</div>
              <div className="sidebar-role">Administrator</div>
            </div>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        {/* Top bar */}
        <div className="topbar">
          <div>
            <div className="page-title">Booking Dashboard</div>
            <div className="page-sub">
              Kalimpong, Darjeeling ·{" "}
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
          <div className="topbar-right">
            <div className="availability-pill">
              <span className="avail-dot" />
              {9 - totalRooms < 0 ? 0 : 9 - totalRooms} of 9 rooms available
              today
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <StatCard
            icon="📋"
            label="Active Bookings"
            value={paidBookings.length}
            sub="Status: Paid"
          />
          <StatCard
            icon="💰"
            label="Total Revenue"
            value={fmt(totalRevenue)}
            sub="Paid bookings"
          />
          <StatCard
            icon="🛏"
            label="Rooms Occupied"
            value={`${totalRooms} / 9`}
            sub="Max capacity: 9"
          />
          <StatCard
            icon="✕"
            label="Cancelled"
            value={cancelledCount}
            sub="This session"
          />
        </div>

        {/* Filters bar */}
        <div className="filters-bar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              type="tel"
              placeholder="Search by phone number…"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
            />
          </div>

          <button
            className={`filter-toggle-btn ${showFilters ? "active" : ""}`}
            onClick={() => setShowFilters((s) => !s)}
          >
            ⚙ Filters {hasFilters && <span className="filter-dot" />}
          </button>

          {hasFilters && (
            <button className="clear-btn" onClick={clearFilters}>
              ✕ Clear
            </button>
          )}
        </div>

        {showFilters && (
          <div className="filter-panel">
            <div className="filter-group">
              <label className="filter-label">Check-In Date</label>
              <input
                className="filter-input"
                type="date"
                value={filterCheckIn}
                onChange={(e) => setFilterCheckIn(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label className="filter-label">Date Range — From</label>
              <input
                className="filter-input"
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label className="filter-label">Date Range — To</label>
              <input
                className="filter-input"
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Table */}
        <div className="table-wrap">
          <div className="table-header-row">
            <span className="table-count">
              {filtered.length} booking{filtered.length !== 1 ? "s" : ""} shown
            </span>
            <span className="table-note">Click a row to expand details</span>
          </div>
          <div className="table-scroll">
            <table className="booking-table">
              <thead>
                <tr>
                  {[
                    "Booking ID",
                    "Guest",
                    "Check-In / Check-Out",
                    "Rooms",
                    "Amount",
                    "Status",
                    "",
                  ].map((h) => (
                    <th key={h} className="th">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="empty-row">
                      No bookings match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((b) => (
                    <BookingRow
                      key={b.id}
                      booking={b}
                      isExpanded={expandedId === b.id}
                      onToggle={() =>
                        setExpandedId((id) => (id === b.id ? null : b.id))
                      }
                      onCancel={() => setCancelTarget(b)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Internal status legend */}
        <div className="status-legend">
          <span className="legend-title">Internal Status System:</span>
          {["initiated", "paid", "cancelled", "failed"].map((s) => (
            <span key={s} style={{ marginLeft: 12 }}>
              <StatusBadge status={s} />
            </span>
          ))}
          <span className="legend-note">
            · Availability logic checks only <code>status = {`"paid"`}</code> ·
            Max 9 rooms per overlapping date range
          </span>
        </div>
      </main>

      {/* Cancel Modal */}
      {cancelTarget && (
        <CancelModal
          booking={cancelTarget}
          onConfirm={({ note, refund }) =>
            handleCancel(cancelTarget.id, { note, refund })
          }
          onClose={() => setCancelTarget(null)}
        />
      )}
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Cinzel:wght@400;600;700&family=DM+Mono:wght@400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0e1118; }

        /* ── Login ── */
        .login-root {
          min-height: 100vh;
          background: #0b0f1a;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.7s ease, transform 0.7s ease;
          position: relative;
          overflow: hidden;
        }
        .login-root::before {
          content: '';
          position: fixed; inset: 0;
          background:
            radial-gradient(ellipse at 70% 20%, rgba(180,140,80,0.07) 0%, transparent 55%),
            radial-gradient(ellipse at 20% 80%, rgba(60,100,180,0.05) 0%, transparent 55%);
          pointer-events: none;
        }
        .login-root.vis { opacity: 1; transform: translateY(0); }
        .login-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(180,140,80,0.2);
          border-radius: 6px;
          padding: 48px 44px;
          width: 100%; max-width: 400px;
          position: relative;
          backdrop-filter: blur(12px);
        }
        .login-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(180,140,80,0.5), transparent);
        }
        .login-logo { text-align: center; margin-bottom: 16px; }
        .login-logo-icon { font-size: 36px; }
        .login-hotel {
          font-family: 'Cinzel', serif;
          font-size: 17px; font-weight: 600;
          color: #f0e6d2;
          text-align: center; letter-spacing: 0.06em;
          margin-bottom: 4px;
        }
        .login-sub {
          font-family: 'Lora', serif; font-style: italic;
          font-size: 13px; color: rgba(240,230,210,0.4);
          text-align: center; margin-bottom: 28px;
        }
        .login-divider {
          display: flex; align-items: center;
          margin-bottom: 28px;
        }
        .login-divider span {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(180,140,80,0.35), transparent);
        }
        .login-label {
          display: block;
          font-family: 'Cinzel', serif;
          font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
          color: #b8976a; margin-bottom: 8px;
        }
        .login-field-group {}
        .login-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(180,140,80,0.22);
          border-radius: 3px;
          padding: 13px 15px;
          color: #f0e6d2;
          font-family: 'Lora', serif; font-size: 15px;
          outline: none;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .login-input::placeholder { color: rgba(240,230,210,0.25); }
        .login-input:focus {
          border-color: #b8976a;
          box-shadow: 0 0 0 3px rgba(184,151,106,0.12);
        }
        .login-error {
          margin-top: 14px;
          background: rgba(220,80,80,0.09);
          border: 1px solid rgba(220,80,80,0.3);
          border-radius: 3px;
          padding: 11px 14px;
          font-family: 'Lora', serif; font-size: 13px;
          color: #e07a7a;
        }
        .login-btn {
          width: 100%; margin-top: 24px;
          padding: 15px;
          background: linear-gradient(135deg, #c8a870 0%, #a07840 50%, #c8a870 100%);
          background-size: 200%;
          border: none; border-radius: 3px;
          color: #0a0f1a;
          font-family: 'Cinzel', serif; font-size: 12px;
          font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
          cursor: pointer;
          transition: background-position 0.4s, transform 0.2s, box-shadow 0.3s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .login-btn:hover:not(:disabled) {
          background-position: 100%;
          box-shadow: 0 6px 24px rgba(184,151,106,0.3);
          transform: translateY(-1px);
        }
        .login-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .login-hint {
          margin-top: 14px; text-align: center;
          font-family: 'DM Mono', monospace; font-size: 11px;
          color: rgba(240,230,210,0.2); letter-spacing: 0.06em;
        }
        .ring {
          display: inline-block; width: 16px; height: 16px;
          border: 2px solid rgba(10,15,26,0.3); border-top-color: #0a0f1a;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        .ring-dark {
          display: inline-block; width: 14px; height: 14px;
          border: 2px solid rgba(240,230,210,0.2); border-top-color: #f0e6d2;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Dashboard Layout ── */
        .admin-root {
          display: flex; min-height: 100vh;
          background: #0e1118;
          opacity: 0; transition: opacity 0.6s ease;
          font-family: 'Lora', serif;
        }
        .admin-root.vis { opacity: 1; }

        /* ── Sidebar ── */
        .sidebar {
          width: 220px; flex-shrink: 0;
          background: #090d16;
          border-right: 1px solid rgba(180,140,80,0.12);
          display: flex; flex-direction: column;
          padding: 28px 0;
          position: sticky; top: 0; height: 100vh;
        }
        .sidebar-brand {
          display: flex; align-items: center; gap: 12px;
          padding: 0 20px 28px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          margin-bottom: 24px;
        }
        .sidebar-icon { font-size: 24px; }
        .sidebar-name {
          font-family: 'Cinzel', serif; font-size: 13px; font-weight: 700;
          color: #f0e6d2; letter-spacing: 0.06em;
        }
        .sidebar-sub {
          font-family: 'Lora', serif; font-size: 10px; font-style: italic;
          color: rgba(240,230,210,0.35); margin-top: 1px;
        }
        .sidebar-nav { flex: 1; padding: 0 12px; }
        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px;
          border-radius: 4px;
          font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(240,230,210,0.35);
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 4px;
        }
        .nav-item.active {
          background: rgba(184,151,106,0.12);
          color: #c8a870;
          border: 1px solid rgba(184,151,106,0.2);
        }
        .nav-item:not(.active):hover {
          background: rgba(255,255,255,0.04);
          color: rgba(240,230,210,0.6);
        }
        .nav-icon { font-size: 14px; }
        .sidebar-footer {
          padding: 20px 20px 0;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .sidebar-user {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 14px;
        }
        .sidebar-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: linear-gradient(135deg, #c8a870, #8a6030);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cinzel', serif; font-size: 13px; font-weight: 700;
          color: #0a0f1a;
        }
        .sidebar-username {
          font-family: 'Cinzel', serif; font-size: 11px; color: #f0e6d2;
          letter-spacing: 0.06em;
        }
        .sidebar-role {
          font-family: 'Lora', serif; font-size: 10px; font-style: italic;
          color: rgba(240,230,210,0.35); margin-top: 1px;
        }
        .logout-btn {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(180,140,80,0.2);
          border-radius: 3px;
          padding: 9px;
          color: rgba(240,230,210,0.45);
          font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 0.16em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .logout-btn:hover {
          border-color: rgba(180,140,80,0.45);
          color: #c8a870;
          background: rgba(184,151,106,0.06);
        }

        /* ── Main ── */
        .admin-main {
          flex: 1; min-width: 0;
          padding: 36px 36px 60px;
          overflow-x: auto;
        }

        /* ── Topbar ── */
        .topbar {
          display: flex; align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 32px;
          flex-wrap: wrap; gap: 16px;
        }
        .page-title {
          font-family: 'Cinzel', serif; font-size: 24px; font-weight: 700;
          color: #f0e6d2; letter-spacing: 0.06em;
        }
        .page-sub {
          font-family: 'Lora', serif; font-style: italic;
          font-size: 13px; color: rgba(240,230,210,0.38);
          margin-top: 4px;
        }
        .topbar-right { display: flex; align-items: center; gap: 12px; }
        .availability-pill {
          display: flex; align-items: center; gap: 8px;
          background: rgba(80,200,120,0.09);
          border: 1px solid rgba(80,200,120,0.25);
          border-radius: 20px;
          padding: 7px 16px;
          font-family: 'DM Mono', monospace; font-size: 12px;
          color: #5ec882;
        }
        .avail-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #5ec882;
          box-shadow: 0 0 6px #5ec882;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; } 50% { opacity: 0.4; }
        }

        /* ── Stats ── */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        @media (max-width: 900px) { .stats-row { grid-template-columns: repeat(2, 1fr); } }
        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(180,140,80,0.14);
          border-radius: 4px;
          padding: 20px;
          display: flex; align-items: center; gap: 16px;
          transition: border-color 0.3s;
        }
        .stat-card:hover { border-color: rgba(180,140,80,0.3); }
        .stat-icon { font-size: 26px; }
        .stat-value {
          font-family: 'Cinzel', serif; font-size: 20px; font-weight: 700;
          color: #f0e6d2; letter-spacing: 0.04em;
        }
        .stat-label {
          font-family: 'Lora', serif; font-size: 12px;
          color: rgba(240,230,210,0.5);
        }
        .stat-sub {
          font-family: 'DM Mono', monospace; font-size: 10px;
          color: rgba(184,151,106,0.5); margin-top: 2px;
        }

        /* ── Filters ── */
        .filters-bar {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 16px; flex-wrap: wrap;
        }
        .search-box {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(180,140,80,0.2);
          border-radius: 3px;
          padding: 10px 14px;
          flex: 1; min-width: 220px;
        }
        .search-icon { font-size: 13px; }
        .search-input {
          background: transparent; border: none; outline: none;
          color: #f0e6d2; font-family: 'DM Mono', monospace; font-size: 13px;
          flex: 1;
        }
        .search-input::placeholder { color: rgba(240,230,210,0.25); }
        .filter-toggle-btn {
          display: flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(180,140,80,0.2);
          border-radius: 3px;
          padding: 10px 16px;
          color: rgba(240,230,210,0.55);
          font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }
        .filter-toggle-btn.active {
          background: rgba(184,151,106,0.1);
          border-color: rgba(184,151,106,0.4);
          color: #c8a870;
        }
        .filter-toggle-btn:hover { border-color: rgba(180,140,80,0.4); color: #c8a870; }
        .filter-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #c8a870;
        }
        .clear-btn {
          background: transparent;
          border: 1px solid rgba(220,80,80,0.3);
          border-radius: 3px;
          padding: 10px 14px;
          color: #e07a7a;
          font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .clear-btn:hover { background: rgba(220,80,80,0.08); border-color: rgba(220,80,80,0.5); }

        .filter-panel {
          display: flex; gap: 16px; flex-wrap: wrap;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(180,140,80,0.15);
          border-radius: 4px;
          padding: 18px 20px;
          margin-bottom: 16px;
        }
        .filter-group { display: flex; flex-direction: column; gap: 6px; }
        .filter-label {
          font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.18em;
          text-transform: uppercase; color: rgba(184,151,106,0.6);
        }
        .filter-input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(180,140,80,0.2);
          border-radius: 3px;
          padding: 9px 12px;
          color: #f0e6d2;
          font-family: 'DM Mono', monospace; font-size: 13px;
          outline: none;
          transition: border-color 0.2s;
        }
        .filter-input:focus { border-color: #b8976a; }
        .filter-input::-webkit-calendar-picker-indicator {
          filter: invert(0.7) sepia(0.4) saturate(2); cursor: pointer;
        }

        /* ── Table ── */
        .table-wrap {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(180,140,80,0.14);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 20px;
        }
        .table-header-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .table-count {
          font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 0.14em;
          text-transform: uppercase; color: rgba(184,151,106,0.7);
        }
        .table-note {
          font-family: 'Lora', serif; font-style: italic; font-size: 12px;
          color: rgba(240,230,210,0.25);
        }
        .table-scroll { overflow-x: auto; }
        .booking-table {
          width: 100%; border-collapse: collapse;
          min-width: 700px;
        }
        .th {
          padding: 12px 16px;
          font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.16em;
          text-transform: uppercase; color: rgba(184,151,106,0.6);
          text-align: left;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(184,151,106,0.04);
          white-space: nowrap;
        }
        .td {
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          vertical-align: middle;
        }
        .td-center { text-align: center; }
        .td-rooms { text-align: center; font-family: 'DM Mono', monospace; font-size: 15px; color: #ffffff; font-weight: 500; }
        .td-date {}
        .td-amount {
          font-family: 'DM Mono', monospace; font-size: 14px;
          color: #c8a870; font-weight: 500;
        }
        .table-row {
          cursor: pointer;
          transition: background 0.2s;
        }
        .table-row:hover { background: rgba(184,151,106,0.05); }
        .table-row.expanded { background: rgba(184,151,106,0.07); }
        .table-row.row-cancelled { opacity: 0.55; }
        .booking-id {
          font-family: 'DM Mono', monospace; font-size: 12px;
          color: #b8976a; letter-spacing: 0.04em;
        }
        .guest-name {
          font-family: 'Lora', serif; font-size: 14px; color: #f0e6d2;
        }
        .guest-phone {
          font-family: 'DM Mono', monospace; font-size: 11px;
          color: rgba(240,230,210,0.4); margin-top: 2px;
        }
        .date-range {
          font-family: 'DM Mono', monospace; font-size: 12px;
          color: #f0e6d2;
        }
        .date-arrow {
          font-family: 'DM Mono', monospace; font-size: 11px;
          color: rgba(240,230,210,0.4); margin-top: 2px;
        }
        .expand-arrow {
          font-size: 20px; color: rgba(184,151,106,0.5);
          display: inline-block;
          transition: transform 0.3s;
        }
        .expand-arrow.open { transform: rotate(90deg); color: #c8a870; }
        .empty-row {
          text-align: center; padding: 48px;
          font-family: 'Lora', serif; font-style: italic;
          color: rgba(240,230,210,0.25); font-size: 15px;
        }

        /* ── Detail Panel ── */
        .detail-row td { padding: 0; }
        .detail-panel {
          background: rgba(10,15,26,0.6);
          border-top: 1px solid rgba(184,151,106,0.15);
          padding: 28px 24px;
          animation: slideDown 0.3s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .detail-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          margin-bottom: 20px;
        }
        @media (max-width: 900px) { .detail-grid { grid-template-columns: 1fr; } }
        .detail-section {}
        .detail-section-title {
          font-family: 'Cinzel', serif; font-size: 10px;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #b8976a; margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(184,151,106,0.2);
        }
        .detail-actions {
          display: flex; justify-content: flex-end;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .btn-cancel-booking {
          background: rgba(220,80,80,0.1);
          border: 1px solid rgba(220,80,80,0.35);
          border-radius: 3px;
          padding: 10px 22px;
          color: #e07a7a;
          font-family: 'Cinzel', serif; font-size: 11px;
          letter-spacing: 0.14em; text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-cancel-booking:hover {
          background: rgba(220,80,80,0.18);
          border-color: rgba(220,80,80,0.6);
          box-shadow: 0 4px 16px rgba(220,80,80,0.2);
        }
        .cancelled-notice {
          font-family: 'Lora', serif; font-style: italic;
          font-size: 13px; color: rgba(220,80,80,0.6);
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.05);
          text-align: right;
        }

        /* ── Status Legend ── */
        .status-legend {
          display: flex; align-items: center; flex-wrap: wrap; gap: 6px;
          padding: 14px 18px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 4px;
          font-family: 'DM Mono', monospace;
        }
        .legend-title {
          font-size: 10px; letter-spacing: 0.1em;
          color: rgba(240,230,210,0.3); text-transform: uppercase;
        }
        .legend-note {
          font-size: 11px; color: rgba(240,230,210,0.25);
          margin-left: 4px;
        }
        .legend-note code {
          background: rgba(184,151,106,0.12);
          border: 1px solid rgba(184,151,106,0.2);
          border-radius: 2px;
          padding: 1px 5px;
          color: #c8a870; font-size: 10px;
        }

        /* ── Modal ── */
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 24px;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal-box {
          background: #111826;
          border: 1px solid rgba(184,151,106,0.25);
          border-radius: 6px;
          width: 100%; max-width: 480px;
          animation: modalIn 0.3s cubic-bezier(0.34,1.3,0.64,1);
          overflow: hidden;
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.93) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          background: rgba(184,151,106,0.05);
        }
        .modal-title {
          font-family: 'Cinzel', serif; font-size: 14px; font-weight: 700;
          color: #f0e6d2; letter-spacing: 0.1em;
        }
        .modal-close {
          background: transparent; border: none;
          color: rgba(240,230,210,0.4); font-size: 16px;
          cursor: pointer; transition: color 0.2s; line-height: 1;
        }
        .modal-close:hover { color: #f0e6d2; }
        .modal-body { padding: 24px; }
        .modal-label {
          display: block;
          font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 0.16em;
          text-transform: uppercase; color: #b8976a; margin-bottom: 8px;
        }
        .modal-textarea {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(180,140,80,0.2);
          border-radius: 3px;
          padding: 12px 14px;
          color: #f0e6d2;
          font-family: 'Lora', serif; font-size: 14px;
          outline: none; resize: vertical; line-height: 1.5;
          transition: border-color 0.2s;
          margin-bottom: 18px;
        }
        .modal-textarea:focus { border-color: #b8976a; }
        .modal-textarea::placeholder { color: rgba(240,230,210,0.22); }
        .modal-toggle {
          display: flex; align-items: center; gap: 12px;
          cursor: pointer; padding: 10px 0;
          user-select: none;
        }
        .toggle-box {
          width: 20px; height: 20px; border-radius: 3px;
          border: 1.5px solid rgba(180,140,80,0.35);
          background: transparent;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
          font-size: 12px; color: #0a0f1a;
        }
        .toggle-box.on {
          background: #c8a870; border-color: #c8a870;
        }
        .toggle-label {
          font-family: 'Lora', serif; font-size: 14px;
          color: rgba(240,230,210,0.7);
        }
        .modal-refund-notice {
          margin-top: 12px;
          background: rgba(80,200,120,0.07);
          border: 1px solid rgba(80,200,120,0.2);
          border-radius: 3px;
          padding: 11px 14px;
          font-family: 'Lora', serif; font-style: italic; font-size: 13px;
          color: rgba(94,200,130,0.8);
          line-height: 1.5;
        }
        .modal-footer {
          display: flex; justify-content: flex-end; gap: 12px;
          padding: 18px 24px;
          border-top: 1px solid rgba(255,255,255,0.06);
          background: rgba(0,0,0,0.15);
        }
        .modal-btn-cancel {
          background: transparent;
          border: 1px solid rgba(240,230,210,0.15);
          border-radius: 3px;
          padding: 11px 22px;
          color: rgba(240,230,210,0.5);
          font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .modal-btn-cancel:hover {
          border-color: rgba(240,230,210,0.35); color: rgba(240,230,210,0.8);
        }
        .modal-btn-confirm {
          display: flex; align-items: center; gap: 8px;
          background: rgba(220,80,80,0.15);
          border: 1px solid rgba(220,80,80,0.4);
          border-radius: 3px;
          padding: 11px 22px;
          color: #e07a7a;
          font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .modal-btn-confirm:hover:not(:disabled) {
          background: rgba(220,80,80,0.25);
          border-color: rgba(220,80,80,0.6);
          box-shadow: 0 4px 16px rgba(220,80,80,0.2);
        }
        .modal-btn-confirm:disabled { opacity: 0.6; cursor: not-allowed; }

        @media (max-width: 768px) {
          .sidebar { display: none; }
          .admin-main { padding: 20px 16px; }
        }
      `}</style>

      {!admin ? (
        <LoginScreen onLogin={setAdmin} />
      ) : (
        <AdminDashboard admin={admin} onLogout={() => setAdmin(null)} />
      )}
    </>
  );
}
