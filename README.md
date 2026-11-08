# Vcube Infra Projects

> **Turnkey Civil Construction · Architectural Interiors · Environmental Branding**  
> Live Canonical Domain: [vcubeinfra.com](https://vcubeinfra.com)

A premium, photography-led corporate web application for **Vcube Infra Projects**, built on the Next.js 16 App Router, React 19, and Tailwind CSS v4.

---

## 🏗️ Core Disciplines & Services

1. **Civil & Structural Engineering** (`/services/construction`):
   - Turnkey civil execution, foundation raft casting, structural column grids, post-tensioned slabs, and IS 456-compliant site engineering for multi-story residential and commercial buildings.
2. **Architectural Interiors & Fit-outs** (`/services/interiors`):
   - Multi-tier gypsum false ceilings with warm cove lighting, bespoke joinery, Italian marble flooring, electrical MEP, flutter boards, and acoustic glazing.
3. **Architectural Branding & Signage** (`/services/branding`):
   - 3D illuminated dimensional entrance letters, PVDF-coated ACP facade cladding, architectural wayfinding totems, and solar control window films.

---

## ⚡ Technical Stack & Architecture

- **Framework**: Next.js 16.4.3 (App Router with partial prefetching and static generation)
- **Runtime**: React 19.3.0
- **Styling**: Tailwind CSS v4.x (self-contained, zero external CSS runtime)
- **Visuals**: High-resolution photography optimized with WebP, AVIF, and responsive `next/image`
- **Animations**: GSAP 3.15 scroll-triggered reveals with reduced-motion support
- **Typography**: 100% self-hosted local WOFF2 fonts (`Outfit`, `Inter`, `Cinzel`) via `next/font/local`
- **SEO**: Dynamic `sitemap.xml`, `robots.txt`, OpenGraph metadata, and Schema.org JSON-LD

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm ci
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build & Verification
```bash
# Typecheck
npx tsc --noEmit

# Production Build (using Next.js Webpack engine)
npm run build

# Start Production Server
npm run start -p 3000

# Automated Route Verification (all 9 routes HTTP 200)
npm run test:routes

# 6-Run Lighthouse CLS & Performance Benchmark
npm run benchmark:cls
```

---

## 🌐 Deployment to Production (`vcubeinfra.com`)

For complete deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### DNS Records:
- **`A` Record**: Host `@` $\to$ `76.76.21.21` (TTL 3600)
- **`CNAME` Record**: Host `www` $\to$ `cname.vercel-dns.com.` (TTL 3600)

---

## 📞 Official Contact

- **Phone / WhatsApp**: [+91 90143 03773](https://wa.me/919014303773)
- **Email**: [vcubeinfraprojects@gmail.com](mailto:vcubeinfraprojects@gmail.com)
- **Location**: Hyderabad, Telangana, India
