/**
 * Write text into an element from a render loop without replacing the text node React owns,
 * so later React updates to the same element still land on screen.
 */
export function setText(element: HTMLElement | null, value: string) {
  if (!element) return
  const node = element.firstChild
  if (node instanceof Text) node.nodeValue = value
  else element.textContent = value
}
