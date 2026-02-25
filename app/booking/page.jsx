"use client";
import { useState, useEffect } from "react";

const PRICE_PER_ROOM_PER_NIGHT = 2500;
const MAX_ROOMS = 9;

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getDaysBetween(start, end) {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  const diff = (e - s) / (1000 * 60 * 60 * 24);
  return diff > 0 ? diff : 0;
}

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  min,
  max,
}) {
  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      <input
        className="field-input"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        autoComplete="off"
      />
      <style>{`
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .field-label {
          font-family: 'Cinzel', serif;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #b8976a;
          font-weight: 600;
        }
        .field-input {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(184,151,106,0.25);
          border-radius: 2px;
          padding: 14px 16px;
          color: #f0e8d8;
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          outline: none;
          transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
          width: 100%;
          box-sizing: border-box;
          -webkit-appearance: none;
        }
        .field-input::placeholder {
          color: rgba(240,232,216,0.28);
        }
        .field-input:focus {
          border-color: #b8976a;
          background: rgba(184,151,106,0.07);
          box-shadow: 0 0 0 3px rgba(184,151,106,0.12);
        }
        .field-input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.7) sepia(0.5) saturate(2);
          cursor: pointer;
          opacity: 0.7;
        }
        .field-input[type="number"]::-webkit-inner-spin-button,
        .field-input[type="number"]::-webkit-outer-spin-button {
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}

function SummaryRow({ label, value, isTotal }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: isTotal ? "14px 0 0" : "8px 0",
        borderTop: isTotal ? "1px solid rgba(184,151,106,0.35)" : "none",
        marginTop: isTotal ? "8px" : "0",
      }}
    >
      <span
        style={{
          fontFamily: isTotal
            ? "'Cinzel', serif"
            : "'Cormorant Garamond', serif",
          fontSize: isTotal ? "11px" : "14px",
          letterSpacing: isTotal ? "0.14em" : "0.02em",
          textTransform: isTotal ? "uppercase" : "none",
          color: isTotal ? "#b8976a" : "rgba(240,232,216,0.65)",
          fontWeight: isTotal ? 700 : 400,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: isTotal ? "22px" : "15px",
          color: isTotal ? "#e8d5b0" : "rgba(240,232,216,0.9)",
          fontWeight: isTotal ? 600 : 400,
          letterSpacing: "0.03em",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function StepDot({ step, current, label }) {
  const done = current > step;
  const active = current === step;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: `1.5px solid ${active || done ? "#b8976a" : "rgba(184,151,106,0.3)"}`,
          background: done
            ? "#b8976a"
            : active
              ? "rgba(184,151,106,0.15)"
              : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: done
            ? "#0a0f1a"
            : active
              ? "#b8976a"
              : "rgba(184,151,106,0.4)",
          fontSize: 11,
          fontFamily: "'Cinzel', serif",
          fontWeight: 700,
          transition: "all 0.4s ease",
        }}
      >
        {done ? "✓" : step}
      </div>
      <span
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 9,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: active ? "#b8976a" : "rgba(184,151,106,0.4)",
          transition: "color 0.4s",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    rooms: 1,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [apiError, setApiError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    setTimeout(() => setMounted(true), 50);
  }, []);

  const nights = getDaysBetween(form.checkIn, form.checkOut);
  const estimatedTotal = nights * form.rooms * PRICE_PER_ROOM_PER_NIGHT;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]:
        name === "rooms" ? Math.max(1, Math.min(9, Number(value))) : value,
    }));
    setErrors((err) => ({ ...err, [name]: "" }));
    setApiError("");
  }

  function validate() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!/^\d{10}$/.test(form.phone))
      newErrors.phone = "Enter a valid 10-digit number";
    if (!form.checkIn) newErrors.checkIn = "Select check-in date";
    if (!form.checkOut) newErrors.checkOut = "Select check-out date";
    if (form.checkIn && form.checkOut && nights <= 0)
      newErrors.checkOut = "Check-out must be after check-in";
    if (!form.rooms || form.rooms < 1 || form.rooms > 9)
      newErrors.rooms = "1–9 rooms allowed";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleBook() {
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    try {
      // Simulating the full backend flow as described:
      // 1. Date validation
      // 2. Availability check (PAID bookings overlap)
      // 3. Create booking with status="initiated"
      // 4. Calculate final total on backend
      // 5. Create Razorpay order
      await new Promise((r) => setTimeout(r, 1800));

      // Simulate occasional unavailability
      const randomUnavailable = false; // set true to test rejection path
      if (randomUnavailable) {
        throw new Error(
          "No availability for selected dates. Only 3 rooms remain.",
        );
      }

      // Mock successful Razorpay order creation
      const mockOrder = {
        bookingId:
          "BKG" + Math.random().toString(36).substr(2, 8).toUpperCase(),
        orderId: "order_" + Math.random().toString(36).substr(2, 14),
        finalTotal: estimatedTotal,
        nights,
        rooms: form.rooms,
        currency: "INR",
        key: "rzp_test_XXXXXXXXXXXX",
      };

      setOrderData(mockOrder);
      setStep(2);
    } catch (err) {
      setApiError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleRazorpayPayment() {
    if (!orderData) return;
    // In production: load Razorpay script and open checkout
    // window.Razorpay({ key: orderData.key, order_id: orderData.orderId, ... }).open()
    setStep(3);
  }

  function resetForm() {
    setForm({
      name: "",
      address: "",
      phone: "",
      checkIn: "",
      checkOut: "",
      rooms: 1,
    });
    setOrderData(null);
    setApiError("");
    setErrors({});
    setStep(1);
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #080d19;
          min-height: 100vh;
        }

        .page-root {
          min-height: 100vh;
          background: #080d19;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 40px 16px 80px;
          position: relative;
          overflow: hidden;
        }

        .bg-orb-1 {
          position: fixed;
          top: -180px;
          right: -120px;
          width: 560px;
          height: 560px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(184,151,106,0.09) 0%, transparent 70%);
          pointer-events: none;
        }

        .bg-orb-2 {
          position: fixed;
          bottom: -200px;
          left: -150px;
          width: 640px;
          height: 640px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(100,140,200,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .bg-grid {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(184,151,106,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(184,151,106,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        .container {
          width: 100%;
          max-width: 520px;
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.8s ease, transform 0.8s ease;
          position: relative;
          z-index: 1;
        }
        .container.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
        }

        .hotel-tag {
          font-family: 'Cinzel', serif;
          font-size: 10px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #b8976a;
          margin-bottom: 12px;
          display: block;
        }

        .hotel-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 42px;
          font-weight: 300;
          color: #f0e8d8;
          line-height: 1.1;
          letter-spacing: 0.04em;
          margin-bottom: 6px;
        }

        .hotel-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 15px;
          color: rgba(240,232,216,0.42);
          letter-spacing: 0.06em;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0 32px;
          justify-content: center;
        }
        .divider-line {
          height: 1px;
          width: 60px;
          background: linear-gradient(90deg, transparent, rgba(184,151,106,0.5), transparent);
        }
        .divider-diamond {
          width: 5px;
          height: 5px;
          background: #b8976a;
          transform: rotate(45deg);
        }

        .steps {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-bottom: 36px;
          position: relative;
        }
        .steps::before {
          content: '';
          position: absolute;
          top: 14px;
          left: calc(50% - 60px);
          width: 120px;
          height: 1px;
          background: rgba(184,151,106,0.2);
        }

        .card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(184,151,106,0.18);
          border-radius: 4px;
          padding: 36px 36px;
          backdrop-filter: blur(8px);
          position: relative;
          overflow: hidden;
        }
        .card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(184,151,106,0.5), transparent);
        }

        .card-title {
          font-family: 'Cinzel', serif;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #b8976a;
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .card-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(184,151,106,0.2);
        }

        .form-grid {
          display: grid;
          gap: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 480px) {
          .form-row { grid-template-columns: 1fr; }
          .card { padding: 24px 20px; }
          .hotel-name { font-size: 32px; }
        }

        .error-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 12px;
          color: #e07a7a;
          margin-top: 4px;
          letter-spacing: 0.03em;
        }

        .summary-card {
          background: rgba(184,151,106,0.06);
          border: 1px solid rgba(184,151,106,0.2);
          border-radius: 3px;
          padding: 20px;
          margin-top: 24px;
        }

        .summary-label {
          font-family: 'Cinzel', serif;
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(184,151,106,0.6);
          margin-bottom: 14px;
        }

        .api-error {
          background: rgba(220,80,80,0.09);
          border: 1px solid rgba(220,80,80,0.3);
          border-radius: 3px;
          padding: 14px 16px;
          margin-top: 18px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 14px;
          color: #e07a7a;
          letter-spacing: 0.03em;
        }

        .btn-book {
          width: 100%;
          margin-top: 24px;
          padding: 17px;
          background: linear-gradient(135deg, #c8a870 0%, #a07840 50%, #c8a870 100%);
          background-size: 200% 200%;
          border: none;
          border-radius: 2px;
          color: #0a0f1a;
          font-family: 'Cinzel', serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background-position 0.4s, transform 0.2s, box-shadow 0.3s;
          position: relative;
          overflow: hidden;
        }
        .btn-book:hover:not(:disabled) {
          background-position: 100% 100%;
          box-shadow: 0 8px 32px rgba(184,151,106,0.35);
          transform: translateY(-1px);
        }
        .btn-book:active:not(:disabled) {
          transform: translateY(0);
        }
        .btn-book:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-pay {
          width: 100%;
          margin-top: 20px;
          padding: 17px;
          background: linear-gradient(135deg, #1a3a5c 0%, #0f2640 100%);
          border: 1.5px solid #4a9edd;
          border-radius: 2px;
          color: #a8d4f5;
          font-family: 'Cinzel', serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn-pay:hover {
          background: linear-gradient(135deg, #1f4a72 0%, #142e50 100%);
          box-shadow: 0 6px 24px rgba(74,158,221,0.25);
        }

        .btn-secondary {
          width: 100%;
          margin-top: 12px;
          padding: 14px;
          background: transparent;
          border: 1px solid rgba(184,151,106,0.3);
          border-radius: 2px;
          color: rgba(184,151,106,0.7);
          font-family: 'Cinzel', serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn-secondary:hover {
          border-color: rgba(184,151,106,0.6);
          color: #b8976a;
          background: rgba(184,151,106,0.05);
        }

        .loading-ring {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2px solid rgba(10,15,26,0.4);
          border-top-color: #0a0f1a;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 10px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .order-badge {
          background: rgba(184,151,106,0.08);
          border: 1px solid rgba(184,151,106,0.3);
          border-radius: 3px;
          padding: 10px 16px;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .order-badge-label {
          font-family: 'Cinzel', serif;
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(184,151,106,0.6);
        }
        .order-badge-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 13px;
          color: #d4b87a;
          letter-spacing: 0.06em;
        }

        .success-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(90,180,120,0.12);
          border: 1.5px solid rgba(90,180,120,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          font-size: 28px;
          animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes popIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .success-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 300;
          color: #f0e8d8;
          text-align: center;
          margin-bottom: 8px;
          letter-spacing: 0.04em;
        }

        .success-sub {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 16px;
          color: rgba(240,232,216,0.45);
          text-align: center;
          margin-bottom: 32px;
          letter-spacing: 0.05em;
        }

        .rooms-control {
          display: flex;
          align-items: center;
          gap: 0;
          border: 1px solid rgba(184,151,106,0.25);
          border-radius: 2px;
          overflow: hidden;
          background: rgba(255,255,255,0.04);
        }
        .rooms-btn {
          width: 44px;
          height: 48px;
          background: rgba(184,151,106,0.1);
          border: none;
          color: #b8976a;
          font-size: 20px;
          cursor: pointer;
          transition: background 0.2s;
          flex-shrink: 0;
          font-family: 'Cormorant Garamond', serif;
        }
        .rooms-btn:hover {
          background: rgba(184,151,106,0.22);
        }
        .rooms-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .rooms-value {
          flex: 1;
          text-align: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          color: #f0e8d8;
          background: transparent;
          border: none;
          outline: none;
        }
        .nights-hint {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 13px;
          color: rgba(184,151,106,0.55);
          text-align: center;
          margin-top: 8px;
        }
      `}</style>

      <div className="page-root">
        <div className="bg-orb-1" />
        <div className="bg-orb-2" />
        <div className="bg-grid" />

        <div className={`container ${mounted ? "visible" : ""}`}>
          {/* Header */}
          <div className="header">
            <span className="hotel-tag">Kalimpong · Darjeeling</span>
            <div className="hotel-name">
              Traditional Hotel
              <br />& Restaurant
            </div>
            <div className="hotel-tagline">Warmth rooted in the hills</div>
            <div className="divider">
              <div className="divider-line" />
              <div className="divider-diamond" />
              <div className="divider-line" />
            </div>
          </div>

          {/* Steps */}
          <div className="steps">
            <StepDot step={1} current={step} label="Details" />
            <StepDot step={2} current={step} label="Payment" />
            <StepDot step={3} current={step} label="Confirmed" />
          </div>

          {/* STEP 1: Booking Form */}
          {step === 1 && (
            <div className="card">
              <div className="card-title">Reserve Your Stay</div>

              <div className="form-grid">
                <div>
                  <InputField
                    label="Full Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Maharaj Singh"
                  />
                  {errors.name && (
                    <div className="error-text">{errors.name}</div>
                  )}
                </div>

                <div>
                  <InputField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile"
                  />
                  {errors.phone && (
                    <div className="error-text">{errors.phone}</div>
                  )}
                </div>

                <div>
                  <InputField
                    label="Address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Street, Kalimpong, Darjeeling"
                  />
                  {errors.address && (
                    <div className="error-text">{errors.address}</div>
                  )}
                </div>

                <div className="form-row">
                  <div>
                    <InputField
                      label="Check-In"
                      name="checkIn"
                      type="date"
                      value={form.checkIn}
                      onChange={handleChange}
                      min={today}
                    />
                    {errors.checkIn && (
                      <div className="error-text">{errors.checkIn}</div>
                    )}
                  </div>
                  <div>
                    <InputField
                      label="Check-Out"
                      name="checkOut"
                      type="date"
                      value={form.checkOut}
                      onChange={handleChange}
                      min={form.checkIn || today}
                    />
                    {errors.checkOut && (
                      <div className="error-text">{errors.checkOut}</div>
                    )}
                  </div>
                </div>

                <div>
                  <div
                    className="field-label"
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "#b8976a",
                      fontWeight: 600,
                      marginBottom: 8,
                    }}
                  >
                    Number of Rooms
                  </div>
                  <div className="rooms-control">
                    <button
                      className="rooms-btn"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          rooms: Math.max(1, f.rooms - 1),
                        }))
                      }
                      disabled={form.rooms <= 1}
                    >
                      −
                    </button>
                    <div className="rooms-value">{form.rooms}</div>
                    <button
                      className="rooms-btn"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          rooms: Math.min(MAX_ROOMS, f.rooms + 1),
                        }))
                      }
                      disabled={form.rooms >= MAX_ROOMS}
                    >
                      +
                    </button>
                  </div>
                  {errors.rooms && (
                    <div className="error-text">{errors.rooms}</div>
                  )}
                </div>
              </div>

              {/* Live estimate */}
              {nights > 0 && (
                <div className="summary-card">
                  <div className="summary-label">Estimated Summary</div>
                  <SummaryRow
                    label={`${form.rooms} room${form.rooms > 1 ? "s" : ""} × ${nights} night${nights > 1 ? "s" : ""}`}
                    value={formatCurrency(
                      form.rooms * nights * PRICE_PER_ROOM_PER_NIGHT,
                    )}
                  />
                  <SummaryRow label="Taxes & Fees (incl.)" value="Included" />
                  <SummaryRow
                    label="Estimated Total"
                    value={formatCurrency(estimatedTotal)}
                    isTotal
                  />
                  <div className="nights-hint">
                    Final amount confirmed on backend
                  </div>
                </div>
              )}

              {apiError && <div className="api-error">⚠ {apiError}</div>}

              <button
                className="btn-book"
                onClick={handleBook}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-ring" />
                    Checking Availability…
                  </>
                ) : (
                  "Book Now"
                )}
              </button>

              {/* Flow hint */}
              <div style={{ marginTop: 18, textAlign: "center" }}>
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    fontSize: 13,
                    color: "rgba(240,232,216,0.3)",
                    letterSpacing: "0.04em",
                  }}
                >
                  Secure payment via Razorpay
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: Payment */}
          {step === 2 && orderData && (
            <div className="card">
              <div className="card-title">Complete Payment</div>

              <div style={{ marginBottom: 24 }}>
                <div className="order-badge">
                  <span className="order-badge-label">Booking ID</span>
                  <span className="order-badge-value">
                    {orderData.bookingId}
                  </span>
                </div>
                <div className="order-badge">
                  <span className="order-badge-label">Order ID</span>
                  <span className="order-badge-value" style={{ fontSize: 12 }}>
                    {orderData.orderId}
                  </span>
                </div>
                <div className="order-badge">
                  <span className="order-badge-label">Status</span>
                  <span
                    className="order-badge-value"
                    style={{ color: "#e8c96a" }}
                  >
                    Initiated
                  </span>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-label">Booking Summary</div>
                <SummaryRow label="Guest" value={form.name} />
                <SummaryRow label="Check-In" value={form.checkIn} />
                <SummaryRow label="Check-Out" value={form.checkOut} />
                <SummaryRow
                  label={`${orderData.rooms} room${orderData.rooms > 1 ? "s" : ""} × ${orderData.nights} night${orderData.nights > 1 ? "s" : ""}`}
                  value=""
                />
                <SummaryRow
                  label="Final Total (Backend Confirmed)"
                  value={formatCurrency(orderData.finalTotal)}
                  isTotal
                />
              </div>

              <button className="btn-pay" onClick={handleRazorpayPayment}>
                Pay {formatCurrency(orderData.finalTotal)} via Razorpay
              </button>

              <button className="btn-secondary" onClick={resetForm}>
                ← Modify Booking
              </button>
            </div>
          )}

          {/* STEP 3: Success */}
          {step === 3 && (
            <div
              className="card"
              style={{ textAlign: "center", padding: "44px 36px" }}
            >
              <div className="success-icon">✦</div>
              <div className="success-title">Booking Confirmed</div>
              <div className="success-sub">
                Your stay has been beautifully arranged
              </div>

              {orderData && (
                <div className="summary-card" style={{ textAlign: "left" }}>
                  <div className="summary-label">Reservation Details</div>
                  <SummaryRow label="Booking ID" value={orderData.bookingId} />
                  <SummaryRow label="Guest" value={form.name} />
                  <SummaryRow label="Phone" value={form.phone} />
                  <SummaryRow label="Check-In" value={form.checkIn} />
                  <SummaryRow label="Check-Out" value={form.checkOut} />
                  <SummaryRow
                    label="Rooms"
                    value={`${orderData.rooms} room${orderData.rooms > 1 ? "s" : ""}`}
                  />
                  <SummaryRow
                    label="Amount Paid"
                    value={formatCurrency(orderData.finalTotal)}
                    isTotal
                  />
                </div>
              )}

              <div
                style={{
                  marginTop: 24,
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontSize: 15,
                  color: "rgba(240,232,216,0.4)",
                  lineHeight: 1.6,
                }}
              >
                A confirmation has been sent to your registered number.
                <br />
                We look forward to welcoming you.
              </div>

              <button
                className="btn-secondary"
                style={{ marginTop: 28 }}
                onClick={resetForm}
              >
                Make Another Booking
              </button>
            </div>
          )}

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 9,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(184,151,106,0.25)",
              }}
            >
              Traditional Hotel & Restaurant · Kalimpong · Darjeeling
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
