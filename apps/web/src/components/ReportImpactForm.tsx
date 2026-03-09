import { useState } from 'react'
import { AlertTriangle, Send } from 'lucide-react'

export function ReportImpactForm() {
  const [form, setForm] = useState({
    appId: '',
    description: '',
    email: '',
    validatorContact: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="border border-ops-green/30 bg-ops-green/5 px-5 py-6 text-center">
        <div className="font-heading text-sm font-700 uppercase tracking-wide text-ops-green mb-1">
          ✓ Impact Report Submitted
        </div>
        <p className="font-body text-xs text-ops-dim">
          Your report has been logged. The incident team will follow up with your validator contact.
        </p>
      </div>
    )
  }

  return (
    <div className="border border-ops-amber/20 bg-ops-surface">
      <div className="flex items-center gap-2 border-b border-ops-border px-5 py-3">
        <AlertTriangle size={14} strokeWidth={1.5} className="text-ops-amber" />
        <div>
          <div className="font-heading text-sm font-700 uppercase tracking-wide text-ops-amber">
            Report Impact to Your Application
          </div>
          <div className="font-body text-xs text-ops-dim">
            Experiencing issues with your application? Help us understand the scope by reporting your impact.
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
        <div>
          <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-ops-dim">
            Application ID <span className="text-ops-red">*</span>
          </label>
          <input
            required
            value={form.appId}
            onChange={e => setForm(f => ({ ...f, appId: e.target.value }))}
            placeholder="e.g., app-12345 or My Production App"
            className="w-full border border-ops-border bg-ops-muted px-3 py-2.5 font-body text-sm text-ops-text placeholder-ops-dim/40 outline-none focus:border-ops-red/50"
          />
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-ops-dim">
            Impact Description <span className="text-ops-red">*</span>
          </label>
          <textarea
            required
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Describe the issues you're experiencing..."
            rows={4}
            className="w-full resize-none border border-ops-border bg-ops-muted px-3 py-2.5 font-body text-sm text-ops-text placeholder-ops-dim/40 outline-none focus:border-ops-red/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-ops-dim">
              Your Email (optional)
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="your.email@company.com"
              className="w-full border border-ops-border bg-ops-muted px-3 py-2.5 font-body text-sm text-ops-text placeholder-ops-dim/40 outline-none focus:border-ops-red/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-ops-dim">
              Validator Contact <span className="text-ops-red">*</span>
            </label>
            <input
              required
              value={form.validatorContact}
              onChange={e => setForm(f => ({ ...f, validatorContact: e.target.value }))}
              placeholder="Email or name of validator"
              className="w-full border border-ops-border bg-ops-muted px-3 py-2.5 font-body text-sm text-ops-text placeholder-ops-dim/40 outline-none focus:border-ops-red/50"
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 bg-ops-amber py-3 font-heading text-sm font-700 uppercase tracking-widest text-ops-bg transition-colors hover:bg-ops-amber/90"
        >
          <Send size={14} strokeWidth={1.5} />
          Submit Impact Report
        </button>
      </form>
    </div>
  )
}
