import { WordmarkLogo } from '../components/WordmarkLogo'
import { LogIn, Shield } from 'lucide-react'

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ops-bg px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <WordmarkLogo wartime={false} size="lg" href="/login" />
          <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-ops-dim">
            Major Incident Command Platform
          </p>
        </div>

        {/* Login card */}
        <div className="border border-ops-border bg-ops-surface px-8 py-8">
          <div className="mb-6 flex items-center gap-2">
            <Shield size={14} strokeWidth={1.5} className="text-ops-red" />
            <h1 className="font-heading text-sm font-700 uppercase tracking-widest text-ops-text">
              MIM Access
            </h1>
          </div>

          <p className="mb-6 font-body text-xs leading-relaxed text-ops-dim">
            Access is restricted to authorized Major Incident Managers and operations staff.
            Sign in with your organization account.
          </p>

          {/* Cloudflare Access placeholder — replace href with CF Access URL */}
          <a
            href="/admin/incidents/1"  // temp: skip to admin view
            className="flex w-full items-center justify-center gap-2 bg-ops-red py-3 font-heading text-sm font-700 uppercase tracking-widest text-white transition-colors hover:bg-ops-red-hi"
          >
            <LogIn size={14} strokeWidth={1.5} />
            Sign In with SSO
          </a>

          <div className="mt-4 text-center">
            <p className="font-mono text-[9px] text-ops-dim">
              Protected by Cloudflare Access · Zero Trust
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="font-mono text-[10px] text-ops-dim hover:text-ops-red transition-colors">
            ← Back to status page
          </a>
        </div>
      </div>
    </div>
  )
}
