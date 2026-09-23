import { cn } from '@/lib/utils'

/** Small uppercase section label with an ignition rule. */
export function SectionLabel({ children, className }: { children: string; className?: string }) {
  return (
    <p className={cn('eyebrow flex items-center gap-3 text-ash', className)}>
      <span className="h-px w-6 bg-ignition" aria-hidden />
      {children}
    </p>
  )
}
