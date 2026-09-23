import { Crew } from '@/components/home/Crew'
import { MetaList, PageHero } from '@/components/ui/PageHero'
import { Photo } from '@/components/ui/Photo'
import { Reveal } from '@/components/ui/Reveal'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { ABOUT, BRAND, FACILITIES } from '@/config/brand'
import { pad } from '@/lib/format'

function VisionMission() {
  return (
    <section className="page-x grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20" aria-labelledby="vision-title">
      <div>
        <SectionLabel index="05.1" tone="ignition">
          Vision
        </SectionLabel>
        <Reveal>
          <p id="vision-title" className="display-soft mt-8 text-[clamp(26px,2.8vw,40px)] text-bone">
            {ABOUT.vision}
          </p>
        </Reveal>
      </div>
      <div>
        <SectionLabel index="05.2">Mission</SectionLabel>
        <ol className="mt-8 border-b border-bone/10">
          {ABOUT.mission.map((item, i) => (
            <li key={item.title} className="grid gap-2 border-t border-bone/10 py-6 sm:grid-cols-[180px_1fr] sm:gap-8">
              <p className="flex items-baseline gap-3">
                <span className="mono text-[10px] text-ignition">{pad(i + 1)}</span>
                <span className="display-soft text-[22px] text-bone">{item.title}</span>
              </p>
              <p className="text-ash">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Facilities() {
  return (
    <section className="page-x pt-28" aria-labelledby="facilities-title">
      <SectionLabel index="05.3" tone="ignition">
        Facilities
      </SectionLabel>
      <SplitHeading
        id="facilities-title"
        lines={[`${BRAND.facilities} units.`, '*One supply chain.*']}
        className="display mt-6 text-[clamp(34px,4.4vw,64px)]"
      />
      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <Reveal>
          <Photo
            photo="facilityBoard"
            alt="Prime Toolings facilities: machining units, design office, assembly hall and material stores"
            width={1200}
            height={848}
            className="aspect-[1200/848] w-full"
          />
          <p className="mono mt-3 text-[9px] text-dim">Units 1–6 · Bengaluru · hover for color</p>
        </Reveal>
        <ul className="grid gap-px self-start bg-bone/10">
          {FACILITIES.map((facility) => (
            <li key={facility.unit} className="bg-void p-6">
              <p className="mono text-[10px] text-ignition">{facility.unit}</p>
              <p className="display-soft mt-2 text-[22px] text-bone">{facility.title}</p>
              <p className="mt-2 text-[15px] text-ash">{facility.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function AboutPage() {
  return (
    <>
      <PageHero
        index="05"
        label="Company"
        lines={['Precision,', `*since ${BRAND.founded}.*`]}
        intro={
          <>
            <p>{ABOUT.intro}</p>
            <p className="mt-4">{ABOUT.depth}</p>
          </>
        }
        aside={
          <MetaList
            items={[
              { label: 'Established', value: String(BRAND.founded) },
              { label: 'Facilities', value: `${BRAND.facilities}+` },
              { label: 'Certified', value: 'ISO 9001:2015' },
            ]}
          />
        }
      />
      <VisionMission />
      <Facilities />
      <Crew index="05.4" />
      <section className="page-x" aria-label="Credentials">
        <ul className="flex flex-wrap gap-px bg-bone/10">
          {BRAND.certifications.map((item) => (
            <li key={item} className="mono flex-1 basis-48 bg-hull px-6 py-8 text-center text-[11px] text-bone">
              {item}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
