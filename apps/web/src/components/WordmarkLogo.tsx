interface WordmarkLogoProps {
  wartime?: boolean       // true = active P1/P2 incidents
  size?: 'sm' | 'md' | 'lg'
  href?: string
}

export function WordmarkLogo({ wartime = false, size = 'md', href = '/' }: WordmarkLogoProps) {
  const sizes = {
    sm:  { prompt: 'text-sm',  major: 'text-base',  ops: 'text-sm'  },
    md:  { prompt: 'text-lg',  major: 'text-xl',    ops: 'text-base' },
    lg:  { prompt: 'text-2xl', major: 'text-3xl',   ops: 'text-2xl' },
  }
  const s = sizes[size]

  const promptColor = wartime ? 'text-ops-red animate-blink' : 'text-[#008800]'
  const majorColor  = wartime ? 'text-ops-red'   : 'text-[#CCCCCC]'
  const opsColor    = wartime ? 'text-white'      : 'text-[#00CC00]'

  const content = (
    <span className="inline-flex items-baseline gap-0 font-body">
      <span className={`${s.prompt} ${promptColor} font-mono font-700 mr-0.5`}>›</span>
      <span className={`${s.major} ${majorColor} font-display font-900 tracking-widest uppercase`}>MAJOR</span>
      <span className={`${s.ops}   ${opsColor}   font-mono   font-700 tracking-tight lowercase`}>ops</span>
    </span>
  )

  return (
    <a href={href} className="inline-block no-underline hover:opacity-90 transition-opacity">
      {content}
    </a>
  )
}
