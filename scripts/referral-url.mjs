export function createReferralUrl(baseUrl, slug) {
  const url = new URL(baseUrl)

  // GitHub Pages treats `page.html/` as a directory and returns its 404 page.
  url.pathname = url.pathname.replace(/(\.html)\/+$/i, '$1')
  url.hash = ''
  url.searchParams.set('ref', slug)

  return url.toString()
}
