/**
 * mim.run subdomain router
 *
 * The same short word means the same thing everywhere — CAD bar, URL, subdomain, text message.
 *
 *   join 1234                →  mim.run/admin/incidents/1234   (CAD bar, ops view)
 *   1234.mim.run             →  mim.run/incidents/1234          (stakeholder view)
 *   what.mim.run/payment     →  mim.run/search?q=payment        (fuzzy incident search)
 *   new.mim.run              →  mim.run/new
 *
 * Incident IDs are short by design. Nobody says "INC0000334234" on a phone call.
 * They say "the payment processing thing." So what.mim.run handles that too.
 *
 * Links are assumed live. A resolved incident still renders. The record outlasts the incident.
 */

// ─── Config ───────────────────────────────────────────────────────────────────

const APP_BASE = 'https://mim.run'
const API_BASE = 'https://api.mim.run'

// Named subdomain → app path mapping
const NAMED_ROUTES: Record<string, string> = {
  // Operator shortcuts
  'new':        '/new',
  'status':     '/',
  'analytics':  '/analytics',
  'stats':      '/analytics',
  'admin':      '/admin',
  'dashboard':  '/admin',
  // Auth
  'login':      '/login',
  // Docs / support
  'docs':       'https://majorops.io/docs',
  'changelog':  'https://majorops.io/changelog',
  // Public status
  'statuspage': '/',
  'up':         '/',
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Env {
  // Bind D1 when you have one: DB: D1Database
  // Bind KV for caching:       CACHE: KVNamespace
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default {
  async fetch(request: Request, _env: Env): Promise<Response> {
    const url = new URL(request.url)
    const host = url.hostname            // e.g. "1234.mim.run" or "new.mim.run"
    const path = url.pathname            // e.g. "/terminal" or "/"
    const query = url.search            // preserve query params

    // Split host: ["1234", "mim", "run"] or ["mim", "run"] (apex)
    const parts = host.split('.')
    const isApex = parts.length === 2   // mim.run itself

    // Apex domain — serve the app directly (handled by Pages, not this Worker)
    if (isApex) {
      return fetch(request)
    }

    const sub = parts[0].toLowerCase()

    // ── Numeric subdomain: incident shortlink ─────────────────────────────────
    //
    // 1234.mim.run           → /incidents/1234         (public/stakeholder view)
    // 1234.mim.run/admin     → /admin/incidents/1234   (MIM admin view)
    // 1234.mim.run/terminal  → /admin/incidents/1234/terminal
    // 1234.mim.run/focus     → /admin/incidents/1234/focus
    //
    // The public page is the default — a leader who gets texted "1234.mim.run"
    // sees the stakeholder-facing incident page.
    // The MIM types `join 1234` in the CAD bar to get the admin view.
    //
    // "Assume live" — this redirect works whether the incident is active,
    // monitoring, or resolved. The record does not expire.

    if (/^\d+$/.test(sub)) {
      const id = sub

      // Sub-path routing for ops views
      const subPath = path.replace(/^\/+/, '').toLowerCase()

      let destination: string

      if (subPath === 'admin' || subPath === 'ops') {
        destination = `${APP_BASE}/admin/incidents/${id}${query}`
      } else if (subPath === 'terminal' || subPath === 'cli') {
        destination = `${APP_BASE}/admin/incidents/${id}/terminal${query}`
      } else if (subPath === 'focus') {
        destination = `${APP_BASE}/admin/incidents/${id}/focus${query}`
      } else {
        // Default: public stakeholder/leader view
        destination = `${APP_BASE}/incidents/${id}${query}`
      }

      return Response.redirect(destination, 302)
    }

    // ── what.mim.run — fuzzy incident search ──────────────────────────────────
    //
    // what.mim.run/payment processing
    // what.mim.run/auth
    // what.mim.run/storage outage
    //
    // The path segment is treated as a search query. Spaces are fine — %20 or literal.
    // The app at /search handles fuzzy matching, auto-redirect on single match,
    // and a picker when there are several.
    //
    // This exists because nobody on a phone call says a ticket number.
    // They say what's broken. This handles that.

    if (sub === 'what' || sub === 'find' || sub === 'search') {
      // path = "/payment processing" or "/auth latency" or "/"
      const rawQuery = decodeURIComponent(path.replace(/^\/+/, '').trim())

      if (!rawQuery) {
        // bare what.mim.run — go to search with no query (shows all active)
        return Response.redirect(`${APP_BASE}/search`, 302)
      }

      return Response.redirect(
        `${APP_BASE}/search?q=${encodeURIComponent(rawQuery)}`,
        302
      )
    }

    // ── api.mim.run — proxy to Workers API ───────────────────────────────────

    if (sub === 'api') {
      const apiUrl = `${API_BASE}${path}${query}`
      return fetch(new Request(apiUrl, request))
    }

    // ── Named operator shortcuts ──────────────────────────────────────────────

    if (NAMED_ROUTES[sub]) {
      const target = NAMED_ROUTES[sub]

      // External redirect (e.g. docs → majorops.io/docs)
      if (target.startsWith('http')) {
        return Response.redirect(target, 302)
      }

      return Response.redirect(`${APP_BASE}${target}${query}`, 302)
    }

    // ── Fallback ──────────────────────────────────────────────────────────────
    // Unknown subdomain — redirect to status page with a note in query string
    // so the app can optionally surface a "not found" notice.

    return Response.redirect(`${APP_BASE}/?ref=unknown-sub&sub=${sub}`, 302)
  },
}
