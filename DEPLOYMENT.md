# Vcube Infra Projects — Production Deployment Guide

This guide details the procedures for deploying the **Vcube Infra Projects** production web application to live hosting environments.

---

## 1. System Overview & Technology Stack

| Component | Specification |
| :--- | :--- |
| **Framework** | Next.js 16.4.3 (App Router) |
| **Runtime** | React 19.3.0 |
| **Styling** | Tailwind CSS v4.x (Self-contained theme & zero external CSS CDNs) |
| **3D Rendering** | Three.js 0.186.1, React Three Fiber 9.8.2, Drei 10.7.9 (Client-side dynamic lazy loading) |
| **Animations** | GSAP 3.15.0 & Lenis 1.3.27 smooth scrolling |
| **Fonts** | 100% Self-Hosted Local WOFF2 (`Outfit`, `Inter`, `Cinzel`) via `next/font/local` |
| **SEO & Meta** | Dynamic `sitemap.xml`, `robots.txt`, OpenGraph metadata, and Schema.org JSON-LD |

---

## 2. Environment Variables

Create a `.env.local` file for local development or configure these environment variables in your deployment dashboard (e.g. Vercel, Netlify, Railway, AWS):

```env
# Canonical Site URL
NEXT_PUBLIC_SITE_URL=https://vcubeinfra.com

# WhatsApp Integration (Country code prefix without '+', e.g. 91 for India)
NEXT_PUBLIC_WHATSAPP_NUMBER=919014303773
NEXT_PUBLIC_WHATSAPP_DISPLAY=+91 90143 03773

# Contact Email
NEXT_PUBLIC_CONTACT_EMAIL=vcubeinfraprojects@gmail.com

# Corporate Address
NEXT_PUBLIC_ADDRESS_LINE1=Vcube Infra Projects Corporate Office
NEXT_PUBLIC_ADDRESS_LINE2=Commercial District, Infrastructure Corridor
NEXT_PUBLIC_ADDRESS_CITY=Hyderabad
NEXT_PUBLIC_ADDRESS_STATE=Telangana
NEXT_PUBLIC_ADDRESS_PINCODE=500081
```

---

## 3. Production Build Commands

```bash
# Install dependencies
npm ci

# Typecheck
npx tsc --noEmit

# Production Build (Uses Next.js Webpack engine for maximum stability on Windows/Linux)
npm run build

# Start Production Server locally
npm run start
```

Verification utility scripts included:
```bash
# Verify all 9 routes and SEO files respond with HTTP 200
npm run test:routes

# Run full automated 6-run Lighthouse mobile and desktop CLS benchmarks
npm run benchmark:cls
```

---

## 4. Deployment Methods

### Option A: Vercel (Recommended)

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Select your repository.
4. Set Build and Output Settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm ci`
5. Under **Environment Variables**, add the variables from Section 2.
6. Click **Deploy**.
7. Connect custom domain `vcubeinfra.com` in Project Settings > Domains.

---

### Option B: VPS / Dedicated Server (Ubuntu Linux 22.04 LTS / PM2 + Nginx)

#### 1. Prerequisites
```bash
# Update server and install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx git certbot python3-certbot-nginx
sudo npm install -g pm2
```

#### 2. Clone and Build Application
```bash
cd /var/www
git clone <YOUR_REPO_URL> vcube
cd vcube
npm ci
cp .env.example .env.local
# Edit .env.local with production credentials:
nano .env.local
npm run build
```

#### 3. Start Process Manager (PM2)
```bash
pm2 start npm --name "vcube" -- start -- -p 3000
pm2 save
pm2 startup
```

#### 4. Configure Nginx Reverse Proxy
Create `/etc/nginx/sites-available/vcubeinfra.com`:
```nginx
server {
    server_name vcubeinfra.com www.vcubeinfra.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
}
```

Enable site and configure SSL:
```bash
sudo ln -s /etc/nginx/sites-available/vcubeinfra.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d vcubeinfra.com -d www.vcubeinfra.com
```

---

### Option C: Docker Deployment

Create a `Dockerfile` in the root:
```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 5. Domain & DNS Configuration

| Record Type | Host | Points To | Notes |
| :--- | :--- | :--- | :--- |
| **A** | `@` | Server Public IPv4 (or Vercel `76.76.21.21`) | Apex domain (`vcubeinfra.com`) |
| **CNAME** | `www` | `cname.vercel-dns.com` (or `@`) | Canonical alias |
| **TXT** | `@` | `v=spf1 ...` | Email authentication SPF record |

---

## 6. Pre-Launch Verification Checklist

- [ ] All 9 routes render with HTTP 200 (`/`, `/about`, `/construction`, `/interiors`, `/branding`, `/projects`, `/clients`, `/queries`, `/contact`).
- [ ] Sitemap (`https://vcubeinfra.com/sitemap.xml`) and Robots (`https://vcubeinfra.com/robots.txt`) load properly.
- [ ] WhatsApp CTA buttons redirect to valid client business WhatsApp phone number.
- [ ] Contact email receives test enquiries.
- [ ] 3D Interactive Apartment Explorer loads dynamically with smooth 60fps performance on mobile and desktop.
- [ ] Google Fonts are eliminated; self-hosted fonts load without external network requests.
- [ ] CLS score verified at 0.000 across mobile and desktop audits.

