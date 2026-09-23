import { cn } from '@/lib/utils'

// Typographic stand-in for the client's logo (stacked "Prime" over a red TOOLINGS bar).
// PLACEHOLDER until we get the vector logo from Prime Toolings.
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex flex-col items-start leading-none', className)}>
      <span className="font-display text-[22px] font-extrabold uppercase tracking-[-0.02em] text-bone">Prime</span>
      <span className="mt-[4px] bg-ignition px-[6px] py-[3px] text-[8px] font-bold uppercase tracking-[0.42em] text-void">
        Toolings
      </span>
    </span>
  )
}
