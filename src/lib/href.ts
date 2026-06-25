/**
 * Make an internal link respect Astro's configured `base`.
 *
 * When the site is served from a sub-path (e.g. GitHub Pages at
 * /knotless-website/), root-relative links like "/about" must become
 * "/knotless-website/about". This prefixes the base for internal paths and
 * leaves external links, mailto:, and bare #anchors untouched.
 *
 * `import.meta.env.BASE_URL` is injected by Astro/Vite at build time and always
 * ends with a trailing slash ("/" when no base is set).
 */
export function href(path: string): string {
  // Only rewrite root-relative internal paths.
  if (!path.startsWith('/')) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, ''); // "" or "/knotless-website"
  return base + path;
}
