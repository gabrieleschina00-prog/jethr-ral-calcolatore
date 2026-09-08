import './ExploreButton.css'

interface ExploreButtonProps {
  targetId: string
  label: string
  /** Su mobile ci si ferma un po' più in alto: si scrolla qui invece che su `targetId`, così
   * il netto resta in cima allo schermo con il breakdown che parte subito sotto. */
  mobileTargetId?: string
}

/** Scrolla fino al percorso di calcolo dettagliato. Il numero in ResultPanel è già live:
 * questo pulsante non "calcola" più nulla, serve solo a portare l'utente al dettaglio. */
export function ExploreButton({ targetId, label, mobileTargetId }: ExploreButtonProps) {
  const handleClick = () => {
    const id =
      mobileTargetId && window.matchMedia('(max-width: 860px)').matches ? mobileTargetId : targetId
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <button type="button" className="explore-button" onClick={handleClick}>
      {label}
    </button>
  )
}
