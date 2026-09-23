import type { ReactNode } from 'react'

import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { cn } from '@/lib/utils'

interface ArrowLinkProps {
  to: string
  children: ReactNode
  className?: string
}

/** Text link with a circled arrow that fills on hover. */
export function ArrowLink({ to, children, className }: ArrowLinkProps) {
  return (
    <Link to={to} className={cn('group/arrow eyebrow inline-flex items-center gap-3 text-bone', className)}>
      {children}
      <span
        className="grid size-9 place-items-center rounded-full border border-bone/30 transition-colors duration-300
          group-hover/arrow:border-ignition group-hover/arrow:bg-ignition group-hover/arrow:text-void"
        aria-hidden
      >
        <ArrowRight className="size-3.5 transition-transform duration-300 group-hover/arrow:translate-x-0.5" />
      </span>
    </Link>
  )
}
