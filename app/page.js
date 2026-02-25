"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #f8f5f0; color: #2a2520; font-family: 'Crimson Pro', serif; padding-top: 72px; }

        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Cinzel:wght@400;600;700;800&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

        .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

        /* Hero */
        .hero {
          min-height: 90vh;
          background: linear-gradient(135deg, #1a2820 0%, #0f1812 100%);
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 60px;
          padding: 80px 60px;
          position: relative;
          overflow: hidden;
          animation: fadeIn 1s ease 0.2s both;
        }
        .hero::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 30% 30%, rgba(140,180,120,0.08) 0%, transparent 60%);
          pointer-events: none;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero-content { animation: slideUp 0.9s ease 0.4s both; }
        .hero-tag {
          font-family: 'Cinzel', serif;
          font-size: 11px; letter-spacing: 0.28em; text-transform: uppercase;
          color: rgba(200,220,180,0.6); margin-bottom: 16px;
        }
        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 68px; font-weight: 900;
          color: #e8f0e0; line-height: 1.05;
          letter-spacing: -0.02em; margin-bottom: 20px;
        }
        .hero-subtitle {
          font-family: 'Crimson Pro', serif;
          font-style: italic; font-size: 22px;
          color: rgba(200,220,180,0.7);
          line-height: 1.5; letter-spacing: 0.02em; margin-bottom: 36px;
        }
        .hero-actions { display: flex; gap: 16px; }
        .btn-primary {
          padding: 16px 32px;
          background: linear-gradient(135deg, #6a9060 0%, #4a6f42 100%);
          border: none; border-radius: 4px; color: #f8faf5;
          font-family: 'Cinzel', serif; font-size: 12px;
          font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
          cursor: pointer; transition: transform 0.2s, box-shadow 0.3s;
          text-decoration: none; display: inline-block;
        }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(106,144,96,0.35); }
        .btn-secondary {
          padding: 16px 32px; background: transparent;
          border: 2px solid rgba(200,220,180,0.3); border-radius: 4px;
          color: rgba(200,220,180,0.8);
          font-family: 'Cinzel', serif; font-size: 12px;
          font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
          cursor: pointer; transition: all 0.2s;
          text-decoration: none; display: inline-block;
        }
        .btn-secondary:hover {
          border-color: rgba(200,220,180,0.6); color: #e8f0e0;
          background: rgba(200,220,180,0.08);
        }
        .hero-image { animation: slideUp 0.9s ease 0.6s both; }
        .image-placeholder {
          background: linear-gradient(135deg, rgba(140,180,120,0.12) 0%, rgba(80,120,90,0.18) 100%);
          border: 2px solid rgba(200,220,180,0.15); border-radius: 8px;
          aspect-ratio: 4/5; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 16px;
        }
        .image-icon { font-size: 80px; opacity: 0.4; }
        .image-caption {
          font-family: 'Cinzel', serif;
          font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(200,220,180,0.5);
        }

        /* Features */
        .features { background: #fff; padding: 100px 0; }
        .section-header { text-align: center; margin-bottom: 60px; }
        .section-tag {
          font-family: 'Cinzel', serif;
          font-size: 11px; letter-spacing: 0.28em; text-transform: uppercase;
          color: #6a9060; display: block; margin-bottom: 12px;
        }
        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 48px; font-weight: 700; color: #2a2520;
          letter-spacing: -0.01em; margin-bottom: 12px;
        }
        .section-title-alt {
          font-family: 'Playfair Display', serif;
          font-size: 42px; font-weight: 700; color: #2a2520;
          letter-spacing: -0.01em; margin-bottom: 20px;
        }
        .section-subtitle {
          font-family: 'Crimson Pro', serif;
          font-size: 18px; font-style: italic;
          color: rgba(42,37,32,0.6); max-width: 640px;
          margin: 0 auto; line-height: 1.6;
        }
        .features-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px;
        }
        .feature-card {
          text-align: center; padding: 32px 24px;
          background: #fafaf8; border: 1px solid rgba(106,144,96,0.12);
          border-radius: 6px; transition: transform 0.3s, box-shadow 0.3s;
          animation: riseIn 0.7s ease both;
        }
        .feature-card:hover { transform: translateY(-6px); box-shadow: 0 12px 32px rgba(106,144,96,0.12); }
        .feature-icon { font-size: 48px; margin-bottom: 16px; }
        .feature-title {
          font-family: 'Cinzel', serif; font-size: 16px; font-weight: 700;
          color: #2a2520; margin-bottom: 8px; letter-spacing: 0.04em;
        }
        .feature-desc {
          font-family: 'Crimson Pro', serif; font-size: 15px; font-style: italic;
          color: rgba(42,37,32,0.6); line-height: 1.5;
        }

        /* Rooms */
        .rooms { background: #f8f5f0; padding: 100px 0; }
        .rooms-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 36px; }
        .room-card {
          background: #fff; border: 1px solid rgba(106,144,96,0.15);
          border-radius: 8px; overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s;
          animation: riseIn 0.7s ease both;
        }
        .room-card:hover { transform: translateY(-8px); box-shadow: 0 16px 48px rgba(106,144,96,0.15); }
        .room-image { position: relative; }
        .room-placeholder {
          background: linear-gradient(135deg, #e8f0e0 0%, #d0dcc8 100%);
          aspect-ratio: 16/10; display: flex; align-items: center; justify-content: center;
        }
        .room-icon { font-size: 56px; opacity: 0.3; }
        .room-badge {
          position: absolute; top: 16px; right: 16px;
          background: rgba(26,40,32,0.85); backdrop-filter: blur(8px);
          border-radius: 4px; padding: 8px 16px;
          display: flex; align-items: baseline; gap: 4px;
        }
        .badge-price {
          font-family: 'Cinzel', serif; font-size: 20px; font-weight: 700; color: #c8dcc0;
        }
        .badge-night {
          font-family: 'Crimson Pro', serif; font-size: 13px; font-style: italic;
          color: rgba(200,220,192,0.7);
        }
        .room-content { padding: 28px; }
        .room-name {
          font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700;
          color: #2a2520; margin-bottom: 8px;
        }
        .room-capacity {
          font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 0.16em;
          text-transform: uppercase; color: #6a9060; margin-bottom: 12px;
        }
        .room-amenities {
          font-family: 'Crimson Pro', serif; font-size: 15px; font-style: italic;
          color: rgba(42,37,32,0.5); margin-bottom: 20px; line-height: 1.6;
        }
        .room-btn {
          width: 100%; padding: 13px; background: transparent;
          border: 2px solid rgba(106,144,96,0.3); border-radius: 4px;
          color: #6a9060; font-family: 'Cinzel', serif; font-size: 11px;
          font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
          cursor: pointer; transition: all 0.2s;
          text-decoration: none; display: block; text-align: center;
        }
        .room-btn:hover { background: #6a9060; border-color: #6a9060; color: #fff; }

        /* Restaurant */
        .restaurant {
          background: linear-gradient(135deg, #2a3228 0%, #1a2018 100%);
          color: #e8f0e0; padding: 100px 0;
        }
        .restaurant .section-tag { color: rgba(200,220,180,0.6); }
        .restaurant .section-title-alt { color: #e8f0e0; }
        .restaurant-layout {
          display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center;
        }
        .restaurant-image { animation: riseIn 0.8s ease 0.3s both; }
        .image-placeholder-lg {
          background: linear-gradient(135deg, rgba(140,180,120,0.1) 0%, rgba(80,120,90,0.15) 100%);
          border: 2px solid rgba(200,220,180,0.12); border-radius: 8px;
          aspect-ratio: 4/3; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 20px;
        }
        .image-icon-lg { font-size: 100px; opacity: 0.35; }
        .image-caption-lg {
          font-family: 'Cinzel', serif; font-size: 13px;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(200,220,180,0.4);
        }
        .restaurant-content { animation: riseIn 0.8s ease 0.5s both; }
        .restaurant-text {
          font-family: 'Crimson Pro', serif; font-size: 18px; line-height: 1.7;
          color: rgba(232,240,224,0.75); margin-bottom: 36px;
        }
        .restaurant-highlights { display: flex; flex-direction: column; gap: 24px; }
        .highlight-item { display: flex; align-items: flex-start; gap: 18px; }
        .highlight-icon { font-size: 32px; flex-shrink: 0; }
        .highlight-title {
          font-family: 'Cinzel', serif; font-size: 15px; font-weight: 700;
          color: #c8dcc0; margin-bottom: 4px; letter-spacing: 0.04em;
        }
        .highlight-desc {
          font-family: 'Crimson Pro', serif; font-size: 15px; font-style: italic;
          color: rgba(200,220,192,0.6);
        }

        /* Location */
        .location { background: #fff; padding: 100px 0; }
        .location-content { display: grid; grid-template-columns: 1.2fr 1fr; gap: 60px; }
        .map-placeholder {
          background: linear-gradient(135deg, #e8f0e0 0%, #d8e8d0 100%);
          border: 2px solid rgba(106,144,96,0.2); border-radius: 8px;
          padding: 80px 40px; text-align: center;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 12px;
        }
        .map-icon { font-size: 64px; margin-bottom: 8px; }
        .map-label {
          font-family: 'Cinzel', serif; font-size: 16px; font-weight: 700;
          color: #2a2520; letter-spacing: 0.06em;
        }
        .map-address {
          font-family: 'Crimson Pro', serif; font-size: 15px; font-style: italic;
          color: rgba(42,37,32,0.5); max-width: 280px;
        }
        .nearby-grid { display: grid; gap: 20px; }
        .nearby-item {
          display: flex; align-items: center; gap: 16px;
          padding: 18px 20px; background: #fafaf8;
          border: 1px solid rgba(106,144,96,0.1); border-radius: 6px;
          animation: riseIn 0.6s ease both;
        }
        .nearby-icon {
          font-size: 32px; width: 48px; height: 48px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(106,144,96,0.08); border-radius: 50%; flex-shrink: 0;
        }
        .nearby-name {
          font-family: 'Cinzel', serif; font-size: 15px; font-weight: 600;
          color: #2a2520; letter-spacing: 0.02em;
        }
        .nearby-distance {
          font-family: 'Crimson Pro', serif; font-size: 13px; font-style: italic;
          color: rgba(42,37,32,0.5);
        }

        /* Testimonials */
        .testimonials { background: #f8f5f0; padding: 100px 0; }
        .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
        .testimonial-card {
          background: #fff; border: 1px solid rgba(106,144,96,0.12);
          border-radius: 8px; padding: 32px;
          animation: riseIn 0.7s ease both;
        }
        .testimonial-stars { font-size: 18px; color: #d4a050; margin-bottom: 16px; }
        .testimonial-text {
          font-family: 'Crimson Pro', serif; font-size: 16px; font-style: italic;
          line-height: 1.7; color: rgba(42,37,32,0.75); margin-bottom: 24px;
        }
        .testimonial-author { display: flex; align-items: center; gap: 14px; }
        .author-avatar {
          width: 44px; height: 44px; border-radius: 50%;
          background: linear-gradient(135deg, #6a9060 0%, #4a6f42 100%);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cinzel', serif; font-size: 18px; font-weight: 700; color: #fff;
          flex-shrink: 0;
        }
        .author-name {
          font-family: 'Cinzel', serif; font-size: 14px; font-weight: 600;
          color: #2a2520; letter-spacing: 0.02em;
        }
        .author-location {
          font-family: 'Crimson Pro', serif; font-size: 13px; font-style: italic;
          color: rgba(42,37,32,0.45);
        }

        /* CTA */
        .cta {
          background: linear-gradient(135deg, #4a6f42 0%, #2a4828 100%);
          padding: 100px 0; text-align: center;
        }
        .cta-content { max-width: 680px; margin: 0 auto; }
        .cta-title {
          font-family: 'Playfair Display', serif; font-size: 52px; font-weight: 900;
          color: #f8faf5; margin-bottom: 16px; letter-spacing: -0.01em;
        }
        .cta-subtitle {
          font-family: 'Crimson Pro', serif; font-size: 20px; font-style: italic;
          color: rgba(248,250,245,0.75); margin-bottom: 36px; line-height: 1.6;
        }
        .btn-cta {
          padding: 18px 44px; background: #f8faf5; border: none; border-radius: 4px;
          color: #2a4828; font-family: 'Cinzel', serif; font-size: 13px; font-weight: 800;
          letter-spacing: 0.18em; text-transform: uppercase; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.3s;
          text-decoration: none; display: inline-block;
        }
        .btn-cta:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.25); }

        /* Footer */
        .footer { background: #1a2018; color: rgba(232,240,224,0.6); padding: 60px 0 32px; }
        .footer-grid {
          display: grid; grid-template-columns: 2fr 1fr 1fr;
          gap: 60px; margin-bottom: 40px;
        }
        .footer-title {
          font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700;
          color: #c8dcc0; margin-bottom: 12px;
        }
        .footer-text {
          font-family: 'Crimson Pro', serif; font-size: 15px; font-style: italic;
          line-height: 1.6; color: rgba(200,220,192,0.5);
        }
        .footer-heading {
          font-family: 'Cinzel', serif; font-size: 12px; letter-spacing: 0.18em;
          text-transform: uppercase; color: #c8dcc0; margin-bottom: 16px;
        }
        .footer-links, .footer-contact {
          list-style: none; display: flex; flex-direction: column; gap: 10px;
        }
        .footer-links a {
          font-family: 'Crimson Pro', serif; font-size: 15px;
          color: rgba(200,220,192,0.6); text-decoration: none; transition: color 0.2s;
        }
        .footer-links a:hover { color: #c8dcc0; }
        .footer-contact li {
          font-family: 'Crimson Pro', serif; font-size: 15px; color: rgba(200,220,192,0.6);
        }
        .footer-bottom {
          text-align: center; padding-top: 32px;
          border-top: 1px solid rgba(200,220,192,0.1);
          font-family: 'Crimson Pro', serif; font-size: 13px; font-style: italic;
          color: rgba(200,220,192,0.35);
        }

        /* Header */
        .header {
          position: fixed; top: 0; left: 0; right: 0;
          background: rgba(15, 24, 18, 0.95); backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(200,220,180,0.1);
          z-index: 1000; transition: all 0.3s;
        }
        .header.scrolled {
          background: rgba(15, 24, 18, 0.98); box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .header-container {
          max-width: 1400px; margin: 0 auto; padding: 0 32px;
          display: flex; align-items: center; justify-content: space-between; height: 72px;
        }
        .header-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
        .logo-icon { font-size: 28px; }
        .logo-text { display: flex; flex-direction: column; }
        .logo-name {
          font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700;
          color: #e8f0e0; letter-spacing: 0.02em; line-height: 1;
        }
        .logo-tagline {
          font-family: 'Crimson Pro', serif; font-size: 11px; font-style: italic;
          color: rgba(200,220,180,0.5); margin-top: 2px;
        }
        .nav { display: flex; align-items: center; gap: 4px; }
        .nav-link {
          padding: 10px 20px; font-family: 'Cinzel', serif; font-size: 11px;
          font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(200,220,180,0.7); text-decoration: none;
          border-radius: 4px; transition: all 0.2s; position: relative;
        }
        .nav-link:hover { color: #c8dcc0; background: rgba(200,220,180,0.08); }
        .nav-link.active { color: #c8dcc0; }
        .nav-link.active::after {
          content: ''; position: absolute; bottom: 8px; left: 20px; right: 20px;
          height: 1px; background: #6a9060;
        }
        .mobile-menu-btn {
          display: none; background: transparent;
          border: 1px solid rgba(200,220,180,0.3); border-radius: 4px;
          padding: 8px 12px; color: rgba(200,220,180,0.7);
          font-size: 20px; cursor: pointer; transition: all 0.2s;
        }
        .mobile-menu-btn:hover { border-color: rgba(200,220,180,0.6); color: #c8dcc0; }

        @media (max-width: 900px) {
          .hero { grid-template-columns: 1fr; padding: 60px 24px; min-height: auto; }
          .hero-title { font-size: 48px; }
          .hero-actions { flex-direction: column; }
          .features-grid { grid-template-columns: repeat(2, 1fr); }
          .rooms-grid { grid-template-columns: 1fr; }
          .restaurant-layout { grid-template-columns: 1fr; gap: 40px; }
          .location-content { grid-template-columns: 1fr; }
          .testimonials-grid { grid-template-columns: 1fr; }
          .footer-grid { grid-template-columns: 1fr; gap: 40px; }
          .cta-title { font-size: 36px; }
          .nav {
            position: fixed; top: 72px; left: 0; right: 0;
            background: rgba(15, 24, 18, 0.98);
            flex-direction: column; align-items: stretch;
            padding: 20px; gap: 8px;
            border-bottom: 1px solid rgba(200,220,180,0.1);
            max-height: 0; overflow: hidden; transition: max-height 0.3s ease;
          }
          .nav.open { max-height: 400px; }
          .nav-link { text-align: center; padding: 14px 20px; }
          .mobile-menu-btn { display: block; }
          .header-container { padding: 0 20px; }
          .logo-name { font-size: 16px; }
          .logo-tagline { font-size: 10px; }
        }
        @media (max-width: 600px) {
          .features-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Cinzel:wght@400;600;700;800&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <header className={`header${scrolled ? " scrolled" : ""}`}>
        <div className="header-container">
          <Link href="/" className="header-logo">
            <span className="logo-icon">🏨</span>
            <div className="logo-text">
              <div className="logo-name">Traditional Hotel</div>
              <div className="logo-tagline">Kalimpong, Darjeeling</div>
            </div>
          </Link>

          <nav className={`nav${menuOpen ? " open" : ""}`}>
            <Link
              href="/"
              className="nav-link active"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/booking"
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              Booking
            </Link>
            <Link
              href="/contact"
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              Contact Us
            </Link>
            <Link
              href="/admin"
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              Admin Login
            </Link>
          </nav>

          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-tag">Est. 1985 · Kalimpong, Darjeeling</div>
          <h1 className="hero-title">
            Traditional Hotel
            <br />& Restaurant
          </h1>
          <p className="hero-subtitle">
            Where the hills meet heritage, and every stay tells a story
          </p>
          <div className="hero-actions">
            <Link href="/booking" className="btn-primary">
              Reserve Your Stay
            </Link>
            <a href="#rooms" className="btn-secondary">
              Explore Rooms
            </a>
          </div>
        </div>
        <div className="hero-image">
          <div className="image-placeholder">
            <span className="image-icon">🏔</span>
            <div className="image-caption">Overlooking the Kanchenjunga</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Why Choose Us</span>
            <h2 className="section-title">A Home Away from Home</h2>
          </div>
          <div className="features-grid">
            {[
              {
                icon: "🛏",
                title: "9 Cozy Rooms",
                desc: "Thoughtfully designed spaces with valley views",
              },
              {
                icon: "🍽",
                title: "Authentic Cuisine",
                desc: "Traditional flavors from the hills & plains",
              },
              {
                icon: "🌄",
                title: "Scenic Location",
                desc: "Minutes from Deolo Hill & downtown Kalimpong",
              },
              {
                icon: "🏡",
                title: "Family Owned",
                desc: "Four decades of warm Himalayan hospitality",
              },
            ].map((f, i) => (
              <div
                className="feature-card"
                key={i}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms */}
      <section className="rooms" id="rooms">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Accommodations</span>
            <h2 className="section-title">Our Rooms</h2>
            <p className="section-subtitle">
              Each room offers comfort, tranquility, and breathtaking views of
              the Eastern Himalayas
            </p>
          </div>
          <div className="rooms-grid">
            {[
              {
                name: "Valley View Suite",
                guests: "2 guests",
                amenities: "King Bed · Balcony · Mountain View",
                price: "₹2,500",
              },
              {
                name: "Deluxe Room",
                guests: "2-3 guests",
                amenities: "Queen Bed · Garden View · Mini Fridge",
                price: "₹2,000",
              },
              {
                name: "Family Room",
                guests: "4 guests",
                amenities: "2 Queen Beds · Spacious · Garden Access",
                price: "₹3,500",
              },
            ].map((room, i) => (
              <div
                className="room-card"
                key={i}
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <div className="room-image">
                  <div className="room-placeholder">
                    <span className="room-icon">🛏</span>
                  </div>
                  <div className="room-badge">
                    <span className="badge-price">{room.price}</span>
                    <span className="badge-night">/night</span>
                  </div>
                </div>
                <div className="room-content">
                  <h3 className="room-name">{room.name}</h3>
                  <div className="room-capacity">{room.guests}</div>
                  <div className="room-amenities">{room.amenities}</div>
                  <Link href="/booking" className="room-btn">
                    Book Now →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurant */}
      <section className="restaurant">
        <div className="container">
          <div className="restaurant-layout">
            <div className="restaurant-image">
              <div className="image-placeholder-lg">
                <span className="image-icon-lg">🍽</span>
                <div className="image-caption-lg">
                  Fresh, Local, Traditional
                </div>
              </div>
            </div>
            <div className="restaurant-content">
              <span className="section-tag">Dining</span>
              <h2 className="section-title-alt">Savor the Hills</h2>
              <p className="restaurant-text">
                Our in-house restaurant serves a curated menu blending Nepali,
                Tibetan, Bengali, and North Indian cuisines. Every dish is
                prepared with locally sourced ingredients and recipes passed
                down through generations.
              </p>
              <div className="restaurant-highlights">
                {[
                  {
                    icon: "☕",
                    title: "Breakfast Included",
                    desc: "Traditional hill breakfast with every stay",
                  },
                  {
                    icon: "🥘",
                    title: "All-Day Dining",
                    desc: "Open 7 AM – 10 PM daily",
                  },
                  {
                    icon: "🌱",
                    title: "Vegetarian Friendly",
                    desc: "Extensive vegetarian & vegan options",
                  },
                ].map((h, i) => (
                  <div className="highlight-item" key={i}>
                    <div className="highlight-icon">{h.icon}</div>
                    <div>
                      <div className="highlight-title">{h.title}</div>
                      <div className="highlight-desc">{h.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="location" id="location">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Location</span>
            <h2 className="section-title">Explore Kalimpong</h2>
            <p className="section-subtitle">
              Perfectly situated to access the best of {"Kalimpong's"} natural
              beauty and cultural heritage
            </p>
          </div>
          <div className="location-content">
            <div className="map-placeholder">
              <div className="map-icon">📍</div>
              <div className="map-label">Traditional Hotel & Restaurant</div>
              <div className="map-address">
                Main Road, Kalimpong, Darjeeling, West Bengal 734301
              </div>
            </div>
            <div className="nearby-grid">
              {[
                { icon: "⛰", name: "Deolo Hill", distance: "2 km away" },
                { icon: "🏯", name: "Durpin Monastery", distance: "3 km away" },
                {
                  icon: "🛍",
                  name: "Kalimpong Market",
                  distance: "1.5 km away",
                },
                { icon: "🕉", name: "Mangal Dham", distance: "4 km away" },
              ].map((place, i) => (
                <div
                  className="nearby-item"
                  key={i}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className="nearby-icon">{place.icon}</span>
                  <div>
                    <div className="nearby-name">{place.name}</div>
                    <div className="nearby-distance">{place.distance}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Guest Stories</span>
            <h2 className="section-title">What Our Guests Say</h2>
          </div>
          <div className="testimonials-grid">
            {[
              {
                text: "A hidden gem in the hills! The warmth of the family and the authentic food made our trip unforgettable.",
                name: "Anjali Gupta",
                location: "Kolkata",
                initial: "A",
              },
              {
                text: "Perfect blend of comfort and tradition. The mountain views from our room were absolutely stunning.",
                name: "Rahul Mehta",
                location: "Delhi",
                initial: "R",
              },
              {
                text: "The restaurant exceeded our expectations. Every meal felt like a home-cooked feast. Highly recommend!",
                name: "Priya Sharma",
                location: "Mumbai",
                initial: "P",
              },
            ].map((t, i) => (
              <div
                className="testimonial-card"
                key={i}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">{`"${t.text}"`}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.initial}</div>
                  <div>
                    <div className="author-name">{t.name}</div>
                    <div className="author-location">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready for Your Himalayan Escape?</h2>
            <p className="cta-subtitle">
              Book your stay today and experience the warmth of traditional
              hospitality
            </p>
            <Link href="/booking" className="btn-cta">
              Reserve Your Room
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <h4 className="footer-title">Traditional Hotel & Restaurant</h4>
              <p className="footer-text">
                A family-owned sanctuary in the heart of Kalimpong, serving
                travelers since 1985.
              </p>
            </div>
            <div>
              <h5 className="footer-heading">Quick Links</h5>
              <ul className="footer-links">
                <li>
                  <Link href="/booking">Book Now</Link>
                </li>
                <li>
                  <a href="#rooms">Our Rooms</a>
                </li>
                <li>
                  <a href="#location">Location</a>
                </li>
                <li>
                  <Link href="/contact">Contact Us</Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="footer-heading">Contact</h5>
              <ul className="footer-contact">
                <li>📞 +91-9876543210</li>
                <li>📧 info@traditionalhotel.com</li>
                <li>📍 Main Road, Kalimpong 734301</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Traditional Hotel & Restaurant. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
