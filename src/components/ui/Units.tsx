const UNIT = /(kN|Hz|km|bar|\bN\b)/

/** Renders measurement strings inside uppercase styles without turning "kN" into "KN". */
export function Units({ text }: { text: string }) {
  return (
    <>
      {text.split(UNIT).map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="normal-case">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  )
}
