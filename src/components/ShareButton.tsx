import { useState } from 'react'
import type { Mensilita } from '../calculation/constants'
import type { Translations } from '../i18n/translations'
import './ShareButton.css'

interface ShareButtonProps {
  ral: number
  mensilita: Mensilita
  ralConfronto: number | null
  t: Translations['share']
  className?: string
}

/** L'icona standard "condividi" (tre nodi collegati), non un'emoji — così si legge subito
 * come azione di condivisione invece che come un link/graffetta. */
function IconaCondividi() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="18" cy="5" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="6" cy="12" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="18" cy="19" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <line x1="8.3" y1="10.7" x2="15.7" y2="6.3" stroke="currentColor" strokeWidth="1.8" />
      <line x1="8.3" y1="13.3" x2="15.7" y2="17.7" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function costruisciLink(ral: number, mensilita: Mensilita, ralConfronto: number | null): string {
  const parametri = new URLSearchParams()
  parametri.set('ral', String(Math.round(ral)))
  parametri.set('m', String(mensilita))
  if (ralConfronto !== null) parametri.set('compare', String(Math.round(ralConfronto)))
  return `${window.location.origin}${window.location.pathname}?${parametri.toString()}`
}

/** Copia un link che porta RAL, mensilità e l'eventuale confronto: aprendolo si ricrea la
 * stessa simulazione (vedi la lettura dei parametri in App.tsx). Il feedback "copiato" è
 * temporaneo e non richiede uno stato persistito da nessuna parte. */
export function ShareButton({ ral, mensilita, ralConfronto, t, className }: ShareButtonProps) {
  const [copiato, setCopiato] = useState(false)

  const handleClick = async () => {
    const link = costruisciLink(ral, mensilita, ralConfronto)
    try {
      await navigator.clipboard.writeText(link)
    } catch {
      window.prompt(t.ariaLabel, link)
      return
    }
    setCopiato(true)
    window.setTimeout(() => setCopiato(false), 1800)
  }

  return (
    <button
      type="button"
      className={`share-button${className ? ` ${className}` : ''}`}
      onClick={handleClick}
      aria-label={t.ariaLabel}
      title={t.ariaLabel}
    >
      <span aria-hidden="true">{copiato ? '✓' : <IconaCondividi />}</span>
      {copiato && (
        <span className="share-button__toast" role="status">
          {t.copiedLabel}
        </span>
      )}
    </button>
  )
}
