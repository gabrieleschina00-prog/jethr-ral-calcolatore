import { useEffect, useRef, useState } from 'react'
import { formatMigliaia, parseImportoDigitato } from '../format'
import type { Translations } from '../i18n/translations'
import './CompareRal.css'

interface CompareRalProps {
  value: number | null
  onChange: (value: number | null) => void
  baseRal: number
  t: Translations['compare']
}

const STEP = 500
const BUMP_INIZIALE = 3_000

/** Attivo/disattivo: finché il confronto non è stato aperto, in UI c'è solo un pulsante
 * "Confronta con...". Una volta aperto, il campo si aggiorna live a ogni carattere digitato
 * (stesso pattern di SalaryInput), più due pulsanti +/-500€ per non dover scrivere a mano. */
export function CompareRal({ value, onChange, baseRal, t }: CompareRalProps) {
  const attivo = value !== null
  const [testo, setTesto] = useState(() => formatMigliaia(value ?? baseRal))
  const focusedRef = useRef(false)

  useEffect(() => {
    if (!focusedRef.current) setTesto(formatMigliaia(value ?? baseRal))
  }, [value, baseRal])

  if (!attivo) {
    return (
      <button
        type="button"
        className="compare-ral__cta"
        onClick={() => onChange(Math.round((baseRal + BUMP_INIZIALE) / 100) * 100)}
      >
        {t.cta}
      </button>
    )
  }

  const handleTextChange = (raw: string) => {
    setTesto(raw)
    onChange(parseImportoDigitato(raw))
  }

  const handleBlur = () => {
    focusedRef.current = false
    setTesto(formatMigliaia(value))
  }

  const step = (delta: number) => onChange(Math.max(0, value + delta))

  return (
    <div className="compare-ral">
      <span className="compare-ral__label">{t.label}</span>
      <div className="compare-ral__field">
        <button type="button" className="compare-ral__step" onClick={() => step(-STEP)} aria-label={t.stepDown}>
          −
        </button>

        <div className="compare-ral__input">
          <span className="compare-ral__symbol" aria-hidden="true">
            €
          </span>
          <input
            className="compare-ral__number"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={testo}
            onFocus={() => {
              focusedRef.current = true
            }}
            onChange={(e) => handleTextChange(e.target.value)}
            onBlur={handleBlur}
          />
        </div>

        <button type="button" className="compare-ral__step" onClick={() => step(STEP)} aria-label={t.stepUp}>
          +
        </button>

        <button type="button" className="compare-ral__remove" onClick={() => onChange(null)} aria-label={t.remove} title={t.remove}>
          ✕
        </button>
      </div>
    </div>
  )
}
