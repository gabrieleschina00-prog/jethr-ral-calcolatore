import type { CalculationResult } from '../types'
import { formatEuro } from '../format'
import { CountUpNumber } from './CountUpNumber'
import './ResultPanel.css'

interface ResultPanelProps {
  result: CalculationResult
}

/** I due numeri, sempre entrambi visibili, sempre live e alla stessa dimensione: niente
 * gerarchia primario/secondario, niente toggle da premere per passare da uno all'altro. */
export function ResultPanel({ result }: ResultPanelProps) {
  return (
    <div className="result-panel">
      <div className="result-panel__metric">
        <span className="result-panel__metric-label">Netto mensile</span>
        <div className="result-panel__hero" aria-live="polite">
          <CountUpNumber value={result.nettoMensile} format={formatEuro} durationMs={450} className="result-panel__value" />
        </div>
      </div>

      <div className="result-panel__divider" aria-hidden="true" />

      <div className="result-panel__metric">
        <span className="result-panel__metric-label">Netto annuo</span>
        <div className="result-panel__hero" aria-live="polite">
          <CountUpNumber value={result.nettoAnnuo} format={formatEuro} durationMs={450} className="result-panel__value" />
        </div>
      </div>

      <p className="result-panel__footnote">su {result.mensilita} mensilità</p>
    </div>
  )
}
