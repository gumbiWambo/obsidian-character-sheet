export function svgFromString(content: string): HTMLElement {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "image/svg+xml")
  return doc.documentElement
}