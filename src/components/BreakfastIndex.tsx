import { useState } from 'react'
import { PREZZO_COLAZIONE_MILANO } from '../calculation/constants'
import { formatMigliaia } from '../format'
import type { CalculationResult } from '../types'
import { SegmentedToggle } from './SegmentedToggle'
import './BreakfastIndex.css'

interface BreakfastIndexProps {
  result: CalculationResult
}

type Periodo = 'mese' | 'anno'

/** Il tocco ironico del prototipo: il netto convertito in colazioni al bar (cappuccino +
 * cornetto al banco, prezzo medio Milano 2026). Chiuso per default: un cerchietto cliccabile
 * che apre a tendina il toggle mese/anno e il numero, invece di occupare spazio in continuazione. */
export function BreakfastIndex({ result }: BreakfastIndexProps) {
  const [aperto, setAperto] = useState(false)
  const [periodo, setPeriodo] = useState<Periodo>('mese')

  const netto = periodo === 'mese' ? result.nettoMensile : result.nettoAnnuo
  const colazioni = Math.floor(netto / PREZZO_COLAZIONE_MILANO)

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
        <span className="breakfast-index__toggle-label">Colazioni</span>
      </button>

      <div className={`breakfast-index__panel-wrap${aperto ? ' is-open' : ''}`}>
        <div className="breakfast-index__panel-inner">
          <div className="breakfast-index__panel">
            <SegmentedToggle
              ariaLabel="Colazioni al mese o all'anno"
              value={periodo}
              onChange={setPeriodo}
              options={[
                { value: 'mese', label: 'Mese' },
                { value: 'anno', label: 'Anno' },
              ]}
            />

            <div className="breakfast-index__result">
              <p className="breakfast-index__count">{formatMigliaia(colazioni)}</p>
              <p className="breakfast-index__label">al {periodo === 'mese' ? 'mese' : 'anno'}</p>
            </div>

            <span className="breakfast-index__source">
              ~{PREZZO_COLAZIONE_MILANO.toFixed(2)} € a colazione, cornetto e cappuccino, media Milano.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
