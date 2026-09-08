import { useEffect } from 'react'

/**
 * Rivela in dissolvenza + salita gli elementi marcati `data-reveal` quando entrano
 * nel viewport (o subito, al caricamento, se già visibili) e sfalsa in ingresso i
 * figli di un contenitore `data-reveal-stagger`. Un solo IntersectionObserver per
 * tutta la pagina, zero librerie. Con `prefers-reduced-motion` tutto resta fermo e
 * l'osservatore non parte nemmeno — la classe che spegne l'effetto viene messa a
 * mano su ogni elemento.
 */
export function useReveal(): void {
  useEffect(() => {
    const bersagli = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-stagger]'),
    )
    if (bersagli.length === 0) return

    const ridottoMovimento = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (ridottoMovimento) {
      bersagli.forEach((el) => el.classList.add('is-revealed'))
      return
    }

    const osservatore = new IntersectionObserver(
      (voci) => {
        voci
          .filter((voce) => voce.isIntersecting)
          .forEach((voce, i) => {
            const el = voce.target as HTMLElement
            // Sfalsa solo i blocchi entrati nello stesso "lotto" (di norma quelli già
            // visibili al load): un pannello raggiunto scrollando entra da solo, senza ritardo.
            if (el.hasAttribute('data-reveal')) el.style.transitionDelay = `${i * 60}ms`
            el.classList.add('is-revealed')
            osservatore.unobserve(el)
          })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )

    bersagli.forEach((el) => osservatore.observe(el))
    return () => osservatore.disconnect()
  }, [])
}
