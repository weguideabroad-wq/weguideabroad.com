
# WeGuideAbroad (Vite + React + Tailwind)

Generated: 2025-11-05

## Quick start
```bash
npm i
npm run dev
```
Set envs in `.env` (see `.env.example`).

## Build
```bash
npm run build
npm run preview
```

## Deploy to Vercel
- New Project → Import from Git (or upload).
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework: `Vite`
- Add Environment Variables: `VITE_WEBHOOK_URL`, `VITE_UPLOAD_ENDPOINT`, `VITE_CALENDLY_URL`.
- Point domain `weguideabroad.com` at Vercel; enable SSL.

## Files to edit
- `src/App.jsx`: replace sample programs or wire a fetch to your dataset.
- `index.html`: update `<title>` and meta.
- `src/index.css`: add your brand styles.
- `public/`: add your favicon and logos (create folder if needed).

## Program data
Use the CSV template you downloaded earlier. Convert to JSON or serve via a small API and fetch in `App.jsx`.
