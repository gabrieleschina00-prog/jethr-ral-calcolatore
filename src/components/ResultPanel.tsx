import { formatEuro, formatEuroConSegno, formatPercentualeConSegno } from '../format'
import type { Translations } from '../i18n/translations'
import type { CalculationResult } from '../types'
import { CountUpNumber } from './CountUpNumber'
import './ResultPanel.css'

interface ResultPanelProps {
  result: CalculationResult
  compareResult?: CalculationResult | null
  t: Translations['result']
  compareT: Translations['compare']
}

interface MetricRowProps {
  label: string
  value: number
  compareValue?: number
  deltaLabel: (diff: string, pct: string) => string
}

function MetricRow({ label, value, compareValue, deltaLabel }: MetricRowProps) {
  const isComparing = compareValue !== undefined
  const delta = isComparing ? compareValue - value : 0
  const pct = isComparing && value !== 0 ? (delta / value) * 100 : 0
  // Stessa dimensione per entrambi i numeri: a distinguerli è solo il colore, applicato a
  // qualunque dei due risulti maggiore (non fisso su "attuale" o "confronto").
  const valueIsHigher = isComparing && value > compareValue
  const compareIsHigher = isComparing && compareValue > value

  return (
    <div className="result-panel__metric">
      <span className="result-panel__metric-label">{label}</span>
      <div className={`result-panel__hero${isComparing ? ' result-panel__hero--compare' : ''}`} aria-live="polite">
        <CountUpNumber
          value={value}
          format={formatEuro}
          durationMs={450}
          className={`result-panel__value${compareIsHigher ? ' result-panel__value--lower' : valueIsHigher ? ' result-panel__value--higher' : ''}`}
        />
        {isComparing && (
          <>
            <span className="result-panel__arrow" aria-hidden="true">
              →
            </span>
            <CountUpNumber
              value={compareValue}
              format={formatEuro}
              durationMs={450}
              className={`result-panel__value${valueIsHigher ? ' result-panel__value--lower' : compareIsHigher ? ' result-panel__value--higher' : ''}`}
            />
          </>
        )}
      </div>
      {isComparing && (
        <p className={`result-panel__delta result-panel__delta--${delta >= 0 ? 'up' : 'down'}`}>
          {deltaLabel(formatEuroConSegno(delta), formatPercentualeConSegno(pct))}
        </p>
      )}
    </div>
  )
}

/** I due numeri, sempre entrambi visibili, sempre live e alla stessa dimensione: niente
 * gerarchia primario/secondario, niente toggle da premere per passare da uno all'altro.
 * Quando è attivo un confronto, ogni metrica mostra "valore attuale → valore di confronto"
 * più il delta assoluto e percentuale sotto. */
export function ResultPanel({ result, compareResult, t, compareT }: ResultPanelProps) {
  return (
    <div className={`result-panel${compareResult ? ' result-panel--comparing' : ''}`}>
      <MetricRow
        label={t.monthly}
        value={result.nettoMensile}
        compareValue={compareResult?.nettoMensile}
        deltaLabel={compareT.delta}
      />

      <div className="result-panel__divider" aria-hidden="true" />

      <MetricRow
        label={t.yearly}
        value={result.nettoAnnuo}
        compareValue={compareResult?.nettoAnnuo}
        deltaLabel={compareT.delta}
      />

      <p className="result-panel__footnote">{t.footnote(result.mensilita)}</p>
    </div>
  )
}
