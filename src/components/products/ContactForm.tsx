import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Check } from 'lucide-react'

import { ConceptBadge } from '@/components/ui/Badges'
import { BRAND } from '@/config/brand'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/utils'

export const TOPICS = [
  { id: 'propulsion', label: 'Propulsion systems' },
  { id: 'services', label: 'Engineering services' },
  { id: 'testing', label: 'Static fire testing' },
  { id: 'tot', label: 'Transfer of tech & consultation' },
  { id: 'academy', label: 'Academy & internships' },
  { id: 'other', label: 'Something else' },
] as const

type Errors = Partial<Record<'email' | 'message', string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(data: FormData): Errors {
  const errors: Errors = {}
  if (!EMAIL.test(String(data.get('email') ?? '').trim())) errors.email = 'Enter an email address we can reply to.'
  if (String(data.get('message') ?? '').trim().length < 10) errors.message = 'Tell us a little more (10 characters or more).'
  return errors
}

const FIELD =
  'w-full border-b border-bone/20 bg-transparent py-3 text-[16px] text-bone placeholder:text-dim transition-colors duration-300 focus:border-ignition focus:outline-none aria-[invalid=true]:border-ignition'

function Field({ label, error, children, htmlFor }: { label: string; error?: string; children: ReactNode; htmlFor: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mono text-[10px] text-ash">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-2 text-[13px] text-flare">
          {error}
        </p>
      ) : null}
    </div>
  )
}

interface ContactFormProps {
  topic: string
  message: string
  context?: string
}

export function ContactForm({ topic, message, context }: ContactFormProps) {
  const id = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const found = validate(new FormData(event.currentTarget))
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    setStatus('sending')
    window.setTimeout(() => setStatus('sent'), 900)
  }

  return (
    <div className="ticks relative bg-hull p-6 sm:p-10">
      <AnimatePresence mode="wait">
        {status === 'sent' ? (
          <motion.div key="sent" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE_OUT }} role="status">
            <span className="grid size-14 place-items-center border border-nominal text-nominal">
              <Check className="size-6" aria-hidden />
            </span>
            <p className="display mt-8 text-[clamp(30px,3.4vw,44px)]">Transmission logged.</p>
            <p className="mt-4 max-w-md text-ash">
              This is a design concept, so nothing was sent. On the live site this form goes straight to {BRAND.email}.
            </p>
            <ConceptBadge className="mt-6">Concept form</ConceptBadge>
          </motion.div>
        ) : (
          <motion.form key="form" ref={formRef} noValidate onSubmit={onSubmit} className="space-y-8" exit={{ opacity: 0, y: -12 }}>
            {context ? <p className="mono border border-ignition/30 bg-ignition/[0.06] px-3 py-2 text-[10px] text-ignition">Re: {context}</p> : null}
            <div className="grid gap-8 sm:grid-cols-2">
              <Field label="Full name" htmlFor={`${id}-name`}>
                <input id={`${id}-name`} name="name" autoComplete="name" className={FIELD} placeholder="Your name" />
              </Field>
              <Field label="Email address *" htmlFor={`${id}-email`} error={errors.email}>
                <input
                  id={`${id}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? `${id}-email-error` : undefined}
                  className={FIELD}
                  placeholder="you@organization.com"
                />
              </Field>
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              <Field label="Organization" htmlFor={`${id}-org`}>
                <input id={`${id}-org`} name="organization" autoComplete="organization" className={FIELD} placeholder="Company, lab or institute" />
              </Field>
              <Field label="Enquiry" htmlFor={`${id}-topic`}>
                <select id={`${id}-topic`} name="topic" defaultValue={topic} className={cn(FIELD, 'cursor-pointer bg-hull')}>
                  {TOPICS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Message *" htmlFor={`${id}-message`} error={errors.message}>
              <textarea
                id={`${id}-message`}
                name="message"
                rows={5}
                required
                defaultValue={message}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? `${id}-message-error` : undefined}
                className={cn(FIELD, 'resize-none')}
                placeholder="Thrust class, timeline, test requirements…"
              />
            </Field>
            <button type="submit" disabled={status === 'sending'} className="btn-ignite w-full disabled:opacity-70 sm:w-auto" data-cursor="Transmit">
              {status === 'sending' ? 'Transmitting…' : 'Send message'} <ArrowUpRight className="size-4" aria-hidden />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
