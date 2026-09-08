import './ExploreButton.css'

interface ExploreButtonProps {
  targetId: string
  label: string
}

/** Scrolla fino al percorso di calcolo dettagliato. Il numero in ResultPanel è già live:
 * questo pulsante non "calcola" più nulla, serve solo a portare l'utente al dettaglio. */
export function ExploreButton({ targetId, label }: ExploreButtonProps) {
  const handleClick = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <button type="button" className="explore-button" onClick={handleClick}>
      {label}
    </button>
  )
}
