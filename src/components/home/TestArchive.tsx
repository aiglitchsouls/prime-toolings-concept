import { useRef } from 'react'

import { Photo } from '@/components/ui/Photo'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { TEST_ARCHIVE } from '@/data/media'
import { pad } from '@/lib/format'
import { useDragScroll } from '@/lib/useDragScroll'

/** Filmstrip of the client's own test photography, duotoned into one look. */
export function TestArchive() {
  const stripRef = useRef<HTMLUListElement>(null)
  useDragScroll(stripRef)

  return (
    <section className="relative py-28 sm:py-36" aria-labelledby="archive-title">
      <div className="page-x flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <SectionLabel index="04" tone="ignition">
            Test archive
          </SectionLabel>
          <SplitHeading
            id="archive-title"
            lines={['Real hardware.', '*Real fire.*']}
            className="display mt-6 text-[clamp(34px,5.4vw,80px)]"
          />
        </div>
        <p className="max-w-sm text-ash">
          No renders in this strip. These are firings, rigs and hardware from Prime Toolings’ own test campaigns. Drag
          to scrub, hover for full color.
        </p>
      </div>

      <ul
        ref={stripRef}
        tabIndex={0}
        aria-label="Test photographs, scroll horizontally"
        data-cursor="Drag"
        className="no-scrollbar mt-16 flex cursor-grab gap-4 overflow-x-auto overscroll-x-contain px-5 pb-2 data-[dragging=true]:cursor-grabbing
          data-[dragging=true]:select-none sm:gap-6 sm:px-8 lg:px-12"
      >
        {TEST_ARCHIVE.map((shot, i) => (
          <li key={shot.photo} className="group w-[72vw] shrink-0 sm:w-[340px] lg:w-[380px]">
            <Photo
              photo={shot.photo}
              alt={shot.label}
              width={760}
              height={940}
              className="aspect-[38/47] w-full"
              imgClassName="pointer-events-none select-none transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div className="mt-4 flex items-baseline justify-between gap-4">
              <p className="text-[15px] text-bone">{shot.label}</p>
              <p className="mono shrink-0 text-[9px] text-dim">
                {shot.kind} · {pad(i + 1)}/{pad(TEST_ARCHIVE.length)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
