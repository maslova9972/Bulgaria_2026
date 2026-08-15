import { useEffect, useId, useRef, useState } from 'react'

export default function HeaderNavigation({ links, actionHref, actionLabel, actionShortLabel }) {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const toggleRef = useRef(null)
  const firstLinkRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    document.body.classList.add('menu-open')
    firstLinkRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      window.requestAnimationFrame(() => toggleRef.current?.focus())
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.classList.remove('menu-open')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 981px)')
    const closeOnDesktop = ({ matches }) => {
      if (matches) setOpen(false)
    }

    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [])

  const closeMenu = () => setOpen(false)

  return (
    <>
      <nav className="main-nav" aria-label="Основная навигация">
        {links.map(({ href, label }) => <a href={href} key={href}>{label}</a>)}
      </nav>

      <a className="header-action" href={actionHref}>
        <span className="header-action__full">{actionLabel}</span>
        <span className="header-action__short">{actionShortLabel}</span>
      </a>

      <button
        className={`mobile-menu-toggle${open ? ' is-open' : ''}`}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        ref={toggleRef}
        onClick={() => setOpen((current) => !current)}
      >
        <span>Меню</span>
        <span className="mobile-menu-toggle__icon" aria-hidden="true">
          <i />
          <i />
        </span>
      </button>

      <div className="mobile-menu" id={menuId} hidden={!open}>
        <nav className="mobile-menu__links" aria-label="Мобильная навигация">
          {links.map(({ href, label }, index) => (
            <a href={href} key={href} onClick={closeMenu} ref={index === 0 ? firstLinkRef : undefined}>
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <strong>{label}</strong>
            </a>
          ))}
        </nav>
        <a className="mobile-menu__action" href={actionHref} onClick={closeMenu}>
          {actionLabel}
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </>
  )
}
