import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { formatMigliaia, parseImportoDigitato } from '../format'
import './SalaryInput.css'

interface SalaryInputProps {
  value: number
  onChange: (value: number) => void
}

const SLIDER_MIN = 0
const SLIDER_MAX = 300_000
const FASCIA_PRECISA_MIN = 15_000
const FASCIA_PRECISA_MAX = 150_000
const POSIZIONE_MAX = 1000
const POSIZIONE_FASCIA_MIN = 150
const POSIZIONE_FASCIA_MAX = 850

/** Mappa RAL <-> posizione slider (0-1000) in tre tratti: agli estremi (sotto 15k, sopra
 * 150k) pochi passi coprono molti euro, nella fascia 15-150k — dove ricade la maggior parte
 * degli stipendi — lo stesso spazio è molto più fine, per un trascinamento preciso. */
function valoreAPosizione(valore: number): number {
  if (valore <= FASCIA_PRECISA_MIN) return (valore / FASCIA_PRECISA_MIN) * POSIZIONE_FASCIA_MIN
  if (valore <= FASCIA_PRECISA_MAX) {
    const proporzione = (valore - FASCIA_PRECISA_MIN) / (FASCIA_PRECISA_MAX - FASCIA_PRECISA_MIN)
    return POSIZIONE_FASCIA_MIN + proporzione * (POSIZIONE_FASCIA_MAX - POSIZIONE_FASCIA_MIN)
  }
  const proporzione = (valore - FASCIA_PRECISA_MAX) / (SLIDER_MAX - FASCIA_PRECISA_MAX)
  return POSIZIONE_FASCIA_MAX + proporzione * (POSIZIONE_MAX - POSIZIONE_FASCIA_MAX)
}

function posizioneAValore(posizione: number): number {
  if (posizione <= POSIZIONE_FASCIA_MIN) return (posizione / POSIZIONE_FASCIA_MIN) * FASCIA_PRECISA_MIN
  if (posizione <= POSIZIONE_FASCIA_MAX) {
    const proporzione = (posizione - POSIZIONE_FASCIA_MIN) / (POSIZIONE_FASCIA_MAX - POSIZIONE_FASCIA_MIN)
    return FASCIA_PRECISA_MIN + proporzione * (FASCIA_PRECISA_MAX - FASCIA_PRECISA_MIN)
  }
  const proporzione = (posizione - POSIZIONE_FASCIA_MAX) / (POSIZIONE_MAX - POSIZIONE_FASCIA_MAX)
  return FASCIA_PRECISA_MAX + proporzione * (SLIDER_MAX - FASCIA_PRECISA_MAX)
}

export function SalaryInput({ value, onChange }: SalaryInputProps) {
  const [testo, setTesto] = useState(() => formatMigliaia(value))
  const focusedRef = useRef(false)

  // Riflette i cambi di valore arrivati dallo slider (o da fuori) nel campo testo,
  // ma solo quando l'utente non ci sta digitando dentro.
  useEffect(() => {
    if (!focusedRef.current) setTesto(formatMigliaia(value))
  }, [value])

  const handleTextChange = (raw: string) => {
    setTesto(raw)
    onChange(parseImportoDigitato(raw))
  }

  const handleBlur = () => {
    focusedRef.current = false
    setTesto(formatMigliaia(value))
  }

  const posizione = valoreAPosizione(Math.min(Math.max(value, SLIDER_MIN), SLIDER_MAX))

  return (
    <div className="salary-input">
      <label className="salary-input__label" htmlFor="ral-field">
        Stipendio lordo annuo (RAL)
      </label>

      <div className="salary-input__field">
        <span className="salary-input__symbol" aria-hidden="true">
          €
        </span>
        <input
          id="ral-field"
          className="salary-input__number"
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

      <input
        className="salary-input__slider"
        type="range"
        min={0}
        max={POSIZIONE_MAX}
        step={1}
        value={posizione}
        onChange={(e) => onChange(Math.round(posizioneAValore(Number(e.target.value)) / 100) * 100)}
        aria-label="Stipendio lordo annuo, esplorazione rapida"
        style={{ '--_fill': `${(posizione / POSIZIONE_MAX) * 100}%` } as CSSProperties}
      />
    </div>
  )
}
