"use client";
import { useEffect, useState, useRef } from "react";

// ── Mock booking data (replace with real data from router/props) ──────────────
const BOOKING = {
  bookingId: "BKG7F2A1K",
  guestName: "Rajesh Sharma",
  phone: "9876543210",
  address: "12 Mall Road, Darjeeling, WB",
  checkIn: "2026-02-20",
  checkOut: "2026-02-24",
  rooms: 2,
  nights: 4,
  total: 20000,
  razorpayOrderId: "order_Qm8xTr3vK12ABC",
  failureReason: "Payment was declined by your bank. Please verify your card details and try again.",
  attemptedAt: new Date().toISOString(),
};

function fmt(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(amount);
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "short", day: "2-digit", month: "long", year: "numeric",
  });
}

function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

// ── Glitch particles ──────────────────────────────────────────────────────────
function ErrorParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() * 2.5 + 0.8,
      speedY: (Math.random() - 0.5) * 0.4,
      speedX: (Math.random() - 0.5) * 0.6,
      opacity: Math.random() * 0.4 + 0.15,
      hue: Math.random() < 0.7
        ? `rgba(220,80,80,`       // red
        : `rgba(200,120,60,`,     // amber warning
    }));

    let raf;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.hue}${p.opacity})`;
        ctx.fill();
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity -= 0.0012;
        if (p.opacity <= 0) {
          p.y = Math.random() * H;
          p.x = Math.random() * W;
          p.opacity = Math.random() * 0.35 + 0.15;
        }
      });
      raf = requestAnimationFrame(draw);
    }
    draw();

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
    />
  );
}

// ── X-mark SVG animation ──────────────────────────────────────────────────────
function AnimatedError() {
  return (
    <div className="error-wrap">
      <svg className="error-svg" viewBox="0 0 80 80" fill="none">
        <circle className="error-ring" cx="40" cy="40" r="36" strokeWidth="2" />
        <circle className="error-ring-fill" cx="40" cy="40" r="36" />
        <line className="error-x error-x1" x1="28" y1="28" x2="52" y2="52" strokeWidth="4" strokeLinecap="round" />
        <line className="error-x error-x2" x1="52" y1="28" x2="28" y2="52" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ── Detail row ────────────────────────────────────────────────────────────────
function Row({ label, value, mono, delay }) {
  return (
    <div className="detail-row" style={{ animationDelay: `${delay}ms` }}>
      <span className="row-label">{label}</span>
      <span className={`row-value ${mono ? "mono" : ""}`}>
        {value}
      </span>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PaymentFailed() {
  const [visible, setVisible] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const b = BOOKING;

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@400;600;700&family=DM+Mono:wght@400;500&family=Crimson+Pro:ital,wght@0,300;0,400;1,300;1,400&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    setTimeout(() => setVisible(true), 80);
  }, []);

  async function handleRetry() {
    setRetrying(true);
    await new Promise(r => setTimeout(r, 1200));
    // In production: redirect to payment page or re-init Razorpay
    window.location.href = "/booking";
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0f0808; }

        .page {
          min-height: 100vh;
          background: #0f0808;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 48px 16px 80px;
          position: relative;
          overflow-x: hidden;
        }

        /* Background layers */
        .bg-glow-top {
          position: fixed;
          top: -200px; left: 50%;
          transform: translateX(-50%);
          width: 700px; height: 450px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(220,80,80,0.08) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }
        .bg-glow-bottom {
          position: fixed;
          bottom: -180px; left: -100px;
          width: 500px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(200,100,50,0.05) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }
        .bg-grid {
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(220,80,80,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(220,80,80,0.02) 1px, transparent 1px);
          background-size: 56px 56px;
          pointer-events: none; z-index: 0;
        }

        /* Container */
        .container {
          width: 100%; max-width: 540px;
          position: relative; z-index: 1;
          opacity: 0; transform: translateY(32px);
          transition: opacity 0.9s ease, transform 0.9s ease;
        }
        .container.vis { opacity: 1; transform: translateY(0); }

        /* Header brand */
        .brand {
          text-align: center;
          margin-bottom: 36px;
        }
        .brand-tag {
          font-family: 'Cinzel', serif;
          font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase;
          color: rgba(220,80,80,0.4);
          display: block; margin-bottom: 6px;
        }
        .brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700;
          color: #eed8d8;
          letter-spacing: 0.04em;
        }
        .brand-loc {
          font-family: 'Crimson Pro', serif;
          font-style: italic; font-size: 14px;
          color: rgba(238,216,216,0.3);
          margin-top: 2px; letter-spacing: 0.06em;
        }

        /* Hero section */
        .hero {
          text-align: center;
          padding: 0 0 36px;
          opacity: 0; animation: riseIn 0.7s ease 0.2s forwards;
        }
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Error animation */
        .error-wrap {
          width: 88px; height: 88px;
          margin: 0 auto 24px;
        }
        .error-svg { width: 100%; height: 100%; }

        .error-ring {
          stroke: rgba(220,80,80,0.2);
          fill: none;
        }
        .error-ring-fill {
          fill: rgba(220,80,80,0.08);
          stroke: #dc5050;
          stroke-width: 1.5;
          stroke-dasharray: 226;
          stroke-dashoffset: 226;
          animation: drawRing 0.7s ease 0.3s forwards;
        }
        @keyframes drawRing {
          to { stroke-dashoffset: 0; }
        }
        .error-x {
          fill: none;
          stroke: #e07a7a;
          stroke-dasharray: 34;
          stroke-dashoffset: 34;
          filter: drop-shadow(0 0 6px rgba(220,80,80,0.4));
        }
        .error-x1 {
          animation: drawX 0.4s ease 0.95s forwards;
        }
        .error-x2 {
          animation: drawX 0.4s ease 1.1s forwards;
        }
        @keyframes drawX {
          to { stroke-dashoffset: 0; }
        }

        .error-label {
          font-family: 'Cinzel', serif;
          font-size: 11px; letter-spacing: 0.28em; text-transform: uppercase;
          color: #e07a7a; margin-bottom: 10px;
          opacity: 0; animation: riseIn 0.6s ease 1.2s forwards;
        }
        .error-title {
          font-family: 'Playfair Display', serif;
          font-size: 38px; font-weight: 700;
          color: #f5e8e8;
          line-height: 1.1; letter-spacing: 0.02em;
          margin-bottom: 10px;
          opacity: 0; animation: riseIn 0.6s ease 1.35s forwards;
        }
        .error-sub {
          font-family: 'Crimson Pro', serif;
          font-style: italic; font-size: 18px;
          color: rgba(238,216,216,0.4);
          letter-spacing: 0.04em;
          opacity: 0; animation: riseIn 0.6s ease 1.5s forwards;
        }

        /* Divider */
        .divider {
          display: flex; align-items: center; gap: 14px;
          margin: 0 0 32px;
          opacity: 0; animation: riseIn 0.5s ease 1.6s forwards;
        }
        .div-line {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(220,80,80,0.25), transparent);
        }
        .div-icon { color: rgba(220,80,80,0.5); font-size: 14px; }

        /* Alert box */
        .alert-box {
          background: rgba(220,80,80,0.08);
          border: 1px solid rgba(220,80,80,0.25);
          border-left: 4px solid #dc5050;
          border-radius: 4px;
          padding: 18px 22px;
          margin-bottom: 24px;
          opacity: 0; animation: riseIn 0.6s ease 1.7s forwards;
        }
        .alert-title {
          font-family: 'Cinzel', serif;
          font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
          color: #e07a7a; margin-bottom: 8px;
          display: flex; align-items: center; gap: 8px;
        }
        .alert-icon { font-size: 16px; }
        .alert-message {
          font-family: 'Crimson Pro', serif;
          font-size: 15px; line-height: 1.6;
          color: rgba(238,216,216,0.65);
        }

        /* Card */
        .card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(220,80,80,0.12);
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 16px;
          opacity: 0; animation: riseIn 0.6s ease 1.8s forwards;
          position: relative;
        }
        .card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(220,80,80,0.35), transparent);
        }

        .card-header {
          padding: 16px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          background: rgba(220,80,80,0.04);
          display: flex; align-items: center; justify-content: space-between;
        }
        .card-title {
          font-family: 'Cinzel', serif;
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(220,80,80,0.6);
        }
        .card-badge {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.06em;
          color: #e07a7a;
          background: rgba(220,80,80,0.1);
          border: 1px solid rgba(220,80,80,0.25);
          border-radius: 3px;
          padding: 3px 10px;
        }

        .card-body { padding: 8px 24px 20px; }

        /* Detail rows */
        .detail-row {
          display: flex; justify-content: space-between; align-items: flex-start;
          padding: 11px 0;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          opacity: 0;
          animation: riseIn 0.5s ease forwards;
        }
        .detail-row:last-child { border-bottom: none; }
        .row-label {
          font-family: 'Crimson Pro', serif;
          font-size: 14px; color: rgba(238,216,216,0.35);
          letter-spacing: 0.02em; min-width: 140px;
        }
        .row-value {
          font-family: 'Crimson Pro', serif;
          font-size: 15px; color: #f0e8e8;
          text-align: right; max-width: 260px;
          word-break: break-all;
        }
        .row-value.mono {
          font-family: 'DM Mono', monospace;
          font-size: 12px; color: rgba(238,216,216,0.6);
        }

        /* Amount card */
        .amount-card {
          background: linear-gradient(135deg, rgba(80,20,20,0.2) 0%, rgba(40,15,15,0.3) 100%);
          border: 1px solid rgba(220,80,80,0.2);
          border-radius: 6px;
          padding: 28px 32px;
          text-align: center;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
          opacity: 0; animation: riseIn 0.6s ease 1.75s forwards;
        }
        .amount-card::after {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(220,80,80,0.08) 0%, transparent 60%);
          pointer-events: none;
        }
        .amount-label {
          font-family: 'Cinzel', serif;
          font-size: 10px; letter-spacing: 0.24em; text-transform: uppercase;
          color: rgba(220,80,80,0.5);
          margin-bottom: 8px;
        }
        .amount-value {
          font-family: 'Playfair Display', serif;
          font-size: 48px; font-weight: 700;
          color: #dc5050;
          letter-spacing: 0.02em;
          line-height: 1;
          text-shadow: 0 0 30px rgba(220,80,80,0.2);
        }
        .amount-sub {
          font-family: 'Crimson Pro', serif;
          font-style: italic; font-size: 14px;
          color: rgba(220,80,80,0.45);
          margin-top: 6px;
        }

        /* Help card */
        .help-card {
          background: rgba(200,160,100,0.06);
          border: 1px solid rgba(200,160,100,0.18);
          border-radius: 4px;
          padding: 18px 22px;
          margin-bottom: 16px;
          opacity: 0; animation: riseIn 0.5s ease 2.0s forwards;
        }
        .help-title {
          font-family: 'Cinzel', serif;
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(200,160,100,0.7);
          margin-bottom: 10px;
        }
        .help-list {
          list-style: none;
          font-family: 'Crimson Pro', serif;
          font-size: 14px; line-height: 1.8;
          color: rgba(238,216,216,0.5);
        }
        .help-list li {
          padding-left: 20px;
          position: relative;
        }
        .help-list li::before {
          content: '→';
          position: absolute; left: 0;
          color: rgba(200,160,100,0.5);
        }

        /* Timestamp strip */
        .timestamp-strip {
          display: flex; align-items: center; justify-content: center; gap: 16px;
          padding: 12px 20px;
          background: rgba(255,255,255,0.015);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 4px;
          margin-bottom: 16px;
          opacity: 0; animation: riseIn 0.5s ease 2.1s forwards;
        }
        .ts-item {
          text-align: center;
        }
        .ts-label {
          font-family: 'Cinzel', serif;
          font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(238,216,216,0.22); margin-bottom: 3px;
        }
        .ts-value {
          font-family: 'DM Mono', monospace;
          font-size: 13px; color: rgba(238,216,216,0.5);
        }
        .ts-sep {
          width: 1px; height: 28px;
          background: rgba(255,255,255,0.06);
        }

        /* Actions */
        .actions {
          display: flex; gap: 12px;
          margin-bottom: 28px;
          opacity: 0; animation: riseIn 0.5s ease 2.2s forwards;
        }
        .btn-retry {
          flex: 1; padding: 16px;
          background: linear-gradient(135deg, #dc5050 0%, #a02020 100%);
          border: none; border-radius: 4px;
          color: #ffe8e8;
          font-family: 'Cinzel', serif; font-size: 11px;
          font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.3s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-retry:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(220,80,80,0.35);
        }
        .btn-retry:disabled {
          opacity: 0.6; cursor: not-allowed;
        }
        .btn-secondary {
          flex: 1; padding: 16px;
          background: transparent;
          border: 1px solid rgba(220,80,80,0.2);
          border-radius: 4px;
          color: rgba(220,80,80,0.6);
          font-family: 'Cinzel', serif; font-size: 11px;
          font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-secondary:hover {
          border-color: rgba(220,80,80,0.4);
          color: #e07a7a;
          background: rgba(220,80,80,0.05);
        }

        .spinner {
          display: inline-block; width: 14px; height: 14px;
          border: 2px solid rgba(255,232,232,0.3);
          border-top-color: #ffe8e8;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Footer note */
        .footer-note {
          text-align: center;
          opacity: 0; animation: riseIn 0.5s ease 2.35s forwards;
        }
        .footer-line1 {
          font-family: 'Crimson Pro', serif;
          font-style: italic; font-size: 15px;
          color: rgba(238,216,216,0.28);
          line-height: 1.7;
        }
        .footer-brand {
          font-family: 'Cinzel', serif;
          font-size: 9px; letter-spacing: 0.24em; text-transform: uppercase;
          color: rgba(220,80,80,0.22);
          margin-top: 12px;
        }

        @media (max-width: 480px) {
          .error-title { font-size: 28px; }
          .amount-value { font-size: 36px; }
          .card-body { padding: 8px 16px 16px; }
          .card-header { padding: 14px 16px; }
          .actions { flex-direction: column; }
        }
      `}</style>

      <ErrorParticles />

      <div className="page">
        <div className="bg-glow-top" />
        <div className="bg-glow-bottom" />
        <div className="bg-grid" />

        <div className={`container ${visible ? "vis" : ""}`}>

          {/* Brand */}
          <div className="brand">
            <span className="brand-tag">Kalimpong · Darjeeling</span>
            <div className="brand-name">Traditional Hotel & Restaurant</div>
            <div className="brand-loc">Payment Status</div>
          </div>

          {/* Hero */}
          <div className="hero">
            <AnimatedError />
            <div className="error-label">Payment Failed</div>
            <div className="error-title">Payment Unsuccessful</div>
            <div className="error-sub">Your booking could not be confirmed</div>
          </div>

          {/* Divider */}
          <div className="divider">
            <div className="div-line" />
            <span className="div-icon">⚠</span>
            <div className="div-line" />
          </div>

          {/* Alert */}
          <div className="alert-box">
            <div className="alert-title">
              <span className="alert-icon">⚠</span>
              What Happened
            </div>
            <div className="alert-message">
              {b.failureReason}
            </div>
          </div>

          {/* Amount */}
          <div className="amount-card">
            <div className="amount-label">Amount Not Charged</div>
            <div className="amount-value">{fmt(b.total)}</div>
            <div className="amount-sub">No amount has been deducted from your account</div>
          </div>

          {/* Booking details card */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Booking Attempt Details</span>
              <span className="card-badge">{b.bookingId}</span>
            </div>
            <div className="card-body">
              <Row label="Guest Name"        value={b.guestName}                   delay={1850} />
              <Row label="Phone"             value={b.phone}         mono          delay={1950} />
              <Row label="Check-In"          value={fmtDate(b.checkIn)}            delay={2000} />
              <Row label="Check-Out"         value={fmtDate(b.checkOut)}           delay={2050} />
              <Row label="Rooms"             value={`${b.rooms} room${b.rooms > 1 ? "s" : ""}`} delay={2100} />
              <Row label="Nights"            value={`${b.nights} night${b.nights > 1 ? "s" : ""}`} delay={2150} />
              <Row label="Razorpay Order ID" value={b.razorpayOrderId} mono        delay={2200} />
            </div>
          </div>

          {/* Help card */}
          <div className="help-card">
            <div className="help-title">What You Can Do</div>
            <ul className="help-list">
              <li>Verify your card details and ensure sufficient balance</li>
              <li>Check with your bank if international transactions are enabled</li>
              <li>Try a different payment method (UPI, Net Banking, Debit/Credit Card)</li>
              <li>Contact our support team at <strong style={{ color: "rgba(238,216,216,0.65)" }}>+91-9876543210</strong></li>
            </ul>
          </div>

          {/* Timestamp strip */}
          <div className="timestamp-strip">
            <div className="ts-item">
              <div className="ts-label">Attempted On</div>
              <div className="ts-value">{fmtDate(b.attemptedAt)}</div>
            </div>
            <div className="ts-sep" />
            <div className="ts-item">
              <div className="ts-label">Time</div>
              <div className="ts-value">{fmtTime(b.attemptedAt)}</div>
            </div>
            <div className="ts-sep" />
            <div className="ts-item">
              <div className="ts-label">Status</div>
              <div className="ts-value" style={{ color: "#dc5050" }}>Failed</div>
            </div>
          </div>

          {/* Actions */}
          <div className="actions">
            <button className="btn-retry" onClick={handleRetry} disabled={retrying}>
              {retrying ? <span className="spinner" /> : "↻"}
              {retrying ? "Redirecting…" : "Try Again"}
            </button>
            <button className="btn-secondary" onClick={() => window.location.href = "/"}>
              ← Back to Home
            </button>
          </div>

          {/* Footer */}
          <div className="footer-note">
            <div className="footer-line1">
              Your booking <strong style={{ color: "rgba(238,216,216,0.4)" }}>{b.bookingId}</strong> is on hold.<br />
              You can retry payment within 24 hours, or contact us for assistance.
            </div>
            <div className="footer-brand">
              Traditional Hotel & Restaurant · Kalimpong · Darjeeling 734301
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
