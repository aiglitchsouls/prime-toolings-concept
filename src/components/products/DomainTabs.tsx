import { useEffect, useState, type KeyboardEvent } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

import { DomainGlyph } from '@/components/schematics/DomainGlyph'
import { DOMAINS, type DomainId } from '@/data/techTransfer'
import { pad } from '@/lib/format'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/utils'

const isDomain = (value: string): value is DomainId => DOMAINS.some((d) => d.id === value)

/** Accessible tablist of the four ToT domains. `#ew`-style links select and land on a tab. */
export function DomainTabs() {
  const { hash } = useLocation()
  const [active, setActive] = useState<DomainId>('aerospace')
  const domain = DOMAINS.find((d) => d.id === active) ?? DOMAINS[0]

  useEffect(() => {
    const id = hash.slice(1)
    if (isDomain(id)) setActive(id)
  }, [hash])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
    if (!step) return
    event.preventDefault()
    const next = DOMAINS[(DOMAINS.findIndex((d) => d.id === active) + step + DOMAINS.length) % DOMAINS.length]
    setActive(next.id)
    document.getElementById(next.id)?.focus()
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
      <div role="tablist" aria-label="Technology domains" aria-orientation="vertical" className="flex flex-col gap-px bg-bone/10" onKeyDown={onKeyDown}>
        {DOMAINS.map((item, i) => {
          const isActive = item.id === active
          return (
            <button
              key={item.id}
              id={item.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`${item.id}-panel`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(item.id)}
              className={cn(
                'group relative flex min-h-[72px] cursor-pointer items-center justify-between gap-4 px-5 text-left transition-colors duration-300',
                isActive ? 'bg-hull text-bone' : 'bg-void text-ash hover:bg-hull/60 hover:text-bone',
              )}
            >
              {isActive ? <motion.span layoutId="domain-bar" className="absolute inset-y-0 left-0 w-[3px] bg-ignition" /> : null}
              <span className="flex items-center gap-4">
                <span className="mono text-[10px] text-ignition">{pad(i + 1)}</span>
                <span className="display-soft text-[20px]">{item.title}</span>
              </span>
              <span className="mono text-[10px] text-dim">{pad(item.items.length)}</span>
            </button>
          )
        })}
      </div>

      <div id={`${domain.id}-panel`} role="tabpanel" aria-labelledby={domain.id} className="ticks relative min-h-[520px] bg-hull p-6 sm:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={domain.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
          >
            <div className="flex items-start justify-between gap-6">
              <h3 className="display text-[clamp(28px,3.2vw,46px)]">{domain.title}</h3>
              <DomainGlyph domain={domain.id} className="size-20 shrink-0 text-bone/60" />
            </div>
            <ol className="mt-10 grid gap-x-10 sm:grid-cols-2">
              {domain.items.map((item, i) => (
                <motion.li
                  key={item}
                  className="flex gap-4 border-t border-bone/10 py-4 text-[15px] text-bone/90"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 + i * 0.035, ease: EASE_OUT }}
                >
                  <span className="mono pt-1 text-[10px] text-dim">{pad(i + 1)}</span>
                  {item}
                </motion.li>
              ))}
            </ol>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
