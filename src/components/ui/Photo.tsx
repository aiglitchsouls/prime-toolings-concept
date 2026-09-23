import { photoUrl, STUDIO_SHOTS, type PhotoKey } from '@/data/media'
import { cn } from '@/lib/utils'

interface PhotoProps {
  photo: PhotoKey
  alt: string
  width: number
  height: number
  className?: string
  imgClassName?: string
  /** Duotone until hovered; ties the client's phone photos into one look. */
  isToned?: boolean
  isEager?: boolean
}

export function Photo({ photo, alt, width, height, className, imgClassName, isToned, isEager }: PhotoProps) {
  const isStudio = STUDIO_SHOTS.has(photo)
  const shouldTone = isToned ?? !isStudio
  return (
    <div className={cn(shouldTone && 'duotone', 'overflow-hidden bg-hull', className)}>
      <img
        src={photoUrl(photo, width, height)}
        srcSet={`${photoUrl(photo, width, height)} 1x, ${photoUrl(photo, width * 2, height * 2)} 2x`}
        alt={alt}
        width={width}
        height={height}
        loading={isEager ? 'eager' : 'lazy'}
        decoding="async"
        referrerPolicy="no-referrer"
        className={cn('h-full w-full object-cover', isStudio && !shouldTone && 'grayscale-[0.35]', imgClassName)}
      />
    </div>
  )
}
