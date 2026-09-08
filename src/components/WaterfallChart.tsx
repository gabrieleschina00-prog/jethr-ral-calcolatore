import { useEffect, useRef, useState } from 'react'
import { SCAGLIONI_ADDIZIONALE_REGIONALE_LOMBARDIA, SCAGLIONI_IRPEF } from '../calculation/constants'
import { formatAliquota, formatEuro, formatEuroDecimale } from '../format'
import type { StepId, Translations } from '../i18n/translations'
import type { CalculationResult, CalculationStep } from '../types'
import './WaterfallChart.css'

interface WaterfallChartProps {
  result: CalculationResult
  t: Translations['waterfall']
}

interface Riga {
  step: CalculationStep
  isTotale: boolean
  isFinale: boolean
  leftPct: number
  widthPct: number
  direzione: 'aumento' | 'diminuzione' | 'totale'
}

interface Dettaglio {
  label: string
  valore: string
}

interface RigaScaglione {
  min: number
  max: number
  aliquota: number
  imposta: number
  illimitato: boolean
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
      isFinale: step.id === 'netto',
      leftPct: (Math.min(from, to) / max) * 100,
      widthPct: (Math.max(0.6, Math.abs(to - from)) / max) * 100,
      direzione: DIREZIONE_PER_KIND[step.kind],
    }
    precedente = step.runningTotal
    return riga
  })
}

/** Scompone una base imponibile sugli stessi scaglioni marginali usati dal motore di
 * calcolo, solo a scopo di presentazione (il motore in calculation/ resta l'unica fonte
 * di verità per i totali: qui si rifà lo stesso conto riga per riga, per mostrarlo). */
function scomponiScaglioni(base: number, scaglioni: readonly { fino: number; aliquota: number }[]): RigaScaglione[] {
  const righe: RigaScaglione[] = []
  let sogliaPrecedente = 0

  for (const { fino, aliquota } of scaglioni) {
    if (base <= sogliaPrecedente) break
    const max = Math.min(base, fino)
    righe.push({ min: sogliaPrecedente, max, aliquota, imposta: (max - sogliaPrecedente) * aliquota, illimitato: fino === Infinity })
    sogliaPrecedente = fino
  }

  return righe
}

function scaglioniPerStep(id: string, r: CalculationResult): RigaScaglione[] | undefined {
  if (id === 'irpef') return scomponiScaglioni(r.imponibileFiscale, SCAGLIONI_IRPEF)
  if (id === 'addizionaleRegionale') return scomponiScaglioni(r.imponibileFiscale, SCAGLIONI_ADDIZIONALE_REGIONALE_LOMBARDIA)
  return undefined
}

function dettagliPerStep(id: string, r: CalculationResult, t: Translations['waterfall']): Dettaglio[] | undefined {
  switch (id) {
    case 'inps':
      return [{ label: t.details.imponibileFiscale, valore: formatEuroDecimale(r.imponibileFiscale) }]
    case 'irpef':
      return [
        { label: t.details.irpefLorda, valore: formatEuroDecimale(r.irpefLorda) },
        { label: t.details.detrazioneLavoroDipendente, valore: `− ${formatEuroDecimale(r.detrazioneLavoroDipendente)}` },
        { label: t.details.ulterioreDetrazione, valore: `− ${formatEuroDecimale(r.ulterioreDetrazione)}` },
      ]
    case 'cuneoFiscale':
      return [{ label: t.details.redditoComplessivo, valore: formatEuroDecimale(r.imponibileFiscale) }]
    case 'netto':
      return [{ label: t.details.nettoMensile(r.mensilita), valore: formatEuroDecimale(r.nettoMensile) }]
    default:
      return undefined
  }
}

function BracketLabel({ riga, t }: { riga: RigaScaglione; t: Translations['waterfall']['brackets'] }) {
  if (riga.illimitato) return <>{t.over(formatEuro(riga.min))}</>
  if (riga.min === 0) return <>{t.upTo(formatEuro(riga.max))}</>
  return <>{t.between(formatEuro(riga.min), formatEuro(riga.max))}</>
}

