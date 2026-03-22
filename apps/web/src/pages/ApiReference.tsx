/**
 * ApiReference — native React renderer for the MajorOps OpenAPI 3.x spec.
 *
 * Parses openapi.yaml (bundled at build time by the Vite plugin) using
 * js-yaml loaded from cdnjs, then renders endpoints grouped by tag in the
 * ops-* design language. No Swagger UI chrome, no iframe.
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, ChevronDown, ChevronRight,
  Lock, Server, Tag, Hash,
} from 'lucide-react'
import { openapiYaml } from 'virtual:docs'

// ─── YAML loading ─────────────────────────────────────────────────────────────

declare global {
  interface Window {
    jsyaml?: { load: (text: string) => unknown }
  }
}

function loadJsYaml(): Promise<void> {
  if (window.jsyaml) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js'
    s.onload = () => resolve()
    s.onerror = reject
    document.head.appendChild(s)
  })
}

// ─── OpenAPI types (just what we need) ────────────────────────────────────────

interface OAInfo { title: string; version: string; description?: string }
interface OAServer { url: string; description?: string }
interface OATag { name: string; description?: string }

interface OAMediaContent { schema?: OASchema }
interface OAResponse { description: string; content?: Record<string, OAMediaContent> }
interface OAParam {
  name: string; in: string; required?: boolean
  schema?: OASchema; description?: string
}
interface OARequestBody { required?: boolean; content: Record<string, OAMediaContent> }
interface OAOperation {
  tags?: string[]; summary?: string; description?: string
  parameters?: OAParam[]
  requestBody?: OARequestBody
  responses?: Record<string, OAResponse>
}
interface OAPaths { [path: string]: { [method: string]: OAOperation } }

interface OASchema {
  type?: string; format?: string; description?: string
  enum?: string[]; nullable?: boolean; default?: unknown
  properties?: Record<string, OASchema>
  items?: OASchema
  required?: string[]
  $ref?: string
  minimum?: number; maximum?: number
  allOf?: OASchema[]; oneOf?: OASchema[]; anyOf?: OASchema[]
}

interface OAComponents {
  schemas?: Record<string, OASchema>
  parameters?: Record<string, OAParam>
  responses?: Record<string, OAResponse>
}

interface OASpec {
  info: OAInfo
  servers?: OAServer[]
  tags?: OATag[]
  paths: OAPaths
  components?: OAComponents
}

// ─── Method colours ───────────────────────────────────────────────────────────

const METHOD_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  get:    { bg: 'rgba(59,130,246,0.12)',  text: '#3B82F6', border: 'rgba(59,130,246,0.35)' },
  post:   { bg: 'rgba(34,197,94,0.12)',   text: '#22C55E', border: 'rgba(34,197,94,0.35)'  },
  patch:  { bg: 'rgba(245,158,11,0.12)',  text: '#F59E0B', border: 'rgba(245,158,11,0.35)' },
  put:    { bg: 'rgba(234,88,12,0.12)',   text: '#EA580C', border: 'rgba(234,88,12,0.35)'  },
  delete: { bg: 'rgba(204,0,0,0.12)',     text: '#CC0000', border: 'rgba(204,0,0,0.35)'    },
}

// ─── $ref resolver ────────────────────────────────────────────────────────────

function resolveRef(ref: string, spec: OASpec): OASchema | OAParam | OAResponse | null {
  // e.g. "#/components/schemas/Incident"
  const parts = ref.replace('#/', '').split('/')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let node: any = spec
  for (const p of parts) node = node?.[p]
  return node ?? null
}

function resolveSchema(schema: OASchema, spec: OASpec): OASchema {
  if (schema.$ref) {
    const resolved = resolveRef(schema.$ref, spec)
    return resolved ? resolveSchema(resolved as OASchema, spec) : schema
  }
  return schema
}

// ─── Small reusable bits ─────────────────────────────────────────────────────

function MethodBadge({ method }: { method: string }) {
  const m = method.toLowerCase()
  const s = METHOD_STYLE[m] ?? METHOD_STYLE.get
  return (
    <span
      className="font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-0.5"
      style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
    >
      {method.toUpperCase()}
    </span>
  )
}

function TypePill({ schema, spec }: { schema: OASchema; spec: OASpec }) {
  const resolved = resolveSchema(schema, spec)
  const label = resolved.$ref
    ? resolved.$ref.split('/').pop()!
    : resolved.enum
    ? resolved.enum.join(' | ')
    : resolved.type === 'array' && resolved.items
    ? `${resolveSchema(resolved.items, spec).type ?? resolved.items.$ref?.split('/').pop() ?? 'object'}[]`
    : resolved.type ?? 'any'
  return (
    <code className="doc-inline-code text-[10px]">{label}</code>
  )
}

function SchemaRow({
  name, schema, spec, required, depth = 0,
}: {
  name: string; schema: OASchema; spec: OASpec; required?: boolean; depth?: number
}) {
  const [open, setOpen] = useState(false)
  const resolved = resolveSchema(schema, spec)
  const hasChildren = resolved.properties && Object.keys(resolved.properties).length > 0

  return (
    <>
      <tr className="border-b border-ops-border/40">
        <td className="py-1.5 pr-3 align-top" style={{ paddingLeft: `${0.75 + depth * 1}rem` }}>
          <span className="font-mono text-[11px] text-ops-text">{name}</span>
          {required && <span className="ml-1 text-ops-red text-[9px] font-mono">*</span>}
        </td>
        <td className="py-1.5 pr-3 align-top">
          <TypePill schema={schema} spec={spec} />
          {resolved.nullable && <span className="ml-1 font-mono text-[9px] text-ops-dim">nullable</span>}
        </td>
        <td className="py-1.5 align-top">
          <span className="font-mono text-[11px] text-ops-dim">{resolved.description ?? ''}</span>
          {resolved.default !== undefined && (
            <span className="ml-2 font-mono text-[9px] text-ops-border">default: {String(resolved.default)}</span>
          )}
          {resolved.enum && (
            <div className="mt-0.5 flex flex-wrap gap-1">
              {resolved.enum.map(v => (
                <code key={v} className="doc-inline-code text-[9px]">{v}</code>
              ))}
            </div>
          )}
          {hasChildren && (
            <button
              onClick={() => setOpen(o => !o)}
              className="mt-0.5 flex items-center gap-1 font-mono text-[9px] text-ops-dim hover:text-ops-text transition-colors"
            >
              {open ? <ChevronDown size={8} /> : <ChevronRight size={8} />}
              {open ? 'hide' : 'expand'} properties
            </button>
          )}
        </td>
      </tr>
      {open && resolved.properties && Object.entries(resolved.properties).map(([k, v]) => (
        <SchemaRow
          key={k} name={k} schema={v} spec={spec}
          required={resolved.required?.includes(k)}
          depth={depth + 1}
        />
      ))}
    </>
  )
}

function SchemaTable({ schema, spec }: { schema: OASchema; spec: OASpec }) {
  const resolved = resolveSchema(schema, spec)
  if (!resolved.properties) return null
  const props = Object.entries(resolved.properties)
  if (!props.length) return null

  return (
    <table className="w-full text-left border-collapse mt-2">
      <thead>
        <tr className="border-b border-ops-border">
          <th className="pb-1.5 pr-3 font-mono text-[9px] uppercase tracking-widest text-ops-dim w-32">Field</th>
          <th className="pb-1.5 pr-3 font-mono text-[9px] uppercase tracking-widest text-ops-dim w-28">Type</th>
          <th className="pb-1.5 font-mono text-[9px] uppercase tracking-widest text-ops-dim">Description</th>
        </tr>
      </thead>
      <tbody>
        {props.map(([name, s]) => (
          <SchemaRow
            key={name} name={name} schema={s} spec={spec}
            required={resolved.required?.includes(name)}
          />
        ))}
      </tbody>
    </table>
  )
}

// ─── Endpoint card ────────────────────────────────────────────────────────────

function EndpointCard({ method, path, op, spec }: {
  method: string; path: string; op: OAOperation; spec: OASpec
}) {
  const [open, setOpen] = useState(false)

  // Resolve $ref parameters
  const params: OAParam[] = (op.parameters ?? []).map(p => {
    const maybeRef = p as unknown as { $ref?: string }
    if (maybeRef.$ref) {
      return (resolveRef(maybeRef.$ref, spec) as OAParam | null) ?? p
    }
    return p
  })

  const pathParams = params.filter(p => p.in === 'path')
  const queryParams = params.filter(p => p.in === 'query')

  return (
    <div className="border border-ops-border bg-ops-surface mb-2">
      {/* Header row */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-ops-muted/50 transition-colors"
      >
        <MethodBadge method={method} />
        <code className="font-mono text-[12px] text-ops-text flex-1">{path}</code>
        <span className="font-mono text-[11px] text-ops-dim hidden sm:block">{op.summary}</span>
        {open ? <ChevronDown size={12} className="text-ops-dim flex-shrink-0" /> : <ChevronRight size={12} className="text-ops-dim flex-shrink-0" />}
      </button>

      {open && (
        <div className="border-t border-ops-border px-4 py-4 space-y-5">
          {/* Summary + description */}
          {op.summary && (
            <p className="font-mono text-[12px] font-semibold text-ops-text">{op.summary}</p>
          )}
          {op.description && (
            <p className="font-mono text-[11px] text-ops-dim leading-relaxed whitespace-pre-line">{op.description}</p>
          )}

          {/* Path params */}
          {pathParams.length > 0 && (
            <section>
              <div className="font-mono text-[9px] uppercase tracking-widest text-ops-dim mb-2">Path Parameters</div>
              <table className="w-full text-left border-collapse">
                <tbody>
                  {pathParams.map(p => (
                    <tr key={p.name} className="border-b border-ops-border/40">
                      <td className="py-1.5 pr-3 w-32">
                        <code className="font-mono text-[11px] text-ops-text">{p.name}</code>
                        <span className="ml-1 text-ops-red text-[9px] font-mono">*</span>
                      </td>
                      <td className="py-1.5 pr-3 w-24">
                        {p.schema && <TypePill schema={p.schema} spec={spec} />}
                      </td>
                      <td className="py-1.5 font-mono text-[11px] text-ops-dim">{p.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {/* Query params */}
          {queryParams.length > 0 && (
            <section>
              <div className="font-mono text-[9px] uppercase tracking-widest text-ops-dim mb-2">Query Parameters</div>
              <table className="w-full text-left border-collapse">
                <tbody>
                  {queryParams.map(p => (
                    <tr key={p.name} className="border-b border-ops-border/40">
                      <td className="py-1.5 pr-3 w-32">
                        <code className="font-mono text-[11px] text-ops-text">{p.name}</code>
                        {p.required && <span className="ml-1 text-ops-red text-[9px] font-mono">*</span>}
                      </td>
                      <td className="py-1.5 pr-3 w-24">
                        {p.schema && <TypePill schema={p.schema} spec={spec} />}
                      </td>
                      <td className="py-1.5 font-mono text-[11px] text-ops-dim">{p.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {/* Request body */}
          {op.requestBody && (() => {
            const content = op.requestBody.content['application/json']
            if (!content?.schema) return null
            const resolved = resolveSchema(content.schema, spec)
            return (
              <section>
                <div className="font-mono text-[9px] uppercase tracking-widest text-ops-dim mb-2">
                  Request Body {op.requestBody.required && <span className="text-ops-red">*</span>}
                </div>
                <SchemaTable schema={resolved} spec={spec} />
              </section>
            )
          })()}

          {/* Responses */}
          {op.responses && (
            <section>
              <div className="font-mono text-[9px] uppercase tracking-widest text-ops-dim mb-2">Responses</div>
              <div className="space-y-2">
                {Object.entries(op.responses).map(([code, resp]) => {
                  // Resolve $ref responses
                  const maybeRefResp = resp as unknown as { $ref?: string }
                  const r: OAResponse = maybeRefResp.$ref
                    ? ((resolveRef(maybeRefResp.$ref, spec) as OAResponse | null) ?? resp)
                    : resp

                  const statusColor =
                    code.startsWith('2') ? '#22C55E' :
                    code.startsWith('4') ? '#F59E0B' :
                    code.startsWith('5') ? '#CC0000' : 'var(--ops-dim)'

                  const bodySchema = r.content?.['application/json']?.schema

                  return (
                    <div key={code} className="border border-ops-border/60">
                      <div className="flex items-center gap-3 px-3 py-2 bg-ops-muted/40">
                        <span className="font-mono text-[11px] font-bold" style={{ color: statusColor }}>{code}</span>
                        <span className="font-mono text-[11px] text-ops-dim">{r.description}</span>
                      </div>
                      {bodySchema && (() => {
                        const resolved = resolveSchema(bodySchema, spec)
                        return resolved.properties ? (
                          <div className="px-3 py-2">
                            <SchemaTable schema={resolved} spec={spec} />
                          </div>
                        ) : null
                      })()}
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Tag section ─────────────────────────────────────────────────────────────

function TagSection({ tag, paths, spec }: {
  tag: OATag; paths: OAPaths; spec: OASpec
}) {
  const [open, setOpen] = useState(true)

  // Collect all operations for this tag
  const ops: { method: string; path: string; op: OAOperation }[] = []
  const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']

  for (const [path, pathItem] of Object.entries(paths)) {
    for (const method of HTTP_METHODS) {
      const op = pathItem[method] as OAOperation | undefined
      if (op?.tags?.includes(tag.name)) {
        ops.push({ method, path, op })
      }
    }
  }

  if (!ops.length) return null

  return (
    <section className="mb-10">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 w-full text-left mb-4 group"
      >
        <Tag size={13} className="text-ops-red flex-shrink-0" />
        <h2 className="font-heading text-lg uppercase tracking-widest text-ops-text group-hover:text-ops-red transition-colors">
          {tag.name}
        </h2>
        {open ? <ChevronDown size={12} className="text-ops-dim" /> : <ChevronRight size={12} className="text-ops-dim" />}
        <span className="ml-auto font-mono text-[9px] text-ops-border">{ops.length} endpoint{ops.length !== 1 ? 's' : ''}</span>
      </button>

      {tag.description && (
        <p className="font-mono text-[11px] text-ops-dim mb-4 leading-relaxed">{tag.description}</p>
      )}

      {open && ops.map(({ method, path, op }) => (
        <EndpointCard key={`${method}-${path}`} method={method} path={path} op={op} spec={spec} />
      ))}
    </section>
  )
}

// ─── Schema definitions section ───────────────────────────────────────────────

function SchemasSection({ spec }: { spec: OASpec }) {
  const schemas = spec.components?.schemas
  if (!schemas) return null

  const [open, setOpen] = useState(false)

  return (
    <section className="mb-10">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 w-full text-left mb-4 group"
      >
        <Hash size={13} className="text-ops-dim flex-shrink-0" />
        <h2 className="font-heading text-lg uppercase tracking-widest text-ops-text group-hover:text-ops-red transition-colors">
          Schemas
        </h2>
        {open ? <ChevronDown size={12} className="text-ops-dim" /> : <ChevronRight size={12} className="text-ops-dim" />}
        <span className="ml-auto font-mono text-[9px] text-ops-border">{Object.keys(schemas).length} objects</span>
      </button>

      {open && Object.entries(schemas).map(([name, schema]) => {
        const resolved = resolveSchema(schema, spec)
        return (
          <div key={name} className="border border-ops-border bg-ops-surface mb-2 px-4 py-3">
            <div className="font-mono text-[12px] font-semibold text-ops-text mb-1">{name}</div>
            {resolved.description && (
              <p className="font-mono text-[11px] text-ops-dim mb-3">{resolved.description}</p>
            )}
            <SchemaTable schema={resolved} spec={spec} />
          </div>
        )
      })}
    </section>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ApiReference() {
  const [spec, setSpec] = useState<OASpec | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!openapiYaml) {
      setError('openapi.yaml not found in build.')
      return
    }
    loadJsYaml()
      .then(() => {
        if (!window.jsyaml) { setError('Failed to load YAML parser.'); return }
        try {
          setSpec(window.jsyaml.load(openapiYaml as string) as OASpec)
        } catch (e) {
          setError(`YAML parse error: ${String(e)}`)
        }
      })
      .catch(() => setError('Failed to load YAML parser from CDN. Check your network.'))
  }, [])

  if (error) {
    return (
      <div className="h-screen flex flex-col bg-ops-bg">
        <TopBar title="API Reference" />
        <div className="flex-1 flex items-center justify-center">
          <p className="font-mono text-[11px] text-ops-red">{error}</p>
        </div>
      </div>
    )
  }

  if (!spec) {
    return (
      <div className="h-screen flex flex-col bg-ops-bg">
        <TopBar title="API Reference" />
        <div className="flex-1 flex items-center justify-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ops-dim animate-pulse">
            Loading spec…
          </span>
        </div>
      </div>
    )
  }

  // Determine tag order — use spec.tags order if present, else derive from paths
  const tagOrder: OATag[] = spec.tags ?? []
  const seenTags = new Set(tagOrder.map(t => t.name))
  // Append any tags referenced in paths but not in spec.tags
  for (const pathItem of Object.values(spec.paths)) {
    for (const op of Object.values(pathItem) as OAOperation[]) {
      for (const t of op.tags ?? []) {
        if (!seenTags.has(t)) { tagOrder.push({ name: t }); seenTags.add(t) }
      }
    }
  }

  return (
    <div className="h-screen flex flex-col bg-ops-bg overflow-hidden">
      <TopBar title={`${spec.info.title} · v${spec.info.version}`} />

      <div className="flex flex-1 overflow-hidden">
        {/* ── Quick-jump sidebar ─────────────────────────────────────── */}
        <aside className="hidden lg:block w-48 flex-shrink-0 border-r border-ops-border bg-ops-surface overflow-y-auto">
          <div className="py-3">
            <div className="px-4 pb-2">
              <span className="font-mono text-[8px] uppercase tracking-widest text-ops-border">Endpoints</span>
            </div>
            {tagOrder.map(tag => (
              <a
                key={tag.name}
                href={`#tag-${tag.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="block px-4 py-1.5 font-mono text-[11px] text-ops-dim hover:text-ops-text hover:bg-ops-muted transition-colors"
              >
                {tag.name}
              </a>
            ))}
            <a
              href="#schemas"
              className="block px-4 py-1.5 font-mono text-[11px] text-ops-dim hover:text-ops-text hover:bg-ops-muted transition-colors"
            >
              Schemas
            </a>
          </div>
        </aside>

        {/* ── Main content ───────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 py-8">

            {/* Info block */}
            <div className="mb-10 pb-8 border-b border-ops-border">
              <h1 className="font-heading text-2xl uppercase tracking-widest text-ops-text mb-1">
                {spec.info.title}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <code className="doc-inline-code">v{spec.info.version}</code>
                <span className="text-ops-border">·</span>
                <span className="font-mono text-[10px] text-ops-dim">OpenAPI 3.x</span>
              </div>

              {spec.info.description && (
                <div className="font-mono text-[12px] text-ops-dim leading-relaxed whitespace-pre-line mb-5">
                  {spec.info.description}
                </div>
              )}

              {/* Servers */}
              {spec.servers && spec.servers.length > 0 && (
                <div className="mb-4">
                  <div className="font-mono text-[9px] uppercase tracking-widest text-ops-dim mb-2 flex items-center gap-1">
                    <Server size={9} /> Base URLs
                  </div>
                  {spec.servers.map(s => (
                    <div key={s.url} className="flex items-center gap-3 mb-1">
                      <code className="doc-inline-code">{s.url}</code>
                      {s.description && (
                        <span className="font-mono text-[10px] text-ops-border">{s.description}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Auth callout */}
              <div className="flex items-start gap-3 border border-ops-amber/30 bg-ops-amber/5 px-4 py-3">
                <Lock size={12} className="text-ops-amber flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-ops-amber mb-1">Authentication</div>
                  <p className="font-mono text-[11px] text-ops-dim leading-relaxed">
                    All endpoints require a valid <code className="doc-inline-code">CF_Authorization</code> cookie
                    or <code className="doc-inline-code">Authorization: Bearer</code> token from Cloudflare Access.
                    The identity claim used is <code className="doc-inline-code">email</code>.
                  </p>
                </div>
              </div>
            </div>

            {/* Endpoint groups */}
            {tagOrder.map(tag => (
              <div key={tag.name} id={`tag-${tag.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <TagSection tag={tag} paths={spec.paths} spec={spec} />
              </div>
            ))}

            {/* Schemas */}
            <div id="schemas">
              <SchemasSection spec={spec} />
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

// ─── Shared top bar ───────────────────────────────────────────────────────────

function TopBar({ title }: { title: string }) {
  return (
    <div className="h-9 flex-shrink-0 border-b border-ops-border bg-ops-surface flex items-center px-3 gap-2.5 z-20">
      <Link
        to="/"
        className="flex items-center gap-1.5 text-ops-dim hover:text-ops-red transition-colors"
      >
        <ArrowLeft size={11} strokeWidth={2} />
        <span className="font-mono text-[9px] uppercase tracking-widest">Platform</span>
      </Link>
      <span className="text-ops-border">·</span>
      <Link
        to="/docs/index.md"
        className="font-mono text-[9px] uppercase tracking-widest text-ops-dim hover:text-ops-text transition-colors"
      >
        Docs
      </Link>
      <span className="text-ops-border">·</span>
      <span className="font-mono text-[9px] text-ops-text">{title}</span>
    </div>
  )
}
