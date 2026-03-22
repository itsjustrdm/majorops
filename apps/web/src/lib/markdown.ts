/**
 * MajorOps lightweight markdown parser.
 * Zero dependencies — handles all constructs used in the docs.
 *
 * Supported:
 *   - YAML frontmatter (stripped)
 *   - ATX headings  # through ######
 *   - Blockquotes   > ...
 *   - Fenced code   ``` ... ```
 *   - Tables        | col | col |
 *   - Unordered lists  - / *
 *   - Ordered lists    1. 2. 3.
 *   - Horizontal rules ---
 *   - Admonitions         !!! type "title"
 *   - Inline: **bold** *italic* `code` ~~strike~~ [link](url)
 *   - --8<-- snippet directives (stripped)
 */

// ─── Helpers ──────────────────────────────────────────────────────────────────

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function stripFrontmatter(text: string): string {
  if (!text.startsWith('---')) return text
  const end = text.indexOf('\n---', 3)
  if (end === -1) return text
  return text.slice(end + 4).trimStart()
}

// ─── Inline parser ────────────────────────────────────────────────────────────

export function parseInline(raw: string): string {
  // Strip docs-theme icon references (:material-*: :octicons-*: etc.)
  let s = raw.replace(/:[\w-]+:/g, '')

  // Escape HTML first, then reintroduce markdown constructs
  s = escapeHtml(s)

  // Bold + italic (***text***)
  s = s.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
  // Bold (**text**)
  s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  // Italic (*text* or _text_)
  s = s.replace(/\*((?!\s).*?(?<!\s))\*/g, '<em>$1</em>')
  s = s.replace(/_((?!\s).*?(?<!\s))_/g, '<em>$1</em>')
  // Strikethrough (~~text~~)
  s = s.replace(/~~(.*?)~~/g, '<del>$1</del>')
  // Inline code (`code`)
  s = s.replace(/`([^`]+)`/g, '<code class="doc-inline-code">$1</code>')
  // Links with optional attribute block: [label](url){ .class target="_blank" }
  // We parse this BEFORE HTML-escaping the attribute block, so we need to work
  // on the already-escaped string. We match the escaped braces too.
  s = s.replace(
    /\[([^\]]+)\]\(([^)]+)\)(?:\{([^}]*)\})?/g,
    (_, label, href, attrs) => {
      const isExternal = href.startsWith('http') || (attrs && /target\s*=\s*["']?_blank/.test(attrs))
      const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''
      // Check for button class
      const isButton = attrs && /md-button/.test(attrs)
      const cls = isButton ? 'doc-link doc-link--button' : 'doc-link'
      return `<a href="${href}" class="${cls}"${target}>${label}</a>`
    }
  )

  return s
}

// ─── Extract page title from h1 ───────────────────────────────────────────────

export function extractTitle(raw: string): string {
  const stripped = stripFrontmatter(raw)
  const match = stripped.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : ''
}

// ─── Block parser ─────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')
}

export function parseMarkdown(raw: string): string {
  const text = stripFrontmatter(raw)
  const lines = text.split('\n')
  const out: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Skip snippet include directives from older docs content
    if (line.trim().startsWith('--8<--')) { i++; continue }

    // ── Fenced code block ───────────────────────────────────────────────
    if (line.trimStart().startsWith('```')) {
      const lang = line.trimStart().slice(3).trim().split(' ')[0]
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      const escaped = escapeHtml(codeLines.join('\n'))
      out.push(
        `<pre class="doc-pre"><code class="doc-code${lang ? ` lang-${lang}` : ''}">${escaped}</code></pre>`
      )
      i++
      continue
    }

    // ── Horizontal rule ─────────────────────────────────────────────────
    if (/^(\s*[-*_]\s*){3,}$/.test(line) && line.trim().length >= 3) {
      out.push('<hr class="doc-hr" />')
      i++
      continue
    }

    // ── ATX Heading ─────────────────────────────────────────────────────
    const hMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (hMatch) {
      const level = hMatch[1].length
      const content = parseInline(hMatch[2].replace(/\s+#+\s*$/, ''))
      const id = slugify(hMatch[2].replace(/\s+#+\s*$/, ''))
      out.push(`<h${level} id="${id}" class="doc-h${level}">${content}</h${level}>`)
      i++
      continue
    }

    // ── Admonition: !!! type "title" ────────────────────────────────────
    const admonMatch = line.match(/^(!!!|\?\?\?)\s+(\w+)(?:\s+"([^"]*)")?/)
    if (admonMatch) {
      const type = admonMatch[2].toLowerCase()
      const title = admonMatch[3] ?? (type.charAt(0).toUpperCase() + type.slice(1))
      const bodyLines: string[] = []
      i++
      while (i < lines.length && (lines[i].startsWith('    ') || lines[i] === '')) {
        bodyLines.push(lines[i].startsWith('    ') ? lines[i].slice(4) : lines[i])
        i++
      }
      // Recursively parse the body
      const bodyHtml = parseMarkdown('---\n' + bodyLines.join('\n'))
      out.push(
        `<div class="doc-admonition doc-admonition--${type}">` +
        `<div class="doc-admonition__title">${title}</div>` +
        `<div class="doc-admonition__body">${bodyHtml}</div>` +
        `</div>`
      )
      continue
    }

    // ── Table ────────────────────────────────────────────────────────────
    if (line.includes('|') && i + 1 < lines.length && /^\|?[\s:|-]+\|/.test(lines[i + 1])) {
      const parseRow = (r: string) =>
        r.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1 || arr.length === 1)
      const headers = parseRow(line)
      i += 2 // skip separator row
      const rows: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(
          '<tr>' +
          parseRow(lines[i]).map(c => `<td class="doc-td">${parseInline(c)}</td>`).join('') +
          '</tr>'
        )
        i++
      }
      out.push(
        `<div class="doc-table-wrap"><table class="doc-table">` +
        `<thead><tr>${headers.map(h => `<th class="doc-th">${parseInline(h)}</th>`).join('')}</tr></thead>` +
        `<tbody>${rows.join('')}</tbody>` +
        `</table></div>`
      )
      continue
    }

    // ── Unordered list ───────────────────────────────────────────────────
    if (/^(\s*)[-*+]\s/.test(line)) {
      const baseIndent = line.match(/^(\s*)/)![1].length
      const items: string[] = []
      while (
        i < lines.length &&
        (/^(\s*)[-*+]\s/.test(lines[i]) &&
          lines[i].match(/^(\s*)/)![1].length === baseIndent)
      ) {
        items.push(`<li class="doc-li">${parseInline(lines[i].replace(/^\s*[-*+]\s/, ''))}</li>`)
        i++
        // Absorb continuation lines (indented, non-list)
        while (i < lines.length && lines[i].startsWith('  ') && !/^\s*[-*+]\s/.test(lines[i]) && !/^\s*\d+\.\s/.test(lines[i])) {
          i++
        }
      }
      out.push(`<ul class="doc-ul">${items.join('')}</ul>`)
      continue
    }

    // ── Ordered list ─────────────────────────────────────────────────────
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(`<li class="doc-li">${parseInline(lines[i].replace(/^\d+\.\s/, ''))}</li>`)
        i++
        while (i < lines.length && lines[i].startsWith('   ') && !/^\d+\.\s/.test(lines[i])) {
          i++
        }
      }
      out.push(`<ol class="doc-ol">${items.join('')}</ol>`)
      continue
    }

    // ── Blockquote ────────────────────────────────────────────────────────
    if (line.startsWith('>')) {
      const qLines: string[] = []
      while (i < lines.length && lines[i].startsWith('>')) {
        qLines.push(lines[i].slice(1).trim())
        i++
      }
      out.push(`<blockquote class="doc-blockquote">${parseInline(qLines.join(' '))}</blockquote>`)
      continue
    }

    // ── Empty line ────────────────────────────────────────────────────────
    if (line.trim() === '') { i++; continue }

    // ── Paragraph ─────────────────────────────────────────────────────────
    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trimStart().startsWith('#') &&
      !lines[i].trimStart().startsWith('>') &&
      !lines[i].trimStart().startsWith('```') &&
      !/^\s*[-*+]\s/.test(lines[i]) &&
      !/^\d+\.\s/.test(lines[i]) &&
      !lines[i].trim().startsWith('!!!') &&
      !lines[i].trim().startsWith('???') &&
      !lines[i].trim().startsWith('--8<--') &&
      !/^(\s*[-*_]\s*){3,}$/.test(lines[i])
    ) {
      paraLines.push(lines[i].trim())
      i++
    }
    if (paraLines.length > 0) {
      out.push(`<p class="doc-p">${parseInline(paraLines.join(' '))}</p>`)
    }
  }

  return out.join('\n')
}