export function WaterfallChart({ result, t }: WaterfallChartProps) {
  // hoverId guida il tooltip leggero (passaggio del mouse, 1-2 righe). openId guida il
  // popover esteso (click sulla "i"): resta aperto finché non lo si chiude esplicitamente,
  // con un click fuori o Esc — non sparisce quando il mouse si allontana dalla riga.
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const activeTriggerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!openId) return

    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node
      if (popoverRef.current?.contains(target)) return
      if (activeTriggerRef.current?.contains(target)) return
      setOpenId(null)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenId(null)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [openId])

  const righe = costruisciRighe(result.steps)

  return (
    <div className="waterfall">
      <div className="waterfall__legend" aria-hidden="true">
        <span className="waterfall__legend-item">
          <i className="waterfall__dot waterfall__dot--diminuzione" /> {t.legend.deductions}
        </span>
        <span className="waterfall__legend-item">
          <i className="waterfall__dot waterfall__dot--aumento" /> {t.legend.reliefs}
        </span>
      </div>

      <ol className="waterfall__rows">
        {righe.map((riga, i) => {
          const id = riga.step.id
          const stepText = t.steps[id as StepId]
          const isOpen = openId === id
          const showTooltip = hoverId === id && !isOpen
          const dettagli = dettagliPerStep(id, result, t)
          const scaglioni = scaglioniPerStep(id, result)
          // Le ultime righe sono vicine al fondo della card: il popover esteso apre verso
          // l'alto invece che verso il basso, altrimenti finirebbe fuori dalla vista.
          const apriSopra = i >= righe.length - 2

          return (
            <li
              className={`waterfall__row${showTooltip || isOpen ? ' waterfall__row--attiva' : ''}`}
              key={id}
              onMouseEnter={() => setHoverId(id)}
              onMouseLeave={() => setHoverId((cur) => (cur === id ? null : cur))}
            >
              <div className="waterfall__label-group">
                <span className="waterfall__label">{stepText.label}</span>
                <button
                  type="button"
                  className="waterfall__info-btn"
                  aria-expanded={isOpen}
                  aria-label={t.infoAriaLabel(stepText.label)}
                  onClick={(e) => {
                    activeTriggerRef.current = e.currentTarget
                    setOpenId((cur) => (cur === id ? null : id))
                  }}
                  onFocus={() => setHoverId(id)}
                  onBlur={() => setHoverId((cur) => (cur === id ? null : cur))}
                >
                  i
                </button>
              </div>

              <div className="waterfall__track">
                <div
                  className={`waterfall__bar waterfall__bar--${riga.direzione}${riga.isFinale ? ' waterfall__bar--finale' : ''}`}
                  style={{ left: `${riga.leftPct}%`, width: `${riga.widthPct}%` }}
                />
              </div>

              <span className="waterfall__value">
                {riga.isTotale
                  ? formatEuro(riga.step.runningTotal)
                  : `${riga.direzione === 'aumento' ? '+' : '−'} ${formatEuro(Math.abs(riga.step.delta))}`}
              </span>

              {showTooltip && (
                <div className="waterfall__tooltip">
                  <p>{stepText.short}</p>
                </div>
              )}

              {isOpen && (
                <div className={`waterfall__popover${apriSopra ? ' waterfall__popover--above' : ''}`} ref={popoverRef}>
                  <div className="waterfall__popover-header">
                    <span className="waterfall__popover-title">{stepText.label}</span>
                    <button
                      type="button"
                      className="waterfall__popover-close"
                      onClick={() => setOpenId(null)}
                      aria-label={t.closeLabel}
                    >
                      ✕
                    </button>
                  </div>

                  <p className="waterfall__popover-text">{stepText.long}</p>

                  {dettagli && (
                    <ul className="waterfall__popover-dettagli">
                      {dettagli.map((d) => (
                        <li key={d.label}>
                          <span>{d.label}</span>
                          <span>{d.valore}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {scaglioni && scaglioni.length > 0 && (
                    <div className="waterfall__popover-brackets">
                      <span className="waterfall__popover-brackets-title">{t.brackets.title}</span>
                      <ul>
                        {scaglioni.map((s, i) => (
                          <li key={i}>
                            <span>
                              <BracketLabel riga={s} t={t.brackets} /> · {formatAliquota(s.aliquota)}
                            </span>
                            <span>{formatEuroDecimale(s.imposta)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
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
