/// <reference types="vite/client" />

declare module 'virtual:docs' {
  /** All docs/*.md files keyed by path relative to the docs root.
   *  e.g. 'index.md', 'GLOSSARY.md', 'philosophy/PHILOSOPHY.md'
   */
  const files: Record<string, string>
  export default files

  /** Raw YAML text of docs/api-reference/openapi.yaml, or null if not found. */
  export const openapiYaml: string | null

  /** Phase definitions parsed from docs/user-guide/mim.md.
   *  summary = "Your primary job" column from the phase table.
   *  detail  = full body of the ### Phase N section (markdown).
   */
  export const phases: Array<{
    number: number
    name: string
    summary: string
    detail: string
  }>

  /** Alarm levels parsed from docs/ALARM-LEVELS.md. */
  export const alarmLevels: Array<{
    box: number
    severity: string
    characteristics: string
    response: string
  }>
}
