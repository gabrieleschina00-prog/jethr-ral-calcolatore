import { useState } from 'react'
import type { CalculationResult, CalculationStep } from '../types'
import { formatEuro, formatEuroDecimale } from '../format'
import './WaterfallChart.css'

interface WaterfallChartProps {
  result: CalculationResult
}

interface Riga {
  step: CalculationStep
  isTotale: boolean
  leftPct: number
  widthPct: number
  direzione: 'aumento' | 'diminuzione' | 'totale'
}

interface Dettaglio {
  label: string
  valore: string
}

interface Info {
  descrizione: string
  dettagli?: Dettaglio[]
}

const DIREZIONE_PER_KIND: Record<CalculationStep['kind'], Riga['direzione']> = {
  totale: 'totale',
  trattenuta: 'diminuzione',
  sgravio: 'aumento',
}

function costruisciRighe(steps: CalculationStep[]): Riga[] {
  const max = steps[0]?.runningTotal || 1
  let precedente = 0

  return steps.map((step, i) => {
    const isTotale = i === 0 || i === steps.length - 1
    const from = isTotale ? 0 : precedente
    const to = step.runningTotal
    const riga: Riga = {
      step,
      isTotale,
      leftPct: (Math.min(from, to) / max) * 100,
      widthPct: (Math.max(0.6, Math.abs(to - from)) / max) * 100,
      direzione: DIREZIONE_PER_KIND[step.kind],
    }
    precedente = step.runningTotal
    return riga
  })
}

/** Spiegazioni per ogni riga del waterfall. Le voci che nel motore di calcolo sono
 * "interne" all'IRPEF netta (IRPEF lorda, detrazioni) o successive al netto annuo (netto
 * mensile) non hanno una barra propria: compaiono come dettaglio dentro il tooltip della
 * riga a cui appartengono, invece che come righe separate — un solo posto dove guardare. */
function costruisciInfo(r: CalculationResult): Record<string, Info> {
  return {
    ral: { descrizione: 'Retribuzione annua lorda, il punto di partenza di tutto il calcolo.' },
    inps: {
      descrizione: 'INPS (9,19%): la quota di contributi previdenziali a carico del lavoratore, versata al fondo pensione.',
      dettagli: [{ label: 'Imponibile fiscale', valore: formatEuroDecimale(r.imponibileFiscale) }],
    },
    irpef: {
      descrizione: 'IRPEF lorda (scaglioni 23% / 33% / 43% sull’imponibile fiscale) meno le detrazioni spettanti.',
      dettagli: [
        { label: 'IRPEF lorda', valore: formatEuroDecimale(r.irpefLorda) },
        { label: 'Detrazione lavoro dipendente', valore: `− ${formatEuroDecimale(r.detrazioneLavoroDipendente)}` },
        { label: 'Ulteriore detrazione (cuneo fiscale)', valore: `− ${formatEuroDecimale(r.ulterioreDetrazione)}` },
      ],
    },
    addizionaleRegionale: {
      descrizione: 'Scaglioni 1,23% – 1,73% sull’imponibile fiscale, incassati dalla Regione Lombardia.',
    },
    addizionaleComunale: {
      descrizione: '0,80% sull’intero imponibile se supera 23.000€ (non solo sull’eccedenza); zero sotto soglia.',
    },
    cuneoFiscale: {
      descrizione: 'Solo per redditi fino a 20.000€: un importo non imponibile aggiunto direttamente al netto.',
    },
    netto: {
      descrizione: 'RAL meno tutte le trattenute sopra, più l’eventuale sgravio: quanto resta in tasca in un anno.',
      dettagli: [{ label: `Netto mensile (÷ ${r.mensilita})`, valore: formatEuroDecimale(r.nettoMensile) }],
    },
  }
}

export function WaterfallChart({ result }: WaterfallChartProps) {
  const [attiva, setAttiva] = useState<string | null>(null)
  const righe = costruisciRighe(result.steps)
  const info = costruisciInfo(result)

  return (
    <div className="waterfall">
      <div className="waterfall__legend" aria-hidden="true">
        <span className="waterfall__legend-item">
          <i className="waterfall__dot waterfall__dot--totale" /> RAL e netto
        </span>
        <span className="waterfall__legend-item">
          <i className="waterfall__dot waterfall__dot--diminuzione" /> Trattenute
        </span>
        <span className="waterfall__legend-item">
          <i className="waterfall__dot waterfall__dot--aumento" /> Sgravi
        </span>
      </div>

      <ol className="waterfall__rows">
        {righe.map((riga) => {
          const id = riga.step.id
          const aperta = attiva === id
          const rigaInfo = info[id]

          return (
            <li
              className={`waterfall__row${aperta ? ' waterfall__row--attiva' : ''}`}
              key={id}
              onMouseEnter={() => setAttiva(id)}
              onMouseLeave={() => setAttiva((cur) => (cur === id ? null : cur))}
            >
              <div className="waterfall__label-group">
                <span className="waterfall__label">{riga.step.label}</span>
                {rigaInfo && (
                  <button
                    type="button"
                    className="waterfall__info-btn"
                    aria-expanded={aperta}
                    aria-label={`Spiegazione: ${riga.step.label}`}
                    onClick={() => setAttiva((cur) => (cur === id ? null : id))}
                    onFocus={() => setAttiva(id)}
                    onBlur={() => setAttiva((cur) => (cur === id ? null : cur))}
                  >
                    i
                  </button>
                )}
              </div>

              <div className="waterfall__track">
                <div
                  className={`waterfall__bar waterfall__bar--${riga.direzione}`}
                  style={{ left: `${riga.leftPct}%`, width: `${riga.widthPct}%` }}
                />
              </div>

              <span className="waterfall__value">
                {riga.isTotale
                  ? formatEuro(riga.step.runningTotal)
                  : `${riga.direzione === 'aumento' ? '+' : '−'} ${formatEuro(Math.abs(riga.step.delta))}`}
              </span>

              {aperta && rigaInfo && (
                <div className="waterfall__tooltip">
                  <p>{rigaInfo.descrizione}</p>
                  {rigaInfo.dettagli && (
                    <ul className="waterfall__tooltip-dettagli">
                      {rigaInfo.dettagli.map((d) => (
                        <li key={d.label}>
                          <span>{d.label}</span>
                          <span>{d.valore}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
