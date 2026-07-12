# 🚗 Fleet Manager

Personal car rental fleet management app — built with React + Vite + Tailwind CSS.

## Features
- 🚗 Full car profiles with photos, docs, oil change tracking
- 🔑 Rental management with check-in/check-out flow
- 📷 Photo attachments (exterior, interior, documents, customer ID, contracts)
- 💰 Finance tracking — income, expenses, profit per car
- 🔔 Renewal alerts — insurance, registration, inspection
- 🛢️ Oil change reminders per mileage
- 🚨 Accident records with photos
- 💾 Data persists in **localStorage** (survives refresh)
- ☁️ **Cloud sync via GitHub Gist** — access your data from any device
- 📤 Full JSON backup export/import (includes photos)
- 📱 PWA installable on iPhone & Android

---

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build & Deploy

```bash
npm run build   # outputs to /dist
```

### Deploy to Vercel (recommended)
1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Vercel auto-detects Vite — just click Deploy
4. Done! You get a live URL like `fleet-manager.vercel.app`

### Deploy to Netlify
1. Run `npm run build`
2. Drag the `dist/` folder to [app.netlify.com/drop](https://app.netlify.com/drop)

### Install as Phone App (PWA)
1. Open your deployed URL on your phone
2. **iPhone**: tap Share → Add to Home Screen
3. **Android**: tap the browser menu → Install App

---

## ☁️ Cloud Sync Setup (GitHub Gist)

This lets you access your fleet data from any device:

1. Go to **github.com → Settings → Developer settings → Personal access tokens → Fine-grained tokens**
2. Generate a token with **Gist: Read and Write** permission
3. In the app: open **More → Settings → Cloud Sync**
4. Paste your token → tap **Push to Cloud**
5. A private Gist is created. Copy the Gist ID.
6. On any other device: enter the same token + Gist ID → tap **Pull from Cloud**

> ⚠️ Photos are stored locally on each device. The cloud sync covers all car, rental, expense, and accident records.

---

## Data Storage

| Data | Where |
|------|-------|
| Cars, rentals, expenses, accidents | `localStorage` (key: `fleet-v2`) |
| Photos & document copies | `localStorage` (key prefix: `fm-media:`) |
| Cloud backup | GitHub Gist (private) |

---

## Tech Stack
- **React 18** + **Vite 5**
- **Tailwind CSS 3**
- **lucide-react** icons
- No backend required

---

Made with ❤️ for Ahmed
