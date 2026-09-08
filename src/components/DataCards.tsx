import { INPS_ALIQUOTA_DIPENDENTE, SCAGLIONI_IRPEF } from '../calculation/constants'
import { formatAliquota, formatEuro } from '../format'
import type { Translations } from '../i18n/translations'
import './DataCards.css'

interface DataCardsProps {
  t: Translations['dataCards']
  bracketsT: Translations['waterfall']['brackets']
}

/** Le card con i numeri "di legge" alla base del calcolo — lette direttamente dalle
 * costanti fiscali (constants.ts), mai duplicate a mano, così restano sempre coerenti
 * col motore di calcolo anche se le aliquote cambiassero in futuro. */
export function DataCards({ t, bracketsT }: DataCardsProps) {
  let sogliaPrecedente = 0

  return (
    <div className="data-cards">
      <span className="data-cards__title">{t.title}</span>
      <div className="data-cards__grid">
        {SCAGLIONI_IRPEF.map((scaglione, i) => {
          const caption =
            scaglione.fino === Infinity
              ? bracketsT.over(formatEuro(sogliaPrecedente))
              : sogliaPrecedente === 0
                ? bracketsT.upTo(formatEuro(scaglione.fino))
                : bracketsT.between(formatEuro(sogliaPrecedente), formatEuro(scaglione.fino))
          sogliaPrecedente = scaglione.fino

          return (
            <div className="data-cards__card" key={i}>
              <span className="data-cards__label">{t.brackets[i]}</span>
              <span className="data-cards__value">{formatAliquota(scaglione.aliquota)}</span>
              <span className="data-cards__caption">{caption}</span>
            </div>
          )
        })}

        <div className="data-cards__card">
          <span className="data-cards__label">{t.inps.label}</span>
          <span className="data-cards__value">{formatAliquota(INPS_ALIQUOTA_DIPENDENTE)}</span>
          <span className="data-cards__caption">{t.inps.caption}</span>
        </div>

        <div className="data-cards__card data-cards__card--wide">
          <span className="data-cards__label">{t.local.label}</span>
          <span className="data-cards__value">{t.local.value}</span>
          <span className="data-cards__caption">{t.local.caption}</span>
        </div>
      </div>
    </div>
  )
}
