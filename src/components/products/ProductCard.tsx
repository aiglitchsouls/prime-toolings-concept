import type { Ref } from 'react'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

import { EngineSchematic } from '@/components/schematics/EngineSchematic'
import { Units } from '@/components/ui/Units'
import { FAMILIES, type Product } from '@/data/products'
import { formatForceRange, formatHzRange, pad, toDial } from '@/lib/format'
import { EASE_OUT } from '@/lib/motion'

export const familyLabel = (product: Product) => FAMILIES.find((f) => f.id === product.family)?.label ?? ''

export function rangeLabel(product: Product) {
  if (product.thrust) return formatForceRange(product.thrust)
  if (product.frequency) return formatHzRange(product.frequency)
  return 'Custom to spec'
}

function RangeBar({ product }: { product: Product }) {
  if (!product.thrust) return <div className="h-[3px] w-full bg-bone/[0.06]" />
  const left = toDial(product.thrust.min) * 100
  const width = (toDial(product.thrust.max) - toDial(product.thrust.min)) * 100
  return (
    <div className="relative h-[3px] w-full bg-bone/[0.06]">
      <div
        className="absolute inset-y-0 bg-bone/40 transition-colors duration-500 group-hover:bg-ignition"
        style={{ left: `${left}%`, width: `${width}%` }}
      />
    </div>
  )
}

interface ProductCardProps {
  product: Product
  index: number
  onOpen: (product: Product) => void
  ref?: Ref<HTMLLIElement>
}

export function ProductCard({ product, index, onOpen, ref }: ProductCardProps) {
  return (
    <motion.li
      ref={ref}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.55, ease: EASE_OUT }}
      className="border-b border-r border-bone/10 bg-void"
    >
      <button
        type="button"
        onClick={() => onOpen(product)}
       
        className="group relative flex h-full w-full cursor-pointer flex-col p-6 text-left transition-colors duration-500 hover:bg-hull sm:p-7"
      >
        <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-ignition transition-transform duration-700 ease-out group-hover:scale-x-100" />
        <div className="flex items-center justify-between">
          <span className="eyebrow text-[11px] text-ignition">{pad(index + 1)}</span>
          <span className="eyebrow text-[11px] text-dim">{familyLabel(product)}</span>
        </div>
        <EngineSchematic kind={product.schematic} className="my-6 transition-colors duration-500 group-hover:text-bone/80" />
        <h3 className="display-soft text-[22px] text-bone">{product.name}</h3>
        <p className="eyebrow mt-2 text-ash group-hover:text-ignition">
          <Units text={rangeLabel(product)} />
        </p>
        <div className="mt-4">
          <RangeBar product={product} />
        </div>
        <p className="mt-5 flex-1 text-[15px] text-ash">{product.summary}</p>
        <span className="eyebrow mt-6 inline-flex items-center gap-2 text-[11px] text-bone">
          Spec sheet
          <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </span>
      </button>
    </motion.li>
  )
}
