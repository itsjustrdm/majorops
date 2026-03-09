interface CardProps {
  children: React.ReactNode
  className?: string
  accent?: 'red' | 'amber' | 'green' | 'blue' | 'none'
  onClick?: () => void
}

export function Card({ children, className = '', accent = 'none', onClick }: CardProps) {
  const accentBorder = {
    red:   'border-l-2 border-l-ops-red',
    amber: 'border-l-2 border-l-ops-amber',
    green: 'border-l-2 border-l-ops-green',
    blue:  'border-l-2 border-l-ops-blue',
    none:  '',
  }

  return (
    <div
      className={`border border-ops-border bg-ops-surface ${accentBorder[accent]} ${onClick ? 'cursor-pointer transition-colors hover:border-ops-red/40' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export function CardSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`border-t border-ops-border ${className}`}>{children}</div>
}

export function SectionLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`font-heading text-[10px] font-700 uppercase tracking-widest text-ops-dim ${className}`}>
      {children}
    </div>
  )
}
