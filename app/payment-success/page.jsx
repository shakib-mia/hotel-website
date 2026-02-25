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
  paymentId: "pay_QmN8xTr3vK1234",
  razorpayOrderId: "order_Qm8xTr3vK12ABC",
  paidAt: new Date().toISOString(),
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

// ── Particle canvas ───────────────────────────────────────────────────────────
function Particles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H + H,
      size: Math.random() * 3 + 1,
      speedY: -(Math.random() * 1.2 + 0.4),
      speedX: (Math.random() - 0.5) * 0.6,
      opacity: Math.random() * 0.6 + 0.2,
      hue: Math.random() < 0.5
        ? `rgba(180,210,160,`       // soft green
        : Math.random() < 0.5
          ? `rgba(200,168,100,`     // gold
          : `rgba(140,200,180,`,    // teal
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
        p.opacity -= 0.0015;
        if (p.y < -10 || p.opacity <= 0) {
          p.y = H + 10;
          p.x = Math.random() * W;
          p.opacity = Math.random() * 0.5 + 0.2;
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

// ── Checkmark SVG animation ───────────────────────────────────────────────────
function AnimatedCheck() {
  return (
    <div className="check-wrap">
      <svg className="check-svg" viewBox="0 0 80 80" fill="none">
        <circle className="check-ring" cx="40" cy="40" r="36" strokeWidth="2" />
        <circle className="check-ring-fill" cx="40" cy="40" r="36" />
        <polyline className="check-mark" points="22,41 34,53 58,28" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ── Detail row ────────────────────────────────────────────────────────────────
function Row({ label, value, mono, highlight, delay }) {
  return (
    <div className="detail-row" style={{ animationDelay: `${delay}ms` }}>
      <span className="row-label">{label}</span>
      <span className={`row-value ${mono ? "mono" : ""} ${highlight ? "highlight" : ""}`}>
        {value}
      </span>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PaymentSuccess() {
  const [visible, setVisible] = useState(false);
  const b = BOOKING;

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@400;600;700&family=DM+Mono:wght@400;500&family=Crimson+Pro:ital,wght@0,300;0,400;1,300;1,400&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    setTimeout(() => setVisible(true), 80);
  }, []);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #07130e; }

        .page {
          min-height: 100vh;
          background: #07130e;
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
          width: 800px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(60,160,90,0.12) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }
        .bg-glow-bottom {
          position: fixed;
          bottom: -180px; right: -100px;
          width: 500px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(180,140,60,0.07) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }
        .bg-grid {
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(60,160,90,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(60,160,90,0.025) 1px, transparent 1px);
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
          color: rgba(100,200,130,0.5);
          display: block; margin-bottom: 6px;
        }
        .brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700;
          color: #d8eed8;
          letter-spacing: 0.04em;
        }
        .brand-loc {
          font-family: 'Crimson Pro', serif;
          font-style: italic; font-size: 14px;
          color: rgba(216,238,216,0.35);
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

        /* Check animation */
        .check-wrap {
          width: 88px; height: 88px;
          margin: 0 auto 24px;
        }
        .check-svg { width: 100%; height: 100%; }

        .check-ring {
          stroke: rgba(80,200,120,0.25);
          fill: none;
        }
        .check-ring-fill {
          fill: rgba(60,160,90,0.12);
          stroke: #4dc87a;
          stroke-width: 1.5;
          stroke-dasharray: 226;
          stroke-dashoffset: 226;
          animation: drawRing 0.7s ease 0.3s forwards;
        }
        @keyframes drawRing {
          to { stroke-dashoffset: 0; }
        }
        .check-mark {
          fill: none;
          stroke: #4dc87a;
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: drawMark 0.45s ease 0.95s forwards;
          filter: drop-shadow(0 0 6px rgba(77,200,122,0.6));
        }
        @keyframes drawMark {
          to { stroke-dashoffset: 0; }
        }

        .success-label {
          font-family: 'Cinzel', serif;
          font-size: 11px; letter-spacing: 0.28em; text-transform: uppercase;
          color: #4dc87a; margin-bottom: 10px;
          opacity: 0; animation: riseIn 0.6s ease 1.1s forwards;
        }
        .success-title {
          font-family: 'Playfair Display', serif;
          font-size: 38px; font-weight: 700;
          color: #e8f5e8;
          line-height: 1.1; letter-spacing: 0.02em;
          margin-bottom: 10px;
          opacity: 0; animation: riseIn 0.6s ease 1.25s forwards;
        }
        .success-sub {
          font-family: 'Crimson Pro', serif;
          font-style: italic; font-size: 18px;
          color: rgba(216,238,216,0.45);
          letter-spacing: 0.04em;
          opacity: 0; animation: riseIn 0.6s ease 1.4s forwards;
        }

        /* Divider */
        .divider {
          display: flex; align-items: center; gap: 14px;
          margin: 0 0 32px;
          opacity: 0; animation: riseIn 0.5s ease 1.55s forwards;
        }
        .div-line {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(77,200,122,0.3), transparent);
        }
        .div-leaf { color: rgba(77,200,122,0.6); font-size: 14px; }

        /* Card */
        .card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(77,200,122,0.15);
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 16px;
          opacity: 0; animation: riseIn 0.6s ease 1.65s forwards;
          position: relative;
        }
        .card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(77,200,122,0.45), transparent);
        }

        .card-header {
          padding: 16px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background: rgba(60,160,90,0.06);
          display: flex; align-items: center; justify-content: space-between;
        }
        .card-title {
          font-family: 'Cinzel', serif;
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(77,200,122,0.7);
        }
        .card-badge {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.06em;
          color: #4dc87a;
          background: rgba(77,200,122,0.1);
          border: 1px solid rgba(77,200,122,0.25);
          border-radius: 3px;
          padding: 3px 10px;
        }

        .card-body { padding: 8px 24px 20px; }

        /* Detail rows */
        .detail-row {
          display: flex; justify-content: space-between; align-items: flex-start;
          padding: 11px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          opacity: 0;
          animation: riseIn 0.5s ease forwards;
        }
        .detail-row:last-child { border-bottom: none; }
        .row-label {
          font-family: 'Crimson Pro', serif;
          font-size: 14px; color: rgba(216,238,216,0.4);
          letter-spacing: 0.02em; min-width: 140px;
        }
        .row-value {
          font-family: 'Crimson Pro', serif;
          font-size: 15px; color: #e8f0e8;
          text-align: right; max-width: 260px;
          word-break: break-all;
        }
        .row-value.mono {
          font-family: 'DM Mono', monospace;
          font-size: 12px; color: rgba(216,238,216,0.65);
        }
        .row-value.highlight {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700;
          color: #4dc87a;
          letter-spacing: 0.02em;
        }

        /* Amount card */
        .amount-card {
          background: linear-gradient(135deg, rgba(50,130,70,0.18) 0%, rgba(20,60,35,0.3) 100%);
          border: 1px solid rgba(77,200,122,0.25);
          border-radius: 6px;
          padding: 28px 32px;
          text-align: center;
          margin-bottom: 16px;
          position: relative;
          overflow: hidden;
          opacity: 0; animation: riseIn 0.6s ease 1.7s forwards;
        }
        .amount-card::after {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(77,200,122,0.1) 0%, transparent 60%);
          pointer-events: none;
        }
        .amount-label {
          font-family: 'Cinzel', serif;
          font-size: 10px; letter-spacing: 0.24em; text-transform: uppercase;
          color: rgba(77,200,122,0.6);
          margin-bottom: 8px;
        }
        .amount-value {
          font-family: 'Playfair Display', serif;
          font-size: 52px; font-weight: 700;
          color: #4dc87a;
          letter-spacing: 0.02em;
          line-height: 1;
          text-shadow: 0 0 40px rgba(77,200,122,0.3);
        }
        .amount-sub {
          font-family: 'Crimson Pro', serif;
          font-style: italic; font-size: 14px;
          color: rgba(77,200,122,0.5);
          margin-top: 6px;
        }

        /* Timestamp strip */
        .timestamp-strip {
          display: flex; align-items: center; justify-content: center; gap: 16px;
          padding: 12px 20px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
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
          color: rgba(216,238,216,0.25); margin-bottom: 3px;
        }
        .ts-value {
          font-family: 'DM Mono', monospace;
          font-size: 13px; color: rgba(216,238,216,0.6);
        }
        .ts-sep {
          width: 1px; height: 28px;
          background: rgba(255,255,255,0.08);
        }

        /* Actions */
        .actions {
          display: flex; gap: 12px;
          margin-bottom: 28px;
          opacity: 0; animation: riseIn 0.5s ease 2.2s forwards;
        }
        .btn-primary {
          flex: 1; padding: 15px;
          background: linear-gradient(135deg, #3ca05a 0%, #2a7040 100%);
          border: none; border-radius: 4px;
          color: #e8f5e8;
          font-family: 'Cinzel', serif; font-size: 11px;
          font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.3s;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(60,160,90,0.35);
        }
        .btn-secondary {
          flex: 1; padding: 15px;
          background: transparent;
          border: 1px solid rgba(77,200,122,0.25);
          border-radius: 4px;
          color: rgba(77,200,122,0.7);
          font-family: 'Cinzel', serif; font-size: 11px;
          font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-secondary:hover {
          border-color: rgba(77,200,122,0.5);
          color: #4dc87a;
          background: rgba(77,200,122,0.06);
        }

        /* Footer note */
        .footer-note {
          text-align: center;
          opacity: 0; animation: riseIn 0.5s ease 2.35s forwards;
        }
        .footer-line1 {
          font-family: 'Crimson Pro', serif;
          font-style: italic; font-size: 15px;
          color: rgba(216,238,216,0.3);
          line-height: 1.7;
        }
        .footer-brand {
          font-family: 'Cinzel', serif;
          font-size: 9px; letter-spacing: 0.24em; text-transform: uppercase;
          color: rgba(77,200,122,0.25);
          margin-top: 12px;
        }

        @media (max-width: 480px) {
          .success-title { font-size: 28px; }
          .amount-value { font-size: 38px; }
          .card-body { padding: 8px 16px 16px; }
          .card-header { padding: 14px 16px; }
          .actions { flex-direction: column; }
        }
      `}</style>

      <Particles />

      <div className="page">
        <div className="bg-glow-top" />
        <div className="bg-glow-bottom" />
        <div className="bg-grid" />

        <div className={`container ${visible ? "vis" : ""}`}>

          {/* Brand */}
          <div className="brand">
            <span className="brand-tag">Kalimpong · Darjeeling</span>
            <div className="brand-name">Traditional Hotel & Restaurant</div>
            <div className="brand-loc">Confirmation of Reservation</div>
          </div>

          {/* Hero */}
          <div className="hero">
            <AnimatedCheck />
            <div className="success-label">Payment Successful</div>
            <div className="success-title">You're all set!</div>
            <div className="success-sub">We look forward to welcoming you to the hills</div>
          </div>

          {/* Divider */}
          <div className="divider">
            <div className="div-line" />
            <span className="div-leaf">✦</span>
            <div className="div-line" />
          </div>

          {/* Amount */}
          <div className="amount-card">
            <div className="amount-label">Total Amount Paid</div>
            <div className="amount-value">{fmt(b.total)}</div>
            <div className="amount-sub">{b.rooms} room{b.rooms > 1 ? "s" : ""} · {b.nights} night{b.nights > 1 ? "s" : ""}</div>
          </div>

          {/* Booking details card */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Booking Details</span>
              <span className="card-badge">{b.bookingId}</span>
            </div>
            <div className="card-body">
              <Row label="Guest Name"   value={b.guestName}                   delay={1750} />
              <Row label="Phone"        value={b.phone}         mono           delay={1850} />
              <Row label="Address"      value={b.address}                      delay={1950} />
              <Row label="Check-In"     value={fmtDate(b.checkIn)}             delay={2000} />
              <Row label="Check-Out"    value={fmtDate(b.checkOut)}            delay={2050} />
              <Row label="Duration"     value={`${b.nights} nights`}           delay={2100} />
              <Row label="Rooms"        value={`${b.rooms} room${b.rooms > 1 ? "s" : ""}`} delay={2150} />
            </div>
          </div>

          {/* Payment details card */}
          <div className="card" style={{ animationDelay: "1.8s" }}>
            <div className="card-header">
              <span className="card-title">Payment Reference</span>
              <span className="card-badge" style={{ color: "#c8a870", background: "rgba(200,168,100,0.1)", borderColor: "rgba(200,168,100,0.25)" }}>Verified</span>
            </div>
            <div className="card-body">
              <Row label="Payment ID"        value={b.paymentId}        mono delay={1900} />
              <Row label="Razorpay Order ID" value={b.razorpayOrderId}  mono delay={1950} />
              <Row label="Status"            value="✓ Paid"             delay={2000} />
            </div>
          </div>

          {/* Timestamp strip */}
          <div className="timestamp-strip">
            <div className="ts-item">
              <div className="ts-label">Payment Date</div>
              <div className="ts-value">{fmtDate(b.paidAt)}</div>
            </div>
            <div className="ts-sep" />
            <div className="ts-item">
              <div className="ts-label">Time</div>
              <div className="ts-value">{fmtTime(b.paidAt)}</div>
            </div>
            <div className="ts-sep" />
            <div className="ts-item">
              <div className="ts-label">Currency</div>
              <div className="ts-value">INR ₹</div>
            </div>
          </div>

          {/* Actions */}
          <div className="actions">
            <button className="btn-primary" onClick={() => window.print()}>
              ↓ Download Receipt
            </button>
            <button className="btn-secondary" onClick={() => window.location.href = "/"}>
              ← Back to Home
            </button>
          </div>

          {/* Footer */}
          <div className="footer-note">
            <div className="footer-line1">
              A confirmation SMS has been sent to {b.phone}.<br />
              For inquiries, please quote your booking ID <strong style={{ color: "rgba(216,238,216,0.5)" }}>{b.bookingId}</strong>.
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
