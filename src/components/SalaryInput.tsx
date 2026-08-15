import { useEffect, useRef, useState } from 'react'
import { formatMigliaia, parseImportoDigitato } from '../format'
import './SalaryInput.css'

interface SalaryInputProps {
  value: number
  onChange: (value: number) => void
}

export function SalaryInput({ value, onChange }: SalaryInputProps) {
  const [testo, setTesto] = useState(() => formatMigliaia(value))
  const focusedRef = useRef(false)

  // Riflette i cambi di valore arrivati da fuori nel campo testo, ma solo quando
  // l'utente non ci sta digitando dentro.
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
        />
      </div>
    </div>
  )
}
