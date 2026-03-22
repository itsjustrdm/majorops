import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, readdirSync, statSync, existsSync } from 'fs'
import { resolve, join, relative } from 'path'

// The docs live as plain markdown in /docs and are compiled into the app at
// build time. This replaces the old MkDocs pipeline: one docs source, one UI.
const DOCS_ROOT = resolve(__dirname, '../../docs')

// ─── Content parsers — read existing docs, no new content written ─────────────

/**
 * Parse the phase summary table from user-guide/mim.md.
 * The table already exists: "| Phase | Name | Your primary job |"
 * Returns { number, name, summary } — summary becomes the tooltip text.
 */
function parsePhaseSummaries(mimContent: string) {
  const phases: { number: number; name: string; summary: string }[] = []
  const lines = mimContent.split('\n')
  let inTable = false

  for (const line of lines) {
    if (line.includes('| Phase | Name |')) { inTable = true; continue }
    if (inTable && /^\|[-| ]+\|/.test(line)) continue  // separator row
    if (inTable && line.startsWith('|')) {
      const cells = line.split('|').map(c => c.trim()).filter(Boolean)
      if (cells.length >= 3) {
        const num = parseInt(cells[0])
        if (!isNaN(num)) {
          phases.push({
            number: num,
            name: cells[1].replace(/\*\*/g, ''),
            summary: cells[2],
          })
        }
      }
    } else if (inTable && !line.startsWith('|')) {
      break  // table ended
    }
  }
  return phases
}

/**
 * Parse the phase detail sections from user-guide/mim.md.
 * "### Phase N — Name" sections → body markdown for docs viewer.
 */
function parsePhaseDetails(mimContent: string) {
  const details: Record<number, string> = {}
  const phaseRegex = /### Phase (\d+)[^\n]*\n([\s\S]*?)(?=###|\n---|\n## |$)/g
  let m: RegExpExecArray | null
  while ((m = phaseRegex.exec(mimContent)) !== null) {
    const num = parseInt(m[1])
    if (!isNaN(num)) details[num] = m[2].trim()
  }
  return details
}

/**
 * Parse alarm level rows from ALARM-LEVELS.md.
 * Table: "| Box N | severity | characteristics | response |"
 */
function parseAlarmLevels(alarmContent: string) {
  const levels: { box: number; severity: string; characteristics: string; response: string }[] = []
  const lines = alarmContent.split('\n')
  let inTable = false

  for (const line of lines) {
    if (line.includes('| Alarm Level |')) { inTable = true; continue }
    if (inTable && /^\|[-| ]+\|/.test(line)) continue
    if (inTable && line.startsWith('|')) {
      const cells = line.split('|').map(c => c.trim()).filter(Boolean)
      if (cells.length >= 4) {
        const boxMatch = cells[0].match(/Box (\d)/)
        if (boxMatch) {
          levels.push({
            box: parseInt(boxMatch[1]),
            severity: cells[1].replace(/\*\*/g, ''),
            characteristics: cells[2],
            response: cells[3],
          })
        }
      }
    } else if (inTable && !line.startsWith('|')) {
      break
    }
  }
  return levels
}

// ─── Virtual module plugin ────────────────────────────────────────────────────

function docsVirtualPlugin() {
  const VIRTUAL_ID = 'virtual:docs'
  const RESOLVED_ID = '\0virtual:docs'

  return {
    name: 'majorops-docs',

    resolveId(id: string) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },

    load(id: string) {
      if (id !== RESOLVED_ID) return

      // Scan every markdown file once during build/dev startup and expose the
      // contents to React through a virtual module. This keeps deployment
      // simple on Cloudflare Pages: no separate docs generator is required.
      const files: Record<string, string> = {}

      function scan(dir: string) {
        if (!existsSync(dir)) return
        for (const entry of readdirSync(dir)) {
          const full = join(dir, entry)
          const stat = statSync(full)
          if (stat.isDirectory()) {
            scan(full)
          } else if (entry.endsWith('.md')) {
            const key = relative(DOCS_ROOT, full).replace(/\\/g, '/')
            files[key] = readFileSync(full, 'utf-8')
          }
        }
      }
      scan(DOCS_ROOT)

      // ── Parse phase data from existing mim.md ─────────────────────────────
      const mimPath = join(DOCS_ROOT, 'user-guide', 'mim.md')
      const mimContent = existsSync(mimPath) ? readFileSync(mimPath, 'utf-8') : ''
      const phaseSummaries = parsePhaseSummaries(mimContent)
      const phaseDetails  = parsePhaseDetails(mimContent)

      const phases = phaseSummaries.map(p => ({
        ...p,
        detail: phaseDetails[p.number] ?? '',
      }))

      // ── Parse alarm levels from existing ALARM-LEVELS.md ──────────────────
      const alarmPath = join(DOCS_ROOT, 'ALARM-LEVELS.md')
      const alarmContent = existsSync(alarmPath) ? readFileSync(alarmPath, 'utf-8') : ''
      const alarmLevels = parseAlarmLevels(alarmContent)

      // ── OpenAPI spec ──────────────────────────────────────────────────────
      const openapiPath = join(DOCS_ROOT, 'api-reference', 'openapi.yaml')
      const openapiYaml = existsSync(openapiPath)
        ? readFileSync(openapiPath, 'utf-8')
        : null

      return [
        `export default ${JSON.stringify(files, null, 0)}`,
        `export const phases = ${JSON.stringify(phases)}`,
        `export const alarmLevels = ${JSON.stringify(alarmLevels)}`,
        `export const openapiYaml = ${JSON.stringify(openapiYaml)}`,
      ].join('\n')
    },
  }
}

export default defineConfig({
  plugins: [react(), docsVirtualPlugin()],
})
