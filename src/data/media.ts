// Client photos, served straight from the live site's image CDN (Hostinger/Zyro, Cloudflare resizing).
// Concept-only shortcut: before launch, pull these into public/images and self-host them.

const CDN = 'https://assets.zyrosite.com/cdn-cgi/image'
const BUCKET = 'XSgOSVIgYj01f0yC'

export const PHOTOS = {
  aerospikePoster: '24645006-98a6-4b3b-8e97-8ef53006e8c4-C8q2BrYhT30NlFPc.jpg',
  testRigPoster: '0d309e96-1047-4425-8f9e-83f0f5c37f16-s7XatdY08SUBOjks.jpg',
  twinFire: '19-13Bh2LdbZvPhJIHA.png',
  standTeam: 'fb9a7df1-f9c5-4273-8c66-41c319453c77-ak3DRkERQ2kfGSVp.jpg',
  liquidAssembly: 'ac5829bf-ec29-472e-9983-3056f8444e9a-mvl1pJPGlOsezc2t.jpg',
  rocketAssembly: '75ceb8c4-86d3-4a36-a84b-8af34ac381a9-iDwjr8C0KKaDIi4I.jpg',
  productBoard: 'company-brochure---prime-toolings-15-JB9ywGGnk48Er5IL.png',
  facilityBoard: 'nikhil-n-gangamkote---prime-toolings-1-fwTD1k2vYoobygDO.png',
  nightFire: '163b9ff1-ef1f-4210-b623-ad67bfafe093-Dqt7GtDFo03KTT7w.jpg',
  whitePlume: '4-Ks2RTqgb8QDdPAsV.png',
  redStand: 'ee1aa2a5-4b56-4903-876a-69f5922921e1-jg4XGH4SI3uAK2GG.jpg',
  injectorBatch: '3-cmThMapRBh7z4tgk.png',
  verticalFire: '1-DpulHDJdAn7DGQC2.png',
  rigMono: '52fbb9b7-870c-4dd4-801c-29437bf3cc91-JIqh7uwQTqHBAVww.jpg',
  rigCloseup: 'b75cbc13-0e0c-49db-9271-eca3b2f6e39c-dvnVLmvDhbiqHzup.jpg',
  orangePlume: '70c1f923-3bbe-4cb9-a2a6-d1403e4c7a81-PMBoGbnPPAUUXSMK.jpg',
  aerospikeHardware: '22-ThjMfpH3CXb1Y6AW.png',
  horizontalFire: 'bed07e51-365a-4ed3-856c-dfe281116a27-4uNvlLDa0dfADlNt.jpg',
  dualBooster: 'company-brochure---prime-toolings-2-Jur0YcIBIkfTnWf1.png',
  blueQuad: '18-Kga1DuUY3c0wFfwv.png',
  whiteFlash: '13d57b31-1cc4-4965-93c0-d092e924e4ac-uRsTYE58bx4inSn2.jpg',
  darkFire: 'b232b9e8-72ea-4681-a859-34cc008e14fa-qYk63NOVY7DJubq3.jpg',
  hybridTube: '5-fYsFnYNFrvBmgV6G.png',
  sparkFire: '6-LeQTQCAbOOUQsmqC.png',
  sparkFireTwo: '12-VTfwnawUp5WrzC3k.png',
  uavRato: '11-AWZdzrnORUeAX8qX.png',
  combustorParts: '27-1Hps1qEBKyx4lGlu.png',
  injectorParts: '14-gg2neLTq8HN0m3c3.png',
} as const

export type PhotoKey = keyof typeof PHOTOS

/** Product shots on white backgrounds: shown as neutral studio plates, never duotoned. */
export const STUDIO_SHOTS: ReadonlySet<PhotoKey> = new Set(['aerospikeHardware', 'combustorParts', 'injectorParts', 'hybridTube'])

export function photoUrl(key: PhotoKey, width: number, height?: number) {
  const size = height ? `w=${width},h=${height},fit=crop` : `w=${width}`
  return `${CDN}/format=auto,${size}/${BUCKET}/${PHOTOS[key]}`
}
