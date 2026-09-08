import { useEffect, useState } from 'react'
import { translations, type Lang } from './translations'

function leggiPreferenzaSalvata(): Lang | null {
  try {
    const salvata = localStorage.getItem('lang')
    return salvata === 'it' || salvata === 'en' ? salvata : null
  } catch {
    return null
  }
}

function linguaDiSistema(): Lang {
  const lingue = typeof navigator !== 'undefined' ? navigator.languages ?? [navigator.language] : []
  return lingue.some((l) => l?.toLowerCase().startsWith('it')) ? 'it' : 'en'
}

/** Di default la lingua segue quella del dispositivo (navigator.language), rilevata a ogni
 * avvio: nessuna preferenza viene salvata finché l'utente non ne impone una col pulsante in
 * header. Quella scelta esplicita vince sempre sul rilevamento automatico e viene ricordata
 * per le visite successive — stesso pattern di persistenza già usato da useTheme.ts. */
export function useLanguage() {
  const [lang, setLang] = useState<Lang>(() => leggiPreferenzaSalvata() ?? linguaDiSistema())

  // Riflette la lingua su <html lang> per screen reader e crawler. La scelta NON viene
  // persistita qui: senza una preferenza esplicita, ogni visita riparte dalla lingua di
  // sistema (vedi toggle, che è l'unico punto che scrive su localStorage).
  useEffect(() => {
    document.documentElement.setAttribute('lang', lang)
  }, [lang])

  const toggle = () =>
    setLang((corrente) => {
      const nuova: Lang = corrente === 'it' ? 'en' : 'it'
      try {
        localStorage.setItem('lang', nuova)
      } catch {
        // storage non disponibile: la scelta esplicita resta valida solo per la sessione
      }
      return nuova
    })

  return { lang, t: translations[lang], toggle }
}
