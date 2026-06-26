/**
 * Make an internal link respect Astro's configured `base` and resolve cleanly
 * on GitHub Pages.
 *
 * When the site is served from a sub-path (e.g. GitHub Pages at
 * /knotless-website/), root-relative links like "/about" must become
 * "/knotless-website/about/". This prefixes the base for internal paths and
 * leaves external links, mailto:, and bare #anchors untouched.
 *
 * Route links get a TRAILING SLASH so they point straight at Astro's directory
 * output (/what-we-do/index.html) instead of relying on a GitHub Pages 301
 * redirect from /what-we-do → /what-we-do/. Files (anything with an extension,
 * e.g. /og-default.png) are left exactly as-is.
 *
 * `import.meta.env.BASE_URL` is injected by Astro/Vite at build time and always
 * ends with a trailing slash ("/" when no base is set).
 */
export function href(path: string): string {
  // Only rewrite root-relative internal paths.
  if (!path.startsWith('/')) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, ''); // "" or "/knotless-website"
  // Files (with an extension) are served verbatim — never add a trailing slash.
  if (/\.[^/]+$/.test(path)) return base + path;
  // Routes: normalise to exactly one trailing slash ("/" stays the root).
  return base + path.replace(/\/+$/, '') + '/';
}
