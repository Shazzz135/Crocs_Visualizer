# Deployment Guide: Crocs Visualizer

**Status:** Active  
**Version:** 1.0.0-beta  

---

## 1. Hosting Architecture

The Crocs Visualizer is a fully static client-side application with zero server-side runtime dependencies.

- **Frontend Platform:** Vercel (or static CDN hosting such as Cloudflare Pages / Netlify).
- **Data Pipeline:** Ran locally or in scheduled GitHub Actions workflows to refresh the static catalog.

---

## 2. Environment Variables

Create `.env` in `frontend/`:

```env
# Safe public frontend configuration
VITE_APP_VERSION=1.0.0-beta
VITE_ENABLE_DISCLAIMERS=true
```

> [!CAUTION]
> Never expose private API keys or scraping tokens in client-side `VITE_` variables.

---

## 3. Build & Deploy Steps

```bash
# Build static bundle
cd frontend
pnpm run build

# Preview production build locally
pnpm run preview
```

The output in `frontend/dist` is deployable directly to Vercel without serverless functions.
