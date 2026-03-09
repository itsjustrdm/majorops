import { Phone } from 'lucide-react'

interface BridgeBannerProps {
  bridgeUrl: string | null
}

export function BridgeBanner({ bridgeUrl }: BridgeBannerProps) {
  if (!bridgeUrl) return null

  return (
    <div className="flex items-center justify-between border border-ops-green/30 bg-ops-green/5 px-5 py-4">
      <div className="flex items-center gap-3">
        <Phone size={18} strokeWidth={1.5} className="text-ops-green" />
        <div>
          <div className="font-heading text-sm font-700 uppercase tracking-wide text-ops-green">
            Recovery Bridge Active
          </div>
          <div className="font-body text-xs text-ops-dim">
            Join the incident response call to collaborate with the team
          </div>
        </div>
      </div>
      <a
        href={bridgeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 border border-ops-green bg-ops-green px-5 py-2 font-heading text-sm font-700 uppercase tracking-widest text-ops-bg transition-colors hover:bg-ops-green/90"
      >
        <Phone size={14} strokeWidth={1.5} />
        Join Bridge
      </a>
    </div>
  )
}
