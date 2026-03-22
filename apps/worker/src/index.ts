/**
 * MajorOps API Worker
 * Cloudflare Worker — D1 backend for mim.run
 *
 * Status: stub — endpoints return mock responses until real handlers are wired.
 * See: docs/api-reference/openapi.yaml for the full API contract
 *
 * Why this is plain fetch() for now:
 * - the API surface is still small
 * - keeping the first D1 wiring obvious matters more than abstractions
 * - once incident routes, auth, validation, and middleware grow, Hono is a
 *   good next step for structure rather than a prerequisite to begin
 */

export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
  JWT_SECRET: string;
  CF_ACCESS_AUD?: string;
}

const CORS_HEADERS = {
  // Wide open during bring-up. Tighten this once the app domains are fixed.
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, CF-Access-JWT-Assertion',
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

function notFound(message = 'Not found'): Response {
  return json({ error: message }, 404);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Health check
    if (pathname === '/health') {
      return json({ status: 'ok', env: env.ENVIRONMENT ?? 'unknown' });
    }

    // OpenAPI spec endpoint.
    // TODO: serve the actual generated/parity spec rather than this stub.
    if (pathname === '/v1/openapi.json') {
      return json({ info: { title: 'MajorOps API', version: '0.1.0' } });
    }

    // ── API v1 routes ─────────────────────────────────────────────────────────
    if (pathname.startsWith('/v1/')) {
      return handleV1(request, url, env);
    }

    return notFound();
  },
};

async function handleV1(request: Request, url: URL, env: Env): Promise<Response> {
  const path = url.pathname.replace('/v1', '');
  const method = request.method;

  // Incidents
  // Keep route names aligned with docs/api-reference/openapi.yaml so the mock
  // stage and the real D1-backed stage evolve on the same contract.
  if (path === '/incidents' && method === 'GET') {
    // TODO: replace with a real D1 query.
    return json({ incidents: [], total: 0 });
  }

  if (path === '/incidents' && method === 'POST') {
    // TODO: create incident and require auth.
    return json({ id: 'stub', message: 'not yet implemented' }, 501);
  }

  const incidentMatch = path.match(/^\/incidents\/([^/]+)(\/.*)?$/);
  if (incidentMatch) {
    const incidentId = incidentMatch[1];
    const sub = incidentMatch[2] ?? '';

    if (sub === '' && method === 'GET') {
      // TODO: fetch one incident plus the audience-specific computed fields.
      return json({ id: incidentId, message: 'not yet implemented' }, 501);
    }

    if (sub === '/phase' && method === 'POST') {
      return json({ message: 'not yet implemented' }, 501);
    }

    if (sub === '/timeline' && method === 'GET') {
      return json({ events: [] });
    }

    if (sub === '/updates' && method === 'GET') {
      return json({ updates: [] });
    }

    if (sub === '/updates' && method === 'POST') {
      return json({ message: 'not yet implemented' }, 501);
    }
  }

  // ── Users ──────────────────────────────────────────────────────────────────
  if (path === '/users/me' && method === 'GET') {
    return json({ message: 'not yet implemented — requires CF Access JWT' }, 501);
  }

  return notFound(`No handler for ${method} ${url.pathname}`);
}
