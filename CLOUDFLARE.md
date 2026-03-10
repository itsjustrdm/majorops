# Cloudflare Setup Guide

**Where you are right now:** You have a MkDocs site (`docs/`) that builds a documentation site targeting `about.majorops.io`. Nothing has been set up in Cloudflare yet, and no CLI tools have been run. This document walks through setup in the order you'd actually do it.

---

## Phase 1: Deploy the Docs Site (`about.majorops.io`)

This is the simplest deploy — just a static site. No Wrangler, no CLI, no database. Cloudflare Pages builds it directly from your repo.

### What you're deploying

Your MkDocs site (`mkdocs.yml`) builds into a `site/` folder of plain HTML/CSS/JS. Cloudflare Pages runs the build for you on every push to `main`.

```
GitHub repo (main branch)
  → Cloudflare Pages runs: pip install mkdocs-material && mkdocs build
  → Serves the site/ output at about.majorops.io
```

### Step 1 — Connect your repo to Cloudflare Pages

1. Log into [dash.cloudflare.com](https://dash.cloudflare.com)
2. In the left sidebar: **Workers & Pages** → **Create** → **Pages**
3. Click **Connect to Git** → authorize GitHub → select your `majorops` repo
4. Configure the build:

| Setting | Value |
|---|---|
| Project name | `majorops-docs` |
| Production branch | `main` |
| Build command | `pip install -r requirements.txt && mkdocs build` |
| Build output directory | `site` |
| Root directory | *(leave blank — your mkdocs.yml is at the repo root)* |

5. Click **Save and Deploy**

Cloudflare will run the build and give you a preview URL like `majorops-docs.pages.dev`. Every push to `main` triggers a new build automatically from here on.

---

### Step 2 — Add the custom domain

Once the first deploy succeeds:

1. In the Pages project → **Custom domains** → **Set up a custom domain**
2. Enter: `about.majorops.io`
3. Cloudflare will add the DNS record automatically if `majorops.io` is already in your Cloudflare account

If `majorops.io` is **not** in your Cloudflare account yet, you'd add a CNAME record at your registrar pointing `about` → `majorops-docs.pages.dev`.

---

### Step 3 — Check your `requirements.txt`

Cloudflare Pages needs to know which Python packages to install. Your `requirements.txt` should include at minimum:

```
mkdocs-material>=9.5
mkdocs-meta-plugin
pymdown-extensions
```

Check what's currently in your file:

```bash
cat requirements.txt
```

If the MkDocs build works locally with `mkdocs serve`, whatever is in your `.venv` is what needs to be in `requirements.txt`. You can generate it with:

```bash
source .venv/bin/activate
pip freeze | grep -E "mkdocs|pymdown|material" > requirements.txt
```

---

### That's it for Phase 1

Once your custom domain is set up, `about.majorops.io` is live and auto-deploys on every push. No Wrangler. No CLI. No secrets. Just static HTML.

---

## Phase 2: The App (`mim.run`)

This is the web app — `apps/web/` (Vite/React) deployed to `new.mim.run`, backed by a Cloudflare Worker API and D1 database. **You haven't started this yet** — the notes below are for when you're ready.

### What's involved

```
mim.run (zone)
├── new.mim.run     →  Cloudflare Pages  (apps/web/ Vite build)
├── api.mim.run     →  Cloudflare Worker (apps/worker/ API)
└── status.mim.run  →  Cloudflare Pages  (same Pages project)
```

Three pieces:
1. The frontend — another Pages deploy (like the docs site, just a Vite build)
2. The Worker — the API that the frontend calls
3. D1 — the database the Worker reads/writes

---

### First-time CLI setup (when you're ready)

You'll need Wrangler, the Cloudflare CLI:

```bash
# Install it globally (or use npx wrangler for one-off commands)
npm install -g wrangler

# Log in to your Cloudflare account
wrangler login
# Opens a browser tab — click Authorize

# Confirm it worked
wrangler whoami
```

---

### Create the D1 database (one time)

```bash
cd apps/worker
npx wrangler d1 create majorops-production
```

Wrangler prints something like:
```
✅ Successfully created DB 'majorops-production'

[[d1_databases]]
binding = "DB"
database_name = "majorops-production"
database_id = "abc123..."   ← copy this
```

Open `apps/worker/wrangler.toml` and paste the `database_id` value where it says `REPLACE_WITH_YOUR_DB_ID`.

---

### Deploy the Worker

```bash
cd apps/worker
npm install
npm run deploy
# → deploys to api.mim.run (once the route is configured in wrangler.toml)
```

---

### Deploy the Frontend (`apps/web/`)

Same process as the docs site — connect the repo to a new Pages project:

| Setting | Value |
|---|---|
| Project name | `majorops-web` |
| Build command | `cd apps/web && npm install && npm run build` |
| Build output directory | `apps/web/dist` |

Then add custom domain `new.mim.run`.

---

### Local development on your Mac

When you're building locally, you run two terminals:

```bash
# Terminal 1: API Worker (uses local SQLite, never touches production)
cd apps/worker && npm install
cp .dev.vars.example .dev.vars   # first time only
npm run db:migrate:local          # sets up schema
npm run db:seed:local             # loads demo data
npm run dev                       # Worker at http://localhost:8787

# Terminal 2: Frontend
cd apps/web && npm install
cp .env.example .env.local        # first time only (points to localhost:8787)
npm run dev                       # Vite at http://localhost:5173
```

Wrangler automatically creates a local SQLite file in `.wrangler/state/v3/d1/` — your production D1 is never touched when developing locally. The seed data gives you 3 demo users and 3 demo incidents to work with.

---

### Environment variables and secrets

| Where | File | What lives here | In repo? |
|---|---|---|---|
| Local Worker | `apps/worker/.dev.vars` | JWT secret, dev keys | **NO** (gitignored) |
| Local Frontend | `apps/web/.env.local` | `VITE_API_URL=http://localhost:8787` | **NO** (gitignored) |
| Templates | `.env.example`, `.dev.vars.example` | Key names, blank values | Yes |
| Production Worker | Cloudflare dashboard → Worker → Settings → Variables | Real secrets | Never in repo |
| Production Pages | Cloudflare Pages → Settings → Environment variables | `VITE_API_URL=https://api.mim.run` | Never in repo |

To set a production secret from the terminal:
```bash
npx wrangler secret put JWT_SECRET
# prompts for the value — never echoed or logged
```

---

## Quick Reference

```bash
# ── Docs site (about.majorops.io) ─────────────────────────────────────────
# Preview locally:
source .venv/bin/activate
mkdocs serve                    # → http://127.0.0.1:8000

# Build locally (same as what Cloudflare runs):
mkdocs build                    # → outputs to site/

# ── App (mim.run) ─────────────────────────────────────────────────────────
# One-time auth:
wrangler login
wrangler whoami

# Create production DB:
cd apps/worker && npx wrangler d1 create majorops-production

# Local dev:
npm run dev                     # Worker at :8787
cd apps/web && npm run dev      # Frontend at :5173

# Local DB:
npm run db:migrate:local
npm run db:seed:local
npm run db:query "SELECT * FROM incidents"

# Deploy Worker:
npx wrangler deploy

# Set a production secret:
npx wrangler secret put JWT_SECRET
npx wrangler secret list
```

---

*See also: [DATA_MODEL.md](DATA_MODEL.md) for D1 schema · [docs/api-reference/openapi.yaml](docs/api-reference/openapi.yaml) for endpoint contract*
