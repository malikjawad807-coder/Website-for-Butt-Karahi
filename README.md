# Butt Karahi — Official Website

> **Taste the Tradition · Lahore Since 1975**  
> Premium Scrollytelling Web Experience for Butt Karahi across Mississauga & Pickering, Ontario.

[![100% Halal](https://img.shields.io/badge/Meat-100%25%20Zabiha%20Halal-emerald?style=for-the-badge)](https://buttkarahi.com)
[![Tradition](https://img.shields.io/badge/Heritage-Since%201975%20Lahore-amber?style=for-the-badge)](https://buttkarahi.com)
[![Locations](https://img.shields.io/badge/GTA%20Locations-Mississauga%20%7C%20Pickering-red?style=for-the-badge)](https://buttkarahi.com)

---

## 🌟 Overview & Key Highlights

This codebase is a complete, modern, high-performance re-imagining of the iconic **Butt Karahi** website, engineered with cutting-edge scrollytelling visual effects, responsive architecture, and interactive ordering features:

1. **Pinned 240-Frame Video Scrub Canvas Hero**:
   - Pinned HTML5 canvas scrubbing across 240 high-definition frames of a live sizzling karahi over roaring flames.
   - Smooth 60fps linear interpolation (`lerp`) on `requestAnimationFrame`.
   - Dynamic story slides glide into place at key scroll thresholds.
   - Includes an **Auto Play / Video Mode** toggle for effortless automated playback.

2. **Full Responsive Optimization**:
   - Tailored for seamless mobile touch scrolling, tablets, laptops, and ultra-wide screens.
   - High-DPI / Retina canvas scaling.
   - Mobile slide-over navigation drawer.

3. **Complete Interactive Online Ordering & Menu (`menu.html`)**:
   - All 14 menu categories: *Appetizers, Mutton, Beef, Chicken, BBQ, Rice Creations, Vegetarian, Seafood, Naan/Bread, Kids Menu, Desserts, Beverages, Catering Trays*.
   - Live search filter and portion selection.
   - Real-time cart drawer with subtotal, Ontario 13% HST calculation, delivery fee options, and promo code support (**`BUTT10`** for 10% off).
   - Instant location switcher (*Winston Churchill*, *Ridgeway Plaza*, *Pickering*).

4. **Interactive AI "Online Waiter" Floating Assistant**:
   - Floating chat widget providing recommendations, spice guidance, halal verification, and dietary advice.

5. **Our Story & Heritage (`story.html`)**:
   - Lahore 1975 roots, Imtiaz Butt's journey, and four decades of culinary passion.
   - Featuring executive kitchen photography with custom royal Butt Karahi chef embroidery.

6. **Locations Directory (`locations.html`)**:
   - Comprehensive store details, addresses, operating hours, direct phone dialing, and Google Maps links.

7. **Franchising & Partner Portal (`franchising.html`)**:
   - Multi-unit investment overview, 4-step launch roadmap, ideal partner criteria, and interactive inquiry submission.

---

## 🚀 Quick Start & Local Preview

This project is built using pure **HTML5**, **Vanilla CSS3**, and **Modern JavaScript** with zero external runtime dependencies.

### Option 1: Direct File Open
Double-click [`index.html`](file:///d:/But%20karahi%20website/index.html) in your browser.

### Option 2: Local HTTP Server (Recommended)
Using Python:
```bash
python -m http.server 3000
```
Then visit: `http://localhost:3000`

Using Node.js:
```bash
npx serve .
```

---

## 🛡️ Security & Performance Audit

- **Zero Third-Party Runtime Dependencies**: No npm supply-chain risk or third-party CVE exposure.
- **XSS & Injection Protection**: Strictly sanitized DOM manipulation using native safe elements and escaped inputs.
- **Secure External Links**: All external links are hardened with `rel="noopener noreferrer"`.
- **Performance Optimized**: Progressive frame buffering, deferred preloading, and passive scroll listeners.

---

## 📍 Locations

- **Winston Churchill**: 3015 Winston Churchill Blvd #7, Mississauga, ON L5L 2V8 · *(905) 484-5677*
- **Ridgeway Plaza**: 3960 Eglinton Ave W #415, Mississauga, ON L5M 2R9 · *(905) 607-2629* (Open till 2 AM)
- **Pickering**: 820 Kingston Rd, Pickering, ON L1V 1A8 · *(905) 839-3002*

---

*© Butt Karahi, 2026. All Rights Reserved.*
