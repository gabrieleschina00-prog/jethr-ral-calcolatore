import { useState } from 'react'
import { PREZZO_COLAZIONE } from '../calculation/constants'
import { formatMigliaia } from '../format'
import type { Translations } from '../i18n/translations'
import type { CalculationResult } from '../types'
import { SegmentedToggle } from './SegmentedToggle'
import './BreakfastIndex.css'

interface BreakfastIndexProps {
  result: CalculationResult
  compareResult?: CalculationResult | null
  t: Translations['breakfast']
}

type Periodo = 'mese' | 'anno'

/** Il tocco ironico del prototipo: il netto convertito in colazioni al bar (cappuccino +
 * cornetto al banco, ~3€). Chiuso per default: un cerchietto cliccabile che apre a tendina
 * il toggle mese/anno e il numero, invece di occupare spazio in continuazione.
 * Segue la stessa logica del pannello risultati: se il confronto RAL è attivo, mostra anche
 * qui "attuale → confronto". */
export function BreakfastIndex({ result, compareResult, t }: BreakfastIndexProps) {
  const [aperto, setAperto] = useState(false)
  const [periodo, setPeriodo] = useState<Periodo>('mese')

  const netto = periodo === 'mese' ? result.nettoMensile : result.nettoAnnuo
  const colazioni = Math.floor(netto / PREZZO_COLAZIONE)

  const isComparing = compareResult != null
  const nettoConfronto = compareResult ? (periodo === 'mese' ? compareResult.nettoMensile : compareResult.nettoAnnuo) : 0
  const colazioniConfronto = isComparing ? Math.floor(nettoConfronto / PREZZO_COLAZIONE) : 0
  const colazioniIsHigher = isComparing && colazioni > colazioniConfronto
  const confrontoIsHigher = isComparing && colazioniConfronto > colazioni

  return (
    <div className="breakfast-index">
      <button
        type="button"
        className="breakfast-index__toggle"
        onClick={() => setAperto((a) => !a)}
        aria-expanded={aperto}
      >
        <span className="breakfast-index__circle" aria-hidden="true">
          ☕
        </span>
        <span className="breakfast-index__toggle-label">{t.toggleLabel}</span>
      </button>

      <div className={`breakfast-index__panel-wrap${aperto ? ' is-open' : ''}`}>
        <div className="breakfast-index__panel-inner">
          <div className="breakfast-index__panel">
            <SegmentedToggle
              ariaLabel={t.ariaLabel}
              value={periodo}
              onChange={setPeriodo}
              options={[
                { value: 'mese', label: t.month },
                { value: 'anno', label: t.year },
              ]}
            />

            <div className="breakfast-index__result">
              <div className="breakfast-index__count-row">
                <p
                  className={`breakfast-index__count${confrontoIsHigher ? ' breakfast-index__count--lower' : colazioniIsHigher ? ' breakfast-index__count--higher' : ''}`}
                >
                  {formatMigliaia(colazioni)}
                </p>
                {isComparing && (
                  <>
                    <span className="breakfast-index__arrow" aria-hidden="true">
                      →
                    </span>
                    <p
                      className={`breakfast-index__count${colazioniIsHigher ? ' breakfast-index__count--lower' : confrontoIsHigher ? ' breakfast-index__count--higher' : ''}`}
                    >
                      {formatMigliaia(colazioniConfronto)}
                    </p>
                  </>
                )}
              </div>
              <p className="breakfast-index__label">{periodo === 'mese' ? t.perMonth : t.perYear}</p>
            </div>

            <span className="breakfast-index__source">{t.source(`${PREZZO_COLAZIONE.toFixed(2)} €`)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
