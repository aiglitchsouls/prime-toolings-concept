import { useEffect, useRef } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { Link } from 'react-router-dom'

import { EngineSchematic } from '@/components/schematics/EngineSchematic'
import { Photo } from '@/components/ui/Photo'
import type { Product } from '@/data/products'
import { EASE_OUT } from '@/lib/motion'
import { lenisRef } from '@/lib/store'
import { useMediaQuery } from '@/lib/useMediaQuery'

import { familyLabel, rangeLabel } from './ProductCard'

interface ProductDrawerProps {
  product: Product | null
  onClose: () => void
}

function useDrawerBehavior(isOpen: boolean, onClose: () => void) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!isOpen) return
    const previous = document.activeElement as HTMLElement | null
    lenisRef.get()?.stop()
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      lenisRef.get()?.start()
      previous?.focus()
    }
  }, [isOpen, onClose])
  return closeRef
}

function Specs({ product }: { product: Product }) {
  const rows = [
    { label: product.frequency ? 'Pulse rate' : 'Thrust class', value: rangeLabel(product) },
    { label: 'Family', value: familyLabel(product) },
    { label: 'Builds', value: 'Custom to mission' },
    { label: 'Line', value: 'Aeroignite Systems' },
  ]
  return (
    <dl className="grid grid-cols-2 gap-px bg-bone/10 [&>*:last-child:nth-child(odd)]:col-span-2">
      {rows.map((row) => (
        <div key={row.label} className="bg-hull p-4">
          <dt className="eyebrow text-[10px] text-dim">{row.label}</dt>
          <dd className="mt-1 text-[15px] text-bone">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Side sheet (bottom sheet on phones) with a system's spec summary and a datasheet request. */
export function ProductDrawer({ product, onClose }: ProductDrawerProps) {
  const closeRef = useDrawerBehavior(Boolean(product), onClose)
  const isWide = useMediaQuery('(min-width: 640px)')
  const hidden = isWide ? { x: '100%', y: 0 } : { x: 0, y: '100%' }

  return (
    <AnimatePresence>
      {product ? (
        <div className="fixed inset-0 z-menu" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
          <motion.button
            type="button"
            aria-label="Close spec sheet"
            className="absolute inset-0 cursor-default bg-void/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            data-lenis-prevent
            className="absolute inset-x-0 bottom-0 max-h-[88svh] overflow-y-auto border-t border-bone/10 bg-hull
              sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[560px] sm:border-l sm:border-t-0"
            initial={hidden}
            animate={{ x: 0, y: 0 }}
            exit={hidden}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          >
            <div className="sticky top-0 z-[1] flex items-center justify-between border-b border-bone/10 bg-hull/90 px-6 py-4 backdrop-blur">
              <span className="eyebrow text-[11px] text-ignition">Spec sheet · {familyLabel(product)}</span>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="grid size-11 cursor-pointer place-items-center text-ash transition-colors hover:text-bone"
                aria-label="Close"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <div className="space-y-8 p-6 sm:p-8">
              <h2 id="drawer-title" className="display text-[clamp(30px,4vw,44px)]">
                {product.name}
              </h2>
              <div className="ticks flow-live bg-void p-6">
                <EngineSchematic kind={product.schematic} className="text-bone/70" />
              </div>
              <p className="text-ash">{product.summary}</p>
              <Specs product={product} />
              {product.photo ? (
                <figure>
                  <Photo photo={product.photo} alt={`${product.name}, Prime Toolings hardware`} width={1000} height={640} className="aspect-[25/16] w-full" />
                  <figcaption className="eyebrow mt-2 text-[10px] text-dim">Hardware photo · Prime Toolings</figcaption>
                </figure>
              ) : null}
              <Link to={`/contact?topic=propulsion&system=${product.id}`} className="btn-ignite w-full">
                Request the datasheet <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
