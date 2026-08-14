import { useEffect, useState } from 'react'

export type Theme = 'dark' | 'light'
type Preferenza = 'system' | Theme

function leggiPreferenzaSalvata(): Preferenza {
  try {
    const salvata = localStorage.getItem('theme')
    return salvata === 'light' || salvata === 'dark' ? salvata : 'system'
  } catch {
    return 'system'
  }
}

function sistemaPreferisceScuro(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
}

/**
 * Di default il tema segue il sistema operativo (nessuna preferenza salvata) e si aggiorna
 * dal vivo se l'utente cambia tema di sistema mentre la pagina è aperta. Il pulsante in
 * header imposta una preferenza esplicita che vince sempre sul sistema, e viene ricordata
 * per le visite successive.
 */
export function useTheme() {
  const [preferenza, setPreferenza] = useState<Preferenza>(leggiPreferenzaSalvata)
  const [scuroDiSistema, setScuroDiSistema] = useState(sistemaPreferisceScuro)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const aggiorna = (e: MediaQueryListEvent) => setScuroDiSistema(e.matches)
    media.addEventListener('change', aggiorna)
    return () => media.removeEventListener('change', aggiorna)
  }, [])

  useEffect(() => {
    if (preferenza === 'system') {
      document.documentElement.removeAttribute('data-theme')
      try {
        localStorage.removeItem('theme')
      } catch {
        // storage non disponibile (es. navigazione privata): non c'è nulla da pulire
      }
      return
    }

    document.documentElement.setAttribute('data-theme', preferenza)
    try {
      localStorage.setItem('theme', preferenza)
    } catch {
      // storage non disponibile: la scelta esplicita resta valida solo per la sessione
    }
  }, [preferenza])

  const theme: Theme = preferenza === 'system' ? (scuroDiSistema ? 'dark' : 'light') : preferenza
  const toggle = () => setPreferenza(theme === 'dark' ? 'light' : 'dark')

  return { theme, toggle }
}
