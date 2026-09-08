import type { ReactNode } from 'react'
import './IconLinkButton.css'

interface IconLinkButtonProps {
  href: string
  label: string
  children: ReactNode
}

/** Pulsante circolare che apre un link esterno (LinkedIn, portfolio) in una nuova scheda —
 * stessa forma/dimensione di ThemeToggle e LanguageToggle, per restare coerente in header. */
export function IconLinkButton({ href, label, children }: IconLinkButtonProps) {
  return (
    <a className="icon-link-button" href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
      <span aria-hidden="true">{children}</span>
    </a>
  )
}
