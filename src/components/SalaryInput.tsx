import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { formatMigliaia, parseImportoDigitato } from '../format'
import './SalaryInput.css'

interface SalaryInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}

export function SalaryInput({ value, onChange, min = 0, max = 300_000, step = 500 }: SalaryInputProps) {
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
          aria-describedby="ral-hint"
        />
      </div>

      <input
        className="salary-input__slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(Math.max(value, min), max)}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Stipendio lordo annuo, esplorazione rapida"
        style={{ '--_fill': `${((Math.min(Math.max(value, min), max) - min) / (max - min)) * 100}%` } as CSSProperties}
      />
      <div className="salary-input__range-labels" id="ral-hint">
        <span>{formatMigliaia(min)} €</span>
        <span>{formatMigliaia(max)} €</span>
      </div>
    </div>
  )
}
