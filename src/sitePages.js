const ENTRY_PAGE_IN_PATH = /\/(?:index|breakfast|legal)\.html(?:\/|$)/i

export function sitePageUrl(pageName, pathname = globalThis.location?.pathname ?? '/') {
  if (!/^[a-z0-9-]+\.html$/i.test(pageName)) {
    throw new TypeError('Page name must be a local HTML entry file')
  }

  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  const entryPage = normalizedPath.match(ENTRY_PAGE_IN_PATH)

  if (entryPage) {
    const siteDirectory = normalizedPath.slice(0, entryPage.index + 1)
    return `${siteDirectory}${pageName}`
  }

  const siteDirectory = normalizedPath.endsWith('/') ? normalizedPath : `${normalizedPath}/`
  return `${siteDirectory}${pageName}`
}
